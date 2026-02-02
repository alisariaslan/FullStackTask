# Backend Proje Mimarisi

## Genel Bakış

Bu proje, **12-Factor App** prensiplerini temel alan, yüksek performanslı ve **event-driven** bir mikroservis mimarisi uygular.
Ölçeklenebilirlik, Onion Architecture ile **sorumlulukların ayrılması** ve servisler arası **asenkron iletişim** ana odak noktalarıdır.

Ana bileşenler:

* **Auth Service:** Kimlik yönetimi ve JWT / Refresh Token üretimi
* **Log Service:** Merkezi log tüketimi ve işleme
* **Product Service:** CQRS ve Cache içeren ana iş alanı
* **API Gateway (YARP):** Trafik yönetimi sağlayan tekil giriş noktası

## Teknoloji Yığını

* **Dil / Framework:** C# (.NET 10.0)
* **İletişim:** REST (Dış), RabbitMQ / MassTransit (İç – Event-Driven)
* **API Gateway:** YARP (Yet Another Reverse Proxy)
* **Containerization:** Docker & Docker Compose
* **Orkestrasyon Araçları:** Seq (Log Görselleştirme), Redis (Caching)

## Onion Architecture Yapılandırması

Her mikroservis, domain logic’in dış bağımlılıklardan tamamen izole kalmasını sağlamak için **katı Onion Architecture** prensiplerine göre yapılandırılmıştır:

**Services.(Name).API**
*(Controllers, Program.cs, Middleware, Dependency Injection)*
↓

**Services.(Name).Infrastructure**
*(DbContext, Repository implementasyonları, dış servis client’ları)*
↓

**Services.(Name).Application**
*(MediatR Handler’ları, CQRS Command / Query’ler, Mapper’lar, Interface’ler)*
↓

**Services.(Name).Domain**
*(Entity’ler, Value Object’ler, Domain Exception’ları)*
↓

**Shared.Kernel**
*(Tüm katmanlarda kullanılan cross-cutting concern’ler)*

## Altyapı & Dayanıklılık (Resilience)

* **Veritabanı:** PostgreSQL
  * Database-per-service pattern uygulanmıştır
  * `AuthDb` ve `ProductDb` tamamen izoledir
* **Cache:**
  * Product Service içerisinde **Redis** kullanılmıştır
  * Yüksek hızlı sorgu performansı hedeflenmiştir
* **Message Queue:**
  * **RabbitMQ + MassTransit** ile asenkron iletişim sağlanır
* **Resilience:**
  * Event işleme için **Message Retry** politikaları tanımlıdır
  * (5 retry, 10 saniye aralıklarla)
* **Logging:**
  * **Serilog** ile structured logging
  * **Seq** ile merkezi log toplama

## Servis Detayları

### API Gateway (YARP)

* **Routing:**
  * Docker service discovery kullanarak trafiği ilgili servislere yönlendirir
* **Traffic Control:**
  * Abuse’u önlemek için **Fixed Window Rate Limiting**
  * (100 request / dakika)
* **CORS:**
  * Frontend entegrasyonu için global CORS policy
* **Health Monitoring:**
  * Downstream servisler için merkezi `/health` kontrolleri

### Auth Service

* **Identity:**
  * Register, login ve JWT token üretimi
* **Security:**
  * Role ve Policy-based authorization altyapısı hazır
* **Persistence:**
  * Entity Framework Core + Npgsql
* **Auto-Migration:**
  * Ortam tutarlılığı için uygulama ayağa kalkarken migration’lar otomatik uygulanır

### Product Service

* **Optimizasyon:**
  * MediatR üzerinden **CQRS Pattern** uygulanmıştır
  * Read ve Write operasyonları ayrılmıştır
* **Performans:**
  * Ürün listeleri ve kategoriler için **Redis Cache**
* **Storage:**
  * Ürün görselleri için `ImageService` entegrasyonu
* **Events:**
  * Ürün verisi değiştiğinde RabbitMQ üzerinden event fırlatılır

### Log Service

* **Event Consumer:**
  * `LogCreatedConsumer` ile log event’leri asenkron işlenir
* **Merkezileştirme:**
  * Log’lar structured storage’a (Seq / File) aktarılır
* **Decoupling:**
  * Diğer servisler “fire-and-forget” log atabilir
  * Kullanıcı response süreleri etkilenmez

## Temel Tasarım Kararları

* **Microservices Architecture:**
  * Her iş birimi bağımsız deploy ve scale edilebilir
* **API Gateway Pattern:**
  * Tek, güvenli giriş noktası sağlar
  * İç sistem karmaşıklığını gizler
* **Eventual Consistency:**
  * Log işleme ve servisler arası bildirimler RabbitMQ event’leriyle yürütülür
* **Shared Kernel Stratejisi:**
  * `LocalizationBehavior`, `ExceptionMiddleware`, DTO’lar gibi ortak yapılar
  * Tek bir shared projede toplanarak **DRY** prensibi korunur
* **Environment Yönetimi:**
  * Konfigürasyonlar environment variable’lar ve `.env` dosyaları üzerinden yönetilir
  * Docker deploy süreçleri sorunsuz hâle getirilmiştir

## Shared Kernel Detayları

* **Behaviors:**
  * `LocalizationBehavior<,>`
  * MediatR pipeline’ında otomatik çoklu dil desteği
* **Middlewares:**
  * `ExceptionMiddleware`
  * Global, tutarlı ve structured hata yönetimi
* **Paketler:**
  * `MassTransit.Abstractions` – Messaging
  * `MediatR` – Internal dispatching
  * `Serilog.AspNetCore` & `Serilog.Sinks.Seq` – Logging
  * `Swashbuckle.AspNetCore` – JWT destekli OpenAPI / Swagger

## Kurulum & Deployment

* **[Full-Stack-Task](../README.md)**
  Ana README dosyasını ziyaret edin.

