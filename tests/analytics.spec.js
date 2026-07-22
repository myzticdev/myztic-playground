import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('keeps analytics disabled when build variables are absent', async ({ page }) => {
  await expect(page.locator('script[data-myztic-analytics]')).toHaveCount(0)
})

test('loads validated Umami Cloud configuration for the exact host', async ({ page }) => {
  await page.route('https://cloud.umami.is/script.js', (route) => route.fulfill({
    contentType: 'application/javascript',
    body: 'window.umami = { track() {} };',
  }))

  const result = await page.evaluate(async () => {
    const { initializeAnalytics } = await import('/src/analytics.ts')
    return initializeAnalytics({
      provider: 'umami',
      siteId: '12345678-abcd-1234-abcd-123456789abc',
      scriptUrl: 'https://cloud.umami.is/script.js',
      host: window.location.hostname,
    })
  })

  expect(result).toBe('umami')
  const script = page.locator('script[data-myztic-analytics="umami"]')
  await expect(script).toHaveAttribute('src', 'https://cloud.umami.is/script.js')
  await expect(script).toHaveAttribute('data-website-id', '12345678-abcd-1234-abcd-123456789abc')
  await expect(script).toHaveAttribute('data-domains', '127.0.0.1')
  await expect(script).toHaveAttribute('data-do-not-track', 'true')
})

test('loads a validated Google Analytics measurement ID', async ({ page }) => {
  await page.route('https://www.googletagmanager.com/**', (route) => route.fulfill({
    contentType: 'application/javascript',
    body: '',
  }))

  const result = await page.evaluate(async () => {
    const { initializeAnalytics } = await import('/src/analytics.ts')
    return initializeAnalytics({
      provider: 'google',
      siteId: 'G-ABC123XYZ',
      scriptUrl: '',
      host: window.location.hostname,
    })
  })

  expect(result).toBe('google')
  await expect(page.locator('script[data-myztic-analytics="google"]')).toHaveAttribute(
    'src',
    'https://www.googletagmanager.com/gtag/js?id=G-ABC123XYZ',
  )
  expect(await page.evaluate(() => window.dataLayer?.length)).toBe(2)

  await page.getByRole('button', { name: 'Run' }).click()
  expect(await page.evaluate(() => window.dataLayer?.some(
    (entry) => entry[0] === 'event' && entry[1] === 'run_preview',
  ))).toBe(true)
})

test('rejects mismatched hosts, invalid IDs, and arbitrary Umami script origins', async ({ page }) => {
  const results = await page.evaluate(async () => {
    const { initializeAnalytics } = await import('/src/analytics.ts')
    return [
      initializeAnalytics({ provider: 'google', siteId: 'G-ABC123XYZ', scriptUrl: '', host: 'wrong.example' }),
      initializeAnalytics({ provider: 'google', siteId: 'not-a-google-id', scriptUrl: '', host: window.location.hostname }),
      initializeAnalytics({ provider: 'umami', siteId: '12345678', scriptUrl: 'https://evil.example/script.js', host: window.location.hostname }),
    ]
  })

  expect(results).toEqual(['disabled', 'disabled', 'disabled'])
  await expect(page.locator('script[data-myztic-analytics]')).toHaveCount(0)
})

test('honors the visitor Do Not Track preference', async ({ page }) => {
  const result = await page.evaluate(async () => {
    Object.defineProperty(navigator, 'doNotTrack', { value: '1', configurable: true })
    const { initializeAnalytics } = await import('/src/analytics.ts')
    return initializeAnalytics({
      provider: 'google',
      siteId: 'G-ABC123XYZ',
      scriptUrl: '',
      host: window.location.hostname,
    })
  })

  expect(result).toBe('disabled')
  await expect(page.locator('script[data-myztic-analytics]')).toHaveCount(0)
})
