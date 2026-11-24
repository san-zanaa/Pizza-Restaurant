# PizzaHub — Client (Next.js)

Frontend for the PizzaHub platform — a pizza ordering & delivery platform.
Customers discover local pizzerias, browse menus, place orders; vendors run a
dashboard for their restaurant; admins manage users and review content.

## Project Name

PizzaHub Client

## Description

Next.js (App Router) + TypeScript frontend for PizzaHub, with Better Auth for
authentication (email + password and Google OAuth), role-based routing
(customer / vendor / admin), a fully branded pizza-themed UI, Stripe Checkout
flows for vendor subscriptions, and real-time-ish polling on payment success.

## Table of Contents

- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running the Client](#running-the-client)
- [Scripts](#scripts)
- [Development Notes](#development-notes)
- [Links](#links)

## Key Features

- **Authentication:** Better Auth (email + password, Google OAuth); role
  selection (vendor / customer) on sign-up; admin creation only via DB/sign-in.
- **Navbar:** role-aware links (Home, Browse Menu, Dashboard…), profile
  dropdown (Dashboard, Profile Settings, Logout), immediate updates after auth
  state changes, cart icon, mobile drawer.
- **Home:** hero banner, featured menu items (from DB), category showcase,
  `Why Choose PizzaHub?` section.
- **Browse Menu:** public, responsive card grid (approved items only), search,
  location filter, category chips, **sort by price asc/desc**.
- **Item Details:** name, multiple images, category, description, price,
  location, vendor, order form (delivery date, address, message).
- **Dashboards (role-protected):**
  - Vendor: overview, add/edit menu, my items (status/availability),
    customer orders (accept/reject), subscription.
  - Customer: overview (totals), my orders (cancel pending).
  - Admin: overview, manage users (search/filter, block/unblock), manage menu
    items (approve/reject/delete), transactions ledger.
- **Stripe Checkout:** vendors upgrade via `POST /api/subscription/checkout`
  (proxied to the server), success/cancel pages; Premium activated only after
  verified webhook.
- **Premium limits:** free vendors get 3 active items (server-enforced).
- **Loaders & empty states, toasts (no browser `alert()`), error pages,
  responsive design, Framer Motion on the home sections.

## Tech Stack

Frontend: Next.js (App Router), TypeScript/JavaScript
UI: ShadCN UI + custom components (reusable `components/ui/*`), Tailwind CSS
Animations: Framer Motion (`fade-in`), theme via next-themes
Auth: Better Auth + MongoDB adapter; JWT minted via `app/api/auth/token`
API layer: `lib/client-fetch.ts` (Bearer token fetch, retry on 401)

## Environment Variables

Create `.env` in this repository (see `.env.example` style — `.env` is gitignored):

| Variable | Purpose | Required |
|---|---|---|
| `BETTER_AUTH_SECRET` | Better Auth secret (min 32 chars) | Yes |
| `BETTER_AUTH_URL` | Base URL used by Better Auth | No (defaults to localhost:3000) |
| `NEXT_PUBLIC_API_BASE_URL` | Backend URL of the server repo (e.g. `http://localhost:5000/api`) | No (defaults to `http://localhost:5000/api`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes (payments) |
| `STRIPE_SECRET_KEY` | Stripe secret key (used by the server) | Yes (payments) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth (optional; both must be set to enable the Google button) | No |
| `MONGODB_URL` | Used by `lib/db.ts` (Better Auth session storage) | Yes |
| `JWT_SECRET` | Shared with the server (see the server README) | Yes |
| `NEXT_PUBLIC_IMGBB_API_KEY` | Optional ImgBB key — when set, vendor menu forms get an "Upload with ImgBB" button | No |

Notes:

- Never commit real secrets — `.env` is ignored by git.

## Installation

```bash
npm install
```

## Running the Client

```bash
npm run dev
```

Open http://localhost:3000. The API calls are proxied to the server via
`lib/server-api.ts` (`NEXT_PUBLIC_API_BASE_URL`, default `http://localhost:5000/api`).

Production: `npm run build` then `npm start` (requires `.env` set).

## Scripts

```bash
npm run dev        # next dev
npm run build      # next build (type-checks and lints)
npm start          # next start
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Development Notes

- Protected routes: `/dashboard/*`, `/menu/[id]`, `/payment/success`,
  `/dashboard/settings` redirect unauthenticated users to `/sign-in`; the
  server re-verifies role/blocked on every protected API call.
- Role guard: public sign-up coerces any role other than vendor to `customer`.
  Admins are only created outside the public flow (DB seed / support).
- The server verifies JWT + re-reads the user, so role changes take effect
  immediately.
- Search uses the `q` query param (debounced), location uses `location`, and
  `sort=price_asc|price_desc` is forwarded to `GET /api/menu`.

## Links

- Live Website: `http://localhost:3000` (set `BETTER_AUTH_URL` / `NEXT_PUBLIC_API_BASE_URL` in production)
- Client Repository: https://github.com/your-org/pizzahub-client
- Server Repository: https://github.com/your-org/pizzahub-server

## Submission Info (PizzaHub — Pizza Ordering & Delivery Platform)

- Admin Email: (not stored in the repo; set up via the product/support team)
- Live Site Link: (see [Links](#links))
- GitHub Repository (Server): https://github.com/your-org/pizzahub-server
- GitHub Repository (Client): https://github.com/your-org/pizzahub-client
