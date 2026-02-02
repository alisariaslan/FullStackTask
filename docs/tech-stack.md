# Project Tech Stack & Versions

Bu doküman, projenin geliştirildiği "bleeding-edge" (en güncel) teknoloji yığınını ve geliştirme ortamı detaylarını içerir.

## 1. Operating System & Infrastructure (Altyapı)
Windows Insider ve WSL altyapısı üzerinde çalışılmaktadır.

| Bileşen | Sürüm / Build | Kaynak |
| :--- | :--- | :--- |
| **Host OS** | Windows 11 (Build 26200.7628) | `wsl --status` |
| **WSL** | 2.6.3.0 | `wsl --version` |
| **Linux Kernel** | 6.6.87.2-1 | `wsl --version` |
| **Docker Desktop** | 4.58.0 (Build 216728) | Docker Dashboard |
| **Docker Target OS** | Windows (Project default) | `.csproj` |

## 2. Backend Stack (.NET Ecosystem)
Mikroservisler **.NET 10** (Preview/RC) ekosistemi üzerine kuruludur.

### Core Framework
| Teknoloji | Versiyon | Kullanım Alanı |
| :--- | :--- | :--- |
| **Target Framework** | `net10.0` | Tüm Servisler |
| **Language** | C# 13/14 (Implied) | Backend |

### Critical NuGet Packages
Aşağıdaki paketler `Services.Auth`, `Services.Product` ve `Gateway` projelerinde ortaktır.

| Paket | Versiyon | Kategori |
| :--- | :--- | :--- |
| **Microsoft.AspNetCore.OpenApi** | `10.0.2` | Documentation |
| **Microsoft.EntityFrameworkCore.Design** | `10.0.2` | Database / ORM |
| **Microsoft.AspNetCore.Authentication.JwtBearer** | `10.0.2` | Security |
| **Yarp.ReverseProxy** | `2.3.0` | API Gateway |
| **MassTransit.RabbitMQ** | `8.2.5` | Event Bus |
| **Swashbuckle.AspNetCore** | `10.1.0` | Swagger UI |

### Logging & Observability (Serilog)
| Paket | Versiyon |
| :--- | :--- |
| **Serilog.AspNetCore** | `10.0.0` |
| **Serilog.Sinks.Seq** | `9.0.0` |
| **Serilog.Sinks.File** | `7.0.0` |

## 3. Frontend Stack (Next.js Ecosystem)
Frontend, React 19 ve Next.js 16 mimarisi ile Tailwind 4 üzerine inşa edilmiştir.

### Core Runtime
| Kütüphane | Versiyon | Notlar |
| :--- | :--- | :--- |
| **Next.js** | `^16.1.6` | App Router |
| **React** | `19.2.3` | RC/Stable |
| **React DOM** | `19.2.3` | - |
| **TypeScript** | `^5` | - |

### State & Logic
| Kütüphane | Versiyon |
| :--- | :--- |
| **Redux Toolkit** | `^2.11.2` | Global State |
| **React Redux** | `^9.2.0` | State Binding |
| **next-intl** | `^4.7.0` | Localization |
| **jwt-decode** | `^4.0.0` | Auth Utils |

### UI & Styling
| Kütüphane | Versiyon |
| :--- | :--- |
| **Tailwind CSS** | `^4.1.18` | Styling Engine |
| **@tailwindcss/postcss** | `^4.1.18` | Processor |
| **Sonner** | `^2.0.7` | Toast Notifications |
| **React Icons** | `^5.5.0` | Icon Set |

## 4. Development Tools
Geliştirme sürecinde kullanılan yardımcı araçlar.

- **Container Tools:** Microsoft.VisualStudio.Azure.Containers.Tools.Targets (`1.23.0`)
- **Linter:** ESLint (`^9`) + eslint-config-next (`16.1.4`)