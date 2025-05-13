from datetime import datetime
from bson import ObjectId

class Grade:
    def __init__(self, user_id, subject, value, date, grade_type, weight=1.0, notes="", school_year=None, semester=None, _id=None):
        self._id = _id or ObjectId()
        self.user_id = user_id
        self.subject = subject
        self.value = float(value)
        self.date = date if isinstance(date, datetime) else datetime.fromisoformat(date)
        self.grade_type = grade_type  # "scritto", "orale", "pratico"
        self.weight = float(weight)
        self.notes = notes
        self.school_year = school_year  # es: "2023-2024"
        self.semester = semester  # 1 o 2
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
    
    @staticmethod
    def from_dict(data):
        return Grade(
            user_id=data.get('user_id'),
            subject=data.get('subject'),
            value=data.get('value'),
            date=data.get('date'),
            grade_type=data.get('grade_type'),
            weight=data.get('weight', 1.0),
            notes=data.get('notes', ''),
            school_year=data.get('school_year'),
            semester=data.get('semester'),
            _id=data.get('_id')
        )
    
    def to_dict(self):
        return {
            '_id': str(self._id),
            'user_id': str(self.user_id),
            'subject': self.subject,
            'value': self.value,
            'date': self.date.isoformat(),
            'grade_type': self.grade_type,
            'weight': self.weight,
            'notes': self.notes,
            'school_year': self.school_year,
            'semester': self.semester,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }