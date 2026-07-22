import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { buildMainCsp } from './scripts/analytics-security.mjs'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const mainCsp = buildMainCsp({
    provider: env.VITE_ANALYTICS_PROVIDER,
    scriptUrl: env.VITE_ANALYTICS_SCRIPT_URL,
    developmentConnections: true,
  })

  return {
    plugins: [
      react(),
      {
        name: 'myztic-analytics-csp',
        transformIndexHtml: (html) => html.replace('__MYZTIC_MAIN_CSP__', mainCsp),
      },
    ],
    server: { host: true },
  }
})
