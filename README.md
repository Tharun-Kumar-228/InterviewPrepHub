# InterviewPrep Hub

A production-ready full-stack MERN (MongoDB, Express, React, Node) application that acts as a collaborative interview preparation community. Students can log real interview experiences, join peer-led study rooms, explore aggregate company analytics, and participate in discussion threads.

---

## Technical Stack & Architecture

### Backend APIs (`/backend`)
*   **Server Core**: Node.js & Express.js.
*   **Database ORM**: MongoDB with Mongoose schemas (strict indices, cascading deletes, compound unique index guards).
*   **Caching Layer**: Redis cache wrapper with dynamic key resolvers (e.g. `cache:userId:url` for profiles vs `guest` for landing pages) to prevent cross-user data exposure. Includes a **graceful fallback** to a custom in-memory Map cache if the Redis server is offline.
*   **Logging & Errors**: Morgan logger, Express-validator chain validation, and centralized middleware error handling.
*   **Auth**: JSON Web Tokens (JWT) with conditional authorization layers (`protect`, `optionalProtect`, and role checks: `user`, `room_creator`, `admin`).

### Frontend Client (`/frontend`)
*   **Foundation**: React with Vite.
*   **Routing**: React Router DOM (v6) with page-level role authorization guards.
*   **Icons**: Lucide React.
*   **Styling**: Premium Custom CSS theme incorporating Outfit typography, dark-theme color variables, custom scrollbars, micro-animations, and glassmorphic card overlays.

---

## Directory Layout

```
InterviewHub/
├── backend/
│   ├── config/            # DB & Redis connection pools
│   ├── controllers/       # Controller handler callbacks
│   ├── middlewares/       # Auth guards, cache layer, validation & errors
│   ├── models/            # Mongoose Schemas (User, Room, Experience, Comment, etc.)
│   ├── routes/            # Routes endpoint mapping
│   ├── services/          # Pure business logic services (DB calls, mutations)
│   ├── validators/        # Express-validators schemas
│   ├── scripts/           # Seed scripts
│   ├── package.json
│   └── server.js          # App entry point
├── frontend/
│   ├── src/
│   │   ├── components/    # Layout, Navbar, Loader, EmptyState, Pagination, Footer
│   │   ├── context/       # AuthState, AppState (Toast notifications)
│   │   ├── features/      # Feature directory (auth, dashboard, experiences, rooms, search)
│   │   ├── shared/        # API Axios-equivalent helper
│   │   ├── App.jsx        # Routing tree
│   │   ├── index.css      # Core styles & variables
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── package.json           # Root controls (concurrent start script)
└── README.md
```

---

## Setup & Running Locally

### 1. Prerequisites
*   Node.js (v18+)
*   MongoDB running locally (`mongodb://localhost:27017/interviewprep-hub`)
*   *(Optional)* Redis server running on port 6379 (if Redis is not running, the application will automatically fall back to memory cache)

### 2. Environment Configurations
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/interviewprep-hub
REDIS_URI=redis://127.0.0.1:6379
JWT_SECRET=supersecrettokenkey123
JWT_EXPIRE=30d
NODE_ENV=development
```

### 3. Installation
From the root directory, run the command to install all backend and frontend dependencies:
```bash
npm run install-all
```

### 4. Database Seeding
To populate the database with mock users, 4 interview logs, active study rooms, chat discussion messages, and upvotes/bookmarks, execute:
```bash
npm run seed
```

### 5. Running the Application
To launch the backend server (port 5000) and the Vite React server (port 3000) concurrently, execute:
```bash
npm run dev
```

---

## Credentials (Mock Accounts)
Use the following accounts (all share the password: `password123`) to log in and test different authorization permissions:

1.  **Administrator**: `admin@prep.com` (Accesses system statistics, updates roles, deletes users/experiences)
2.  **Room Creator**: `creator@prep.com` (Creates study rooms, posts messages, writes experiences)
3.  **Regular User**: `user@prep.com` (Joins study rooms, bookmarks/upvotes experiences, posts comments)
