import { StrictMode, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import {
  AboutPage, ChangelogPage, CodePenPage, ExamplesPage, ExportPage, JsFiddlePage,
  LearnPage, PrivacyPage, SecurityPage, TeachersPage,
} from './MarketingPages'
import './styles.css'
import { initializeAnalytics } from './analytics'

initializeAnalytics()

const baseUrl = 'https://playground.myztic.dev'
const path = window.location.pathname.replace(/\/$/, '') || '/'

type Route = { Page: ComponentType; title: string; description: string }

const routes: Record<string, Route> = {
  '/app': { Page: App, title: 'HTML, CSS & JavaScript Editor | Myztic Playground', description: 'Write HTML, CSS, and JavaScript with live preview, local browser save, and ZIP export. Free and no signup required.' },
  '/examples': { Page: ExamplesPage, title: 'HTML, CSS & JavaScript Examples | Myztic Playground', description: 'Open and remix free frontend examples in a no-signup HTML, CSS, and JavaScript playground.' },
  '/security': { Page: SecurityPage, title: 'Safe JavaScript Playground & Sandbox | Myztic Playground', description: 'Learn how Myztic Playground isolates browser JavaScript, blocks network access, and stores projects locally.' },
  '/safe-javascript-playground': { Page: SecurityPage, title: 'Safe JavaScript Playground & Sandbox | Myztic Playground', description: 'Learn how Myztic Playground isolates browser JavaScript, blocks network access, and stores projects locally.' },
  '/for-teachers': { Page: TeachersPage, title: 'HTML, CSS & JavaScript Playground for Teachers', description: 'A free, no-signup HTML, CSS, and JavaScript playground for classroom demos, workshops, and student practice.' },
  '/learn/html-css-js-playground': { Page: LearnPage, title: 'Practice HTML, CSS & JavaScript Online for Free', description: 'Practice frontend basics in a free browser playground with live preview, local saving, examples, and ZIP export.' },
  '/export-html-css-js-zip': { Page: ExportPage, title: 'Online HTML, CSS & JavaScript Editor with ZIP Export', description: 'Build a frontend project online and export index.html, styles.css, and script.js in a ready-to-use ZIP file.' },
  '/alternatives/codepen': { Page: CodePenPage, title: 'A No-Signup CodePen Alternative | Myztic Playground', description: 'Compare Myztic Playground and CodePen for quick HTML/CSS/JS tests, local saving, ZIP export, publishing, and community features.' },
  '/alternatives/jsfiddle': { Page: JsFiddlePage, title: 'A Beginner-Friendly JSFiddle Alternative | Myztic Playground', description: 'Compare Myztic Playground and JSFiddle for simple frontend tests, external libraries, local saving, and ZIP export.' },
  '/privacy': { Page: PrivacyPage, title: 'Privacy & Local Project Saving | Myztic Playground', description: 'Learn how Myztic Playground stores project code locally in your browser without accounts or server-side code execution.' },
  '/about': { Page: AboutPage, title: 'About Myztic Playground', description: 'Meet the free, open-source, no-signup HTML, CSS, and JavaScript playground maintained by Myzticdev.' },
  '/changelog': { Page: ChangelogPage, title: 'Changelog | Myztic Playground', description: 'See recent improvements to Myztic Playground, including examples, sandbox security, local saving, and ZIP export.' },
}

function applyRouteMetadata(routePath: string, route: Route) {
  document.title = route.title
  const canonicalUrl = `${baseUrl}${routePath}`
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

  const jsonLd = document.querySelector('script[type="application/ld+json"]')
  if (jsonLd) jsonLd.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: route.title,
    url: canonicalUrl,
    description: route.description,
    isPartOf: { '@type': 'WebSite', name: 'Myztic Playground', url: `${baseUrl}/` },
    dateModified: '2026-07-22',
  })
}

if (path !== '/') {
  const route = routes[path]
  if (route) {
    applyRouteMetadata(path, route)
    createRoot(document.getElementById('root')!).render(<StrictMode><route.Page /></StrictMode>)
  }
}
