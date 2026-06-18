# Project Progress — Stäket Företagscenter Portal

This file maintains the development logs, completed milestones, integration details, and upcoming steps for the Stäket Företagscenter portal.

---

## 1. Executive Summary

We have transitioned the **Stäket Företagscenter Portal** from a local-storage mock application into a fully operational, full-stack website powered by **Supabase (PostgreSQL, Storage, and GoTrue Auth)**. Real-time subscriptions are active for notices and files, user credentials from the legacy system have been migrated successfully, and the administrator workspace has been equipped with robust editing and filtering tools.

---

## 2. Completed Milestones & Accomplishments

### A. Database Migration & Supabase Backend
- **Real Database Integration**: Replaced `localStorage` state with real-time Supabase endpoints (`profiles`, `files`, `noticeboard_posts`, and `vacant_spaces` tables).
- **GoTrue Auth Integration**: Fully connected `LoginView.tsx` with `supabase.auth` for secure login using active member email/passwords.
- **Legacy Password Compatibility**: Solved the Bcrypt/Blowfish password prefix issue ($2y$ to $2a$) by writing a migration Skript (`generate_migration.js`) and database repair sequence (`migrate_users.sql`).

### B. Member Directory & "Kontaktboken" Refinement
- **Automatic Roster Syncing**: "Kontaktboken" now reads directly from the `profiles` table.
- **Roster Filtering Rules**: Excluded Administrators entirely from Kontaktboken. Also, users are only listed if they have a non-default, valid entry in either **Lokal (Unit)** or **Företag (Company)**.
- **Org.nr Support**: Added Organisation number (`org_nr` / `Org.nr`) column headers and cells to both the admin Medlemsregister and Kontaktboken.
- **List & Card Views**: Designed two view modes for Kontaktboken (List View and Card View) and set **List View** as the default.

### C. Administrator Portal & Register Control
- **Add / Edit / Delete Member Forms**: Enabled full administrator controls in the Medlemsregister ("Alla Användare"). Administrators can edit any user's profile details via a polished form modal and delete accounts safely, guarded by verification warning boxes.
- **Confirmation warning boxes**: Integrated safety confirmation popups before removing members, documents, notices, or vacant space ads.
- **Role Filters**: Integrated role toggle filters (**Alla**, **Medlemmar**, **Styrelse**, **Administrator**) to simplify list inspection.
- **Improved Modal Height & UX**: Fixed form clipping by limiting modal heights to `max-h-[90vh]` with scrollable forms (`overflow-y-auto`), ensuring close buttons and headers stay sticky at the top.

### D. UI/UX Polishing & Image Swaps
- **Hero & Copy Updates**: Replaced the landing page hero copy and sub-headline text with accurate descriptive copy regarding Brf Stäket.
- **Section Merger**: Combined the redundant "Vi erbjuder" and "Om Stäket" sections into a unified homepage section with updated headers, quote text, checkmark list, and a "Läs mer om oss" button.
- **Footer Real Estate**: Relocated the Bulletin Board (*Anslagstavla*) to sit right above the footer, grouped contact info into a sleek single-row layout, and cleaned phone suffixes.
- **Local Asset Integration**: Imported and placed `@bild.jpg` in the top hero of the "Lediga Lokaler" page, and `@bild2.jpg` in the "Områdesguide" section.

### E. Document Hub & Bulk Upload Controls
- **Bulk Uploading**: Redesigned the upload modal to support selecting multiple files at once.
- **Custom Document Dates**: Allowed administrators to specify the actual date of each document in the upload queue (stored in `uploaded_at`), decoupling file timestamps from the system upload date.
- **Opt-in Noticeboard Announcements**: Added checkbox toggles to let admins selectively create linked Noticeboard announcements for specific uploads, preventing noticeboard spam during historical imports.

---

## 3. Core Database & Storage Configuration

### A. Supabase Database Schema
- **`profiles`**: Links to `auth.users` on `id` UUID. Houses roles (`Medlem`, `Styrelse`, `Administrator`), unit numbers, company name, phone, name, and organisation number (`org_nr`).
- **`files`**: Stores metadata of uploaded documents (URL, size, type, category, folder category).
- **`vacant_spaces`**: Keeps available offices/warehouses details.
- **`noticeboard_posts`**: Holds news and bulletins.

### B. Supabase Storage Setup (The `documents` Bucket)
- A public bucket named **`documents`** is configured.
- Inside it, the root subfolders are:
  - `medlemmar/` (Files categorized under *Medlemsfiler*)
  - `styrelse/` (Files categorized under *Styrelsefiler*)
    - Inside `styrelse/`, directories exist for `Administration`, `Arkiv`, `Ekonomi`, and `Pantbrev`.
- **Note**: Files must be uploaded *through the website portal UI* rather than directly dragged into the Supabase Console. Uploading through the website inserts corresponding metadata in the `public.files` DB table; direct bucket uploads will not show up in the document hub.

---

## 4. Next Steps & Roadmap

1. **Invite Members & Boarding**:
   - Verify the migration of legacy users inside `auth.users` and trigger reset password links/emails if any members need to set new credentials.
2. **Setup SMTP Services**:
   - Connect Supabase Auth and the portal with an SMTP provider (e.g. Resend, SendGrid) to deliver system emails and reset requests.
3. **Configure Vacancy Interest Notifications**:
   - Link the interest application form (*Intresseanmälan*) to mailers, notifying park admins when potential tenants apply for space.
4. **Deploying Production Bundle**:
   - Host the frontend bundle on Netlify, Vercel, or similar static hosts and bind the production Supabase Environment variables safely.
