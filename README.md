# 📚 OTPBooks API

A Django REST API with **OTP-based authentication** (email or mobile), **JWT tokens**, and **Book CRUD** using PostgreSQL.

---

## 🚀 Features
- OTP authentication (6-digit, expires in 5 minutes)  
- JWT Access (15 min) + Refresh (7 days)  
- Books CRUD:
  - Public: `GET /books/`, `GET /books/{id}/`
  - Auth only: `POST`, `PUT`, `DELETE`  
- Search, filter, ordering, and pagination  
- Unit tests for Auth & Books  
- Importable Postman Collection with sample requests & test cases  

---

## ⚙️ Setup

### 1. Clone the repo
```bash
git https://github.com/RispaJoseph/Bookstore-.git
cd Bookstore


