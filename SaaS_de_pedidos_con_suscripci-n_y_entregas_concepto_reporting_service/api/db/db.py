import os
from pymongo import MongoClient
from pymongo.database import Database
from typing import Any

def set_db () -> Database[Any]:
  """ connection to the database """
  # MongoDB connection string
  mongo_db_name = os.getenv("MONGO_DB", "reporting_db")
  mongo_db_host = os.getenv("MONGO_DB_HOST", "localhost")
  mongo_db_port = os.getenv("MONGO_DB_PORT", "27017")
  mongo_uri = f'mongodb://{mongo_db_host}:{mongo_db_port}/{mongo_db_name}'
  client: MongoClient = MongoClient(
    mongo_uri,
    tls=False,  # Para conexiones seguras
    retryWrites=True,
    w="majority",
    appname="ReportingService",
    connectTimeoutMS=5000,
    socketTimeoutMS=30000
  )
    
  # Verificar conexión
  try:
    client.admin.command('ping')
    print("Conexión exitosa a MongoDB")
  except Exception as err:
    print(f"Error de conexión a MongoDB: {err}")
    raise

  db = client["reporting_db"]
  
  return db