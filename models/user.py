from datetime import datetime
from bson import ObjectId

class User:
    def __init__(self, email, password, name, school_year=None, _id=None):
        self._id = _id or ObjectId()
        self.email = email
        self.password = password  # Sarà hashata prima del salvataggio
        self.name = name
        self.school_year = school_year or {}
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
    
    @staticmethod
    def from_dict(data):
        return User(
            email=data.get('email'),
            password=data.get('password'),
            name=data.get('name'),
            school_year=data.get('school_year'),
            _id=data.get('_id')
        )
    
    def to_dict(self):
        return {
            '_id': str(self._id),
            'email': self.email,
            'name': self.name,
            'school_year': self.school_year,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }