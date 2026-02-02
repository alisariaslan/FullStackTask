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
* YARP API Gateway (Reverse Proxy)
* Tamamen Dockerize edilmiş sistem

## 🧠 Micro-Frontend Kapsam Kararı

Görev tanımında micro-frontend mimarisi (Home & Cart) geçmesine rağmen; bu proje, backend mikroservisleri ve **tekil (unified) bir frontend** uygulaması üzerine odaklanmıştır.

Bu tercih bilinçli bir şekilde alınmıştır. Frontend mimarisi modüler bir şekilde kurgulanmıştır ve büyük bir refactor gerektirmeden ileride micro-frontend yapısına (Module Federation vb.) evrilebilir.

## 🔗 Proje Bileşenleri

Detaylı teknik dokümantasyon, mimari kararlar ve kurulum rehberleri için ilgili dizinleri inceleyebilirsiniz:

* 📄 **[Tasarım Kararları](./docs/DESIGN.md)**
* ⚙️ **[Backend Dökümantasyon](./FullStackTask.Microservices/README.md)**
* 💻 **[Frontend Dökümantasyon](./product-client/README.md)**
* 🛠️ **[Ortam (Environment) Rehberi](./docs/SETUP.md)**

## ⚡ Hızlı Kurulum

```bash
# Repoyu klonla
git clone https://github.com/alisariaslan/FullStackTask.git

# Tüm sistemi Docker üzerinde ayağa kaldır
docker-compose up --build -d
```

# 📖 Kurulum ve Test Rehberi

Projenin başarılı bir şekilde ayağa kaldırılması ve tüm servislerin (Auth, CRUD, Event-Bus) test edilmesi için adım adım yönergeler:

➡️ **[KURULUM VE TEST ADIMLARI](./docs/INSTRUCTIONS.md)**

## 🌿 Branch Stratejisi

Bu projede **GitHub Flow** tabanlı, çevre odaklı (Environment-based) bir branch stratejisi uygulanmaktadır.

### 📍 Branch Yapısı

| **Branch** | **Ortam**            | **Açıklama**                                                                                   |
| ------------------ | ---------------------------- | -------------------------------------------------------------------------------------------------------- |
| `main`       | **Production**            | Yayındaki kararlı sürümdür. Sadece`dev`branch'inden merge alır.                              |
| `dev`        | **Development / Staging** | Geliştirme sürecinin toplandığı ana branch'tir. Docker-compose staging testleri burada yapılır. |
| `feature/*`  | **Local / Feature**       | Yeni özellikler, hata düzeltmeleri veya geliştirmeler için açılan geçici dallardır.            |

### 🚀 İş Akışı (Workflow)

1. **Feature Başlatma:** Her yeni görev için `dev` branch'inden yeni bir dal oluşturun.
   **Bash**
   
   ```
   git checkout dev
   git pull origin dev
   git checkout -b feature/auth-implementation
   ```
2. **Geliştirme ve Commit:** Değişikliklerinizi yapın ve anlamlı commit mesajları yazın.
3. **Local Test:** Docker üzerinde feature branch'inizi test edin.
4. **Pull Request (PR):** Geliştirme bittiğinde `feature/*` -> `dev` yönüne bir PR açın.
5. **Merge & Deploy (Dev):** Kod onaylandığında `dev` branch'ine merge edilir ve geliştirme ortamına deploy edilir.
6. **Release (Prod):**`dev` branch'i stabil hale geldiğinde `main` branch'ine PR açılarak üretim (production) sürümü yayınlanır.

### 📝 Commit Mesaj Standartları

Projenin takibi için **Conventional Commits** yapısını kullanmanız önerilir:

* `feat(api):` Yeni bir özellik eklendiğinde.
* `fix(client):` Bir hata düzeltildiğinde.
* `docs:` Dokümantasyon değişikliklerinde.
* `chore:` Paket güncellemesi, build ayarları vb. teknik işlerde.

