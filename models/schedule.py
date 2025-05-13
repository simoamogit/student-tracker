from datetime import datetime
from bson import ObjectId

class ScheduleItem:
    def __init__(self, user_id, day, hour, subject, teacher, classroom, school_year=None, _id=None):
        self._id = _id or ObjectId()
        self.user_id = user_id
        self.day = day  # 0-6 (lunedì-domenica)
        self.hour = hour  # numero dell'ora (1, 2, 3...)
        self.subject = subject
        self.teacher = teacher
        self.classroom = classroom
        self.school_year = school_year  # es: "2023-2024"
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
    
    @staticmethod
    def from_dict(data):
        return ScheduleItem(
            user_id=data.get('user_id'),
            day=data.get('day'),
            hour=data.get('hour'),
            subject=data.get('subject'),
            teacher=data.get('teacher'),
            classroom=data.get('classroom'),
            school_year=data.get('school_year'),
            _id=data.get('_id')
        )
    
    def to_dict(self):
        return {
            '_id': str(self._id),
            'user_id': str(self.user_id),
            'day': self.day,
            'hour': self.hour,
            'subject': self.subject,
            'teacher': self.teacher,
            'classroom': self.classroom,
            'school_year': self.school_year,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }