from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from routes import api_bp

# Inizializzazione dell'app Flask
app = Flask(__name__)
app.config.from_object(Config)

# Abilita CORS
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Registrazione delle rotte
app.register_blueprint(api_bp)

# Rotta di test
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Student Tracker API is running'}), 200

# Gestione degli errori
@app.errorhandler(404)
def not_found(error):
    return jsonify({'message': 'Risorsa non trovata'}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({'message': 'Errore interno del server'}), 500

if __name__ == '__main__':
    app.run(debug=True)