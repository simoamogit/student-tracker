import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'chiave-segreta-predefinita'
    MONGO_URI = os.environ.get('MONGO_URI') or 'mongodb+srv://username:password@cluster.mongodb.net/student_tracker'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-chiave-segreta'
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 ora