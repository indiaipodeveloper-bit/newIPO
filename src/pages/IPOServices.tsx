import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { motion, type Variants, type Easing } from "framer-motion";
import {
  Building2, TrendingUp, BarChart3, Wallet, CheckCircle,
  ArrowRight, Phone, Mail, ChevronDown, ChevronUp,
  Shield, Clock, Users, Star, Target, Zap, Home,
  FileText, Award, BookOpen, Globe, DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── Animation helpers ─── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: "easeOut" as Easing },
  }),
};

/* ─── Data layer ─── */
const stats = [
  { value: "500+", label: "IPOs Advised", icon: TrendingUp },
  { value: "₹25,000 Cr+", label: "Capital Raised", icon: DollarSign },
  { value: "18+", label: "Years Experience", icon: Award },
  { value: "98%", label: "Success Rate", icon: Star },
];

const services = [
  {
    id: "ipo",
    badge: "Most Popular",
    title: "Initial Public Offering (IPO)",
    shortTitle: "IPO",
    icon: TrendingUp,
    color: "#1a56db",
    gradient: "from-[#001529] to-[#003380]",
    tagline: "List your company on NSE/BSE Mainboard",
    description:
      "An IPO is the process by which a private company offers shares to the public for the first time to raise capital. Our end-to-end advisory covers every critical milestone — from feasibility to post-listing compliance — ensuring a seamless, SEBI-compliant public offering.",
    eligibility: [
      { criteria: "Net Worth", requirement: "Minimum ₹1 Crore (post-issue)" },
      { criteria: "Track Record", requirement: "3 years of profitable operations" },
      { criteria: "Issue Size", requirement: "Minimum ₹10 Crore" },
      { criteria: "Exchange", requirement: "NSE / BSE Mainboard" },
      { criteria: "DRHP Filing", requirement: "Mandatory with SEBI" },
      { criteria: "Promoter Lock-in", requirement: "18 months post-listing" },
    ],
    process: [
      { step: 1, title: "Feasibility Study", desc: "Capital needs & IPO readiness assessment" },
      { step: 2, title: "DRHP Preparation", desc: "Draft Red Herring Prospectus with all disclosures" },
      { step: 3, title: "SEBI Filing & Review", desc: "Regulatory approval & observation letter" },
      { step: 4, title: "Roadshows", desc: "Institutional & HNI investor outreach" },
      { step: 5, title: "Book Building", desc: "Price discovery via bidding mechanism" },
      { step: 6, title: "Allotment & Listing", desc: "Basis of allotment & stock exchange listing" },
    ],
    benefits: [
      "Access to broad capital markets",
      "Enhanced brand credibility & visibility",
      "Liquidity for existing shareholders",
      "Enables future M&A via stock-based deals",
      "Employee stock option programs (ESOPs)",
      "Improved PE/VC exit opportunities",
    ],
    timeline: "9–18 months",
    minInvestment: "₹10 Cr (Issue Size)",
  },
  {
    id: "sme-ipo",
    badge: "SME Friendly",
    title: "SME IPO Consultation",
    shortTitle: "SME IPO",
    icon: Building2,
    color: "#f59e08",
    gradient: "from-[#78340a] to-[#b45309]",
    tagline: "List on BSE SME or NSE Emerge platform",
    description:
      "The SME IPO platform is specifically designed for Small & Medium Enterprises. With relaxed eligibility norms and a streamlined approval process, SME IPO is the fastest way to tap public capital markets, build brand recognition, and enhance your company's growth trajectory.",
    eligibility: [
      { criteria: "Post-Issue Paid-up Capital", requirement: "₹1 Cr – ₹25 Cr" },
      { criteria: "Net Tangible Assets", requirement: "Minimum ₹1.5 Crore" },
      { criteria: "Net Worth", requirement: "Positive Net Worth" },
      { criteria: "Distributable Profits", requirement: "2 of last 3 years" },
      { criteria: "Exchange", requirement: "BSE SME / NSE Emerge" },
      { criteria: "Market Maker", requirement: "Mandatory appointment" },
    ],
    process: [
      { step: 1, title: "Eligibility Check", desc: "Assess financials against platform norms" },
      { step: 2, title: "Due Diligence", desc: "Statutory & legal review of company" },
      { step: 3, title: "Banker Coordination", desc: "SEBI-registered merchant banker appointment" },
      { step: 4, title: "Exchange Filing", desc: "BSE SME / NSE Emerge in-principle approval" },
      { step: 5, title: "Marketing & Roadshows", desc: "Investor targeting & subscription campaign" },
      { step: 6, title: "Listing Support", desc: "Allotment, refunds, and exchange listing" },
    ],
    benefits: [
      "Lower listing requirements vs. Mainboard",
      "Faster process — 4 to 6 months",
      "Market maker ensures liquidity",
      "Tax benefits for QIB investors",
      "Stepping stone to Mainboard migration",
      "Enhanced credibility for B2B deals",
    ],
    timeline: "4–6 months",
    minInvestment: "₹1 Cr (Paid-up Capital)",
  },
  {
    id: "mainline-ipo",
    badge: "Large Scale",
    title: "Mainline IPO Consultation",
    shortTitle: "Mainline IPO",
    icon: Globe,
    color: "#10b981",
    gradient: "from-[#064e3b] to-[#065f46]",
    tagline: "Full-scale public listing on NSE/BSE Mainboard",
    description:
      "Mainline IPO is for established companies targeting large-scale capital raising on the NSE or BSE Mainboard. Our team of SEBI-registered professionals manages the entire lifecycle — from DRHP to post-listing ongoing compliance — with precision and expertise that comes from decades of deal experience.",
    eligibility: [
      { criteria: "Net Tangible Assets", requirement: "Minimum ₹3 Crore (each of 3 years)" },
      { criteria: "Distributable Profits", requirement: "3 out of last 5 years (alt. route)" },
      { criteria: "Net Worth", requirement: "Minimum ₹1 Crore (each of 3 years)" },
      { criteria: "Issue Size", requirement: "Typically ₹50 Crore+" },
      { criteria: "IPO Application Size", requirement: "Minimum ₹10,000 per application" },
      { criteria: "Promoter Lock-in", requirement: "3 years for 20% post-issue capital" },
    ],
    process: [
      { step: 1, title: "Valuation & Structuring", desc: "Independent valuation & capital structure optimization" },
      { step: 2, title: "DRHP Drafting", desc: "Comprehensive SEBI draft prospectus" },
      { step: 3, title: "SEBI Review", desc: "SEBI comments, clarifications & observation letter" },
      { step: 4, title: "Exchange Filing", desc: "NSE/BSE in-principle listing approval" },
      { step: 5, title: "Institutional Roadshows", desc: "FII, DII, MF, and HNI outreach" },
      { step: 6, title: "Book-Building & Listing", desc: "Price band, GMP, subscriptions & listing" },
    ],
    benefits: [
      "Institutional investor access (FII, DII, MF)",
      "High public market liquidity",
      "Significant valuation upside",
      "National brand recognition",
      "ESOP and M&A currency creation",
      "Ongoing analyst coverage",
    ],
    timeline: "12–24 months",
    minInvestment: "₹50 Cr+ (Issue Size)",
  },
  {
    id: "fpo",
    badge: "For Listed Cos.",
    title: "Follow-On Public Offer (FPO)",
    shortTitle: "FPO",
    icon: BarChart3,
    color: "#8b5cf6",
    gradient: "from-[#2e1065] to-[#4c1d95]",
    tagline: "Secondary capital raise for listed companies",
    description:
      "A Follow-On Public Offer (FPO) allows an already-listed company to raise additional equity capital from the public. Whether for expansion, debt reduction, or improving public float, our FPO advisory ensures optimal pricing, regulatory compliance, and maximum subscription success.",
    eligibility: [
      { criteria: "Company Status", requirement: "Must be listed on NSE/BSE" },
      { criteria: "Listed History", requirement: "Minimum 1 year of listing required" },
      { criteria: "FPO Type", requirement: "Dilutive (fresh issue) or Non-Dilutive (OFS)" },
      { criteria: "Shareholder Approval", requirement: "Ordinary/Special resolution required" },
      { criteria: "Pricing", requirement: "As per SEBI ICDR Regulations" },
      { criteria: "SEBI Filing", requirement: "DRHP submission mandatory" },
    ],
    process: [
      { step: 1, title: "Capital Need Assessment", desc: "Determine purpose, size & FPO structure" },
      { step: 2, title: "Board Approvals", desc: "Board, shareholder & regulatory approvals" },
      { step: 3, title: "Pricing Strategy", desc: "Determine floor price or price band" },
      { step: 4, title: "SEBI Filing", desc: "Draft prospectus, SEBI review & approval" },
      { step: 5, title: "Offer Execution", desc: "Subscription management & allotment" },
      { step: 6, title: "Post-Issue Compliance", desc: "Listing, refunds & compliance filings" },
    ],
    benefits: [
      "Efficient secondary capital raise",
      "Improved public float & liquidity",
      "Strengthen balance sheet",
      "Reduce promoter/bank debt",
      "Re-rate company valuation",
      "Non-dilutive OFS option available",
    ],
    timeline: "4–8 months",
    minInvestment: "Already listed company",
  },
  {
    id: "pre-ipo",
    badge: "Pre-Listing",
    title: "Pre-IPO Funding Consultants",
    shortTitle: "Pre-IPO",
    icon: Wallet,
    color: "#ef4444",
    gradient: "from-[#7f1d1d] to-[#991b1b]",
    tagline: "Unlock capital before your IPO launch",
    description:
      "Pre-IPO funding allows companies to raise capital from institutional investors, HNIs, family offices, and strategic partners before listing publicly. We help you discover optimal pre-IPO valuation, structure the round efficiently, and bring on board investors who add both capital and strategic value.",
    eligibility: [
      { criteria: "Company Stage", requirement: "Growth-stage or Pre-IPO ready" },
      { criteria: "Revenue", requirement: "Consistent revenue model preferred" },
      { criteria: "IPO Intent", requirement: "Clear 12–36 month IPO timeline" },
      { criteria: "Investor Type", requirement: "PE, VC, HNI, Family Offices, Angels" },
      { criteria: "Instrument", requirement: "Equity, CCD, CCPS, or Warrants" },
      { criteria: "Compliance", requirement: "As per Companies Act 2013 & FEMA" },
    ],
    process: [
      { step: 1, title: "Company Profiling", desc: "Deep-dive into business model & financials" },
      { step: 2, title: "Valuation Discovery", desc: "Pre-IPO valuation benchmarking" },
      { step: 3, title: "Investor Identification", desc: "Target investor pool mapping" },
      { step: 4, title: "Pitch Deck & Data Room", desc: "Investment material preparation" },
      { step: 5, title: "Term Sheet & Negotiation", desc: "Deal structure & term negotiation" },
      { step: 6, title: "Due Diligence & Closure", desc: "Legal/financial DD & investment closure" },
    ],
    benefits: [
      "Early capital without public market pressure",
      "Strategic investor alignment",
      "Valuation benchmarking before IPO",
      "Strengthens IPO prospectus narrative",
      "Reduces dependence on IPO market window",
      "Flexible instrument structuring",
    ],
    timeline: "2–6 months",
    minInvestment: "Investor-specific (₹25 Lakh+)",
  },
];

