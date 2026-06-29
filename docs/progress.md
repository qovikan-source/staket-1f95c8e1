# Project Progress — Stäket Företagscenter Portal

This file maintains the development logs, completed milestones, integration
details, and upcoming steps for the Stäket Företagscenter portal.

---

## 1. Executive Summary

We have transitioned the **Stäket Företagscenter Portal** from a local-storage
mock application into a fully operational, full-stack website powered by
**Supabase (PostgreSQL, Storage, and GoTrue Auth)**. Real-time subscriptions are
active for notices and files, user credentials from the legacy system have been
migrated successfully, and the administrator workspace has been equipped with
robust editing and filtering tools.

---

## 2. Completed Milestones & Accomplishments

### A. Database Migration & Supabase Backend

- **Real Database Integration**: Replaced `localStorage` state with real-time
  Supabase endpoints (`profiles`, `files`, `noticeboard_posts`, and
  `vacant_spaces` tables).
- **GoTrue Auth Integration**: Fully connected `LoginView.tsx` with
  `supabase.auth` for secure login using active member email/passwords.
- **Legacy Password Compatibility**: Solved the Bcrypt/Blowfish password prefix
  issue ($2y$ to $2a$) by writing a migration Skript (`generate_migration.js`)
  and database repair sequence (`migrate_users.sql`).

### B. Member Directory & "Kontaktboken" Refinement

- **Automatic Roster Syncing**: "Kontaktboken" now reads directly from the
  `profiles` table.
- **Hyresgäst Role Addition**: Created a new role called `'Hyresgäst'` (tenant)
  with identical permissions as `'Medlem'`, enabling access to members-only
  content (bulletin board/anslagstavlan, file registry, and internal contact
  directory) while strictly preventing access to Styrelse and
  Administrator-level pages/actions. Equipped the administrator dashboard, user
  creation/editing modals, and filters to fully support it.
- **Roster Filtering Rules**: Excluded Administrators entirely from
  Kontaktboken. Also, users are only listed if they have a non-default, valid
  entry in either **Lokal (Unit)** or **Företag (Company)**.
- **Org.nr Support**: Added Organisation number (`org_nr` / `Org.nr`) column
  headers and cells to both the admin Medlemsregister and Kontaktboken.
- **List & Card Views**: Designed two view modes for Kontaktboken (List View and
  Card View) and set **List View** as the default.

### C. Administrator Portal & Register Control

- **Add / Edit / Delete Member Forms**: Enabled full administrator controls in
  the Medlemsregister ("Alla Användare"). Administrators can edit any user's
  profile details via a polished form modal and delete accounts safely, guarded
  by verification warning boxes.
- **Full User Credentials & Password Update**: Extended the edit member modal
  for Administrators to update all user details including password, email,
  images, website, description, and org number for all user roles (including
  Styrelse and other Administrators). Supported this securely with the
  `admin_update_user` database RPC function.
- **Confirmation warning boxes**: Integrated safety confirmation popups before
  removing members, documents, notices, or vacant space ads.
- **Role Filters**: Integrated role toggle filters (**Alla**, **Medlemmar**,
  **Styrelse**, **Administrator**) to simplify list inspection.
- **Improved Modal Height & UX**: Fixed form clipping by limiting modal heights
  to `max-h-[90vh]` with scrollable forms (`overflow-y-auto`), ensuring close
  buttons and headers stay sticky at the top.

### D. UI/UX Polishing & Image Swaps

- **Hero & Copy Updates**: Replaced the landing page hero copy and sub-headline
  text with accurate descriptive copy regarding Brf Stäket.
- **Section Merger**: Combined the redundant "Vi erbjuder" and "Om Stäket"
  sections into a unified homepage section with updated headers, quote text,
  checkmark list, and a "Läs mer om oss" button.
- **Footer Real Estate**: Relocated the Bulletin Board (_Anslagstavla_) to sit
  right above the footer, grouped contact info into a sleek single-row layout,
  and cleaned phone suffixes.
- **Local Asset Integration**: Imported and placed `@bild.jpg` in the top hero
  of the "Lediga Lokaler" page, and `@bild2.jpg` in the "Områdesguide" section.

### E. Document Hub & Bulk Upload Controls

- **Bulk Uploading**: Redesigned the upload modal to support selecting multiple
  files at once.
