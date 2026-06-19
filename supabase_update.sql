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
AS $$
DECLARE
  new_user_id uuid;
  encrypted_pw text;
BEGIN
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
