import pytest
from datetime import datetime
from unittest.mock import patch, MagicMock
from api.services.report_service import ReportService
from typing import Generator
from api import db

@pytest.fixture
def mock_db() -> Generator[MagicMock, None, None]:
  """Fixture para simular la base de datos"""
  with patch('api.db.set_db') as mock_set_db:
    mock_db = MagicMock()
    mock_set_db.return_value = mock_db
    yield mock_db

@pytest.fixture
def sample_usage_data() -> list:
  """Datos de ejemplo para usage_metrics"""
  return [
    {
      "timestamp": datetime(2023, 1, 1),
      "usage_count": 10,
      "user_id": "user1",
      "duration": 5.5
    },
    {
      "timestamp": datetime(2023, 1, 1),
      "usage_count": 15,
      "user_id": "user2",
      "duration": 8.2
    },
    {
      "timestamp": datetime(2023, 1, 2),
      "usage_count": 5,
      "user_id": "user1",
      "duration": 3.1
    }
  ]

@pytest.fixture
def sample_subscriptions_data() -> list:
  """Datos de ejemplo para subscriptions"""
  return [
    {
      "plan_type": "basic",
      "status": "active",
      "user_id": "user1",
      "monthly_price": 10.0
    },
    {
      "plan_type": "basic",
      "status": "active",
      "user_id": "user2",
      "monthly_price": 10.0
    },
    {
      "plan_type": "premium",
      "status": "active",
      "user_id": "user3",
      "monthly_price": 20.0
    },
    {
      "plan_type": "premium",
      "status": "canceled",
      "user_id": "user4",
      "monthly_price": 20.0
    }
  ]

def test_get_monthly_usage_with_dates(mock_db, sample_usage_data) -> None:
  """Test para get_monthly_usage con fechas específicas"""
  # Configurar el mock
  mock_db.usage_metrics.aggregate.return_value = [
    {
      "date": "2023-01-01",
      "total_usage": 25,
      "unique_users_count": 2,
      "avg_duration": 6.85
    },
    {
      "date": "2023-01-02",
      "total_usage": 5,
      "unique_users_count": 1,
      "avg_duration": 3.1
    }
  ]
    
  # Fechas de prueba
  start_date = datetime(2023, 1, 1)
  end_date = datetime(2023, 1, 2)
  
  # Llamar al método
  result = ReportService.get_monthly_usage(start_date, end_date)
  
  # Verificar resultados
  assert len(result) == 2
  assert result[0]['date'] == "2023-01-01"
  assert result[0]['total_usage'] == 25
  assert result[0]['unique_users_count'] == 2
  assert result[0]['avg_duration'] == 6.85
  
  # Verificar que se llamó a aggregate con el pipeline correcto
  mock_db.usage_metrics.aggregate.assert_called_once()
  pipeline = mock_db.usage_metrics.aggregate.call_args[0][0]
  assert pipeline[0]["$match"]["timestamp"]["$gte"] == start_date
  assert pipeline[0]["$match"]["timestamp"]["$lte"] == end_date



def test_get_monthly_usage_default_dates(mock_db) -> None:
  #Test para get_monthly_usage con fechas por defecto
  # Configurar el mock
  mock_db.usage_metrics.aggregate.return_value = []

  default_start_date = datetime(1970, 1, 1)  # Ejemplo de fecha predeterminada
  default_end_date = datetime.utcnow()
  
  # Llamar al método sin fechas
  ReportService.get_monthly_usage(default_start_date, default_end_date)
  
  # Verificar que se usaron fechas por defecto
  pipeline = mock_db.usage_metrics.aggregate.call_args[0][0]
  assert "$match" in pipeline[0]
  assert "$gte" in pipeline[0]["$match"]["timestamp"]
  assert "$lte" in pipeline[0]["$match"]["timestamp"]

def test_get_monthly_usage_empty_result(mock_db) -> None:
  #Test para get_monthly_usage sin resultados
  mock_db.usage_metrics.aggregate.return_value = []
  
  result = ReportService.get_monthly_usage(
    datetime(2023, 1, 1), 
    datetime(2023, 1, 2)
  )
  
  assert result == []


def test_get_subscriptions(mock_db, sample_subscriptions_data) -> None:
  #Test para get_subscriptions
  # Configurar el mock
  mock_db.subscriptions.aggregate.return_value = [
    {
      "plan_type": "basic",
      "total_subscriptions": 2,
      "total_revenue": 20.0,
      "unique_users_count": 2,
      "arpu": 10.0
    },
    {
      "plan_type": "premium",
      "total_subscriptions": 1,
      "total_revenue": 20.0,
      "unique_users_count": 1,
      "arpu": 20.0
    }
  ]
  
  # Llamar al método
  result = ReportService.get_subscriptions()
  
  # Verificar resultados
  assert len(result) == 2
  assert result[0]['plan_type'] == "basic"
  assert result[0]['total_subscriptions'] == 2
  assert result[0]['total_revenue'] == 20.0
  assert result[0]['arpu'] == 10.0
  
  # Verificar que se llamó a aggregate con el pipeline correcto
  mock_db.subscriptions.aggregate.assert_called_once()
  pipeline = mock_db.subscriptions.aggregate.call_args[0][0]
  assert pipeline[0] == {"$match": {"status": "active"}}


def test_get_subscriptions_empty_result(mock_db) -> None:
  #Test para get_subscriptions sin resultados
  mock_db.subscriptions.aggregate.return_value = []
  
  result = ReportService.get_subscriptions()
  
  assert result == []


@pytest.mark.integration
def test_get_monthly_usage_integration():
  #Test de integración con MongoDB real
    
    # Insertar datos de prueba
    db_model = db.set_db()
    db_model.usage_metrics.insert_many([
      {
        "timestamp": datetime(2023, 1, 1),
        "usage_count": 10,
        "user_id": "user1",
        "duration": 5.5
      },
      {
        "timestamp": datetime(2023, 1, 1),
        "usage_count": 15,
        "user_id": "user2",
        "duration": 8.2
      }
    ])
    
    # Llamar al método
    result = ReportService.get_monthly_usage(
      datetime(2023, 1, 1),
      datetime(2023, 1, 1)
    )
    
    # Verificar resultados
    assert len(result) == 1
    assert result[0]['date'] == "2023-01-01"
    assert result[0]['total_usage'] == 25
    assert result[0]['unique_users_count'] == 2
    assert isinstance(result[0]['avg_duration'], float)
    
    # Limpiar
    db_model.usage_metrics.drop()