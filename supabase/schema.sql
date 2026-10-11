-- ==========================================
-- BAYCON MOTION CMS: PAST CLIENTS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.past_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  company_or_niche TEXT,
  avatar_url TEXT,
  video_title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  embed_url TEXT,
  thumbnail_url TEXT,
  results_highlight TEXT,
  testimonial_quote TEXT,
  socials JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  sort_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.past_clients ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published clients
DROP POLICY IF EXISTS "Public can view published past clients" ON public.past_clients;
CREATE POLICY "Public can view published past clients"
  ON public.past_clients
  FOR SELECT
  USING (status = 'published');

-- Allow full access for authenticated/admin operations
DROP POLICY IF EXISTS "Admins have full access to past clients" ON public.past_clients;
CREATE POLICY "Admins have full access to past clients"
  ON public.past_clients
  FOR ALL
  USING (true)
  WITH CHECK (true);
