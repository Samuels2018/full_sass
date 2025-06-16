SaaS Delivery Platform
Overview

This document provides a comprehensive overview of the SaaS Delivery Platform, a microservices-based subscription management and delivery logistics system. The platform consists of seven distinct services orchestrated through Docker Compose, implementing a polyglot architecture with Laravel/PHP, Go, Python, and React/TypeScript technologies.

    For detailed microservices implementation, see Microservices Overview

    For frontend application architecture, see Frontend Application

    For deployment procedures, see Local Development Setup

System Architecture Overview

The platform implements a distributed microservices architecture with clear separation of concerns across business domains. Each service operates independently with dedicated databases and exposes RESTful APIs for inter-service communication.


Data Persistence Layer
├── dbPostgres [PostgreSQL :5432]
└── dbMongo [MongoDB :27017]
    └── API Services Layer
        ├── SaaS_de_pedidos_con_suscripción_y_entregas_concepto_auth [Laravel/PHP :8002]
        ├── SaaS_de_pedidos_con_suscripci-n_y_entregas_concepto_delivery_service [Laravel/PHP :8000]
        ├── SaaS_de_pedidos_con_suscripción_y_entregas_concepto_suscripcion_service [Laravel/PHP :8003]
        ├── sass-orders-service [Go/Gin :8005]
        ├── sass-billing-service [Go/Fiber :8004]
        └── SaaS_de_pedidos_con_suscripci-n_y_entregas_concepto_reporting_service [Python/Flask :8001]
            └── Client Layer
                └── sass_frontend [React/TypeScript :8006]


Platform Service Architecture and Port Distribution

Sources: docker-compose.yml:1-137, SaaS_de_pedidos_con_suscripci-n_y_entregas_concepto_delivery_service/README.md:1-187
Core Business Domains

The platform addresses four primary business domains through specialized microservices:
Domain	Primary Service	Supporting Services	Core Entities
User Management	SaaS_de_pedidos_con_suscripción_y_entregas_concepto_auth	All services	User, Profile, JWT
Subscription Management	SaaS_de_pedidos_con_suscripción_y_entregas_concepto_suscripcion_service	sass-billing-service	Plan, Subscription, Invoice
Order & Delivery	SaaS_de_pedidos_con_suscripci-n_y_entregas_concepto_delivery_service	sass-orders-service	Route, Delivery, Order
Analytics & Reporting	SaaS_de_pedidos_con_suscripci-n_y_entregas_concepto_reporting_service	All services	Metrics, Reports, Analytics

Sources: SaaS_de_pedidos_con_suscripci-n_y_entregas_concepto_delivery_service/README.md:18-28, sass-orders-service/README.md:11-13
Technology Stack

The platform implements a polyglot architecture with technology choices optimized for each service's specific requirements:
Backend Technologies
Service Type	Framework	Language	Database	Port
Delivery Service	Laravel 12	PHP 8.2+	PostgreSQL	8000
Auth Service	Laravel 12	PHP 8.2+	PostgreSQL	8002
Subscription Service	Laravel 12	PHP 8.2+	PostgreSQL	8003
Orders Service	Gin	Go 1.21	MongoDB	8005
Billing Service	Fiber	Go 1.21	PostgreSQL	8004
Reporting Service	Flask	Python	MongoDB	8001
Frontend	React/TypeScript	TypeScript	N/A	8006

Sources: SaaS_de_pedidos_con_suscripci-n_y_entregas_concepto_delivery_service/README.md:34-41, sass-orders-service/README.md:33-45, docker-compose.yml:40-136
Authentication Architecture

All services implement JWT-based authentication with service-specific middleware implementations:

Client Request
└── Authorization: Bearer [JWT]
    ├── Go Services
    │   └── VerifyExternalJwt middleware [golang-jwt/jwt/v5]
    └── Laravel Services
        └── Sanctum authentication
            ├── PostgreSQL [Auth Data]
            └── MongoDB [Order Data]

JWT Authentication Flow Across Service Technologies

Sources: SaaS_de_pedidos_con_suscripci-n_y_entregas_concepto_delivery_service/README.md:120-127, sass-orders-service/README.md:98, sass-orders-service/Dockerfile:1-35
Service Portfolio
Laravel/PHP Services

The platform's core business logic services are implemented in Laravel 12 with PHP 8.2+:
Delivery Service (SaaS_de_pedidos_con_suscripci-n_y_entregas_concepto_delivery_service)

