
-- Merchant bankers table for admin-managed content
CREATE TABLE public.merchant_bankers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('sme', 'mainboard')),
  location TEXT,
  sebi_registration TEXT,
  website TEXT,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  services TEXT,
  total_ipos INTEGER DEFAULT 0,
  established_year INTEGER,
  description TEXT,
  logo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.merchant_bankers ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Anyone can view active merchant bankers"
  ON public.merchant_bankers FOR SELECT
  USING (is_active = true);

-- Auth manage
CREATE POLICY "Auth users can manage merchant bankers"
  ON public.merchant_bankers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Seed data: SME bankers
INSERT INTO public.merchant_bankers (name, category, location, sebi_registration, website, total_ipos, established_year, description, services, sort_order) VALUES
('Pantomath Capital Advisors', 'sme', 'Mumbai', 'INM000012700', 'https://pantomathgroup.com', 85, 2013, 'Leading SME merchant banker with largest number of SME IPOs in India. Specializes in complete IPO lifecycle management.', 'SME IPO, Book Building, Market Making', 1),
('Hem Securities Ltd', 'sme', 'Delhi', 'INM000010835', NULL, 62, 1995, 'One of the oldest merchant banking firms in North India with deep expertise in SME listings on BSE SME and NSE Emerge.', 'SME IPO, Fixed Price Issue, Underwriting', 2),
('GYR Capital Advisors', 'sme', 'Mumbai', 'INM000013200', NULL, 35, 2018, 'Fast-growing merchant banking firm focused on mid-market SME companies across diverse sectors.', 'SME IPO, Pre-IPO Advisory, Valuation', 3),
('Beeline Capital Advisors', 'sme', 'Ahmedabad', 'INM000012800', NULL, 40, 2016, 'Gujarat-based merchant banker specializing in manufacturing and textile sector SME IPOs.', 'SME IPO, Rights Issue, Due Diligence', 4),
('Corpwis Advisors', 'sme', 'Mumbai', 'INM000013100', NULL, 28, 2019, 'Boutique merchant banking firm with focus on technology and services sector SME companies.', 'SME IPO, DRHP Preparation, Listing Advisory', 5),
('Expert Global Advisors', 'sme', 'Mumbai', 'INM000013000', NULL, 30, 2017, 'Specialized in cross-border SME transactions and export-oriented company listings.', 'SME IPO, Cross-border Advisory, Compliance', 6),
('Swastika Investmart', 'sme', 'Indore', 'INM000012500', NULL, 45, 2008, 'Central India based full-service financial firm with strong SME IPO advisory track record.', 'SME IPO, Broking, Research, Advisory', 7),
('Holani Consultants', 'sme', 'Indore', 'INM000012600', NULL, 38, 2010, 'Trusted merchant banker from MP region with expertise in agri and FMCG sector IPOs.', 'SME IPO, Merchant Banking, Corporate Advisory', 8),
('Sarthi Advisors', 'sme', 'Mumbai', 'INM000012900', NULL, 22, 2017, 'Client-focused merchant banking boutique helping promoters navigate the IPO journey efficiently.', 'SME IPO, Pre-IPO Placement, Market Making', 9),
('Fast Track Finsec', 'sme', 'Delhi', 'INM000012400', NULL, 55, 2006, 'Delhi-based merchant banker with one of the highest IPO completion rates in the SME segment.', 'SME IPO, Fixed Price, Book Building', 10);

-- Seed data: Mainboard bankers
INSERT INTO public.merchant_bankers (name, category, location, sebi_registration, website, total_ipos, established_year, description, services, sort_order) VALUES
('Kotak Mahindra Capital', 'mainboard', 'Mumbai', 'INM000008704', 'https://www.kotakmahindracapital.com', 200, 1996, 'India''s premier investment bank and one of the top lead managers for mainboard IPOs. Part of the Kotak Mahindra Group.', 'Mainboard IPO, QIP, OFS, M&A Advisory', 1),
('ICICI Securities', 'mainboard', 'Mumbai', 'INM000011179', 'https://www.icicisecurities.com', 180, 2008, 'Full-service investment banking arm of ICICI Group. Consistently ranked among top 3 BRLM in India.', 'Mainboard IPO, FPO, Rights Issue, Debt Syndication', 2),
('Axis Capital', 'mainboard', 'Mumbai', 'INM000012029', NULL, 150, 2010, 'Investment banking subsidiary of Axis Bank with strong institutional investor relationships.', 'Mainboard IPO, Block Deals, QIP, ECM', 3),
('JM Financial', 'mainboard', 'Mumbai', 'INM000010361', 'https://www.jmfl.com', 170, 1973, 'One of India''s oldest and most respected investment banks with over 50 years of capital markets experience.', 'IPO, M&A, Private Equity, Debt Capital Markets', 4),
('SBI Capital Markets', 'mainboard', 'Mumbai', 'INM000003531', 'https://www.sbicaps.com', 160, 1986, 'The investment banking arm of State Bank of India, India''s largest bank. Manages some of the biggest public issues.', 'Mainboard IPO, Government Disinvestments, Bond Issues', 5),
('IIFL Securities', 'mainboard', 'Mumbai', 'INM000010940', NULL, 90, 2005, 'Growing investment bank with strong retail and institutional distribution capability across India.', 'Mainboard IPO, SME IPO, QIP, OFS', 6),
('Edelweiss Financial', 'mainboard', 'Mumbai', 'INM000011003', NULL, 110, 2000, 'Diversified financial services group with a strong presence in equity capital markets and advisory.', 'IPO, Structured Finance, Wealth Management', 7),
('Motilal Oswal Investment', 'mainboard', 'Mumbai', 'INM000011005', NULL, 95, 1987, 'Well-known research-driven investment bank with expertise in mid-cap and large-cap IPOs.', 'Mainboard IPO, Institutional Equities, Research', 8),
('DAM Capital Advisors', 'mainboard', 'Mumbai', 'INM000011060', NULL, 70, 2019, 'Independent investment bank focused on delivering best-in-class ECM execution and advisory.', 'IPO, QIP, OFS, Block Deals, M&A', 9),
('Nuvama Wealth Management', 'mainboard', 'Mumbai', 'INM000010975', NULL, 80, 2022, 'Formerly Edelweiss Wealth, now independent — offers full spectrum of investment banking services.', 'Mainboard IPO, Wealth Advisory, Institutional Sales', 10);
