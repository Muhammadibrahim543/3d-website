-- Run in the active project's Supabase SQL Editor after the website account
-- jannah80assad@gmail.com has signed up and confirmed its email.
-- This script grants only the explicitly requested owner account the admin role.
BEGIN;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM auth.users
        WHERE lower(email) = 'jannah80assad@gmail.com' AND email_confirmed_at IS NOT NULL
    ) THEN
        RAISE EXCEPTION 'First sign up and confirm jannah80assad@gmail.com on the website, then run this script again.';
    END IF;
END;
$$;

INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', 'Studio Admin'), 'admin'
FROM auth.users WHERE lower(email) = 'jannah80assad@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Customers may edit contact details but cannot give themselves an admin role.
REVOKE UPDATE ON public.profiles FROM PUBLIC, anon, authenticated;
GRANT UPDATE (full_name, phone, avatar_id, updated_at) ON public.profiles TO authenticated;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, phone, role)
    VALUES (NEW.id, NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''), 'customer');
    RETURN NEW;
END;
$$;

COMMIT;
