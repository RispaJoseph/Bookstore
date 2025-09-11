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

---

## 📖 API Documentation

### 🔑 Authentication

#### 1. Request OTP
`POST /auth/request-otp`

Request an OTP via email or mobile.

**Request body (email):**
```json
{ "email": "user@example.com" }
```
**Request body (mobile):**
```json
{ "mobile": "+919876543210" }
```

**Response:**
```json
{ "message": "OTP sent successfully", "target": "user@example.com" }
```


#### 2. Verify OTP
`POST /auth/verify-otp`

Verify the OTP and receive JWT tokens.

**Request body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "access": "jwt-access-token",
  "refresh": "jwt-refresh-token",
  "expires_in": 900
}
```


#### 3. Refresh Token
`POST /auth/refresh-token`

**Request body:**
```json
{ "refresh": "jwt-refresh-token" }
```

**Response:**
```json
{ "access": "new-jwt-access-token" }
```

### 📚 Books

#### 1. List Books
`GET /books/`

Query params supported:

search=keyword

author=author_name

ordering=price


**Response:**
```json
[
  {
    "id": 1,
    "title": "Atomic Habits",
    "author": "James Clear",
    "price": "399.00",
    "published_year": 2018
  }
]
```

#### 2. Get Book by ID
`GET /books/{id}/`

**Response:**
```json
{
  "id": 1,
  "title": "Atomic Habits",
  "author": "James Clear",
  "price": "399.00"
}
```


#### 3. Create Book (Auth required)
`POST /books/`

**Response:**
```json
{
  "title": "The Pragmatic Programmer",
  "author": "Andrew Hunt",
  "price": "599.00",
  "published_year": 1999
}
```


#### 4. Update Book (Auth required)
`PUT /books/{id}/`

#### 5. Delete Book (Auth required)
`PUT /books/{id}/`


### 🛒 Orders

#### 1. Create Order
`POST /books/{id}/create_order/`(Auth required)


**Response:**
```json
{
  "order_id": "order_9A33XWu170gUtm",
  "amount": 49900,
  "display_amount": "499.00",
  "currency": "INR",
  "key": "rzp_test_xxxxxxxx",
  "book": {
    "id": 1,
    "title": "Deep Work",
    "author": "Cal Newport",
    "price": "499.00"
  }
}
```

#### 2. Verify Payment
`POST /books/verify_payment/` (Auth required)


**Request body:**
```json
{
  "razorpay_order_id": "order_9A33XWu170gUtm",
  "razorpay_payment_id": "pay_29QQoUBi66xm2f",
  "razorpay_signature": "5c0ff1eac...",
}
```

**Response:**
```json
{ "detail": "Payment verified successfully", "order_id": 5 }
```

#### 3. My Orders
`GET /auth/me/orders`(Auth required)


**Response:**
```json
[
  {
    "id": 1,
    "book": {
      "id": 1,
      "title": "Atomic Habits",
      "author": "James Clear",
      "price": "399.00"
    },
    "amount": 39900,
    "status": "paid",
    "razorpay_order_id": "order_xxxxx",
    "razorpay_payment_id": "pay_xxxxx",
    "created_at": "2025-09-11T12:00:00Z"
  }
]
```