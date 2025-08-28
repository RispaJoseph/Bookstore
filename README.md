# 📚 Bookstore

A Django REST API with **OTP-based authentication**, **JWT tokens**, and **Book CRUD** using PostgreSQL.

---

## 🚀 Features
- OTP authentication   
- JWT Access  
- Books CRUD:
  - Public: `GET /books/`, `GET /books/{id}/`
  - Auth only: `POST`, `PUT`, `DELETE`  
- Search, filter, ordering, and pagination  

---

## ⚙️ Setup

### 1. Clone the repo
```bash
git https://github.com/RispaJoseph/Bookstore.git
cd Bookstore
```

### 2. Virtual environment

```bash
# Create venv
python3 -m venv .venv
```

```bash
# Activate (Linux/macOS)
source .venv/bin/activate    # For Windows:   .venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. PostgreSQL setup
Create DB + user:

```bash
sudo -i -u postgres
CREATE DATABASE otpbooks;
CREATE USER otpuser WITH PASSWORD 'otppassword';
GRANT ALL PRIVILEGES ON DATABASE otpbooks TO otpuser;
```

### 5. Environment file
Create .env in project root:

```ini
SECRET_KEY=change-me
DEBUG=True

DB_NAME=otpbooks
DB_USER=otpuser
DB_PASSWORD=otppassword
DB_HOST=localhost
DB_PORT=5432

OTP_EXPIRY_MINUTES=5
ACCESS_TOKEN_LIFETIME_MIN=15
REFRESH_TOKEN_LIFETIME_DAYS=7
```


### 6. Apply migrations & run

```bash
python manage.py migrate
python manage.py runserver
```

### 7. Run server

```bash
python manage.py runserver
```





