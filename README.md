# Scriptorium - Personal Digital Library

## Overview
live vercel demo https://scriptorium-delta-five.vercel.app/

Scriptorium is a full-stack web application that allows users to discover, organize, and track their reading journey. It integrates with the OpenLibrary API to provide access to millions of books while offering personalized features for managing collections, tracking reading progress, and setting reading goals.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)

## Features

- User authentication (signup, login, JWT-based sessions)
- Book discovery via OpenLibrary API
- Search functionality for books by title, author, or subject
- Collection management (create, update, delete collections)
- Save books to personal collections
- Track reading progress (current page, status)
- Log reading sessions with duration and pages read
- Set and track annual reading goals
- Book quotes and notes management
- Responsive design for all devices

## Technology Stack

### Frontend
- React 19
- React Router DOM 7
- Vite 8 (build tool)
- Tailwind CSS 4
- Axios (HTTP client)
- Lucide React (icons)

### Backend
- Flask 3.1
- Flask-SQLAlchemy (ORM)
- Flask-Migrate (database migrations)
- Flask-JWT-Extended (authentication)
- Flask-Bcrypt (password hashing)
- Marshmallow (serialization/validation)
- PostgreSQL (production) / SQLite (development)

## Project Structure

```
capstone-phase-1/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookCard.jsx
│   │   │   ├── BookSection.jsx
│   │   │   ├── CollectionCard.jsx
│   │   │   ├── CreateCollectionModal.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ReadingSessionModal.jsx
│   │   │   ├── SaveToCollectionModal.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── BookDetails.jsx
│   │   │   ├── CollectionDetail.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── SearchResults.jsx
│   │   │   └── Signup.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── backend/
│   ├── migrations/
│   ├── app.py
│   ├── config.py
│   ├── models.py
│   ├── routes.py
│   ├── schemas.py
│   ├── requirements.txt
│   └── .env
└── vercel.json
```

## Prerequisites

- Node.js 18 or higher
- Python 3.10 or higher
- pip (Python package manager)
- npm or yarn
- Git
- PostgreSQL (for production) or SQLite (for development)

## Installation

### Clone the Repository

```bash
git clone https://github.com/yourusername/scriptorium.git
cd capstone-phase-1
```

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your configuration
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration
```

## Configuration

### Backend Environment Variables (.env)

```env
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/scriptorium
# For development: sqlite:///app.db
```

### Frontend Environment Variables (.env)

```env
VITE_API_URL=http://localhost:5555/api
```

## Database Setup

### Development (SQLite)

```bash
cd backend

# Initialize database
flask db init
flask db migrate -m "initial migration"
flask db upgrade

# Optional: Seed with sample data
python seed.py
```

### Production (PostgreSQL)

```bash
# Create PostgreSQL database
createdb scriptorium

# Set DATABASE_URL in .env
# DATABASE_URL=postgresql://user:password@localhost:5432/scriptorium

# Run migrations
flask db upgrade
```

## Running the Application

### Development Mode

Start the backend server:

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app.py
```

The backend will run at http://localhost:5555

Start the frontend development server:

```bash
cd frontend
npm run dev
```

The frontend will run at http://localhost:5173

### Production Build

Build the frontend:

```bash
cd frontend
npm run build
```

The build artifacts will be in the `dist/` directory.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/signup | Register a new user |
| POST | /api/login | Login user |
| GET | /api/me | Get current user info |

### Collections

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/collections | Get all collections |
| POST | /api/collections | Create a collection |
| GET | /api/collections/:id | Get collection by ID |
| PUT | /api/collections/:id | Update collection |
| DELETE | /api/collections/:id | Delete collection |
| GET | /api/collections/:id/books | Get books in collection |

### Saved Books

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/saved_books | Get all saved books |
| POST | /api/saved_books | Save a book to collection |
| PUT | /api/saved_books/:id | Update book status |
| DELETE | /api/saved_books/:id | Remove book from collection |

### Reading Progress

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | /api/saved_books/:id/update-progress | Update reading progress |
| GET | /api/saved_books/:id/sessions | Get reading sessions |
| POST | /api/saved_books/:id/sessions | Log a reading session |

### Quotes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/saved_books/:id/quotes | Get book quotes |
| POST | /api/saved_books/:id/quotes | Add a quote |

### Statistics & Goals

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users/me/stats | Get user statistics |
| GET | /api/users/me/goals | Get reading goals |
| POST | /api/users/me/goals | Set reading goals |

