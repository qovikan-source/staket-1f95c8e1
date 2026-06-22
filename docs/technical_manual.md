# Stäket Portal - Detailed Technical Documentation & System Manual

This document provides a comprehensive, production-grade guide of the Stäket
Portal codebase, database layer, state machine, and page functionalities. It is
structured with extreme granularity so that any AI assistant or engineer reading
it can immediately explain or implement features, database triggers, user roles,
API queries, or form operations on the website.

---

## 1. Directory Tree & Module Map

Below is the directory map of the application's source code, detailing the
responsibility of each file:

```
src/
├── main.tsx              # Application entry point. Mounts the Index component inside the HTML container.
├── vite-env.d.ts         # TypeScript global type definitions for Vite environment variables.
├── types.ts              # Contains shared TypeScript type definitions (UserRole, UserProfile, NoticePost, FileItem, VacantSpace, etc.).
├── App.tsx               # Root component wrapping main layouts.
├── App.css               # Global application styles.
├── index.css             # Tailwinds utility imports, base brand colors, custom font bindings, and global scrollbar styles.
├── initialData.ts        # Seed data for profiles, notices, files, and spaces. Manages localStorage cache caching functions.
│
├── lib/
│   ├── supabase.ts       # Supabase client instantiation using Vite environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).
│   ├── db.ts             # dbService singleton containing all Supabase database queries, RPC invocations, and storage bucket uploads.
│   └── utils.ts          # Utility functions (e.g. cn helper for conditional Tailwind classes).
│
├── pages/
│   ├── Index.tsx         # The main portal layout. Manages global states (currentUserProfile, activeTab, role), header, sub-header, and routing.
│   └── NotFound.tsx      # Fallback error page for unrecognized route paths.
│
└── components/
    ├── NavLink.tsx       # Helper component for header routing buttons.
    ├── LoginView.tsx     # The authentication panel. Standard email/password forms and trigger logic.
    ├── HomeView.tsx      # Home page containing greetings, news sliders, quick shortcut cards, and calendar notice modules.
    ├── NoticeboardView.tsx # noticeboard (Anslagstavlan) view with category filtering, highlight anchors, post modals, and admin controls.
    ├── DocumentHubView.tsx # Document repository (Medlemsfiler & Styrelsefiler) with sorting, year folder groupings, upload queue, and bulk edit modals.
    ├── ContactBookView.tsx # Kontaktboken directory. Handles multi-column sorting and localized search.
    ├── AdminView.tsx     # Administrator Control Panel. Handles user CRUD, notice listings, file lists, and available business space lists.
    ├── OurCompaniesView.tsx # Våra Företag view rendering registered local business logos and web link forwarding.
    ├── AboutUsView.tsx   # Om Oss layout containing description paragraphs and the board members roster (Styrelsen).
    ├── AvailableSpacesView.tsx # Lediga Lokaler page rendering vacant spaces with detailed specs and contact forms.
    └── ContactPublicView. # Public contact form rendering phone numbers, maps, and interest input forms.
```

---

## 2. Role-Based Access Control (RBAC) & Permissions Matrix

User permissions are controlled by the `role` attribute stored on each user's
profile database row.

| User Role              | Navigation Tabs                                                                        | Styrelsefiler    | Medlemsfiler     | Noticeboard Write | User CRUD       | Space Uploads    |
| :--------------------- | :------------------------------------------------------------------------------------- | :--------------- | :--------------- | :---------------- | :-------------- | :--------------- |
| **Besökare** (Visitor) | Home, Companies, About Us, Spaces, Contact, Login                                      | No               | No               | No                | No              | No               |
| **Hyresgäst** (Tenant) | Home, Noticeboard, Document Hub, Contact Book, Styrelse & Drift, public tabs           | No               | Yes (Read)       | No                | No              | No               |
| **Medlem** (Member)    | Home, Noticeboard, Document Hub, Contact Book, Styrelse & Drift, public tabs           | No               | Yes (Read)       | No                | No              | No               |
| **Styrelse** (Board)   | Home, Noticeboard, Document Hub, Contact Book, Styrelse & Drift, public tabs           | Yes (Read)       | Yes (Read)       | No                | No              | No               |
| **Administrator**      | Home, Noticeboard, Document Hub, Contact Book, Styrelse & Drift, Adminpanel, public tabs| Yes (Read/Write) | Yes (Read/Write) | Yes (Read/Write)  | Yes (Full CRUD) | Yes (Read/Write) |

