# Library Management System

A full-stack Library Management System built with **NestJS** (Backend) and **React** (Frontend).

## 🚀 Tech Stack

### Backend
- **Framework:** [NestJS](https://nestjs.com/)
- **Database:** PostgreSQL
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** JWT (JSON Web Tokens) with Passport
- **Documentation:** Swagger / OpenAPI

### Frontend
- **Framework:** [React](https://react.dev/) (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **HTTP Client:** Axios

---

## 🛠️ Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or later)
- [Docker & Docker Compose](https://www.docker.com/) (Optional, for containerized setup)
- [PostgreSQL](https://www.postgresql.org/) (If running locally without Docker)

---

## 📦 Getting Started

### 1. Clone the Repository
```bash
git clone <YOUR_REPO_URL>
cd library-system
```

### 2. Environment Setup

You need to configure environment variables for both backend and frontend.

**Backend:**
Copy the example environment file:
```bash
cd backend
cp .env.example .env
```
Update `.env` with your database credentials and JWT secret:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/library_db?schema=public"
JWT_SECRET="supersecretkey"
JWT_EXPIRES_IN="1d"
```

**Frontend:**
Copy the example environment file:
```bash
cd ../frontend
cp .env.example .env
```
Update `.env` if necessary (e.g., API URL):
```env
VITE_API_URL="http://localhost:3000"
```

---

## 🏃‍♂️ Running Locally (Without Docker)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
4. Seed the database (Optional):
   ```bash
   npx prisma db seed
   ```
5. Start the server:
   ```bash
   npm run start:dev
   ```
   The backend will be running at `http://localhost:3000`.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be running at `http://localhost:5173`.

---

## 🐳 Running with Docker

Run the entire application (Backend + Frontend + Database) using Docker Compose.

1. From the root directory:
   ```bash
   docker-compose up --build
   ```
2. Access the application:
   - **Frontend:** `http://localhost:80`
   - **Backend API:** `http://localhost:3000`
   - **Swagger Docs:** `http://localhost:3000/api`

*Note: The Docker setup automatically applies migrations on startup.*

---

## 🔑 Authentication & Testing Protected Routes

### Getting a Token
1. Register a new user via the Frontend (`/register`) or API (`POST /auth/register`).
2. Login (`/login`) to receive a **JWT Token**.
3. The frontend automatically attaches this token to requests via Axios interceptors.

### Testing via Swagger
1. Go to `http://localhost:3000/api`.
2. Use the **Authorize** button and enter your JWT token (format: `Bearer <token>`).
3. You can now test protected endpoints like `GET /books` or `POST /borrow`.

---

## 📝 Assumptions & Design Notes

- **Database:** Uses PostgreSQL. Ensure the database service is running if not using Docker.
- **Validation:** Inputs are validated using `class-validator` on the backend.
- **Error Handling:** Global exception filters are used to return standardized error responses.

---

## 📂 Project Structure

```
library-system/
├── backend/            # NestJS Application
│   ├── src/
│   ├── prisma/         # Database Schema & Seeds
│   ├── test/           # E2E Tests
│   └── Dockerfile
├── frontend/           # React Application
│   ├── src/
│   ├── public/
│   └── Dockerfile
├── docker-compose.yml  # Container Orchestration
└── README.md           # Project Documentation
```
