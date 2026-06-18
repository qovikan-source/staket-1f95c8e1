# Project Documentation — Stäket Företagscenter Portal

This file documents the full scope, architecture, design system, and key technical capabilities of the **Stäket Företagscenter Portal** (Föreningsportal) application.

---

## 1. Project Overview & Business Purpose

**Stäket Företagscenter** is a commercial real estate business park and enterprise hub located at **Skarprättarvägen 7, 176 77 Järfälla** in Stockholm, Sweden.

The application serves two core purposes:
1. **Public-Facing Commercial Site**: Presents vacant/available commercial units ("Lediga Lokaler"), provides an overview of established member businesses ("Våra Företag"), highlights area guides and facility specifications ("Om oss"), and handles tenant interest applications ("Intresseanmälan").
2. **Private Member & Administrator Portal**: Secure log-in platform for park tenants (Members) and managers (Administrators) to share document repositories ("Filarkiv"), post administrative bulletins and notices ("Anslagstavla"), view a communal list of tenant contacts ("Kontaktbok"), and run full-scale data management from an "Administratörspanel".

---

## 2. Target Technical Architecture

The application is built around a robust, modern frontend stack designed for responsive, fast, and secure user interactions.

- **Framework**: React (v18+) with TypeScript (`.tsx`, `.ts`).
- **Build & Development Tool**: Vite for fast bundling and Hot Module Replacement handling.
- **Styling**: Tailwind CSS for a refined, responsive layout utilizing custom themes (emerald-inspired colors like `#0B2C24` and gold accents `#B68F52`).
- **Icons**: Lucide React (`lucide-react`).
- **State & Data Persistence**:
  - Offline-first approach relying on `localStorage` for high performance and low lag.
  - Fail-safe JSON serialization/deserialization logic in `src/initialData.ts` to provide immediate fallback to preset starting datasets if local storage gets manipulated or cleared.
  - Key stores maintained in browser state:
    - `forening_profiles_db`: User accounts, companies, unit numbers, contact options, logos.
    - `forening_notices_db`: Active, categorized, and pinned announcement posts.
    - `forening_files_db`: Official PDF and documents with strict access category tags.
    - `forening_spaces_db`: Vacant spaces, sizes, heights, specifications.

---

## 3. Modular Core Views & Components

The codebase is highly modularized, separating each principal view tab into self-contained components under `src/components/`:

### A. Core Navigation (`src/App.tsx`)
- Coordinates the top-level routing, responsive mobile side-drawers, and current local state engines.
- Manages authorization states for three user tiers: **Besökare** (Visitor), **Medlem** (Member), and **Administrator** (Admin).

### B. Landing Page (`src/components/HomeView.tsx`)
- Includes responsive high-contrast headers, beautiful hero banners featuring on-site exterior photography, highlights of latest administrative board notices, trust/value-proposition bento blocks, and footer navigation links.

### C. Available Commercial Spaces (`src/components/AvailableSpacesView.tsx`)
- Displays currently unleased warehouse, storage, and office divisions with complete structural properties (e.g. 5m ceiling height, manual 4x4,5m vikportar, floor heating, oil-separation drains).
- Integrates a dynamic **Intresseanmälan (Interest Form)** that hooks directly into the collection of actively listed available spaces so visitors can apply for specific real-world units, switching gracefully to a general queue/standby selector if zero vacancies are registered.

### D. Our Member Companies (`src/components/OurCompaniesView.tsx`)
- Exhibits a stylized logo-card wall presenting active tenants.
- **Rules Integrated**: Removed overly detailed bio pages/nested tabs. It focuses exclusively on the core brand attributes: **Company Name**, **Unit/Suite Position**, and **Company Logo Image** uploaded by administrators, with a clean alphabetical text logo fallback if no custom graphic asset is uploaded.

### E. Interactive Board / Noticeboard (`src/components/NoticeboardView.tsx`)
- Bulletins divided into Categories (Allmänt, Ekonomi, Säkerhet, etc.) allowing customized attachments, pinning important updates to the top, and self-publishing controls.

### F. Document Hub / Archiving (`src/components/DocumentHubView.tsx`)
- Secure repository divided into folders (e.g. Årsmöten, Stadgar, Ritningar) allowing members to view size-tracked records and download authenticated documents.

### G. Member Address Book (`src/components/ContactBookView.tsx`)
- A searchable roster of park co-owners, enabling rapid corporate pairing, direct call actions, and instant copy buttons for email/phone communications.

### H. Backend Panel (`src/components/AdminView.tsx`)
- Dashboard specifically for Administrators to perform real-time CRUD operations.
- Direct forms to create and remove vacancies, append fresh membership profiles with custom logos, and dispatch global board notices.

---

## 4. Key Security & Compliance Rules
- Custom server-side API keys (e.g., Google or generic backends) are securely insulated inside backend architecture and cannot leak to client browsers.
- Strictly aligned to the physical realities of **Stäket Företagscenter**. No unconfirmed placeholders or inflated data ("30 unika enheter" and fabricated "types and sizes" lists are removed).
