import type { ReactNode } from 'react'
import { exampleProjects, type ExampleSlug } from './examples'
import spanishContent from './spanish-content.json'
import portugueseContent from './portuguese-content.json'

export type Locale = 'en' | 'es' | 'pt-BR'

const localePrefixes: Record<Locale, string> = { en: '', es: '/es', 'pt-BR': '/pt-br' }

const languages = [
  { locale: 'en', name: 'English', code: 'EN' },
  { locale: 'es', name: 'Español', code: 'ES' },
  { locale: 'pt-BR', name: 'Português (Brasil)', code: 'PT' },
] as const

const englishSupportLinks = [
  ['/codepen-vs-jsfiddle-vs-myztic-playground', 'Choose a playground'],
  ['/export-html-css-js-zip', 'ZIP export'],
  ['/for-teachers', 'For teachers'],
  ['/html-css-js-playground-for-beginners', 'For beginners'],
  ['/local-save-code-playground', 'Local save'],
  ['/safe-javascript-playground', 'JavaScript safety'],
  ['/alternatives/codepen', 'CodePen alternative'],
  ['/alternatives/jsfiddle', 'JSFiddle alternative'],
] as const

const spanishSupportLinks = [
  ['/es/codepen-vs-jsfiddle-vs-myztic-playground', 'Elegir un editor'],
  ['/es/export-html-css-js-zip', 'Exportación ZIP'],
  ['/es/for-teachers', 'Para docentes'],
  ['/es/html-css-js-playground-for-beginners', 'Para principiantes'],
  ['/es/local-save-code-playground', 'Guardado local'],
  ['/es/safe-javascript-playground', 'Seguridad de JavaScript'],
  ['/es/alternatives/codepen', 'Alternativa a CodePen'],
  ['/es/alternatives/jsfiddle', 'Alternativa a JSFiddle'],
] as const

const portugueseSupportLinks = [
  ['/pt-br/codepen-vs-jsfiddle-vs-myztic-playground', 'Escolher um playground'],
  ['/pt-br/export-html-css-js-zip', 'Exportação ZIP'],
  ['/pt-br/for-teachers', 'Para professores'],
  ['/pt-br/html-css-js-playground-for-beginners', 'Para iniciantes'],
  ['/pt-br/local-save-code-playground', 'Salvamento local'],
  ['/pt-br/safe-javascript-playground', 'Segurança do JavaScript'],
  ['/pt-br/alternatives/codepen', 'Alternativa ao CodePen'],
  ['/pt-br/alternatives/jsfiddle', 'Alternativa ao JSFiddle'],
] as const

export function localizedPath(pathname: string, locale: Locale) {
  const normalized = pathname.replace(/\/$/, '') || '/'
  const englishPath = normalized === '/es' || normalized === '/pt-br'
    ? '/'
    : normalized.startsWith('/es/')
      ? normalized.slice(3)
      : normalized.startsWith('/pt-br/')
        ? normalized.slice(6)
        : normalized
  const prefix = localePrefixes[locale]
  return locale === 'en' ? englishPath : englishPath === '/' ? prefix : `${prefix}${englishPath}`
}

function equivalentLanguagePath(targetLocale: Locale) {
  return `${localizedPath(window.location.pathname, targetLocale)}${window.location.search}`
}

const languageNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  'pt-BR': 'Português (Brasil)',
}

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const labels: Record<Locale, { select: string; nav: string }> = {
    en: { select: 'Select language', nav: 'Language' },
    es: { select: 'Seleccionar idioma', nav: 'Idioma' },
    'pt-BR': { select: 'Selecionar idioma', nav: 'Idioma' },
  }
  const label = labels[locale]
  const currentCode = languages.find((language) => language.locale === locale)!.code
  return <nav className="language-menu" aria-label={label.nav}>
    <details>
      <summary className="language-trigger" aria-label={`${label.select}: ${languageNames[locale]}`}>
        <span className="language-globe" aria-hidden="true">◎</span>
        <span className="language-current">{languageNames[locale]}</span>
        <span className="language-short" aria-hidden="true">{currentCode}</span>
        <span className="language-chevron" aria-hidden="true">⌄</span>
      </summary>
      <div className="language-popover">
        <p>{label.select}</p>
        {languages.map((language) => <a key={language.locale} href={equivalentLanguagePath(language.locale)} lang={language.locale} hrefLang={language.locale} aria-label={language.name} aria-current={locale === language.locale ? 'page' : undefined}><span>{language.name}</span><small>{language.code}</small>{locale === language.locale && <b aria-hidden="true">✓</b>}</a>)}
      </div>
    </details>
  </nav>
}

function Header({ locale = 'en' }: { locale?: Locale }) {
  const text = {
    en: { nav: 'Primary navigation', examples: 'Examples', teachers: 'For teachers', compare: 'Compare', open: 'Open playground' },
    es: { nav: 'Navegación principal', examples: 'Ejemplos', teachers: 'Para docentes', compare: 'Comparar', open: 'Abrir editor' },
    'pt-BR': { nav: 'Navegação principal', examples: 'Exemplos', teachers: 'Para professores', compare: 'Comparar', open: 'Abrir playground' },
  }[locale]
  const prefix = localePrefixes[locale]
  return <header className="site-header"><nav className="site-nav" aria-label={text.nav}><a className="site-brand" href={prefix || '/'}><span className="site-brand-mark" aria-hidden="true">✦</span><span>Myztic <strong>Playground</strong></span></a><div className="site-links"><a href={`${prefix}/examples`}>{text.examples}</a><a href={`${prefix}/for-teachers`}>{text.teachers}</a><a href={`${prefix}/codepen-vs-jsfiddle-vs-myztic-playground`}>{text.compare}</a><LanguageSwitcher locale={locale} /><a className="nav-cta" href={`${prefix}/app`}>{text.open} <span aria-hidden="true">→</span></a></div></nav></header>
}

