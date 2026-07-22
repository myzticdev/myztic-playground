import { defineConfig } from '@playwright/test'
import baseConfig from './playwright.config.js'

export default defineConfig({
  ...baseConfig,
  testDir: '.',
  testMatch: ['tests/**/*.spec.js', 'tests-production/**/*.spec.js'],
  testIgnore: ['claude-security-review/**'],
  use: {
    ...baseConfig.use,
    baseURL: 'http://127.0.0.1:8080',
  },
  // The production suite expects `docker compose up --build -d` to be running.
  webServer: undefined,
})