- **Custom Document Dates**: Allowed administrators to specify the actual date
  of each document in the upload queue (stored in `uploaded_at`), decoupling
  file timestamps from the system upload date.

### F. Noticeboard & Security Guards

- **Login Guarded Homepage Notices**: Prompts visitors/unauthenticated users
  when clicking homepage news cards, taking them to the login page. After
  successful authentication, they are redirected directly to the specific post
  they clicked.
- **Dynamic Post Highlighting & Detail Modal**: The targeted notice is scrolled
  into view, highlighted with an elegant brand gold border and ring outline, and
  automatically opened in a detailed reading modal.
- **Announcement Expand Modal**: Added a detail modal to the noticeboard
  allowing users to click on any notice card to read the full body content,
  Category, Author, and Publish Date without layout constraints.
- **Noticeboard Post Editing**: Added Pencil button edit controls for the
  `Administrator` role on notice cards, allowing updating of titles, categories,
  publish dates, pinned status, and content directly synced to Supabase
  database.
- **Removed Like Reactions**: Cleaned up the noticeboard UI by completely
  removing the Likes simulation and "Gilla" buttons from all notice cards and
  detail views.
- **Real-Time Profile Resolution**: Updated the app to automatically load the
  signed-in user's profile from the database on mount/login, showing the user's
  registered name (e.g., `'Roh'`) instead of hardcoded fallbacks like
  `'Admin Adminsson'`.
- **Admin-Only Permissions Restructuring**: Restructured create, edit, and
  delete controls across noticeboards, documents, and vacant spaces so that only
  the authenticated `Administrator` role can execute these changes, aligning
  with the website's administrative security requirements.
- **Notice Custom Dates**: Integrated a publish date selector inside the "Skapa
  Post" modal, allowing administrators to publish notices backdated or scheduled
  with precise calendar dates.
- **Persisted Session States**: Configured `localStorage` storage for the user
  role and current view tab so page reloads do not log the user out or lose
  their active context.
- **Removed Demo Bar Entirely**: Fully removed the prototype role selector
  warning bar from the application, leaving a clean production-ready layout
  where roles can only be acquired via actual database profiles.
- **Fixed-Height Dashboard Layout**: Constrained the main portal viewport height
  to `h-screen overflow-hidden` and enabled independent scrolling for the
  workspace canvas. This keeps the side panel/menu at a fixed 100% height,
  ensuring the profile box containing the logged-in user name is always visible
  at the bottom of the sidebar without scrolling.

### G. Portal Restructuring & Member View Improvements

- **Multi-Column Sorting in Kontaktboken**: Added full interactive column
  sorting for the member contact book (Kontaktboken). Configured it to sort by
  "Lokal" (unit number) by default.
- **Board Folder Year Subfolders & File Sorting**: Structured any selected
  folder (e.g., _Ekonomi_, _Arkiv_, _Administration_, _Pantbrev_) under
  Styrelsefiler to display files grouped into dynamic year-based subfolders.
  Added dynamic breadcrumb navigation (e.g., `Ekonomi / År 2026`) for seamless
  subfolder browsing.
- **Admin File Editing & Bulk Updates**: Created a metadata edit modal for the
  `Administrator` role, enabling updates to the document's name, category,
  folder, and publication/upload year. Additionally, implemented a **Bulk Edit**
  modal allowing admins to select multiple documents at once and batch-update
  their Category, Board Folder, and Publication Year simultaneously,
  automatically reorganizing all updated files into their new target year
  folders. Changing a document's year dynamically relocates the file into its
  corresponding year subfolder under that specific category folder (e.g. moving
  files from _Ekonomi 2026_ to _Ekonomi 2024_).
- **Individual Folder Checkboxes & Custom Zip Package**: Added checkbox
  selection to both Board root folders and Year subfolders, enabling the
  `Administrator` to select multiple custom folders or years to download
  together as a single ZIP file.
- **Styrelsen Roster Update**: Replaced Maria Andersson and Zinar Soran with
  Lotta Odbratt (_Vice ordförande_) and Robar Halandal (_Kassör /
  Webbansvarig_), added Rickard Holmlund and Yucel Onmaz as _Sekreterare_ and
  _Styrelsemedlem_, and added _Säkerhetsansvarig_ to Murat Kizil's role.
