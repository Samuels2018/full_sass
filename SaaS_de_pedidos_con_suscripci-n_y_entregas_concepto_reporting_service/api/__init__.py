from flask import Flask
from api import db
from .services import init_app
from flask_caching import Cache

def create_app() -> Flask:
  """Create and configure the Flask application."""
  app = Flask(__name__)
  app.config['CACHE_TYPE'] = 'SimpleCache'
  app.config['CACHE_DEFAULT_TIMEOUT'] = 300  # 5 minutos
  cache = Cache(app)
  db.set_db()
  init_app(app)
  return app

