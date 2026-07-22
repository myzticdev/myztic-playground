import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { strFromU8, unzipSync } from 'fflate'

const requiredPreviewCsp = "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; media-src data: blob:; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none';"

async function setEditor(page, language, value) {
  await page.getByRole('tab', { name: new RegExp(`${language}$`) }).click()
  await page.getByRole('textbox', { name: `${language} code` }).fill(value)
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('executes user interactions only inside the isolated preview', async ({ page }) => {
  await setEditor(page, 'HTML', '<button id="test">Click me</button><output id="result">waiting</output>')
  await setEditor(page, 'CSS', 'button { color: rgb(255, 0, 0); }')
  await setEditor(
    page,
    'JavaScript',
    "document.querySelector('#test').addEventListener('click', () => { document.querySelector('#result').textContent = 'clicked'; });",
  )

  await page.getByRole('button', { name: 'Run' }).click()
  const preview = page.frameLocator('iframe[title="User code preview"]')

  await expect(preview.locator('#test')).toHaveCSS('color', 'rgb(255, 0, 0)')
  await preview.locator('#test').click()
  await expect(preview.locator('#result')).toHaveText('clicked')
  await expect(page.locator('#result')).toHaveCount(0)
})

test('keeps the exact iframe sandbox and preview CSP', async ({ page }) => {
  const iframe = page.locator('iframe[title="User code preview"]')
  await expect(iframe).toHaveAttribute('sandbox', 'allow-scripts')
  await expect(iframe).not.toHaveAttribute('sandbox', /allow-same-origin|allow-forms|allow-popups|allow-modals|allow-downloads|allow-top-navigation/)

  const mainCsp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content')
  expect(mainCsp).toContain("script-src 'self'")
  expect(mainCsp).not.toContain("script-src 'self' 'unsafe-inline'")

  const preview = page.frameLocator('iframe[title="User code preview"]')
  await expect(preview.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveAttribute('content', requiredPreviewCsp)
})

test('blocks parent, storage, network, popups, forms, downloads, navigation, and modals', async ({ page }) => {
  const parentUrl = page.url()
  const escapedRequests = []
  let dialogCount = 0
  let downloadCount = 0

  page.on('request', (request) => {
    if (/blocked-endpoint|form-escape/.test(request.url())) escapedRequests.push(request.url())
  })
  page.on('dialog', async (dialog) => {
    dialogCount += 1
    await dialog.dismiss()
  })
  page.on('download', () => {
    downloadCount += 1
  })

  await setEditor(page, 'HTML', '<pre id="security-results">pending</pre>')
  await setEditor(page, 'CSS', '')
  await setEditor(page, 'JavaScript', `
(async () => {
  const blocked = {};

  try { parent.document.body.dataset.compromised = 'yes'; blocked.parent = false; }
  catch { blocked.parent = true; }

  try { localStorage.setItem('preview-owned', 'yes'); blocked.storage = false; }
  catch { blocked.storage = true; }

  try { blocked.popup = window.open('/popup-escape') === null; }
  catch { blocked.popup = true; }

  try { top.location.href = '/navigation-escape'; blocked.navigation = false; }
  catch { blocked.navigation = true; }

  try { await fetch('/blocked-endpoint'); blocked.network = false; }
  catch { blocked.network = true; }

  alert('this modal must be blocked');

  const download = document.createElement('a');
  download.href = 'data:text/plain,blocked';
  download.download = 'blocked.txt';
  download.click();

  const form = document.createElement('form');
  form.action = '/form-escape';
  form.method = 'post';
  document.body.append(form);
  form.submit();

  setTimeout(() => {
    document.querySelector('#security-results').textContent = JSON.stringify(blocked);
  }, 100);
})();`)

  await page.getByRole('button', { name: 'Run' }).click()
  const preview = page.frameLocator('iframe[title="User code preview"]')
  const results = preview.locator('#security-results')

  await expect(results).toHaveText(
    JSON.stringify({ parent: true, storage: true, popup: true, navigation: true, network: true }),
  )
  await page.waitForTimeout(250)

  expect(await page.locator('body').getAttribute('data-compromised')).toBeNull()
  expect(page.url()).toBe(parentUrl)
  expect(escapedRequests).toEqual([])
  expect(dialogCount).toBe(0)
  expect(downloadCount).toBe(0)
})

test('stop destroys the running preview document', async ({ page }) => {
  await page.getByRole('button', { name: 'Run' }).click()
  await page.getByRole('button', { name: 'Stop' }).click()
  const preview = page.frameLocator('iframe[title="User code preview"]')
  await expect(preview.getByText('Preview stopped. Press Run when you’re ready.')).toBeVisible()
  await expect(preview.locator('.card')).toHaveCount(0)
})

test('restores and runs saved code on page load inside the sandbox', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('myztic-playground:code:v1', JSON.stringify({
      html: '<p id="auto-run-marker">restored preview</p>',
      css: '',
      javascript: '',
    }))
  })
  await page.reload()

  await expect(page.getByRole('textbox', { name: 'HTML code' })).toHaveValue(/auto-run-marker/)
  await expect(page.getByText('Running', { exact: true })).toBeVisible()
  const preview = page.frameLocator('iframe[title="User code preview"]')
  await expect(preview.locator('#auto-run-marker')).toHaveText('restored preview')
})

test('self-navigation attempts cannot navigate the parent', async ({ page }) => {
  const parentUrl = page.url()
  let attemptedNavigation = false
  page.on('request', (request) => {
    if (request.url().includes('/self-navigation-test')) attemptedNavigation = true
  })

  await setEditor(page, 'HTML', '<p>navigation test</p>')
  await setEditor(page, 'CSS', '')
  await setEditor(page, 'JavaScript', "location.href = '/self-navigation-test'")
  await page.getByRole('button', { name: 'Run' }).click()
  await expect.poll(() => attemptedNavigation).toBe(true)

  expect(page.url()).toBe(parentUrl)
  await expect(page.getByRole('button', { name: 'Run' })).toBeVisible()
})

test('downloads the current editors as a working three-file ZIP', async ({ page }) => {
  await setEditor(page, 'HTML', '<main id="downloaded-project">Downloaded project</main>')
  await setEditor(page, 'CSS', '#downloaded-project { color: purple; }')
  await setEditor(page, 'JavaScript', "document.querySelector('#downloaded-project').dataset.ready = 'true'")

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download ZIP' }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('myztic-playground.zip')

  const downloadPath = await download.path()
  expect(downloadPath).not.toBeNull()
  const files = unzipSync(new Uint8Array(await readFile(downloadPath)))
  expect(Object.keys(files).sort()).toEqual(['index.html', 'script.js', 'styles.css'])

  const html = strFromU8(files['index.html'])
  expect(html).toContain('<link rel="stylesheet" href="styles.css">')
  expect(html).toContain('<script src="script.js" defer></script>')
  expect(html).toContain('Downloaded project')
  expect(strFromU8(files['styles.css'])).toBe('#downloaded-project { color: purple; }')
  expect(strFromU8(files['script.js'])).toContain("dataset.ready = 'true'")
})

test('links the GitHub control to the public repository', async ({ page }) => {
  const githubLink = page.getByRole('link', { name: 'Open GitHub repository' })
  await expect(githubLink).toHaveAttribute('href', 'https://github.com/myzticdev/myztic-playground')
  await expect(githubLink).toHaveAttribute('target', '_blank')
  await expect(githubLink).toHaveAttribute('rel', 'noreferrer')
})
