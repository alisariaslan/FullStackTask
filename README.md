# Full-Stack Task

This is the main repository for the full-stack task project, consisting of a microservices-based backend and a modern frontend.

## 🧩 Task Compliance

### Phase 1 – Monolithic Product API

- Product CRUD implemented (POST/GET)
- EF Core + PostgreSQL
- Swagger documentation
- Async operations

### Phase 2 – Auth, CQRS & Redis

- Auth Service with JWT
- Product Service with CQRS (MediatR)
- Redis caching + invalidation
- Global exception handling & logging

### Phase 3 – Microservices & Event-Driven

- Auth, Product, Log microservices
- RabbitMQ-based event communication
- YARP API Gateway
- Dockerized full system

## 🧠 Micro-Frontend Scope Decision

Although the task mentions a micro-frontend architecture (Home & Cart),
this project focuses on backend microservices and a unified frontend
application to demonstrate core system design, API gateway integration,
SEO, and state management.

The frontend architecture is structured in a modular way and can be
evolved into a micro-frontend setup (Multi-Zone or Module Federation)
without major refactoring.

## 🔗 Project Components

For detailed technical documentation, architectural decisions, and setup guides, please visit the respective project directories:

* ​[Backend Microservices](./FullStackTask.Microservices/README.md): .NET 10, Onion Architecture, CQRS, RabbitMQ, and YARP Gateway.
  ​
* ​[Frontend Web UI](./product-client/README.md): Next.js 14+, TypeScript, Redux Toolkit, and Internationalization.

## 📊 Dashboards &  Interface Endpoints

Once the environment is running via Docker, use the links below to access the system components:

### 🌐 User Interfaces

* **Main Web Application:** [http://localhost:6005](https://www.google.com/search?q=http://localhost:6005)

### 🛠️ Development & Monitoring

| **Service**             | **Link**                                                              | **Credentials**   |
| ------------------------------- | ----------------------------------------------------------------------------- | ------------------------- |
| **📊 Structured Logs (Seq)** | [http://localhost:6008](https://www.google.com/search?q=http://localhost:6008) | `admin`/`admin` |
| **🐇 RabbitMQ Management**   | [http://localhost:6003](https://www.google.com/search?q=http://localhost:6003) | `admin`/`admin` |

### 📜 API Documentation (Swagger)

* **Auth Service:** [http://localhost:6006/swagger](https://www.google.com/search?q=http://localhost:6006/swagger)
* **Product Service:** [http://localhost:6007/swagger](https://www.google.com/search?q=http://localhost:6007/swagger)
* **Log Service:** [http://localhost:6009/swagger](https://www.google.com/search?q=http://localhost:6009/swagger)

## ⚡ Quick Deployment

**Bash**

```
# Clone the repository
git clone https://github.com/alisariaslan/FullStackTask.git

# Launch all
docker-compose up --build -d
```

## 📘 Detailed Setup Guide

For developers who want an in-depth explanation of the infrastructure,
environment variables, networking, and service communication:

➡️ See [Detailed Setup Guide](./DETAILED_SETUP_GUIDE.md)

