import { useEffect, useMemo, useState } from 'react'
import { strToU8, zipSync } from 'fflate'
import { trackAnalyticsEvent } from './analytics'

type Language = 'html' | 'css' | 'javascript'

type PlaygroundCode = Record<Language, string>

const STORAGE_KEY = 'myztic-playground:code:v1'
const GITHUB_REPOSITORY_URL: string = 'https://github.com/myzticdev/myztic-playground'

const starterCode: PlaygroundCode = {
  html: `<main class="card">
  <span class="eyebrow">MYZTIC PLAYGROUND</span>
  <h1>Make something <em>wonderful.</em></h1>
  <p>Edit the code, then press Run to bring it to life.</p>
  <button id="spark">Add some magic</button>
</main>`,
  css: `:root {
  color-scheme: dark;
  font-family: Inter, system-ui, sans-serif;
}

* { box-sizing: border-box; }

body {
  min-height: 100vh;
  margin: 0;
  display: grid;
  place-items: center;
  color: #f6f4ff;
  background: radial-gradient(circle at top, #322356, #0b0b12 58%);
}

.card {
  width: min(88vw, 560px);
  padding: 3rem;
  border: 1px solid #ffffff1c;
  border-radius: 24px;
  background: #12111dcc;
  box-shadow: 0 30px 90px #0008;
}

.eyebrow { color: #b99cff; font-size: .72rem; letter-spacing: .18em; }
h1 { margin: .8rem 0; font-size: clamp(2.2rem, 8vw, 4.4rem); line-height: .96; }
em { color: #b99cff; font-style: normal; }
p { color: #aaa5ba; line-height: 1.6; }
button { margin-top: 1rem; padding: .85rem 1.1rem; border: 0; border-radius: 10px; font-weight: 700; cursor: pointer; }
button:hover { background: #c7b4ff; }`,
  javascript: `const button = document.querySelector('#spark');

button.addEventListener('click', () => {
  const colors = ['#b99cff', '#ff9ed2', '#8ee6d0', '#ffd479'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  document.querySelector('em').style.color = color;
  button.textContent = 'Magic added ✦';
});`,
}

function loadSavedCode(): PlaygroundCode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return starterCode
    const parsed = JSON.parse(saved) as Partial<PlaygroundCode>
    if (typeof parsed.html === 'string' && typeof parsed.css === 'string' && typeof parsed.javascript === 'string') {
      return parsed as PlaygroundCode
    }
  } catch {
    // Invalid or unavailable browser storage should never prevent the app loading.
  }
  return starterCode
}

