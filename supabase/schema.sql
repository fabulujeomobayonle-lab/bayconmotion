-- ====================================================================
-- BAYCON MOTION CMS: PAST CLIENTS TABLE & RLS POLICIES
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.past_clients (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  client_name TEXT NOT NULL,
  company_or_niche TEXT,
  avatar_url TEXT,
  video_title TEXT,
  video_url TEXT,
  video_urls JSONB DEFAULT '[]'::jsonb,
  embed_url TEXT,
  thumbnail_url TEXT,
  results_highlight TEXT,
  testimonial_quote TEXT,
  socials JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'published',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure all columns exist
ALTER TABLE public.past_clients ADD COLUMN IF NOT EXISTS video_urls JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.past_clients ADD COLUMN IF NOT EXISTS socials JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.past_clients ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE public.past_clients ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE public.past_clients ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Grant full permissions
GRANT ALL ON public.past_clients TO anon, authenticated;
GRANT ALL ON public.past_clients TO service_role;

-- Enable Row Level Security
ALTER TABLE public.past_clients ENABLE ROW LEVEL SECURITY;

-- Drop old policies if any
DROP POLICY IF EXISTS "Public can view published past clients" ON public.past_clients;
DROP POLICY IF EXISTS "Public can manage past_clients" ON public.past_clients;
DROP POLICY IF EXISTS "Admins have full access to past clients" ON public.past_clients;

-- Allow full manage access for passcode admin & visitors
CREATE POLICY "Public can manage past_clients"
  ON public.past_clients FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
