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

test('serves crawlable homepage content and discovery files', async ({ page, request }) => {
  const response = await request.get('/')
  const html = await response.text()
  expect(html).toContain('<h1>Free HTML, CSS, and JavaScript Playground</h1>')
  expect(html).toContain('application/ld+json')

  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Free HTML, CSS, and JavaScript Playground')
  await expect(page.getByRole('link', { name: /Start coding for free/ }).first()).toHaveAttribute('href', '/app')

  const [robots, sitemap] = await Promise.all([request.get('/robots.txt'), request.get('/sitemap.xml')])
  expect(await robots.text()).toContain('Sitemap: https://playground.myztic.dev/sitemap.xml')
  expect(await sitemap.text()).toContain('https://playground.myztic.dev/security')
})

test('exposes the requested supporting routes', async ({ page }) => {
  await page.goto('/examples')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Start with something small')
  await expect(page.locator('.example-card')).toHaveCount(6)
  await expect(page.getByRole('link', { name: /Open code in playground/ }).first()).toHaveAttribute('href', '/app?example=gradient-card')

  await page.goto('/app?example=counter')
  await expect(page.getByRole('textbox', { name: 'HTML code' })).toHaveValue(/DAILY MOMENTUM/)
  await expect(page.frameLocator('iframe[title="User code preview"]').locator('#count')).toHaveText('42')

  await page.goto('/security')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Your code stays contained')
  await expect(page.getByText('Opaque-origin iframe')).toBeVisible()

  await page.goto('/app')
  await expect(page.getByRole('button', { name: 'Run' })).toBeVisible()
})

test('publishes GEO guides with route-specific metadata and visible FAQs', async ({ page, request }) => {
  const routes = [
    ['/for-teachers', /for teachers/i],
    ['/learn/html-css-js-playground', /practice HTML, CSS and JavaScript/i],
    ['/export-html-css-js-zip', /export HTML, CSS and JavaScript/i],
    ['/alternatives/codepen', /vs CodePen/i],
    ['/alternatives/jsfiddle', /vs JSFiddle/i],
    ['/privacy', /stays local/i],
    ['/about', /open web/i],
    ['/changelog', /What’s new/i],
  ]

  for (const [route, heading] of routes) {
    await page.goto(route)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(heading)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://playground.myztic.dev${route}`)
    await expect(page.getByRole('heading', { name: 'Frequently asked questions' })).toBeVisible()
  }

  const [sitemap, llms] = await Promise.all([request.get('/sitemap.xml'), request.get('/llms.txt')])
  expect(await sitemap.text()).toContain('https://playground.myztic.dev/alternatives/codepen')
  expect(await llms.text()).toContain('free, no-signup HTML, CSS, and JavaScript playground')
})
