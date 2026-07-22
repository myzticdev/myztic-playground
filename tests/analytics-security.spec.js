import { expect, test } from '@playwright/test'
import { buildMainCsp } from '../scripts/analytics-security.mjs'

test('default CSP contains no analytics provider origins', () => {
  const csp = buildMainCsp()
  expect(csp).toContain("script-src 'self';")
  expect(csp).toContain("connect-src 'self';")
  expect(csp).not.toContain('umami')
  expect(csp).not.toContain('google')
})

test('self-hosted Umami CSP derives only the configured HTTPS origin', () => {
  const csp = buildMainCsp({
    provider: 'umami',
    scriptUrl: 'https://analytics.example.com/custom/script.js?key=public',
  })

  expect(csp).toContain("script-src 'self' https://analytics.example.com;")
  expect(csp).toContain("connect-src 'self' https://analytics.example.com;")
  expect(csp).not.toContain('/custom/script.js')
  expect(csp).not.toContain('cloud.umami.is')
})

test('same-origin Umami paths need no additional CSP origin', () => {
  const csp = buildMainCsp({ provider: 'umami', scriptUrl: '/analytics/script.js' })
  expect(csp).toContain("script-src 'self';")
  expect(csp).toContain("connect-src 'self';")
  expect(csp).not.toContain('https://')
})

test('Google CSP includes only the required Google endpoints', () => {
  const csp = buildMainCsp({ provider: 'google' })
  expect(csp).toContain('script-src \'self\' https://www.googletagmanager.com;')
  expect(csp).toContain('https://www.google-analytics.com')
  expect(csp).not.toContain('umami')
})

test('Umami CSP rejects unsafe external tracker URLs', () => {
  expect(() => buildMainCsp({ provider: 'umami', scriptUrl: 'http://analytics.example/script.js' })).toThrow()
  expect(() => buildMainCsp({ provider: 'umami', scriptUrl: 'https://user:pass@analytics.example/script.js' })).toThrow()
})