---

## 3. Global Application States & Lifecycle Hooks

In `src/pages/Index.tsx`, the portal handles several global states that manage
navigation, session restoration, and page synchronization:

### 3.1. Main Global States

- `profiles` (UserProfile[]): Local cache array of all user profiles.
- `notices` (NoticePost[]): Local cache array of all noticeboard announcements.
- `files` (FileItem[]): Local cache array of all documents in the system.
- `spaces` (VacantSpace[]): Local cache array of all vacant commercial units.
- `activeTab` (string): Tracks the active page viewport (e.g. `'hem'`,
  `'anslagstavlan'`, `'filer'`, `'kontaktboken'`, `'styrelse_drift'`, `'administration'`).
- `role` (UserRole): The active user's authorization level (defaults to
  `'Besökare'`).
- `currentUserProfile` (UserProfile | null): Profile details of the currently
  signed-in user.
- `pendingNoticeId` (string | null): Noticeboard ID waiting to be highlighted
  and opened.

### 3.2. Lifecycle Routines (useEffect Hooks)

1. **State Synchronization (`localStorage`)**:
   - Saves the active user's `role` and `activeTab` to `localStorage` when
     modified.
   - Sanitizes the active page if a role changes (e.g., if a user logs out to
     `'Besökare'`, `activeTab` is automatically redirected to `'hem'`).
2. **Database Connection & Session Mount**:
   - Loads local cached arrays from `localStorage` (`loadProfiles`,
     `loadNotices`, `loadFiles`, `loadSpaces`) for instantaneous initial UI
     rendering.
   - Calls `supabase.auth.getSession()` on mount. If a valid JWT session is
     present, fetches the associated profile row by email, assigning
     `currentUserProfile` and elevating `role`.
   - Triggers asynchronous API calls to load fresh rows from Supabase, updates
     local state arrays, and saves the new results to `localStorage` caches.
3. **Hash Routing & External Notices Links**:
   - Pipes anchor hash changes (e.g. `#notice-uuid`). It automatically parses
     the ID, redirects the view to `anslagstavlan`, scrolls the target post card
     into viewport focus, highlights it with a gold border, and opens the full
     reading modal.

---

## 4. Supabase Database Schema, Security (RLS) & RPCs

### 4.1. Core Tables Definition

The portal uses a PostgreSQL database schema under the `public` namespace.

#### Table: `public.profiles`

Tracks metadata for all registered users, hyresgäster, styrelse members, and
administrators.

```sql
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('Administrator', 'Styrelse', 'Medlem', 'Hyresgäst')),
  email text NOT NULL UNIQUE,
  phone text DEFAULT '',
  company text DEFAULT '',
  org_nr text DEFAULT '',
  unit text DEFAULT '', -- e.g., "Lokal 24B"
  address text DEFAULT '',
  description text DEFAULT '',
  website text DEFAULT '',
  logo text DEFAULT '',
  board_title text DEFAULT '',
  hide_in_contact_book boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);
```

#### Table: `public.files`

Stores file pointers matching uploads in Supabase Storage.

```sql
CREATE TABLE public.files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL, -- Fully qualified URL pointing to public bucket
  category text NOT NULL CHECK (category IN ('Medlemsfiler', 'Styrelsefiler')),
  folder text CHECK (folder IN ('Administration', 'Ekonomi', 'Pantbrev', 'Arkiv')),
  file_size text NOT NULL,
  uploaded_at timestamp with time zone DEFAULT now() NOT NULL,
  mime_type text DEFAULT 'application/pdf'
);
```

