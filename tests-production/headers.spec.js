import { expect, test } from '@playwright/test'

const previewCsp = "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; media-src data: blob:; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none';"

test('main document has production security headers', async ({ request }) => {
  const response = await request.get('/')
  expect(response.ok()).toBe(true)

  const headers = response.headers()
  expect(headers['content-security-policy']).toContain("script-src 'self'")
  expect(headers['content-security-policy']).not.toContain("script-src 'self' 'unsafe-inline'")
  expect(headers['content-security-policy']).not.toContain('https://cloud.umami.is')
  expect(headers['content-security-policy']).not.toContain('https://www.googletagmanager.com')
  expect(headers['content-security-policy']).not.toContain('analytics.myztic.dev')
  expect(headers['x-frame-options']).toBe('DENY')
  expect(headers['x-content-type-options']).toBe('nosniff')
  expect(headers['referrer-policy']).toBe('no-referrer')
  expect(headers['permissions-policy']).toBeTruthy()
  expect(headers['strict-transport-security']).toBe('max-age=31536000')
})

test('default production build does not load an analytics tracker', async ({ page }) => {
  const analyticsRequests = []
  page.on('request', (request) => {
    if (/cloud\.umami\.is|googletagmanager\.com|google-analytics\.com/i.test(request.url())) {
      analyticsRequests.push(request.url())
    }
  })

  await page.goto('/')

  await expect(page.locator('script[data-myztic-analytics]')).toHaveCount(0)
  expect(analyticsRequests).toEqual([])
})

test('preview document receives its isolated policy and remains embeddable', async ({ request }) => {
  const response = await request.get('/preview.html')
  expect(response.ok()).toBe(true)

  const headers = response.headers()
  expect(headers['content-security-policy']).toBe(previewCsp)
  expect(headers['content-security-policy']).not.toContain('google')
  expect(headers['content-security-policy']).not.toContain('umami')
  expect(headers['x-frame-options']).toBeUndefined()
  expect(headers['x-content-type-options']).toBe('nosniff')
  expect(headers['referrer-policy']).toBe('no-referrer')
  expect(headers['cache-control']).toBe('no-store')
})

test('health check is minimal and does not expose an nginx version', async ({ request }) => {
  const response = await request.get('/healthz')
  expect(response.status()).toBe(200)
  expect(await response.text()).toBe('ok\n')
  expect(response.headers().server ?? '').not.toMatch(/nginx\/\d/i)
})

test('prerendered app route does not redirect away from the mapped port', async ({ request }) => {
  const response = await request.get('/app', { maxRedirects: 0 })

  expect(response.status()).toBe(200)
  expect(response.url()).toBe('http://127.0.0.1:8080/app')
  expect(await response.text()).toContain('<title>HTML, CSS &amp; JavaScript Editor')
})
