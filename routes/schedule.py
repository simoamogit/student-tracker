from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
import datetime

from models import schedules_collection
from models.schedule import ScheduleItem
from routes.auth import token_required

schedule_bp = Blueprint('schedule', __name__)

@schedule_bp.route('/', methods=['POST'])
@token_required
def add_schedule_item(current_user):
    data = request.get_json()
    
    # Creazione dell'elemento di orario
    new_item = ScheduleItem(
        user_id=current_user['_id'],
        day=data['day'],
        hour=data['hour'],
        subject=data['subject'],
        teacher=data.get('teacher', ''),
        classroom=data.get('classroom', ''),
        school_year=data.get('school_year', current_user.get('school_year', {}).get('current'))
    )
    
    # Verifica se esiste già un elemento per lo stesso giorno e ora
    existing = schedules_collection.find_one({
        'user_id': current_user['_id'],
        'day': data['day'],
        'hour': data['hour'],
        'school_year': new_item.school_year
    })
    
    if existing:
        # Aggiorna l'elemento esistente
        schedules_collection.update_one(
            {'_id': existing['_id']},
            {'$set': {
                'subject': new_item.subject,
                'teacher': new_item.teacher,
                'classroom': new_item.classroom,
                'updated_at': datetime.datetime.now()
            }}
        )
        return jsonify({'message': 'Orario aggiornato con successo', 'id': str(existing['_id'])}), 200
    else:
        # Salvataggio nel database
        result = schedules_collection.insert_one(new_item.__dict__)
        return jsonify({
            'message': 'Orario aggiunto con successo',
            'id': str(result.inserted_id)
        }), 201

@schedule_bp.route('/', methods=['GET'])
@token_required
def get_schedule(current_user):
    # Parametri di filtro
    school_year = request.args.get('school_year', current_user.get('school_year', {}).get('current'))
    day = request.args.get('day')
    
    # Costruzione del filtro
    filter_query = {'user_id': current_user['_id']}
    if school_year:
        filter_query['school_year'] = school_year
    if day is not None:
        filter_query['day'] = int(day)
    
    # Recupero degli elementi di orario
    items = list(schedules_collection.find(filter_query).sort([('day', 1), ('hour', 1)]))
    
    # Conversione in formato JSON
    items_json = []
    for item in items:
        item['_id'] = str(item['_id'])
        item['user_id'] = str(item['user_id'])
        item['created_at'] = item['created_at'].isoformat()
        item['updated_at'] = item['updated_at'].isoformat()
        items_json.append(item)
    
    return jsonify(items_json), 200

@schedule_bp.route('/<item_id>', methods=['PUT'])
@token_required
def update_schedule_item(current_user, item_id):
    data = request.get_json()
    
    # Verifica se l'elemento esiste
    item = schedules_collection.find_one({
        '_id': ObjectId(item_id),
        'user_id': current_user['_id']
    })
    
    if not item:
        return jsonify({'message': 'Elemento di orario non trovato'}), 404
    
    # Campi che possono essere aggiornati
    update_fields = {}
    for field in ['day', 'hour', 'subject', 'teacher', 'classroom', 'school_year']:
        if field in data:
            update_fields[field] = data[field]
    
    update_fields['updated_at'] = datetime.datetime.now()
    
    # Aggiorna l'elemento
    schedules_collection.update_one(
        {'_id': ObjectId(item_id)},
        {'$set': update_fields}
    )
    
    return jsonify({'message': 'Elemento di orario aggiornato con successo'}), 200

@schedule_bp.route('/<item_id>', methods=['DELETE'])
@token_required
def delete_schedule_item(current_user, item_id):
    # Verifica se l'elemento esiste
    result = schedules_collection.delete_one({
        '_id': ObjectId(item_id),
        'user_id': current_user['_id']
    })
    
    if result.deleted_count == 0:
        return jsonify({'message': 'Elemento di orario non trovato'}), 404
    
    return jsonify({'message': 'Elemento di orario eliminato con successo'}), 200

@schedule_bp.route('/today', methods=['GET'])
@token_required
def get_today_schedule(current_user):
    # Ottieni il giorno della settimana (0 = lunedì, 6 = domenica)
    today = datetime.datetime.now().weekday()
    
    # Parametri di filtro
    school_year = request.args.get('school_year', current_user.get('school_year', {}).get('current'))
    
    # Costruzione del filtro
    filter_query = {
        'user_id': current_user['_id'],
        'day': today
    }
    if school_year:
        filter_query['school_year'] = school_year
    
    # Recupero degli elementi di orario
    items = list(schedules_collection.find(filter_query).sort('hour', 1))
    
    # Conversione in formato JSON
    items_json = []
    for item in items:
        item['_id'] = str(item['_id'])
        item['user_id'] = str(item['user_id'])
        item['created_at'] = item['created_at'].isoformat()
        item['updated_at'] = item['updated_at'].isoformat()
        items_json.append(item)
    
    return jsonify(items_json), 200