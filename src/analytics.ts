export type AnalyticsProvider = 'none' | 'umami' | 'google'

export interface AnalyticsConfig {
  provider: AnalyticsProvider
  siteId: string
  scriptUrl: string
  host: string
}

type AnalyticsEnv = {
  VITE_ANALYTICS_PROVIDER?: string
  VITE_ANALYTICS_SITE_ID?: string
  VITE_ANALYTICS_SCRIPT_URL?: string
  VITE_ANALYTICS_HOST?: string
}

declare global {
  interface Window {
    dataLayer?: unknown[][]
    gtag?: (...args: unknown[]) => void
    umami?: { track: (eventName: string) => void }
  }
}

const UMAMI_CLOUD_SCRIPT = 'https://cloud.umami.is/script.js'
let activeProvider: AnalyticsProvider = 'none'

export function getAnalyticsConfig(env: AnalyticsEnv = import.meta.env): AnalyticsConfig {
  const requestedProvider = env.VITE_ANALYTICS_PROVIDER?.trim().toLowerCase()
  const provider: AnalyticsProvider = requestedProvider === 'umami' || requestedProvider === 'google'
    ? requestedProvider
    : 'none'

  return {
    provider,
    siteId: env.VITE_ANALYTICS_SITE_ID?.trim() ?? '',
    scriptUrl: env.VITE_ANALYTICS_SCRIPT_URL?.trim() ?? '',
    host: env.VITE_ANALYTICS_HOST?.trim().toLowerCase() ?? '',
  }
}

function respectsDoNotTrack() {
  return navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true
}

function validGoogleId(siteId: string) {
  return /^G-[A-Z0-9]+$/.test(siteId)
}

function validUmamiId(siteId: string) {
  return /^[A-Za-z0-9-]{8,128}$/.test(siteId)
}

function resolveUmamiScriptUrl(configuredUrl: string) {
  const requestedUrl = configuredUrl || UMAMI_CLOUD_SCRIPT

  try {
    const url = new URL(requestedUrl, window.location.origin)
    if (url.origin === window.location.origin && url.protocol === window.location.protocol) return url.href
    // External Umami origins are authorized by the deployment owner at build
    // time and constrained again by the generated main-document CSP.
    if (url.protocol === 'https:' && !url.username && !url.password) return url.href
  } catch {
    return null
  }

  return null
}

export function initializeAnalytics(config = getAnalyticsConfig()) {
  if (
    config.provider === 'none' ||
    !config.host ||
    config.host !== window.location.hostname.toLowerCase() ||
    respectsDoNotTrack() ||
    document.querySelector('[data-myztic-analytics]')
  ) {
    return 'disabled' as const
  }

  if (config.provider === 'umami' && validUmamiId(config.siteId)) {
    const scriptUrl = resolveUmamiScriptUrl(config.scriptUrl)
    if (!scriptUrl) return 'disabled' as const

    const script = document.createElement('script')
    script.defer = true
    script.src = scriptUrl
    script.dataset.websiteId = config.siteId
    script.dataset.domains = config.host
    script.dataset.doNotTrack = 'true'
    script.dataset.myzticAnalytics = 'umami'
    document.head.append(script)
    activeProvider = 'umami'
    return 'umami' as const
  }

  if (config.provider === 'google' && validGoogleId(config.siteId)) {
    window.dataLayer = window.dataLayer ?? []
    window.gtag = (...args: unknown[]) => window.dataLayer?.push(args)
    window.gtag('js', new Date())
    window.gtag('config', config.siteId, {
      allow_ad_personalization_signals: false,
      allow_google_signals: false,
    })

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.siteId)}`
    script.dataset.myzticAnalytics = 'google'
    document.head.append(script)
    activeProvider = 'google'
    return 'google' as const
  }

  return 'disabled' as const
}

export function trackAnalyticsEvent(eventName: string) {
  if (!/^[a-z][a-z0-9_]{1,63}$/.test(eventName)) return

  if (activeProvider === 'umami') window.umami?.track(eventName)
  if (activeProvider === 'google') window.gtag?.('event', eventName)
}
