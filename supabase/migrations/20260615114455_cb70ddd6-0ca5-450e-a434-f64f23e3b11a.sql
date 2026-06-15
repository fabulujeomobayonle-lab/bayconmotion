
-- Tighten SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO anon, authenticated;

-- Storage policies for admin-managed buckets
CREATE POLICY "Admins read works files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id IN ('works-videos','works-thumbnails') AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins upload works files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id IN ('works-videos','works-thumbnails') AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins update works files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id IN ('works-videos','works-thumbnails') AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins delete works files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id IN ('works-videos','works-thumbnails') AND public.has_role(auth.uid(),'admin'));
