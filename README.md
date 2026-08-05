# RAM STORES Billing & Inventory Management System

A production-ready billing and inventory management application for RAM STORES built with React, Vite, Tailwind CSS, Express, and MySQL.

## Features

- Admin and staff authentication with JWT
- Role-based access control
- Dashboard with KPIs and charts
- Product, category, brand, supplier, and customer management
- Live inventory tracking and stock history
- Offline and online billing flows
- Thermal receipt printing support
- Reporting for sales, inventory, profit, GST, and more
- Settings, activity logs, backups, and restore-ready database design

## Tech stack

- Frontend: React, Vite, Tailwind CSS, React Router, React Query, Axios
- Backend: Node.js, Express.js
- Database: MySQL
- Authentication: JWT, bcrypt
- Security: Helmet, CORS, rate limiting, input validation
- Deployment: Docker, Docker Compose, Nginx

## Project structure

- `backend/` — Express API server
- `frontend/` — React application
- `database/` — SQL schema and seed data

## Local setup

1. Clone the repository.
2. Copy environment templates:
   - `cp backend/.env.example backend/.env`
   - `cp frontend/.env.example frontend/.env`
3. Install dependencies:
   - `npm install`
4. Create and configure MySQL database.
5. Run the app:
   - `npm run dev`

## Production build

```bash
docker compose up --build
```

## Default credentials

- Admin: `admin@ramstores.in` / `Admin@123`
- Staff: `staff@ramstores.in` / `Staff@123`

## Notes

- Update the environment variables and MySQL credentials before deployment.
- Use a proper reverse proxy and TLS termination in production.
- For thermal receipt printing, use a browser-compatible 58mm ESC/POS printer with supported print integration.
