# 🛠️ Detailed Setup & Deployment Guide

This document provides a **step-by-step, in-depth setup guide** for developers who want to fully understand, customize, or debug the system beyond the quick `docker-compose up` workflow.

It is written based on the ​**actual Docker Compose, environment variables, gateway configuration, and frontend API strategy used in this repository**​.

## 📦 System Overview

The system is composed of the following components, all running in Docker containers:

### Backend Infrastructure

* **PostgreSQL** – Primary database (AuthDb & ProductDb)
* **Redis** – Distributed cache (Product queries)
* **RabbitMQ** – Event bus for asynchronous communication
* **Seq** – Centralized structured logging

### Backend Services (.NET)

* **Auth API** – Authentication & JWT issuing
* **Product API** – Product domain (CQRS + Cache)
* **Log API** – Central log consumer
* **YARP Gateway** – API Gateway & Rate Limiting

### Frontend

* **Next.js 14 Web Application** – SSR/ISR enabled UI

All services communicate over a dedicated Docker bridge network: `micro-net`.

## 🔌 Network & Port Mapping

| Service            | Internal Port | External Port |
| -------------------- | --------------- | --------------- |
| PostgreSQL         | 5432          | 6000          |
| Redis              | 6379          | 6001          |
| RabbitMQ (AMQP)    | 5672          | 6002          |
| RabbitMQ UI        | 15672         | 6003          |
| API Gateway (YARP) | 8080          | 6004          |
| Frontend (Next.js) | 3000          | 6005          |
| Auth API           | 8080          | 6006          |
| Product API        | 8080          | 6007          |
| Seq                | 80            | 6008          |
| Log API            | 8080          | 6009          |

## 🐘 PostgreSQL Setup

### Container

* Image: `postgres:17-alpine`
* Container name: `micro_postgres`

### Credentials

```text
Username: postgres
Password: a5134ba8
```

### Databases

* `AuthDb` → Auth Service
* `ProductDb` → Product Service

### Persistence

```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data
```

This ensures data is preserved across container restarts.

### Health Check

PostgreSQL is marked healthy using:

```bash
pg_isready -U postgres
```

Other services **wait until the DB is ready** before starting.

## ⚡ Redis Cache

* Used **only by Product Service**
* Accelerates read-heavy queries (product listing & categories)

```text
Host: redis-cache
Port: 6379
```

Redis health is validated using:

```bash
redis-cli ping
```

## 🐇 RabbitMQ Event Bus

RabbitMQ enables **event-driven communication** between services.

### Ports

* AMQP: `6002`
* Management UI: `6003`

### Default UI Credentials

```text
Username: admin
Password: admin
```

### Usage

* Product Service emits domain events
* Log Service consumes log events asynchronously

## 📊 Centralized Logging (Seq)

Seq collects **structured logs** from all .NET services via Serilog.

### Access

```text
http://localhost:6008
```

### Default Admin Password

```text
admin
```

All services send logs using:

```text
http://micro_seq:80
```

## 🔐 Auth API

### Responsibilities

* User registration
* User login
* JWT generation

### Environment Variables

```env
ConnectionStrings__PostgreConnection=Host=postgres-db;Database=AuthDb
JwtSettings__Key=...
JwtSettings__Issuer=MicroserviceApp
JwtSettings__Audience=MicroserviceApp
```

### Startup Behavior

* Automatically applies EF Core migrations
* Exposes `/health` endpoint

## 📦 Product API

### Responsibilities

* Product CRUD (CQRS)
* Redis caching
* RabbitMQ event publishing

### Image Storage

Product images are persisted via:

```yaml
volumes:
  - ./images:/app/wwwroot/images
```

### Cache Strategy

* Queries cached in Redis
* Cache invalidated on Create / Update / Delete commands

## 📝 Log API

### Responsibilities

* Consumes events from RabbitMQ
* Pushes logs into Seq
* Decouples logging from request lifecycle

This ensures **no performance impact** on user-facing APIs.

## 🌐 API Gateway (YARP)

The gateway acts as the **single entry point** for all frontend requests.

### Routing

| Public Path             | Target Service |
| ------------------------- | ---------------- |
| `/api/auth/*`       | Auth API       |
| `/api/products/*`   | Product API    |
| `/api/categories/*` | Product API    |
| `/api/logs/*`       | Log API        |

### Features

* Fixed Window Rate Limiting
* Centralized CORS
* Health aggregation

## 🖥️ Frontend (Next.js)

### Runtime Mode

The frontend automatically switches API targets based on execution context:

```ts
if (typeof window !== 'undefined') {
  NEXT_PUBLIC_API_URL
} else {
  API_URL
}
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:6004
API_URL=http://micro_product_api:8080/api
```

### Authentication Flow

* JWT stored in `localStorage`
* Token attached automatically to API requests
* 401 responses trigger logout & redirect

## ▶️ Running the System

### First-Time Startup

```bash
docker-compose up --build -d
```

### Verify Health

```bash
docker ps
```

All services should show ​**healthy**​.

## 🧪 Useful URLs

* Frontend: [http://localhost:6005](http://localhost:6005/)
* Gateway: [http://localhost:6004](http://localhost:6004/)
* Auth Swagger: [http://localhost:6006/swagger](http://localhost:6006/swagger)
* Product Swagger: [http://localhost:6007/swagger](http://localhost:6007/swagger)
* Log Swagger: [http://localhost:6009/swagger](http://localhost:6009/swagger)
* RabbitMQ UI: [http://localhost:6003](http://localhost:6003/)
* Seq Logs: [http://localhost:6008](http://localhost:6008/)

## 🧠 Notes for Reviewers

* All configuration follows **12-Factor App** principles
* Services are independently deployable
* No service communicates directly with another except via RabbitMQ or Gateway
* Environment parity is maintained between local & containerized runs

✅ This guide is intended for **advanced reviewers, DevOps engineers, or developers** who want full transparency into the system architecture and runtime behavior.

