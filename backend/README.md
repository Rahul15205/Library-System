# 📚 Library Management System

A comprehensive full-stack library management system built with **NestJS** (Backend) and **React** (Frontend).

## 🚀 Features

### Backend (NestJS)
- **Authentication**: JWT-based auth (Login/Signup).
- **Books**: CRUD operations, filtering by author/status.
- **Authors**: CRUD operations.
- **Users**: CRUD operations.
- **Borrowing**: Borrow/Return books, track history.
- **Documentation**: Swagger API docs.
- **Database**: PostgreSQL with Prisma ORM.

### Frontend (React + TypeScript)
- **Modern UI**: Clean interface using Tailwind CSS.
- **Dashboard**: View books, filter by author/availability.
- **Management**: Add/Edit/Delete books and authors.
- **User Portal**: View borrowed books, return books.
- **Authentication**: Login/Register pages.

## 🛠️ Technology Stack

- **Backend**: NestJS, Prisma, PostgreSQL, JWT, Swagger.
- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Axios, React Router.
- **Containerization**: Docker, Docker Compose.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose (optional, for containerized run)
- PostgreSQL (if running locally without Docker)

### Option 1: Run with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd library-system
   ```

2. **Start the services**
   ```bash
   docker-compose up --build
   ```
   This will start:
   - Postgres Database (Port 5432)
   - Backend API (Port 3000)

3. **Run Frontend** (Frontend is not dockerized yet, run locally)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Access Frontend at `http://localhost:5173`

### Option 2: Run Locally

#### Backend
1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment**
   Create `.env` file:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/library_db"
   JWT_SECRET="your-secret-key"
   PORT=3000
   ```

3. **Setup Database**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

4. **Start Server**
   ```bash
   npm run start:dev
   ```
   API: `http://localhost:3000`
   Swagger Docs: `http://localhost:3000/api`

#### Frontend
1. **Navigate to frontend**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Client**
   ```bash
   npm run dev
   ```
   App: `http://localhost:5173`

## 🧪 Testing

### Backend Tests
```bash
npm run test
npm run test:e2e
```

### Manual Verification
1. Go to `http://localhost:5173/register` and create an account.
2. Login with credentials.
3. Add an Author (e.g., "J.K. Rowling").
4. Add a Book linked to that Author.
5. Click "Borrow" on the book card.
6. Go to "My Borrowed" to see the book.
7. Click "Return Book" to return it.

## 📚 API Documentation
Full API documentation is available via Swagger UI at `http://localhost:3000/api` when the server is running.

## 🐳 Docker Configuration
The project includes a `Dockerfile` for the NestJS backend and a `docker-compose.yml` to orchestrate the backend and a PostgreSQL database.

## 📝 Design Notes
- **Architecture**: Monorepo-style structure (root for backend, `frontend/` for client).
- **Auth**: JWT tokens are stored in LocalStorage for simplicity.
- **Styling**: Tailwind CSS for rapid and responsive UI development.
- **State**: React Context API for simple global state (Auth).