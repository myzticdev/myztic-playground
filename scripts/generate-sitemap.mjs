import { writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { englishRoutes, spanishPath } from './site-routes.mjs'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const baseUrl = 'https://playground.myztic.dev'
const lastModified = '2026-07-23'

function urlEntry(route, locale) {
  const english = route.path
  const spanish = spanishPath(route.path)
  const localizedPath = locale === 'es' ? spanish : english
  return `  <url>
    <loc>${baseUrl}${localizedPath}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}${english}" />
    <xhtml:link rel="alternate" hreflang="es" href="${baseUrl}${spanish}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${english}" />
    <lastmod>${lastModified}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${locale === 'es' && route.priority === '1.0' ? '0.9' : route.priority}</priority>
  </url>`
}

const entries = englishRoutes.flatMap((route) => [
  urlEntry(route, 'en'),
  urlEntry(route, 'es'),
])

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`

await writeFile(join(projectRoot, 'public', 'sitemap.xml'), sitemap, 'utf8')
console.log(`Generated sitemap with ${entries.length} localized URLs.`)