- **Relocation of Styrelse & Drift**: Removed the board presentations section
  from the public "Om Oss" page. Created a dedicated "Styrelse & Drift" subpage
  (`StyrelseDriftView.tsx`) accessible exclusively to logged-in users (members,
  board members, tenants, and administrators) linked directly after
  "Kontaktboken" in the navigation menus (desktop header, sidebar, and mobile
  menu drawer).
- **Om Oss Contact Update**: Updated the lead paragraph contact sentence to
  inform users that they can also contact the board (Styrelsen) for inquiries or
  questions.
- **Clickable Company Cards**: Linked company logo cards on the "Våra Företag"
  page to their respective website URLs in new browser tabs, staying in-place if
  no website is provided in their profile.
- **AI Chatbot Guided Tour Fixes**: Integrated intent detection on the client
  side to automatically append tour tags `[START_TOUR:...]` when users ask how
  to do things, resolving AI model tag omissions. Added auto-advance logic to
  immediately skip tab navigation clicks if the user is already on the target
  page.
- **Noticeboard Default Date Sorting**: Configured the Noticeboard view
  (`NoticeboardView.tsx`) to explicitly sort all announcements by date
  descending (newest first) by default. This guarantees that newly created
  notices instantly appear at the top of their respective sections (pinned or
  regular) immediately upon creation, even during optimistic client-side state
  updates. Additionally, sorted the home page's latest news section to display
  announcements in date descending order.
- **Admin-Only Floating AI Chatbot**: Implemented a global, floating AI
  Kundtjänst assistant at the bottom-right corner of the viewport, visible only
  to users with the `Administrator` role across all authenticated pages. The
  assistant uses the dynamically updated `technical_manual.md` as its exclusive
  knowledge base and is programmed to talk as the database/system manual itself.
  It restricts answers to short, plain-text responses (no markdown syntax) in
  the user's input language, limited to 600 characters max, greets the
  administrator once via a pre-written UI greeting, and instructs the user to
  contact the creator "Sirin" if the manual lacks the answers. Implements API
  call sequential fallbacks across 11 Gemini model variants.
- **Navigation Font Size Increases**: Increased text sizes of navigation menu
  items (from `text-[11px]` to `text-[13px]`) in desktop header, sub-header, and
  mobile drawer. Resized noticeboard subcategory menu dropdown links to
  `text-xs` (12px) and noticeboard search filter category labels to
  `text-sm font-bold`.
- **Noticeboard Category Renaming**: Renamed the noticeboard category
  `"Sophantering & Container"` to just `"Sophantering"` in all components, data
  seeds, and type structures.
- **Company Logos Fix**: Prevented disappearing company logo images when editing
  user details by safe-merging current database values before calling the
  `admin_update_user` database RPC in `db.ts`, and defaulting unused RPC
  parameters to `NULL` to avoid overwriting existing properties with empty
  strings.

### H. Recent Bug Fixes: JSX Structure Issue in DocumentHubView

- **The Issue**: During the addition of the new year folders and breadcrumb
  navigation within the _Arkiv_ folder, the closing `</div>` and `)}` tags for
  the `Admin Bulk Action Bar` block (lines 493-531) were accidentally deleted.
  This caused Vite's `esbuild` tool to fail with an `Expected "}" but found ";"`
  syntax error at the end of the file, which was difficult to pinpoint via
  standard syntax parsing because of template-literal JSX attribute
  complexities.
- **The Resolution**:
  1. Ran `npx tsc src/components/DocumentHubView.tsx --noEmit` which identified
     that the main root wrapper `div` (line 344) had no corresponding closing
     tag.
  2. Executed a custom bisection Node script (`find_jsx_error.mjs`) using `tsc`
     validation on sliced code chunks to isolate the missing tag to the 400-440
     range (in relation to the original block placement).
  3. Located the exact missing tags at the end of the bulk action bar container.
  4. Restored `</div>` and `)}` to close the container and conditional rendering
     wrapper, resolving the compilation error and successfully completing
     production bundle builds.

### I. Dynamic Board & Contact Management (June 2026)

