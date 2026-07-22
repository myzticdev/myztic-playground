const UMAMI_CLOUD_SCRIPT = 'https://cloud.umami.is/script.js'

export function getAnalyticsProvider(value = '') {
  const provider = value.trim().toLowerCase()
  return provider === 'umami' || provider === 'google' ? provider : 'none'
}

export function getUmamiScriptUrl(value = '') {
  const requestedUrl = value.trim() || UMAMI_CLOUD_SCRIPT
  if (requestedUrl.startsWith('/') && !requestedUrl.startsWith('//')) return requestedUrl

  const url = new URL(requestedUrl)

  if (url.protocol !== 'https:' || url.username || url.password) {
    throw new Error('VITE_ANALYTICS_SCRIPT_URL must be an HTTPS URL without credentials')
  }

  return url.href
}

export function buildMainCsp({
  provider: requestedProvider = '',
  scriptUrl = '',
  developmentConnections = false,
  upgradeInsecureRequests = false,
} = {}) {
  const provider = getAnalyticsProvider(requestedProvider)
  const scriptSources = ["'self'"]
  const imageSources = ["'self'", 'data:']
  const connectSources = ["'self'"]

  if (developmentConnections) connectSources.push('ws:', 'wss:')

  if (provider === 'umami') {
    const validatedScriptUrl = getUmamiScriptUrl(scriptUrl)
    if (!validatedScriptUrl.startsWith('/')) {
      const umamiOrigin = new URL(validatedScriptUrl).origin
      scriptSources.push(umamiOrigin)
      connectSources.push(umamiOrigin)
      if (umamiOrigin === 'https://cloud.umami.is') connectSources.push('https://gateway.umami.is')
    }
  }

  if (provider === 'google') {
    scriptSources.push('https://www.googletagmanager.com')
    imageSources.push('https://www.google-analytics.com')
    connectSources.push(
      'https://www.google-analytics.com',
      'https://region1.google-analytics.com',
      'https://analytics.google.com',
    )
  }

  const directives = [
    "default-src 'self'",
    `script-src ${scriptSources.join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src ${imageSources.join(' ')}`,
    "font-src 'self' data:",
    `connect-src ${connectSources.join(' ')}`,
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-src 'self'",
    "frame-ancestors 'none'",
  ]

  if (upgradeInsecureRequests) directives.push('upgrade-insecure-requests')
  return `${directives.join('; ')};`
}
