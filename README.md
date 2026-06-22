# 📦 Inventory & Order Management System

[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-24.0.7-2496ED.svg)](https://www.docker.com/)
[![Railway](https://img.shields.io/badge/Railway-Deployed-0B0D0E.svg)](https://railway.app/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000.svg)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A production-ready, full-stack Inventory & Order Management System built with FastAPI, React, and PostgreSQL. Fully containerized and deployed on Railway & Vercel.

---

## 🚀 Live Demo

| Service | URL |
|---------|-----|
| **Frontend Application** | [https://your-project.vercel.app](https://your-project.vercel.app) |
| **Backend API** | [https://your-app-name.up.railway.app](https://your-app-name.up.railway.app) |
| **API Documentation** | [https://your-app-name.up.railway.app/docs](https://your-app-name.up.railway.app/docs) |
| **Health Check** | [https://your-app-name.up.railway.app/health](https://your-app-name.up.railway.app/health) |

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [API Documentation](#api-documentation)
- [Business Rules](#business-rules)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
  - [Docker Setup](#docker-setup)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 📖 Overview

The **Inventory & Order Management System** is a comprehensive solution designed to help businesses efficiently manage their products, customers, orders, and inventory tracking. Built with modern technologies, this system provides a seamless experience for both administrators and end-users.

### Key Highlights

- ✅ **Complete CRUD Operations** for Products, Customers, and Orders
- ✅ **Real-time Inventory Tracking** with automatic stock updates
- ✅ **Smart Business Rules** enforcing data integrity and validation
- ✅ **Professional Dashboard** with real-time analytics and insights
- ✅ **Containerized Architecture** for easy deployment and scalability
- ✅ **Responsive Design** optimized for desktop and mobile devices

---

## ✨ Features

### Product Management
- ➕ Create new products with unique SKU
- 📋 View all products with search and filter
- ✏️ Update product details (price, stock, name)
- 🗑️ Delete products (with order history validation)
- 🔔 Low stock alerts and notifications

### Customer Management
- 👤 Create and manage customer profiles
- 📧 Unique email validation
- 📞 Store customer contact information
- 📊 View customer order history

### Order Management
- 🛒 Create orders with multiple items
- 📦 Automatic inventory deduction
- 💰 Auto-calculate total amount
- 📋 View order details and history
- 🗑️ Cancel/delete orders

### Dashboard Analytics
- 📊 Real-time statistics (Products, Customers, Orders)
- ⚠️ Low stock product alerts
- 📋 Recent orders display
- 📈 Business performance insights

---

## 🛠️ Technology Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.12 | Programming Language |
| **FastAPI** | 0.104.1 | Web Framework |
| **SQLAlchemy** | 2.0.51 | ORM |
| **PostgreSQL** | 15 | Database |
| **Pydantic** | 2.13.4 | Data Validation |
| **Uvicorn** | 0.49.0 | ASGI Server |
| **Alembic** | 1.18.4 | Database Migrations |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI Library |
| **Vite** | 8.0.16 | Build Tool |
| **React Router** | 7.18.0 | Routing |
| **Axios** | 1.18.0 | HTTP Client |
| **React Icons** | Latest | Icons Library |
| **Bootstrap** | 5.3.0 | CSS Framework |

### DevOps & Deployment
| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Service Orchestration |
| **Railway** | Backend Hosting |
| **Vercel** | Frontend Hosting |
| **Neon** | Database Hosting |
| **Git** | Version Control |

---

## 🏗️ System Architecture


---

## 📚 API Documentation

### https://inventory-management-system-production-eb67.up.railway.app


### API Endpoints

#### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/products` | Create a new product |
| `GET` | `/products` | Get all products |
| `GET` | `/products/{id}` | Get product by ID |
| `PUT` | `/products/{id}` | Update product |
| `DELETE` | `/products/{id}` | Delete product |
| `GET` | `/products/low-stock/` | Get low stock products |

#### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/customers` | Create a new customer |
| `GET` | `/customers` | Get all customers |
| `GET` | `/customers/{id}` | Get customer by ID |
| `PUT` | `/customers/{id}` | Update customer |
| `DELETE` | `/customers/{id}` | Delete customer |

#### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/orders` | Create a new order |
| `GET` | `/orders` | Get all orders |
| `GET` | `/orders/{id}` | Get order by ID |
| `DELETE` | `/orders/{id}` | Delete order |
| `GET` | `/orders/customer/{id}/` | Get orders by customer |

#### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/dashboard/stats` | Get dashboard statistics |
| `GET` | `/dashboard/low-stock` | Get low stock products |
| `GET` | `/dashboard/recent-orders` | Get recent orders |

---

## ⚖️ Business Rules

The system enforces the following business rules:

| Rule | Implementation |
|------|----------------|
| **Product SKU must be unique** | ✅ Database unique constraint |
| **Customer email must be unique** | ✅ Database unique constraint |
| **Product stock cannot be negative** | ✅ Check constraint |
| **Order cannot be placed with insufficient stock** | ✅ Backend validation |
| **Order creates automatic stock reduction** | ✅ Transaction handling |
| **Total amount calculated by backend** | ✅ Service logic |
| **All request data validated** | ✅ Pydantic schemas |
| **Proper HTTP status codes** | ✅ FastAPI responses |

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Python 3.12+](https://www.python.org/downloads/)
- [Node.js 20+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)
- [PostgreSQL 15+](https://www.postgresql.org/) (or use Docker)

### Local Development

#### Clone the Repository

```bash
git clone https://github.com/your-username/inventory-management-system.git
cd inventory-management-system

# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Update DATABASE_URL in .env file
# DATABASE_URL=postgresql://postgres:password@localhost:5432/inventory_db

# Run the server
python run.py

# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env

# Start the development server
npm run dev

# Build and start all services
docker-compose up -d --build

# Check running containers
docker-compose ps

# View logs
docker-compose logs

# Stop services
docker-compose down

# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production containers
docker-compose -f docker-compose.prod.yml up -d

inventory-management-system/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── products.py
│   │       ├── customers.py
│   │       ├── orders.py
│   │       └── dashboard.py
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── Dockerfile
│   ├── Dockerfile.prod
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.jsx
│   │   │   ├── ProductList.jsx
│   │   │   ├── ProductForm.jsx
│   │   │   ├── CustomerList.jsx
│   │   │   ├── CustomerForm.jsx
│   │   │   ├── OrderList.jsx
│   │   │   ├── OrderForm.jsx
│   │   │   └── OrderDetail.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Customers.jsx
│   │   │   └── Orders.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── Dockerfile
│   ├── Dockerfile.prod
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml
├── docker-compose.prod.yml
└── README.md

# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/inventory_db

# Application Configuration
APP_NAME=Inventory Management System
DEBUG=True
API_V1_PREFIX=/api/v1

# CORS Configuration
BACKEND_CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]