# 🛠️ Detaylı Kurulum & Dağıtım Rehberi

Bu doküman, yalnızca hızlı bir `docker-compose up` akışının ötesine geçerek sistemi **tam anlamıyla kavramak, özelleştirmek veya debug etmek** isteyen geliştiriciler için hazırlanmış **adım adım ve detaylı bir kurulum rehberi** sunar.

Doküman; bu repoda kullanılan **gerçek Docker Compose yapılandırmaları, environment değişkenleri, gateway konfigürasyonu ve frontend API stratejisi** baz alınarak yazılmıştır.

## 📦 Sistem Genel Bakışı

Sistem, tamamı Docker container’ları içinde çalışan aşağıdaki bileşenlerden oluşur:

### Backend Altyapısı

* **PostgreSQL** – Ana veritabanı (AuthDb & ProductDb)
* **Redis** – Dağıtık cache sistemi (Product sorguları için)
* **RabbitMQ** – Asenkron iletişim için event bus
* **Seq** – Merkezi, yapılandırılmış loglama sistemi

### Backend Servisleri (.NET)

* **Auth API** – Kimlik doğrulama & JWT üretimi
* **Product API** – Ürün domain’i (CQRS + Cache)
* **Log API** – Merkezi log tüketici servisi
* **YARP Gateway** – API Gateway & Rate Limiting

### Frontend

* **Next.js 14 Web Uygulaması** – SSR / ISR destekli UI

Tüm servisler, `micro-net` isimli özel bir Docker bridge network üzerinden haberleşir.

## 🔌 Network & Port Eşlemeleri

| Servis             | Dahili Port | Harici Port |
| -------------------- | ------------- | ------------- |
| PostgreSQL         | 5432        | 6000        |
| Redis              | 6379        | 6001        |
| RabbitMQ (AMQP)    | 5672        | 6002        |
| RabbitMQ UI        | 15672       | 6003        |
| API Gateway (YARP) | 8080        | 6004        |
| Frontend (Next.js) | 3000        | 6005        |
| Auth API           | 8080        | 6006        |
| Product API        | 8080        | 6007        |
| Seq                | 80          | 6008        |
| Log API            | 8080        | 6009        |

## 🐘 PostgreSQL Kurulumu

### Container

* Image: `postgres:17-alpine`
* Container adı: `micro_postgres`

### Kimlik Bilgileri

```text
Kullanıcı Adı: postgres
Şifre: a5134ba8
```

### Veritabanları

* `AuthDb` → Auth Service
* `ProductDb` → Product Service

### Kalıcılık (Persistence)

```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data
```

Bu yapılandırma, container yeniden başlatılsa bile verilerin korunmasını sağlar.

### Health Check

PostgreSQL, aşağıdaki komut ile **healthy** olarak işaretlenir:

```bash
pg_isready -U postgres
```

Diğer servisler, **veritabanı hazır olana kadar** başlatılmaz.

## ⚡ Redis Cache

* **Sadece Product Service** tarafından kullanılır
* Okuma ağırlıklı sorguları hızlandırır (ürün listesi & kategoriler)

```text
Host: redis-cache
Port: 6379
```

Redis sağlık durumu şu komutla kontrol edilir:

```bash
redis-cli ping
```

## 🐇 RabbitMQ Event Bus

RabbitMQ, servisler arası **event-driven (olay tabanlı)** iletişimi sağlar.

### Portlar

* AMQP: `6002`
* Yönetim UI: `6003`

### Varsayılan UI Kimlik Bilgileri

```text
Kullanıcı Adı: admin
Şifre: admin
```

### Kullanım Senaryosu

* Product Service domain event’leri üretir
* Log Service, log event’lerini asenkron olarak tüketir

## 📊 Merkezi Loglama (Seq)

Seq, tüm .NET servislerinden gelen **yapılandırılmış logları** Serilog aracılığıyla toplar.

### Erişim

```text
http://localhost:6008
```

### Varsayılan Kullanıcı (admin) Şifresi

```text
admin
```

