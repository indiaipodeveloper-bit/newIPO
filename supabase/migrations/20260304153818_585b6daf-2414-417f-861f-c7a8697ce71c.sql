
-- Allow authenticated users to insert, update, delete banners (admin actions done via mock auth for now)
CREATE POLICY "Auth users can manage banners"
  ON public.hero_banners FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
