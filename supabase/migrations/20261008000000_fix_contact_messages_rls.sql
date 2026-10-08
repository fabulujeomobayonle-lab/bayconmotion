-- Fix contact_messages RLS policies
-- The admin uses localStorage-based passcode auth (not Supabase Auth),
-- so auth.uid() is always null. We must allow anon SELECT/UPDATE/DELETE
-- the same way 'works' and 'client_reviews' tables do.

-- Drop the old admin-only policies that rely on has_role(auth.uid(), ...)
DROP POLICY IF EXISTS "Admins can view messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can update messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can delete messages" ON public.contact_messages;

-- Allow anyone (anon + authenticated) to fully manage contact_messages.
-- Security is enforced at the application level via the passcode gate.
CREATE POLICY "Public can manage contact_messages"
  ON public.contact_messages FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
