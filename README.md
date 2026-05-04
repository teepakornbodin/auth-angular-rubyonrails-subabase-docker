# Angular + Ruby on Rails + Supabase Auth Template

A full-stack authentication starter template built with:

- Angular (Frontend)
- Ruby on Rails API (Backend)
- Supabase (Database & Authentication)
- Docker (Containerized Development)

This project is designed as a reusable boilerplate for building scalable full-stack applications.

---

## 📌 Overview

This repository provides a production-ready authentication architecture that can be used as a foundation for building:

- SaaS applications
- Admin dashboards
- Booking systems
- E-commerce platforms
- Internal management systems
- API-driven web applications

Instead of building authentication from scratch every time, this template provides a clean and extensible starting point.

---

## ✨ Features

## 🔐 Authentication System

- User registration
- User login
- JWT-based authentication
- Refresh token flow
- Session management
- Protected routes

---

## 🖥 Frontend (Angular)

Includes:

- Authentication pages
- Route guards
- API interceptors
- Token handling
- Modular structure

---

## ⚙ Backend (Ruby on Rails API)

Provides:

- Authentication endpoints
- Token verification
- Middleware protection
- RESTful API structure

---

## 🗄 Database & Auth (Supabase)

Used for:

- User management
- Authentication provider
- Session storage
- Secure token validation

---

## 🐳 Dockerized Environment

Run full stack with one command.

Includes:

- Frontend container
- Backend container
- Shared network
- Environment isolation

---

## 🛠 Tech Stack

### Frontend
- Angular
- TypeScript

### Backend
- Ruby on Rails
- REST API

### Database / Auth
- Supabase

### Infrastructure
- Docker
- Docker Compose

---

## 📂 Project Structure

```bash
auth-angular-rails-supabase-template/
│
├── frontend/
│   └── app/
│
├── backend/
│   └── app/
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start

## 1. Clone Repository

```bash
git clone https://github.com/yourusername/angular-rails-supabase-auth-template.git
cd angular-rails-supabase-auth-template
```

---

## 2. Configure Environment Variables

Create environment files for frontend and backend.

### Frontend

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

### Backend

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
```

---

## 3. Run with Docker

```bash
docker compose up --build
```

---

## 4. Access Applications

Frontend:

```bash
http://localhost:4200
```

Backend API:

```bash
http://localhost:3000
```

---

## 🔄 Authentication Flow

```text
User Login
   ↓
Angular sends credentials
   ↓
Rails API validates request
   ↓
Supabase authenticates user
   ↓
JWT issued
   ↓
Frontend stores token
   ↓
Protected API access
```

---

## 🧩 Reuse This Template For

This starter can be adapted into:

### SaaS Dashboard
Add billing + role management

### Booking Platform
Add reservations

### E-commerce
Add products + orders

### Learning Platform
Add courses + progress tracking

### Internal Company Tools
Add employee management

---

## 💡 Why This Template Exists

This project was built to create a reusable full-stack authentication architecture.

Main goals:

- Reduce setup time
- Standardize auth implementation
- Provide Docker-first development
- Enable rapid prototyping

---

## 🔍 Architecture Principles

### Separation of Concerns
Frontend and backend are fully separated.

### API-First
Backend serves as standalone API.

### Scalable Auth Design
Supports extension for:

- OAuth
- Role-based access
- Permissions
- Multi-tenant systems

---

## 🚧 Future Improvements

Planned enhancements:

- Role-based authorization
- Password reset flow
- Email verification
- OAuth providers
- Admin panel
- Testing suite

---

## 👨‍💻 Author

**Teepakornbodin Intasoy**

Computer Engineering  
Khon Kaen University

---

## 📚 Purpose

This repository serves as:

- Learning resource
- Boilerplate template
- Full-stack authentication reference

---

## ⭐ Suggested Use

Fork this repository and customize it for your own projects.
