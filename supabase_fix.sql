-- Supabase Fix Script: Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- This script fixes login issues, repairs missing identities, and enables self-healing for user creation/updates.

-- PRE-STEP: Ensure missing columns exist in public.profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS website TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS logo TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS board_title TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS hide_in_contact_book BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS hide_in_company_page BOOLEAN DEFAULT false;

-- DROP restrictive check constraints on public.profiles.email dynamically
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT tc.constraint_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.constraint_column_usage ccu 
          ON tc.constraint_name = ccu.constraint_name
          AND tc.table_schema = ccu.table_schema
        WHERE tc.table_schema = 'public' 
          AND tc.table_name = 'profiles'
          AND ccu.column_name = 'email'
          AND tc.constraint_type = 'CHECK'
    LOOP
        EXECUTE 'ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS ' || quote_ident(r.constraint_name);
    END LOOP;
END $$;

-- ADD the updated email check constraint (supporting 2 to 5 character TLDs like .se, .eu, .com, .info)
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_email_check 
CHECK (email ~* '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$');


-- 0. Fix GoTrue 500 error: convert NULL values in auth.users string columns to empty strings
UPDATE auth.users
SET
  confirmation_token = COALESCE(confirmation_token, ''),
  recovery_token = COALESCE(recovery_token, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  email_change = COALESCE(email_change, ''),
  is_super_admin = COALESCE(is_super_admin, false),
  is_sso_user = COALESCE(is_sso_user, false)
WHERE confirmation_token IS NULL
   OR recovery_token IS NULL
   OR email_change_token_new IS NULL
   OR email_change IS NULL
   OR is_super_admin IS NULL
   OR is_sso_user IS NULL;

-- 1. Repair all existing users who have auth.users records but are missing auth.identities rows
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  id, -- Using UUID directly (matching auth.identities.id column type)
  id,
  jsonb_build_object('sub', id, 'email', email, 'email_verified', true),
  'email',
  id::text,
  now(),
  created_at,
  updated_at
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM auth.identities i WHERE i.user_id = u.id
)
ON CONFLICT DO NOTHING;

-- 2. Self-healing database migration block:
-- Find users who only exist in `public.profiles` (seed users or failed RPC creations) and create their authentication records.
DO $$
DECLARE
  r RECORD;
  encrypted_pw text;
BEGIN
  -- Self-healed accounts get a strong random password. Operators MUST trigger
  -- a password reset (Supabase Dashboard → Authentication → Users) so users
  -- can set their own credential. No known default password is ever assigned.
  encrypted_pw := crypt(encode(gen_random_bytes(24), 'base64'), gen_salt('bf', 10));

  FOR r IN 
    SELECT p.id, p.email, p.name 
    FROM public.profiles p
    LEFT JOIN auth.users u ON p.id = u.id
    WHERE u.id IS NULL AND p.email IS NOT NULL AND p.email <> ''
  LOOP
    -- Verify no other user has this email in auth.users
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = r.email) THEN
      -- Insert user into auth.users safely
      INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        aud,
        role,
        created_at,
        updated_at,
        confirmation_token,
        recovery_token,
        email_change_token_new,
        email_change,
        is_super_admin,
        is_sso_user
      ) VALUES (
        r.id,
        '00000000-0000-0000-0000-000000000000',
        r.email,
        encrypted_pw,
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        jsonb_build_object('name', r.name),
        'authenticated',
        'authenticated',
        now(),
        now(),
        '',
        '',
        '',
        '',
        false,
        false
      );

      -- Insert matching identity for GoTrue login
      INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
      ) VALUES (
        r.id, -- Using UUID directly
        r.id,
        jsonb_build_object('sub', r.id, 'email', r.email, 'email_verified', true),
        'email',
        r.id::text,
        now(),
        now(),
        now()
      );
    END IF;
  END LOOP;
END $$;

-- 3. Update the create_new_user RPC to insert into auth.identities and use a safer insert format
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
  new_logo text DEFAULT '',
  new_board_title text DEFAULT '',
  new_hide_in_contact_book boolean DEFAULT false,
  new_hide_in_company_page boolean DEFAULT false
)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  new_user_id uuid;
  encrypted_pw text;
BEGIN
  -- Caller-role guard: only Administrators may create new users
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'Administrator'
  ) THEN
    RAISE EXCEPTION 'Insufficient privileges: only Administrators can create users';
  END IF;

  -- Validate requested role is one of the allowed values
  IF new_role NOT IN ('Administrator', 'Styrelse', 'Medlem', 'Hyresgäst') THEN
    RAISE EXCEPTION 'Invalid role specified';
  END IF;

  -- Check if user already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = new_email) THEN
    RAISE EXCEPTION 'En användare med denna e-postadress finns redan.';
  END IF;

  new_user_id := gen_random_uuid();
  encrypted_pw := crypt(new_password, gen_salt('bf', 10));

  -- Insert user into auth.users safely (omitting columns that may be missing in older schemas)
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    is_super_admin,
    is_sso_user
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    new_email,
    encrypted_pw,
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', new_name),
    'authenticated',
    'authenticated',
    now(),
    now(),
    '',
    '',
    '',
    '',
    false,
    false
  );

  -- Insert into auth.identities to enable GoTrue login
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    new_user_id, -- Using UUID directly
    new_user_id,
    jsonb_build_object('sub', new_user_id, 'email', new_email, 'email_verified', true),
    'email',
    new_user_id::text,
    now(),
    now(),
    now()
  );

  -- Insert profile into public.profiles
  INSERT INTO public.profiles (
    id,
    name,
    role,
    email,
    phone,
    company,
    org_nr,
    unit,
    address,
    description,
    website,
    logo,
    board_title,
    hide_in_contact_book,
    hide_in_company_page
  ) VALUES (
    new_user_id,
    new_name,
    new_role,
    new_email,
    new_phone,
    new_company,
    new_org_nr,
    new_unit,
    new_address,
    new_description,
    new_website,
    new_logo,
    new_board_title,
    new_hide_in_contact_book,
    new_hide_in_company_page
  );

  RETURN jsonb_build_object('id', new_user_id, 'email', new_email);
