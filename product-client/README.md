# Frontend Proje Mimarisi

## Genel Bakış

Bu proje, **Next.js 14+ (App Router)** ile geliştirilmiş modern ve yüksek performanslı bir web uygulamasıdır.
SEO uyumlu, çok dilli (multi-language) olacak şekilde tasarlanmış ve bir **API Gateway** üzerinden mikroservis tabanlı backend ile tamamen entegredir.

## 🧠 Micro-Frontend Kapsam Kararı

Görev tanımında micro-frontend mimarisi (Home & Cart) geçmesine rağmen,
bu proje; backend mikroservisleri ve **tekil (unified) bir frontend** uygulaması üzerine odaklanmıştır.

Bu tercih bilinçli bir şekilde alınmıştır.

Frontend mimarisi modüler bir şekilde kurgulanmıştır ve **büyük bir refactor gerektirmeden**
ileride micro-frontend yapısına (Multi-Zone veya Module Federation) evrilebilir.

## Teknoloji Yığını

* **Framework:** Next.js 14+ (App Router)
* **Dil:** TypeScript
* **State Management:** Redux Toolkit (RTK)
* **Internationalization:** next-intl
* **Stil:** Tailwind CSS
* **Data Fetching:** Özel servis wrapper’ları ile Fetch API

## Mimari Yapı

Proje; ölçeklenebilirlik ve sürdürülebilirlik için modüler ve component tabanlı bir yapı izler:

* **`src/app`**
  Dosya sistemi tabanlı routing, layout’lar ve server/client component’ler
* **`src/components`**
  Atomic UI component’leri (Shared ve Feature-specific)
* **`src/lib`**
  Redux store slice’ları, provider’lar ve global yardımcı fonksiyonlar
* **`src/services`**
  YARP Gateway üzerinden backend servislerine istek atan API katmanı
* **`src/i18n`**
  Internationalization için middleware ve konfigürasyonlar
* **`src/messages`**
  JSON tabanlı çeviri sözlükleri (örn: TR, EN)
* **`src/middleware.ts`**
  Dil algılama (locale detection) ve auth redirect işlemleri

## Temel Tasarım Kararları

* **Server-Side Rendering (SSR) & ISR:**
  Ürün listeleme ve detay sayfalarında maksimum SEO performansı ve dinamik meta tag’ler için kullanılır
* **Micro-Frontend’e Hazır Mimari:**
  Home, Cart gibi bağımsız modülleri ortak Redux state ile yönetebilecek şekilde tasarlanmıştır
* **Global State Management:**
  Redux Toolkit; alışveriş sepeti, kullanıcı oturumu ve çok adımlı UI state’lerini yönetir
* **Internationalization (i18n):**
  `next-intl` ile çok dilli routing ve içerik değiştirme desteği
* **Responsive UI:**
  Tailwind CSS ile mobile-first ve responsive tasarım
* **Performans:**
  `next/image` kullanılarak lazy-loading ve WebP destekli optimize edilmiş görseller

## Ortam (Environment) Konfigürasyonu

Konfigürasyonlar, **12-Factor App** metodolojisine uygun olarak `.env` dosyaları üzerinden yönetilir:

* `NEXT_PUBLIC_GATEWAY_URL`
  → **YARP Gateway** adresini gösterir (`http://localhost:6004`)
* `GATEWAY_URL`
  → SSR sırasında kullanılan server-side internal API adresi

## Kurulum & Deployment

* **[Full-Stack-Task](../README.md)**
  Ana README dosyasını ziyaret edin.

