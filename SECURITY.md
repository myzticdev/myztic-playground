# Security Policy

## Security model

Myztic Playground is a client-only static application. It has no backend, API routes, database, accounts, or server-side code execution. User code is kept in the browser's `localStorage` and is sent with `postMessage` to a separate, one-shot static preview document. That document executes only in an iframe configured with exactly `sandbox="allow-scripts"`.

The preview does not receive `allow-same-origin`, so it has an opaque origin and cannot read the parent app's DOM or browser storage. Tokens for forms, popups, downloads, top navigation, and modals are deliberately absent. A preview-document Content Security Policy blocks network connections, frames, plugins, forms, and base URL changes. The main application has a separate CSP that prohibits inline JavaScript, and the nginx configuration adds defense-in-depth headers.

The browser regression suite locks these boundaries against accidental changes. Run it with `npm run test:e2e` after installing Chromium once with `npm run test:e2e:install`.

The production regression suite additionally verifies the actual nginx response
headers and Docker-served application. Start the container with
`docker compose up --build -d`, then run `npm run test:e2e:production`.

## Optional analytics boundary

Deployment analytics is disabled by default and is limited to the main
application. The loader accepts only Umami or Google, validates the provider's
identifier and script origin, requires an exact configured hostname match, and
honors Do Not Track and Global Privacy Control. Analytics configuration is public
build-time data, never a place for secrets. User previews retain `connect-src
'none'`, and exported projects never receive the playground's tracker.

## Known limitations

The sandbox is a capability boundary, not a resource limit. An infinite loop, runaway allocation, or expensive rendering operation can freeze or crash the visitor's own browser tab, sometimes before Stop can respond. Run untrusted snippets cautiously and use a current browser.

A sandboxed frame is allowed to request navigation of its own browsing context.
The parent CSP blocks external frame destinations, and production responses other
than the dedicated preview use `X-Frame-Options: DENY`, so this cannot navigate the
top-level application or display another application route in production. A
same-origin navigation attempt may still send a request to the static server. The
application has no authenticated endpoints or private server-side data, but this is
an accepted browser-platform limitation and is covered by a regression test.

Locally stored code is not encrypted. People or software with access to the same browser profile may be able to retrieve it.
Saved code also runs automatically inside the sandbox when the playground is opened. This is intentional for continuity, so shared browser profiles should not be used for sensitive code.

## Reporting a vulnerability

Please report vulnerabilities privately to the repository owner. Include reproduction steps, the affected version or commit, browser details, and the expected security impact. Do not include secrets or personal information in the report. Please allow time for investigation before public disclosure.
