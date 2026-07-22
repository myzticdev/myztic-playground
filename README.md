# Myztic Playground

Myztic Playground is a lightweight, self-hosted HTML/CSS/JavaScript scratchpad. It provides three local code editors, an explicit **Run** action, a live preview, and a browser-only ZIP export without accounts, a database, API routes, or any server-side code execution. Work is automatically stored in the visitor's browser using `localStorage`. ZIP exports contain a wired-together `index.html`, `styles.css`, and `script.js`.

## Why this design is safer

Unlike a server-side compiler or code runner, Myztic Playground never sends user code to a server and never executes it on the host. Code is passed into a dedicated static preview document running in a browser iframe with an opaque origin. The iframe grants only `allow-scripts`; it does not grant same-origin access, forms, popups, downloads, top navigation, or modals. Its own restrictive Content Security Policy also blocks network connections, nested frames, objects, and form submission. Keeping the preview runtime separate allows the main application to prohibit inline JavaScript in its own CSP.

This significantly reduces the attack surface, but it does not make arbitrary code harmless. See [Security limitations](#security-limitations) and [SECURITY.md](SECURITY.md).

## Run locally

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. To create a production build:

```bash
npm run build
npm run preview
```

## Run with Docker

```bash
docker compose up --build -d
```

Open `http://localhost:8080`. Stop the service with `docker compose down`.

## Deploy on Dokploy

1. Create a new application in Dokploy and connect this Git repository.
2. Choose **Dockerfile** as the build type. The included Dockerfile builds the Vite app and serves it with nginx.
3. Set the container port to `80` and attach your domain.
4. Deploy. No environment variables, volumes, database, or API service are required.

Dokploy can also deploy the included Compose file. In that case, point the domain at the `myztic-playground` service on port `80`; the host-side `8080` mapping is mainly for local use.

## Security limitations

- Infinite loops or resource-heavy code can still freeze or crash the visitor's own browser tab. Because browser JavaScript can monopolize the page's main thread, the Stop button may not respond after such a loop starts.
- Preview code can attempt to navigate its own iframe. External destinations are blocked by the parent CSP and production application responses cannot be framed, but a same-origin request may still reach the static nginx server. It cannot navigate the parent page.
- The sandbox limits capabilities; it does not inspect, sanitize, or prove user code safe.
- Anyone with local access to the same browser profile may be able to read code stored in `localStorage`.
- Browser vulnerabilities are outside the application's control. Visitors should use an up-to-date browser.
- The preview intentionally cannot load images, scripts, fonts, media, or data from the network. Only inline code and permitted `data:`/`blob:` media sources work.

## Project commands

- `npm run dev` — start the Vite development server
- `npm run build` — type-check and create the production build
- `npm run preview` — serve the production build locally
- `npm run test:e2e:install` — install the Chromium test browser once
- `npm run test:e2e` — run browser sandbox regression tests
- `npm run test:e2e:production` — test the already-running Docker/nginx deployment and its real headers

## Security regression tests

The Playwright suite runs user code in a real browser and verifies that normal
preview interactions work while parent-page access, preview storage, networking,
popups, forms, downloads, top navigation, and modals remain blocked. It also
locks the iframe sandbox token and exact preview CSP against accidental changes.

```bash
npm run test:e2e:install
npm run test:e2e
```

For the production-stack checks:

```bash
docker compose up --build -d
npm run test:e2e:production
docker compose down
```

## License

[MIT](LICENSE)
