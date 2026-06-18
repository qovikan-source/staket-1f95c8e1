# Project Documentation — Stäket Företagscenter Portal

This file documents the full scope, architecture, design system, and key technical capabilities of the **Stäket Företagscenter Portal** (Föreningsportal) application.

---

## 1. Project Overview & Business Purpose

**Stäket Företagscenter** is a commercial real estate business park and enterprise hub located at **Skarprättarvägen 7, 176 77 Järfälla** in Stockholm, Sweden.

The application serves two core purposes:
1. **Public-Facing Commercial Site**: Presents vacant/available commercial units ("Lediga Lokaler"), provides an overview of established member businesses ("Våra Företag"), highlights area guides and facility specifications ("Om oss"), and handles tenant interest applications ("Intresseanmälan").
2. **Private Member & Administrator Portal**: Secure log-in platform for park tenants (Members) and managers (Administrators) to share document repositories ("Filarkiv"), post administrative bulletins and notices ("Anslagstavla"), view a communal list of tenant contacts ("Kontaktbok"), and run full-scale data management from an "Administratörspanel".

---

## 2. Technical Architecture & Tech Stack

The application is built around a modern, responsive frontend and a secure serverless backend:

- **Framework**: React (v18+) with TypeScript (`.tsx`, `.ts`).
- **Build Tool**: Vite for rapid bundling and development.
- **Styling**: Tailwind CSS utilizing premium, high-contrast colors (emerald-inspired `#0B2C24` and gold/brass `#B68F52`).
- **Icons**: Lucide React (`lucide-react`).
- **Database & Backend (Supabase)**:
  - **Auth**: Supabase GoTrue Auth handles secure user credentials and logins.
  - **PostgreSQL Database**: Real tables maintain relational data:
    - `profiles`: Synced metadata for members (Lokal, company name, org number, phone, role).
    - `files`: Document registry holding metadata and URLs of stored board files.
    - `vacant_spaces`: Commercial unit listings.
    - `noticeboard_posts`: News and announcements.
  - **Storage**: A public storage bucket named `documents` stores uploaded PDF/image media categorized under `medlemmar/` or `styrelse/`.
  - **Real-Time Subscriptions**: Active websocket listeners keep notice boards and document lists instantly updated across all active member sessions.

---

## 3. Modular Core Views & Components

The codebase is highly modularized, separating each principal view tab into self-contained components under `src/components/`:

### A. Core Navigation & App Entrance (`src/pages/Index.tsx` & `src/App.tsx`)
- Orchestrates global routes, authorization state checks, mobile side-drawers, and hooks active Supabase auth sessions.
- Grants modular views based on role tiers: **Besökare** (Visitor), **Medlem** (Member), **Styrelse** (Board Member), and **Administrator** (Admin).

### B. Landing Page (`src/components/HomeView.tsx`)
- Features the updated hero title *"Välkommen till Stäket Företagscenter"*, modern font styling, the latest administrative announcements, trust/value bento cards, and a streamlined horizontal footer.

### C. Available Commercial Spaces (`src/components/AvailableSpacesView.tsx`)
- Lists vacant warehouse, storage, and showroom divisions with confirmed on-site specifications (~215 m² kombilokaler, 5m heights, manual port doors).
- Integrates a dynamic interest application form (*Intresseanmälan*) matching current listing vacancy entries.

### D. Tenant Logo Wall (`src/components/OurCompaniesView.tsx`)
- Renders an alphabetized layout showing active park businesses with their corresponding unit positions and uploaded logo graphics (falling back to initials if custom logos aren't set).

### E. Interactive Board / Noticeboard (`src/components/NoticeboardView.tsx`)
- Displays categorized bulletins (Allmänt, Ekonomi, Säkerhet, etc.) allowing priority pinning.

### F. Document Hub (`src/components/DocumentHubView.tsx`)
- Private folder registry categorized into Medlemsfiler or Styrelsefiler (with subfolders for Administration, Ekonomi, Arkiv, and Pantbrev).

### G. Member Address Book (`src/components/ContactBookView.tsx`)
- Searchable directory of active tenants, defaulted to List View with a grid/card toggle options. Automatically hides administrators and members without a registered unit or company.

### H. Administrator Workspace (`src/components/AdminView.tsx`)
- Private registry management. Allows full member creation, role filter sorting (Alla, Medlemmar, Styrelse, Administrator), profile edits, vacancy posting, and document management.

---

## 4. Key Security & Compliance Rules
- Environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) are kept isolated and are never hardcoded inside source repositories.
- Document organization requires file uploads to flow through the Admin portal rather than direct console drags, securing Postgres registry mapping integrity.
