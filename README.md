Video demo   https://drive.google.com/file/d/1i1BqkAYYDQUQMXoiSmYdfgJW3vszjl11/view?usp=sharing

```markdown
# Scriptorium — Personal Digital Library

A full-stack web application that helps readers discover, organize, and track their reading journey.

**Live Demo:** [https://scriptorium-delta-five.vercel.app/](https://scriptorium-delta-five.vercel.app/)

---

## Overview

Scriptorium integrates with the Open Library API to give users access to millions of books while providing personal tools for:

- Creating and managing collections
- Tracking reading progress
- Logging reading sessions
- Setting annual reading goals
- Saving notes and quotes
- Reading digitized books via Internet Archive (when available)

---

## Features

- User authentication (signup / login with JWT)
- Book discovery via Open Library
- Search by title, author, or subject
- Collection management (create, edit, delete)
- Save books to personal collections
- Reading status (To Read · Currently Reading · Finished)
- Progress tracking (current page + percentage)
- Reading session logging
- Annual reading goals with progress bar
- “Read Online” links for books available on Internet Archive
- Responsive design with a clean, bookish aesthetic
- Toast notifications for better user feedback

---

## Tech Stack

### Frontend
- React 19
- React Router DOM 7
- Vite 8
- Tailwind CSS 4
- Axios
- Lucide React (icons)

### Backend
- Flask 3.1
- Flask-SQLAlchemy
- Flask-Migrate
- Flask-JWT-Extended
- Flask-Bcrypt
- Marshmallow
- PostgreSQL (production) / SQLite (development)

---



---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL (optional for production)

### 1. Clone the repository

```bash
git clone https://github.com/brainiac2030/scriptorium.git
cd scriptorium
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
cp .env.example .env              # or create manually
```

Example `.env`:

```env
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
DATABASE_URL=sqlite:///app.db     # or PostgreSQL URL
```

Run migrations and start the server:

```bash
flask db upgrade
python app.py
```

Backend runs at `http://localhost:5555`

### 3. Frontend Setup

```bash
cd scriptorium
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## API Endpoints (summary)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/signup` | Register |
| POST | `/api/login` | Login |
| GET | `/api/me` | Current user |
| GET/POST | `/api/collections` | List / Create collections |
| GET/PUT/DELETE | `/api/collections/:id` | Collection CRUD |
| GET/POST | `/api/saved_books` | Saved books |
| PUT | `/api/saved_books/:id` | Update status / progress |
| POST | `/api/saved_books/:id/sessions` | Log reading session |
| GET/POST | `/api/users/me/goals` | Reading goals |
| GET | `/api/users/me/stats` | User statistics |

---

