from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
import datetime

from models import grades_collection
from models.grade import Grade
from routes.auth import token_required

grades_bp = Blueprint('grades', __name__)

@grades_bp.route('/', methods=['POST'])
@token_required
def add_grade(current_user):
    data = request.get_json()
    
    # Creazione del voto
    new_grade = Grade(
        user_id=current_user['_id'],
        subject=data['subject'],
        value=data['value'],
        date=data['date'],
        grade_type=data['grade_type'],
        weight=data.get('weight', 1.0),
        notes=data.get('notes', ''),
        school_year=data.get('school_year', current_user.get('school_year', {}).get('current')),
        semester=data.get('semester')
    )
    
    # Salvataggio nel database
    result = grades_collection.insert_one(new_grade.__dict__)
    
    return jsonify({
        'message': 'Voto aggiunto con successo',
        'grade': {
            'id': str(result.inserted_id),
            **new_grade.to_dict()
        }
    }), 201

@grades_bp.route('/', methods=['GET'])
@token_required
def get_grades(current_user):
    # Parametri di filtro
    school_year = request.args.get('school_year', current_user.get('school_year', {}).get('current'))
    semester = request.args.get('semester')
    subject = request.args.get('subject')
    
    # Costruzione del filtro
    filter_query = {'user_id': current_user['_id']}
    if school_year:
        filter_query['school_year'] = school_year
    if semester:
        filter_query['semester'] = int(semester)
    if subject:
        filter_query['subject'] = subject
    
    # Recupero dei voti
    grades = list(grades_collection.find(filter_query).sort('date', -1))
    
    # Conversione in formato JSON
    grades_json = []
    for grade in grades:
        grade['_id'] = str(grade['_id'])
        grade['user_id'] = str(grade['user_id'])
        grade['date'] = grade['date'].isoformat()
        grade['created_at'] = grade['created_at'].isoformat()
        grade['updated_at'] = grade['updated_at'].isoformat()
        grades_json.append(grade)
    
    return jsonify(grades_json), 200

@grades_bp.route('/<grade_id>', methods=['GET'])
@token_required
def get_grade(current_user, grade_id):
    # Recupero del voto
    grade = grades_collection.find_one({
        '_id': ObjectId(grade_id),
        'user_id': current_user['_id']
    })
    
    if not grade:
        return jsonify({'message': 'Voto non trovato'}), 404
    
    # Conversione in formato JSON
    grade['_id'] = str(grade['_id'])
    grade['user_id'] = str(grade['user_id'])
    grade['date'] = grade['date'].isoformat()
    grade['created_at'] = grade['created_at'].isoformat()
    grade['updated_at'] = grade['updated_at'].isoformat()
    
    return jsonify(grade), 200

@grades_bp.route('/<grade_id>', methods=['PUT'])
@token_required
def update_grade(current_user, grade_id):
    data = request.get_json()
    
    # Verifica se il voto esiste
    grade = grades_collection.find_one({
        '_id': ObjectId(grade_id),
        'user_id': current_user['_id']
    })
    
    if not grade:
        return jsonify({'message': 'Voto non trovato'}), 404
    
    # Campi che possono essere aggiornati
    update_fields = {}
    for field in ['subject', 'value', 'date', 'grade_type', 'weight', 'notes', 'school_year', 'semester']:
        if field in data:
            if field == 'date':
                update_fields[field] = datetime.datetime.fromisoformat(data[field])
            else:
                update_fields[field] = data[field]
    
    update_fields['updated_at'] = datetime.datetime.now()
    
    # Aggiorna il voto
    grades_collection.update_one(
        {'_id': ObjectId(grade_id)},
        {'$set': update_fields}
    )
    
    return jsonify({'message': 'Voto aggiornato con successo'}), 200

@grades_bp.route('/<grade_id>', methods=['DELETE'])
@token_required
def delete_grade(current_user, grade_id):
    # Verifica se il voto esiste
    result = grades_collection.delete_one({
        '_id': ObjectId(grade_id),
        'user_id': current_user['_id']
    })
    
    if result.deleted_count == 0:
        return jsonify({'message': 'Voto non trovato'}), 404
    
    return jsonify({'message': 'Voto eliminato con successo'}), 200

@grades_bp.route('/stats', methods=['GET'])
@token_required
def get_grade_stats(current_user):
    # Parametri di filtro
    school_year = request.args.get('school_year', current_user.get('school_year', {}).get('current'))
    semester = request.args.get('semester')
    
    # Costruzione del filtro
    filter_query = {'user_id': current_user['_id']}
    if school_year:
        filter_query['school_year'] = school_year
    if semester:
        filter_query['semester'] = int(semester)
    
    # Recupero dei voti
    grades = list(grades_collection.find(filter_query))
    
    # Calcolo delle statistiche
    subjects = {}
    total_sum = 0
    total_count = 0
    
    for grade in grades:
        subject = grade['subject']
        value = grade['value']
        weight = grade.get('weight', 1.0)
        
        if subject not in subjects:
            subjects[subject] = {
                'sum': 0,
                'weighted_sum': 0,
                'count': 0,
                'total_weight': 0,
                'grades': []
            }
        
        subjects[subject]['sum'] += value
        subjects[subject]['weighted_sum'] += value * weight
        subjects[subject]['count'] += 1
        subjects[subject]['total_weight'] += weight
        subjects[subject]['grades'].append({
            'id': str(grade['_id']),
            'value': value,
            'date': grade['date'].isoformat(),
            'type': grade['grade_type'],
            'weight': weight
        })
        
        total_sum += value
        total_count += 1
    
    # Calcolo delle medie
    stats = {
        'subjects': {},
        'overall': {
            'average': round(total_sum / total_count, 2) if total_count > 0 else 0,
            'count': total_count
        }
    }
    
    for subject, data in subjects.items():
        average = round(data['sum'] / data['count'], 2) if data['count'] > 0 else 0
        weighted_average = round(data['weighted_sum'] / data['total_weight'], 2) if data['total_weight'] > 0 else 0
        
        stats['subjects'][subject] = {
            'average': average,
            'weighted_average': weighted_average,
            'count': data['count'],
            'grades': sorted(data['grades'], key=lambda x: x['date'], reverse=True)
        }
    
    return jsonify(stats), 200