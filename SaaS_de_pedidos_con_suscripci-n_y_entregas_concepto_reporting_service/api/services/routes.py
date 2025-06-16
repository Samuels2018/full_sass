from flask import Blueprint, render_template, jsonify, request, Response
from flask_caching import Cache
from api.services.report_service import ReportService
from datetime import datetime
from typing import Any, cast

reports = Blueprint('reports', __name__)
cache = Cache(config={'CACHE_TYPE': 'simple'})

def init_app(app) -> None:
  cache.init_app(app)
  app.register_blueprint(reports, url_prefix='/api/reports')

@reports.route('/usage', methods=['GET'])
@cache.cached(timeout=300, query_string=True)
def usage_report() -> tuple[Response, Any] | tuple[str, int]:
  try: 
    start_date = datetime.strptime(cast(str, request.args.get('start_date')), '%Y-%m-%d')
    end_date = datetime.strptime(cast(str, request.args.get('end_date')), '%Y-%m-%d')

    data = ReportService.get_monthly_usage(start_date, end_date)

    metadata = {
      "start_date": start_date.isoformat() if start_date else None,
      "end_date": end_date.isoformat() if end_date else None,
      "generated_at": datetime.utcnow().isoformat(),
      "record_count": len(data)
    }

    # Respuesta JSON
    if request.accept_mimetypes['application/json']:
      return jsonify({
        "success": True,
        "data": data,
        "metadata": metadata
      }), 200
    
    # Respuesta HTML con caching
    return render_template(
      'usage_report.html',
      data=data,
      metadata=metadata,
      cache_key=request.url  # Usamos la URL como clave de cache
    ), 200
  
  except ValueError as err:
    print(f"ValueError: {err}")
    return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

  except Exception as err:
    return jsonify({"error": str(err)}), 500
  
@reports.route('/subscriptions', methods=['GET'])
@cache.cached(timeout=300, query_string=True)
def suscription_report() -> tuple[Response, Any] | tuple[str, int]:
  try:
    data = ReportService.get_subscriptions()
    metadata = {
      "generated_at": datetime.utcnow().isoformat(),
      "record_count": len(data)
    }

    if request.accept_mimetypes['application/json']:
      return jsonify({
        "success": True,
        "data": data,
        "metadata": metadata
      }), 200
        
    return render_template(
      'subscriptions_report.html',
      data=data,
      metadata=metadata,
      cache_key=request.url
    ), 200

  except Exception as err:
    return jsonify({
      "success": False,
      "error": str(err)
    }), 500