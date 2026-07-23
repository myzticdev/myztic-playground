import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const outputRoot = join(projectRoot, 'dist')
const baseUrl = 'https://playground.myztic.dev'

const pages = {
  '/for-teachers': {
    title: 'Free HTML CSS JavaScript Playground for Students and Teachers',
    description: 'A free, no-signup HTML, CSS, and JavaScript playground for classroom demos, workshops, and student practice.',
    heading: 'Free HTML CSS JavaScript Playground for Students and Teachers',
    summary: 'Run frontend lessons and classroom demos without asking students to install software or create accounts.',
    answer: 'Students can practice HTML, CSS, and JavaScript with live preview, local browser save, and ZIP export without installing software or creating accounts.',
    schemaType: 'Article',
    rows: [['Classroom access', 'No student accounts required'], ['Saving', 'Latest project stays in the current browser profile'], ['Submission', 'Download index.html, styles.css, and script.js as a ZIP'], ['Best for', 'Short lessons, demos, workshops, and beginner exercises']],
    sections: [['Why no signup matters', 'Students can begin at the same URL without sharing names, email addresses, or passwords with Myztic Playground.'], ['Starter exercises', 'Try a button click counter, simple landing page, color theme switcher, or responsive CSS card grid.'], ['Classroom workflow', 'Open an example, let students edit and run it, then ask them to export a ZIP before leaving or clearing browser data.'], ['Limitations', 'This is not a learning management system, cloud drive, backend compiler, or collaborative editor.']],
    questions: [['Do students need accounts?', 'No. They can open the playground and start coding immediately.'], ['Can students download their work?', 'Yes. ZIP export downloads index.html, styles.css, and script.js.'], ['Where is student work stored?', 'The latest project is stored locally in that browser profile, not in a Myztic account.'], ['Can it teach backend code?', 'No. The playground is focused on browser-native frontend code.']],
  },
  '/learn/html-css-js-playground': {
    title: 'Practice HTML, CSS & JavaScript Online for Free',
    description: 'Practice frontend basics in a free browser playground with live preview, local saving, examples, and ZIP export.',
    heading: 'Practice HTML, CSS and JavaScript online',
    summary: 'Learn frontend basics in a free browser playground with immediate visual feedback, local saving, and downloadable files.',
    questions: [['Is Myztic Playground suitable for beginners?', 'Yes. Its three-editor layout makes the relationship between HTML, CSS, and JavaScript direct.'], ['Do I need to install a code editor?', 'No. Everything runs in your browser.']],
  },
  '/export-html-css-js-zip': {
    title: 'Online HTML CSS JavaScript Editor with ZIP Export',
    description: 'Build a frontend project online and export index.html, styles.css, and script.js in a ready-to-use ZIP file.',
    heading: 'Online HTML CSS JavaScript Editor with ZIP Export',
    summary: 'Build a frontend experiment online, then download ordinary web files you can open, share, or continue editing locally.',
    answer: 'Myztic Playground exports your HTML, CSS, and JavaScript project as a ZIP file so you can open it locally, submit it for class, host it, or continue in another editor.',
    schemaType: 'TechArticle',
    rows: [['Files included', 'index.html, styles.css, and script.js'], ['File wiring', 'The HTML already links the stylesheet and deferred script'], ['Analytics in export', 'None'], ['ZIP import', 'Not currently supported']],
    sections: [['What is ZIP export?', 'It packages three ordinary frontend files into one portable download rather than a proprietary project format.'], ['Why export instead of only sharing a link?', 'Files can be backed up, submitted for class, inspected offline, statically hosted, or continued in VS Code.'], ['Limitations', 'ZIP import is not available, and exported projects no longer run inside the playground sandbox.']],
    questions: [['What files are in the ZIP?', 'The archive contains index.html, styles.css, and script.js.'], ['Are the files connected already?', 'Yes. The HTML links to styles.css and loads script.js with defer.'], ['Can I continue in VS Code?', 'Yes. Extract the archive and open its folder in VS Code.'], ['Does export include analytics?', 'No. The ZIP contains only the generated project files.']],
  },
  '/alternatives/codepen': {
    title: 'Myztic Playground vs CodePen: No-Signup HTML CSS JS Playground',
    description: 'Compare Myztic Playground and CodePen for quick HTML/CSS/JS tests, local saving, ZIP export, publishing, and community features.',
    heading: 'Myztic Playground vs CodePen: No-Signup HTML CSS JS Playground',
    summary: 'Use Myztic Playground for quick no-signup frontend tests, local browser save, and ZIP export. Use CodePen for public sharing, portfolios, community discovery, embeds, and collaboration.',
    answer: 'Myztic Playground is a lightweight CodePen alternative when you want no signup, local browser save, and ZIP export. CodePen is better for public portfolios, embeds, social sharing, and community discovery.',
    schemaType: 'TechArticle',
    rows: [['No-signup editing', 'Myztic Playground'], ['Local browser save', 'Myztic Playground'], ['Three-file ZIP export', 'Myztic Playground'], ['Community, profiles, and portfolios', 'CodePen'], ['Embeds and collaboration', 'CodePen']],
    sections: [['When to use Myztic Playground', 'Choose Myztic for a small browser-native scratchpad with portable files and no account.'], ['When to use CodePen', 'Choose CodePen for public pens, profiles, social discovery, embeds, collaboration, preprocessors, and portfolio work.']],
    questions: [['Is there a CodePen alternative with no signup?', 'Yes. Myztic supports quick browser-native HTML, CSS, and JavaScript tests without an account.'], ['Is Myztic Playground a replacement for every CodePen feature?', 'No. It focuses on quick browser-native experiments rather than social publishing.'], ['Which tool is better for a public portfolio?', 'CodePen is better suited to public profiles, discovery, and portfolio presentation.'], ['Can Myztic export a project?', 'Yes. It downloads standard HTML, CSS, and JavaScript files in a ZIP.']],
  },
  '/alternatives/jsfiddle': {
    title: 'Myztic Playground vs JSFiddle: Beginner-Friendly HTML CSS JS Playground',
    description: 'Compare Myztic Playground and JSFiddle for simple frontend tests, external libraries, local saving, and ZIP export.',
    heading: 'Myztic Playground vs JSFiddle: Beginner-Friendly HTML CSS JS Playground',
    summary: 'Use Myztic Playground for a simple no-signup HTML/CSS/JS workspace with local save and ZIP export. Use JSFiddle for framework and external-library testing.',
    answer: 'Myztic Playground is a beginner-friendly JSFiddle alternative with no signup, local browser save, and ZIP export. JSFiddle is better for frameworks, libraries, external resources, embeds, and advanced fiddle options.',
    schemaType: 'TechArticle',
    rows: [['No-signup editing', 'Myztic Playground'], ['Local browser save and ZIP export', 'Myztic Playground'], ['Framework and external-library testing', 'JSFiddle'], ['Embedding and advanced fiddle settings', 'JSFiddle']],
    sections: [['When to use Myztic Playground', 'Choose Myztic for learning plain HTML, CSS, and JavaScript, classroom work, or downloading ordinary files.'], ['When to use JSFiddle', 'Choose JSFiddle for external libraries, frameworks, CDN resources, fiddle history, embeds, and advanced panel options.'], ['Important limitation', 'Myztic is not a backend compiler and blocks external network access inside the preview.']],
    questions: [['Is Myztic Playground a JSFiddle alternative for beginners?', 'Yes. It offers a smaller browser-native workflow with no signup and direct ZIP export.'], ['Can I add external libraries in Myztic?', 'No. Network access is blocked inside the preview.'], ['Which is better for React or frameworks?', 'JSFiddle is generally the better fit for external frameworks and libraries.'], ['Can I download my Myztic project?', 'Yes. Export produces a ZIP with connected HTML, CSS, and JavaScript files.']],
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
    title: 'Safe JavaScript Playground: Browser Sandbox and Limits',
    description: 'Learn what runs in the Myztic browser sandbox, what it blocks, and why unknown JavaScript can still be risky.',
    heading: 'Safe JavaScript Playground: Browser Sandbox and Limits',
    summary: 'Understand what runs in the preview, what the sandbox blocks, and why unknown code can still be risky.',
    answer: 'Myztic Playground runs client-side HTML, CSS, and JavaScript in a capability-restricted browser preview, but it should not be treated as a secure environment for unknown or untrusted code.',
    schemaType: 'TechArticle',
    rows: [['Runs in the preview', 'Browser-native HTML, CSS, and JavaScript'], ['Does not run', 'Node.js, databases, server routes, or backend code'], ['Isolation', 'Sandboxed opaque-origin iframe'], ['Network from preview', 'Blocked']],
    sections: [['Why iframe sandboxing helps', 'Preview code cannot use the playground origin, DOM, cookies, or local storage, and its network requests are blocked.'], ['What users should not paste', 'Do not paste API keys, passwords, personal data, or unknown scripts from untrusted sources.'], ['Frontend versus backend', 'Myztic renders client-side browser code; it does not run server languages, databases, packages, or private environment variables.']],
    questions: [['Is all JavaScript safe to run here?', 'No. The sandbox limits capabilities but cannot inspect or prove arbitrary code safe.'], ['Can preview code reach the playground page?', 'No. The iframe does not receive same-origin access.'], ['Can heavy code freeze my tab?', 'Yes. Resource-heavy scripts can still slow or freeze the current browser tab.'], ['Can I run backend code?', 'No. Myztic Playground is limited to client-side browser code.']],
  },
  '/codepen-vs-jsfiddle-vs-myztic-playground': {
    title: 'CodePen vs JSFiddle vs Myztic Playground',
    description: 'Choose between Myztic Playground, CodePen, and JSFiddle for no-signup tests, public sharing, frameworks, embeds, and ZIP export.',
    heading: 'CodePen vs JSFiddle vs Myztic Playground',
    summary: 'Choose the frontend playground that matches your need: quick portable files, public community publishing, or library-heavy testing.',
    answer: 'Use Myztic for fast no-signup browser-native work, CodePen for community publishing and public portfolios, and JSFiddle for external-library and framework testing.',
    schemaType: 'TechArticle',
    rows: [['Quick no-signup HTML/CSS/JS test', 'Myztic Playground — fast, simple, local save, and ZIP export'], ['Public portfolio or social discovery', 'CodePen — strong community, profile, and sharing model'], ['External libraries or frameworks', 'JSFiddle — strong framework, CDN, and resource options'], ['Classroom demo with no accounts', 'Myztic Playground — students can start immediately'], ['Embed or public demo', 'CodePen or JSFiddle — mature public embed workflows'], ['Download actual project files', 'Myztic Playground — three-file ZIP export']],
    sections: [['The practical tradeoff', 'Myztic gives up cloud profiles, embeds, social discovery, frameworks, and preprocessors in exchange for a smaller local-first workflow.']],
    questions: [['Should I use CodePen, JSFiddle, or Myztic Playground?', 'Use Myztic for quick no-signup tests and files, CodePen for public publishing, or JSFiddle for libraries and frameworks.'], ['Which one downloads project files?', 'Myztic exports index.html, styles.css, and script.js in a ZIP.'], ['Which is best for a portfolio?', 'CodePen is the best fit among these three for profiles and community discovery.'], ['Which is simplest for a classroom?', 'Myztic is designed for immediate use without student accounts or installation.']],
  },
  '/best-free-html-css-js-playground-no-signup': {
    title: 'Best Free HTML CSS JS Playground Without Signup', description: 'Choose a free no-signup HTML, CSS, and JavaScript playground with live preview, local browser save, and downloadable files.', heading: 'Best Free HTML CSS JS Playground Without Signup', summary: 'A practical checklist for choosing a free frontend playground when you want to start immediately without creating an account.', answer: 'Myztic Playground is built for immediate access, local browser save, live preview, and downloadable project files without an account, trial, or payment details.', schemaType: 'Article', rows: [['Price', 'Free'], ['Signup', 'Not required'], ['Save', 'Latest project in current browser profile'], ['Export', 'HTML, CSS, and JavaScript as a ZIP']], sections: [['Know the limits', 'Choose another tool if you need cloud projects, profiles, embeds, collaboration, frameworks, preprocessors, or backend code.']], questions: [['What is a good free HTML CSS JS playground without signup?', 'Myztic is designed for no-account tests with live preview, local save, and ZIP export.'], ['Does no signup mean cloud sync?', 'No. The latest project stays in the current browser profile.'], ['Can I download the files?', 'Yes. Export includes index.html, styles.css, and script.js.']],
  },
  '/html-css-js-playground-for-beginners': {
    title: 'HTML CSS JS Playground for Beginners', description: 'Practice browser-native HTML, CSS, and JavaScript with immediate preview feedback, no installation, and no account.', heading: 'HTML CSS JS Playground for Beginners', summary: 'Learn how HTML structure, CSS presentation, and JavaScript behavior work together with immediate browser feedback.', answer: 'Start with one small page, change one thing at a time, and run the result after each step in three browser-native editors.', schemaType: 'Article', rows: [['Step 1', 'Add a heading, paragraph, and button with HTML'], ['Step 2', 'Change colors, spacing, and layout with CSS'], ['Step 3', 'Respond to a click with JavaScript'], ['Step 4', 'Run the preview and export a ZIP']], questions: [['Is Myztic suitable for beginners?', 'Yes. It focuses on plain HTML, CSS, and JavaScript with immediate feedback.'], ['Do I need VS Code?', 'No. Begin in the browser and export files for VS Code later.'], ['Does it teach backend programming?', 'No. It is limited to frontend browser code.']],
  },
  '/online-javascript-playground-live-preview': {
    title: 'Online JavaScript Playground with Live Preview', description: 'Test browser JavaScript beside HTML and CSS in an isolated live preview with local save and ZIP export.', heading: 'Online JavaScript Playground with Live Preview', summary: 'Test browser JavaScript beside HTML and CSS, then rerun the isolated preview whenever you change the code.', answer: 'Myztic is useful for DOM events, interface behavior, calculations, and small client-side JavaScript experiments.', schemaType: 'TechArticle', rows: [['Preview', 'Explicit Run and Stop controls'], ['Good for', 'DOM events, UI state, calculations, and small prototypes'], ['Not for', 'Node.js, npm packages, remote APIs, or backend code']], questions: [['Does JavaScript update the preview live?', 'Press Run or Ctrl+Enter to rebuild and execute the current code.'], ['Can I stop a preview?', 'Yes. Stop removes the running preview document.'], ['Can I call an external API?', 'No. Network connections are blocked.']],
  },
  '/download-html-css-js-project-as-zip': {
    title: 'Download an HTML CSS JavaScript Project as a ZIP', description: 'Download connected index.html, styles.css, and script.js files from a browser playground in one ZIP.', heading: 'Download an HTML CSS JavaScript Project as a ZIP', summary: 'Turn the code in three browser editors into an ordinary three-file frontend project you can keep.', answer: 'Run the project, choose Download ZIP, extract the archive, and open index.html or the folder in your preferred editor.', schemaType: 'TechArticle', rows: [['File 1', 'index.html'], ['File 2', 'styles.css'], ['File 3', 'script.js'], ['Myztic runtime or analytics', 'Not included']], questions: [['Can I download HTML CSS and JavaScript together?', 'Yes. Myztic packages the three connected files into one ZIP.'], ['Can I open the project offline?', 'Yes, if your own code does not depend on remote resources.'], ['Can I import the ZIP again?', 'Not currently.']],
  },
  '/local-save-code-playground': {
    title: 'Local Save Code Playground: How Browser Storage Works', description: 'Learn how Myztic saves the latest project in the current browser profile and why ZIP export is the best backup.', heading: 'Local Save Code Playground: How Browser Storage Works', summary: 'Keep the latest project in the current browser profile without creating a cloud account.', answer: 'Myztic stores editor contents in local browser storage on the same device and browser profile; it does not sync projects between devices.', schemaType: 'TechArticle', rows: [['Storage location', 'Current browser profile on the current device'], ['Cloud sync', 'No'], ['Survives cleared site data', 'No'], ['Recommended backup', 'Download ZIP']], questions: [['Where is my code saved?', 'In local storage for the current browser profile.'], ['Does it sync to another device?', 'No. Myztic does not offer cloud project sync.'], ['What happens if I clear browser data?', 'The local project may be permanently removed.'], ['How should I back up important code?', 'Export a ZIP and store it somewhere you control.']],
  },
  '/browser-based-frontend-playground': {
    title: 'Browser-Based Frontend Playground for HTML CSS and JavaScript', description: 'Prototype browser-native HTML, CSS, and JavaScript without installing an editor, runtime, package manager, or build tool.', heading: 'Browser-Based Frontend Playground for HTML CSS and JavaScript', summary: 'Prototype a small frontend interface in a modern browser without installing an editor, runtime, package manager, or build tool.', answer: 'Myztic provides separate HTML, CSS, and JavaScript editors plus an isolated preview for learning, demos, UI tests, and small prototypes.', schemaType: 'Article', rows: [['Installation', 'None'], ['Runtime', 'Modern web browser'], ['Languages', 'HTML, CSS, and client-side JavaScript'], ['Best scope', 'Small frontend experiments'], ['Upgrade path', 'Export a ZIP and continue locally']], questions: [['What is a browser-based frontend playground?', 'An online workspace that edits and previews client-side code without local setup.'], ['Do I need npm?', 'No. Myztic uses browser-native code.'], ['Can it replace a full development environment?', 'Not for frameworks, backends, testing, source control, or large projects.']],
  },
}