Tüm servisler logları şu adres üzerinden gönderir:

```text
http://micro_seq:80
```

## 🔐 Auth API

### Sorumluluklar

* Kullanıcı kayıt
* Kullanıcı giriş
* JWT üretimi

### Environment Değişkenleri

```env
ConnectionStrings__PostgreConnection=Host=postgres-db;Database=AuthDb
JwtSettings__Key=...
JwtSettings__Issuer=MicroserviceApp
JwtSettings__Audience=MicroserviceApp
```

### Başlangıç Davranışı

* EF Core migration’larını otomatik uygular
* `/health` endpoint’ini açar

## 📦 Product API

### Sorumluluklar

* Ürün CRUD işlemleri (CQRS)
* Redis cache yönetimi
* RabbitMQ event yayınlama

### Görsel Depolama

Ürün görselleri aşağıdaki volume ile kalıcı hale getirilir:

```yaml
volumes:
  - ./images:/app/wwwroot/images
```

### Cache Stratejisi

* Sorgular Redis’te cache’lenir
* Create / Update / Delete işlemlerinde cache temizlenir

## 📝 Log API

### Sorumluluklar

* RabbitMQ’dan event tüketir
* Logları Seq’e gönderir
* Loglamayı request lifecycle’ından ayırır

Bu sayede kullanıcıya bakan API’lerde ​**performans kaybı yaşanmaz**​.

## 🌐 API Gateway (YARP)

Gateway, frontend’ten gelen tüm istekler için **tek giriş noktası** olarak çalışır.

### Routing

| Public Path             | Hedef Servis |
| ------------------------- | -------------- |
| `/api/auth/*`       | Auth API     |
| `/api/products/*`   | Product API  |
| `/api/categories/*` | Product API  |
| `/api/logs/*`       | Log API      |

### Özellikler

* Fixed Window Rate Limiting
* Merkezi CORS yönetimi
* Health check toplama

## 🖥️ Frontend (Next.js)

### Çalışma Modu

Frontend, çalıştığı ortama göre otomatik olarak API adresini değiştirir:

```ts
if (typeof window !== 'undefined') {
  NEXT_PUBLIC_API_URL
} else {
  API_URL
}
```

### Environment Değişkenleri

```env
NEXT_PUBLIC_API_URL=http://localhost:6004
API_URL=http://micro_product_api:8080/api
```

### Kimlik Doğrulama Akışı

* JWT `localStorage` içinde tutulur
* Token otomatik olarak API isteklerine eklenir
* 401 yanıtlarında logout + redirect tetiklenir

## ▶️ Sistemi Çalıştırma

### İlk Kurulum

```bash
docker-compose up --build -d
```

### Sağlık Kontrolü

```bash
docker ps
```

Tüm servislerin **healthy** durumda olması gerekir.

## 🧪 Faydalı URL’ler

* Frontend: [http://localhost:6005](http://localhost:6005/)
* Gateway: [http://localhost:6004](http://localhost:6004/)
* Auth Swagger: [http://localhost:6006/swagger](http://localhost:6006/swagger)
* Product Swagger: [http://localhost:6007/swagger](http://localhost:6007/swagger)
* Log Swagger: [http://localhost:6009/swagger](http://localhost:6009/swagger)
* RabbitMQ UI: [http://localhost:6003](http://localhost:6003/)
* Seq Logs: [http://localhost:6008](http://localhost:6008/)

## 🧠 İnceleyenler İçin Notlar

* Tüm konfigürasyonlar **12-Factor App** prensiplerine uygundur
* Servisler bağımsız olarak deploy edilebilir
* Servisler birbiriyle **doğrudan** değil, yalnızca RabbitMQ veya Gateway üzerinden haberleşir
* Local ve container ortamları arasında environment parity korunur

Bu rehber; **detaylı mimariyi ve runtime davranışını tam şeffaflıkla görmek isteyen ileri seviye reviewer’lar, DevOps mühendisleri ve geliştiriciler** için hazırlanmıştır.

