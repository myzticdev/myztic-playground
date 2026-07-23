# Myztic Playground

Myztic Playground is a free, no-signup HTML/CSS/JavaScript playground with live preview, local browser save, and ZIP export. It is built for beginners, teachers, prototypers, and developers who need a fast frontend testing space without accounts or setup.

The lightweight, self-hosted app provides three local code editors, an explicit **Run** action, and browser-only ZIP export without a database, API routes, or any server-side code execution. Work is automatically stored in the visitor's browser using `localStorage`. ZIP exports contain a wired-together `index.html`, `styles.css`, and `script.js`.

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

## Optional deployment analytics

Analytics is disabled by default. Official or individual deployments can enable
one validated provider at build time without placing their configuration in the
repository or downloaded projects. Tracking runs only when the configured host
exactly matches the browser hostname and the visitor has not enabled Do Not
Track or Global Privacy Control.

Umami Cloud:

```env
VITE_ANALYTICS_PROVIDER=umami
VITE_ANALYTICS_SITE_ID=your-website-id
VITE_ANALYTICS_SCRIPT_URL=https://cloud.umami.is/script.js
VITE_ANALYTICS_HOST=playground.example.com
```

Self-hosted Umami uses the same variables and accepts any explicitly configured
HTTPS tracker URL:

```env
VITE_ANALYTICS_PROVIDER=umami
VITE_ANALYTICS_SITE_ID=your-website-id
VITE_ANALYTICS_SCRIPT_URL=https://analytics.example.com/script.js
VITE_ANALYTICS_HOST=playground.example.com
```

Google Analytics 4:

```env
VITE_ANALYTICS_PROVIDER=google
VITE_ANALYTICS_SITE_ID=G-ABC123XYZ
VITE_ANALYTICS_SCRIPT_URL=
VITE_ANALYTICS_HOST=playground.example.com
```

For Dokploy Compose deployments, place these values in the application's
**Environment** editor and redeploy with a rebuild. The Compose file passes them
as Docker build arguments because Vite configuration is compiled into the static
bundle. `VITE_*` values are public browser configuration and must never contain
passwords, API tokens, or other secrets.

Analytics providers may have different cookie, consent, disclosure, and data
processing requirements. The deployment owner is responsible for configuring
the selected provider and any consent flow required by their visitors' laws and
jurisdictions.

Self-hosted Umami HTTPS URLs are supported without editing the repository. The
build derives the script origin from `VITE_ANALYTICS_SCRIPT_URL` and grants only
that origin access in the main document's generated CSP. Empty/default builds
contain no analytics provider origins. Unsafe HTTP URLs and URLs containing
credentials fail validation. The sandboxed preview retains `connect-src 'none'`,
and ZIP exports contain no playground analytics configuration.

## Deploy on Dokploy

1. Create a new application in Dokploy and connect this Git repository.
2. Choose **Dockerfile** as the build type. The included Dockerfile builds the Vite app and serves it with nginx.
3. Set the container port to `80` and attach your domain.
4. Deploy. No environment variables, volumes, database, or API service are required.

Dokploy can also deploy the included Compose file. In that case, point the domain at the `myztic-playground` service on port `80`; the host-side `8080` mapping is mainly for local use.

## IndexNow and AI discovery

The production build publishes:

- `/9f7d9b5a34954b3f95263711726516fd.txt` — the root IndexNow ownership key.
- `/sitemap.xml` — the complete crawlable URL inventory.
- `/llms.txt` — a concise Markdown map of the product, primary pages, comparisons, policies, and project links.

After deploying the key file and updated pages, notify IndexNow about selected
changed URLs:

```bash
npm run indexnow:submit -- /changed-page /another-changed-page
```

For the initial rollout or a genuine site-wide update, submit the complete
sitemap:

```bash
npm run indexnow:submit -- --sitemap
```

The command verifies that the public key URL returns the expected key before it
sends a bulk POST to `https://api.indexnow.org/indexnow`. HTTP `200` and the
first-use `202` response are accepted. Use the dry run to inspect the payload
without network access:

```bash
npm run indexnow:dry-run
```

The **Submit URLs to IndexNow** GitHub Actions workflow runs automatically after
every push to `main`. It waits five minutes for Dokploy, verifies the deployed
key, submits the sitemap, and retries twice at one-minute intervals if the site
or IndexNow endpoint is temporarily unavailable. The workflow can also be run
manually: leave its URL input blank for the sitemap, or provide space-separated
changed paths.

This small static site submits its 20-URL sitemap after a production merge.
Manual runs should normally include only URLs that were added, updated,
redirected, or deleted; the sitemap remains the complete long-term inventory.

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
- `npm run indexnow:submit` — verify the deployed key and notify IndexNow
- `npm run indexnow:dry-run` — print the sitemap submission payload without sending it
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
