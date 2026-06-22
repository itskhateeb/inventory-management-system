# 📦 Inventory & Order Management System

![Python](https://img.shields.io/badge/Python-3.12-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.138-green)
![React](https://img.shields.io/badge/React-18-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED)
![Railway](https://img.shields.io/badge/Backend-Railway-purple)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black)

A production-ready full-stack Inventory & Order Management System built using FastAPI, React, PostgreSQL, Docker, Railway, and Vercel. The system provides complete inventory tracking, customer management, order processing, stock monitoring, and business analytics through a responsive and modern user interface.

---

## 🚀 Live Deployment

| Service              | URL                                                                       |
| -------------------- | ------------------------------------------------------------------------- |
| Frontend Application | https://inventory-management-system-9kynhwb0m-khateeb.vercel.app          |
| Backend API          | https://inventory-management-system-production-eb67.up.railway.app        |
| API Documentation    | https://inventory-management-system-production-eb67.up.railway.app/docs   |
| Health Check         | https://inventory-management-system-production-eb67.up.railway.app/health |
| Docker Hub Image     | https://hub.docker.com/r/khateeb07/inventory-management-system-backend    |
| GitHub Repository    | https://github.com/itskhateeb/inventory-management-system                 |

---

## 📖 Overview

The Inventory & Order Management System is a comprehensive business application designed to efficiently manage products, customers, and orders. It ensures data integrity through backend validations, automatic inventory updates, and real-time dashboard analytics.

### Key Highlights

* Complete CRUD Operations
* Real-Time Inventory Tracking
* Customer Management System
* Order Processing Workflow
* Dashboard Analytics
* RESTful API Architecture
* Docker Containerization
* Cloud Deployment Ready

---

## ✨ Features

### Product Management

* Create products with unique SKU
* View products with pagination and search
* Update product information
* Delete products
* Track inventory quantity
* Low stock monitoring

### Customer Management

* Create customer profiles
* Email uniqueness validation
* Store customer contact details
* Manage customer information
* View customer order history

### Order Management

* Create orders with multiple products
* Automatic inventory deduction
* Automatic total amount calculation
* Order history tracking
* Customer-based order retrieval

### Dashboard Analytics

* Total Products
* Total Customers
* Total Orders
* Revenue Overview
* Recent Orders
* Low Stock Alerts

---

## 🛠 Technology Stack

### Backend

| Technology | Version |
| ---------- | ------- |
| Python     | 3.12    |
| FastAPI    | 0.138   |
| SQLAlchemy | 2.0     |
| PostgreSQL | 15      |
| Pydantic   | 2.x     |
| Uvicorn    | 0.49    |
| Alembic    | 1.18    |

### Frontend

| Technology   | Version |
| ------------ | ------- |
| React        | 18      |
| Vite         | Latest  |
| React Router | Latest  |
| Axios        | Latest  |
| Bootstrap    | 5       |

### DevOps & Deployment

| Technology      | Purpose                     |
| --------------- | --------------------------- |
| Docker          | Containerization            |
| Docker Compose  | Multi-Service Orchestration |
| Railway         | Backend Hosting             |
| Vercel          | Frontend Hosting            |
| Neon PostgreSQL | Database Hosting            |
| GitHub          | Version Control             |

---

## 🏗 System Architecture

```text
Frontend (React + Vite)
          │
          ▼
     FastAPI API
          │
          ▼
     SQLAlchemy ORM
          │
          ▼
 PostgreSQL Database
```

---

## 📚 API Documentation

Base URL:

```text
https://inventory-management-system-production-eb67.up.railway.app
```

### Products

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | /products/           |
| GET    | /products/           |
| GET    | /products/{id}       |
| PUT    | /products/{id}       |
| DELETE | /products/{id}       |
| GET    | /products/low-stock/ |

### Customers

| Method | Endpoint        |
| ------ | --------------- |
| POST   | /customers/     |
| GET    | /customers/     |
| GET    | /customers/{id} |
| PUT    | /customers/{id} |
| DELETE | /customers/{id} |

### Orders

| Method | Endpoint               |
| ------ | ---------------------- |
| POST   | /orders/               |
| GET    | /orders/               |
| GET    | /orders/{id}           |
| DELETE | /orders/{id}           |
| GET    | /orders/customer/{id}/ |

### Dashboard

| Method | Endpoint                 |
| ------ | ------------------------ |
| GET    | /dashboard/stats         |
| GET    | /dashboard/low-stock     |
| GET    | /dashboard/recent-orders |

---

## ⚖️ Business Rules

| Rule                              | Implementation |
| --------------------------------- | -------------- |
| Product SKU must be unique        | ✅              |
| Customer email must be unique     | ✅              |
| Product stock cannot be negative  | ✅              |
| Orders require sufficient stock   | ✅              |
| Automatic stock deduction         | ✅              |
| Automatic order total calculation | ✅              |
| Backend validation using Pydantic | ✅              |
| Proper HTTP status codes          | ✅              |

---

## 🚀 Local Development Setup

### Clone Repository

```bash
git clone https://github.com/itskhateeb/inventory-management-system.git

cd inventory-management-system
```

### Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

python run.py
```

Backend runs at:

```text
http://localhost:8000
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

## 🐳 Docker Setup

### Build and Run

```bash
docker-compose up --build
```

### Run in Background

```bash
docker-compose up -d
```

### Stop Services

```bash
docker-compose down
```

---

## 📁 Project Structure

```text
inventory-management-system/
│
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── main.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── docker-compose.prod.yml
└── README.md
```

---

## 🔐 Environment Variables

### Backend

```env
DATABASE_URL=postgresql://username:password@host:5432/database

APP_NAME=Inventory Management System

DEBUG=False

API_V1_PREFIX=/api/v1
```

### Frontend

```env
VITE_API_URL=https://inventory-management-system-production-eb67.up.railway.app
```

---

## 📦 Deployment

### Frontend

Hosted on Vercel:

```text
https://inventory-management-system-9kynhwb0m-khateeb.vercel.app
```

### Backend

Hosted on Railway:

```text
https://inventory-management-system-production-eb67.up.railway.app
```

### Database

Hosted on Neon PostgreSQL.

---

## 👨‍💻 Author

**Khateeb Ur Rahman**

B.Tech Computer Science & Engineering
Jamia Hamdard University

GitHub: https://github.com/itskhateeb

---

## 📄 License

This project was developed for educational, portfolio, and technical assessment purposes.
