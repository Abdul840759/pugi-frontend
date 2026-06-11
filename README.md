# PUGI - Tech Learning Platform

A modern LMS frontend built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- **Multi-role dashboards**: Learner, Tutor, and Admin
- **Authentication**: JWT-ready auth with persistent login
- **Role-based routing**: Protected routes per user role
- **Dark/Light mode**: Theme toggle with system preference detection
- **Data visualization**: Charts (Recharts), progress bars, skill tree
- **Mock API layer**: Ready to connect to a backend

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router v7
- Context API (Auth, Theme, Toast)
- Axios (with JWT interceptors)
- Framer Motion
- Recharts
- Lucide React icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Demo Accounts

| Role    | Email              | Password     |
|---------|--------------------|--------------|
| Learner | learner@pugi.com   | password123  |
| Tutor   | tutor@pugi.com     | password123  |
| Admin   | admin@pugi.com     | password123  |

## Project Structure

```
src/
├── assets/
├── components/     # Reusable UI components
├── context/        # Auth, Theme, Toast providers
├── hooks/          # Custom hooks
├── layouts/        # Role-based layouts
├── pages/          # Route pages by role
├── routes/         # App routing
├── services/       # API services (mock-ready)
├── types/          # TypeScript types
└── utils/          # Helpers and constants
```

## Backend Integration

Set `VITE_API_URL` in `.env` to point to your API. The Axios instance in `src/services/api.ts` handles JWT tokens automatically.

## Scripts

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint
