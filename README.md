# COSMELIA — FatherShops-Compatible Next.js Storefront

A production-ready luxury e-commerce storefront for **COSMELIA** (clinical 7-wavelength LED phototherapy, microcurrent sculpting instruments, and bio-ferment peptide skincare), built on **Next.js 16 (App Router)**, **TypeScript**, and modern luxury design system tokens.

## Architecture Highlights
- **Universal Commerce Abstraction (`src/lib/commerce/`)**: Completely isolates UI from backend commerce providers.
- **FatherShops Adapter (`src/lib/fathershops/`)**: Complies strictly with official integration standards without fake endpoints. Supports hosted checkout handoffs and data mapping.
- **Mock Mode Development**: Full catalog, cart, and patron order simulations for instantaneous local development.
- **Config-Driven Modular Homepage (`src/lib/config/sections.ts`)**: Modular sections mapped to reusable React components via `SectionRenderer`.
- **Ultra-Luxury DTC Aesthetics**: Champagne/rose tones, refined typography, subtle micro-interactions, responsive touch cart drawer, and mobile sticky purchase boxes.
- **Complete Route Suite**:
  - `/` (Dynamic Modular Homepage)
  - `/products` (Catalog with filters and sorting)
  - `/product/[slug]` (Interactive PDP with gallery, variants, and specs)
  - `/categories/[slug]` (Category collection pages)
  - `/cart` (Cart page with free shipping progress bar)
  - `/checkout` (FatherShops checkout handoff / adapter)
  - `/search` (Live client-side search with suggestions)
  - `/account/*` (Patron dashboard, login, register, order manifesto)
  - `/about`, `/contact`, `/faq`, `/privacy`, `/terms`, `/shipping`, `/returns`
  - `/sitemap.xml` & `/robots.txt`

---

## Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Local Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 4. Production Build
```bash
npm run build
npm run start
```
