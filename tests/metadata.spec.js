import { expect, test } from '@playwright/test'

test('publishes complete social preview metadata and brand icons', async ({ page, request }) => {
  await page.goto('/')

  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /HTML, CSS, and JavaScript/)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://playground.myztic.dev/')
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg')
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/site.webmanifest')
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'https://playground.myztic.dev/social-preview.png',
  )
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image')

  const [preview, favicon, manifest] = await Promise.all([
    request.get('/social-preview.png'),
    request.get('/favicon.svg'),
    request.get('/site.webmanifest'),
  ])
  expect(preview.ok()).toBe(true)
  expect(preview.headers()['content-type']).toContain('image/png')
  expect(favicon.ok()).toBe(true)
  expect(favicon.headers()['content-type']).toContain('image/svg+xml')
  expect(manifest.ok()).toBe(true)
  expect(manifest.headers()['content-type']).toContain('application/manifest+json')
})
