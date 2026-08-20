import { defineConfig, devices } from '@playwright/test'

/**
 * E2E roda contra o build de produção servido por `vite preview`
 * (não o dev server — o CSP bloqueia o eval do HMR). Base: /portfolio-cv/.
 */
const PORT = 4173
const BASE = `http://localhost:${PORT}/portfolio-cv/`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: BASE,
    trace: 'on-first-retry',
    // pula a boot animation e desliga motion → testes determinísticos
    reducedMotion: 'reduce',
  },
  projects: [
    // A suite padrao ignora o visual.spec: os snapshots sao por plataforma, e
    // sem a baseline de Linux versionada o CI falharia por arquivo ausente,
    // nao por regressao. Rode com --project=visual.
    {
      name: 'chromium',
      testIgnore: /visual\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'visual',
      testMatch: /visual\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npm run preview -- --port ${PORT} --strictPort`,
    url: BASE,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