END;
$$ LANGUAGE plpgsql;

-- 4. Update the admin_update_user RPC to support self-healing and insert into auth.identities if missing
CREATE OR REPLACE FUNCTION public.admin_update_user(
  target_user_id uuid,
  new_email text,
  new_password text DEFAULT NULL,
  new_role text DEFAULT NULL,
  new_name text DEFAULT NULL,
  new_phone text DEFAULT NULL,
  new_company text DEFAULT NULL,
  new_org_nr text DEFAULT NULL,
  new_unit text DEFAULT NULL,
  new_address text DEFAULT NULL,
  new_description text DEFAULT NULL,
  new_website text DEFAULT NULL,
  new_logo text DEFAULT NULL,
  new_board_title text DEFAULT NULL,
  new_hide_in_contact_book boolean DEFAULT NULL,
  new_hide_in_company_page boolean DEFAULT NULL
)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  encrypted_pw text;
  email_val text;
  name_val text;
BEGIN
  -- Caller-role guard: only Administrators may update users
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'Administrator'
  ) THEN
    RAISE EXCEPTION 'Insufficient privileges: only Administrators can update users';
  END IF;

  -- Self-healing: if target user profile exists but does not exist in auth.users, create it!
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = target_user_id) THEN
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = target_user_id) THEN
      SELECT email, name INTO email_val, name_val FROM public.profiles WHERE id = target_user_id;
      
      email_val := COALESCE(NULLIF(new_email, ''), email_val);
      name_val := COALESCE(NULLIF(new_name, ''), name_val);

      IF EXISTS (SELECT 1 FROM auth.users WHERE email = email_val) THEN
        RAISE EXCEPTION 'En användare med e-posten % finns redan i auth.users.', email_val;
      END IF;

      -- If the caller did not supply a password, generate a strong random
      -- one. The operator must trigger a password reset for the user.
      IF new_password IS NULL OR new_password = '' THEN
        new_password := encode(gen_random_bytes(24), 'base64');
      END IF;

      encrypted_pw := crypt(new_password, gen_salt('bf', 10));

      -- Insert into auth.users safely
      INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        aud,
        role,
        created_at,
        updated_at,
        confirmation_token,
        recovery_token,
        email_change_token_new,
        email_change,
        is_super_admin,
        is_sso_user
      ) VALUES (
        target_user_id,
        '00000000-0000-0000-0000-000000000000',
        email_val,
        encrypted_pw,
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        jsonb_build_object('name', name_val),
        'authenticated',
        'authenticated',
        now(),
        now(),
        '',
        '',
        '',
        '',
        false,
        false
      );

      -- Insert into auth.identities
      INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
      ) VALUES (
        target_user_id, -- Using UUID directly
        target_user_id,
        jsonb_build_object('sub', target_user_id, 'email', email_val, 'email_verified', true),
        'email',
        target_user_id::text,
        now(),
        now(),
        now()
      );
    ELSE
      RAISE EXCEPTION 'User not found';
    END IF;
  ELSE
    -- If user does exist in auth.users, verify they have an entry in auth.identities as well (repair on the fly)
    IF NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = target_user_id) THEN
      SELECT email INTO email_val FROM auth.users WHERE id = target_user_id;
      INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
      ) VALUES (
        target_user_id, -- Using UUID directly
        target_user_id,
        jsonb_build_object('sub', target_user_id, 'email', email_val, 'email_verified', true),
        'email',
        target_user_id::text,
        now(),
        now(),
        now()
      );
    END IF;
  END IF;

  -- Update auth.users email if changed and not empty
  IF new_email IS NOT NULL AND new_email <> '' THEN
    -- Check if another user has this email
    IF EXISTS (SELECT 1 FROM auth.users WHERE email = new_email AND id <> target_user_id) THEN
      RAISE EXCEPTION 'En användare med denna e-postadress finns redan.';
    END IF;

    UPDATE auth.users 
    SET email = new_email, email_confirmed_at = now() 
    WHERE id = target_user_id;
  END IF;

  -- Update password if provided and not empty
  IF new_password IS NOT NULL AND new_password <> '' THEN
    encrypted_pw := crypt(new_password, gen_salt('bf', 10));
    UPDATE auth.users 
    SET encrypted_password = encrypted_pw, updated_at = now() 
    WHERE id = target_user_id;
  END IF;

  -- Update profiles
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
    logo = COALESCE(new_logo, logo),
    board_title = COALESCE(new_board_title, board_title),
    hide_in_contact_book = COALESCE(new_hide_in_contact_book, hide_in_contact_book),
    hide_in_company_page = COALESCE(new_hide_in_company_page, hide_in_company_page)
  WHERE id = target_user_id;

  RETURN jsonb_build_object('success', true, 'id', target_user_id);
END;
$$ LANGUAGE plpgsql;

-- 5. Ensure the RPC can be executed by authenticated users
REVOKE ALL ON FUNCTION public.admin_update_user(uuid, text, text, text, text, text, text, text, text, text, text, text, text, text, boolean, boolean) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_update_user(uuid, text, text, text, text, text, text, text, text, text, text, text, text, text, boolean, boolean) FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_update_user(uuid, text, text, text, text, text, text, text, text, text, text, text, text, text, boolean, boolean) TO authenticated;

