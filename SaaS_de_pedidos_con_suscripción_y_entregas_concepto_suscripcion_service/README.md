

# endpionts

post

http://127.0.0.1:3000/api/subscribe

with

Authorization
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJleHAiOjE3NDY1Nzk4ODYsImlhdCI6MTc0NjU3NjI4NiwianRpIjoiZmQ4ZjNlM2ItNTM2Ni00MTllLWFkYTEtNGJmZGViODM1OThjIn0.mVx1ax6WVpRfb8ZijoT2qCaD-fopT3RgD49Mo8RxUpU

{
  "userId": "3",
  "planId": 1,
  "status": "active",
  "startDate": "2023-11-01T00:00:00Z",
  "endDate": "2023-12-01T00:00:00Z",
  "planData": {
    "name": "Plan Básico",
    "description": "Plan ideal para pequeños negocios",
    "price": 9.99,
    "billingCycle": "monthly",
    "features": [
        "Hasta 10 usuarios",
        "5GB almacenamiento",
        "Soporte básico"
    ],
    "isActive": true
    }
}

get

http://127.0.0.1:3000/api/subscription

with

Authorization
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJleHAiOjE3NDY1Nzk4ODYsImlhdCI6MTc0NjU3NjI4NiwianRpIjoiZmQ4ZjNlM2ItNTM2Ni00MTllLWFkYTEtNGJmZGViODM1OThjIn0.mVx1ax6WVpRfb8ZijoT2qCaD-fopT3RgD49Mo8RxUpU

{
    "hasSubscription": true,
    "subscription": {
        "id": 1,
        "userId": 3,
        "planId": 1,
        "status": "active",
        "startDate": "2023-11-01T00:00:00.000Z",
        "endDate": "2023-12-01T00:00:00.000Z",
        "nextBillingDate": "2023-12-02T00:00:00.000Z",
        "createdAt": "2025-05-07T01:42:27.344Z",
        "updatedAt": "2025-05-07T01:42:27.345Z",
        "plan": {
            "id": 1,
            "name": "Plan Básico",
            "description": "Plan ideal para pequeños negocios",
            "price": "9.99",
            "billingCycle": "monthly",
            "features": [
                "Hasta 10 usuarios",
                "5GB almacenamiento",
                "Soporte básico"
            ],
            "isActive": true,
            "createdAt": "2025-05-07T00:15:19.419Z",
            "updatedAt": "2025-05-07T00:15:19.420Z"
        }
    },
    "billingInfo": {
        "nextBillingDate": "2023-12-02T00:00:00.000Z",
        "billingCycle": "monthly",
        "daysUntilRenewal": -522
    }
}


put 
http://127.0.0.1:3000/api/subscription


with

Authorization
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJleHAiOjE3NDY1Nzk4ODYsImlhdCI6MTc0NjU3NjI4NiwianRpIjoiZmQ4ZjNlM2ItNTM2Ni00MTllLWFkYTEtNGJmZGViODM1OThjIn0.mVx1ax6WVpRfb8ZijoT2qCaD-fopT3RgD49Mo8RxUpU

{
  "userId": "3",
  "planId": 1,
  "status": "active",
  "startDate": "2023-11-01T00:00:00Z",
  "endDate": "2023-12-02T00:00:00Z",
  "planData": {
    "name": "Plan Básico",
    "description": "Plan ideal para pequeños negocios",
    "price": 9.99,
    "billingCycle": "monthly",
    "features": [
        "Hasta 10 usuarios",
        "5GB almacenamiento",
        "Soporte básico"
    ],
    "isActive": true
    }
}


respuesta esperada


{
    "message": "Subscription updated successfully",
    "subscription": {
        "updatedSubscription": [
            1
        ],
        "plan": {
            "id": 1,
            "name": "Plan Básico",
            "description": "Plan ideal para pequeños negocios",
            "price": "9.99",
            "billingCycle": "monthly",
            "features": [
                "Hasta 10 usuarios",
                "5GB almacenamiento",
                "Soporte básico"
            ],
            "isActive": true,
            "createdAt": "2025-05-07T00:15:19.419Z",
            "updatedAt": "2025-05-07T00:15:19.420Z"
        }
    }
}