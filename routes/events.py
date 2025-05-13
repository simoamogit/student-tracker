from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
import datetime

from models import events_collection
from models.event import Event
from routes.auth import token_required

events_bp = Blueprint('events', __name__)

@events_bp.route('/', methods=['POST'])
@token_required
def add_event(current_user):
    data = request.get_json()
    
    # Creazione dell'evento
    new_event = Event(
        user_id=current_user['_id'],
        title=data['title'],
        description=data.get('description', ''),
        start_date=data['start_date'],
        end_date=data.get('end_date', data['start_date']),
        event_type=data['event_type'],
        subject=data.get('subject'),
        school_year=data.get('school_year', current_user.get('school_year', {}).get('current'))
    )
    
    # Salvataggio nel database
    result = events_collection.insert_one(new_event.__dict__)
    
    return jsonify({
        'message': 'Evento aggiunto con successo',
        'event': {
            'id': str(result.inserted_id),
            **new_event.to_dict()
        }
    }), 201

@events_bp.route('/', methods=['GET'])
@token_required
def get_events(current_user):
    # Parametri di filtro
    school_year = request.args.get('school_year', current_user.get('school_year', {}).get('current'))
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    event_type = request.args.get('event_type')
    subject = request.args.get('subject')
    
    # Costruzione del filtro
    filter_query = {'user_id': current_user['_id']}
    if school_year:
        filter_query['school_year'] = school_year
    if event_type:
        filter_query['event_type'] = event_type
    if subject:
        filter_query['subject'] = subject
    
    # Filtro per data
    date_filter = {}
    if start_date:
        date_filter['$gte'] = datetime.datetime.fromisoformat(start_date)
    if end_date:
        date_filter['$lte'] = datetime.datetime.fromisoformat(end_date)
    
    if date_filter:
        filter_query['start_date'] = date_filter
    
    # Recupero degli eventi
    events = list(events_collection.find(filter_query).sort('start_date', 1))
    
    # Conversione in formato JSON
    events_json = []
    for event in events:
        event['_id'] = str(event['_id'])
        event['user_id'] = str(event['user_id'])
        event['start_date'] = event['start_date'].isoformat()
        event['end_date'] = event['end_date'].isoformat()
        event['created_at'] = event['created_at'].isoformat()
        event['updated_at'] = event['updated_at'].isoformat()
        events_json.append(event)
    
    return jsonify(events_json), 200

@events_bp.route('/<event_id>', methods=['GET'])
@token_required
def get_event(current_user, event_id):
    # Recupero dell'evento
    event = events_collection.find_one({
        '_id': ObjectId(event_id),
        'user_id': current_user['_id']
    })
    
    if not event:
        return jsonify({'message': 'Evento non trovato'}), 404
    
    # Conversione in formato JSON
    event['_id'] = str(event['_id'])
    event['user_id'] = str(event['user_id'])
    event['start_date'] = event['start_date'].isoformat()
    event['end_date'] = event['end_date'].isoformat()
    event['created_at'] = event['created_at'].isoformat()
    event['updated_at'] = event['updated_at'].isoformat()
    
    return jsonify(event), 200

@events_bp.route('/<event_id>', methods=['PUT'])
@token_required
def update_event(current_user, event_id):
    data = request.get_json()
    
    # Verifica se l'evento esiste
    event = events_collection.find_one({
        '_id': ObjectId(event_id),
        'user_id': current_user['_id']
    })
    
    if not event:
        return jsonify({'message': 'Evento non trovato'}), 404
    
    # Campi che possono essere aggiornati
    update_fields = {}
    for field in ['title', 'description', 'start_date', 'end_date', 'event_type', 'subject', 'school_year']:
        if field in data:
            if field in ['start_date', 'end_date']:
                update_fields[field] = datetime.datetime.fromisoformat(data[field])
            else:
                update_fields[field] = data[field]
    
    update_fields['updated_at'] = datetime.datetime.now()
    
    # Aggiorna l'evento
    events_collection.update_one(
        {'_id': ObjectId(event_id)},
        {'$set': update_fields}
    )
    
    return jsonify({'message': 'Evento aggiornato con successo'}), 200

@events_bp.route('/<event_id>', methods=['DELETE'])
@token_required
def delete_event(current_user, event_id):
    # Verifica se l'evento esiste
    result = events_collection.delete_one({
        '_id': ObjectId(event_id),
        'user_id': current_user['_id']
    })
    
    if result.deleted_count == 0:
        return jsonify({'message': 'Evento non trovato'}), 404
    
    return jsonify({'message': 'Evento eliminato con successo'}), 200

@events_bp.route('/upcoming', methods=['GET'])
@token_required
def get_upcoming_events(current_user):
    # Parametri di filtro
    school_year = request.args.get('school_year', current_user.get('school_year', {}).get('current'))
    days = int(request.args.get('days', 7))  # Numero di giorni futuri da considerare
    
    # Data corrente e data limite
    now = datetime.datetime.now()
    limit_date = now + datetime.timedelta(days=days)
    
    # Costruzione del filtro
    filter_query = {
        'user_id': current_user['_id'],
        'start_date': {
            '$gte': now,
            '$lte': limit_date
        }
    }
    if school_year:
        filter_query['school_year'] = school_year
    
    # Recupero degli eventi
    events = list(events_collection.find(filter_query).sort('start_date', 1))
    
    # Conversione in formato JSON
    events_json = []
    for event in events:
        event['_id'] = str(event['_id'])
        event['user_id'] = str(event['user_id'])
        event['start_date'] = event['start_date'].isoformat()
        event['end_date'] = event['end_date'].isoformat()
        event['created_at'] = event['created_at'].isoformat()
        event['updated_at'] = event['updated_at'].isoformat()
        events_json.append(event)
    
    return jsonify(events_json), 200