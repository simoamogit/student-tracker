from datetime import datetime
from bson import ObjectId

class Event:
    def __init__(self, user_id, title, description, start_date, end_date, event_type, subject=None, school_year=None, _id=None):
        self._id = _id or ObjectId()
        self.user_id = user_id
        self.title = title
        self.description = description
        self.start_date = start_date if isinstance(start_date, datetime) else datetime.fromisoformat(start_date)
        self.end_date = end_date if isinstance(end_date, datetime) else datetime.fromisoformat(end_date)
        self.event_type = event_type  # "verifica", "compito", "supplenza", "altro"
        self.subject = subject
        self.school_year = school_year  # es: "2023-2024"
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
    
    @staticmethod
    def from_dict(data):
        return Event(
            user_id=data.get('user_id'),
            title=data.get('title'),
            description=data.get('description', ''),
            start_date=data.get('start_date'),
            end_date=data.get('end_date'),
            event_type=data.get('event_type'),
            subject=data.get('subject'),
            school_year=data.get('school_year'),
            _id=data.get('_id')
        )
    
    def to_dict(self):
        return {
            '_id': str(self._id),
            'user_id': str(self.user_id),
            'title': self.title,
            'description': self.description,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat(),
            'event_type': self.event_type,
            'subject': self.subject,
            'school_year': self.school_year,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }