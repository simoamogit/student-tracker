from flask import Blueprint, request, jsonify
import jwt
import bcrypt
import datetime
from bson.objectid import ObjectId
from functools import wraps

from config import Config
from models import users_collection
from models.user import User

auth_bp = Blueprint('auth', __name__)

# Funzione per generare il token JWT
def generate_token(user_id):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24),
        'iat': datetime.datetime.utcnow(),
        'sub': str(user_id)
    }
    return jwt.encode(
        payload,
        Config.JWT_SECRET_KEY,
        algorithm='HS256'
    )

# Decoratore per proteggere le rotte
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Token mancante'}), 401
        
        if not token:
            return jsonify({'message': 'Token mancante'}), 401
        
        try:
            payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
            user_id = payload['sub']
            current_user = users_collection.find_one({'_id': ObjectId(user_id)})
            
            if not current_user:
                return jsonify({'message': 'Utente non trovato'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token scaduto'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token non valido'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Verifica se l'email esiste già
    if users_collection.find_one({'email': data['email']}):
        return jsonify({'message': 'Email già registrata'}), 409
    
    # Hash della password
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    
    # Creazione dell'utente
    new_user = User(
        email=data['email'],
        password=hashed_password.decode('utf-8'),
        name=data['name'],
        school_year={"current": data.get('school_year', '2023-2024')}
    )
    
    # Salvataggio nel database
    result = users_collection.insert_one(new_user.__dict__)
    
    # Generazione del token
    token = generate_token(result.inserted_id)
    
    return jsonify({
        'message': 'Utente registrato con successo',
        'token': token,
        'user': {
            'id': str(result.inserted_id),
            'email': new_user.email,
            'name': new_user.name
        }
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Trova l'utente
    user = users_collection.find_one({'email': data['email']})
    
    if not user:
        return jsonify({'message': 'Email o password non validi'}), 401
    
 # Verifica la password
    if bcrypt.checkpw(data['password'].encode('utf-8'), user['password'].encode('utf-8')):
        # Genera il token
        token = generate_token(user['_id'])
        
        return jsonify({
            'message': 'Login effettuato con successo',
            'token': token,
            'user': {
                'id': str(user['_id']),
                'email': user['email'],
                'name': user['name'],
                'school_year': user.get('school_year', {})
            }
        }), 200
    
    return jsonify({'message': 'Email o password non validi'}), 401

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_user_info(current_user):
    return jsonify({
        'id': str(current_user['_id']),
        'email': current_user['email'],
        'name': current_user['name'],
        'school_year': current_user.get('school_year', {})
    }), 200

@auth_bp.route('/change-password', methods=['PUT'])
@token_required
def change_password(current_user):
    data = request.get_json()
    
    # Verifica la vecchia password
    if not bcrypt.checkpw(data['old_password'].encode('utf-8'), current_user['password'].encode('utf-8')):
        return jsonify({'message': 'Password attuale non corretta'}), 401
    
    # Hash della nuova password
    hashed_password = bcrypt.hashpw(data['new_password'].encode('utf-8'), bcrypt.gensalt())
    
    # Aggiorna la password
    users_collection.update_one(
        {'_id': current_user['_id']},
        {'$set': {'password': hashed_password.decode('utf-8'), 'updated_at': datetime.datetime.now()}}
    )
    
    return jsonify({'message': 'Password aggiornata con successo'}), 200

@auth_bp.route('/update-profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.get_json()
    
    # Campi che possono essere aggiornati
    update_fields = {}
    if 'name' in data:
        update_fields['name'] = data['name']
    if 'school_year' in data:
        update_fields['school_year'] = data['school_year']
    
    update_fields['updated_at'] = datetime.datetime.now()
    
    # Aggiorna il profilo
    users_collection.update_one(
        {'_id': current_user['_id']},
        {'$set': update_fields}
    )
    
    return jsonify({'message': 'Profilo aggiornato con successo'}), 200