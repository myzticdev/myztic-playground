import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const outputRoot = join(projectRoot, 'dist')
const baseUrl = 'https://playground.myztic.dev'

const pages = {
  '/for-teachers': {
    title: 'HTML, CSS & JavaScript Playground for Teachers',
    description: 'A free, no-signup HTML, CSS, and JavaScript playground for classroom demos, workshops, and student practice.',
    heading: 'A simple HTML, CSS and JavaScript playground for teachers',
    summary: 'Run frontend lessons and classroom demos without asking students to install software or create accounts.',
    questions: [['Do students need accounts?', 'No. They can open the playground and start coding immediately.'], ['Can students download their work?', 'Yes. ZIP export downloads index.html, styles.css, and script.js.']],
  },
  '/learn/html-css-js-playground': {
    title: 'Practice HTML, CSS & JavaScript Online for Free',
    description: 'Practice frontend basics in a free browser playground with live preview, local saving, examples, and ZIP export.',
    heading: 'Practice HTML, CSS and JavaScript online',
    summary: 'Learn frontend basics in a free browser playground with immediate visual feedback, local saving, and downloadable files.',
    questions: [['Is Myztic Playground suitable for beginners?', 'Yes. Its three-editor layout makes the relationship between HTML, CSS, and JavaScript direct.'], ['Do I need to install a code editor?', 'No. Everything runs in your browser.']],
  },
  '/export-html-css-js-zip': {
    title: 'Online HTML, CSS & JavaScript Editor with ZIP Export',
    description: 'Build a frontend project online and export index.html, styles.css, and script.js in a ready-to-use ZIP file.',
    heading: 'Export HTML, CSS and JavaScript as a ZIP',
    summary: 'Build a frontend experiment online, then download ordinary web files you can open, share, or continue editing locally.',
    questions: [['What files are in the ZIP?', 'The archive contains index.html, styles.css, and script.js.'], ['Are the files connected already?', 'Yes. The HTML links to styles.css and loads script.js with defer.']],
  },
  '/alternatives/codepen': {
    title: 'A No-Signup CodePen Alternative | Myztic Playground',
    description: 'Compare Myztic Playground and CodePen for quick HTML/CSS/JS tests, local saving, ZIP export, publishing, and community features.',
    heading: 'Myztic Playground vs CodePen',
    summary: 'Use Myztic Playground for quick no-signup frontend tests, local browser save, and ZIP export. Use CodePen for public sharing, portfolios, community discovery, embeds, and collaboration.',
    questions: [['Is Myztic Playground a replacement for every CodePen feature?', 'No. It focuses on quick browser-native experiments rather than social publishing.'], ['Which tool is better for a public portfolio?', 'CodePen is better suited to public profiles, discovery, and portfolio presentation.']],
  },
  '/alternatives/jsfiddle': {
    title: 'A Beginner-Friendly JSFiddle Alternative | Myztic Playground',
    description: 'Compare Myztic Playground and JSFiddle for simple frontend tests, external libraries, local saving, and ZIP export.',
    heading: 'Myztic Playground vs JSFiddle',
    summary: 'Use Myztic Playground for a simple no-signup HTML/CSS/JS workspace with local save and ZIP export. Use JSFiddle for framework and external-library testing.',
    questions: [['Is Myztic Playground a JSFiddle alternative for beginners?', 'Yes. It offers a smaller browser-native workflow with no signup and direct ZIP export.'], ['Can I add external libraries in Myztic?', 'No. Network access is blocked inside the preview.']],
  },
  '/privacy': {
    title: 'Privacy & Local Project Saving | Myztic Playground',
    description: 'Learn how Myztic Playground stores project code locally in your browser without accounts or server-side code execution.',
    heading: 'Your code stays local',
    summary: 'Myztic Playground stores your latest project in your browser and does not upload source code to a code-execution service.',
    questions: [['Is my code uploaded to Myztic?', 'No. Project code is not sent to a Myztic code-execution server.'], ['Can another device see my saved project?', 'No. Local storage does not synchronize projects between devices.']],
  },
  '/about': {
    title: 'About Myztic Playground',
    description: 'Meet the free, open-source, no-signup HTML, CSS, and JavaScript playground maintained by Myzticdev.',
    heading: 'A small tool for the open web',
    summary: 'Myztic Playground is maintained by Myzticdev as a free, focused place to learn, teach, prototype, and test frontend code.',
    questions: [['Who maintains Myztic Playground?', 'Myzticdev maintains the project.'], ['Is the source code available?', 'Yes. The project is available on GitHub.']],
  },
  '/changelog': {
    title: 'Changelog | Myztic Playground',
    description: 'See recent improvements to Myztic Playground, including examples, sandbox security, local saving, and ZIP export.',
    heading: 'What is new in Myztic Playground',
    summary: 'A concise record of meaningful improvements to the editor, examples, security, and supporting content.',
    questions: [['How often is the changelog updated?', 'It is updated when a release materially changes a user-facing capability.'], ['Is Myztic Playground still free?', 'Yes. It remains free and requires no account.']],
  },
  '/security': {
    title: 'Safe JavaScript Playground & Sandbox | Myztic Playground',
    description: 'Learn how Myztic Playground isolates browser JavaScript, blocks network access, and stores projects locally.',
    heading: 'Your code stays contained',
    summary: 'User code runs in a restricted opaque-origin iframe with network access, forms, popups, downloads, and top-level navigation blocked.',
    questions: [['Can preview code reach the playground page?', 'No. The iframe does not receive same-origin access.'], ['Does the sandbox prove code is safe?', 'No. It limits browser capabilities but does not inspect or prove arbitrary code safe.']],
  },
  '/safe-javascript-playground': {
    title: 'Safe JavaScript Playground & Sandbox | Myztic Playground',
    description: 'Learn how Myztic Playground isolates browser JavaScript, blocks network access, and stores projects locally.',
    heading: 'How a safer browser JavaScript playground works',
    summary: 'User code runs in a restricted opaque-origin iframe with network access, forms, popups, downloads, and top-level navigation blocked.',
    questions: [['Can preview code reach the playground page?', 'No. The iframe does not receive same-origin access.'], ['Can heavy code freeze my tab?', 'Yes. Resource-heavy scripts can still slow or freeze the current browser tab.']],
  },
}