#### Table: `public.notices`

Stores noticeboard announcements.

```sql
CREATE TABLE public.notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL, -- e.g., 'Information', 'Aktiviteter', 'Renovering'
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  pinned boolean DEFAULT false,
  author text NOT NULL
);
```

#### Table: `public.vacant_spaces`

Tracks available lease holdings in the business park.

```sql
CREATE TABLE public.vacant_spaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  location text NOT NULL,
  description text NOT NULL,
  suitable_for text[] NOT NULL,
  total_area text NOT NULL,
  details_lower_level text NOT NULL,
  details_upper_level text NOT NULL,
  security_info text NOT NULL,
  img_url text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
```

### 4.2. Row Level Security (RLS) Policies

Row Level Security is enabled on all tables. Database requests must satisfy
these constraints:

- **Profiles RLS**:
  - _Select_: Any authenticated user can read all profiles (needed for
    Kontaktboken). Visitors (`role = 'Besökare'`) cannot read profiles.
  - _Insert/Update/Delete_: Restricted exclusively to users with
    `role = 'Administrator'` in their profile metadata, or if a user updates
    their own profile details.
- **Files RLS**:
  - _Select (Medlemsfiler)_: Readable by any authenticated user.
  - _Select (Styrelsefiler)_: Readable only by users whose active profile role
    is `'Styrelse'` or `'Administrator'`.
  - _Insert/Update/Delete_: Restricted exclusively to the `'Administrator'`
    role.
- **Notices RLS**:
  - _Select_: Publicly readable by all users, including visitors.
  - _Insert/Update/Delete_: Restricted exclusively to the `'Administrator'`
    role.
- **Vacant Spaces RLS**:
  - _Select_: Publicly readable by all users.
  - _Insert/Update/Delete_: Restricted exclusively to the `'Administrator'`
    role.

### 4.3. Trigger: User Account Cascading Deletion

A custom trigger removes login credentials from the internal `auth.users` schema
when an administrator deletes a profile row from the frontend:

```sql
CREATE OR REPLACE FUNCTION public.handle_delete_user()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM auth.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_deleted
  AFTER DELETE ON public.profiles
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_delete_user();
```

### 4.4. Backend RPC Function: Secure Member Registration

Allows administrators to create a user inside the private auth schema and link
it with the public profiles table in a single transaction:

```sql
CREATE OR REPLACE FUNCTION public.create_new_user(
  new_email text,
  new_password text,
  new_role text,
  new_name text,
  new_phone text DEFAULT '',
  new_company text DEFAULT '',
  new_org_nr text DEFAULT '',
  new_unit text DEFAULT '',
  new_address text DEFAULT '',
  new_description text DEFAULT '',
  new_website text DEFAULT '',
  new_logo text DEFAULT ''
)
RETURNS jsonb
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
  encrypted_pw text;
BEGIN
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = new_email) THEN
    RAISE EXCEPTION 'En användare med denna e-postadress finns redan.';
  END IF;

  new_user_id := gen_random_uuid();
  encrypted_pw := crypt(new_password, gen_salt('bf', 10));

  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', new_email, encrypted_pw, now(), '{"provider":"email","providers":["email"]}'::jsonb, jsonb_build_object('name', new_name), 'authenticated', 'authenticated', now(), now()
  );

  INSERT INTO public.profiles (
    id, name, role, email, phone, company, org_nr, unit, address, description, website, logo
  ) VALUES (
    new_user_id, new_name, new_role, new_email, new_phone, new_company, new_org_nr, new_unit, new_address, new_description, new_website, new_logo
  );

  RETURN jsonb_build_object('id', new_user_id, 'email', new_email);
END;
$$ LANGUAGE plpgsql;
```

### 4.5. Backend RPC Function: Secure User Update (Credentials & Profile)

Allows administrators to update any user's credentials (email and/or password) in the private auth schema along with all profile fields in a single transaction:

