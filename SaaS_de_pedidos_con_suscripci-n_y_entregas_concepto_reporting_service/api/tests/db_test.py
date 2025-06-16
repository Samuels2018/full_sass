import pytest
from ..db import set_db
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from flask import Flask

# Fixture para la aplicación Flask (necesaria para app_context)
@pytest.fixture
def app():
  app = Flask(__name__)
  app.config["TESTING"] = True
  yield app

# Fixture para la base de datos (opcional, para reutilizar conexión)
@pytest.fixture
def db(app):
  with app.app_context():
    db = set_db()
    yield db
    # Limpieza después de las pruebas (opcional)
    db.client.drop_database(db.name)

def test_db_connection_success(app):
  """Test successful connection to the database."""
  with app.app_context():
    db = set_db()
    assert db is not None
    assert db.command("ping") == {"ok": 1.0}

def test_db_connection_failure(monkeypatch):
  """Test connection failure with wrong URI."""
  # Sobrescribe la variable de entorno para forzar un error
  monkeypatch.setenv("MONGO_DB_HOST", "invalid_host")  # 👈 Host que no existe
  monkeypatch.setenv("MONGO_DB_PORT", "12345")  # 👈 Puerto incorrecto
  
  with pytest.raises((ConnectionFailure, ServerSelectionTimeoutError)):
    set_db()


def test_db_collections(db):
  """Test if required collections exist."""
  # Asegúrate de que las colecciones existan (puedes crearlas aquí si es necesario)
  db["usage_metrics"].insert_one({"test": "data"})
  db["subscriptions"].insert_one({"test": "data"})
  
  collections = db.list_collection_names()
  assert "usage_metrics" in collections
  assert "subscriptions" in collections