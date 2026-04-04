import { useParams, Link, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { servicesData } from "@/data/servicesData";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getImgSrc } from "@/utils/image";
import {
  ArrowRight, CheckCircle, ChevronRight, Phone, Mail, Home,
  Shield, Clock, Users, Star, Award, Zap, Target,
  ChevronDown, ChevronUp, BookOpen, FileText, TrendingUp,
  MessageSquare, Building2, Globe, BarChart3
} from "lucide-react";
import NotFound from "./NotFound";

interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string;
  video_url?: string | null;
  is_active: boolean;
}

/* ─── Animation helpers ─── */
const MarqueeStyles = () => (
  <style>{`
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee-mobile {
      display: flex;
      width: max-content;
      animation: marquee 30s linear infinite;
    }
    .animate-marquee-mobile > * {
      flex-shrink: 0;
    }
    @media (min-width: 768px) {
      .animate-marquee-mobile {
        display: grid;
        animation: none;
        width: 100%;
        transform: none !important;
      }
    }
  `}</style>
);

/* ── Category-specific color map ── */
const categoryConfig: Record<string, { accent: string; bg: string; gradient: string; badgeBg: string }> = {
  "IPO": {
    accent: "#f59e08",
    bg: "#fff8e6",
    gradient: "from-[#001529] via-[#002147] to-[#003380]",
    badgeBg: "rgba(245,158,8,0.18)",
  },
  "CAPITAL RAISING": {
    accent: "#f59e08",
    bg: "#fff8e6",
    gradient: "from-[#001529] via-[#002147] to-[#003380]",
    badgeBg: "rgba(245,158,8,0.18)",
  },
  "FINANCE ADVISORY": {
    accent: "#f59e08",
    bg: "#fff8e6",
    gradient: "from-[#001529] via-[#002147] to-[#003380]",
    badgeBg: "rgba(245,158,8,0.18)",
  },
};

/* ── Static trust stats ── */
const trustStats = [
  { value: "500+", label: "Successful Deals", icon: Award },
  { value: "₹25,000 Cr+", label: "Capital Raised", icon: TrendingUp },
  { value: "18+ Yrs", label: "Domain Experience", icon: Clock },
  { value: "98%", label: "Client Satisfaction", icon: Star },
];

/* ── Why choose us ── */
const whyUs = [
  { icon: Shield, title: "SEBI-Registered Advisors", desc: "Every advisor on your deal team is SEBI-registered and operates under a strict compliance framework — giving you complete peace of mind." },
  { icon: Users, title: "Dedicated Deal Team", desc: "From Day 1, a dedicated team of senior bankers, legal experts, and CAs is assigned exclusively to your mandate." },
  { icon: Zap, title: "Fastest Possible Timelines", desc: "Our proprietary process models are built to shave weeks off each regulatory stage without any compromise on quality." },
  { icon: Target, title: "Deep Investor Network", desc: "Access to 3,000+ active institutional investors, HNIs, and family offices who trust our recommendation." },
  { icon: Globe, title: "Pan-India Presence", desc: "Offices in Mumbai, Delhi, Ahmedabad, and Bangalore — with our advisory teams reaching every regional market." },
  { icon: BookOpen, title: "End-to-End Documentation", desc: "We handle 100% of the paperwork — DRHP, prospectus, SEBI filings, exchange submissions, and ongoing compliance." },
];

/* ── Testimonials ── */
const testimonials = [
  {
    name: "Rajesh Mehta",
    designation: "CMD, Mehta Industrial Ltd.",
    quote: "India IPO transformed our SME IPO journey. The team was with us every step of the way, and we listed oversubscribed by 47x. Truly professional.",
  },
  {
    name: "Priya Sharma",
    designation: "CFO, FinGreen Capital Services",
    quote: "Their financial modelling and capital structuring advisory gave our board complete clarity. The detail and accuracy of their work is unmatched in the industry.",
  },
  {
    name: "Anil Kumar Gupta",
    designation: "Director, Greenfield Infra Projects",
    quote: "We went from idea to financial closure in 8 months for our ₹400 Cr project. The Project Finance team at India IPO is simply the best I've worked with.",
  },
];

