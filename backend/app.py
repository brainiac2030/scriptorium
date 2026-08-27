from flask import Flask, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from config import Config
from models import db, bcrypt
from routes import api 

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
bcrypt.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

app.register_blueprint(api)


CORS(app, 
     supports_credentials=True, 
     origins=["http://localhost:5173", "http://127.0.0.1:5173"],
     allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
     expose_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the Scriptorium API!"})

@app.route('/api/health')
def health_check():
    return jsonify({"status": "healthy", "message": "Backend is running"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5555)