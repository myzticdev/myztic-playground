import { expect, test } from '@playwright/test'

const previewCsp = "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; media-src data: blob:; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none';"

test('main document has production security headers', async ({ request }) => {
  const response = await request.get('/')
  expect(response.ok()).toBe(true)

  const headers = response.headers()
  expect(headers['content-security-policy']).toContain("script-src 'self'")
  expect(headers['content-security-policy']).not.toContain("script-src 'self' 'unsafe-inline'")
  expect(headers['x-frame-options']).toBe('DENY')
  expect(headers['x-content-type-options']).toBe('nosniff')
  expect(headers['referrer-policy']).toBe('no-referrer')
  expect(headers['permissions-policy']).toBeTruthy()
  expect(headers['strict-transport-security']).toBe('max-age=31536000')
})

test('preview document receives its isolated policy and remains embeddable', async ({ request }) => {
  const response = await request.get('/preview.html')
  expect(response.ok()).toBe(true)

  const headers = response.headers()
  expect(headers['content-security-policy']).toBe(previewCsp)
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
