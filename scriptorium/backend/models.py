from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import datetime

db = SQLAlchemy()
bcrypt = Bcrypt()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    collections = db.relationship('Collection', backref='user', lazy=True, cascade='all, delete-orphan')
    saved_books = db.relationship('SavedBook', backref='user', lazy=True, cascade='all, delete-orphan')
    reading_sessions = db.relationship('ReadingSession', backref='user', lazy=True, cascade='all, delete-orphan')
    quotes = db.relationship('BookQuote', backref='user', lazy=True, cascade='all, delete-orphan')
    reading_goals = db.relationship('ReadingGoal', backref='user', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

class Collection(db.Model):
    __tablename__ = 'collections'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    books = db.relationship('SavedBook', backref='collection', lazy=True, cascade='all, delete-orphan')

class SavedBook(db.Model):
    __tablename__ = 'saved_books'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    collection_id = db.Column(db.Integer, db.ForeignKey('collections.id'), nullable=False)
    work_key = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(200), nullable=False)
    cover_id = db.Column(db.Integer, nullable=True)
    total_pages = db.Column(db.Integer, nullable=True)
    current_page = db.Column(db.Integer, default=0)
    status = db.Column(db.String(20), default='to_read')
    rating = db.Column(db.Integer, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    start_date = db.Column(db.DateTime, nullable=True)
    finish_date = db.Column(db.DateTime, nullable=True)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    reading_sessions = db.relationship('ReadingSession', backref='book', lazy=True, cascade='all, delete-orphan')
    quotes = db.relationship('BookQuote', backref='book', lazy=True, cascade='all, delete-orphan')

class ReadingSession(db.Model):
    __tablename__ = 'reading_sessions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('saved_books.id'), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    duration_minutes = db.Column(db.Integer, nullable=False)
    pages_read = db.Column(db.Integer, nullable=False)
    notes = db.Column(db.Text, nullable=True)

class BookQuote(db.Model):
    __tablename__ = 'book_quotes'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('saved_books.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    page_number = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ReadingGoal(db.Model):
    __tablename__ = 'reading_goals'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    books_target = db.Column(db.Integer, nullable=False)
    pages_target = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)