```sql
CREATE OR REPLACE FUNCTION public.admin_update_user(
  target_user_id uuid,
  new_email text,
  new_password text DEFAULT NULL,
  new_role text DEFAULT NULL,
  new_name text DEFAULT NULL,
  new_phone text DEFAULT '',
  new_company text DEFAULT '',
  new_org_nr text DEFAULT '',
  new_unit text DEFAULT '',
  new_address text DEFAULT '',
  new_description text DEFAULT '',
  new_website text DEFAULT '',
  new_logo text DEFAULT ''
)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  encrypted_pw text;
BEGIN
  -- Check if administrator
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'Administrator'
  ) THEN
    RAISE EXCEPTION 'Insufficient privileges';
  END IF;

  -- Update email if requested
  IF new_email IS NOT NULL AND new_email <> '' THEN
    UPDATE auth.users SET email = new_email, email_confirmed_at = now() WHERE id = target_user_id;
  END IF;

  -- Update password if requested
  IF new_password IS NOT NULL AND new_password <> '' THEN
    encrypted_pw := crypt(new_password, gen_salt('bf', 10));
    UPDATE auth.users SET encrypted_password = encrypted_pw, updated_at = now() WHERE id = target_user_id;
  END IF;

  -- Update public profiles
  UPDATE public.profiles
  SET 
    name = COALESCE(new_name, name),
    role = COALESCE(new_role, role),
    email = COALESCE(new_email, email),
    phone = COALESCE(new_phone, phone),
    company = COALESCE(new_company, company),
    org_nr = COALESCE(new_org_nr, org_nr),
    unit = COALESCE(new_unit, unit),
    address = COALESCE(new_address, address),
    description = COALESCE(new_description, description),
    website = COALESCE(new_website, website),
    logo = COALESCE(new_logo, logo)
  WHERE id = target_user_id;

  RETURN jsonb_build_object('success', true, 'id', target_user_id);
END;
$$ LANGUAGE plpgsql;
```

---

## 5. View-by-View Functional Guide & Step-by-Step Operations

### 5.1. Authentication Panel (LoginView.tsx)

- **How to Access**: Click "Logga in" on the top right corner of the header.
- **Step-by-Step Logging In**:
  1. Enter your registered email and password.
  2. Click the submit button.
  3. On success, a session is initialized, and the portal dashboard loads your
     custom role view.
  4. _Troubleshooting_: Ensure SMTP mail is verified if registering. If password
     is lost, contact system Administrator.

### 5.2. Home View (HomeView.tsx)

- **How to Access**: Default page tab `'hem'` for non-admins upon login.
- **Components & Actions**:
  - **Greeting Header**: Displays a localized message including the user's name
    retrieved from their profile.
  - **Fastighetsinformation Grid**: Visual statistics on spaces, units, and
    notice counts.
  - **Senaste Nyheter**: Lists the three latest noticeboard cards. Clicking on a
    card moves the view to the noticeboard page and displays the notice expanded
    in its detailed view.

### 5.3. Noticeboard View (NoticeboardView.tsx)

- **How to Access**: Header navigation dropdown/link `Anslagstavlan`.
- **Functions & Step-by-Step Actions**:
  - **Filter Announcements**: Use the category menu links in the header or the
    tab row on the page to display matching notices (e.g. _Information_,
    _Aktiviteter_).
  - **Expand Notice**: Click on any notice card. An expand modal shows full
    text, date, and publisher.
  - **Create Notice (Admin Only)**:
    1. Click the **"+ Skapa Post"** button in the upper corner of the list.
    2. Input details: _Rubrik_ (Title), _Kategori_ (Select dropdown),
       _Publiceringsdatum_ (Custom Calendar Date selector), _Fäst överst_ (Pin
       post to top toggle), and _Innehåll_ (Rich text textarea).
    3. Click **"Publicera"**. The post is saved to the notices table.
  - **Edit Notice (Admin Only)**:
    1. Click the pencil icon on the target card.
    2. Adjust fields inside the modal.
    3. Click **"Spara ändringar"**.
  - **Delete Notice (Admin Only)**: Click the trash can icon on the card, and
    click confirmation when prompted.