- **Database Extension & Schema Updates**: Updated the `profiles` table schema with the `board_title` and `hide_in_contact_book` columns.
- **Backend Service Alignment**: Updated mapped properties in `dbService` (`src/lib/db.ts`) and database transactions (`create_new_user` and `admin_update_user` RPC functions) to include `hide_in_contact_book` and `board_title`.
- **Roster & Contact Visibility Control**: Filtered out hidden members in `ContactBookView.tsx` so users setting `hideInContactBook` to true are instantly excluded from list and card displays.
- **Admin UI Modals with Visibility Toggles & Gallery Picker**: Added corresponding `Dölj i kontaktboken` checkboxes to both the user creation form and the edit member form inside `AdminView.tsx`, updating active states and persisting the selections back to Supabase. Wired the pre-existing but unused `showGalleryPickerModal` flow so that administrators can open and select company logotypes directly from the corporate gallery picker modal for both user addition and user editing.
- **Environment & Build Verification**: Solved file editing mismatches caused by line ending conversions (CRLF vs LF) through highly targeted single-line edits, and verified compilation with `npx tsc --noEmit`.

---

## 3. Core Database & Storage Configuration

### A. Supabase Database Schema

- **`profiles`**: Links to `auth.users` on `id` UUID. Houses roles (`Medlem`,
  `Hyresgäst`, `Styrelse`, `Administrator`), unit numbers, company name, phone,
  name, and organisation number (`org_nr`).
- **`files`**: Stores metadata of uploaded documents (URL, size, type, category,
  folder category).
- **`vacant_spaces`**: Keeps available offices/warehouses details.
- **`noticeboard_posts`**: Holds news and bulletins.

### B. Supabase Storage Setup (The `documents` Bucket)

- A public bucket named **`documents`** is configured.
- Root folders inside the bucket match the file categories:
  - `medlemmar/` (for documents categorized under _Medlemsfiler_)
  - `Administration/` (for board files under the _Administration_ folder)
  - `Arkiv/` (for board files under the _Arkiv_ folder)
  - `Ekonomi/` (for board files under the _Ekonomi_ folder)
  - `Pantbrev/` (for board files under the _Pantbrev_ folder)
- **Note**: Files must be uploaded _through the website portal UI_ rather than
  directly dragged into the Supabase Console. Uploading through the website
  inserts corresponding metadata in the `public.files` DB table; direct bucket
  uploads will not show up in the document hub.

---

## 4. Next Steps & Roadmap

1. **Invite Members & Boarding**:
   - Verify the migration of legacy users inside `auth.users` and trigger reset
     password links/emails if any members need to set new credentials.
2. **Setup SMTP Services**:
   - Connect Supabase Auth and the portal with an SMTP provider (e.g. Resend,
     SendGrid) to deliver system emails and reset requests.
3. **Configure Vacancy Interest Notifications**:
   - Link the interest application form (_Intresseanmälan_) to mailers,
     notifying park admins when potential tenants apply for space.
4. **Deploying Production Bundle**:
   - Host the frontend bundle on Netlify, Vercel, or similar static hosts and
     bind the production Supabase Environment variables safely.

---

## 2.1. Mobile Responsiveness, Chatbot Adjustments & View Toggles (June 2026)

- **Touch-Friendly Navigation and Smaller Pagination Choice Pools**:
  - Resized page index navigation buttons (from `w-9 h-9` to `w-11 h-11`) to prevent missed taps on small touch screens.
  - Implemented page-limit display logic to show a maximum of **3 page choices at once** in both the Noticeboard (`NoticeboardView.tsx`) and the Document Hub (`DocumentHubView.tsx`), centered relative to the active page view.
- **Improved Screen Layout Space Efficiency**:
  - Automatically hide the horizontal "Filtrera Snabbt" category quick buttons on mobile devices using `hidden md:block` styling classes, while keeping the main search bar and standard category dropdown filters intact.
- **Active Styles in Kontaktboken**:
  - Linked the "Lista" and "Kort" switch buttons in `ContactBookView.tsx` directly to the `viewMode` state, ensuring visual background/text active states highlight the active view properly.
- **Fixed Scroll Bouncing on iOS Safari**:
  - Resolved the bug where vertical scrolling on iOS Safari froze or bounced back prematurely by removing `overflow-x: hidden` from `html` and `body` in `index.css` and attaching the property to `#root` instead.
- **Chatbot Window and Admin Links**:
  - Adjusted the float AI chatbot widget positioning parameters (`left-2 right-2 w-auto`) and constraint heights (`max-h-[65vh]`) so that the text fields and message streams fit all mobile views without overflow.
  - Increased font sizes and spacing for sidebar menu navigation items within the `Administrator` sidebar in `Index.tsx`.

