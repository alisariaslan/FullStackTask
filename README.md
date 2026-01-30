# Full-Stack-Task

Bu repo, mikroservis tabanlı bir backend ve modern bir frontend’den oluşan full-stack task projesinin ana reposudur.

## 🧩 Görev Uyumluluğu

### Aşama 1 – Monolitik Product API

* Product CRUD işlemleri (POST/GET)
* EF Core + PostgreSQL
* Swagger dokümantasyonu
* Asenkron işlemler

### Aşama 2 – Auth, CQRS & Redis

* JWT kullanan Auth Service
* CQRS (MediatR) kullanan Product Service
* Redis cache + cache invalidation
* Global exception handling ve logging

### Aşama 3 – Mikroservisler & Event-Driven Mimari

* Auth, Product ve Log mikroservisleri
* RabbitMQ tabanlı event iletişimi
* YARP API Gateway
* Tamamen Dockerize edilmiş sistem

## 🧠 Micro-Frontend Kapsam Kararı

Görev tanımında micro-frontend mimarisi (Home & Cart) geçmesine rağmen,
bu proje; backend mikroservisleri ve **tekil (unified) bir frontend** uygulaması üzerine odaklanmıştır.

Bu tercih bilinçli bir şekilde alınmıştır.

Frontend mimarisi modüler bir şekilde kurgulanmıştır ve **büyük bir refactor gerektirmeden**
ileride micro-frontend yapısına (Multi-Zone veya Module Federation) evrilebilir.

## 🔗 Proje Bileşenleri

Detaylı teknik dokümantasyon, mimari kararlar ve kurulum rehberleri için ilgili proje dizinlerini inceleyebilirsiniz:

* **[Tasarım Kararları](./DESIGN.md)**
* **[Backend Dökümantasyon](./FullStackTask.Microservices/README.md)**
* **[Frontend Dökümantasyon](./product-client/README.md)**

## ⚡ Hızlı Kurulum

**Bash**

```bash
# Repoyu klonla
git clone https://github.com/alisariaslan/FullStackTask.git

# Tüm sistemi ayağa kaldır
docker-compose up --build -d
```

## 📊 Dashboard’lar & Arayüz Endpoint’leri

Ortam Docker ile ayağa kaldırıldıktan sonra, sistem bileşenlerine aşağıdaki bağlantılar üzerinden erişebilirsiniz:

### 🌐 Kullanıcı Arayüzleri

* **Ana Web Uygulaması:** [http://localhost:6005](http://localhost:6005/)

### 🛠️ Geliştirme & İzleme

| Servis                   | Bağlantı                                   | Kimlik Bilgileri        |
| -------------------------- | ---------------------------------------------- | ------------------------- |
| 📊 Structured Logs (Seq) | [http://localhost:6008](http://localhost:6008/) | `admin`/`admin` |
| 🐇 RabbitMQ Management   | [http://localhost:6003](http://localhost:6003/) | `admin`/`admin` |

### 📜 API Dokümantasyonu (Swagger)

* **Auth Service:** [http://localhost:6006/swagger](http://localhost:6006/swagger)
* **Product Service:** [http://localhost:6007/swagger](http://localhost:6007/swagger)
* **Log Service:** [http://localhost:6009/swagger](http://localhost:6009/swagger)

## 📘 Detaylı Kurulum Rehberi

Altyapı, environment değişkenleri, network yapısı ve servisler arası iletişimi
derinlemesine incelemek isteyenler için:

➡️ [Ortam Dökümantasyon](./SETUP.md)

