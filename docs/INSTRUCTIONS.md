# 📖 Kurulum ve Test Rehberi (INSTRUCTIONS)

Bu rehber, projenin başarılı bir şekilde ayağa kaldırılması ve tüm özelliklerin (Auth, CRUD, Event-Bus) test edilmesi için gereken adımları içerir.

## 1️⃣ Ön Gereksinimler

* **Docker Desktop** kurulu ve çalışıyor olmalı.
* **PostgreSQL** bağlantısı için **DBeaver, pgAdmin** veya benzeri bir araç.
* **İnternet Tarayıcısı** (Chrome, Edge, Firefox vb.).
* **Postman** (Opsiyonel ama hızlı test için tavsiye edilir).
* **Redis Insight** (Cache testleri)

## 2️⃣ Projeyi Çekme ve Docker ile Başlatma

**Bash**

```
# Repo klonlama
git clone https://github.com/alisariaslan/FullStackTask.git
cd FullStackTask

# Docker ile tüm servisleri ayağa kaldır
docker-compose up --build -d
```

* **Servislerin durumunu kontrol et:**

**Bash**

```
docker ps
# veya
docker-compose ps
```

* **Servislerin "Healthy" olup olmadığını detaylı görmek için:**

**Bash**

```
docker inspect --format='{{json .State.Health}}' <container_name>
```

## Postman (Opsiyonel)

* POSTMAN ile test yapmak isteyenler için proje ana dizininde
  
  - Full-Stack-Task-Collection.postman_collection.json
  - Full-Stack-Task-Env.postman_environment.json

dosyaları mevcuttur.

## 3️⃣ Auth Servis Testi (Swagger Kullanımı)

1. **Auth Swagger:**[http://localhost:6006/swagger](http://localhost:6006/swagger)
2. **Kayıt Ol (Register):** Endpoint’ini kullanarak yeni bir kullanıcı oluştur.
3. **Login:** Giriş yap ve dönen ​**JWT Token**​’ı kopyala.
4. Bu token’ı ​**Product Swagger**​’da Authorization header olarak ekle:
   * `Authorization: Bearer <token>`

## 4️⃣ Product Servis Testi

1. **Product Swagger:**[http://localhost:6007/swagger](http://localhost:6007/swagger)
2. **Token Uygulandıktan Sonra:**
   * **Kategori Oluştur** (POST `/categories`)
   * **Ürün Oluştur** (POST `/products`) – *Not: Bu işlem frontend üzerinden de yapılabilir.*
3. Ürün ekleme/düzenleme yetkisi yalnızca **admin** rolündeki kullanıcılar içindir.

## 5️⃣ Admin Yetkisi Verme (Veritabanı Üzerinden)

Kullanıcınıza admin yetkisi tanımlamak için aşağıdaki adımları izleyin:

* **AuthDb Bağlantısı:**`postgres://postgres:a5134ba8@localhost:6000/AuthDb`
* **SQL Sorgusu:**`Users` tablosunda ilgili kullanıcının `role` alanını `admin` olarak güncelleyin.

**SQL**

```
UPDATE Users
SET role = 'admin'
WHERE email = 'kullanici@example.com';
```

* Güncelleme sonrası frontend'e tekrar giriş yaptığınızda "Ürün Ekle" butonu aktif olacaktır.

## 6️⃣ Sistem İzleme ve Kontroller

| **Servis / Araç** | **URL**                                                                               | **Notlar**                        |
| -------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------- |
| **Frontend**            | [http://localhost:6005](http://localhost:6005)                 | Arayüz testi ve ürün işlemleri      |
| **Seq Logs**            | [http://localhost:6008](http://localhost:6008)                 | `admin/guest`ile merkezi log takibi |
| **RabbitMQ**            | [http://localhost:6003](http://localhost:6003)                 | `guest/guest`ile Event mesaj takibi |
| **PostgreSQL**          | `localhost:6000`                                                                        | Veritabanı yönetimi (DBeaver vb.)     |
| **Redis**               | `localhost:6001`                                                                        | Cache kontrolü                         |
| **Auth API Swagger**    | [http://localhost:6006/swagger](http://localhost:6006/swagger) | Token ve kullanıcı işlemleri         |
| **Product API Swagger** | [http://localhost:6007/swagger](http://localhost:6007/swagger) | CRUD işlemleri                         |

## 7️⃣ Event & Background Testleri

* **RabbitMQ:** Mesajların kuyruğa başarıyla iletildiğini kontrol edin.
* **Seq:** Hata veya bilgi loglarının akışını izleyin.
* **Redis:** Ürün listeleme işlemlerinde cache'in dolduğunu ve veri güncellendiğinde geçersiz kılındığını (invalidation) doğrulayın.

## 8️⃣ Ek İpuçları

* **Log Takibi:** Docker container loglarını terminalden izlemek için:

**Bash**

```
docker logs -f micro_auth_api
docker logs -f micro_product_api
```

