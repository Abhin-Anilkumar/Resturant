ByteBistro — Restaurant Management App

Overview
- Full‑stack TypeScript app for basic restaurant management.
- Backend: Express + Prisma (SQLite) with JWT auth; endpoints for auth, menu, tables, and orders.
- Frontend: React (CRA) with Bootstrap; dashboards and CRUD flows for menu, tables, and orders.
- Deployment: Nginx static hosting for frontend with `/api` proxy to backend; Docker Compose included.

Structure
- `backend/`: Express server, Prisma schema, seed script, TypeScript source.
- `frontend/`: React app (TypeScript) with routes and services.
- `deployment/`: Nginx configs, Dockerfiles, and Compose file.

Backend
- Tech: Node 20+, Express 5, Prisma, SQLite.
- Env: create `backend/.env` with:
  - `DATABASE_URL="file:./dev.db"` (default)
  - `JWT_SECRET=your_secret`
- Scripts:
  - `npm run dev` — start in dev (nodemon + ts-node)
  - `npm run generate` — generate Prisma client
  - `npm run seed` — seed admin, menu items, tables
  - `npm run build` / `npm start` — build and run in production
- API
  - `POST /api/auth/register` — { email, password, role? }
  - `POST /api/auth/login` — returns JWT { token }
  - `GET /api/menu` — public list
  - `POST /api/menu` — admin create
  - `PUT /api/menu/:id` — admin update
  - `DELETE /api/menu/:id` — admin delete
  - `GET /api/tables` — public list
  - `POST /api/tables` — admin create
  - `PUT /api/tables/:id` — admin update (number/status)
  - `GET /api/orders` — auth list
  - `POST /api/orders` — auth create { tableId, items: [{ menuItemId, quantity }] }
  - `PUT /api/orders/:id/status` — auth update status (PENDING/SERVED/CANCELED/PAID)

Frontend
- Tech: CRA 5 (TypeScript), React, Bootstrap.
- Dev proxy: `frontend/package.json` has `"proxy": "http://localhost:3001"` for `/api`.
- Env (optional): `REACT_APP_API_BASE=http://localhost:3001` when not using the proxy.
- Scripts:
  - `npm start` — dev server
  - `npm run build` — production build
- Auth: Stores JWT token in `localStorage` (can be upgraded to HttpOnly cookies).

Development Setup
1) Backend
   - `cd backend && npm ci && npm run generate && npm run dev`
   - Seed data: `npm run seed`
   - Default admin: `admin@example.com` / `admin123`
2) Frontend
   - `cd frontend && npm ci && npm start`
   - Open http://localhost:3000 (or 3002 if 3000 is busy)

Production Setup
- Docker (recommended):
  - From repo root: `JWT_SECRET=your_secret docker compose -f deployment/docker-compose.yml up --build`
  - Frontend at http://localhost/, Backend at http://localhost:3001/
- Bare metal:
  - Backend: `cd backend && npm ci && npm run generate && npm run build && JWT_SECRET=your_secret npm start`
  - Frontend: `cd frontend && npm ci && npm run build`
  - Serve `frontend/build` via Nginx using `deployment/nginx.conf` (proxies `/api` to `:3001`).

Notes
- Consider migrating to Vite or pinning React 18 for smoother builds than CRA + React 19.
- Improve security by moving JWT from localStorage to HttpOnly cookies if needed.
- There is a duplicate `achu/` subdirectory that mirrors parts of the repo; consider removing to avoid confusion.

