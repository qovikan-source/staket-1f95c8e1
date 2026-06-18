-- Migration SQL to import users from old website to Supabase Auth with Laravel password hashes

BEGIN;

-- FIX: Update any existing users that were manually inserted to ensure no NULLs in required fields
UPDATE auth.users 
SET 
  confirmation_token = COALESCE(confirmation_token, ''),
  recovery_token = COALESCE(recovery_token, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  email_change = COALESCE(email_change, ''),
  is_super_admin = COALESCE(is_super_admin, false),
  is_sso_user = COALESCE(is_sso_user, false)
WHERE confirmation_token IS NULL OR is_super_admin IS NULL OR is_sso_user IS NULL;

-- User: Alex (alex@kebco.eu)
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
  )
  SELECT 
    'b4072a03-b891-4a20-bda9-bbd077fe6b69',
    '00000000-0000-0000-0000-000000000000',
    'alex@kebco.eu',
    '$2a$10$Nf1cJdW3I1HyD3wo3Cohjuejx4V/LiX9G9lQxwGMmFq3UnmWhuVdu',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Alex'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'alex@kebco.eu'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Alex',
    'Administrator',
    email,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
  FROM auth.users 
  WHERE email = 'alex@kebco.eu'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Roh (zinarsoran@hotmail.com)
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
  )
  SELECT 
    'affbb4d0-dba6-42be-969a-93da4e643ed6',
    '00000000-0000-0000-0000-000000000000',
    'zinarsoran@hotmail.com',
    '$2a$10$wtIaMONfanUas.jO6T.RXuyMMbwfcAFsoSa4IjHFXI5zQV1QpD0QC',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Roh'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'zinarsoran@hotmail.com'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Roh',
    'Administrator',
    email,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
  FROM auth.users 
  WHERE email = 'zinarsoran@hotmail.com'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Lotta (lotta@jbrab.com)
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
  )
  SELECT 
    '74554438-2c34-4a7c-a5b6-cb0df3f60dc8',
    '00000000-0000-0000-0000-000000000000',
    'lotta@jbrab.com',
    '$2a$10$57IH40yCKJQRYu8JVok1hOoYJtORHQGGUYqJjqY3LcWEu7azvk2BO',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Lotta'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'lotta@jbrab.com'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Lotta',
    'Administrator',
    email,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
  FROM auth.users 
  WHERE email = 'lotta@jbrab.com'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Mirtel (zinarsoran@gmail.com)
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
  )
  SELECT 
    '9c95b5d4-edfc-4e28-b392-8e2b5b9dffcd',
    '00000000-0000-0000-0000-000000000000',
    'zinarsoran@gmail.com',
    '$2a$10$zLjqI2UOldTmVDM/JukUAO5RqwSlo.k1Hj9RUPSZFiGPnC3nCtYQi',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Mirtel'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'zinarsoran@gmail.com'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Mirtel',
    'Styrelse',
    email,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'www.mirtel.se'
  FROM auth.users 
  WHERE email = 'zinarsoran@gmail.com'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Omed (omed1@green-cab.se)
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
  )
  SELECT 
    '0f151402-85b5-416e-91d8-67322a761af1',
    '00000000-0000-0000-0000-000000000000',
    'omed1@green-cab.se',
    '$2a$10$noYeVpd0axpSs0prkTpK7eh7B6QoC5iHJjL0aJpjoLAhgFLaSeLk.',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Omed'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'omed1@green-cab.se'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Omed',
    'Styrelse',
    email,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
  FROM auth.users 
  WHERE email = 'omed1@green-cab.se'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Gustaf Kimblad (malavva@hotmail.com)
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
  )
  SELECT 
    'e32556f1-d40b-47db-8c74-74a1d4284700',
    '00000000-0000-0000-0000-000000000000',
    'malavva@hotmail.com',
    '$2a$10$cB5SUWpKkHxN.WU0GZXqjes0lre4IC.vgDMcLaCXo4Vb0bxuwk2yu',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Gustaf Kimblad'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'malavva@hotmail.com'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Gustaf Kimblad',
    'Medlem',
    email,
    '070-565 43 81',
    'On Target Solutions AB',
    '4',
    'Box 183, 177 23 Järfälla (Fakturering adress: efakt.ots@devo.se)',
    'Lokal ägare',
    'https://www.otsab.com/'
  FROM auth.users 
  WHERE email = 'malavva@hotmail.com'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Staffan Norrga (staffan@norrga.com)
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
  )
  SELECT 
    'b8386892-51c5-488e-92cc-702f058a4099',
    '00000000-0000-0000-0000-000000000000',
    'staffan@norrga.com',
    '$2a$10$G.hTuvjKOvwEY7SgAbwN6ecCPwOUvlaRXHOORbnUaU53Wu7FHizV6',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Staffan Norrga'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'staffan@norrga.com'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Staffan Norrga',
    'Medlem',
    email,
    '073-959 58 18',
    'Edelstam fastigheter AB',
    '14',
    'Sollentunavägen 63, 191 42 Sollentuna',
    'Lokalägare',
    NULL
  FROM auth.users 
  WHERE email = 'staffan@norrga.com'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Murat Kizil (info@simtel.se)
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
  )
  SELECT 
    'a46f88cb-a5ed-4807-83df-2a30a2296fd6',
    '00000000-0000-0000-0000-000000000000',
    'info@simtel.se',
    '$2a$10$W2KFelk5oW0zPAnK1dpk4ejjUNmcW/SfcjVkC6EqHVy/0AJO9Vyma',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Murat Kizil'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'info@simtel.se'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Murat Kizil',
    'Medlem',
    email,
    '070-452 12 72',
    'Simtel Elektronik och parabol',
    '29',
    'Almogevägen 6, 177 57 Järfälla',
    'Lokalägare',
    'https://www.simtel.se'
  FROM auth.users 
  WHERE email = 'info@simtel.se'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Gustaf Kimblad (info@otsab.com)
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
  )
  SELECT 
    '69275593-d8e0-48aa-99f8-79f1800daa24',
    '00000000-0000-0000-0000-000000000000',
    'info@otsab.com',
    '$2a$10$2ZtXvUFvHVhEovb/Xi/V..hEH/2LuQPUB1vEad1Firx6AEH8lK03O',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Gustaf Kimblad'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'info@otsab.com'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Gustaf Kimblad',
    'Medlem',
    email,
    '076 3216350',
    'On Target Solutions AB',
    '3, 4',
    'Slöjdvägen 25',
    'Medlem',
    'https://otsab.com/'
  FROM auth.users 
  WHERE email = 'info@otsab.com'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Andreas Wallgren (andreas@awallgrens.se)
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
  )
  SELECT 
    '405a9c16-31c9-45fd-a2dd-2893f3256f88',
    '00000000-0000-0000-0000-000000000000',
    'andreas@awallgrens.se',
    '$2a$10$zEgezy7ZKmST0PRMqz8yD.nHJNDfO/oD7y7Md3lyYGA8wftmjliOC',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Andreas Wallgren'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'andreas@awallgrens.se'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Andreas Wallgren',
    'Medlem',
    email,
    '070-378 87 88',
    'Wall Andreas',
    '5',
    'Sörlidsbacken 16a, 163 43 Spånga',
    'Lokalägare',
    'https://awallgrens.se/'
  FROM auth.users 
  WHERE email = 'andreas@awallgrens.se'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Morris Marouki (morris1974@hotmail.com)
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
  )
  SELECT 
    'bf58d0f1-8402-4a05-842c-6ff0ccc71388',
    '00000000-0000-0000-0000-000000000000',
    'morris1974@hotmail.com',
    '$2a$10$InLoqXxX5hlPDMBX9zrQueKs9tzlPACc7PtVL.Ssf.N0aq87MsQZG',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Morris Marouki'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'morris1974@hotmail.com'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Morris Marouki',
    'Medlem',
    email,
    '073-100 77 77',
    'Swenordic Fastighet i Stockholm AB',
    '12',
    'Skarprättarvägen 7, 176 77 Järfälla',
    'Lokalägare',
    'http://dreamauto.se/'
  FROM auth.users 
  WHERE email = 'morris1974@hotmail.com'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Mikael Wickström (conny.hjulfors@avs.se)
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
  )
  SELECT 
    '1070c202-6d8b-4f9f-96e4-0c1313632267',
    '00000000-0000-0000-0000-000000000000',
    'conny.hjulfors@avs.se',
    '$2a$10$uH.8eU/V6zVcY4E/ixLhgOXw0lpb8U8Vo4AHV4fcSTB0QbLQKvmDK',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Mikael Wickström'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'conny.hjulfors@avs.se'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Mikael Wickström',
    'Medlem',
    email,
    '070-207 53 40',
    'AVS i Sverige',
    '9',
    'Fabriksgatan 10, 570 80 Virserum',
    'Såld till AVS',
    'http://www.jagparts.nu/'
  FROM auth.users 
  WHERE email = 'conny.hjulfors@avs.se'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Alexander Krasar (alex2@kebco.eu)
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
  )
  SELECT 
    '4f754258-50f6-4b5c-b18f-7f519c24d5ad',
    '00000000-0000-0000-0000-000000000000',
    'alex2@kebco.eu',
    '$2a$10$ONylOsVjSjysENWvTA0DfelTh5SPGWMnIZjObLDeUUJbrvFIryKdW',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Alexander Krasar'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'alex2@kebco.eu'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Alexander Krasar',
    'Medlem',
    email,
    '070-777 21 11',
    'K fastighet AB',
    '20',
    'C/O Kebco AB, Skarprättarvägen 12E, 176 77 Järfälla',
    'Ordförande & Lokalägare',
    NULL
  FROM auth.users 
  WHERE email = 'alex2@kebco.eu'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Erik Dahlen (erik@yster.se)
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
  )
  SELECT 
    '04167fe6-bd87-4e18-926c-f3e1a130865b',
    '00000000-0000-0000-0000-000000000000',
    'erik@yster.se',
    '$2a$10$xHtoO.xzYvvK1xyWqpYhGeUQVr7EsKemjfz/FUWuAL1tN8m1Ht3v.',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Erik Dahlen'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'erik@yster.se'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Erik Dahlen',
    'Medlem',
    email,
    '073-7177773',
    'Yster Business Management',
    '13',
    'Patentgatan 9 112 67 Stockholm (Box 5883, 102 40 Stockholm)',
    'Lokalägare',
    'https://yster.se/'
  FROM auth.users 
  WHERE email = 'erik@yster.se'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Robar Halandal (mirtel@simtel.se)
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
  )
  SELECT 
    'b63ca889-c602-4a49-9820-78d375202198',
    '00000000-0000-0000-0000-000000000000',
    'mirtel@simtel.se',
    '$2a$10$Uxm3q8.Wc2vUwqUJj32IkOIraqmHXgMgufAuxScoKqKcHz.NMTjVa',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Robar Halandal'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'mirtel@simtel.se'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Robar Halandal',
    'Medlem',
    email,
    '0704521272',
    'Mirtel Multimedia',
    '2',
    'Allmogevägen 6, 177 57 Järfälla',
    'Styrelseledamot, ansvarig för hemsidan & Lokalägare',
    'https://simtel.se/'
  FROM auth.users 
  WHERE email = 'mirtel@simtel.se'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Simon Mc Mullen (simonkmcmullen@gmail.com)
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
  )
  SELECT 
    'e68b6147-f4db-4829-8ac0-18a55552406c',
    '00000000-0000-0000-0000-000000000000',
    'simonkmcmullen@gmail.com',
    '$2a$10$QbyLWkDMdeWPYv8pzxICK.UtA3nM8YI3lz6Tlewwn.dmWKk63olOK',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Simon Mc Mullen'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'simonkmcmullen@gmail.com'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Simon Mc Mullen',
    'Medlem',
    email,
    '070-554 00 83',
    'Pro Fastigheter',
    '15',
    'Box 2068, 194 02 Upplands-Väsby',
    'Lokalägare',
    'https://www.profast.nu/'
  FROM auth.users 
  WHERE email = 'simonkmcmullen@gmail.com'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Stefan Widlund (stefan@widlundsgolv.se)
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
  )
  SELECT 
    '27959d1a-4526-4d4b-a17c-45128a2e0e6f',
    '00000000-0000-0000-0000-000000000000',
    'stefan@widlundsgolv.se',
    '$2a$10$Sqh.1q1xmrObO6utDAinKeZ8U6aRfDJRisqWfKJxhLTyiu8P43yaC',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Stefan Widlund'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'stefan@widlundsgolv.se'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Stefan Widlund',
    'Medlem',
    email,
    '070-795 63 90',
    'Widlundsgolv och Bygg AB',
    '16, 17',
    'Ljungbackavägen 9, 175 68 Järfälla',
    'Lokalägare',
    'http://www.widlundsgolv.se/'
  FROM auth.users 
  WHERE email = 'stefan@widlundsgolv.se'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Twana Mirani (adrt@glowcar.se)
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
  )
  SELECT 
    '0481e212-1a12-470c-8863-317bf5d8da6e',
    '00000000-0000-0000-0000-000000000000',
    'adrt@glowcar.se',
    '$2a$10$tuid/yTjNPRFYTj0oZfcTuNMzDsv6b95yiFAdgV5lnHOqczX3DIQC',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Twana Mirani'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'adrt@glowcar.se'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Twana Mirani',
    'Medlem',
    email,
    '070-2017143',
    'Almare Fastighets Center AB',
    '18, 19',
    'Veddestavägen 24, 175 62 Järfälla',
    'Lokalägare',
    'https://www.autoexpressen.com/'
  FROM auth.users 
  WHERE email = 'adrt@glowcar.se'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Andreas Mattsson (camilla.sundman@kronmanmattsson.se)
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
  )
  SELECT 
    'a9d9768a-f9b0-402a-84ef-561fc231c736',
    '00000000-0000-0000-0000-000000000000',
    'camilla.sundman@kronmanmattsson.se',
    '$2a$10$qSCm.d1KXWiV6PfMlZHMF.xRQ2mdVDJgOlu0dW.Z4a1NjfagGdZ9y',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Andreas Mattsson'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'camilla.sundman@kronmanmattsson.se'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Andreas Mattsson',
    'Medlem',
    email,
    '076 80 78 700',
    'Kronman Mattsson Transport AB',
    '27',
    'Box 2068, 194 02 Upplands-Väsby',
    'Lokalägare',
    NULL
  FROM auth.users 
  WHERE email = 'camilla.sundman@kronmanmattsson.se'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Gunvald Boden (leifbodn@yahoo.com)
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
  )
  SELECT 
    '35d1c32c-7678-45c7-af5b-6d01561c059f',
    '00000000-0000-0000-0000-000000000000',
    'leifbodn@yahoo.com',
    '$2a$10$eQ5/q5r1YDKqLrzy2.HEeuDP98CD5TEK7dkXKmivCwgTD.UXAdQeK',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Gunvald Boden'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'leifbodn@yahoo.com'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Gunvald Boden',
    'Medlem',
    email,
    '076 39 30 696',
    'B:T Fastigheter AB',
    '21',
    'Box 2084 176 02 Järfälla',
    'Lokal ägare',
    NULL
  FROM auth.users 
  WHERE email = 'leifbodn@yahoo.com'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Rickard Holmlund (rickard@zipup.se)
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
  )
  SELECT 
    '21c9cb4f-4edf-45d5-8a01-85dfadc4769d',
    '00000000-0000-0000-0000-000000000000',
    'rickard@zipup.se',
    '$2a$10$7CFAHkVlmVCZynpADss6SuNAdWN4gJ5raLYrCoaiD44lwt1M3Ttt2',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Rickard Holmlund'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'rickard@zipup.se'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Rickard Holmlund',
    'Medlem',
    email,
    '070-838 09 15',
    'Zipup Svenska AB',
    '23, 24',
    'Ellen keys gata 22, 129 52 Hägersten',
    'Sekreterare & Lokalägare',
    'https://zipup.se/'
  FROM auth.users 
  WHERE email = 'rickard@zipup.se'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Martin Carlesund (martin.carlesund@hlm.com)
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
  )
  SELECT 
    '5d0c298e-43b7-47c0-8d15-53a2189483f1',
    '00000000-0000-0000-0000-000000000000',
    'martin.carlesund@hlm.com',
    '$2a$10$/T9fHFoykqy5bczrmrYpaOeFqrgprnzV.67BKt6E4tLeEV2jhrm8K',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Martin Carlesund'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'martin.carlesund@hlm.com'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Martin Carlesund',
    'Medlem',
    email,
    '070-867 04 67',
    'Företaget Martin Carlesund',
    '25',
    'Alnäsvägen 8, 170 78 Solna',
    'Lokalägare',
    'https://www.acroud.com/'
  FROM auth.users 
  WHERE email = 'martin.carlesund@hlm.com'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Stefan Grönqvist (stefan@polymerteknik.com)
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
  )
  SELECT 
    'b18bcde1-c3d8-4c3c-b99d-22a4583b9d6b',
    '00000000-0000-0000-0000-000000000000',
    'stefan@polymerteknik.com',
    '$2a$10$R0kV2Wku.lVT9zvDXBqNoe1jfXmvTAoMxgnjeEbCtPsdZ4m53hAe2',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Stefan Grönqvist'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'stefan@polymerteknik.com'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Stefan Grönqvist',
    'Medlem',
    email,
    '070-795 63 90',
    'Stockholm Polymerteknik AB',
    '26',
    'Skarprättarvägen 7, 176 77 Järfälla',
    'Lokalägare',
    'https://polymerteknik.com/'
  FROM auth.users 
  WHERE email = 'stefan@polymerteknik.com'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Lotta Ekström (lotta.ekstrom@bevarme.se)
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
  )
  SELECT 
    '6cc48a3c-b278-4a88-913a-e574540b8878',
    '00000000-0000-0000-0000-000000000000',
    'lotta.ekstrom@bevarme.se',
    '$2a$10$PGJlCakEChpoGZ2.k5.P2.O1T1aod/inv0ixW6WqfX3B0y7SIpMq.',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Lotta Ekström'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'lotta.ekstrom@bevarme.se'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Lotta Ekström',
    'Medlem',
    email,
    '070-570 52 45',
    'BE Värme & Sanitet AB',
    '28',
    'Box 2030, 176 02 Järfälla',
    'Lokalägare',
    'http://www.bevarme.se/'
  FROM auth.users 
  WHERE email = 'lotta.ekstrom@bevarme.se'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Lotta Oddbratt (info@jbrab.com)
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
  )
  SELECT 
    'e8112beb-3bb5-46ff-8c69-729fd2257640',
    '00000000-0000-0000-0000-000000000000',
    'info@jbrab.com',
    '$2a$10$ZDZz0Vdv9Zk1sT7SllqZkewr.LzQf9t78jNXyz/Aw7vvNKnSkMHzS',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Lotta Oddbratt'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'info@jbrab.com'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Lotta Oddbratt',
    'Medlem',
    email,
    '08-583 550 50',
    'JBR Fastighets AB',
    '30',
    'Skarprättarvägen 11, 176 77 Järfälla',
    'Viceordförande & Lokalägare',
    'https://badrumsrenovering.nu/'
  FROM auth.users 
  WHERE email = 'info@jbrab.com'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Gustaf Kimblad (gustaf@otsab.com)
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
  )
  SELECT 
    'ab050d13-52eb-45dc-8ed8-78baf7f82343',
    '00000000-0000-0000-0000-000000000000',
    'gustaf@otsab.com',
    '$2a$10$FXDaU2wmjiNSlE4c.poh0.gq/9bnKI.M3M895jiRTnNuPpQSgW78q',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Gustaf Kimblad'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'gustaf@otsab.com'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Gustaf Kimblad',
    'Medlem',
    email,
    '070-565 43 81',
    'Kimbladh Technology AB',
    '8',
    'Box 183, 177 23 Järfälla',
    'lokalägare',
    'https://www.otsab.com/'
  FROM auth.users 
  WHERE email = 'gustaf@otsab.com'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Mikael Wickström (mikael.wickstrom@avs.se)
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
  )
  SELECT 
    '3f6195d9-ab77-4002-b1ac-d8a79dd78ed8',
    '00000000-0000-0000-0000-000000000000',
    'mikael.wickstrom@avs.se',
    '$2a$10$55ufjLHzRlACBwyJUEnlzOXAbtSBrE2l8aunHxelMCetgcvcjVlAe',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Mikael Wickström'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'mikael.wickstrom@avs.se'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Mikael Wickström',
    'Medlem',
    email,
    '040-190070',
    'AVS i Sverige AB',
    '9, 10, 11',
    'skarprätarvägen 11',
    'lokal hyresgäst',
    'https://avs.se/'
  FROM auth.users 
  WHERE email = 'mikael.wickstrom@avs.se'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Kenneth Andersson (kenneth@kmjinvest.se)
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
  )
  SELECT 
    '8806fe56-361a-418f-a7c3-0e9741222aa2',
    '00000000-0000-0000-0000-000000000000',
    'kenneth@kmjinvest.se',
    '$2a$10$zFXhLhj5GoqU1MEyjCH8MuXBOh8pVayudnrIqR38Uh.alhtwuXlwe',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Kenneth Andersson'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'kenneth@kmjinvest.se'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Kenneth Andersson',
    'Medlem',
    email,
    '070-6204777',
    'KMJ Invest AB',
    '1',
    'Box 582  176 26 Järfälla',
    'Lokalägare',
    NULL
  FROM auth.users 
  WHERE email = 'kenneth@kmjinvest.se'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Lotta Ekström (info@bevarme.se)
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
  )
  SELECT 
    '65651406-b12a-4459-8b90-79566bcfbe37',
    '00000000-0000-0000-0000-000000000000',
    'info@bevarme.se',
    '$2a$10$LKDJ5qnrf8H3uGQ0gH6dVubbjrO.XhvgZ02Kqt4/9H2QR9Gkj8pyi',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Lotta Ekström'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'info@bevarme.se'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Lotta Ekström',
    'Administrator',
    email,
    NULL,
    'Be Värme Sanitet AB',
    '28',
    NULL,
    NULL,
    NULL
  FROM auth.users 
  WHERE email = 'info@bevarme.se'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Marcus Ramkvist (info@cmautoteknik.se)
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
  )
  SELECT 
    '8917f75f-9b30-4e22-8480-f8e38dae09bb',
    '00000000-0000-0000-0000-000000000000',
    'info@cmautoteknik.se',
    '$2a$10$vPZYOmc5ON1c.Rwd6REoreb3ErytHXI4BGZLQVFlOkjIolCeHYHWK',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Marcus Ramkvist'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'info@cmautoteknik.se'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Marcus Ramkvist',
    'Medlem',
    email,
    '0703663902',
    'CM Autoteknik',
    '6, 7',
    'Skarprättarvägen 7, lokal 6-7',
    'medlem',
    'https://cmautoteknik.se/'
  FROM auth.users 
  WHERE email = 'info@cmautoteknik.se'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Lottas Hyresgäst (niklas.rinne@ecoscandic.fi)
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
  )
  SELECT 
    '61b09924-9ae4-4335-a1fb-f5184ec0d463',
    '00000000-0000-0000-0000-000000000000',
    'niklas.rinne@ecoscandic.fi',
    '$2a$10$hI7NMaPylaJN0v9jzDH45.IRT0r3HHVS/rF88HhoCyqPI43MA3DHC',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Lottas Hyresgäst'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'niklas.rinne@ecoscandic.fi'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Lottas Hyresgäst',
    'Medlem',
    email,
    '+358407470746',
    'JBR',
    '30',
    'Skarrättarvägen 7',
    'Hyresgäst till Lotta',
    'https://www.ecoscandic.fi/sv/'
  FROM auth.users 
  WHERE email = 'niklas.rinne@ecoscandic.fi'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Murat (murat@simtel.se)
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
  )
  SELECT 
    '3c52f8ed-5cc1-4c55-a2c7-35cc8b5161da',
    '00000000-0000-0000-0000-000000000000',
    'murat@simtel.se',
    '$2a$10$L26Bi9AjadX8PM744iNG4OuFVv6Y7ZgnWOCmjtzhYtVPAfIl8DY1C',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Murat'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'murat@simtel.se'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Murat',
    'Administrator',
    email,
    '0739474777',
    NULL,
    NULL,
    'Skaprättarvägen 7, lokal 29',
    NULL,
    NULL
  FROM auth.users 
  WHERE email = 'murat@simtel.se'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Leif Mansor (leif_880@hotmail.com)
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
  )
  SELECT 
    'fb054f92-bf4d-420e-8bce-fcb346941ea4',
    '00000000-0000-0000-0000-000000000000',
    'leif_880@hotmail.com',
    '$2a$10$uL75WDkTZYOfMtnub9pMtuGAD4hbBnsFWaIRVcscttsXvPL57dNZ2',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Leif Mansor'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'leif_880@hotmail.com'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Leif Mansor',
    'Medlem',
    email,
    '0731011999',
    'LEIF Bilverkstad',
    '22',
    'Skarprättarv. 7 lokal 22',
    'Lokal ägare',
    NULL
  FROM auth.users 
  WHERE email = 'leif_880@hotmail.com'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: SmartKey (info@smartkeys.se)
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
  )
  SELECT 
    'f23ff92a-3674-49da-918b-62e8dcf61e00',
    '00000000-0000-0000-0000-000000000000',
    'info@smartkeys.se',
    '$2a$10$l0ogBpl/UTrvyMWdzayVe.QI85hAOJQ6uL9iIbI3T5fUU7rUh4Jze',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'SmartKey'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'info@smartkeys.se'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'SmartKey',
    'Medlem',
    email,
    '08852852',
    'SmartKey',
    '2',
    'Skarprättarv 7',
    'Hyresgäst',
    'https://smartkeys.se/'
  FROM auth.users 
  WHERE email = 'info@smartkeys.se'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

-- User: Test Medlem (sirin@post.com)
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
  )
  SELECT 
    '89823ae5-cf8b-431b-922d-dc6d74a04cbd',
    '00000000-0000-0000-0000-000000000000',
    'sirin@post.com',
    '$2a$10$woDiScmAZ2PNTYTL2rfRte69vIz.51eEhLGGUYOBW0qVxrIEaYhnW',
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', 'Test Medlem'),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    false,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'sirin@post.com'
  );

-- Set exact role and meta in public.profiles
INSERT INTO public.profiles (id, name, role, email, phone, company, unit, address, description, website)
  SELECT 
    id,
    'Test Medlem',
    'Medlem',
    email,
    '0701234567',
    'Oslo Helse og Omsorg AS',
    NULL,
    'Testgatan 1, 1234 Testad',
    'Test test',
    'https://test.com'
  FROM auth.users 
  WHERE email = 'sirin@post.com'
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    unit = EXCLUDED.unit,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    website = EXCLUDED.website;

COMMIT;
