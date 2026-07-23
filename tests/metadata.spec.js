import { expect, test } from '@playwright/test'

test('publishes complete social preview metadata and brand icons', async ({ page, request }) => {
  await page.goto('/')

  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /HTML, CSS, and JavaScript/)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://playground.myztic.dev/')
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', 'https://playground.myztic.dev/')
  await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute('href', 'https://playground.myztic.dev/es')
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', 'https://playground.myztic.dev/')
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

  const [robots, sitemap, llms, indexNowKey] = await Promise.all([
    request.get('/robots.txt'),
    request.get('/sitemap.xml'),
    request.get('/llms.txt'),
    request.get('/9f7d9b5a34954b3f95263711726516fd.txt'),
  ])
  expect(await robots.text()).toContain('Sitemap: https://playground.myztic.dev/sitemap.xml')
  expect(await sitemap.text()).toContain('https://playground.myztic.dev/security')
  expect(await llms.text()).toContain('# Myztic Playground')
  expect(await llms.text()).toContain('## Policies and updates')
  expect((await indexNowKey.text()).trim()).toBe('9f7d9b5a34954b3f95263711726516fd')
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
    ['/for-teachers', /Students and Teachers/i],
    ['/learn/html-css-js-playground', /practice HTML, CSS and JavaScript/i],
    ['/export-html-css-js-zip', /Online HTML CSS JavaScript Editor/i],
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

test('publishes distinct GEO support pages and a three-way chooser', async ({ page, request }) => {
  const routes = [
    ['/codepen-vs-jsfiddle-vs-myztic-playground', /CodePen vs JSFiddle vs Myztic Playground/i],
    ['/best-free-html-css-js-playground-no-signup', /Without Signup/i],
    ['/html-css-js-playground-for-beginners', /for Beginners/i],
    ['/online-javascript-playground-live-preview', /Live Preview/i],
    ['/download-html-css-js-project-as-zip', /as a ZIP/i],
    ['/local-save-code-playground', /Browser Storage Works/i],
    ['/browser-based-frontend-playground', /Browser-Based Frontend Playground/i],
    ['/safe-javascript-playground', /Browser Sandbox and Limits/i],
  ]

  for (const [route, heading] of routes) {
    const response = await request.get(route)
    expect(response.ok()).toBe(true)
    const html = await response.text()
    expect(html).toContain('<h2>Quick answer</h2>')
    expect(html).toContain('application/ld+json')

    await page.goto(route)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(heading)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://playground.myztic.dev${route}`)
    await expect(page.getByRole('heading', { name: 'Quick answer' })).toBeVisible()
  }

  await page.goto('/codepen-vs-jsfiddle-vs-myztic-playground')
  await expect(page.locator('.decision-row')).toHaveCount(7)
  await expect(page.getByText('Public portfolio or social discovery')).toBeVisible()
})