const escapeHtml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
const source = await readFile(join(outputRoot, 'index.html'), 'utf8')

for (const [path, page] of Object.entries(pages)) {
  const canonical = `${baseUrl}${path}`
  const schema = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'WebPage', name: page.title, url: canonical, description: page.description, dateModified: '2026-07-22', isPartOf: { '@type': 'WebSite', name: 'Myztic Playground', url: `${baseUrl}/` } },
      { '@type': 'FAQPage', mainEntity: page.questions.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })) },
    ],
  }
  const fallback = `<div class="site-shell"><main><article class="page-hero section-wrap"><p class="eyebrow">Myztic Playground</p><h1>${escapeHtml(page.heading)}</h1><p>${escapeHtml(page.summary)}</p><h2>Frequently asked questions</h2>${page.questions.map(([question, answer]) => `<section><h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p></section>`).join('')}<p><a href="/app">Open the free playground</a></p></article></main></div>`
  const html = source
    .replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(page.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(page.description)}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeHtml(page.title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escapeHtml(page.description)}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify(schema)}</script>`)
    .replace(/<div id="root">[\s\S]*<\/div>\s*<\/body>/, `<div id="root">${fallback}</div>\n  </body>`)
  const destination = join(outputRoot, path.slice(1), 'index.html')
  await mkdir(dirname(destination), { recursive: true })
  await writeFile(destination, html)
}

console.log(`Prerendered ${Object.keys(pages).length} crawlable marketing routes.`)