/* ── FAQ for all service pages ── */
const commonFaqs = [
  {
    q: "How do I know which service is right for my company?",
    a: "Our first step is always a free 30-minute consultation to understand your company's stage, financials, industry, and objectives. Based on this, we recommend the most suitable service pathway — whether it's an SME IPO, Mainboard listing, capital raise, or finance advisory."
  },
  {
    q: "How long does the entire engagement typically take?",
    a: "Timelines vary significantly by service. SME IPOs take 4–6 months, Mainboard IPOs 9–18 months, Private Placements 4–8 weeks, and Valuations 2–3 weeks. We provide a precise Project Charter with milestones at the start of every engagement."
  },
  {
    q: "Are your advisors SEBI-registered?",
    a: "Yes. All our merchant bankers, research analysts, and advisory professionals are registered with SEBI under the relevant categories. Our registrations are publicly verifiable on the SEBI intermediary database."
  },
  {
    q: "What are your fee structures?",
    a: "Our fees are structured based on the scope and size of the engagement. For capital-raising services (IPO/FPO/Placement), we typically work on a success-fee model tied to the capital raised. For advisory services (Valuation, Modelling), we charge a fixed professional fee. All fees are transparently discussed upfront."
  },
  {
    q: "Can you assist companies from non-metro cities?",
    a: "Absolutely. We have successfully executed mandates for companies across Tier 1, Tier 2, and even Tier 3 cities in India. Geography is never a barrier — our teams travel to your location, and we use secure digital platforms for all document sharing."
  },
];

/* ── FAQItem component ── */
const FAQItem = ({ faq, index }: { faq: typeof commonFaqs[0]; index: number }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden transition-all">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors gap-4"
      >
        <span className="font-bold text-slate-800 text-sm leading-snug">{faq.q}</span>
        {open
          ? <ChevronUp className="h-5 w-5 text-[#f59e08] shrink-0" />
          : <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
        }
      </button>
      {open && (
        <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4 bg-slate-50/50">
          {faq.a}
        </div>
      )}
    </div>
  );
};