### 5.4. Document Hub (DocumentHubView.tsx)

- **How to Access**: Sub-header link `Dokument` when logged in.
- **Functions & Step-by-Step Actions**:
  - **Browse Folders**:
    1. Select either the **Medlemsfiler** tab or the **Styrelsefiler** tab.
    2. If in Styrelsefiler, select a target directory (e.g., `Ekonomi`).
    3. The system scans the database and lists year subfolders (e.g.,
       `År 2026`).
    4. Click `År 2026`. The files matching `Ekonomi` uploaded in year `2026`
       will be displayed.
    5. Use the breadcrumbs (`Mappar / Ekonomi / År 2026`) to track path depth,
       and click the arrow button to return to the root folder.
  - **Single File Upload (Admin Only)**:
    1. Click **"Ladda upp dokument"**.
    2. In the modal, drag/drop or choose one or multiple files.
    3. Select target category (Medlemsfiler or Styrelsefiler), board folder (if
       Styrelsefiler), and a custom upload date.
    4. Click **"Starta uppladdning"**.
  - **Single File Edit (Admin Only)**:
    1. Click the pencil icon on the right side of the document row.
    2. Edit file name, category, board folder, or upload year.
    3. Click **"Spara ändringar"**. Changing the year automatically relocates
       the file to its corresponding year subfolder.
  - **Bulk File Deletion (Admin Only)**:
    1. Select multiple files by checking the checkboxes next to their rows.
    2. Click **"Radera markerade (N)"** in the bulk actions bar.
    3. Confirm deletion in the popup box.
  - **Bulk File Metadata Updates (Admin Only)**:
    1. Select multiple files by checking the checkboxes next to their rows.
    2. Click **"Ändra markerade (N)"** in the green bulk action bar.
    3. In the modal, select new values for _Kategori_, _Mapp_, or _Utgivningsår_
       (leave fields as "Behåll nuvarande" to skip updating them).
    4. Click **"Spara ändringar"**. All selected files will instantly update and
       relocate to their new folders/subfolders.

### 5.5. Member Contact Book (ContactBookView.tsx)

- **How to Access**: Sub-header link `Kontaktboken`.
- **Functions & Step-by-Step Actions**:
  - **Searching**: Use the search input box to search by name or company.
  - **Interactive Sorting**:
    - The list is sorted by **Lokal (Unit number) ascending** by default.
    - Click on any column header (_Namn_, _Företag_, _Lokal_, _Telefon_,
      _E-post_) to sort the listing by that column. Click again to toggle
      between ascending and descending order.

### 5.6. Admin Panel (AdminView.tsx)

- **How to Access**: Sub-header link `Adminpanel` (visible only to
  `Administrator`).
- **Sub-views**:
  - **Användare Tab**: Manages user profiles.
    - _Creating User_: Click **"Lägg till ny användare"** -> Fill out email,
      name, password, phone, organization details, company logo image, and role
      -> Click submit (calls RPC).
    - _Editing User/Changing Role_: Click the **"Redigera"** (pencil) icon ->
      Select the new Role or modify details -> Click **"Spara ändringar"**.
    - _Deleting User_: Click the **"Ta bort"** (trash) icon -> Confirm deletion
      (cascades to auth.users).
  - **Lediga Lokaler Tab**: Manages available leasing spaces.
    - _Creating Available Space_: Click **"Lägg till ny lokal"** -> Fill out
      description, locations, size metrics, and security information -> Click
      submit.
    - _Deleting Available Space_: Click the trash can icon next to the vacant
      space card in the admin view.

### 5.7. Available Spaces & Contact (AvailableSpacesView.tsx / ContactPublicView.tsx)

- **How to Access**: Main header link `Lediga Lokaler` or `Kontakt`.
- **Lease Space Application**:
  1. Select a space from the available listings on the `Lediga Lokaler` page.
  2. Click **"Visa detaljer"** to check structural specifications (security
     status, height, area split).
  3. Under the details, locate the **"Intresseanmälan"** contact form.
  4. Enter name, company name, contact info, and proposed utility details.
  5. Submit the form (sends details to backend, logs applications, and hooks
     notification triggers).