const whyChooseUs = [
  { icon: Shield, title: "SEBI Registered Advisors", desc: "All our merchant bankers & advisors are SEBI-registered category-I professionals with unimpeachable compliance records." },
  { icon: Clock, title: "End-to-End Management", desc: "From initial feasibility to post-listing compliance, we manage everything — you focus on running your business." },
  { icon: Users, title: "Dedicated Deal Team", desc: "A dedicated team of senior bankers, legal experts, and CA professionals assigned to your deal from day one." },
  { icon: Star, title: "Proven Track Record", desc: "500+ successful IPOs across SME and Mainboard categories spanning 18+ years and every major industry sector." },
  { icon: Target, title: "Investor Network", desc: "Deep relationships with major institutional investors, mutual funds, HNIs, and retail investor networks across India." },
  { icon: Zap, title: "Timeline Mastery", desc: "Our streamlined process models ensure fastest possible SEBI timelines without compromising regulatory quality." },
];

const faqs = [
  { q: "What is the difference between SME IPO and Mainline IPO?", a: "SME IPO is for companies with post-issue paid-up capital between ₹1–25 Cr, listed on BSE SME or NSE Emerge. Mainline IPO is for larger companies listing on NSE/BSE main board with higher eligibility requirements and larger issue sizes." },
  { q: "How long does the entire IPO process take?", a: "SME IPO typically takes 4–6 months. A Mainline IPO usually takes 9–18 months from start to listing. Pre-IPO funding can be completed in 2–6 months depending on investor readiness." },
  { q: "What are the typical costs involved in an IPO?", a: "IPO costs include merchant banker fees (1–2% of issue size), legal fees, registrar charges, stock exchange fees, SEBI filing fees, advertising, and roadshow expenses. We provide a detailed cost breakdown specific to your company." },
  { q: "Can an SME company later migrate to the Mainboard?", a: "Yes. After at least 2 years of listing on BSE SME or NSE Emerge, companies meeting Mainboard eligibility criteria can migrate through a simplified process without another public offering." },
  { q: "What is a Follow-On Public Offer (FPO)?", a: "An FPO is a mechanism for an already-listed company to issue additional shares to the public. It can be dilutive (fresh issue) or non-dilutive (Offer for Sale by existing shareholders)." },
  { q: "Why do companies opt for Pre-IPO funding?", a: "Pre-IPO funding helps companies raise capital at favorable valuations before listing, bring in strategic investors, strengthen their balance sheet, and build a credible investor base that supports the IPO narrative." },
];

