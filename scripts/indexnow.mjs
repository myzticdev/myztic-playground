const KEY_PATTERN = /^[A-Za-z0-9-]{8,128}$/
const MAX_URLS = 10_000

export const DEFAULT_SITE_ORIGIN = 'https://playground.myztic.dev'
export const DEFAULT_INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'
export const DEFAULT_INDEXNOW_KEY = '9f7d9b5a34954b3f95263711726516fd'

function normalizeOrigin(value) {
  const url = new URL(value)
  if (url.protocol !== 'https:') throw new Error('The IndexNow site origin must use HTTPS.')
  if (url.pathname !== '/' || url.search || url.hash) {
    throw new Error('The IndexNow site origin cannot include a path, query, or hash.')
  }
  return url.origin
}

function validateKey(key) {
  if (!KEY_PATTERN.test(key)) {
    throw new Error('The IndexNow key must be 8–128 letters, numbers, or dashes.')
  }
  return key
}

function decodeXml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
}

export function normalizeIndexNowUrls(values, siteOrigin = DEFAULT_SITE_ORIGIN) {
  const origin = normalizeOrigin(siteOrigin)
  const urls = [...new Set(values.map((value) => new URL(value, `${origin}/`).href))]
    .map((value) => new URL(value))

  if (!urls.length) throw new Error('At least one URL is required for an IndexNow submission.')
  if (urls.length > MAX_URLS) throw new Error(`IndexNow accepts at most ${MAX_URLS} URLs per request.`)

  return urls.map((url) => {
    if (url.origin !== origin) {
      throw new Error(`IndexNow URL must belong to ${origin}: ${url.href}`)
    }
    if (url.username || url.password || url.hash) {
      throw new Error(`IndexNow URL cannot contain credentials or a hash: ${url.href}`)
    }
    return url.href
  })
}

export function parseSitemapUrls(xml, siteOrigin = DEFAULT_SITE_ORIGIN) {
  const values = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)]
    .map((match) => decodeXml(match[1]))
  return normalizeIndexNowUrls(values, siteOrigin)
}

export function createIndexNowPayload({
  urls,
  key = DEFAULT_INDEXNOW_KEY,
  siteOrigin = DEFAULT_SITE_ORIGIN,
}) {
  const origin = normalizeOrigin(siteOrigin)
  const verifiedKey = validateKey(key)
  return {
    host: new URL(origin).host,
    key: verifiedKey,
    keyLocation: `${origin}/${verifiedKey}.txt`,
    urlList: normalizeIndexNowUrls(urls, origin),
  }
}

export async function submitIndexNow({
  urls,
  key = DEFAULT_INDEXNOW_KEY,
  siteOrigin = DEFAULT_SITE_ORIGIN,
  endpoint = DEFAULT_INDEXNOW_ENDPOINT,
  verifyKey = true,
  fetchImpl = globalThis.fetch,
}) {
  if (typeof fetchImpl !== 'function') throw new Error('A Fetch API implementation is required.')

  const payload = createIndexNowPayload({ urls, key, siteOrigin })
  const endpointUrl = new URL(endpoint)
  if (endpointUrl.protocol !== 'https:') throw new Error('The IndexNow endpoint must use HTTPS.')

  if (verifyKey) {
    const keyResponse = await fetchImpl(payload.keyLocation, {
      headers: { accept: 'text/plain' },
    })
    const deployedKey = keyResponse.ok ? (await keyResponse.text()).trim() : ''
    if (!keyResponse.ok || deployedKey !== payload.key) {
      throw new Error(`IndexNow key verification failed at ${payload.keyLocation}. Deploy the key file before submitting URLs.`)
    }
  }

  const response = await fetchImpl(endpointUrl, {
    method: 'POST',
    headers: {
      accept: 'application/json, text/plain, */*',
      'content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(payload),
  })

  if (response.status !== 200 && response.status !== 202) {
    const detail = (await response.text()).trim()
    throw new Error(`IndexNow returned HTTP ${response.status}${detail ? `: ${detail}` : ''}`)
  }

  return {
    status: response.status,
    pendingKeyValidation: response.status === 202,
    submittedUrls: payload.urlList,
    keyLocation: payload.keyLocation,
  }
}
