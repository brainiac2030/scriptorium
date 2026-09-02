import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

from flask import Flask, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

from backend.config import Config
from backend.models import db, bcrypt
from backend.routes import api


app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
bcrypt.init_app(app)
Migrate(app, db)
JWTManager(app)

app.register_blueprint(api)

CORS(
    app,
    supports_credentials=True,
    origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://scriptorium-delta-five.vercel.app",

    ],
    allow_headers=[
        "Content-Type",
        "Authorization",
        "Access-Control-Allow-Credentials",
    ],
    expose_headers=[
        "Content-Type",
        "Authorization",
    ],
    methods=[
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "OPTIONS",
    ],
)


@app.route('/')
def index():
    return jsonify({
        "message": "Welcome to the Scriptorium API!"
    })


@app.route('/api/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "message": "Backend is running"
    }), 200


# Create database tables if they don't exist.
with app.app_context():
    db.create_all()