---

## 6. Supabase Storage Bucket Setup & Security

Documents are stored within a public Supabase Storage bucket named `files`.

- **Bucket Name**: `files`
- **Upload Storage Pathing**:
  - _Medlemsfiler_: Uploaded under the root level of the bucket.
  - _Styrelsefiler_: Uploaded under directory structures:
    - `Administration/`
    - `Ekonomi/`
    - `Pantbrev/`
    - `Arkiv/`
- **Storage Access Control Rules (Policies)**:
  - `select`: Anyone can download files uploaded under public paths, but paths
    matching board folders (`Administration/`, `Ekonomi/`, etc.) require the
    authenticated user's profile role to be either `'Styrelse'` or
    `'Administrator'`.
  - `insert/update/delete`: Permitted only if the active authenticated user's
    profile role is `'Administrator'`.

---

## 7. Sidonavigering, Underflikar & Viktiga Knappar (ID-väljare)

Detta avsnitt beskriver de exakta etiketterna (labels) och ID-väljarna för sidans navigationslänkar och viktigaste knappar så att du som AI kan ge korrekta instruktioner till användaren.

### 7.1. Huvudmeny och Sidomeny (Vänsterpanelen)

Sidomenyn innehåller navigationsknapparna för att byta sida (eller flik). Dessa knappar har specifika HTML-IDn som används i guiderna:

*   **Hem** (Flik-ID: `'hem'`): Länkar till startsidan med allmän info.
*   **Företag** (Flik-ID: `'vara_foretag'`): Länkar till sidan "Våra Företag" som listar lokala bolag.
*   **Lediga Lokaler** (Flik-ID: `'lediga_lokaler'`): Länkar till listan över lediga lokaler för uthyrning.
*   **Om Oss** (Flik-ID: `'om_oss'`): Länkar till information om samfälligheten och styrelsens medlemmar.
*   **Kontakt** (Flik-ID: `'kontakt'`): Länkar till det publika kontaktformuläret.
*   **Anslagstavlan** (Flik-ID: `'anslagstavlan'`, HTML-ID: `#tab-anslagstavlan`): Länkar till medlemmarnas anslagstavla.
*   **Filer** (Flik-ID: `'filer'`, HTML-ID: `#tab-filer`): Länkar till dokumentarkivet (både medlemsfiler och styrelsefiler).
*   **Kontaktboken** (Flik-ID: `'kontaktboken'`, HTML-ID: `#tab-kontaktboken`): Länkar till medlemsregistrets kontaktbok med sortering.
*   **Alla användare** (Flik-ID: `'administration'`, HTML-ID: `#tab-administration`): Länkar till administratörens kontrollpanel (Adminpanelen).

### 7.2. Administrationspanelen (Adminpanel - Underflikar)

När du klickar på fliken **"Alla användare"** (`#tab-administration`) visas administratörens kontrollpanel. Den innehåller fyra underflikar överst på sidan:

1.  **Användare & Medlemmar** (Underflik-ID: `'användare'`): Listar alla registrerade användare och medlemskonton.
2.  **Kontrollera Filer** (Underflik-ID: `'filer'`): Visar en administrativ tabell över alla uppladdade filer där man kan redigera eller radera dem.
3.  **Radera Anslag** (Underflik-ID: `'anslagstavla'`): Visar en administrativ lista över alla anslagstavlans inlägg där man enkelt kan radera dem.
4.  **Lediga Lokaler Järfälla** (Underflik-ID: `'lediga_lokaler'`): Gör det möjligt att lägga till eller radera annonser för lediga lokaler.

### 7.3. Viktiga Knappar och Formulärfält (med HTML-ID)

Här är de exakta namnen på de knappar och inmatningsfält som används för viktiga funktioner och deras HTML-IDn:

