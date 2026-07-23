import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ExamplesPage, SecurityPage } from './MarketingPages'
import './styles.css'
import { initializeAnalytics } from './analytics'

initializeAnalytics()

const path = window.location.pathname.replace(/\/$/, '') || '/'

if (path !== '/') {
  const Page = path === '/app' ? App : path === '/examples' ? ExamplesPage : path === '/security' ? SecurityPage : null
  if (Page) createRoot(document.getElementById('root')!).render(<StrictMode><Page /></StrictMode>)
}
