import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import {
  MapPin, Search, ArrowRight, Building2, Globe, FileText,
  CheckCircle, ChevronRight, X, Phone, Mail, Shield, Star,
  TrendingUp, Users, Award, Home, Zap, BarChart3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MainboardBanker {
  id: number;
  name: string;
  category: string;
  location: string;
  sebi_registration: string;
  website: string;
  services: string;
  total_ipos: number;
  established_year: number | null;
  description: string;
  logo_url: string;
  is_active: boolean;
  total_raised: number;
  avg_size: number;
  avg_subscription: number;
}

const N = "#001529";
const G = "#f59e08";
const G2 = "#d97706";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

const MainboardBankersPage = () => {
  const [bankers, setBankers] = useState<MainboardBanker[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 9;
  const [hasMore, setHasMore] = useState(false);
  const [detailBanker, setDetailBanker] = useState<MainboardBanker | null>(null);
  const [connectBanker, setConnectBanker] = useState<MainboardBanker | null>(null);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 500);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (page === 1) setLoading(true); else setLoadingMore(true);
    fetch(`/api/mainboard-bankers?page=${page}&limit=${limit}&search=${encodeURIComponent(debouncedSearch)}`)
      .then((r) => r.json())
      .then((body) => {
        const data = body.data || [];
        if (page === 1) setBankers(data); else setBankers((prev) => [...prev, ...data]);
        setHasMore(body.pagination ? page < body.pagination.totalPages : false);
      })
      .catch(console.error)
      .finally(() => { setLoading(false); setLoadingMore(false); });
  }, [page, debouncedSearch]);

  /* ─────────────────────────── DETAIL VIEW ─────────────────────────── */
  if (detailBanker) {
    const statItems = [
      { label: "Total IPOs",      value: detailBanker.total_ipos || 0, color: N },
      { label: "Amount Raised",   value: `₹${detailBanker.total_raised || 0} Cr`, color: G2 },
      { label: "Avg Issue Size",  value: `₹${detailBanker.avg_size || 0} Cr`, color: N },
      { label: "Avg Subscription",value: `${detailBanker.avg_subscription || 0}x`, color: G2 },
    ];

    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#F8FAFC" }}>
        <SEOHead
          title={`${detailBanker.name} | Mainboard Merchant Banker | IndiaIPO`}
          description={detailBanker.description?.replace(/<[^>]*>/g, "").substring(0, 160) || "Mainboard Merchant Banker — SEBI Registered BRLM in India."}
        />
        <Header />
        <main className="flex-1">
          {/* Hero */}
          <div className="pt-14 pb-28 px-4 relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${N} 0%, #002147 55%, #003380 100%)` }}>
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-5"
                style={{ background: G, filter: "blur(100px)", transform: "translate(25%,-25%)" }} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1"
              style={{ background: `linear-gradient(90deg, ${N}, ${G}, ${N})` }} />

            <div className="container mx-auto max-w-6xl relative z-10">
              <button onClick={() => { setDetailBanker(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors group">
                <div className="w-8 h-8 rounded-full border border-white/25 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </div>
                Back to Directory
              </button>

              <div className="flex flex-col md:flex-row items-start gap-8">
                {/* Logo */}
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-white flex items-center justify-center p-4 shadow-2xl shrink-0 border-4 border-white/10">
                  {detailBanker.logo_url ? (
                    <img src={detailBanker.logo_url} alt={detailBanker.name} className="w-full h-full object-contain" />
                  ) : (
                    <Building2 className="w-14 h-14 text-[#001529]/30" />
                  )}
                </div>
                <div className="flex-1 text-white">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black"
                      style={{ background: "rgba(34,197,94,0.2)", color: "#86efac", border: "1px solid rgba(34,197,94,0.3)" }}>
                      <CheckCircle className="w-3.5 h-3.5" /> SEBI Registered
                    </span>
                    {detailBanker.category && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border border-white/20"
                        style={{ background: "rgba(245,158,8,0.2)", color: G }}>
                        {detailBanker.category}
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight">{detailBanker.name}</h1>
                  {detailBanker.sebi_registration && (
                    <p className="text-white/50 text-sm font-mono mb-5">Reg. No: {detailBanker.sebi_registration}</p>
                  )}
                  <div className="flex flex-wrap gap-3">
                    <button onClick={(e) => { e.stopPropagation(); setConnectBanker(detailBanker); }}
                      className="flex items-center gap-2 px-6 h-11 rounded-xl font-black text-sm text-[#001529] transition-all hover:scale-105"
                      style={{ background: `linear-gradient(135deg, ${G}, ${G2})`, boxShadow: `0 4px 16px rgba(245,158,8,0.4)` }}>
                      <Mail className="w-4 h-4" /> Connect Now
                    </button>
                    {detailBanker.website && (
                      <a href={detailBanker.website.startsWith("http") ? detailBanker.website : `https://${detailBanker.website}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 h-11 rounded-xl font-black text-sm text-white border border-white/25 hover:bg-white/10 transition-all">
                        <Globe className="w-4 h-4" /> Visit Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats + Content */}
          <div className="container mx-auto max-w-6xl px-4 -mt-14 relative z-20 pb-20">
            {/* Stats strip */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 mb-10 grid grid-cols-2 md:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              {statItems.map((s, i) => (
                <div key={i} className="flex flex-col items-center text-center py-5 px-4">
                  <p className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: description + services */}
              <div className="lg:col-span-2 space-y-6">
                {detailBanker.description && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: N }}>
                        <FileText className="w-5 h-5" style={{ color: G }} />
                      </div>
                      <h3 className="text-base font-black" style={{ color: N }}>About the Company</h3>
                    </div>
                    <div className="prose prose-sm md:prose-base max-w-none text-slate-500 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: detailBanker.description }} />
                  </div>
                )}
                {detailBanker.services && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: N }}>
                        <CheckCircle className="w-5 h-5" style={{ color: G }} />
                      </div>
                      <h3 className="text-base font-black" style={{ color: N }}>Core Services</h3>
                    </div>
                    <p className="text-slate-500 leading-relaxed whitespace-pre-wrap text-sm font-medium">
                      {detailBanker.services}
                    </p>
                  </div>
                )}
              </div>

              {/* Right sidebar */}
              <div className="space-y-6">
                {/* Corporate Details */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                    <div className="w-1 h-5 rounded-full" style={{ background: G }} />
                    <h3 className="font-black text-sm uppercase tracking-widest" style={{ color: N }}>Corporate Details</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { icon: MapPin, label: "Head Office",     val: detailBanker.location },
                      { icon: Building2, label: "Established",  val: detailBanker.established_year ? String(detailBanker.established_year) : null },
                      { icon: Shield,  label: "SEBI Reg. No.",  val: detailBanker.sebi_registration },
                    ].filter((i) => i.val).map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <div className="w-9 h-9 rounded-xl bg-[#001529]/06 flex items-center justify-center shrink-0">
                          <item.icon className="w-4 h-4" style={{ color: N }} />
                        </div>
                        <div>
                          <p className="font-black text-xs uppercase tracking-widest text-slate-400 mb-0.5">{item.label}</p>
                          <p className="font-semibold text-sm" style={{ color: N }}>{item.val}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA card */}
                <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: N }}>
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10"
                    style={{ background: G, filter: "blur(20px)", transform: "translate(30%,-30%)" }} />
                  <h3 className="font-black text-white text-base mb-2">Need Expert Guidance?</h3>
                  <p className="text-white/55 text-xs mb-5 leading-relaxed">
                    Connect with {detailBanker.name} for your mainboard IPO journey and capital market needs.
                  </p>
                  <button onClick={(e) => { e.stopPropagation(); setConnectBanker(detailBanker); }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm text-[#001529] transition-all hover:scale-105"
                    style={{ background: `linear-gradient(135deg, ${G}, ${G2})`, boxShadow: `0 4px 16px rgba(245,158,8,0.4)` }}>
                    Initiate Discussion <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <AnimatePresence>
          {connectBanker && <ConnectModal banker={connectBanker} onClose={() => setConnectBanker(null)} />}
        </AnimatePresence>
        <Footer />
      </div>
    );
  }

  /* ─────────────────────────── LISTING VIEW ─────────────────────────── */
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F8FAFC" }}>
      <SEOHead
        title="List of Mainboard Merchant Bankers in India | IndiaIPO"
        description="Comprehensive directory of SEBI registered Mainboard Merchant Bankers in India. Compare track records, IPO sizes, and subscription rates."
        keywords="Mainboard Merchant Bankers, SEBI registered, IPO Lead Manager, BRLM India, IndiaIPO"
      />
      <Header />

      <main className="flex-grow">
        {/* ── HERO ── */}
        <section className="py-16 lg:py-24 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${N} 0%, #002147 55%, #003380 100%)` }}>
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-5"
              style={{ background: G, filter: "blur(100px)", transform: "translate(25%,-25%)" }} />
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-5"
              style={{ background: "#3b82f6", filter: "blur(80px)", transform: "translate(-20%,20%)" }} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1"
            style={{ background: `linear-gradient(90deg, ${N}, ${G}, ${N})` }} />

          <div className="container mx-auto px-4 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-white/50 text-sm mb-8 flex-wrap justify-center">
              <Link to="/" className="hover:text-white flex items-center gap-1 transition-colors">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white/90 font-semibold">Mainboard Merchant Bankers</span>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 text-xs font-black uppercase tracking-widest"
                style={{ background: "rgba(245,158,8,0.2)", color: G, border: "1px solid rgba(245,158,8,0.35)" }}>
                <Shield className="h-3.5 w-3.5" /> SEBI Registered Merchant Bankers
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-5 leading-tight">
                Mainboard{" "}
                <span style={{ color: G }}>Merchant Bankers</span>
              </h1>
              <p className="text-white/65 max-w-2xl mx-auto mb-8 text-base md:text-lg font-medium leading-relaxed">
                India's top SEBI-registered Merchant Bankers for Mainline IPO advisory, book running, and capital markets advisory.
              </p>

              {/* Search */}
              <div className="max-w-xl mx-auto relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Search by name, SEBI number, category…"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm font-medium focus:outline-none focus:bg-white/15 focus:border-[#f59e08]/50 transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/merchant-bankers/sme"
                  className="flex items-center gap-2 px-6 h-11 rounded-xl font-black text-sm text-white border border-white/25 hover:bg-white/10 transition-all">
                  View SME Bankers <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/ipo-feasibility"
                  className="flex items-center gap-2 px-6 h-11 rounded-xl font-black text-sm text-[#001529] transition-all hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${G}, ${G2})`, boxShadow: `0 4px 16px rgba(245,158,8,0.4)` }}>
                  <Zap className="h-4 w-4" /> Check IPO Feasibility
                </Link>
              </div>
            </motion.div>

            {/* Quick stats in hero */}
            {bankers.length > 0 && (
              <div className="mt-12 flex flex-wrap justify-center gap-0 divide-x divide-white/15 max-w-2xl mx-auto">
                {[
                  { icon: Users,     value: bankers.length, label: "Total Bankers" },
                  { icon: Shield,    value: "100%",         label: "SEBI Registered" },
                  { icon: Award,     value: "25+ Yrs",      label: "Track Record" },
                  { icon: TrendingUp,value: "500+",         label: "Mainboard IPOs" },
                ].map((s, i) => (
                  <div key={i} className="flex flex-col items-center text-center px-8 py-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-2">
                      <s.icon className="w-5 h-5" style={{ color: G }} />
                    </div>
                    <p className="text-xl font-black text-white mb-0.5">{s.value}</p>
                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">{s.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── CARDS ── */}
        <section className="py-14">
          <div className="container mx-auto px-4">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 rounded-full" style={{ background: G }} />
              <h2 className="text-2xl font-black" style={{ color: N }}>Mainboard Merchant Banker Directory</h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200 h-72 animate-pulse" />
                ))}
              </div>
            ) : bankers.length === 0 ? (
              <div className="bg-white text-center py-24 rounded-2xl border-2 border-dashed border-slate-200">
                <Building2 className="w-14 h-14 mx-auto mb-4 text-slate-200" />
                <h3 className="text-xl font-black mb-2" style={{ color: N }}>No merchants found</h3>
                <p className="text-slate-400 font-medium">Try adjusting your search criteria.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bankers.map((banker, i) => (
                    <motion.div key={banker.id} custom={i} initial="hidden" animate="visible" variants={fadeUp}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all cursor-pointer group flex flex-col"
                      onClick={() => { setDetailBanker(banker); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                      {/* Top accent bar */}
                      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${N}, ${G})` }} />

                      <div className="p-6 flex-grow flex flex-col">
                        <div className="flex items-start gap-4 mb-5">
                          {/* Logo */}
                          <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 p-2 shadow-sm shrink-0 flex items-center justify-center overflow-hidden group-hover:border-[#f59e08]/40 transition-colors">
                            {banker.logo_url ? (
                              <img src={banker.logo_url} alt={banker.name} className="w-full h-full object-contain" />
                            ) : (
                              <Building2 className="w-7 h-7 text-slate-300" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-black leading-snug line-clamp-2 transition-colors group-hover:text-[#f59e08]"
                              style={{ color: N }}>
                              {banker.name}
                            </h3>
                            {banker.location && (
                              <div className="flex items-center text-xs text-slate-400 mt-1.5 font-medium">
                                <MapPin className="w-3 h-3 mr-1 shrink-0" />
                                <span className="truncate">{banker.location}</span>
                              </div>
                            )}
                            {banker.sebi_registration && (
                              <div className="flex items-center text-xs text-slate-400 mt-0.5 font-medium">
                                <Shield className="w-3 h-3 mr-1 shrink-0 text-green-500" />
                                <span className="truncate font-mono">{banker.sebi_registration}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Stats row */}
                        <div className="grid grid-cols-3 gap-0 mb-5 py-4 border-y border-slate-100">
                          {[
                            { val: banker.total_ipos || 0, lbl: "IPOs", c: N },
                            { val: banker.avg_size || 0, lbl: "Avg Cr", c: G2 },
                            { val: `${banker.avg_subscription || 0}x`, lbl: "Avg Sub", c: N },
                          ].map((s, si) => (
                            <div key={si} className="text-center" style={si > 0 ? { borderLeft: "1px solid #f1f5f9" } : {}}>
                              <p className="text-xl font-black mb-0.5" style={{ color: s.c }}>{s.val}</p>
                              <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">{s.lbl}</p>
                            </div>
                          ))}
                        </div>

                        <p className="text-sm text-slate-500 line-clamp-2 flex-grow font-medium leading-relaxed">
                          {banker.description?.replace(/<[^>]*>/g, "") || banker.services || "SEBI Registered Category-1 Merchant Banker providing bespoke IPO advisory and capital market solutions."}
                        </p>
                      </div>

                      {/* Button row */}
                      <div className="px-6 pb-6 grid grid-cols-2 gap-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); setDetailBanker(banker); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                          className="h-10 rounded-xl font-black text-xs border transition-all hover:bg-[#001529] hover:text-white"
                          style={{ borderColor: "rgba(0,21,41,0.2)", color: N }}>
                          View Details
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setConnectBanker(banker); }}
                          className="h-10 rounded-xl font-black text-xs text-[#001529] transition-all hover:scale-105"
                          style={{ background: `linear-gradient(135deg, ${G}, ${G2})`, boxShadow: "0 4px 12px rgba(245,158,8,0.3)" }}>
                          Contact Now
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {hasMore && (
                  <div className="mt-12 text-center">
                    <button onClick={() => setPage((p) => p + 1)} disabled={loadingMore}
                      className="inline-flex items-center gap-2 px-10 h-14 rounded-xl font-black text-base text-white transition-all hover:scale-105 disabled:opacity-60"
                      style={{ background: `linear-gradient(135deg, ${N}, #003380)`, boxShadow: `0 8px 32px rgba(0,21,41,0.25)` }}>
                      {loadingMore ? (
                        <><div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> Loading…</>
                      ) : (
                        <>Load More Bankers <ChevronRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${N}, #002147, #003380)` }}>
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5 pointer-events-none"
            style={{ background: G, filter: "blur(80px)", transform: "translate(20%,-30%)" }} />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Planning a <span style={{ color: G }}>Mainboard IPO?</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto font-medium mb-10 text-base leading-relaxed">
              Connect with India's finest SEBI-registered Mainboard Merchant Bankers and get expert advisory for your public listing.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact"
                className="inline-flex items-center gap-2 px-8 h-14 rounded-xl font-black text-base text-[#001529] transition-all hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${G}, ${G2})`, boxShadow: "0 8px 32px rgba(245,158,8,0.35)" }}>
                Get Free Consultation <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/ipo-feasibility"
                className="inline-flex items-center gap-2 px-8 h-14 rounded-xl font-black text-base text-white border border-white/25 hover:bg-white/10 transition-all">
                Check Eligibility
              </Link>
            </div>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {connectBanker && <ConnectModal banker={connectBanker} onClose={() => setConnectBanker(null)} />}
      </AnimatePresence>
      <Footer />
    </div>
  );
};

/* ─────────────────────────── CONNECT MODAL ─────────────────────────── */
const ConnectModal = ({ banker, onClose }: { banker: MainboardBanker; onClose: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
    <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 text-white relative" style={{ background: `linear-gradient(135deg, #001529, #003380)` }}>
        <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, #001529, #f59e08, #001529)` }} />
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/25 flex items-center justify-center hover:bg-white/10 transition-colors">
          <X className="w-4 h-4" />
        </button>
        <div className="w-14 h-14 rounded-xl bg-white mb-4 p-2 shadow-xl flex items-center justify-center overflow-hidden">
          {banker.logo_url ? (
            <img src={banker.logo_url} alt={banker.name} className="w-full h-full object-contain" />
          ) : (
            <Building2 className="w-8 h-8 text-[#001529]/40" />
          )}
        </div>
        <h2 className="text-xl font-black mb-1">Connect with {banker.name}</h2>
        <p className="text-white/65 text-sm">Fill in your details to request an introduction.</p>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Full Name</label>
          <Input placeholder="John Doe" className="rounded-xl h-11 border-slate-200 focus:border-[#001529]/30" />
        </div>
        <div>
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Corporate Email</label>
          <Input type="email" placeholder="john@company.com" className="rounded-xl h-11 border-slate-200 focus:border-[#001529]/30" />
        </div>
        <div>
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Phone Number</label>
          <Input type="tel" placeholder="+91 90000 00000" className="rounded-xl h-11 border-slate-200 focus:border-[#001529]/30" />
        </div>

        {banker.website && (
          <div className="pt-2 border-t border-slate-100">
            <a href={banker.website.startsWith("http") ? banker.website : `https://${banker.website}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-[#001529] transition-colors">
              <Globe className="w-4 h-4 text-[#f59e08]" /> {banker.website}
            </a>
          </div>
        )}

        <button className="w-full h-12 rounded-xl font-black text-sm text-[#001529] transition-all hover:scale-105 shadow-lg mt-2"
          style={{ background: `linear-gradient(135deg, #f59e08, #d97706)`, boxShadow: "0 4px 16px rgba(245,158,8,0.35)" }}>
          Request Introduction
        </button>
        <p className="text-center text-xs text-slate-400 font-medium">
          By submitting, you agree to our privacy policy and terms.
        </p>
      </div>
    </motion.div>
  </div>
);

export default MainboardBankersPage;
