Production Setup

Option A: Docker (recommended)
- Prereqs: Docker & Docker Compose installed.
- From the repo root, run:
  - JWT_SECRET=your_secret docker compose -f deployment/docker-compose.yml up --build
- Access:
  - Frontend: http://localhost/
  - Backend: http://localhost:3001/

Option B: Bare metal
- Backend:
  - cd backend && npm ci && npm run generate && npm run build && JWT_SECRET=your_secret npm start
- Frontend:
  - cd frontend && npm ci && npm run build
  - Serve build/ via any static server or Nginx using deployment/nginx.conf
- Nginx:
  - Use deployment/nginx.conf and point root to the frontend build directory
  - Ensure the /api/ proxy points to the backend (default: http://localhost:3001/)

Default Admin
- Email: admin@example.com
- Password: admin123

