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

