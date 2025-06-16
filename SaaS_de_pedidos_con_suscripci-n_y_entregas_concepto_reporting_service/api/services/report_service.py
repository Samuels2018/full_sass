from datetime import datetime, timedelta
from api import db
from typing import Any

class ReportService:
  @staticmethod
  def get_monthly_usage(start_date: datetime, end_date: datetime) -> Any:
    model_db = db.set_db()
    if not start_date:
      start_date = datetime.now() - timedelta(days=30)

    if not end_date:
      end_date = datetime.now()

    data = [
      {
      "$match": {
          "timestamp": {
            "$gte": start_date,
            "$lte": end_date
          }
        }
      },
      {
        "$group": {
          "_id": {
            "year": {"$year": "$timestamp"},
            "month": {"$month": "$timestamp"},
            "day": {"$dayOfMonth": "$timestamp"}
          },
          "total_usage": {"$sum": "$usage_count"},
          "unique_users": {"$addToSet": "$user_id"},
          "avg_duration": {"$avg": "$duration"}
        }
      },
      {
        "$project": {
          "date": {
            "$dateToString": {
              "format": "%Y-%m-%d",
              "date": {
                "$dateFromParts": {
                  "year": "$_id.year",
                  "month": "$_id.month",
                  "day": "$_id.day"
                }
              }
            }
          },
          "total_usage": 1,
          "unique_users_count": {"$size": "$unique_users"},
          "avg_duration": {"$round": ["$avg_duration", 2]},
          "_id": 0
        }
      },
      {"$sort": {"date": 1}}
    ]


    return list(model_db.usage_metrics.aggregate(data))
  
  @staticmethod
  def get_subscriptions() -> Any:
    """Reporte de suscripciones activas"""
    data = [
      {"$match": {"status": "active"}},
      {
        "$group": {
          "_id": "$plan_type",
          "total_subscriptions": {"$sum": 1},
          "total_revenue": {"$sum": "$monthly_price"},
          "unique_users": {"$addToSet": "$user_id"}
        }
      },
      {
        "$project": {
          "plan_type": "$_id",
          "total_subscriptions": 1,
          "total_revenue": 1,
          "unique_users_count": {"$size": "$unique_users"},
          "arpu": {
            "$divide": [
              "$total_revenue",
              {"$cond": [
                {"$eq": [{"$size": "$unique_users"}, 0]},
                1,
                {"$size": "$unique_users"}
              ]}
            ]
          },
          "_id": 0
        }
      },
      {
        "$project": {
          "plan_type": 1,
          "total_subscriptions": 1,
          "total_revenue": 1,
          "unique_users_count": 1,
          "arpu": {"$round": ["$arpu", 2]}
        }
      }
    ]
    
    return list(db.set_db().subscriptions.aggregate(data))
    