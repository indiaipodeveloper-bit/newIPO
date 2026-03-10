
-- Create leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public contact form)
CREATE POLICY "Anyone can submit a lead"
  ON public.leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users can view leads
CREATE POLICY "Auth users can view leads"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated users can update leads (mark as read)
CREATE POLICY "Auth users can update leads"
  ON public.leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users can delete leads
CREATE POLICY "Auth users can delete leads"
  ON public.leads
  FOR DELETE
  TO authenticated
  USING (true);

-- Enable realtime for leads
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
