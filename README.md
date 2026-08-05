# E-Pharmacy

A full-stack pharmacy e-commerce web app: browse and search medicine, find nearby pharmacies, manage a cart, and check out. Built as a GoIT bootcamp project from a Figma design and functional specification (see `PROJECT.md`).

**Figma design:** https://www.figma.com/file/qrKzOBVqM6zOZNFkTOpEO0/E-PHARMACY-(clients)?type=design&node-id=0-1&mode=design

## What it does

- Guest visitors can browse the home page, the full store directory, and product detail pages.
- Registering or logging in unlocks the medicine catalog (search, category filter, pagination) and the cart/checkout flow.
- Clicking "Add to cart" as a guest opens an inline login/sign-up modal; on success, the item is added automatically and the guest continues where they left off.
- Checkout collects shipping info and a payment method, then places an order and clears the cart.

## Tech stack

**Client** (`client/`): React 19 + TypeScript, Vite, React Router, Redux Toolkit + redux-persist, Formik + Yup, Axios, CSS Modules, react-toastify.

**Server** (`server/`): Node.js + Express + TypeScript, MongoDB + Mongoose, JWT access/refresh auth (bcrypt-hashed passwords, httpOnly refresh cookie), Yup request validation, `@faker-js/faker` seed script.

## Project structure

```
client/   React SPA (Vite)
server/   Express REST API (MongoDB)
design/   Reference-only Figma exports (CSS dumps + screenshots) — not used by the app
```

Each of `client/` and `server/` is an independent npm project with its own `package.json`, `.env.example`, and lockfile — deploy them separately (e.g. server on Render, client on Netlify/Vercel).

## Getting started

### 1. Prerequisites

- Node.js 20+
- A MongoDB connection string (e.g. a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster, or a local `mongod`)

### 2. Install dependencies

```bash
npm install --prefix server
npm install --prefix client
npm install   # root — installs `concurrently` for the combined dev script
```

### 3. Configure environment variables

Copy each `.env.example` to `.env` and fill in real values:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

`server/.env` needs a real `MONGODB_URI`. The two JWT secrets can be any long random strings for local development.

### 4. Seed the database

Generates realistic mock stores, products, reviews, and one demo user:

```bash
npm run seed --prefix server
```

This prints a demo login (`demo@epharmacy.test` / `password123`) you can use immediately without registering.

### 5. Run it

```bash
npm run dev
```

This runs the API on `http://localhost:5000` and the client on `http://localhost:5173` (its dev server proxies `/api` to the backend, so no CORS configuration is needed locally).

### 6. Build for production

```bash
npm run build --prefix server   # compiles TypeScript to server/dist
npm run build --prefix client   # outputs static assets to client/dist
```

## Deployment

- **Server → Render** (or similar): root directory `server`, build command `npm install && npm run build`, start command `npm start`. Set the env vars from `server/.env.example`, using your production `CLIENT_ORIGIN`.
- **Client → Netlify or Vercel**: base directory `client`, build command `npm run build`, publish directory `client/dist`. Set `VITE_API_BASE_URL` to your deployed API's URL (e.g. `https://your-api.onrender.com/api`). A `public/_redirects` file is included for Netlify's SPA routing fallback.

## Notes on scope

- Seed data (stores, products, reviews) is generated with `@faker-js/faker` since no production dataset was provided — see `server/src/seed/`.
- The cart API extends the endpoint list in `PROJECT.md` with `POST /cart/add` and `DELETE /cart/item/:productId`, and adds `POST /user/refresh`, `GET /products/categories`, and `GET /products/:id/reviews`, which the described UI/auth flows require but the original endpoint table omitted.