const escapeHtml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
const source = await readFile(join(outputRoot, 'index.html'), 'utf8')

for (const [path, page] of Object.entries(pages)) {
  const canonical = `${baseUrl}${path}`
  const graph = [
    { '@type': page.schemaType ?? 'WebPage', name: page.title, url: canonical, description: page.description, dateModified: '2026-07-22', isPartOf: { '@type': 'WebSite', name: 'Myztic Playground', url: `${baseUrl}/` } },
    { '@type': 'FAQPage', mainEntity: page.questions.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })) },
  ]
  if (path.includes('/alternatives/') || path.includes('-vs-')) graph.push({
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Myztic Playground', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Comparisons', item: `${baseUrl}/codepen-vs-jsfiddle-vs-myztic-playground` },
      { '@type': 'ListItem', position: 3, name: page.title, item: canonical },
    ],
  })
  if (path === '/changelog') graph.push({
    '@type': 'ItemList', name: 'Myztic Playground July 2026 updates',
    itemListElement: ['No-signup HTML, CSS, and JavaScript editor', 'Live preview', 'Local browser save', 'ZIP export', 'Comparison and support guides'].map((name, index) => ({ '@type': 'ListItem', position: index + 1, name })),
  })
  const schema = { '@context': 'https://schema.org', '@graph': graph }
  const rowMarkup = page.rows?.length ? `<section><h2>At a glance</h2><div class="feature-table" role="table">${page.rows.map(([label, value]) => `<div class="feature-row" role="row"><strong role="rowheader">${escapeHtml(label)}</strong><span role="cell">${escapeHtml(value)}</span></div>`).join('')}</div></section>` : ''
  const sectionMarkup = page.sections?.map(([heading, text]) => `<section><h2>${escapeHtml(heading)}</h2><p class="guide-paragraph">${escapeHtml(text)}</p></section>`).join('') ?? ''
  const relatedMarkup = `<aside class="related-links"><h2>Keep exploring</h2><div><a href="/">Homepage →</a><a href="/codepen-vs-jsfiddle-vs-myztic-playground">Choose a playground →</a><a href="/alternatives/codepen">CodePen comparison →</a><a href="/alternatives/jsfiddle">JSFiddle comparison →</a><a href="/export-html-css-js-zip">ZIP export →</a><a href="/for-teachers">For teachers →</a><a href="/privacy">Privacy →</a><a href="/safe-javascript-playground">JavaScript safety →</a></div></aside>`
  const fallback = `<div class="site-shell"><header class="site-header"><nav class="site-nav" aria-label="Primary navigation"><a class="site-brand" href="/">Myztic <strong>Playground</strong></a><div class="site-links"><a href="/examples">Examples</a><a href="/for-teachers">For teachers</a><a href="/codepen-vs-jsfiddle-vs-myztic-playground">Compare</a><a class="nav-cta" href="/app">Open playground →</a></div></nav></header><main><section class="page-hero guide-hero section-wrap"><p class="eyebrow">Myztic Playground</p><h1>${escapeHtml(page.heading)}</h1><p>${escapeHtml(page.summary)}</p><p class="updated">Last updated July 22, 2026</p></section><article class="guide-content section-wrap"><section class="answer-block"><h2>Quick answer</h2><h3>${escapeHtml(page.heading)}</h3><p>${escapeHtml(page.answer ?? page.summary)}</p></section>${rowMarkup}${sectionMarkup}<section><h2>Frequently asked questions</h2><div class="guide-faq">${page.questions.map(([question, answer]) => `<article><h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p></article>`).join('')}</div></section>${relatedMarkup}</article><section class="final-cta section-wrap"><div><h2>Turn an idea into a working page.</h2><p>No setup, account, or payment details required.</p></div><a class="primary-cta" href="/app">Open playground →</a></section></main></div>`
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