function Footer({ locale = 'en' }: { locale?: Locale }) {
  const text = {
    en: { nav: 'Footer navigation', description: 'A free, local-first place to build for the open web.', playground: 'Playground', examples: 'Examples', compare: 'Compare', teachers: 'Teachers', privacy: 'Privacy', safety: 'Safety', changelog: 'Changelog', note: 'Free. No signup. Built for the open web.' },
    es: { nav: 'Navegación del pie', description: 'Un espacio gratuito y local para crear en la web abierta.', playground: 'Editor', examples: 'Ejemplos', compare: 'Comparar', teachers: 'Docentes', privacy: 'Privacidad', safety: 'Seguridad', changelog: 'Cambios', note: 'Gratis. Sin registro. Creado para la web abierta.' },
    'pt-BR': { nav: 'Navegação do rodapé', description: 'Um espaço gratuito e local para criar para a web aberta.', playground: 'Playground', examples: 'Exemplos', compare: 'Comparar', teachers: 'Professores', privacy: 'Privacidade', safety: 'Segurança', changelog: 'Novidades', note: 'Grátis. Sem cadastro. Criado para a web aberta.' },
  }[locale]
  const prefix = localePrefixes[locale]
  return <footer className="site-footer"><div className="section-wrap footer-inner"><div><a className="site-brand" href={prefix || '/'}><span className="site-brand-mark">✦</span><span>Myztic <strong>Playground</strong></span></a><p>{text.description}</p></div><nav aria-label={text.nav}><a href={`${prefix}/app`}>{text.playground}</a><a href={`${prefix}/examples`}>{text.examples}</a><a href={`${prefix}/codepen-vs-jsfiddle-vs-myztic-playground`}>{text.compare}</a><a href={`${prefix}/for-teachers`}>{text.teachers}</a><a href={`${prefix}/privacy`}>{text.privacy}</a><a href={`${prefix}/safe-javascript-playground`}>{text.safety}</a><a href={`${prefix}/changelog`}>{text.changelog}</a><a href="https://github.com/myzticdev/myztic-playground">GitHub ↗</a></nav></div><div className="section-wrap footer-bottom"><span>© 2026 Myzticdev</span><span>{text.note}</span></div></footer>
}