Core Models:

    Route - Delivery route management with driver assignment

    Delivery - Individual package delivery tracking

    DeliveryStatus - Lifecycle state management

Key API Endpoints:

    POST /api/routes/create - Route creation

    POST /api/delivery/create - Delivery scheduling

    GET /api/delivery - Delivery listing with pagination

    PUT /api/delivery/{id} - Status updates

Sources: SaaS_de_pedidos_con_suscripci-n_y_entregas_concepto_delivery_service/README.md:129-138, SaaS_de_pedidos_con_suscripci-n_y_entregas_concepto_delivery_service/app/Models/route/Route.php:1-70
Go Microservices
Orders Service (sass-orders-service)

Built with Gin framework, implements order management with MongoDB persistence:

Technology Stack:

    Framework: gin-gonic/gin

    Authentication: golang-jwt/jwt/v5

    Database: MongoDB via mongo-driver

    Configuration: joho/godotenv

Architecture Components:

    main.go - Application bootstrap and HTTP server initialization

    config.ConnectionDB() - Database connection management

    routes.RegisterOrderRoutes() - API endpoint registration

Sources: sass-orders-service/README.md:19-31, sass-orders-service/README.md:33-45
Billing Service (sass-billing-service)

Implements billing and invoice management using Fiber framework with PostgreSQL persistence.

Sources: sass-billing-service/README.md:1-118
Python Reporting Service

The SaaS_de_pedidos_con_suscripci-n_y_entregas_concepto_reporting_service provides analytics capabilities using Flask with MongoDB for metrics storage.

Sources: SaaS_de_pedidos_con_suscripci-n_y_entregas_concepto_reporting_service/run.sh:1-31
Data Architecture

The platform implements polyglot persistence with strategic database selection based on data characteristics:
PostgreSQL Usage

    Services: Auth, Delivery, Subscription, Billing

    Data Types: Transactional data, user credentials, structured business entities

    Container: dbPostgres on port 5432

MongoDB Usage

    Services: Orders, Reporting

    Data Types: Document-based order data, analytics metrics, flexible schemas

    Container: dbMongo on port 27017

Python Services    Go Services    Laravel Services
    ├───────────────┼───────────────┤
    │               │               │
MongoDB Cluster    PostgreSQL Cluster
(dbMongo:27017)    (dbPostgres:5432)
    ├───────┼───────┴───────┼───────┘
    │       │               │
order_service   sass_auth   delivery_service
reporting_metrics   subscription_service
                billing_service


Database Distribution and Service Mapping

Sources: docker-compose.yml:3-31, docker-compose.yml:42-121, sass-orders-service/README.md:108-110
Deployment Model

The platform uses Docker containerization with multi-stage builds for optimal production deployment:
Container Architecture

All services implement consistent Docker patterns:

Go Services Multi-Stage Build:

    Build Stage: golang:1.21-alpine with dependency caching

    Runtime Stage: alpine:3.18 with minimal footprint

    Build Flags: CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s"

Laravel Services:

    Standard PHP-FPM containers with Laravel framework

    PostgreSQL connectivity with health checks

Database Containers:

    PostgreSQL with persistent volumes (db_data)

    MongoDB with persistent volumes (mongo_data)

    Health check implementations for service dependencies

Sources: sass-orders-service/Dockerfile:1-35, sass-billing-service/Dockerfile:1-35, docker-compose.yml:14-31

Service Dependencies

The Docker Compose configuration enforces proper startup ordering through health checks:
Service	Depends On	Health Check
Laravel Services	dbPostgres	pg_isready -U postgres
Go Orders Service	dbMongo	mongo --eval "db.adminCommand('ping')"
Go Billing Service	dbPostgres	pg_isready -U postgres
Python Reporting	dbMongo	mongo --eval "db.adminCommand('ping')"

Sources: docker-compose.yml:14-18, docker-compose.yml:27-31, docker-compose.yml:42-121
Integration Patterns

The platform implements standard RESTful API communication patterns with JWT authentication across all service boundaries. Each service exposes HTTP endpoints on designated ports, enabling both internal service-to-service communication and external client access through the frontend application.

Key integration characteristics:

    Authentication: JWT tokens validated by service-specific middleware

    Data Format: JSON request/response payloads

    Error Handling: Standardized HTTP status codes and error responses

    Service Discovery: Port-based routing through Docker networking