/// <reference types="vite/client" />

interface Navigator {
  readonly globalPrivacyControl?: boolean
}

interface ImportMetaEnv {
  readonly VITE_ANALYTICS_PROVIDER?: 'none' | 'umami' | 'google'
  readonly VITE_ANALYTICS_SITE_ID?: string
  readonly VITE_ANALYTICS_SCRIPT_URL?: string
  readonly VITE_ANALYTICS_HOST?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
