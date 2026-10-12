-- ====================================================================
-- BAYCON MOTION: MASTER FIX FOR ALL VIDEO & CLOUD SYNC ISSUES
-- (Works table, Random Edit & Business Edit categories, Past Clients, RLS)
-- Run this ONCE in your Supabase Dashboard -> SQL Editor -> Run
-- ====================================================================

-- 1. Ensure work_category enum supports all custom categories
ALTER TYPE public.work_category ADD VALUE IF NOT EXISTS 'Random Edit';
ALTER TYPE public.work_category ADD VALUE IF NOT EXISTS 'Business Edit';

-- 2. Open up permissions on the works table for anon (matching contact_messages)
GRANT ALL ON public.works TO anon, authenticated;
GRANT ALL ON public.works TO service_role;
ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;

-- 3. Replace old admin-only RLS policies on works with open policy
DROP POLICY IF EXISTS "Published works viewable by everyone" ON public.works;
DROP POLICY IF EXISTS "Admins can insert works" ON public.works;
DROP POLICY IF EXISTS "Admins can update works" ON public.works;
DROP POLICY IF EXISTS "Admins can delete works" ON public.works;
DROP POLICY IF EXISTS "Public can manage works" ON public.works;

CREATE POLICY "Public can manage works"
  ON public.works FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Open up permissions on client_reviews
GRANT ALL ON public.client_reviews TO anon, authenticated;
GRANT ALL ON public.client_reviews TO service_role;
ALTER TABLE public.client_reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can manage client_reviews" ON public.client_reviews;

CREATE POLICY "Public can manage client_reviews"
  ON public.client_reviews FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Delete the 2 old demo videos from works table so they don't pollute the portfolio
DELETE FROM public.works WHERE id IN ('ef2cd025-d964-489c-8e6b-bf0b39f724e6', 'c6d6ecfb-42ae-4905-a8a2-c6df14c6940c');
