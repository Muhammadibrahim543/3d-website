-- ============================================================================
-- KIRA'S CREATION SOFT-3D STUDIO - SUPABASE POSTGRESQL SCHEMA
-- Execute this script in the Supabase SQL Editor (https://app.supabase.com)
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER PROFILES TABLE (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    avatar_id TEXT DEFAULT 'av_robo',
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    title_en TEXT NOT NULL,
    title_bn TEXT,
    category TEXT DEFAULT 'general',
    price NUMERIC(10, 2) NOT NULL,
    old_price NUMERIC(10, 2),
    specs TEXT,
    description_en TEXT,
    description_bn TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Product Policies: Everyone can read active products, only admins can modify
CREATE POLICY "Products are viewable by everyone" 
    ON public.products FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can insert products" 
    ON public.products FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can update products" 
    ON public.products FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can delete products" 
    ON public.products FOR DELETE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY DEFAULT ('ORD-' || to_char(now(), 'YYMMDD') || '-' || substr(md5(random()::text), 1, 4)),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    notes TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    custom_3d_specs JSONB DEFAULT NULL,
    model_file_url TEXT,
    subtotal NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'printing', 'shipped', 'delivered', 'cancelled')),
    payment_method TEXT DEFAULT 'cod',
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Orders Policies:
-- 1. Anyone (including guests) can create an order
CREATE POLICY "Anyone can insert orders" 
    ON public.orders FOR INSERT WITH CHECK (true);

-- 2. Customers can view their own orders
CREATE POLICY "Users can view own orders" 
    ON public.orders FOR SELECT USING (
        auth.uid() = user_id OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 3. Admins can update orders
CREATE POLICY "Admins can update any order" 
    ON public.orders FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 5. STORAGE BUCKET FOR 3D PRINT FILES (STL / 3MF)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('custom-3d-models', 'custom-3d-models', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Anyone can upload a 3D model for custom order
CREATE POLICY "Anyone can upload 3D models"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'custom-3d-models');

-- Storage Policy: Public download link for custom 3D models
CREATE POLICY "3D models are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'custom-3d-models');

-- 6. AUTOMATIC TRIGGER FOR NEW AUTH USERS -> PROFILES
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'customer')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
