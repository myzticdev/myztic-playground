import type { ReactNode } from 'react'
import { exampleProjects, type ExampleSlug } from './examples'

function Header() {
  return <header className="site-header"><nav className="site-nav" aria-label="Primary navigation"><a className="site-brand" href="/"><span className="site-brand-mark" aria-hidden="true">✦</span><span>Myztic <strong>Playground</strong></span></a><div className="site-links"><a href="/examples">Examples</a><a href="/security">Security</a><a className="nav-cta" href="/app">Open playground <span aria-hidden="true">→</span></a></div></nav></header>
}

function Footer() {
  return <footer className="site-footer"><div className="section-wrap footer-inner"><div><a className="site-brand" href="/"><span className="site-brand-mark">✦</span><span>Myztic <strong>Playground</strong></span></a><p>A small, fast place to build for the open web.</p></div><nav aria-label="Footer navigation"><a href="/app">Playground</a><a href="/examples">Examples</a><a href="/security">Security</a><a href="https://myztic.dev">Myzticdev ↗</a></nav></div><div className="section-wrap footer-bottom"><span>© 2026 Myzticdev</span><span>Built with care for the open web.</span></div></footer>
}

function PageShell({ children }: { children: ReactNode }) {
  return <div className="site-shell"><Header /><main>{children}</main><Footer /></div>
}

const exampleClassNames: Record<ExampleSlug, string> = {
  'gradient-card': 'gradient-example', counter: 'counter-example', 'profile-card': 'profile-example',
  'orbit-loader': 'loader-example', 'signup-form': 'form-example', 'theme-switcher': 'theme-example',
}

function ExampleArtwork({ slug }: { slug: ExampleSlug }) {
  if (slug === 'gradient-card') return <div className="gradient-mini"><small>CREATIVE CSS</small><strong>soft<br /><em>gradients.</em></strong><i>Explore →</i></div>
  if (slug === 'counter') return <div className="counter-mini"><small>DAILY MOMENTUM</small><strong>42</strong><span><i>−</i><b>Reset</b><i>+</i></span></div>
  if (slug === 'profile-card') return <div className="profile-mini"><span>AM</span><small>FRONTEND ENGINEER</small><strong>Alex Morgan</strong><b>Follow Alex</b></div>
  if (slug === 'orbit-loader') return <div className="loader-mini"><span className="orbit-art"><i></i></span><small>Preparing your workspace</small></div>
  if (slug === 'signup-form') return <div className="form-mini"><small>EARLY ACCESS</small><strong>Build with us.</strong><i></i><i></i><b>Join the waitlist →</b></div>
  return <div className="theme-mini"><small>Myztic Notes</small><span>☼</span><strong>Good interfaces<br />feel inevitable.</strong></div>
}

export function ExamplesPage() {
  return <PageShell><section className="page-hero section-wrap"><p className="eyebrow"><span></span> Example projects</p><h1>Start with something small.<br /><em>Make it your own.</em></h1><p>Open a compact frontend idea, inspect how it works, then remix it in Myztic Playground.</p></section><section className="examples-page section-wrap"><div className="example-grid full-grid">{exampleProjects.map((example) => <article className={`example-card ${exampleClassNames[example.slug]}`} key={example.slug}><div className="example-art"><ExampleArtwork slug={example.slug} /></div><div><p><b>{example.category}</b> • {example.lines} lines</p><h2>{example.title}</h2><p className="example-description">{example.description}</p><a href={`/app?example=${example.slug}`}>Open code in playground <span>→</span></a></div></article>)}</div></section><section className="final-cta section-wrap"><div><p className="eyebrow"><span></span> Begin from zero</p><h2>Prefer a blank canvas?</h2><p>The playground is ready whenever you are.</p></div><a className="primary-cta" href="/app">Open blank playground <span>→</span></a></section></PageShell>
}

export function SecurityPage() {
  return <PageShell><section className="page-hero security-hero section-wrap"><p className="eyebrow"><span></span> Sandbox security</p><h1>Your code stays contained.<br /><em>Here’s how.</em></h1><p>Myztic Playground executes code entirely in your browser, inside a capability-restricted preview designed to keep user code separate from the application.</p></section><section className="security-content section-wrap"><article className="security-summary"><span className="shield-icon">◇</span><div><h2>The short version</h2><p>Your HTML, CSS, and JavaScript are passed one way into a separate preview document. That document runs in an iframe with an opaque origin and only one permission: executing scripts.</p></div></article><div className="security-grid"><article><span>01</span><h2>Opaque-origin iframe</h2><p>The preview uses <code>sandbox="allow-scripts"</code> without <code>allow-same-origin</code>. User code cannot reach the playground page, its DOM, cookies, or local storage.</p></article><article><span>02</span><h2>Network access blocked</h2><p>A strict Content Security Policy sets <code>connect-src 'none'</code> and blocks remote scripts, images, fonts, frames, plugins, and form submissions.</p></article><article><span>03</span><h2>Escape routes removed</h2><p>The sandbox does not grant forms, popups, downloads, modals, or top-level navigation. Preview code cannot open a new window or redirect the playground.</p></article><article><span>04</span><h2>Local-only workspace</h2><p>Your editor contents are stored in your own browser with <code>localStorage</code>. Myztic Playground does not upload your source to a code execution server.</p></article></div><article className="security-limitations"><h2>Important limitations</h2><p>A browser sandbox reduces capabilities; it does not inspect or prove code safe. Resource-heavy scripts and infinite loops can still slow or freeze your own tab. Anyone with access to the same browser profile may also be able to read locally saved code.</p><ul><li>Use an up-to-date browser.</li><li>Do not paste secrets, API keys, or private credentials into browser code.</li><li>Remember that exported projects no longer run inside the playground sandbox.</li></ul></article></section><section className="final-cta section-wrap"><div><p className="eyebrow"><span></span> Explore safely</p><h2>Ready to try an idea?</h2><p>Open the playground and run your frontend code in the isolated preview.</p></div><a className="primary-cta" href="/app">Open playground <span>→</span></a></section></PageShell>
}
