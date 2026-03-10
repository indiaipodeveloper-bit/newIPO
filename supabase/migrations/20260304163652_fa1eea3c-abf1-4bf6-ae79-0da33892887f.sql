
CREATE TABLE public.ipo_videos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  youtube_id text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.ipo_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active videos" ON public.ipo_videos
  FOR SELECT USING (is_active = true);

CREATE POLICY "Auth users can manage videos" ON public.ipo_videos
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
