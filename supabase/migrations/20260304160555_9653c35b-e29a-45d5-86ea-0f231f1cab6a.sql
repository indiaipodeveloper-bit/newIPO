
-- Knowledge Categories (IPO Process, IPO Registrar, SEBI Notifications, etc.)
CREATE TABLE public.knowledge_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT 'BookOpen',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Knowledge Items (entries within each category)
CREATE TABLE public.knowledge_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.knowledge_categories(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  col1 TEXT,
  col2 TEXT,
  col3 TEXT,
  col4 TEXT,
  col5 TEXT,
  col6 TEXT,
  link TEXT,
  location TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.knowledge_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active knowledge categories" ON public.knowledge_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Auth users can manage knowledge categories" ON public.knowledge_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can view active knowledge items" ON public.knowledge_items FOR SELECT USING (is_active = true);
CREATE POLICY "Auth users can manage knowledge items" ON public.knowledge_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed categories matching header links
INSERT INTO public.knowledge_categories (name, slug, description, icon, sort_order) VALUES
('IPO World Magazine', 'ipo-world-magazine', 'IndiaIPO exclusive IPO World Magazine with in-depth analysis, expert interviews, and market insights.', 'BookOpen', 1),
('IPO Process', 'ipo-process', 'Complete step-by-step guide to the IPO process from capital planning and DRHP to listing and life after IPO.', 'FileText', 2),
('Pre-IPO Process Guidance', 'pre-ipo-process', 'What companies need to do before filing for an IPO — from compliance to financial restructuring.', 'FileText', 3),
('Sector Wise IPO List In India', 'sector-wise-ipo-list', 'Browse IPOs categorized by industry sector for better investment analysis and market understanding.', 'BarChart3', 4),
('List of IPO Registrar', 'ipo-registrar-list', 'At India IPO, we hand-hold Founders, Businessmen, Entrepreneurs, MSMEs and startups through the complete IPO journey, from capital planning and DRHP to listing and life after IPO.', 'FileText', 5),
('SEBI ICDR Amendment Regulations', 'sebi-icdr-amendments', 'Latest SEBI ICDR Amendment Regulations and their impact on IPO processes in India.', 'Scale', 6),
('SEBI SME IPO ICDR Amendments', 'sebi-sme-icdr-amendments', 'SEBI SME IPO ICDR Amendments Report with detailed analysis of regulatory changes.', 'Scale', 7),
('ICDR', 'icdr', 'Issue of Capital and Disclosure Requirements — complete regulatory framework for IPOs.', 'Scale', 8),
('BSE SME Eligibility Criteria', 'bse-sme-eligibility', 'Complete eligibility criteria for companies looking to list on BSE SME platform.', 'Scale', 9),
('NSE Emerge Eligibility Criteria', 'nse-emerge-eligibility', 'Complete eligibility criteria for companies looking to list on NSE Emerge platform.', 'Scale', 10);
