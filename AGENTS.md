# LUNORA — project notes for agents

Persian (RTL) luxury-fashion storefront. React + Vite client, Express + Postgres API.

## Running it

```
docker compose -f docker-compose.base44.yml up -d --build
```

- `web` (port 3000) is the only public entry point. Vite proxies `/api/*` to the `api`
  service (port 8000) so the session cookie stays same-origin — do not split them onto
  separate public ports, login would break.
- `migrate` is a one-shot service: it runs `server/src/schema.sql` and seeds the catalog.
  It only inserts products when the `products` table is empty.
- Re-seed after editing `server/src/data/catalog.js`:
  ```
  docker compose -f docker-compose.base44.yml exec -T db psql -U lunora -d lunora \
    -c 'truncate table products, categories cascade;'
  docker compose -f docker-compose.base44.yml exec -T api node src/setup.js
  ```
- Backend restarts itself with `node --watch`; the client hot-reloads. No build step in dev.

## Things that are easy to get wrong

- **Fonts:** IRANYekan / IRANYekanX are commercial and are *not* bundled. The stack in
  `client/tailwind.config.js` lists them first, then the bundled Vazirmatn Variable
  (`@fontsource-variable/vazirmatn`) which actually renders today. To switch to IRANYekan,
  add licensed `@font-face` files and nothing else needs to change.
- **Hero is static by design.** `client/src/components/home/Hero.jsx` must stay a single
  fixed image of four models (two men, two women). No slider, carousel, autoplay or dots.
- **Persian text must not be letter-spaced** (`tracking-*` breaks the script). Latin brand
  names are the exception. Use `toFa()` / `Intl` fa-IR for numerals.
- **No invented data:** catalog ratings are `null` and the UI hides the star row when a
  product has no reviews. Contact/social values in `client/src/config/site.js` are empty on
  purpose — the UI hides them instead of showing fake details.
- **Cart and wishlist are `localStorage` only** (`lunora_cart_v1`, `lunora_wishlist_v1`).
  They are not tied to an account. Orders are server-side.
- **Never trust client prices:** `POST /api/orders` re-reads products, validates sizes/colors
  and stock, and recomputes subtotal/shipping/total from the database.
- **Integrations not connected:** no payment gateway and no email provider. Checkout creates
  an order with `payment_status = 'unpaid'`, `order_status = 'awaiting_payment'`, and the UI
  says so. Newsletter stores the address and states that email delivery is not configured.
  Stock is not decremented on unpaid orders — wire that to the payment webhook when one exists.

## Sandbox-only configuration

- `BASE44_PREVIEW_MODE=1` is passed through compose. Vite uses it to (a) allow the rotating
  sandbox hostname (`.<BASE44_SANDBOX_HOST_DOMAIN>`) and (b) point HMR at `wss` on port 443.
  With the flag unset, `allowedHosts`/`hmr` are left at Vite's defaults, so local/normal
  production behaviour is unchanged.
- `JWT_SECRET` arrives via `/run/base44/app.env` (loaded after `.env.base44-defaults`, which
  only holds a build placeholder so a fresh clone boots).

## Verifying

- API: `curl http://localhost:3000/api/health` → `{"ok":true}`,
  `curl "http://localhost:3000/api/products?featured=1&perPage=6"`.
- Order flow: add an item, `POST /api/orders`, then
  `GET /api/orders/<number>?email=<the email used>` — the same email is required for guests.
- There is no automated test suite in this repo yet; checks above are manual.
