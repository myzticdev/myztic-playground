import { StrictMode, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import {
  AboutPage, BeginnerPlaygroundPage, BestFreePlaygroundPage, BrowserFrontendPage,
  ChangelogPage, CodePenPage, ComparisonHubPage, DownloadProjectPage, ExamplesPage,
  ExportPage, JsFiddlePage, LearnPage, LiveJavascriptPage, LocalSavePage, PrivacyPage,
  SafeJavascriptPage, SecurityPage, SpanishExamplesPage, SpanishGuidePage, TeachersPage,
  localizedPath, spanishPages, type Locale,
} from './MarketingPages'
import './styles.css'
import { initializeAnalytics } from './analytics'

initializeAnalytics()

const baseUrl = 'https://playground.myztic.dev'
const path = window.location.pathname.replace(/\/$/, '') || '/'

type Route = {
  Page: ComponentType
  title: string
  description: string
  schemaType?: 'Article' | 'TechArticle' | 'WebPage' | 'WebApplication'
  locale?: Locale
}

const routes: Record<string, Route> = {
  '/app': { Page: App, title: 'HTML, CSS & JavaScript Editor | Myztic Playground', description: 'Write HTML, CSS, and JavaScript with live preview, local browser save, and ZIP export. Free and no signup required.' },
  '/examples': { Page: ExamplesPage, title: 'HTML, CSS & JavaScript Examples | Myztic Playground', description: 'Open and remix free frontend examples in a no-signup HTML, CSS, and JavaScript playground.' },
  '/security': { Page: SecurityPage, title: 'Safe JavaScript Playground & Sandbox | Myztic Playground', description: 'Learn how Myztic Playground isolates browser JavaScript, blocks network access, and stores projects locally.' },
  '/safe-javascript-playground': { Page: SafeJavascriptPage, title: 'Safe JavaScript Playground: Browser Sandbox and Limits', description: 'Learn what runs in the Myztic browser sandbox, what it blocks, and why unknown JavaScript can still be risky.', schemaType: 'TechArticle' },
  '/for-teachers': { Page: TeachersPage, title: 'Free HTML CSS JavaScript Playground for Students and Teachers', description: 'A free, no-signup HTML, CSS, and JavaScript playground for classroom demos, workshops, and student practice.', schemaType: 'Article' },
  '/learn/html-css-js-playground': { Page: LearnPage, title: 'Practice HTML, CSS & JavaScript Online for Free', description: 'Practice frontend basics in a free browser playground with live preview, local saving, examples, and ZIP export.' },
  '/export-html-css-js-zip': { Page: ExportPage, title: 'Online HTML CSS JavaScript Editor with ZIP Export', description: 'Build a frontend project online and export index.html, styles.css, and script.js in a ready-to-use ZIP file.', schemaType: 'TechArticle' },
  '/alternatives/codepen': { Page: CodePenPage, title: 'Myztic Playground vs CodePen: No-Signup HTML CSS JS Playground', description: 'Compare Myztic Playground and CodePen for no-signup HTML/CSS/JS tests, ZIP export, public portfolios, embeds, and community features.', schemaType: 'TechArticle' },
  '/alternatives/jsfiddle': { Page: JsFiddlePage, title: 'Myztic Playground vs JSFiddle: Beginner-Friendly HTML CSS JS Playground', description: 'Compare Myztic Playground and JSFiddle for beginner frontend tests, external libraries, local saving, and ZIP export.', schemaType: 'TechArticle' },
  '/codepen-vs-jsfiddle-vs-myztic-playground': { Page: ComparisonHubPage, title: 'CodePen vs JSFiddle vs Myztic Playground', description: 'Choose between Myztic Playground, CodePen, and JSFiddle for no-signup tests, public sharing, frameworks, embeds, and ZIP export.', schemaType: 'TechArticle' },
  '/best-free-html-css-js-playground-no-signup': { Page: BestFreePlaygroundPage, title: 'Best Free HTML CSS JS Playground Without Signup', description: 'Choose a free no-signup HTML, CSS, and JavaScript playground with live preview, local browser save, and downloadable files.', schemaType: 'Article' },
  '/html-css-js-playground-for-beginners': { Page: BeginnerPlaygroundPage, title: 'HTML CSS JS Playground for Beginners', description: 'Practice browser-native HTML, CSS, and JavaScript with immediate preview feedback, no installation, and no account.', schemaType: 'Article' },
  '/online-javascript-playground-live-preview': { Page: LiveJavascriptPage, title: 'Online JavaScript Playground with Live Preview', description: 'Test browser JavaScript beside HTML and CSS in an isolated live preview with local save and ZIP export.', schemaType: 'TechArticle' },
  '/download-html-css-js-project-as-zip': { Page: DownloadProjectPage, title: 'Download an HTML CSS JavaScript Project as a ZIP', description: 'Download connected index.html, styles.css, and script.js files from a browser playground in one ZIP.', schemaType: 'TechArticle' },
  '/local-save-code-playground': { Page: LocalSavePage, title: 'Local Save Code Playground: How Browser Storage Works', description: 'Learn how Myztic saves the latest project in the current browser profile and why ZIP export is the best backup.', schemaType: 'TechArticle' },
  '/browser-based-frontend-playground': { Page: BrowserFrontendPage, title: 'Browser-Based Frontend Playground for HTML CSS and JavaScript', description: 'Prototype browser-native HTML, CSS, and JavaScript without installing an editor, runtime, package manager, or build tool.', schemaType: 'Article' },
  '/privacy': { Page: PrivacyPage, title: 'Privacy & Local Project Saving | Myztic Playground', description: 'Learn how Myztic Playground stores project code locally in your browser without accounts or server-side code execution.' },
  '/about': { Page: AboutPage, title: 'About Myztic Playground', description: 'Meet the free, open-source, no-signup HTML, CSS, and JavaScript playground maintained by Myzticdev.' },
  '/changelog': { Page: ChangelogPage, title: 'Changelog | Myztic Playground', description: 'See recent improvements to Myztic Playground, including examples, sandbox security, local saving, and ZIP export.' },
}

const SpanishAppPage = () => <App locale="es" />

Object.entries(spanishPages).forEach(([routePath, page]) => {
  const SpanishRoutePage = routePath === '/es/app'
    ? SpanishAppPage
    : routePath === '/es/examples'
      ? SpanishExamplesPage
      : () => <SpanishGuidePage routePath={routePath} />
  routes[routePath] = {
    Page: SpanishRoutePage,
    title: page.title,
    description: page.description,
    schemaType: page.schemaType,
    locale: 'es',
  }
})

function setAlternateLink(hreflang: string, href: string) {
  let link = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hreflang}"]`)
  if (!link) {
    link = document.createElement('link')
    link.rel = 'alternate'
    link.hreflang = hreflang
    document.head.append(link)
  }
  link.href = href
}