/* ─── Sub-components ─── */
const StatCard = ({ value, label, icon: Icon, index }: any) => (
  <motion.div
    custom={index}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={fadeUp}
    className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6 text-center group hover:bg-white/15 transition-all"
  >
    <div className="w-12 h-12 rounded-xl bg-[#f59e08]/20 flex items-center justify-center mx-auto mb-3">
      <Icon className="h-6 w-6 text-[#f59e08]" />
    </div>
    <div className="text-3xl font-black text-white mb-1">{value}</div>
    <div className="text-white/60 text-sm font-semibold">{label}</div>
  </motion.div>
);

const ServiceSection = ({ svc, index }: { svc: typeof services[0]; index: number }) => {
  const isEven = index % 2 === 0;
  const Icon = svc.icon;

  return (
    <motion.section
      id={svc.id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      className="scroll-mt-24"
    >
      {/* Section header */}
      <div className={`rounded-3xl overflow-hidden mb-8 bg-gradient-to-r ${svc.gradient}`}>
        <div className="p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
            <Icon className="h-10 w-10 text-white" />
          </div>
          <div className="flex-1">
            <span
              className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2"
              style={{ background: svc.color + "30", color: svc.color === "#f59e08" ? "#f59e08" : "#fff", border: `1px solid ${svc.color}40` }}
            >
              {svc.badge}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2">{svc.title}</h2>
            <p className="text-white/60 text-base font-medium">{svc.tagline}</p>
          </div>
          <div className="shrink-0 hidden lg:flex flex-col gap-2 text-right">
            <div className="text-xs text-white/40 uppercase tracking-widest font-bold">Timeline</div>
            <div className="text-2xl font-black text-white">{svc.timeline}</div>
            <div className="text-xs text-white/40 uppercase tracking-widest font-bold mt-1">Min. Requirement</div>
            <div className="text-sm font-bold text-[#f59e08]">{svc.minInvestment}</div>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-600 text-base leading-relaxed mb-10 max-w-4xl font-medium">{svc.description}</p>

      {/* Three-column layout: Table + Process + Benefits */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">

        {/* Eligibility Table */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3" style={{ background: svc.color + "08" }}>
            <FileText className="h-5 w-5" style={{ color: svc.color }} />
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Eligibility Criteria</h3>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {svc.eligibility.map((row, i) => (
                <tr key={i} className={`border-b border-slate-50 last:border-0 ${i % 2 === 0 ? "bg-slate-50/40" : "bg-white"}`}>
                  <td className="px-5 py-3.5 font-bold text-slate-700 w-2/5 align-top">{row.criteria}</td>
                  <td className="px-5 py-3.5 text-slate-500 font-medium">{row.requirement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Process Steps */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3" style={{ background: svc.color + "08" }}>
            <BookOpen className="h-5 w-5" style={{ color: svc.color }} />
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Step-by-Step Process</h3>
          </div>
          <div className="p-5 space-y-4">
            {svc.process.map((p, i) => (
              <div key={i} className="flex items-start gap-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 mt-0.5"
                  style={{ background: svc.color }}
                >
                  {p.step}
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">{p.title}</div>
                  <div className="text-slate-500 text-xs mt-0.5 leading-relaxed">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3" style={{ background: svc.color + "08" }}>
            <CheckCircle className="h-5 w-5" style={{ color: svc.color }} />
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Key Benefits</h3>
          </div>
          <div className="p-5 space-y-3">
            {svc.benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: svc.color + "20" }}>
                  <CheckCircle className="h-3 w-3" style={{ color: svc.color }} />
                </div>
                <span className="text-sm text-slate-600 font-medium leading-snug">{b}</span>
              </div>
            ))}
          </div>
          <div className="px-5 pb-5">
            <Button
              asChild
              className="w-full font-bold text-white rounded-xl mt-2"
              style={{ background: svc.color }}
            >
              <Link to="/contact">
                Schedule Free Consultation <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile timeline strip */}
      <div className="lg:hidden flex gap-4 mb-6">
        <div className="flex-1 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
          <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Timeline</div>
          <div className="text-lg font-black text-slate-800">{svc.timeline}</div>
        </div>
        <div className="flex-1 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
          <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Min. Requirement</div>
          <div className="text-sm font-bold text-slate-800">{svc.minInvestment}</div>
        </div>
      </div>
    </motion.section>
  );
};

const FAQItem = ({ faq, index }: { faq: typeof faqs[0]; index: number }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      className="border border-slate-200 rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors gap-4"
      >
        <span className="font-bold text-slate-800 text-sm leading-snug">{faq.q}</span>
        {open ? <ChevronUp className="h-5 w-5 text-[#1a56db] shrink-0" /> : <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
          {faq.a}
        </div>
      )}
    </motion.div>
  );
};

/* ─── Page component ─── */
const IPOServices = () => {
  const [activeTab, setActiveTab] = useState(services[0].id);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <SEOHead
        title="IPO Services — SME IPO, Mainline IPO, FPO & Pre-IPO Funding | IndiaIPO"
        description="Complete IPO advisory services in India. Expert consultation for SME IPO, Mainline IPO, Follow-On Public Offer (FPO), and Pre-IPO Funding. SEBI-registered advisors, 500+ successful IPOs."
        keywords="IPO advisory India, SME IPO consultants, Mainline IPO, FPO advisory, Pre-IPO funding, SEBI IPO process, BSE SME listing, NSE Emerge IPO"
      />
      <Header />
      <main>

        {/* ═══ HERO ═══ */}
        <section className="bg-gradient-to-br from-[#001529] via-[#002147] to-[#003380] pt-16 pb-36 relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-5">
            <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-[#f59e08] blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 rounded-full bg-blue-400 blur-3xl" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-[#F8FAFC]" />

          <div className="container mx-auto px-4 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-white/50 text-sm mb-8">
              <Link to="/" className="hover:text-white flex items-center gap-1 transition-colors"><Home className="h-3 w-3" /> Home</Link>
              <span>/</span>
              <span className="text-white">IPO Services</span>
            </div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 bg-[#f59e08]/20 border border-[#f59e08]/30 rounded-full px-4 py-1.5 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#f59e08] animate-pulse" />
                <span className="text-[#f59e08] text-xs font-black uppercase tracking-widest">SEBI Registered Advisory</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight max-w-4xl">
                India's Most Trusted <br />
                <span className="text-[#f59e08]">IPO Advisory</span> Services
              </h1>
              <p className="text-white/60 max-w-2xl text-base md:text-lg font-medium leading-relaxed mb-10">
                From Pre-IPO Funding to Mainboard listing — we provide end-to-end, SEBI-compliant IPO consultation for SMEs and large enterprises across all sectors and exchanges in India.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="bg-[#f59e08] hover:bg-[#d97706] text-[#001529] font-black rounded-xl px-8 h-12 text-sm shadow-xl shadow-[#f59e08]/20">
                  <Link to="/contact">Get Free Consultation <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-xl px-8 h-12 text-sm font-bold">
                  <Link to="/ipo-calendar">View Live IPOs</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ STATS BAR ═══ */}
        <section className="bg-gradient-to-r from-[#001529] to-[#003380] py-12 -mt-1">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s, i) => <StatCard key={i} {...s} index={i} />)}
            </div>
          </div>
        </section>

        {/* ═══ QUICK NAV TABS ═══ */}
        <section className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-3">
              {services.map((svc) => {
                const Icon = svc.icon;
                return (
                  <button
                    key={svc.id}
                    onClick={() => {
                      setActiveTab(svc.id);
                      document.getElementById(svc.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                      activeTab === svc.id
                        ? "bg-[#001529] text-white shadow-md"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {svc.shortTitle}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ SERVICES SECTIONS ═══ */}
        <section className="container mx-auto px-4 py-16 space-y-24">
          {/* Intro */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              Our <span className="text-[#1a56db]">IPO Services</span> Portfolio
            </h2>
            <p className="text-slate-500 text-base leading-relaxed font-medium">
              Choose the right listing pathway for your company. Each service comes with a dedicated deal team, comprehensive documentation support, and 360-degree advisory throughout the process.
            </p>
          </motion.div>

          {/* Individual service sections */}
          {services.map((svc, i) => (
            <ServiceSection key={svc.id} svc={svc} index={i} />
          ))}
        </section>

        {/* ═══ COMPARISON TABLE ═══ */}
        <section className="bg-white py-20 border-y border-slate-200">
          <div className="container mx-auto px-4">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                <span className="text-[#f59e08]">Quick Comparison</span> — All Services
              </h2>
              <p className="text-slate-500 font-medium">Side-by-side overview to help you choose the right IPO pathway</p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-[#001529] to-[#003380] text-white">
                    <th className="px-6 py-5 text-left font-bold text-xs uppercase tracking-widest">Parameter</th>
                    {services.map(s => (
                      <th key={s.id} className="px-6 py-5 text-center font-bold text-xs uppercase tracking-widest whitespace-nowrap">
                        <div className="flex flex-col items-center gap-1">
                          <s.icon className="h-5 w-5 text-[#f59e08]" />
                          {s.shortTitle}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Company Stage", values: ["Private / Unlisted", "Private / Unlisted", "Private / Unlisted", "Listed Company", "Pre-IPO Company"] },
                    { label: "Exchange / Platform", values: ["NSE / BSE Main", "BSE SME / NSE Emerge", "NSE / BSE Main", "NSE / BSE Main", "Private Placement"] },
                    { label: "Min. Issue Size", values: ["₹10 Cr+", "₹1 Cr (Capital)", "₹50 Cr+", "Market-based", "₹25 Lakh (Investor)"] },
                    { label: "Typical Timeline", values: ["9–18 months", "4–6 months", "12–24 months", "4–8 months", "2–6 months"] },
                    { label: "SEBI DRHP Required", values: ["✓ Yes", "✓ Yes", "✓ Yes", "✓ Yes", "✗ No"] },
                    { label: "Institutional Investors", values: ["✓ Yes", "Limited", "✓ Yes (FII/DII)", "✓ Yes", "Case-by-case"] },
                    { label: "Promoter Lock-in", values: ["18 months", "3 years", "3 years", "N/A", "N/A"] },
                    { label: "Complexity", values: ["Medium", "Low", "High", "Medium", "Low-Medium"] },
                  ].map((row, ri) => (
                    <tr key={ri} className={`border-b border-slate-100 ${ri % 2 === 0 ? "bg-slate-50/50" : "bg-white"}`}>
                      <td className="px-6 py-4 font-bold text-slate-700 whitespace-nowrap">{row.label}</td>
                      {row.values.map((v, vi) => (
                        <td key={vi} className={`px-6 py-4 text-center font-medium ${v.startsWith("✓") ? "text-green-600" : v.startsWith("✗") ? "text-red-400" : "text-slate-600"}`}>
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>

        {/* ═══ WHY CHOOSE US ═══ */}
        <section className="py-20 bg-[#F8FAFC]">
          <div className="container mx-auto px-4">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                Why <span className="text-[#1a56db]">India IPO</span> Advisors?
              </h2>
              <p className="text-slate-500 font-medium max-w-2xl mx-auto">
                Our edge comes from deep domain expertise, a verified SEBI compliance framework, and a relentless focus on client success.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {whyChooseUs.map((item, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#001529] to-[#003380] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <item.icon className="h-7 w-7 text-[#f59e08]" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section className="py-20 bg-white border-t border-slate-200">
          <div className="container mx-auto px-4 max-w-3xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                Frequently Asked <span className="text-[#f59e08]">Questions</span>
              </h2>
              <p className="text-slate-500 font-medium">Everything you need to know about IPO advisory services in India.</p>
            </motion.div>
            <div className="space-y-3">
              {faqs.map((faq, i) => <FAQItem key={i} faq={faq} index={i} />)}
            </div>
          </div>
        </section>

        {/* ═══ CTA BAND ═══ */}
        <section className="bg-gradient-to-r from-[#001529] via-[#002147] to-[#003380] py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                Ready to <span className="text-[#f59e08]">Go Public?</span>
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto text-base font-medium mb-10">
                Talk to our expert IPO advisors today. Free initial consultation — no strings attached. We'll assess your company's IPO readiness and chart the ideal listing roadmap.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild className="bg-[#f59e08] hover:bg-[#d97706] text-[#001529] font-black rounded-xl px-10 h-14 text-base shadow-2xl shadow-[#f59e08]/30">
                  <Link to="/contact">
                    <Phone className="mr-2 h-5 w-5" /> Talk to an Expert
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-xl px-10 h-14 text-base font-bold">
                  <a href="mailto:info@indiaipo.in">
                    <Mail className="mr-2 h-5 w-5" /> info@indiaipo.in
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default IPOServices;