function createDownloadHtml(html: string) {
  const stylesheet = '<link rel="stylesheet" href="styles.css">'
  const script = '<script src="script.js" defer></script>'

  if (/<html[\s>]/i.test(html)) {
    let documentHtml = html
    documentHtml = /<\/head>/i.test(documentHtml)
      ? documentHtml.replace(/<\/head>/i, `  ${stylesheet}\n</head>`)
      : documentHtml.replace(/<html([^>]*)>/i, `<html$1>\n<head>${stylesheet}</head>`)
    documentHtml = /<\/body>/i.test(documentHtml)
      ? documentHtml.replace(/<\/body>/i, `  ${script}\n</body>`)
      : `${documentHtml}\n${script}`
    return documentHtml
  }

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Myztic Playground Project</title>
    ${stylesheet}
  </head>
  <body>
    ${html}
    ${script}
  </body>
</html>`
}

const languageLabels: Record<Language, string> = {
  html: 'HTML',
  css: 'CSS',
  javascript: 'JavaScript',
}

export default function App() {
  const [code, setCode] = useState<PlaygroundCode>(loadSavedCode)
  const [activeLanguage, setActiveLanguage] = useState<Language>('html')
  // Restore and run the locally saved preview immediately for a seamless return
  // experience. Execution remains inside the opaque-origin sandbox.
  const [previewCode, setPreviewCode] = useState<PlaygroundCode | null>(loadSavedCode)
  const [isRunning, setIsRunning] = useState(true)
  const [runCount, setRunCount] = useState(0)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(code))
    } catch {
      // Storage may be disabled or full; editing and running still work in memory.
    }
  }, [code])

  const lineCount = useMemo(() => code[activeLanguage].split('\n').length, [code, activeLanguage])

  const updateCode = (value: string) => {
    setCode((current) => ({ ...current, [activeLanguage]: value }))
  }

  const run = () => {
    setPreviewCode(code)
    setIsRunning(true)
    setRunCount((count) => count + 1)
    trackAnalyticsEvent('run_preview')
  }

  const stop = () => {
    setPreviewCode(null)
    setIsRunning(false)
    setRunCount((count) => count + 1)
    trackAnalyticsEvent('stop_preview')
  }

  const resetCode = () => {
    setCode(starterCode)
    setPreviewCode(starterCode)
    setIsRunning(true)
    setRunCount((count) => count + 1)
    trackAnalyticsEvent('reset_code')
  }

  const downloadZip = () => {
    const archive = zipSync({
      'index.html': strToU8(createDownloadHtml(code.html)),
      'styles.css': strToU8(code.css),
      'script.js': strToU8(code.javascript),
    }, { level: 6 })
    const bytes = archive.buffer.slice(archive.byteOffset, archive.byteOffset + archive.byteLength) as ArrayBuffer
    const url = URL.createObjectURL(new Blob([bytes], { type: 'application/zip' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'myztic-playground.zip'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
    trackAnalyticsEvent('download_zip')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand" aria-label="Myztic Playground">
          <span className="brand-mark" aria-hidden="true">✦</span>
          <span>Myztic <strong>Playground</strong></span>
        </div>
        <div className="actions">
          {GITHUB_REPOSITORY_URL ? (
            <a
              className="button button-github"
              href={GITHUB_REPOSITORY_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackAnalyticsEvent('open_github')}
              aria-label="Open GitHub repository"
              title="Open GitHub repository"
            >
              <GitHubIcon />
            </a>
          ) : (
            <button className="button button-github" type="button" disabled aria-label="GitHub repository coming soon" title="GitHub repository coming soon">
              <GitHubIcon />
            </button>
          )}
          <button className="button button-download" type="button" onClick={downloadZip} aria-label="Download ZIP" title="Download ZIP">
            <span className="download-icon" aria-hidden="true">↓</span>
          </button>
          <button className="button button-ghost" type="button" onClick={resetCode} aria-label="Reset code" title="Reset code">
            <span className="reset-icon" aria-hidden="true">↻</span>
          </button>
          <button className="button button-stop" type="button" onClick={stop} disabled={!isRunning} aria-label="Stop" title="Stop preview">
            <span className="stop-icon" aria-hidden="true" />
          </button>
          <button className="button button-run" type="button" onClick={run} aria-label="Run" title="Run preview">
            <span className="play-icon" aria-hidden="true" />
          </button>
        </div>
      </header>

      <main className="workspace">
        <section className="panel editor-panel" aria-label="Code editor">
          <div className="tabs" role="tablist" aria-label="Editor language">
            {(Object.keys(languageLabels) as Language[]).map((language) => (
              <button
                key={language}
                className={`tab tab-${language} ${activeLanguage === language ? 'active' : ''}`}
                type="button"
                role="tab"
                aria-selected={activeLanguage === language}
                onClick={() => setActiveLanguage(language)}
              >
                <span aria-hidden="true">{language === 'html' ? '<>' : language === 'css' ? '#' : 'JS'}</span>
                {languageLabels[language]}
              </button>
            ))}
          </div>
          <div className="editor-wrap">
            <div className="editor-meta">
              <span>{languageLabels[activeLanguage]}</span>
              <span>{lineCount} lines</span>
            </div>
            <textarea
              className="code-editor"
              value={code[activeLanguage]}
              onChange={(event) => updateCode(event.target.value)}
              onKeyDown={(event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                  event.preventDefault()
                  run()
                }
                if (event.key === 'Tab') {
                  event.preventDefault()
                  const target = event.currentTarget
                  const start = target.selectionStart
                  const end = target.selectionEnd
                  updateCode(`${target.value.slice(0, start)}  ${target.value.slice(end)}`)
                  requestAnimationFrame(() => target.setSelectionRange(start + 2, start + 2))
                }
              }}
              spellCheck={false}
              aria-label={`${languageLabels[activeLanguage]} code`}
            />
          </div>
          <footer className="panel-footer">
            <span><i className="status-dot" /> Saved locally</span>
            <span>Ctrl / ⌘ + Enter to run</span>
          </footer>
        </section>

        <section className="panel preview-panel" aria-label="Live preview">
          <div className="preview-header">
            <div>
              <span className="preview-title">Preview</span>
              <span className={`run-status ${isRunning ? 'running' : ''}`}>{isRunning ? 'Running' : 'Stopped'}</span>
            </div>
          </div>
          <div className="preview-frame-wrap">
            {/*
              This sandbox deliberately grants ONLY script execution. In particular,
              allow-same-origin is omitted so preview code receives an opaque origin and
              cannot access this app or its localStorage. Forms, popups, downloads, top
              navigation, and modals are also unavailable because their sandbox tokens
              are intentionally absent. User code is sent one-way to a separate static
              preview document, whose CSP blocks the network, nested frames, plugins,
              forms, and base URL changes.
            */}
            <iframe
              key={runCount}
              className="preview-frame"
              title="User code preview"
              sandbox="allow-scripts"
              src="/preview.html"
              referrerPolicy="no-referrer"
              onLoad={(event) => {
                // An opaque-origin iframe requires '*' as the postMessage target.
                // preview.html accepts one message and verifies its source is this parent.
                event.currentTarget.contentWindow?.postMessage(
                  previewCode
                    ? { type: 'myztic:run', code: previewCode }
                    : { type: 'myztic:stop' },
                  '*',
                )
              }}
            />
          </div>
        </section>
      </main>
    </div>
  )
}

function GitHubIcon() {
  return (
    <svg className="github-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.28-.36 6.72-1.61 6.72-7A5.4 5.4 0 0 0 19.22 4 5 5 0 0 0 19.13.5S17.95.14 15 1.48a13.38 13.38 0 0 0-7 0C5.05.14 3.87.5 3.87.5A5 5 0 0 0 3.78 4a5.4 5.4 0 0 0-1.5 3.5c0 5.42 3.44 6.61 6.72 7A4.8 4.8 0 0 0 8 18v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}
