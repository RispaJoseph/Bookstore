# 📚 Bookstore

A full-stack Bookstore app with **Django REST API**, **React frontend**, and **Supabase Postgres**.  
Features OTP-based authentication (Email/SMS via Twilio), JWT tokens, Razorpay integration, and book ordering.

---

## 🚀 Features
- **Authentication**
  - OTP via Email (SMTP) or SMS (Twilio)
  - JWT Access & Refresh tokens
- **Books CRUD**
  - Public: `GET /books/`, `GET /books/{id}/`
  - Authenticated: `POST`, `PUT`, `DELETE`
- **Orders & Payments**
  - Create order with Razorpay
  - Verify payments
- **Extras**
  - Search, pagination
  

---

## 🛠️ Tech Stack
- **Backend:** Django REST Framework, PostgreSQL (Supabase), JWT
- **Frontend:** React, Redux, Tailwind, Netlify
- **DevOps:** Render (Backend), Netlify (Frontend)
- **3rd Party:** Razorpay API, Twilio SMS, Gmail SMTP

---

## 🌐 Live Demo
- Frontend: [rispa-bookstore.netlify.app](https://rispa-bookstore.netlify.app/)
- Backend: [bookstore-kaoi.onrender.com](https://bookstore-kaoi.onrender.com/)

---

## ⚙️ Setup

### 1. Clone the repo
```bash
git clone https://github.com/RispaJoseph/Bookstore.git
cd Bookstore
```

### 2. Virtual environment
```bash
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment variables
Create a .env in the project root:
```ini
# Django
SECRET_KEY=change-me
DEBUG=True

# Database (Supabase)
SUPABASE_DB_URL=postgresql://postgres:password@host:5432/postgres

# Email (Gmail SMTP)
EMAIL_HOST_USER=your@gmail.com
EMAIL_HOST_PASSWORD=app-password

# Twilio (SMS OTP)
TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxx

```

### 5. Apply migrations & run
```bash
python manage.py migrate
python manage.py runserver
```

### 6. Running frontend
```bash
cd frontend
npm install
npm run dev
```

