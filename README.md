# Full-Stack Project Task

This is the main repository for the fullstack task project, consisting of a microservices-based backend and a modern frontend.

## 🔗 Project Components

For detailed technical documentation, architectural decisions, and setup guides, please visit the respective project directories:

* ​[Backend Microservices](./FullStackTask.Microservices/README.md): .NET 10, Onion Architecture, CQRS, RabbitMQ, and YARP Gateway.
  ​
* ​[Frontend Web UI](./product-client/README.md): Next.js 14+, TypeScript, Redux Toolkit, and Internationalization.

## 📊 Dashboards & Service Endpoints

Once the environment is running via Docker, use the links below to access the system components:

### 🌐 User Interfaces

* **Main Web Application:**[http://localhost:6005](https://www.google.com/search?q=http://localhost:6005)
* **API Gateway (YARP):**[http://localhost:6004](https://www.google.com/search?q=http://localhost:6004)

### 🛠️ Development & Monitoring

| **Service**             | **Link**                                                              | **Credentials**   |
| ------------------------------- | ----------------------------------------------------------------------------- | ------------------------- |
| **📊 Structured Logs (Seq)** | [http://localhost:6008](https://www.google.com/search?q=http://localhost:6008) | `admin`/`admin` |
| **🐇 RabbitMQ Management**   | [http://localhost:6003](https://www.google.com/search?q=http://localhost:6003) | `admin`/`admin` |

### 📜 API Documentation (Swagger)

* **Auth Service:**[http://localhost:6006/swagger](https://www.google.com/search?q=http://localhost:6006/swagger)
* **Product Service:**[http://localhost:6007/swagger](https://www.google.com/search?q=http://localhost:6007/swagger)
* **Log Service:**[http://localhost:6009/swagger](https://www.google.com/search?q=http://localhost:6009/swagger)

## ⚡ Quick Deployment

**Bash**

```
# Clone the repository
git clone https://github.com/your-repo/RoadToKayseri.git

# Run all services
docker-compose up --build -d
```