#### A. Lägga till en ny medlem/användare
*   Knapp för att öppna modalen: **"Skapa ny användare"** (HTML-ID: `#btn-add-member`, grön knapp överst till höger under fliken 'Användare & Medlemmar').
*   Fältet för namn i modalen: **"Namn / Företagsnamn *"** (HTML-ID: `#user-name`).
*   Knapp för att spara medlemmen: **"Skapa användare"** (HTML-ID: `#btn-save-new-profile`, mörk knapp längst ner i formuläret).

#### B. Skapa ett nytt anslag
*   Knapp för att öppna modalen: **"Skapa ny post"** (HTML-ID: `#btn-new-notice`, mörk knapp längst upp till höger under fliken 'Anslagstavlan').
*   Fältet för rubrik i modalen: **"Rubrik / Titel *"** (HTML-ID: `#form-title`).
*   Knapp för att spara/publicera anslaget: **"Publicera nu"** (HTML-ID: `#btn-publish-notice`, grön knapp längst ner i formuläret).

#### C. Ladda upp filer
*   Knapp för att öppna modalen: **"Ladda upp dokument"** (HTML-ID: `#btn-upload-file`, mörk knapp längst upp till höger under fliken 'Filer').
*   Knapp för att spara filerna efter val: **"Spara alla X filer"** (HTML-ID: `#btn-save-file`, grön knapp längst ner i formuläret).

Använd alltid dessa exakta namn och hänvisa till rätt navigationslänkar när du förklarar för användaren hur man utför handlingar i portalen!

### 7.4. Gruppnedladdning av filer som ZIP-arkiv (Endast Administrator)

Administratörer har tillgång till en kraftfull bulk-nedladdningsfunktion under fliken **Filer** (`#tab-filer`):

1.  **Välj enskilda mappar**: När administratören visar "Alla mappar" i Styrelsearkivet finns det en kryssruta bredvid varje huvudmapp (t.ex. *Administration*, *Ekonomi*, *Pantbrev*, *Arkiv*). Man kan markera flera mappar och klicka på **"Ladda ner markerade mappar (.zip) (X)"** för att ladda ner dem tillsammans.
2.  **Välj enskilda årsmappar**: Inne i en huvudmapp (t.ex. *Ekonomi*) visas en kryssruta i övre högra hörnet på varje årskort. Man kan markera specifika år (t.ex. *År 2026* och *År 2025*) och klicka på **"Ladda ner markerade år (.zip) (X)"** för att ladda ner bara dessa år.
3.  **Ladda ner markerade (.zip)**: Genom att markera kryssrutorna bredvid enskilda filer visas bulk-åtgärdsfältet. Knappen **"Ladda ner (.zip) (X)"** paketerar de valda filerna till en ZIP-fil och laddar ner dem.
4.  **Ladda ner hel mapp (.zip)**: När man navigerar in i en specifik mapp under Styrelsefiler (t.ex. *Ekonomi* eller *Administration*) visas en knapp bredvid rubriken: **"Ladda ner hela mappen [Mappnamn] (.zip)"**. Den laddar ner alla filer i den mappen.
5.  **Ladda ner specifik årsmapp (.zip)**: Inne i en specifik årsmapp (t.ex. *Ekonomi / År 2026*) visas i brödsmulsnavigeringen knappen **"Ladda ner År [År] (.zip)"** som paketerar alla dokument från det specifika året.
6.  **Zip:a alla matchade**: I sökfältet visas knappen **"Zip:a alla matchade (X)"** bredvid sökresultaten. Den gör det möjligt att söka efter specifika filer (t.ex. "protokoll") och ladda ner alla sökresultat på en gång som ett ZIP-arkiv.

Detta ZIP-arkiv bevarar automatiskt undermappsstrukturen (t.ex. `Ekonomi/År 2026/filnamn.pdf`) vid nedladdning. Funktionerna är dolda för vanliga medlemmar och hyresgäster.

### 7.5. Administrativa åtgärder och filhantering

