# Personal Finance & Budget Management Application - Deployment Guide

This document provides complete, production-grade instructions for deploying the fullstack **Personal Finance and Budget Management Application** across local containers, Docker Compose, AWS, Azure, GCP, and managed PaaS platforms (Render/Railway/Vercel).

---

## 1. Quick Start with Docker Compose (Recommended for Local / VPS)

The application includes production-ready Dockerfiles for both backend and frontend, and a multi-container `docker-compose.yml` orchestrating PostgreSQL 16, Spring Boot 3, and React (Nginx).

### Prerequisites
- Docker Engine 24+ & Docker Compose v2+
- Git

### Deployment Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/keerthana-rajamani/finance-app.git
   cd finance-app
   ```

2. **Launch the stack with Docker Compose:**
   ```bash
   docker compose up --build -d
   ```

3. **Verify the running containers:**
   ```bash
   docker compose ps
   ```
   You should see:
   - `finance_postgres` on port `5432`
   - `finance_backend` on port `8080`
   - `finance_frontend` on port `8081`

4. **Access the application:**
   - **Frontend (Web App):** `http://localhost:8081`
   - **Backend REST API:** `http://localhost:8080/api`
   - **H2 / DB Console:** `http://localhost:8080/h2-console`

5. **Stop the stack:**
   ```bash
   docker compose down
   ```

---

## 2. Local Bare-Metal Execution (Without Docker)

### Backend (Spring Boot 3 + Java 17)
```bash
cd backend
mvn clean spring-boot:run
```
The API server starts at `http://localhost:8080`. By default, it runs with zero-configuration PostgreSQL database (financedb) pre-seeded with demo data.

### Frontend (React 18 + Vite)
```bash
cd frontend
npm install
npm run dev
```
The frontend UI will be running at `http://localhost:8081` and proxies `/api` requests to `http://localhost:8080`.

---

## 3. Cloud Deployment: Amazon Web Services (AWS)

### Architecture
- **Frontend:** AWS S3 Bucket + CloudFront CDN (or AWS Amplify)
- **Backend:** AWS Elastic Container Service (ECS) with AWS Fargate
- **Database:** AWS RDS for MySQL (Multi-AZ)
- **Security:** AWS Secrets Manager & AWS Certificate Manager (HTTPS TLS 1.3)

### Step-by-Step AWS Setup

1. **Provision RDS MySQL Database:**
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier finance-mysql \
     --db-instance-class db.t3.micro \
     --engine mysql \
     --allocated-storage 20 \
     --master-username financeadmin \
     --master-user-password "YourStrongPassword#123"
   ```

2. **Build and Push Backend Image to Amazon ECR:**
   ```bash
   aws ecr create-repository --repository-name finance-backend
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.us-east-1.amazonaws.com
   docker build -t finance-backend ./backend
   docker tag finance-backend:latest <aws_account_id>.dkr.ecr.us-east-1.amazonaws.com/finance-backend:latest
   docker push <aws_account_id>.dkr.ecr.us-east-1.amazonaws.com/finance-backend:latest
   ```

3. **Deploy Backend on ECS Fargate:**
   Create an ECS Task Definition with environment variables:
   - `SPRING_DATASOURCE_URL`: `jdbc:mysql://<rds-endpoint>:5432/financedb?useSSL=true`
   - `SPRING_DATASOURCE_USERNAME`: `financeadmin`
   - `SPRING_DATASOURCE_PASSWORD`: `<your-secret>`
   - `APP_JWT_SECRET`: `<256-bit-secret>`

4. **Deploy Frontend on AWS S3 & CloudFront:**
   ```bash
   cd frontend
   npm run build
   aws s3 sync dist/ s3://your-finance-app-bucket --delete
   aws cloudfront create-invalidation --distribution-id <DISTRIBUTION_ID> --paths "/*"
   ```

---

## 4. Cloud Deployment: Microsoft Azure

### Architecture
- **Backend:** Azure App Service (Linux Docker container)
- **Database:** Azure Database for MySQL Flexible Server
- **Frontend:** Azure Static Web Apps

### Step-by-Step Azure Setup

