import { expect, test } from '@playwright/test'

test('serves a complete Spanish entry page with reciprocal language signals', async ({ page }) => {
  await page.goto('/es')

  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Editor gratuito de HTML, CSS y JavaScript')
  await expect(page.getByRole('heading', { name: 'Respuesta rápida' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Preguntas frecuentes' })).toBeVisible()
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://playground.myztic.dev/es')
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', 'https://playground.myztic.dev/')
  await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute('href', 'https://playground.myztic.dev/es')
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', 'https://playground.myztic.dev/')
})

test('language switcher keeps the equivalent page and query string', async ({ page }) => {
  await page.goto('/es/for-teachers')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('estudiantes y docentes')
  await expect(page.getByRole('navigation', { name: 'Idioma' }).getByRole('link', { name: 'EN' })).toHaveAttribute('href', '/for-teachers')

  await page.goto('/app?example=counter')
  await expect(page.getByRole('navigation', { name: 'Language' }).getByRole('link', { name: 'ES' })).toHaveAttribute('href', '/es/app?example=counter')
})

test('localizes the playground interface while preserving example behavior', async ({ page }) => {
  await page.goto('/es/app?example=counter')

  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  await expect(page.getByRole('button', { name: 'Ejecutar' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Detener' })).toBeVisible()
  await expect(page.getByRole('textbox', { name: 'HTML código' })).toHaveValue(/DAILY MOMENTUM/)
  await expect(page.frameLocator('iframe[title="Vista previa del código"]').locator('#count')).toHaveText('42')
})

test('publishes all English and Spanish URLs plus a Spanish llms file', async ({ request }) => {
  const [sitemapResponse, llmsResponse] = await Promise.all([
    request.get('/sitemap.xml'),
    request.get('/es/llms.txt'),
  ])
  const sitemap = await sitemapResponse.text()
  const llms = await llmsResponse.text()

  expect(sitemap.match(/<loc>/g)).toHaveLength(40)
  expect(sitemap).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"')
  expect(sitemap).toContain('<loc>https://playground.myztic.dev/es/for-teachers</loc>')
  expect(sitemap).toContain('hreflang="es" href="https://playground.myztic.dev/es/for-teachers"')
  expect(llms).toContain('# Myztic Playground')
  expect(llms).toContain('## Páginas principales')
})
