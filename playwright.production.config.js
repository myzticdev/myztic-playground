import { defineConfig } from '@playwright/test'
import baseConfig from './playwright.config.js'

export default defineConfig({
  ...baseConfig,
  testDir: '.',
  // Source-module analytics tests run against Vite in the browser suite. The
  // production image intentionally contains only compiled assets, not /src.
  testMatch: ['tests/sandbox.spec.js', 'tests-production/**/*.spec.js'],
  testIgnore: ['claude-security-review/**'],
  use: {
    ...baseConfig.use,
    baseURL: 'http://127.0.0.1:8080',
  },
  // The production suite expects `docker compose up --build -d` to be running.
  webServer: undefined,
})
