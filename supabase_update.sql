-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard) to update the backend constraints and triggers.

-- 1. Drop the existing role check constraint on the profiles table
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

-- 2. Add the updated check constraint including 'Hyresgäst'
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('Administrator', 'Styrelse', 'Medlem', 'Hyresgäst'));

-- 3. Create a trigger function to delete the auth user when their public profile is deleted
CREATE OR REPLACE FUNCTION public.handle_delete_user()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM auth.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create the trigger on the profiles table
DROP TRIGGER IF EXISTS on_profile_deleted ON public.profiles;
CREATE TRIGGER on_profile_deleted
  AFTER DELETE ON public.profiles
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_delete_user();

-- 5. Enable pgcrypto extension if not already enabled (needed for crypt and gen_salt)
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

-- 6. Create RPC function to securely create both the auth user and public profile in one transaction
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
SET search_path = public, auth
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

  -- Insert user into auth.users
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
    logo
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
    new_logo
  );

  RETURN jsonb_build_object('id', new_user_id, 'email', new_email);
END;
$$ LANGUAGE plpgsql;

-- 7. Restrict EXECUTE on the RPC to authenticated users only (no anon)
REVOKE ALL ON FUNCTION public.create_new_user(text, text, text, text, text, text, text, text, text, text, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.create_new_user(text, text, text, text, text, text, text, text, text, text, text, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.create_new_user(text, text, text, text, text, text, text, text, text, text, text, text) TO authenticated;

-- =========================================================================
-- 8. Lock down the `documents` storage bucket (board & member files)
-- =========================================================================
-- Run these once in the Supabase SQL Editor. Logos move to a separate public
-- `logos` bucket so member/board files can be private without breaking the
-- public company pages.

-- 8a. Make the existing `documents` bucket private
UPDATE storage.buckets SET public = false WHERE id = 'documents';

-- 8b. Create a public `logos` bucket for company logos (idempotent)
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 8c. RLS policies on storage.objects for the `documents` bucket
--     (RLS is already enabled on storage.objects by Supabase.)

-- Drop any previous versions of these policies so this block is re-runnable
DROP POLICY IF EXISTS "documents: authenticated read member files" ON storage.objects;
DROP POLICY IF EXISTS "documents: board read board files" ON storage.objects;
DROP POLICY IF EXISTS "documents: board write" ON storage.objects;
DROP POLICY IF EXISTS "documents: board update" ON storage.objects;
DROP POLICY IF EXISTS "documents: board delete" ON storage.objects;
DROP POLICY IF EXISTS "logos: public read" ON storage.objects;
DROP POLICY IF EXISTS "logos: authenticated write" ON storage.objects;

-- Members (any authenticated user) may read non-board files in `documents`
CREATE POLICY "documents: authenticated read member files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] <> 'styrelse'
);

-- Only Styrelse / Administrator may read board files (styrelse/* prefix)
CREATE POLICY "documents: board read board files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = 'styrelse'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('Styrelse', 'Administrator')
  )
);

-- Only Styrelse / Administrator may upload/update/delete in `documents`
CREATE POLICY "documents: board write"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('Styrelse', 'Administrator')
  )
);

CREATE POLICY "documents: board update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'documents'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('Styrelse', 'Administrator')
  )
);

CREATE POLICY "documents: board delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('Styrelse', 'Administrator')
  )
);

-- 8d. RLS policies for the public `logos` bucket
CREATE POLICY "logos: public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'logos');

CREATE POLICY "logos: authenticated write"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'logos');

-- NOTE: After running this, any previously-shared public links to
-- `documents/...` objects (including the `url` column in public.files) will
-- stop working. The app now generates short-lived signed URLs on demand via
-- supabase.storage.from('documents').createSignedUrl(). Existing company
-- logos referenced by `profiles.logo` will need to be re-uploaded so they
-- land in the new public `logos` bucket.
