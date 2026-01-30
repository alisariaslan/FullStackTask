# Backend Project Architecture

## Overview

This project implements a high-performance, event-driven microservices architecture based on **12-Factor App** principles. It focuses on scalability, separation of concerns through Onion Architecture, and asynchronous inter-service communication.

The main components are:

* **Auth Service:** Identity management and JWT/Refresh token issuance.
* **Log Service:** Centralized log consumer and processor.
* **Product Service:** Core business domain with CQRS and Caching.
* **API Gateway (YARP):** Unified entry point with traffic management.

## Technology Stack

* **Language/Framework:** C# (.NET 10.0)
* **Communication:** REST (External), RabbitMQ/MassTransit (Internal Event-Driven)
* **API Gateway:** YARP (Yet Another Reverse Proxy)
* **Containerization:** Docker & Docker Compose
* **Orchestration Tools:** Seq (Log Visualization), Redis (Caching)

## Onion Architecture Configuration

Each microservice follows a strict Onion Architecture to ensure domain logic remains independent of external concerns:

**Services.(Name).API** *(Controllers, Program.cs, Middleware, Dependency Injection)* ↓

**Services.(Name).Infrastructure** *(DB Context, Repository Implementations, External Service Clients)* ↓

**Services.(Name).Application** *(MediatR Handlers, CQRS Commands/Queries, Mappers, Interfaces)* ↓

**Services.(Name).Domain** *(Entities, Value Objects, Domain Exceptions)* ↓

**Shared.Kernel** *(Cross-cutting concerns used by all layers)*

## Infrastructure & Resilience

* **Database:** PostgreSQL (Database-per-service pattern). `AuthDb` and `ProductDb` are isolated.
* **Cache:** **Redis** is integrated into the Product Service for high-speed query performance.
* **Message Queue:** **RabbitMQ** with **MassTransit** handles asynchronous communication.
* **Resilience:** Implemented **Message Retry** policies (5 retries, 10s intervals) for robust event processing.
* **Logging:** Centralized structured logging using **Serilog** and **Seq**.

## Service Details

### API Gateway (YARP)

* **Routing:** Directs traffic to internal services using Docker service discovery.
* **Traffic Control:** Implements **Fixed Window Rate Limiting** (100 requests/min) to prevent abuse.
* **CORS:** Global CORS policy enabled for frontend integration.
* **Health Monitoring:** Centralized `/health` checks for all downstream services.

### Auth Service

* **Identity:** Handles registration, login, and JWT token generation.
* **Security:** Role and Policy-based authorization ready.
* **Persistence:** Entity Framework Core with Npgsql.
* **Auto-Migration:** Applies DB migrations automatically on startup to ensure environment consistency.

### Product Service

* **Optimization:** Uses the **CQRS Pattern** via MediatR to separate read and write operations.
* **Performance:** Implements **Redis Caching** for product listings and categories.
* **Storage:** Integrated `IImageService` for product image management.
* **Events:** Firing events to RabbitMQ when product data changes.

### Log Service

* **Event Consumer:** Uses `LogCreatedConsumer` to process logs asynchronously from the queue.
* **Centralization:** Acts as a bridge to push logs into structured storage (Seq/File).
* **Decoupling:** Services can fire-and-forget logs without impacting user response times.

## Key Design Decisions

* **Microservices Architecture:** Independent deployment and scaling of individual business units.
* **API Gateway Pattern:** Provides a single, secure entry point and hides internal system complexity.
* **Eventual Consistency:** Log processing and cross-service notifications are handled via RabbitMQ events.
* **Shared Kernel Strategy:** A shared project manages common logic like `LocalizationBehavior`, `ExceptionMiddleware`, and DTOs to ensure DRY (Don't Repeat Yourself).
* **Environment Management:** Configuration is managed via environment variables and `.env` files for seamless Docker deployment.

## Shared Kernel Details

* **Behaviors:** `LocalizationBehavior<,>` for automated multi-language support in MediatR pipelines.
* **Middlewares:** `ExceptionMiddleware` for global, structured error handling and consistent API responses.
* **Packages:**
* `MassTransit.Abstractions` (Messaging)
* `MediatR` (Internal Dispatching)
* `Serilog.AspNetCore` & `Serilog.Sinks.Seq` (Logging)
* `Swashbuckle.AspNetCore` (OpenAPI/Swagger documentation with JWT support)

## Installation & Deployment

* ​[Full-Stack Task](../README.md): Visit parent md.