function applyRouteMetadata(routePath: string, route: Route) {
  document.title = route.title
  document.documentElement.lang = route.locale ?? 'en'
  const canonicalUrl = `${baseUrl}${routePath}`
  const englishPath = localizedPath(routePath, 'en')
  const spanishPath = localizedPath(englishPath, 'es')
  const setMeta = (selector: string, attribute: string, value: string) => {
    document.querySelector(selector)?.setAttribute(attribute, value)
  }
  setMeta('meta[name="description"]', 'content', route.description)
  setMeta('link[rel="canonical"]', 'href', canonicalUrl)
  setMeta('meta[property="og:title"]', 'content', route.title)
  setMeta('meta[property="og:description"]', 'content', route.description)
  setMeta('meta[property="og:url"]', 'content', canonicalUrl)
  setMeta('meta[name="twitter:title"]', 'content', route.title)
  setMeta('meta[name="twitter:description"]', 'content', route.description)
  setAlternateLink('en', `${baseUrl}${englishPath}`)
  setAlternateLink('es', `${baseUrl}${spanishPath}`)
  setAlternateLink('x-default', `${baseUrl}${englishPath}`)
}

function applyRouteSchema(routePath: string, route: Route) {
  const canonicalUrl = `${baseUrl}${routePath}`
  const questions = [...document.querySelectorAll('.guide-faq article')].map((item) => ({
    '@type': 'Question',
    name: item.querySelector('h3')?.textContent?.trim() ?? '',
    acceptedAnswer: { '@type': 'Answer', text: item.querySelector('p')?.textContent?.trim() ?? '' },
  })).filter((question) => question.name && question.acceptedAnswer.text)
  const locale = route.locale ?? 'en'
  const language = locale === 'es' ? 'es' : 'en'
  const rootPath = locale === 'es' ? '/es' : '/'
  const comparisonPath = locale === 'es'
    ? '/es/codepen-vs-jsfiddle-vs-myztic-playground'
    : '/codepen-vs-jsfiddle-vs-myztic-playground'
  const graph: Record<string, unknown>[] = [{
    '@type': route.schemaType ?? 'WebPage', name: route.title, url: canonicalUrl,
    description: route.description, dateModified: '2026-07-23', inLanguage: language,
    isPartOf: { '@type': 'WebSite', name: 'Myztic Playground', url: `${baseUrl}/` },
  }]
  if (routePath.includes('/alternatives/') || routePath.includes('-vs-')) graph.push({
    '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Myztic Playground', item: `${baseUrl}${rootPath}` },
      { '@type': 'ListItem', position: 2, name: locale === 'es' ? 'Comparativas' : 'Comparisons', item: `${baseUrl}${comparisonPath}` },
      { '@type': 'ListItem', position: 3, name: route.title, item: canonicalUrl },
    ],
  })
  if (questions.length) graph.push({ '@type': 'FAQPage', mainEntity: questions })
  const jsonLd = document.querySelector('script[type="application/ld+json"]')
  if (jsonLd) jsonLd.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
}

if (path !== '/') {
  const route = routes[path]
  if (route) {
    applyRouteMetadata(path, route)
    createRoot(document.getElementById('root')!).render(<StrictMode><route.Page /></StrictMode>)
    window.requestAnimationFrame(() => applyRouteSchema(path, route))
  }
}
