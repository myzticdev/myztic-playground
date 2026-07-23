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
  // Keep Docker Compose attached to the Playwright lifecycle. This prevents
  // the production tests from racing a detached container between workflow
  // steps and makes /healthz the single readiness signal.
  webServer: {
    command: 'docker compose up --build',
    url: 'http://127.0.0.1:8080/healthz',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
