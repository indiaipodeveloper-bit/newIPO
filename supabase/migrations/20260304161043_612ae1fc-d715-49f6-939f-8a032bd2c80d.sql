
-- Notification PDFs for SEBI circulars etc.
CREATE TABLE public.notification_pdfs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  pdf_url TEXT,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notification_pdfs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active notification pdfs" ON public.notification_pdfs FOR SELECT USING (is_active = true);
CREATE POLICY "Auth users can manage notification pdfs" ON public.notification_pdfs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed with existing notification items
INSERT INTO public.notification_pdfs (title, slug, sort_order) VALUES
('SEBI ICDR Amendment Regulations', 'sebi-icdr-amendments', 1),
('SEBI SME IPO ICDR Amendments', 'sebi-sme-icdr-amendments', 2),
('ICDR', 'icdr', 3),
('BSE SME Eligibility Criteria', 'bse-sme-eligibility', 4),
('NSE Emerge Eligibility Criteria', 'nse-emerge-eligibility', 5);

-- Create storage bucket for notification PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('notifications', 'notifications', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view notification files" ON storage.objects FOR SELECT USING (bucket_id = 'notifications');
CREATE POLICY "Auth users can upload notification files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'notifications');
CREATE POLICY "Auth users can update notification files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'notifications');
CREATE POLICY "Auth users can delete notification files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'notifications');
