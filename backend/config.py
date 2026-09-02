import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.environ.get(
        'SECRET_KEY',
        'dev-secret-key'
    )

    JWT_SECRET_KEY = os.environ.get(
        'JWT_SECRET_KEY',
        'jwt-secret-key'
    )

    DATABASE_URL = os.environ.get('DATABASE_URL')

    if not DATABASE_URL:
        raise RuntimeError(
            'DATABASE_URL environment variable is not configured'
        )

    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False