from pymongo import MongoClient
from config import Config

# Connessione al database MongoDB
client = MongoClient(Config.MONGO_URI)
db = client.get_database('student_tracker')

# Collezioni
users_collection = db.users
grades_collection = db.grades
schedules_collection = db.schedules
events_collection = db.events