#### Hur ändrar jag roller, detaljer och lösenord på en användare?
1.  **Gå till Medlemsregistret**: Klicka på fliken **"Alla användare"** (`#tab-administration`) i sidomenyn. Den öppnas på underfliken **"Användare & Medlemmar"**.
2.  **Ändra Roll, Detaljer & Lösenord**: Klicka på knappen **"Ändra"** (penna-ikonen) längst till höger på raden för den användare du vill ändra. Detta öppnar modalen för att redigera användarprofilen.
3.  **Redigera och Spara**: I modalen kan du ändra roll, namn, e-post, telefon, adress, beskrivning, webbplats, företagskortets logotyp, samt ange ett nytt lösenord under fälten **"Lösenord"** och **"Upprepa Lösenord"** (vilket uppdaterar inloggningsuppgifterna i databasens privata autentiseringsschema via en säker RPC-funktion). Spara ändringarna genom att klicka på **"SPARA MEDLEM"**.

#### Hur ändrar jag bilden för företagskorten på våra företag?
Bilden som visas på företagets kort under fliken **"Våra Företag"** motsvarar logotypen i dess användarprofil:
1.  Klicka på fliken **"Alla användare"** (`#tab-administration`) och leta upp företagets medlemskonto under underfliken **"Användare & Medlemmar"**.
2.  Klicka på knappen **"Ändra"** (penna-ikonen) för att öppna modalen.
3.  Scrolla ner till fältet **"Logotyp"**. Om en gammal logotyp finns, klicka först på **"Ta bort"** bredvid filnamnet.
4.  Klicka på filväljaren under **"Logotyp"** för att välja en ny bildfil från din enhet (rekommenderad storlek: 400x240 pixlar).
5.  Klicka på **"SPARA MEDLEM"** längst ner. Bilden laddas automatiskt upp till Supabase storage och företagskortet uppdateras direkt.

#### Hur laddar jag ner en fil eller en hel mapp?
1.  **Ladda ner en enskild fil**: Gå till fliken **Filer** (`#tab-filer`). Leta upp filen i tabellen och klicka på filnamnet eller ladda ner-knappen längst till höger för att ladda ner den.
2.  **Ladda ner en hel mapp**: Under Styrelsefiler, gå in på mappen (t.ex. *Ekonomi*). Klicka på knappen **"Ladda ner hela mappen [Mappnamn] (.zip)"** bredvid mappens rubrik.
3.  **Ladda ner markerade mappar eller år**:
    - På översikten "Alla mappar" kan du markera kryssrutorna bredvid de mappar du vill ladda ner, och klicka på den svarta knappen **"Ladda ner markerade mappar (.zip) (X)"** längst ner.
    - Inne i en mapp (t.ex. *Ekonomi*) kan du markera kryssrutorna uppe till höger på årskorten (t.ex. *År 2026* och *År 2025*) och klicka på **"Ladda ner markerade år (.zip) (X)"** längst ner.
    - Det går även att kryssa i enskilda filer i listan eller söka efter filer och klicka på **"Ladda ner (.zip) (X)"** i bulk-åtgärdsfältet eller **"Zip:a alla matchade (X)"**.

#### Hur ändrar jag året eller andra detaljer på en fil?
1.  **Ändra en enskild fil**: Gå till **"Alla användare"** (`#tab-administration`) och välj underfliken **"Kontrollera Filer"** (eller direkt i fliken **Filer**). Leta upp filen och klicka på **"Ändra"** (penna-ikonen) till höger. I modalen kan du uppdatera filens namn, kategori (Medlemsfiler/Styrelsefiler), styrelsemapp (Administration, Ekonomi, etc.) samt år. Klicka på spara.
2.  **Ändra flera filer samtidigt (Bulk Edit)**: Markera kryssrutorna bredvid de filer du vill ändra under fliken **Filer** (`#tab-filer`). Klicka på **"Redigera markerade filer"** i det svarta bulk-åtgärdsfältet längst ner. Uppdatera Kategori, Styrelsemapp och År för alla valda filer samtidigt i modalen och klicka på spara. Filerna flyttas automatiskt till sina nya års-undermappar.
