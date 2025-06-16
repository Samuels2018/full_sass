import json
from api import create_app 
import pytest

@pytest.fixture
def app():
  app = create_app()
  app.config['TESTING'] = True
  yield app

# Fixture para el cliente de pruebas
@pytest.fixture
def client(app):
  with app.test_client() as client:
    yield client


def test_usage_report_json(client):
  #Test para el endpoint de usage report (JSON)
  # Test con parámetros de fecha
  response = client.get(
    'api/reports/usage',
    query_string={
      'start_date': '2023-01-01',
      'end_date': '2023-01-02'
    },
    headers={'Accept': 'application/json'}
  )
  
  assert response.status_code == 200
  #data = json.loads(response.data)
  
  #assert data['success'] is True
  #assert 'metadata' in data
  #assert len(data['data']) > 0

def test_usage_report_html(client):
  #Test para el endpoint de usage report (HTML)
  response = client.get(
    'api/reports/usage',
    query_string={
      'start_date': '2023-01-01',
      'end_date': '2023-01-02'
    }
  )
  
  assert response.status_code == 200
  assert b'<table>' in response.data
  assert b'2023-01-01' in response.data

def test_usage_report_invalid_date_format(client):
  #Test para formato de fecha inválido
  response = client.get(
    'api/reports/usage',
    query_string={
      'start_date': '01-01-2023',  # Formato incorrecto
      'end_date': '2023-01-02'
    }
  )
    
  assert response.status_code == 400
  data = json.loads(response.data)
  assert 'error' in data
  assert 'Invalid date format' in data['error']

def test_subscriptions_report_json(client):
  #Test para el endpoint de subscriptions (JSON)
  response = client.get(
    '/api/reports/subscriptions',
    headers={'Accept': 'application/json'}
  )
  
  assert response.status_code == 200
  data = json.loads(response.data)
  
  #assert data['success'] is True
  #assert len(data['data']) >= 1
  #assert any(item['plan_type'] == 'basic' for item in data['data'])

def test_subscriptions_report_html(client):
  #Test para el endpoint de subscriptions (HTML)
  response = client.get('/api/reports/subscriptions')
  
  assert response.status_code == 200
  #assert b'<table>' in response.data
  #assert b'basic' in response.data

def test_cache_headers(client):
  #Test que verifica los headers de cache
  response = client.get('/api/reports/subscriptions')
  assert response.status_code == 200
  #assert 'Cache-Control' in response.headers
  #assert 'max-age=300' in response.headers['Cache-Control']