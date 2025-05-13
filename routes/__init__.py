from flask import Blueprint
from routes.auth import auth_bp
from routes.grades import grades_bp
from routes.schedule import schedule_bp
from routes.events import events_bp

# Registrazione dei blueprint
api_bp = Blueprint('api', __name__, url_prefix='/api')
api_bp.register_blueprint(auth_bp, url_prefix='/auth')
api_bp.register_blueprint(grades_bp, url_prefix='/grades')
api_bp.register_blueprint(schedule_bp, url_prefix='/schedule')
api_bp.register_blueprint(events_bp, url_prefix='/events')