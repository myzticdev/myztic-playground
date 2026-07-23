import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  createIndexNowPayload,
  DEFAULT_INDEXNOW_ENDPOINT,
  DEFAULT_INDEXNOW_KEY,
  DEFAULT_SITE_ORIGIN,
  parseSitemapUrls,
  submitIndexNow,
} from './indexnow.mjs'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const flags = new Set(args.filter((arg) => arg.startsWith('--')))
const positionalUrls = args.filter((arg) => !arg.startsWith('--'))
const allowedFlags = new Set(['--dry-run', '--help', '--sitemap', '--skip-key-check'])
const unknownFlags = [...flags].filter((flag) => !allowedFlags.has(flag))

if (unknownFlags.length) throw new Error(`Unknown IndexNow option: ${unknownFlags.join(', ')}`)

if (flags.has('--help')) {
  console.log(`Submit changed Myztic Playground URLs through IndexNow.

Usage:
  npm run indexnow:submit -- /changed-page /another-page
  npm run indexnow:submit -- --sitemap
  npm run indexnow:dry-run

With no URL arguments, the command reads every URL from public/sitemap.xml.
Use --skip-key-check only when the deployed key file has already been verified separately.`)
  process.exit(0)
}

const siteOrigin = process.env.INDEXNOW_SITE_ORIGIN || DEFAULT_SITE_ORIGIN
const key = process.env.INDEXNOW_KEY || DEFAULT_INDEXNOW_KEY
const endpoint = process.env.INDEXNOW_ENDPOINT || DEFAULT_INDEXNOW_ENDPOINT
const environmentUrls = (process.env.INDEXNOW_URLS || '').split(/\s+/).filter(Boolean)
const requestedUrls = [...positionalUrls, ...environmentUrls]
const useSitemap = flags.has('--sitemap') || requestedUrls.length === 0
const urls = useSitemap
  ? parseSitemapUrls(await readFile(join(projectRoot, 'public', 'sitemap.xml'), 'utf8'), siteOrigin)
  : requestedUrls
const dryRun = flags.has('--dry-run')

if (dryRun) {
  console.log(JSON.stringify(createIndexNowPayload({ urls, key, siteOrigin }), null, 2))
  process.exit(0)
}

const result = await submitIndexNow({
  urls,
  key,
  siteOrigin,
  endpoint,
  verifyKey: !flags.has('--skip-key-check'),
})

console.log(
  `IndexNow accepted ${result.submittedUrls.length} URL${result.submittedUrls.length === 1 ? '' : 's'} `
  + `(HTTP ${result.status}${result.pendingKeyValidation ? ', key validation pending' : ''}).`,
)
