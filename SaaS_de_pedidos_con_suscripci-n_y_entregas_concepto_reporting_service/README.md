📊 Reporting Service – SaaS de Pedidos con Suscripción y Entregas
Este microservicio forma parte de una arquitectura basada en microservicios para una plataforma SaaS de pedidos con suscripciones y entregas. El servicio de reportes permite obtener métricas clave como el uso mensual del sistema y las suscripciones activas.

🚀 Tecnologías Utilizadas
Python 3.11

Flask: Framework web ligero para Python.

Docker: Contenerización de la aplicación.

Pytest: Framework de pruebas para Python.

Postman: Colección de pruebas de la API.

📦 Instalación y Ejecución
Requisitos Previos
Python 3.11 o superior

Docker y Docker Compose (opcional, para contenedores)

pipenv o virtualenv para gestión de entornos virtuales

Ejecución Manual
Clona el repositorio:

git clone https://github.com/Samuels2018/SaaS_de_pedidos_con_suscripci-n_y_entregas_concepto_reporting_service.git
cd SaaS_de_pedidos_con_suscripci-n_y_entregas_concepto_reporting_service
Crea y activa un entorno virtual:

python -m venv env
source env/bin/activate  # En Windows: env\Scripts\activate
Instala las dependencias:

pip install -r requirements.txt
Configura las variables de entorno:

Copia el archivo .env.example y renómbralo a .env. Luego, ajusta las variables según tu configuración.

Inicia el servidor:

python run.py
El servidor estará disponible en http://127.0.0.1:5000/.

Ejecución con Docker
Este proyecto incluye un run.sh para facilitar el despliegue del servicio con Docker.

Concede permisos de ejecución al script:

chmod +x run.sh
Ejecuta el script para construir y levantar el contenedor:

./run.sh
Esto construirá la imagen y levantará el contenedor en segundo plano. La API estará disponible en http://localhost:5000/.

tests
pytest api/tests -v

📈 Endpoints Disponibles

# endpoints

http://127.0.0.1:5000/api/reports/subscriptions
{
    "data": [],
    "metadata": {
        "generated_at": "2025-05-05T18:40:14.477107",
        "record_count": 0
    },
    "success": true
}

http://127.0.0.1:5000/api/reports/usage?start_date=2023-01-01&end_date=2023-01-31

{
    "data": [],
    "metadata": {
        "end_date": "2023-01-31T00:00:00",
        "generated_at": "2025-05-05T18:44:46.562272",
        "record_count": 0,
        "start_date": "2023-01-01T00:00:00"
    },
    "success": true
}