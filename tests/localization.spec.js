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
  await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveAttribute('href', 'https://playground.myztic.dev/pt-br')
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', 'https://playground.myztic.dev/')
})

test('language switcher keeps the equivalent page and query string', async ({ page }) => {
  await page.goto('/es/for-teachers')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('estudiantes y docentes')
  const spanishMenu = page.getByRole('navigation', { name: 'Idioma' })
  await spanishMenu.locator('summary').click()
  await expect(spanishMenu.getByRole('link', { name: 'English' })).toBeVisible()
  await expect(spanishMenu.getByRole('link', { name: 'Español' })).toHaveAttribute('aria-current', 'page')
  await expect(spanishMenu.getByRole('link', { name: 'English' })).toHaveAttribute('href', '/for-teachers')
  await expect(spanishMenu.getByRole('link', { name: 'Português (Brasil)' })).toHaveAttribute('href', '/pt-br/for-teachers')

  await page.goto('/app?example=counter')
  const englishMenu = page.getByRole('navigation', { name: 'Language' })
  await englishMenu.locator('summary').click()
  await expect(englishMenu.getByRole('link', { name: 'Español' })).toBeVisible()
  await expect(englishMenu.getByRole('link', { name: 'Español' })).toHaveAttribute('href', '/es/app?example=counter')
  await expect(englishMenu.getByRole('link', { name: 'Português (Brasil)' })).toHaveAttribute('href', '/pt-br/app?example=counter')
})

test('localizes the playground interface while preserving example behavior', async ({ page }) => {
  await page.goto('/es/app?example=counter')

  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  await expect(page.getByRole('button', { name: 'Ejecutar' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Detener' })).toBeVisible()
  await expect(page.getByRole('textbox', { name: 'HTML código' })).toHaveValue(/DAILY MOMENTUM/)
  await expect(page.frameLocator('iframe[title="Vista previa del código"]').locator('#count')).toHaveText('42')
})

test('publishes all localized URLs plus Spanish and Brazilian Portuguese llms files', async ({ request }) => {
  const [sitemapResponse, llmsResponse, portugueseLlmsResponse] = await Promise.all([
    request.get('/sitemap.xml'),
    request.get('/es/llms.txt'),
    request.get('/pt-br/llms.txt'),
  ])
  const sitemap = await sitemapResponse.text()
  const llms = await llmsResponse.text()
  const portugueseLlms = await portugueseLlmsResponse.text()

  expect(sitemap.match(/<loc>/g)).toHaveLength(60)
  expect(sitemap).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"')
  expect(sitemap).toContain('<loc>https://playground.myztic.dev/es/for-teachers</loc>')
  expect(sitemap).toContain('hreflang="es" href="https://playground.myztic.dev/es/for-teachers"')
  expect(sitemap).toContain('<loc>https://playground.myztic.dev/pt-br/for-teachers</loc>')
  expect(sitemap).toContain('hreflang="pt-BR" href="https://playground.myztic.dev/pt-br/for-teachers"')
  expect(llms).toContain('# Myztic Playground')
  expect(llms).toContain('## Páginas principales')
  expect(portugueseLlms).toContain('# Myztic Playground')
  expect(portugueseLlms).toContain('## Páginas principais')
})

test('serves a complete Brazilian Portuguese entry page with reciprocal language signals', async ({ page }) => {
  await page.goto('/pt-br')

  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Playground gratuito de HTML, CSS e JavaScript')
  await expect(page.getByRole('heading', { name: 'Resposta rápida' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Perguntas frequentes' })).toBeVisible()
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://playground.myztic.dev/pt-br')
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', 'https://playground.myztic.dev/')
  await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute('href', 'https://playground.myztic.dev/es')
  await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveAttribute('href', 'https://playground.myztic.dev/pt-br')

  const menu = page.getByRole('navigation', { name: 'Idioma' })
  await menu.locator('summary').click()
  await expect(menu.getByRole('link', { name: 'Português (Brasil)' })).toHaveAttribute('aria-current', 'page')
})

test('localizes the playground interface in Brazilian Portuguese', async ({ page }) => {
  await page.goto('/pt-br/app?example=counter')

  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR')
  await expect(page.getByRole('button', { name: 'Executar' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Parar' })).toBeVisible()
  await expect(page.getByRole('textbox', { name: 'HTML código' })).toHaveValue(/DAILY MOMENTUM/)
  await expect(page.frameLocator('iframe[title="Pré-visualização do código"]').locator('#count')).toHaveText('42')
})
