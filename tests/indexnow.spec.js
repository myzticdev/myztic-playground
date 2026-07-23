import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import {
  createIndexNowPayload,
  DEFAULT_INDEXNOW_KEY,
  parseSitemapUrls,
  submitIndexNow,
} from '../scripts/indexnow.mjs'

test('builds a same-host IndexNow payload from the sitemap', async () => {
  const xml = `<?xml version="1.0"?>
    <urlset>
      <url><loc>https://playground.myztic.dev/</loc></url>
      <url><loc>https://playground.myztic.dev/privacy?view=plain&amp;source=test</loc></url>
      <url><loc>https://playground.myztic.dev/</loc></url>
    </urlset>`
  const urls = parseSitemapUrls(xml)
  const payload = createIndexNowPayload({ urls })

  expect(payload).toEqual({
    host: 'playground.myztic.dev',
    key: DEFAULT_INDEXNOW_KEY,
    keyLocation: `https://playground.myztic.dev/${DEFAULT_INDEXNOW_KEY}.txt`,
    urlList: [
      'https://playground.myztic.dev/',
      'https://playground.myztic.dev/privacy?view=plain&source=test',
    ],
  })
})

test('includes every English and Spanish sitemap URL in IndexNow submissions', async () => {
  const sitemap = await readFile('public/sitemap.xml', 'utf8')
  const urls = parseSitemapUrls(sitemap)
  const payload = createIndexNowPayload({ urls })

  expect(urls).toHaveLength(40)
  expect(payload.urlList).toContain('https://playground.myztic.dev/es')
  expect(payload.urlList).toContain('https://playground.myztic.dev/es/alternatives/codepen')
})

test('rejects URLs that do not belong to the verified host', async () => {
  expect(() => createIndexNowPayload({
    urls: ['https://example.com/not-owned'],
  })).toThrow(/must belong to https:\/\/playground\.myztic\.dev/)
})

test('verifies the deployed key and accepts first-use HTTP 202', async () => {
  const requests = []
  const fetchImpl = async (url, options = {}) => {
    requests.push({ url: String(url), options })
    if (!options.method) return new Response(DEFAULT_INDEXNOW_KEY, { status: 200 })
    return new Response('', { status: 202 })
  }

  const result = await submitIndexNow({
    urls: ['/changelog'],
    fetchImpl,
  })

  expect(result.status).toBe(202)
  expect(result.pendingKeyValidation).toBe(true)
  expect(result.submittedUrls).toEqual(['https://playground.myztic.dev/changelog'])
  expect(requests).toHaveLength(2)
  expect(requests[0].url).toBe(`https://playground.myztic.dev/${DEFAULT_INDEXNOW_KEY}.txt`)
  expect(requests[1].url).toBe('https://api.indexnow.org/indexnow')
  expect(JSON.parse(requests[1].options.body)).toMatchObject({
    host: 'playground.myztic.dev',
    key: DEFAULT_INDEXNOW_KEY,
    urlList: ['https://playground.myztic.dev/changelog'],
  })
})

test('does not submit when the deployed key does not match', async () => {
  let requestCount = 0
  const fetchImpl = async () => {
    requestCount += 1
    return new Response('wrong-key', { status: 200 })
  }

  await expect(submitIndexNow({
    urls: ['/privacy'],
    fetchImpl,
  })).rejects.toThrow(/key verification failed/)
  expect(requestCount).toBe(1)
})

test('automates IndexNow after main deployments while retaining manual runs', async () => {
  const workflow = await readFile('.github/workflows/indexnow.yml', 'utf8')

  expect(workflow).toContain('push:')
  expect(workflow).toContain('- main')
  expect(workflow).toContain('workflow_dispatch:')
  expect(workflow).toContain('run: sleep 300')
  expect(workflow).toContain('for attempt in 1 2 3')
  expect(workflow).toContain('sleep 60')
})
