# Complete Deployment Guide - Personal Finance Application

This document provides step-by-step instructions for deploying the complete application (PostgreSQL + Spring Boot 3 + React 18) to cloud providers and local production environments.

---

## 🌟 Method 1: 1-Click Free Cloud Deployment on Render (Recommended)

The repository includes a ready-to-use **`render.yaml`** Blueprint. Render will automatically provision:
- 🐘 A managed **PostgreSQL 16 Database** (`financedb`)
- 🍃 A **Spring Boot 3 Web Service** (Port 8080)
- ⚛️ A **React 18 Static Site** (with automated client-side routing)

### Step-by-Step Instructions:
1. Go to **[https://dashboard.render.com/blueprints](https://dashboard.render.com/blueprints)** (sign in with GitHub).
2. Click **"New Blueprint Instance"**.
3. Select your repository: **`https://github.com/keerthana-rajamani/finance-app`**.
4. Render detects `render.yaml` and displays the 3 resources:
   - `financedb` (PostgreSQL)
   - `finance-backend` (Spring Boot Web Service)
   - `finance-frontend` (React Static Site)
5. Click **"Apply"**.
6. Render builds and deploys all 3 services automatically. Once finished, you will receive two public HTTPS URLs:
   - Frontend: `https://finance-frontend-xxxx.onrender.com`
   - Backend: `https://finance-backend-xxxx.onrender.com`

---

## 🚂 Method 2: Deployment on Railway.app

1. Go to **[https://railway.app/new](https://railway.app/new)**.
2. Select **"Deploy from GitHub repo"** and choose `keerthana-rajamani/finance-app`.
3. In the project canvas, click **"+ New"** -> **"Database"** -> **"Add PostgreSQL"**.
4. Under the backend service settings:
   - Set **Root Directory**: `backend`
   - Under **Variables**, add:
     - `SPRING_DATASOURCE_URL`: `${{Postgres.DATABASE_URL}}`
     - `SPRING_JPA_HIBERNATE_DDL_AUTO`: `update`
     - `APP_JWT_SECRET`: `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970`
5. Railway will automatically build and deploy both services.

---

## ▲ Method 3: Frontend on Vercel + Backend on Render / Railway

1. Go to **[https://vercel.com/new](https://vercel.com/new)**.
2. Import `https://github.com/keerthana-rajamani/finance-app`.
3. Configure project settings:
   - **Root Directory:** Click "Edit" and choose `frontend`.
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**. Vercel will automatically apply `vercel.json` for client-side routing.

---

## 🖥️ Method 4: Local Standalone Production Deployment

If you want to run the pre-built production application locally on Windows or a server without dev servers:

1. **Verify PostgreSQL is running**:
   - Ensure service `postgresql-x64-18` is running on port `5432`.
   - Database `financedb` is automatically used.

2. **Run 1-Click Launch Script**:
   Double click **`start-production.bat`** (or run `./start-production.ps1` in PowerShell).

   This will:
   - Execute the packaged JAR: `java -jar backend/target/springapp-0.0.1-SNAPSHOT.jar`
   - Start the production frontend server on port `8081` (`npm run preview`)

3. Open **[http://localhost:8081/](http://localhost:8081/)**.

---

## 🐳 Method 5: Production Deployment with Docker Compose (Linux / Cloud VPS)

On any Ubuntu / Debian VPS (e.g. AWS EC2, DigitalOcean Droplet, Linode):

1. **Install Docker & Docker Compose**:
   ```bash
   sudo apt update && sudo apt install -y docker.io docker-compose-v2
   ```

2. **Clone and Run**:
   ```bash
   git clone https://github.com/keerthana-rajamani/finance-app.git
   cd finance-app
   docker compose up --build -d
   ```

3. **Verify Status**:
   ```bash
   docker compose ps
   ```
   Containers `finance_postgres`, `finance_backend`, and `finance_frontend` will be running.

---

## 🔑 Default Seeded Demo Accounts

| Role | Email | Password | Access Scope |
|---|---|---|---|
| **Primary User** | `john@example.com` | `Password@123` | Full Access: Accounts, Budgets, Goals, Tax, Net Worth |
| **Family Member** | `sarah@example.com` | `Password@123` | Shared Household Budgets & Expense Splitting |
| **Financial Advisor** | `advisor@example.com` | `Password@123` | Read-only Investment Portfolio, NAV, XIRR Analytics |
| **Support Agent** | `support@example.com` | `Password@123` | Masked Account Data (Last 4 digits), Issue Diagnosis |
| **System Admin** | `admin@example.com` | `Password@123` | User Oversight, Compliance & Audit Trail |
