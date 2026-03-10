
-- Report Categories (admin can add unlimited categories like "Daily Reporter", "IPO Calendar", etc.)
CREATE TABLE public.report_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT 'FileText',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Report Items (entries within each category - companies/reports shown in table)
CREATE TABLE public.report_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.report_categories(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  logo_url TEXT,
  last_updated DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'Upcoming',
  status_color TEXT DEFAULT 'blue',
  estimated_amount TEXT,
  exchange TEXT,
  sector TEXT,
  description TEXT,
  drhp_link TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.report_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active report categories" ON public.report_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Auth users can manage report categories" ON public.report_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can view active report items" ON public.report_items FOR SELECT USING (is_active = true);
CREATE POLICY "Auth users can manage report items" ON public.report_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed some default categories
INSERT INTO public.report_categories (name, slug, description, icon, sort_order) VALUES
('Daily Reporter', 'daily-reporter', 'Daily IPO market reports with latest updates and analysis', 'FileText', 1),
('IPO Calendar', 'ipo-calendar', 'Complete calendar of upcoming and ongoing IPOs in India', 'Calendar', 2),
('Upcoming IPO Calendar', 'upcoming-ipo-calendar', 'Track upcoming Mainboard and SME IPOs in India with detailed information', 'Calendar', 3),
('Mainline IPO Report', 'mainline-ipo-report', 'Comprehensive reports on Mainboard IPOs with DRHP analysis', 'BarChart3', 4),
('SME IPO Report', 'sme-ipo-report', 'Detailed SME IPO reports with subscription data and analysis', 'TrendingUp', 5),
('SME IPOs by Sector', 'sme-ipos-by-sector', 'Sector-wise analysis of SME IPOs in India', 'PieChart', 6),
('Mainboard IPOs by Sector', 'mainboard-ipos-by-sector', 'Sector-wise analysis of Mainboard IPOs in India', 'PieChart', 7);