function PageShell({ children, locale = 'en' }: { children: ReactNode; locale?: Locale }) {
  return <div className="site-shell"><Header locale={locale} /><main>{children}</main><Footer locale={locale} /></div>
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

const spanishExampleText: Record<ExampleSlug, { category: string; title: string; description: string }> = {
  'gradient-card': { category: 'CSS creativo', title: 'Tarjeta con degradado', description: 'Capas, degradados y una animación sutil con CSS.' },
  counter: { category: 'JavaScript', title: 'Contador de clics', description: 'Eventos, estado y actualización del DOM en pocas líneas.' },
  'profile-card': { category: 'HTML y CSS', title: 'Tarjeta de perfil', description: 'Una composición adaptable con jerarquía visual clara.' },
  'orbit-loader': { category: 'Animación CSS', title: 'Indicador orbital', description: 'Movimiento circular creado sin bibliotecas externas.' },
  'signup-form': { category: 'Formularios', title: 'Formulario de registro', description: 'Campos accesibles y estados visuales para una llamada a la acción.' },
  'theme-switcher': { category: 'DOM y CSS', title: 'Selector de tema', description: 'Cambia entre modo claro y oscuro con variables CSS.' },
}

export function SpanishExamplesPage() {
  return <PageShell locale="es"><section className="page-hero section-wrap"><p className="eyebrow"><span></span> Proyectos de ejemplo</p><h1>Empieza con algo pequeño.<br /><em>Hazlo tuyo.</em></h1><p>Abre una idea frontend, revisa cómo funciona y modifícala en Myztic Playground.</p></section><section className="examples-page section-wrap"><div className="example-grid full-grid">{exampleProjects.map((example) => {
    const translated = spanishExampleText[example.slug]
    return <article className={`example-card ${exampleClassNames[example.slug]}`} key={example.slug}><div className="example-art"><ExampleArtwork slug={example.slug} /></div><div><p><b>{translated.category}</b> • {example.lines} líneas</p><h2>{translated.title}</h2><p className="example-description">{translated.description}</p><a href={`/es/app?example=${example.slug}`}>Abrir código en el editor <span>→</span></a></div></article>
  })}</div></section><section className="final-cta section-wrap"><div><p className="eyebrow"><span></span> Empieza desde cero</p><h2>¿Prefieres un lienzo vacío?</h2><p>El editor está listo cuando tú lo estés.</p></div><a className="primary-cta" href="/es/app">Abrir editor vacío <span>→</span></a></section></PageShell>
}

const portugueseExampleText: Record<ExampleSlug, { category: string; title: string; description: string }> = {
  'gradient-card': { category: 'CSS criativo', title: 'Cartão com gradiente', description: 'Camadas, gradientes e uma animação sutil feita com CSS.' },
  counter: { category: 'JavaScript', title: 'Contador de cliques', description: 'Eventos, estado e atualização do DOM em poucas linhas.' },
  'profile-card': { category: 'HTML e CSS', title: 'Cartão de perfil', description: 'Uma composição responsiva com hierarquia visual clara.' },
  'orbit-loader': { category: 'Animação CSS', title: 'Indicador orbital', description: 'Movimento circular criado sem bibliotecas externas.' },
  'signup-form': { category: 'Formulários', title: 'Formulário de cadastro', description: 'Campos acessíveis e estados visuais para uma chamada à ação.' },
  'theme-switcher': { category: 'DOM e CSS', title: 'Seletor de tema', description: 'Alterne entre os modos claro e escuro com variáveis CSS.' },
}

export function PortugueseExamplesPage() {
  return <PageShell locale="pt-BR"><section className="page-hero section-wrap"><p className="eyebrow"><span></span> Projetos de exemplo</p><h1>Comece com algo pequeno.<br /><em>Deixe do seu jeito.</em></h1><p>Abra uma ideia frontend, entenda como ela funciona e transforme-a no Myztic Playground.</p></section><section className="examples-page section-wrap"><div className="example-grid full-grid">{exampleProjects.map((example) => {
    const translated = portugueseExampleText[example.slug]
    return <article className={`example-card ${exampleClassNames[example.slug]}`} key={example.slug}><div className="example-art"><ExampleArtwork slug={example.slug} /></div><div><p><b>{translated.category}</b> • {example.lines} linhas</p><h2>{translated.title}</h2><p className="example-description">{translated.description}</p><a href={`/pt-br/app?example=${example.slug}`}>Abrir código no playground <span>→</span></a></div></article>
  })}</div></section><section className="final-cta section-wrap"><div><p className="eyebrow"><span></span> Comece do zero</p><h2>Prefere uma tela em branco?</h2><p>O playground está pronto quando você estiver.</p></div><a className="primary-cta" href="/pt-br/app">Abrir playground vazio <span>→</span></a></section></PageShell>
}

type TableRow = { label: string; value: ReactNode }
type Faq = { question: string; answer: ReactNode }
type DetailSection = { heading: string; paragraphs?: ReactNode[]; items?: string[] }
type DecisionRow = { need: string; fit: string; reason: string }

export type LocalizedPageData = {
  title: string
  description: string
  eyebrow: string
  heading: string
  summary: string
  answer: string
  rows: [string, string][]
  sections: [string, string][]
  faqs: [string, string][]
  schemaType: 'Article' | 'TechArticle' | 'WebPage' | 'WebApplication'
}

export const spanishPages = spanishContent as unknown as Record<string, LocalizedPageData>
export const portuguesePages = portugueseContent as unknown as Record<string, LocalizedPageData>

type GuidePageProps = {
  locale?: Locale
  eyebrow: string
  title: ReactNode
  summary: string
  heading: string
  paragraphs: ReactNode[]
  rows?: TableRow[]
  listTitle?: string
  items?: string[]
  detailSections?: DetailSection[]
  decisionTitle?: string
  decisionRows?: DecisionRow[]
  faqs: Faq[]
  updated?: string
}

function GuidePage({ locale = 'en', eyebrow, title, summary, heading, paragraphs, rows, listTitle, items, detailSections, decisionTitle, decisionRows, faqs, updated }: GuidePageProps) {
  const text = {
    en: { updated: 'Last updated', date: 'July 23, 2026', answer: 'Quick answer', glance: 'At a glance', summary: 'Feature summary', need: 'Need', fit: 'Best fit', why: 'Why', faq: 'Frequently asked questions', explore: 'Keep exploring', start: 'Start immediately', cta: 'Turn an idea into a working page.', ctaBody: 'No setup, account, or payment details required.', open: 'Open playground' },
    es: { updated: 'Última actualización', date: '23 de julio de 2026', answer: 'Respuesta rápida', glance: 'Resumen', summary: 'Resumen de características', need: 'Necesidad', fit: 'Mejor opción', why: 'Motivo', faq: 'Preguntas frecuentes', explore: 'Seguir explorando', start: 'Empieza ahora', cta: 'Convierte una idea en una página que funciona.', ctaBody: 'Sin configuración, cuenta ni datos de pago.', open: 'Abrir editor' },
    'pt-BR': { updated: 'Última atualização', date: '23 de julho de 2026', answer: 'Resposta rápida', glance: 'Resumo', summary: 'Resumo de recursos', need: 'Necessidade', fit: 'Melhor opção', why: 'Motivo', faq: 'Perguntas frequentes', explore: 'Continue explorando', start: 'Comece agora', cta: 'Transforme uma ideia em uma página funcional.', ctaBody: 'Sem configuração, conta ou dados de pagamento.', open: 'Abrir playground' },
  }[locale]
  const supportLinks = locale === 'es' ? spanishSupportLinks : locale === 'pt-BR' ? portugueseSupportLinks : englishSupportLinks
  const displayDate = updated ?? text.date
  const prefix = localePrefixes[locale]
  return <PageShell locale={locale}>
    <section className="page-hero guide-hero section-wrap"><p className="eyebrow"><span></span> {eyebrow}</p><h1>{title}</h1><p>{summary}</p><p className="updated">{text.updated} {displayDate}</p></section>
    <article className="guide-content section-wrap">
      <section className="answer-block"><h2>{text.answer}</h2><h3>{heading}</h3>{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</section>
      {rows && <section><h2>{text.glance}</h2><div className="feature-table" role="table" aria-label={text.summary}>{rows.map((row) => <div className="feature-row" role="row" key={row.label}><strong role="rowheader">{row.label}</strong><span role="cell">{row.value}</span></div>)}</div></section>}
      {decisionRows && <section><h2>{decisionTitle}</h2><div className="decision-table" role="table" aria-label={decisionTitle}><div className="decision-row decision-head" role="row"><strong role="columnheader">{text.need}</strong><strong role="columnheader">{text.fit}</strong><strong role="columnheader">{text.why}</strong></div>{decisionRows.map((row) => <div className="decision-row" role="row" key={row.need}><strong role="rowheader">{row.need}</strong><span role="cell">{row.fit}</span><span role="cell">{row.reason}</span></div>)}</div></section>}
      {items && <section><h2>{listTitle}</h2><ul className="guide-list">{items.map((item) => <li key={item}>{item}</li>)}</ul></section>}
      {detailSections?.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs?.map((paragraph, index) => <p className="guide-paragraph" key={index}>{paragraph}</p>)}{section.items && <ul className="guide-list">{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}</section>)}
      <section><h2>{text.faq}</h2><div className="guide-faq">{faqs.map((faq) => <article key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></article>)}</div></section>
      <aside className="related-links"><h2>{text.explore}</h2><div>{supportLinks.map(([href, label]) => <a href={href} key={href}>{label} <span>→</span></a>)}</div></aside>
    </article>
    <section className="final-cta section-wrap"><div><p className="eyebrow"><span></span> {text.start}</p><h2>{text.cta}</h2><p>{text.ctaBody}</p></div><a className="primary-cta" href={`${prefix}/app`}>{text.open} <span>→</span></a></section>
  </PageShell>
}

export function SpanishGuidePage({ routePath }: { routePath: string }) {
  const page = spanishPages[routePath]
  return <GuidePage
    locale="es"
    eyebrow={page.eyebrow}
    title={page.heading}
    summary={page.summary}
    heading={page.heading}
    paragraphs={[page.answer]}
    rows={page.rows.map(([label, value]) => ({ label, value }))}
    detailSections={page.sections.map(([heading, paragraph]) => ({ heading, paragraphs: [paragraph] }))}
    faqs={page.faqs.map(([question, answer]) => ({ question, answer }))}
  />
}

export function PortugueseGuidePage({ routePath }: { routePath: string }) {
  const page = portuguesePages[routePath]
  return <GuidePage
    locale="pt-BR"
    eyebrow={page.eyebrow}
    title={page.heading}
    summary={page.summary}
    heading={page.heading}
    paragraphs={[page.answer]}
    rows={page.rows.map(([label, value]) => ({ label, value }))}
    detailSections={page.sections.map(([heading, paragraph]) => ({ heading, paragraphs: [paragraph] }))}
    faqs={page.faqs.map(([question, answer]) => ({ question, answer }))}
  />
}

const coreRows: TableRow[] = [
  { label: 'Price', value: 'Free' }, { label: 'Signup required', value: 'No' },
  { label: 'Languages', value: 'HTML, CSS, and JavaScript' }, { label: 'Live preview', value: 'Yes' },
  { label: 'Project storage', value: 'Locally in your browser' }, { label: 'Export', value: 'HTML, CSS, and JavaScript in a ZIP file' },
]

export function TeachersPage() {
  return <GuidePage eyebrow="For classrooms" title={<>Free HTML CSS JavaScript Playground for <em>Students and Teachers</em></>} summary="Run frontend lessons and classroom demos without asking students to install software or create accounts." heading="Teach the open web without setup friction." paragraphs={[<>Myztic Playground gives students three focused editors and a live browser preview. They can practice HTML, CSS, and JavaScript immediately, save work on the same device, and <a href="/export-html-css-js-zip">export a ZIP</a> when class is over.</>, <>It works best for short lessons, workshops, demonstrations, and beginner exercises that do not need frameworks or a backend.</>]} rows={coreRows} decisionTitle="Starter exercises" decisionRows={[{ need: 'Button click counter', fit: 'JavaScript events', reason: 'Build a button that counts clicks.' }, { need: 'Simple landing page', fit: 'HTML and CSS layout', reason: 'Create a hero section with a call to action.' }, { need: 'Color theme switcher', fit: 'DOM and CSS', reason: 'Toggle a light and dark theme.' }, { need: 'CSS card grid', fit: 'Responsive layout', reason: 'Build a flexible grid of cards.' }]} listTitle="Classroom workflow" items={['Open the playground or a prepared example on the classroom display.', 'Let students edit and run code without creating accounts.', 'Ask students to download their ZIP before leaving or clearing browser data.', 'Collect the ordinary web files through the class submission system you already use.']} detailSections={[{ heading: 'Why no signup matters in a classroom', paragraphs: [<>Students can begin at the same URL without sharing names, email addresses, or passwords with Myztic Playground. This reduces setup time, but teachers should still follow school policies for web tools.</>] }, { heading: 'Privacy and local save', paragraphs: [<>The latest project stays in the current browser profile and does not sync between devices. Read the <a href="/privacy">privacy and local-save details</a> before planning work across shared computers.</>] }, { heading: 'Limitations', paragraphs: [<>This is a frontend practice workspace, not a learning management system, cloud drive, backend compiler, or collaborative editor.</>] }]} faqs={[{ question: 'Do students need accounts?', answer: 'No. They can open the playground and start coding immediately.' }, { question: 'Can students download their work?', answer: 'Yes. ZIP export downloads index.html, styles.css, and script.js.' }, { question: 'Does it work on school computers?', answer: 'It works in a modern browser and requires no local installation. School network policies may still control access to the site.' }, { question: 'Can it teach frameworks or backend code?', answer: 'No. The playground is intentionally focused on browser-native HTML, CSS, and JavaScript.' }, { question: 'Where is student work stored?', answer: 'The latest project is stored locally in that browser profile, not in a Myztic account.' }]} />
}

export function LearnPage() {
  return <GuidePage eyebrow="Learn by building" title={<>Practice HTML, CSS and JavaScript <em>online.</em></>} summary="Learn frontend basics in a free browser playground with immediate visual feedback, local saving, and downloadable files." heading="The fastest way to learn is to change something and see what happens." paragraphs={[<>Start with HTML to describe the page, CSS to style it, and JavaScript to add behavior. Press Run to see all three work together in the isolated preview.</>, <>Myztic Playground is a scratchpad rather than a course: use it beside a tutorial, open one of the examples, or build a tiny project of your own.</>]} rows={coreRows} listTitle="A useful first exercise" items={['Add a heading, paragraph, and button in the HTML editor.', 'Change colors, spacing, and typography in the CSS editor.', 'Add a click handler in the JavaScript editor.', 'Run the project, then export the result as a ZIP.']} faqs={[{ question: 'Is Myztic Playground suitable for beginners?', answer: 'Yes. Its three-editor layout keeps the relationship between HTML, CSS, and JavaScript visible and direct.' }, { question: 'Do I need to install a code editor?', answer: 'No. Everything runs in your browser.' }, { question: 'Does it include tutorials?', answer: 'It includes remixable examples, but it is a practice workspace rather than a complete course.' }, { question: 'Will my code still be there later?', answer: 'The latest project is restored when you return with the same browser profile, unless local site data has been cleared.' }, { question: 'Can I continue in VS Code?', answer: 'Yes. Export the project as a ZIP, extract it, and open the files in your preferred editor.' }]} />
}

export function ExportPage() {
  return <GuidePage eyebrow="Portable projects" title={<>Online HTML CSS JavaScript Editor with <em>ZIP Export</em></>} summary="Build a frontend experiment online, then download ordinary web files you can open, submit, share, or continue editing locally." heading="Download real project files instead of leaving your work behind a share link." paragraphs={[<>Myztic Playground exports your HTML, CSS, and JavaScript project as a ZIP file so you can download the files, open them locally, submit them for class, or continue editing in another code editor.</>, <>Choose Download ZIP to receive <code>index.html</code>, <code>styles.css</code>, and <code>script.js</code>. The HTML file is already connected to the stylesheet and script.</>]} rows={[...coreRows, { label: 'Files included', value: 'index.html, styles.css, script.js' }]} listTitle="How to export" items={['Write or edit your project in the three code panels.', 'Press Run and confirm the preview looks right.', 'Choose Download ZIP in the top toolbar.', 'Extract the archive and open index.html.']} detailSections={[{ heading: 'What is ZIP export?', paragraphs: [<>ZIP export packages three ordinary frontend files into one download. It is a portable copy of the code in your editors, not a cloud link or proprietary project format.</>] }, { heading: 'Why export instead of only sharing a link?', paragraphs: [<>Files can be backed up, inspected offline, submitted through a classroom system, hosted on a static site, or opened in VS Code without depending on a public project URL.</>] }, { heading: 'For teachers and beginners', paragraphs: [<>Teachers can collect one archive per exercise. Beginners can extract the archive, open the folder in VS Code, and continue with the same HTML, CSS, and JavaScript structure.</>] }, { heading: 'Limitations', paragraphs: [<>ZIP import is not currently available. Exported files also run outside the playground sandbox, so review your code before hosting or sharing it.</>] }]} faqs={[{ question: 'What files are in the ZIP?', answer: 'The archive contains index.html, styles.css, and script.js.' }, { question: 'Are the files connected already?', answer: 'Yes. The exported HTML links to styles.css and loads script.js with defer.' }, { question: 'Can I host the exported project?', answer: 'Yes. It is a static frontend project suitable for any static web host, subject to the requirements of your own code.' }, { question: 'Does export include analytics?', answer: 'No. The downloaded project contains only the project files generated from your editors.' }, { question: 'Can I re-import a ZIP?', answer: 'Not currently. ZIP export is a one-way download feature.' }]} />
}

export function CodePenPage() {
  return <GuidePage eyebrow="CodePen alternative" title={<>Myztic Playground vs CodePen: <em>No-Signup HTML CSS JS Playground</em></>} summary="Choose a lightweight, no-signup workspace for quick frontend tests—or CodePen when public sharing and community features matter." heading="Myztic is the focused choice for a private-feeling scratchpad; CodePen is the broader publishing community." paragraphs={[<>Myztic Playground is a lightweight CodePen alternative for quick HTML, CSS, and JavaScript experiments when you want no signup, local browser save, and ZIP export.</>, <>CodePen is better for social sharing, public portfolios, embeds, profiles, collaboration, preprocessors, and community discovery. The right tool depends on whether you need portable files or a public publishing workflow.</>]} rows={[{ label: 'No-signup editing', value: 'Myztic Playground' }, { label: 'Local browser save', value: 'Myztic Playground' }, { label: 'Three-file ZIP export', value: 'Myztic Playground' }, { label: 'Community and discovery', value: 'CodePen' }, { label: 'Public profiles and portfolios', value: 'CodePen' }, { label: 'Preprocessors and collaboration', value: 'CodePen' }]} detailSections={[{ heading: 'When to use Myztic Playground instead of CodePen', items: ['You want to test browser-native HTML, CSS, and JavaScript without an account.', 'You want the latest project saved only in the current browser profile.', 'You want to download index.html, styles.css, and script.js as a ZIP.'] }, { heading: 'When to use CodePen instead', items: ['You want public pens, a profile, portfolio presentation, or community discovery.', 'You need embeds, collaboration, or a social front-end coding environment.', 'You depend on preprocessors or other publishing features that Myztic does not provide.'] }]} faqs={[{ question: 'Is there a CodePen alternative with no signup?', answer: 'Yes. Myztic Playground supports quick browser-native HTML, CSS, and JavaScript tests without an account.' }, { question: 'Is Myztic Playground a replacement for every CodePen feature?', answer: 'No. It intentionally focuses on quick browser-native experiments rather than social publishing or collaboration.' }, { question: 'Which is better for a public portfolio?', answer: 'CodePen is better suited to public profiles, discovery, and portfolio presentation.' }, { question: 'Can Myztic export a project?', answer: 'Yes. It downloads standard HTML, CSS, and JavaScript files in a ZIP.' }, { question: 'Does Myztic support preprocessors?', answer: 'No. It stays focused on browser-native HTML, CSS, and JavaScript.' }]} />
}

export function JsFiddlePage() {
  return <GuidePage eyebrow="JSFiddle alternative" title={<>Myztic Playground vs JSFiddle: <em>Beginner-Friendly HTML CSS JS Playground</em></>} summary="Use a simple no-signup HTML/CSS/JS workspace with local save and ZIP export, or choose JSFiddle for library-heavy testing." heading="Myztic keeps beginner and classroom workflows small; JSFiddle is stronger for libraries and advanced fiddle options." paragraphs={[<>Myztic Playground is a beginner-friendly JSFiddle alternative with three editors, an isolated live preview, local autosave, and ZIP export without account setup.</>, <>JSFiddle is a better fit for framework or library testing, external resources, fiddle history, embeds, auto-run, validation, and advanced code-panel options.</>]} rows={[{ label: 'No-signup editing', value: 'Myztic Playground' }, { label: 'Local browser save', value: 'Myztic Playground' }, { label: 'Three-file ZIP export', value: 'Myztic Playground' }, { label: 'Framework/library selection', value: 'JSFiddle' }, { label: 'Embedding and fiddle settings', value: 'JSFiddle' }, { label: 'Best beginner workflow', value: 'Myztic Playground' }]} detailSections={[{ heading: 'When to use Myztic Playground instead of JSFiddle', items: ['You are learning how plain HTML, CSS, and JavaScript work together.', 'A class needs to begin without accounts or local installation.', 'You want to download ordinary project files in one ZIP.'] }, { heading: 'When to use JSFiddle instead', items: ['You need external libraries, frameworks, CDN resources, or advanced panel options.', 'You want a mature fiddle history, embedding, or public sharing workflow.', 'You need features beyond a deliberately small browser-native workspace.'] }, { heading: 'Important limitation', paragraphs: [<>Myztic Playground is not a backend compiler. It runs client-side browser code and blocks external network access inside its preview.</>] }]} faqs={[{ question: 'Is Myztic Playground a JSFiddle alternative for beginners?', answer: 'Yes. It offers a smaller browser-native workflow with no signup and a direct ZIP export.' }, { question: 'Can I add external libraries in Myztic?', answer: 'No. Network access is blocked inside the preview, so inline browser-native code is the intended use.' }, { question: 'Which tool is better for React or framework testing?', answer: 'JSFiddle is generally the better fit when external frameworks and libraries are required.' }, { question: 'Where does Myztic save code?', answer: 'It saves the latest project in local browser storage on the current device and browser profile.' }, { question: 'Can I download my Myztic project?', answer: 'Yes. Export produces a ZIP with wired-together HTML, CSS, and JavaScript files.' }]} />
}

export function PrivacyPage() {
  return <GuidePage eyebrow="Privacy" title={<>Your code stays <em>local.</em></>} summary="Myztic Playground stores your latest project in your browser and does not upload source code to a code-execution service." heading="A local-first frontend scratchpad." paragraphs={[<>Editor contents are saved with your browser’s local storage so the latest project can be restored on the same browser profile. Myztic Playground has no user accounts or project database.</>, <>Optional site analytics may be enabled by a deployment owner, but user project source and exported files are not included in analytics events. Respect browser privacy controls and never paste secrets into frontend code.</>]} rows={[{ label: 'Account data', value: 'None—accounts are not offered' }, { label: 'Project source', value: 'Stored in local browser storage' }, { label: 'Server-side code execution', value: 'None' }, { label: 'ZIP contents', value: 'Your HTML, CSS, and JavaScript only' }, { label: 'Clearing saved work', value: 'Clear the editors or the site’s local browser data' }]} faqs={[{ question: 'Is my code uploaded to Myztic?', answer: 'No. Project code is not sent to a Myztic code-execution server.' }, { question: 'Can another device see my saved project?', answer: 'No. Local storage does not synchronize projects between devices or browser profiles.' }, { question: 'What happens if I clear browser data?', answer: 'Locally saved playground work may be permanently removed, so export important projects first.' }, { question: 'Should I paste API keys into the editor?', answer: 'No. Secrets do not belong in browser code, locally saved content, or exported frontend projects.' }, { question: 'Does the downloaded ZIP contain tracking code?', answer: 'No. ZIP exports contain only the generated project files.' }]} />
}

export function SafeJavascriptPage() {
  return <GuidePage eyebrow="JavaScript safety" title={<>Safe JavaScript Playground: <em>Browser Sandbox and Limits</em></>} summary="Understand what runs in the preview, what the sandbox blocks, and why unknown code can still be risky." heading="Use Myztic for your own client-side experiments—not as a secure analyzer for unknown code." paragraphs={[<>Myztic Playground is for client-side HTML, CSS, and JavaScript experiments. Code runs in the browser preview, not as backend server code. It is useful for frontend layouts, DOM tests, and small prototypes, but it should not be treated as a secure environment for running unknown or untrusted code.</>, <>The preview uses an opaque-origin iframe with script execution allowed while same-origin access, network connections, forms, popups, downloads, and top-level navigation remain blocked.</>]} rows={[{ label: 'Runs in the preview', value: 'Browser-native HTML, CSS, and JavaScript' }, { label: 'Does not run', value: 'Node.js, databases, server routes, or backend code' }, { label: 'Isolation boundary', value: 'Sandboxed opaque-origin iframe' }, { label: 'Network from preview', value: 'Blocked' }, { label: 'Guarantee', value: 'Capability reduction—not proof that code is safe' }]} detailSections={[{ heading: 'Why iframe sandboxing helps', paragraphs: [<>The preview document cannot use the playground page’s origin, DOM, cookies, or local storage. A strict preview policy also blocks remote scripts and network requests.</>] }, { heading: 'What users should not paste', items: ['API keys, passwords, private credentials, or personal data.', 'Unknown scripts copied from an untrusted source.', 'Resource-heavy or infinite-loop code that may freeze the current tab.'] }, { heading: 'Frontend playground versus backend compiler', paragraphs: [<>A frontend playground renders browser code. A backend compiler or runtime executes server-side languages, package managers, databases, and private environment variables; Myztic does none of those things.</>] }]} faqs={[{ question: 'Is all JavaScript safe to run here?', answer: 'No. The sandbox limits capabilities but cannot inspect or prove arbitrary code safe.' }, { question: 'Can preview code reach the playground page?', answer: 'No. The iframe does not receive same-origin access to the application.' }, { question: 'Can JavaScript make network requests?', answer: 'No. The preview Content Security Policy blocks network connections.' }, { question: 'Can heavy code freeze my tab?', answer: 'Yes. Resource-heavy scripts or infinite loops can still slow or freeze the current browser tab.' }, { question: 'Can I run Node.js or backend code?', answer: 'No. Myztic Playground is limited to client-side browser code.' }]} />
}

export function ComparisonHubPage() {
  return <GuidePage eyebrow="Playground chooser" title={<>CodePen vs JSFiddle vs <em>Myztic Playground</em></>} summary="Choose the frontend playground that matches your need: quick portable files, public community publishing, or library-heavy testing." heading="Use Myztic for fast no-signup browser-native work, CodePen for community publishing, and JSFiddle for external-library testing." paragraphs={[<>Myztic Playground is the best fit here when you want a simple HTML, CSS, and JavaScript test with local browser save and ZIP export. CodePen is stronger for public profiles, sharing, and discovery. JSFiddle is stronger for frameworks, libraries, resources, and mature fiddle options.</>]} decisionTitle="Which frontend playground should I use?" decisionRows={[{ need: 'Quick no-signup HTML/CSS/JS test', fit: 'Myztic Playground', reason: 'Fast, simple, local save, and ZIP export.' }, { need: 'Public portfolio or social discovery', fit: 'CodePen', reason: 'Strong community, profile, and sharing model.' }, { need: 'External libraries or framework testing', fit: 'JSFiddle', reason: 'Strong framework, CDN, and resource options.' }, { need: 'Classroom demo with no accounts', fit: 'Myztic Playground', reason: 'Students can start immediately.' }, { need: 'Embed or share a public demo', fit: 'CodePen or JSFiddle', reason: 'More mature public embed workflows.' }, { need: 'Download actual project files', fit: 'Myztic Playground', reason: 'Three-file ZIP export is a core feature.' }]} detailSections={[{ heading: 'The practical tradeoff', paragraphs: [<>Myztic deliberately gives up cloud profiles, social discovery, embeds, frameworks, and preprocessors in exchange for a smaller local-first workflow. Review the detailed <a href="/alternatives/codepen">CodePen comparison</a> and <a href="/alternatives/jsfiddle">JSFiddle comparison</a> before choosing.</>] }]} faqs={[{ question: 'Should I use CodePen, JSFiddle, or Myztic Playground?', answer: 'Use Myztic for quick no-signup tests and downloadable files, CodePen for public community publishing, or JSFiddle for library and framework testing.' }, { question: 'Which one downloads an HTML, CSS, and JavaScript project?', answer: 'Myztic Playground exports index.html, styles.css, and script.js in a ZIP.' }, { question: 'Which one is best for a public portfolio?', answer: 'CodePen is the best fit among these three for profiles, portfolios, and community discovery.' }, { question: 'Which one is simplest for a classroom?', answer: 'Myztic Playground is designed for immediate use without student accounts or installation.' }]} />
}

export function BestFreePlaygroundPage() {
  return <GuidePage eyebrow="No-signup decision guide" title={<>Best Free HTML CSS JS Playground <em>Without Signup</em></>} summary="A practical checklist for choosing a free frontend playground when you want to start immediately without creating an account." heading="Myztic Playground is built for people who value immediate access, local browser save, live preview, and downloadable project files." paragraphs={[<>Open the editor, write browser-native HTML, CSS, and JavaScript, run the preview, and export a ZIP. No account, trial, or payment details are required.</>, <>It is not the best choice if you need cloud projects, public profiles, embeds, collaboration, frameworks, preprocessors, or backend code.</>]} rows={coreRows} detailSections={[{ heading: 'How to choose', items: ['Confirm the editor works without an account.', 'Check whether saved work is local or cloud-based.', 'Decide whether you need downloadable files or only a share link.', 'Check framework, collaboration, and backend requirements before starting.'] }, { heading: 'Compare the main options', paragraphs: [<>See the balanced <a href="/codepen-vs-jsfiddle-vs-myztic-playground">CodePen vs JSFiddle vs Myztic Playground chooser</a>.</>] }]} faqs={[{ question: 'What is a good free HTML CSS JS playground without signup?', answer: 'Myztic Playground is designed for quick browser-native tests with no account, live preview, local browser save, and ZIP export.' }, { question: 'Is it free forever?', answer: 'The current product is free and does not request payment details.' }, { question: 'Does no signup mean cloud sync?', answer: 'No. Myztic stores the latest project locally in the current browser profile.' }, { question: 'Can I download the files?', answer: 'Yes. ZIP export includes index.html, styles.css, and script.js.' }]} />
}

export function BeginnerPlaygroundPage() {
  return <GuidePage eyebrow="Beginner learning path" title={<>HTML CSS JS Playground <em>for Beginners</em></>} summary="Learn how HTML structure, CSS presentation, and JavaScript behavior work together with immediate browser feedback." heading="Start with one small page, change one thing at a time, and run the result after each step." paragraphs={[<>Myztic Playground keeps three browser-native editors visible without build tools or account setup. Begin with HTML, add CSS, then use JavaScript for one simple interaction.</>]} rows={coreRows} listTitle="Your first four steps" items={['Add a heading, paragraph, and button with HTML.', 'Use CSS to change spacing, colors, and layout.', 'Use JavaScript to respond to a button click.', 'Run the preview, then export a ZIP to continue locally.']} detailSections={[{ heading: 'What to learn next', paragraphs: [<>Try a remixable <a href="/examples">example project</a>, then learn DOM selection, events, responsive layout, and accessible HTML. Myztic is a practice workspace, not a complete course.</>] }]} faqs={[{ question: 'Is Myztic Playground suitable for beginners?', answer: 'Yes. It focuses on plain HTML, CSS, and JavaScript with immediate preview feedback.' }, { question: 'Do I need to install VS Code?', answer: 'No. You can begin in the browser and export files for VS Code later.' }, { question: 'Does it teach backend programming?', answer: 'No. It is limited to frontend browser code.' }, { question: 'Will it save my lesson?', answer: 'The latest project is stored in the current browser profile; export important work before clearing browser data.' }]} />
}

export function LiveJavascriptPage() {
  return <GuidePage eyebrow="Live browser preview" title={<>Online JavaScript Playground with <em>Live Preview</em></>} summary="Test browser JavaScript beside HTML and CSS, then rerun the isolated preview whenever you change the code." heading="Myztic Playground is useful for DOM events, interface behavior, and small client-side JavaScript experiments." paragraphs={[<>Write the page structure in HTML, add styles in CSS, and use JavaScript to query or update the DOM. Press Run—or use Ctrl+Enter—to rebuild the preview from all three editors.</>, <>The preview is isolated and blocks external network access, so this page is for browser-native code rather than npm packages, APIs, Node.js, or backend services.</>]} rows={[{ label: 'Preview', value: 'Explicit Run and Stop controls' }, { label: 'Good for', value: 'DOM events, UI state, calculations, and small prototypes' }, { label: 'Not for', value: 'Node.js, backend code, npm packages, or remote APIs' }, { label: 'Save', value: 'Latest project stored in the current browser profile' }]} faqs={[{ question: 'Does JavaScript update the preview live?', answer: 'Press Run or Ctrl+Enter to rebuild and execute the current HTML, CSS, and JavaScript.' }, { question: 'Can I stop a preview?', answer: 'Yes. The Stop control removes the running preview document.' }, { question: 'Can I call an external API?', answer: 'No. Network connections are blocked inside the preview.' }, { question: 'Can I export the JavaScript?', answer: 'Yes. ZIP export includes the editor contents as script.js.' }]} />
}

export function DownloadProjectPage() {
  return <GuidePage eyebrow="Download workflow" title={<>Download an HTML CSS JavaScript Project <em>as a ZIP</em></>} summary="Turn the code in three browser editors into an ordinary three-file frontend project you can keep." heading="Run the project, choose Download ZIP, extract the archive, and open index.html or the folder in your preferred editor." paragraphs={[<>The archive contains index.html, styles.css, and script.js. Myztic automatically links the stylesheet and script from the HTML file, so the extracted project is ready to open.</>]} listTitle="From browser to local folder" items={['Confirm the current preview works as intended.', 'Choose the download arrow in the playground toolbar.', 'Extract myztic-playground.zip on your device.', 'Open index.html in a browser or the folder in VS Code.']} detailSections={[{ heading: 'What the download does not include', items: ['No Myztic account or cloud-project data.', 'No Myztic analytics or playground runtime.', 'No dependencies, backend server, or package configuration.'] }, { heading: 'Full export reference', paragraphs: [<>Read <a href="/export-html-css-js-zip">the complete ZIP export guide</a> for classroom uses, limitations, and hosting notes.</>] }]} faqs={[{ question: 'Can I download HTML CSS and JavaScript together?', answer: 'Yes. Myztic packages the three connected files into one ZIP.' }, { question: 'Can I open the project offline?', answer: 'Yes, provided your own code does not depend on remote resources.' }, { question: 'Can I import the ZIP again?', answer: 'Not currently. Import is not supported.' }, { question: 'Can I submit the ZIP for class?', answer: 'Yes, if the teacher or course submission system accepts ZIP files.' }]} />
}

export function LocalSavePage() {
  return <GuidePage eyebrow="Local persistence" title={<>Local Save Code Playground: <em>How Browser Storage Works</em></>} summary="Keep the latest project in the current browser profile without creating a cloud account." heading="Myztic stores editor contents in local browser storage on the same device and browser profile." paragraphs={[<>Local save restores the latest project when you return, but it does not sync between devices or browsers. Clearing site data, using a temporary profile, or losing the device can remove the saved copy.</>, <>Use ZIP export for anything important. A downloaded archive is the portable backup that local browser storage is not.</>]} rows={[{ label: 'Storage location', value: 'Current browser profile on the current device' }, { label: 'Cloud sync', value: 'No' }, { label: 'Account required', value: 'No' }, { label: 'Survives cleared site data', value: 'No' }, { label: 'Recommended backup', value: 'Download ZIP' }]} detailSections={[{ heading: 'When local save is useful', items: ['Returning to a small experiment on the same device.', 'Classroom or workshop work that finishes in one browser session.', 'Keeping source out of an online project database.'] }, { heading: 'Privacy details', paragraphs: [<>Read the <a href="/privacy">privacy page</a> for analytics, project-source, and browser-data answers.</>] }]} faqs={[{ question: 'Where is my code saved?', answer: 'In local storage for the current browser profile on the current device.' }, { question: 'Does it sync to another device?', answer: 'No. Myztic does not offer cloud project sync.' }, { question: 'What happens if I clear browser data?', answer: 'The locally saved project may be permanently removed.' }, { question: 'How should I back up important code?', answer: 'Export the project as a ZIP and store the archive somewhere you control.' }]} />
}

export function BrowserFrontendPage() {
  return <GuidePage eyebrow="No install or setup" title={<>Browser-Based Frontend Playground for <em>HTML CSS and JavaScript</em></>} summary="Prototype a small frontend interface in a modern browser without installing an editor, runtime, package manager, or build tool." heading="A browser-based frontend playground removes setup from small client-side experiments." paragraphs={[<>Myztic provides separate HTML, CSS, and JavaScript editors plus an isolated preview. It is useful for learning, classroom demos, UI reproduction, and prototypes that rely only on browser-native features.</>, <>Use a local development environment when you need dependencies, frameworks, testing tools, source control, a backend, or a larger multi-file application.</>]} rows={[{ label: 'Installation', value: 'None' }, { label: 'Runtime', value: 'Modern web browser' }, { label: 'Languages', value: 'HTML, CSS, and client-side JavaScript' }, { label: 'Best scope', value: 'Small frontend experiments and prototypes' }, { label: 'Upgrade path', value: 'Export a ZIP and continue locally' }]} faqs={[{ question: 'What is a browser-based frontend playground?', answer: 'It is an online workspace that edits and previews client-side HTML, CSS, and JavaScript without local setup.' }, { question: 'Do I need npm?', answer: 'No. Myztic uses browser-native code and does not run npm packages.' }, { question: 'Can it replace a full development environment?', answer: 'Not for frameworks, backends, testing, source control, or large projects.' }, { question: 'Can I continue locally later?', answer: 'Yes. Export a ZIP and open the extracted folder in your preferred editor.' }]} />
}

export function AboutPage() {
  return <GuidePage eyebrow="About Myztic Playground" title={<>A small tool for the <em>open web.</em></>} summary="Myztic Playground is maintained by Myzticdev as a free, focused place to learn, teach, prototype, and test frontend code." heading="Why Myztic Playground exists." paragraphs={[<>Frontend ideas should be easy to test. Myztic Playground removes accounts, installations, build steps, and project setup from small HTML, CSS, and JavaScript experiments.</>, <>The project is intentionally lightweight and open source. Its clearest strengths are live preview, local browser saving, an isolated sandbox, and portable ZIP export—not social feeds or cloud hosting.</>]} rows={coreRows} faqs={[{ question: 'Who maintains Myztic Playground?', answer: <><a href="https://myztic.dev">Myzticdev</a> maintains the project.</> }, { question: 'Is the source code available?', answer: <><a href="https://github.com/myzticdev/myztic-playground">Yes, the project is available on GitHub.</a></> }, { question: 'What is the tool best for?', answer: 'Learning, classroom demos, quick prototypes, UI experiments, and small browser-native tests.' }, { question: 'Is it a backend compiler?', answer: 'No. It is a frontend browser playground for HTML, CSS, and JavaScript.' }, { question: 'How can I follow updates?', answer: <><a href="/changelog">Read the changelog</a> for notable product changes.</> }]} />
}

export function ChangelogPage() {
  return <GuidePage eyebrow="Changelog" title={<>What’s new in <em>Myztic Playground.</em></>} summary="A concise record of meaningful improvements to the editor, examples, security, and supporting content." heading="July 2026 — clearer, more discoverable, and easier to learn from." paragraphs={[<>Added dedicated pages for teachers, beginners, ZIP export, privacy, local save, browser safety, and balanced comparisons with CodePen and JSFiddle. Expanded raw HTML, structured data, FAQs, internal navigation, sitemap coverage, and the AI-readable site summary.</>, <>The editor remains a free, no-signup browser workspace with an isolated preview and portable project files.</>]} items={['Added the free no-signup HTML, CSS, and JavaScript playground.', 'Added explicit Run and Stop controls for live preview.', 'Added local browser save and project restoration.', 'Added ZIP export for index.html, styles.css, and script.js.', 'Added CodePen, JSFiddle, and three-way comparison pages.', 'Added teacher, beginner, privacy, local-save, and JavaScript safety guides.', 'Added prerendered raw HTML, page-specific schema, sitemap entries, and internal links.']} listTitle="July 2026" faqs={[{ question: 'How often is the changelog updated?', answer: 'It is updated when a release adds or materially changes a user-facing capability.' }, { question: 'Where can I report a problem?', answer: <><a href="https://github.com/myzticdev/myztic-playground/issues">Open an issue on GitHub.</a></> }, { question: 'Is there a public repository?', answer: <><a href="https://github.com/myzticdev/myztic-playground">Yes. The source is available on GitHub.</a></> }, { question: 'Do updates remove locally saved code?', answer: 'Normal releases do not intentionally clear local browser storage, but important work should always be exported.' }, { question: 'Is Myztic Playground still free?', answer: 'Yes. It remains free and requires no account.' }]} />
}

export function SecurityPage() {
  return <PageShell><section className="page-hero security-hero section-wrap"><p className="eyebrow"><span></span> Sandbox security</p><h1>Your code stays contained.<br /><em>Here’s how.</em></h1><p>Myztic Playground executes code entirely in your browser, inside a capability-restricted preview designed to keep user code separate from the application.</p></section><section className="security-content section-wrap"><article className="security-summary"><span className="shield-icon">◇</span><div><h2>The short version</h2><p>Your HTML, CSS, and JavaScript are passed one way into a separate preview document. That document runs in an iframe with an opaque origin and only one permission: executing scripts.</p></div></article><div className="security-grid"><article><span>01</span><h2>Opaque-origin iframe</h2><p>The preview uses <code>sandbox="allow-scripts"</code> without <code>allow-same-origin</code>. User code cannot reach the playground page, its DOM, cookies, or local storage.</p></article><article><span>02</span><h2>Network access blocked</h2><p>A strict Content Security Policy sets <code>connect-src 'none'</code> and blocks remote scripts, images, fonts, frames, plugins, and form submissions.</p></article><article><span>03</span><h2>Escape routes removed</h2><p>The sandbox does not grant forms, popups, downloads, modals, or top-level navigation. Preview code cannot open a new window or redirect the playground.</p></article><article><span>04</span><h2>Local-only workspace</h2><p>Your editor contents are stored in your own browser with <code>localStorage</code>. Myztic Playground does not upload your source to a code execution server.</p></article></div><article className="security-limitations"><h2>Important limitations</h2><p>A browser sandbox reduces capabilities; it does not inspect or prove code safe. Resource-heavy scripts and infinite loops can still slow or freeze your own tab. Anyone with access to the same browser profile may also be able to read locally saved code.</p><ul><li>Use an up-to-date browser.</li><li>Do not paste secrets, API keys, or private credentials into browser code.</li><li>Remember that exported projects no longer run inside the playground sandbox.</li></ul></article></section><section className="final-cta section-wrap"><div><p className="eyebrow"><span></span> Explore safely</p><h2>Ready to try an idea?</h2><p>Open the playground and run your frontend code in the isolated preview.</p></div><a className="primary-cta" href="/app">Open playground <span>→</span></a></section></PageShell>
}
