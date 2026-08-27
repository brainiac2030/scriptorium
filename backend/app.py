from flask import Flask, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from config import Config
from models import db, bcrypt

app = Flask(__name__)
app.config.from_object(Config)


db.init_app(app)
bcrypt.init_app(app)
migrate = Migrate(app, db)


CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the Scriptorium API!"})

@app.route('/api/health')
def health_check():
    return jsonify({"status": "healthy", "message": "Backend is running"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5555)