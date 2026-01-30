# Frontend Project Architecture

## Overview

This project is a modern, high-performance web application built with **Next.js 14+ (App Router)**. It is designed to be SEO-friendly, multi-lingual, and fully integrated with a microservices backend through an API Gateway.

## 🧠 Micro-Frontend Scope Decision

Although the task mentions a micro-frontend architecture (Home & Cart),
this project focuses on backend microservices and a unified frontend
application to demonstrate core system design, API gateway integration,
SEO, and state management.

The frontend architecture is structured in a modular way and can be
evolved into a micro-frontend setup (Multi-Zone or Module Federation)
without major refactoring.


## Technology Stack

* **Framework:** Next.js 14+ (App Router)
* **Language:** TypeScript
* **State Management:** Redux Toolkit (RTK)
* **Internationalization:** next-intl
* **Styling:** Tailwind CSS
* **Data Fetching:** Fetch API with custom service wrappers

## Architecture

The project follows a modular, component-based structure for scalability and maintainability:

* **`src/app`**: File-system routing, layouts, and server/client components.
* **`src/components`**: Atomic UI components (Shared and Feature-specific).
* **`src/lib`**: Redux store slices, providers, and global utilities.
* **`src/services`**: Logic for API interactions, handling requests to the YARP Gateway.
* **`src/i18n`**: Middleware and configuration for internationalization.
* **`src/messages`**: JSON-based translation dictionaries (e.g., TR, EN).
* **`src/middleware.ts`**: Handles locale detection and auth redirects.

## Key Design Decisions

* **Server-Side Rendering (SSR) & ISR:** Used for product listing and detail pages to ensure maximum SEO performance and dynamic meta tags.
* **Micro-Frontend Ready:** Architected to handle independent modules (Home, Cart) with shared state via Redux.
* **Global State Management:** Redux Toolkit manages the shopping cart, user session, and multi-step UI states.
* **Internationalization (i18n):** Full support for multi-language routing and content switching via `next-intl`.
* **Responsive UI:** Utility-first styling with Tailwind CSS for mobile-first compatibility.
* **Performance:** Optimized images using `next/image` with lazy-loading and WebP support.

## Environment Configuration

Configuration is managed via `.env` files to support the **12-Factor App** methodology:

* `NEXT_PUBLIC_API_URL`: Points to the **YARP Gateway** (`http://localhost:6004`).
* `API_URL`: Server-side internal API address for SSR.

## Installation & Deployment

* ​[Full-Stack Task](../README.md): Visit parent md.



