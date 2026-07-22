import { readFile, writeFile } from 'node:fs/promises'
import { buildMainCsp } from './analytics-security.mjs'

const [templatePath, outputPath] = process.argv.slice(2)
if (!templatePath || !outputPath) throw new Error('Expected nginx template and output paths')

const marker = '__MYZTIC_MAIN_CSP__'
const template = await readFile(templatePath, 'utf8')
if (!template.includes(marker)) throw new Error(`Missing ${marker} in nginx template`)

const csp = buildMainCsp({
  provider: process.env.VITE_ANALYTICS_PROVIDER,
  scriptUrl: process.env.VITE_ANALYTICS_SCRIPT_URL,
  upgradeInsecureRequests: true,
})

await writeFile(outputPath, template.replaceAll(marker, csp), 'utf8')
