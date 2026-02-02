# Production & Design Kararları

Bu doküman, mevcut mikroservis mimarisinin **bilinçli olarak** nasıl kurgulandığını ve hangi noktaların **production-ready** kabul edildiğini / edilmediğini açıkça belirtmek için hazırlanmıştır.

## Genel Durum Özeti

Bu proje ​**tam anlamıyla production-ready değildir**​, ancak:

* Bilinçli mimari kararlar alınmıştır
* Production ortamına geçiş için gerekli altyapının **%80–85'i hazırdır**
* Kalan maddeler bilerek **Development / Task Scope** dışında bırakılmıştır

Bu yaklaşım, task kapsamını aşmadan doğru mühendislik reflekslerini göstermek amacıyla seçilmiştir.

## 1- Mimari Yaklaşım

* **Microservices Architecture** uygulanmıştır
* Her servis:
  * Kendi `Program.cs`
  * Kendi veritabanı / cache / message dependency’si
  * Kendi container’ı
* Servisler arası iletişim:
  * HTTP (YARP Gateway)
  * Async Eventing (RabbitMQ + MassTransit)

Servisler:

* Auth Service
* Product Service
* Log Service
* API Gateway (YARP)
* Frontend (Next.js)

## 2- API Gateway (YARP)

Gateway katmanı bilinçli olarak **merkezi kontrol noktası** olacak şekilde tasarlanmıştır.

Mevcut özellikler:

* Reverse Proxy (YARP)
* Centralized CORS Policy
* Rate Limiting (Fixed Window)
* Health Check Endpoint (`/health`)
* Serilog + Seq entegrasyonu

### Bilinçli Olarak Basit Tutulanlar

* Global auth / authorization policy gateway seviyesinde zorunlu kılınmadı
* Route-level rate limit / auth ayrımı yapılmadı

> Bu karar, gateway konfigürasyonunun task kapsamında karmaşıklaşmasını önlemek için bilinçlidir.

## 3- Authentication & Security

* JWT Bearer Authentication tüm servislerde aktiftir
* Token doğrulama:
  * Issuer
  * Audience
  * Signing Key
  * Zero Clock Skew

### Bilinçli Eksikler

* Secret rotation
* External Identity Provider (Keycloak, Auth0 vs.)
* Refresh Token persistence

## 4- Observability & Logging

* **Serilog** tüm servislerde standarttır
* **Seq** merkezi log toplama için kullanılır
* HTTP request logging aktiftir

Bu yapı production için uygundur ancak:

* Log enrichment (UserId, CorrelationId) sınırlıdır
* Distributed tracing (OpenTelemetry) eklenmemiştir

## 5- Health Checks & Container Readiness

* Tüm servislerde `/health` endpoint’i vardır
* Docker Compose:
  * `depends_on` + `service_healthy` koşulları
  * PostgreSQL / Redis / RabbitMQ için healthcheck tanımlıdır

Bu sayede:

* Servisler bağımlılıkları hazır olmadan ayağa kalkmaz
* Local ve CI ortamında deterministic startup sağlanır

## 6- Database & Migration Stratejisi

* Entity Framework Core + PostgreSQL
* Migration’lar **runtime sırasında** otomatik uygulanır

```csharp
db.Database.Migrate();
```

### Not

* Bu yaklaşım production’da genellikle **CI/CD pipeline** aşamasına taşınır
* Development kapsamında migration otomasyonu bilinçli olarak kod içinde bırakılmıştır

## 7- Messaging (Async Communication)

* RabbitMQ + MassTransit kullanılmıştır
* Retry policy tanımlıdır
* Log Service event-driven şekilde çalışır

Bu sayede:

* Loose coupling
* Eventual consistency
* Scalability altyapısı hazırdır

## 8- Frontend Entegrasyonu

* Frontend Gateway üzerinden haberleşir
* Environment-based API URL kullanır
* Dockerize edilmiştir

### Micro-Frontend?

Hayır.

Frontend ​**tekil bir Next.js uygulamasıdır**​.
Micro-frontend mimarisi:

* Bilinçli olarak tercih edilmemiştir

## 9- Production-Ready OLMAYAN Bilinçli Noktalar

* HTTPS termination (reverse proxy / ingress yok)
* Secrets management (Vault, AWS Secrets Manager)
* CI/CD pipeline
* Canary / Blue-Green deployment
* Horizontal auto-scaling
* Centralized config server

Bu eksikler **scope yönetiminden** kaynaklıdır.

## 10- Sonuç

Bu proje:

* Gerçek bir production sisteminin **doğru iskeletini** sunar
* Best practice’lere yakındır
* Genişlemeye ve sertleşmeye (hardening) uygundur

**Bu README, bilinçli mimari kararları açıklamak amacıyla hazırlanmıştır.**

