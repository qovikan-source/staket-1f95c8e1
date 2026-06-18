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

### F. Noticeboard & Security Guards
- **Login Guarded Homepage Notices**: Prompts visitors/unauthenticated users when clicking homepage news cards, taking them to the login page. After successful authentication, they are redirected directly to the specific post they clicked.
- **Dynamic Post Highlighting & Detail Modal**: The targeted notice is scrolled into view, highlighted with an elegant brand gold border and ring outline, and automatically opened in a detailed reading modal.
- **Announcement Expand Modal**: Added a detail modal to the noticeboard allowing users to click on any notice card to read the full body content, Category, Author, and Publish Date without layout constraints.
- **Noticeboard Post Editing**: Added Pencil button edit controls for the `Administrator` role on notice cards, allowing updating of titles, categories, publish dates, pinned status, and content directly synced to Supabase database.
- **Removed Like Reactions**: Cleaned up the noticeboard UI by completely removing the Likes simulation and "Gilla" buttons from all notice cards and detail views.
- **Real-Time Profile Resolution**: Updated the app to automatically load the signed-in user's profile from the database on mount/login, showing the user's registered name (e.g., `'Roh'`) instead of hardcoded fallbacks like `'Admin Adminsson'`.
- **Admin-Only Permissions Restructuring**: Restructured create, edit, and delete controls across noticeboards, documents, and vacant spaces so that only the authenticated `Administrator` role can execute these changes, aligning with the website's administrative security requirements.
- **Notice Custom Dates**: Integrated a publish date selector inside the "Skapa Post" modal, allowing administrators to publish notices backdated or scheduled with precise calendar dates.
- **Persisted Session States**: Configured `localStorage` storage for the user role and current view tab so page reloads do not log the user out or lose their active context.
- **Removed Demo Bar Entirely**: Fully removed the prototype role selector warning bar from the application, leaving a clean production-ready layout where roles can only be acquired via actual database profiles.
- **Fixed-Height Dashboard Layout**: Constrained the main portal viewport height to `h-screen overflow-hidden` and enabled independent scrolling for the workspace canvas. This keeps the side panel/menu at a fixed 100% height, ensuring the profile box containing the logged-in user name is always visible at the bottom of the sidebar without scrolling.

---

## 3. Core Database & Storage Configuration

### A. Supabase Database Schema
- **`profiles`**: Links to `auth.users` on `id` UUID. Houses roles (`Medlem`, `Styrelse`, `Administrator`), unit numbers, company name, phone, name, and organisation number (`org_nr`).
- **`files`**: Stores metadata of uploaded documents (URL, size, type, category, folder category).
- **`vacant_spaces`**: Keeps available offices/warehouses details.
- **`noticeboard_posts`**: Holds news and bulletins.

### B. Supabase Storage Setup (The `documents` Bucket)
- A public bucket named **`documents`** is configured.
- Root folders inside the bucket match the file categories:
  - `medlemmar/` (for documents categorized under *Medlemsfiler*)
  - `Administration/` (for board files under the *Administration* folder)
  - `Arkiv/` (for board files under the *Arkiv* folder)
  - `Ekonomi/` (for board files under the *Ekonomi* folder)
  - `Pantbrev/` (for board files under the *Pantbrev* folder)
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