/* ── Main Page ── */
const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const service = servicesData.find((s) => s.slug === slug);
  const [banner, setBanner] = useState<Banner | null>(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch(`/api/banners?page=${location.pathname}`);
        const data = await res.json();
        if (data.length > 0) {
          setBanner(data[0]); // The API returns the best match (page path or group) first
        }
      } catch (err) {
        console.error("Failed to fetch banner:", err);
      }
    };
    fetchBanner();
  }, [location.pathname]);

  if (!service) return <NotFound />;

  const cfg = categoryConfig[service.category] || categoryConfig["IPO"];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <SEOHead
        title={`${service.title} | IndiaIPO Advisory Services`}
        description={service.shortDescription}
        keywords={`${service.title}, IPO Consultancy India, ${service.category}, SEBI registered advisory, financial services India`}
      />
      <MarqueeStyles />
      <Header />

      <main className="flex-grow">

        {/* ══════════════════════════════════
            HERO SECTION
        ══════════════════════════════════ */}
        <section
          className={`bg-gradient-to-br ${cfg.gradient} pt-14 pb-40 relative overflow-hidden`}
        >
          {/* Banner background if exists */}
          {banner && (
            <div className="absolute inset-0 z-0">
               {banner.video_url ? (
                <video
                  src={getImgSrc(banner.video_url) || ""}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={getImgSrc(banner.image_url) || ""}
                  alt={banner.title || "Banner"}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-slate-900/65" />
            </div>
          )}

          {/* Decorative blobs */}
          {!banner && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-5"
                style={{ background: cfg.accent, filter: "blur(120px)", transform: "translate(30%,-20%)" }} />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-5"
                style={{ background: "#3b82f6", filter: "blur(80px)", transform: "translate(-20%,20%)" }} />
            </div>
          )}
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#F8FAFC]" />

          <div className="container mx-auto px-4 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-white/50 mb-8 flex-wrap">
              <Link to="/" className="hover:text-white flex items-center gap-1 transition-colors">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link to="/services" className="hover:text-white transition-colors">Services</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white/80">{service.title}</span>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
              {/* Icon Box */}
              <div
                className="w-24 h-24 md:w-28 md:h-28 rounded-3xl flex items-center justify-center shrink-0 shadow-2xl border border-white/10"
                style={{ background: `linear-gradient(135deg, ${cfg.accent}CC, ${cfg.accent}80)` }}
              >
                <div className="text-white [&>svg]:h-12 [&>svg]:w-12">
                  {service.icon}
                </div>
              </div>

              <div className="flex-1">
                {/* Category badge */}
                <span
                  className="inline-block px-4 py-1.5 rounded-full text-xs font-black mb-4 tracking-widest uppercase"
                  style={{ background: cfg.badgeBg, color: cfg.accent, border: `1px solid ${cfg.accent}40` }}
                >
                  {service.category}
                </span>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-5 leading-tight">
                  {service.title}
                </h1>
                <p className="text-lg md:text-xl text-white/70 max-w-3xl leading-relaxed mb-8">
                  {service.shortDescription}
                </p>

                {/* CTA buttons */}
                <div className="flex flex-wrap gap-4">
                  <Button
                    asChild
                    className="font-black rounded-xl px-8 h-12 text-sm shadow-2xl transition-transform hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${cfg.accent}, #d97706)`,
                      color: "#001529",
                      boxShadow: `0 8px 24px ${cfg.accent}40`,
                    }}
                  >
                    <Link to="/contact">
                      Get Free Consultation <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outlineWhite"
                    className="rounded-xl px-8 h-12 text-sm font-bold shadow-md"
                  >
                    <a href="tel:+917428337280">
                      <Phone className="mr-2 h-4 w-4" /> Call Us Now
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            TRUST STATS BAR
        ══════════════════════════════════ */}
        <section className="bg-gradient-to-r from-[#001529] to-[#003380] py-10 -mt-1 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {trustStats.map((s, i) => (
                <div key={i}
                  className="bg-white/8 backdrop-blur-sm border border-white/12 rounded-2xl p-5 text-center hover:bg-white/12 transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#f59e08]/20 flex items-center justify-center mx-auto mb-3">
                    <s.icon className="h-5 w-5 text-[#f59e08]" />
                  </div>
                  <div className="text-2xl font-black text-white mb-1">{s.value}</div>
                  <div className="text-white/55 text-xs font-semibold">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            MAIN CONTENT + SIDEBAR
        ══════════════════════════════════ */}
        <section className="py-20 relative -mt-6 rounded-t-[40px] bg-[#F8FAFC] z-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

              {/* ── Left: Main content ── */}
              <div className="lg:col-span-2 space-y-14">

                {/* Overview */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-8 rounded-full" style={{ background: cfg.accent }} />
                    <h2 className="text-3xl font-black text-[#001529]">Overview</h2>
                  </div>
                  <p className="text-slate-600 text-base leading-relaxed mb-5">
                    {service.fullDescription}
                  </p>
                  <p className="text-slate-600 text-base leading-relaxed">
                    At India IPO, we believe every company deserves access to the best financial advisory — not just large conglomerates. Whether you are a first-generation entrepreneur eyeing the SME platform or an established corporation pursuing a full-scale mainboard listing, our advisory framework is customized to your unique context, sector, and timeline. We do not provide cookie-cutter solutions; every mandate is built ground-up.
                  </p>
                </div>

                {/* Key Benefits */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 rounded-full" style={{ background: cfg.accent }} />
                    <h2 className="text-3xl font-black text-[#001529]">Key Benefits</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {service.keyBenefits.map((benefit, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-3 group h-full"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                          style={{ background: `${cfg.accent}18` }}
                        >
                          <CheckCircle className="h-5 w-5" style={{ color: cfg.accent }} />
                        </div>
                        <span className="font-bold text-slate-800 leading-tight text-[11px] sm:text-xs">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Our Approach – Process Steps */}
                <div>
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-1 h-8 rounded-full" style={{ background: cfg.accent }} />
                    <h2 className="text-3xl font-black text-[#001529]">Our Step-by-Step Approach</h2>
                  </div>
                  <div className="space-y-4">
                    {service.processSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-start gap-5 group"
                      >
                        {/* Step number */}
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white shrink-0 shadow-md group-hover:scale-105 transition-transform"
                          style={{ background: `linear-gradient(135deg, #001529, #003380)` }}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 text-base mb-1">{step.title}</h3>
                          <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                        </div>
                        <div
                          className="hidden md:flex w-8 h-8 rounded-full items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ background: `${cfg.accent}18` }}
                        >
                          <ArrowRight className="h-4 w-4" style={{ color: cfg.accent }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What's Included */}
                <div className="bg-gradient-to-br from-[#001529] to-[#003380] rounded-3xl p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 rounded-full bg-[#f59e08]" />
                    <h2 className="text-2xl font-black text-white">What's Included in Your Engagement</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      "Dedicated Senior Relationship Manager",
                      "Full Regulatory Documentation Support",
                      "SEBI & Exchange Filing Management",
                      "Investor Roadshow Assistance",
                      "Legal & Secretarial Coordination",
                      "Post-Transaction Compliance Support",
                      "Real-time Deal Status Dashboard",
                      "Expert Due Diligence Team",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#f59e08]/20 flex items-center justify-center shrink-0">
                          <CheckCircle className="h-3 w-3 text-[#f59e08]" />
                        </div>
                        <span className="text-white/80 text-sm font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Industry Coverage */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 rounded-full" style={{ background: cfg.accent }} />
                    <h2 className="text-3xl font-black text-[#001529]">Industries We Serve</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[
                      "Manufacturing", "Technology", "Real Estate", "Infrastructure",
                      "Healthcare & Pharma", "FMCG", "Retail & D2C", "Energy & Renewables",
                      "Financial Services", "Education", "Logistics", "Agri-Tech",
                      "Media & Entertainment", "Hospitality", "Auto & EV",
                    ].map((sector, i) => (
                      <div
                        key={i}
                        className="px-4 py-3 rounded-xl text-xs font-bold border transition-all hover:scale-105 cursor-default flex items-center justify-center text-center leading-tight shadow-sm"
                        style={{
                          background: i % 3 === 0 ? `${cfg.accent}12` : i % 3 === 1 ? "rgba(0,21,41,0.04)" : "#ffffff",
                          borderColor: i % 3 === 0 ? `${cfg.accent}30` : "#e2e8f0",
                          color: i % 3 === 0 ? cfg.accent : "#475569",
                        }}
                      >
                        {sector}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Testimonials */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 rounded-full" style={{ background: cfg.accent }} />
                    <h2 className="text-3xl font-black text-[#001529]">Client Testimonials</h2>
                  </div>
                  <div className="overflow-hidden md:overflow-visible pb-8 -mx-4 px-4 scrollbar-hide">
                    <div className="animate-marquee-mobile flex gap-6 md:flex-col md:gap-4 hover:[animation-play-state:paused]">
                      {testimonials.map((t, i) => (
                        <div key={i}
                          className="w-[280px] md:w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative"
                        >
                          <div
                            className="absolute top-0 left-0 w-full h-1 rounded-t-2xl"
                            style={{ background: `linear-gradient(90deg, #001529, ${cfg.accent})` }}
                          />
                          <div className="flex items-start gap-4">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0"
                              style={{ background: `linear-gradient(135deg, #001529, ${cfg.accent})` }}
                            >
                              {t.name.charAt(0)}
                            </div>
                            <div>
                              <MessageSquare className="h-5 w-5 mb-2" style={{ color: cfg.accent }} />
                              <p className="text-slate-600 text-sm leading-relaxed italic mb-3">"{t.quote}"</p>
                              <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                              <div className="text-slate-400 text-xs">{t.designation}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {/* Duplicate set for mobile marquee loop */}
                      {testimonials.map((t, i) => (
                        <div key={`dup-${i}`}
                          className="md:hidden w-[280px] bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative"
                        >
                          <div
                            className="absolute top-0 left-0 w-full h-1 rounded-t-2xl"
                            style={{ background: `linear-gradient(90deg, #001529, ${cfg.accent})` }}
                          />
                          <div className="flex items-start gap-4">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0"
                              style={{ background: `linear-gradient(135deg, #001529, ${cfg.accent})` }}
                            >
                              {t.name.charAt(0)}
                            </div>
                            <div>
                              <MessageSquare className="h-5 w-5 mb-2" style={{ color: cfg.accent }} />
                              <p className="text-slate-600 text-sm leading-relaxed italic mb-3">"{t.quote}"</p>
                              <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                              <div className="text-slate-400 text-xs">{t.designation}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* FAQ */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 rounded-full" style={{ background: cfg.accent }} />
                    <h2 className="text-3xl font-black text-[#001529]">Frequently Asked Questions</h2>
                  </div>
                  <div className="space-y-3">
                    {commonFaqs.map((faq, i) => <FAQItem key={i} faq={faq} index={i} />)}
                  </div>
                </div>

              </div>

              {/* ── Right: Sticky Sidebar ── */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-5">

                  {/* CTA Card */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                    <div
                      className="h-2"
                      style={{ background: `linear-gradient(90deg, #001529, ${cfg.accent})` }}
                    />
                    <div className="p-7 text-center">
                      <div
                        className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-5"
                        style={{ background: "#001529" }}
                      >
                        <Phone className="w-7 h-7 text-[#f59e08]" />
                      </div>
                      <h3 className="text-2xl font-black text-[#001529] mb-2">Ready to Start?</h3>
                      <p className="text-slate-500 mb-7 text-sm leading-relaxed">
                        Consult with our experts to understand how our <strong>{service.title}</strong> advisory can accelerate your growth journey.
                      </p>
                      <Button
                        asChild
                        className="w-full py-6 text-base font-black rounded-xl shadow-lg transition-transform hover:scale-105"
                        style={{
                          background: `linear-gradient(135deg, ${cfg.accent}, #d97706)`,
                          color: "#001529",
                          boxShadow: `0 4px 20px ${cfg.accent}40`,
                        }}
                      >
                        <Link to="/contact">
                          Contact Us <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                      </Button>
                      <div className="mt-5 pt-5 border-t border-slate-100">
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Or Call Us Directly At</p>
                        <a
                          href="tel:+917428337280"
                          className="text-lg font-black hover:underline"
                          style={{ color: "#001529" }}
                        >
                          +91-74283-37280
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Other Services */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3"
                      style={{ background: "#001529" }}>
                      <Building2 className="h-4 w-4 text-[#f59e08]" />
                      <h3 className="font-black text-white text-sm uppercase tracking-widest">Related Services</h3>
                    </div>
                    <div className="p-3">
                      {servicesData
                        .filter(s => s.slug !== slug && s.category === service.category)
                        .slice(0, 4)
                        .map((s, i) => (
                          <Link
                            key={i}
                            to={`/services/${s.slug}`}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                          >
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                              style={{ background: `${cfg.accent}15` }}
                            >
                              <div style={{ color: cfg.accent }} className="[&>svg]:h-4 [&>svg]:w-4">
                                {s.icon}
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-slate-700 group-hover:text-[#001529] leading-tight">{s.title}</span>
                            <ChevronRight className="h-4 w-4 text-slate-300 ml-auto group-hover:text-[#f59e08] transition-colors shrink-0" />
                          </Link>
                        ))}
                      <Link
                        to="/services"
                        className="flex items-center justify-center gap-2 mt-2 p-3 rounded-xl text-sm font-black transition-colors"
                        style={{ color: cfg.accent }}
                      >
                        View All Services <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="bg-[#001529] rounded-2xl p-6">
                    <h4 className="text-white font-black text-sm uppercase tracking-widest mb-4">Quick Info</h4>
                    <div className="space-y-3">
                      {[
                        { label: "Category", value: service.category },
                        { label: "Regulatory Body", value: "SEBI, NSE, BSE" },
                        { label: "Advisory Mode", value: "Offline + Online" },
                        { label: "Languages", value: "English, Hindi, Regional" },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <span className="text-white/50 text-xs font-semibold">{item.label}</span>
                          <span className="text-white/90 text-xs font-bold">{item.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 pt-5 border-t border-white/10">
                      <a
                        href="mailto:info@indiaipo.in"
                        className="flex items-center gap-2 text-[#f59e08] text-sm font-bold hover:underline"
                      >
                        <Mail className="h-4 w-4" /> info@indiaipo.in
                      </a>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── WHY CHOOSE US ─── */}
        <section className="bg-white py-20 border-t border-slate-200">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-[#f59e08]/15 border border-[#f59e08]/30 rounded-full px-4 py-1.5 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#f59e08] animate-pulse" />
                <span className="text-[#f59e08] text-xs font-black uppercase tracking-widest">Why India IPO</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-[#001529] mb-4">
                The India IPO <span className="text-[#f59e08]">Advantage</span>
              </h2>
              <p className="text-slate-500 font-medium max-w-2xl mx-auto text-base">
                We combine deep domain expertise, a SEBI-compliant advisory framework, hands-on execution, and India's largest financial intermediary network — all under one roof.
              </p>
            </div>
            <div className="overflow-hidden md:overflow-visible pb-8 -mx-4 px-4 scrollbar-hide">
              <div className="animate-marquee-mobile flex gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 hover:[animation-play-state:paused]">
                {whyUs.map((item, i) => (
                  <div
                    key={i}
                    className="w-[280px] md:w-auto bg-[#F8FAFC] rounded-2xl p-7 border border-slate-200 hover:shadow-lg hover:-translate-y-1.5 transition-all group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#001529] to-[#003380] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md">
                      <item.icon className="h-7 w-7 text-[#f59e08]" />
                    </div>
                    <h3 className="text-base font-black text-[#001529] mb-2">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA BAND ─── */}
        <section className="bg-gradient-to-r from-[#001529] via-[#002147] to-[#003380] py-20 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
              style={{ background: "#f59e08", filter: "blur(80px)", transform: "translate(20%,-30%)" }} />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#f59e08]/15 border border-[#f59e08]/30 rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#f59e08] animate-pulse" />
              <span className="text-[#f59e08] text-xs font-black uppercase tracking-widest">Take the First Step</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-5 leading-tight">
              Ready to Unlock Your Company's<br />
              <span className="text-[#f59e08]">Full Financial Potential?</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-base font-medium mb-10 leading-relaxed">
              Our first consultation is always free. Let our advisors assess your eligibility, explain the roadmap in detail, and lay out a transparent cost structure — so you can make an informed decision with zero pressure.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                className="font-black rounded-xl px-10 h-14 text-base shadow-2xl transition-transform hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #f59e08, #d97706)",
                  color: "#001529",
                  boxShadow: "0 8px 32px rgba(245,158,8,0.35)",
                }}
              >
                <Link to="/contact">
                  <Phone className="mr-2 h-5 w-5" /> Talk to an Expert
                </Link>
              </Button>
              <Button
                asChild
                variant="outlineWhite"
                className="rounded-xl px-10 h-14 text-base font-bold shadow-xl"
              >
                <a href="mailto:info@indiaipo.in">
                  <Mail className="mr-2 h-5 w-5" /> info@indiaipo.in
                </a>
              </Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default ServiceDetail;
