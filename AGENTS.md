# LUNORA — sandbox notes

Notes that are not obvious from the manifests.

## Running

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

- `web` (Vite dev server) is the only public entry point: host port **3000** → container 5173.
- `api` (Express) listens on container port 8000 and is also mapped to host 8000 for debugging.
- The browser only ever calls `/api/*` on port 3000; Vite proxies it to `http://api:8000`, so the
  app is same-origin and needs no CORS or cross-site cookie handling.

## Gotchas

- **Dependencies install on boot.** `web/node_modules` and `api/node_modules` live on the bind mount
  and are created by `npm install` in each service's `command`. A cold start therefore takes ~20–40 s;
  the healthchecks allow for it.
- **Data lives in `api/data/store.json`**, seeded from `api/src/seed.js` on first boot. Delete that file
  to reset the catalogue, orders, newsletter and contact messages. `api/data` is git-ignored.
- **`node --watch` only watches imported modules**, not `api/data`, so writing orders never restarts the API.
- **Preview proxy + HMR:** `web/vite.config.js` switches the HMR client to `wss://…:443` only when
  `BASE44_PREVIEW_MODE=1`. Vite's `server.allowedHosts` is extended through the platform-supplied
  `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` variable. Both are passed through compose; nothing is
  hardcoded to a sandbox host.
- **Photography is hotlinked** from `images.pexels.com` with crop parameters in the URL. Every URL in
  `api/src/seed.js` was checked to return HTTP 200; replacing products means replacing those ids.
- No Base44 SDK, entities or connectors are used — this is a plain Vite + Express app with its own
  JSON data layer.

## Verifying the app is alive

```bash
curl -s http://localhost:3000/ | head -20          # Vite HTML shell
curl -s http://localhost:3000/api/health           # {"ok":true,...} through the proxy
curl -s "http://localhost:3000/api/products?limit=2"
```