1. **Create Resource Group & MySQL Database:**
   ```bash
   az group create --name FinanceApp-RG --location eastus
   az mysql flexible-server create \
     --resource-group FinanceApp-RG \
     --name finance-mysql-srv \
     --admin-user dbuser \
     --admin-password "YourStrongPassword#123" \
     --sku-name Standard_B1ms
   ```

2. **Deploy Backend to Azure Container App / App Service:**
   ```bash
   az acr create --resource-group FinanceApp-RG --name financeacr --sku Basic
   az acr build --registry financeacr --image finance-backend:v1 ./backend

   az webapp create \
     --resource-group FinanceApp-RG \
     --plan FinanceAppPlan \
     --name finance-api-app \
     --deployment-container-image-name financeacr.azurecr.io/finance-backend:v1
   ```

3. **Deploy Frontend to Azure Static Web Apps:**
   ```bash
   az staticwebapp create \
     --name finance-web-ui \
     --resource-group FinanceApp-RG \
     --source https://github.com/keerthana-rajamani/finance-app \
     --location "eastus2" \
     --branch main \
     --app-location "frontend" \
     --output-location "dist"
   ```

---

## 5. Cloud Deployment: Google Cloud Platform (GCP)

### Architecture
- **Backend:** Google Cloud Run (Fully managed serverless container)
- **Database:** Google Cloud SQL for MySQL
- **Frontend:** Firebase Hosting or Cloud Storage + Cloud CDN

### Step-by-Step GCP Setup

1. **Create Cloud SQL Instance:**
   ```bash
   gcloud sql instances create finance-mysql \
     --database-version=MYSQL_8_0 \
     --tier=db-f1-micro \
     --region=us-central1
   gcloud sql databases create financedb --instance=finance-mysql
   ```

2. **Deploy Backend Container to Cloud Run:**
   ```bash
   gcloud builds submit --tag gcr.io/$PROJECT_ID/finance-backend ./backend
   gcloud run deploy finance-backend \
     --image gcr.io/$PROJECT_ID/finance-backend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars="SPRING_DATASOURCE_URL=jdbc:mysql://google/financedb?cloudSqlInstance=$PROJECT_ID:us-central1:finance-mysql&socketFactory=com.google.cloud.sql.mysql.SocketFactory,SPRING_DATASOURCE_USERNAME=root,SPRING_DATASOURCE_PASSWORD=secret"
   ```

3. **Deploy Frontend to Firebase Hosting:**
   ```bash
   cd frontend
   npm run build
   npm install -g firebase-tools
   firebase init hosting
   firebase deploy
   ```

---

## 6. One-Click Cloud Platform (Render / Railway / Vercel)

### Option A: Railway.app (Backend + MySQL)
1. Link your GitHub repository `https://github.com/keerthana-rajamani/finance-app`.
2. Add a **MySQL** plugin service.
3. Deploy the `backend` subdirectory using Dockerfile or Maven builder. Railway will automatically populate `DATABASE_URL`.

### Option B: Vercel / Netlify (Frontend)
1. Import `finance-app` repository on Vercel.
2. Root Directory: `frontend`
3. Framework Preset: `Vite`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Configure environment variable: `VITE_API_BASE_URL=https://your-backend.railway.app/api`

---

## 7. Pre-Configured Demo Credentials

| Role | Email | Password | Access Scope |
|---|---|---|---|
| **Primary User** | `john@example.com` | `Password@123` | Full Access: Accounts, Budgets, Goals, Tax, Net Worth |
| **Family Member** | `sarah@example.com` | `Password@123` | Shared Household Budgets & Expense Splitting |
| **Financial Advisor** | `advisor@example.com` | `Password@123` | Read-only Investment Portfolio, NAV, XIRR Analytics |
| **Support Agent** | `support@example.com` | `Password@123` | Masked Account Data (Last 4 digits), Issue Diagnosis |
| **System Admin** | `admin@example.com` | `Password@123` | User Oversight, Compliance & Audit Trail |

---

## 8. Automated CI/CD Pipeline

The project includes `.github/workflows/deploy.yml` which automatically:
1. Builds and executes all backend JUnit 5 tests via Maven.
2. Builds and bundles frontend assets with Vite.
3. Compiles the multi-container Docker images on every push to `main`/`master`.
