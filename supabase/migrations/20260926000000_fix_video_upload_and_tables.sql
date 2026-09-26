-- Fix Video Upload & Storage Buckets, plus RLS Policies for Custom Passcode Admin

-- 1. Add new category values to work_category enum if missing
ALTER TYPE public.work_category ADD VALUE IF NOT EXISTS 'Random Edit';
ALTER TYPE public.work_category ADD VALUE IF NOT EXISTS 'Business Edit';

-- 2. Ensure storage buckets exist and are marked public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('works-videos', 'works-videos', true, 524288000, ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska', 'video/avi']),
  ('works-thumbnails', 'works-thumbnails', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'])
ON CONFLICT (id) DO UPDATE 
SET public = true;

-- 3. Drop old restrictive storage policies
DROP POLICY IF EXISTS "Admins read works files" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload works files" ON storage.objects;
DROP POLICY IF EXISTS "Admins update works files" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete works files" ON storage.objects;
DROP POLICY IF EXISTS "Public read works files" ON storage.objects;
DROP POLICY IF EXISTS "Public upload works files" ON storage.objects;
DROP POLICY IF EXISTS "Public update works files" ON storage.objects;
DROP POLICY IF EXISTS "Public delete works files" ON storage.objects;

-- 4. Create storage policies for works-videos and works-thumbnails
CREATE POLICY "Public read works files"
ON storage.objects FOR SELECT TO public
USING (bucket_id IN ('works-videos', 'works-thumbnails'));

CREATE POLICY "Public upload works files"
ON storage.objects FOR INSERT TO public
WITH CHECK (bucket_id IN ('works-videos', 'works-thumbnails'));

CREATE POLICY "Public update works files"
ON storage.objects FOR UPDATE TO public
USING (bucket_id IN ('works-videos', 'works-thumbnails'));

CREATE POLICY "Public delete works files"
ON storage.objects FOR DELETE TO public
USING (bucket_id IN ('works-videos', 'works-thumbnails'));

-- 5. Ensure client_reviews table exists
CREATE TABLE IF NOT EXISTS public.client_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_role TEXT,
  project_title TEXT,
  quote TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  status public.work_status NOT NULL DEFAULT 'draft',
  embed_url TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_reviews TO anon, authenticated;
GRANT ALL ON public.client_reviews TO service_role;
ALTER TABLE public.client_reviews ENABLE ROW LEVEL SECURITY;

-- 6. Update RLS policies on works and client_reviews to allow management by passcode-authenticated admin (anon client)
DROP POLICY IF EXISTS "Published works viewable by everyone" ON public.works;
DROP POLICY IF EXISTS "Admins can insert works" ON public.works;
DROP POLICY IF EXISTS "Admins can update works" ON public.works;
DROP POLICY IF EXISTS "Admins can delete works" ON public.works;
DROP POLICY IF EXISTS "Public can manage works" ON public.works;
CREATE POLICY "Public can manage works" ON public.works FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can manage client_reviews" ON public.client_reviews;
CREATE POLICY "Public can manage client_reviews" ON public.client_reviews FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
