import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, MapPin, Calendar, ArrowRight, Search, Activity, Users, Globe, ChevronLeft, ChevronRight, Shield, Home, CheckCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface Registrar {
  id: number; name: string; image: string; slug: string;
  sme_ipo: string; mainboard_ipo: string; location: string;
  dic: string; registrar_year: string; latest_sme: string;
  latest_mainbord: string; status: string;
}

const N = "#001529", G = "#f59e08", G2 = "#d97706";

const getImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return (path.startsWith("/") ? "" : "/") + path;
};

const Registrars = () => {
  const [registrars, setRegistrars] = useState<Registrar[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [bannerVideo, setBannerVideo] = useState<string | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`/api/banners?page=${encodeURIComponent(pathname)}`);
        if (res.ok) {
          const data = await res.json();
          const videoBanner = data.find((b: any) => b.video_url);
          if (videoBanner) setBannerVideo(videoBanner.video_url);
        }
      } catch (err) { console.error(err); }
    };
    fetchBanners();
  }, [pathname]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/registrars?page=${page}&limit=9`);
        if (res.ok) {
          const body = await res.json();
          setRegistrars(body.data || []);
          setTotalPages(body.pagination?.totalPages || 1);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
    window.scrollTo(0, 0);
  }, [page]);

  const filtered = registrars.filter(r =>
    (r.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.location || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      <SEOHead
        title="List of IPO Registrars in India | IndiaIPO — SEBI Registered RTA Directory"
        description="Explore the comprehensive list of official SEBI-registered IPO Registrars in India. Check their track record, serviced IPOs, Mainboard & SME history, and contact details."
        keywords="IPO registrars India, SEBI registered RTA, registrar and transfer agent, SME IPO registrar, mainboard IPO registrar list"
      />
      <Header />
      <main>
        {/* ── HERO ── */}
        <section className="py-16 lg:py-24 relative overflow-hidden bg-[#001529]">
          {/* Background Video */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-30"
              src={getImageUrl(bannerVideo || "/uploads/video/ccvindia1.mp4")}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#001529]/80 via-[#001529]/40 to-[#001529]" />
          </div>

          <div className="absolute inset-0 pointer-events-none overflow-hidden z-1">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-5"
              style={{ background: G, filter: "blur(100px)", transform: "translate(25%,-25%)" }} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 z-1"
            style={{ background: `linear-gradient(90deg, ${N}, ${G}, ${N})` }} />

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-2 text-white/50 text-sm mb-8 flex-wrap justify-center">
              <Link to="/" className="hover:text-white flex items-center gap-1 transition-colors">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white/90 font-semibold">IPO Registrars</span>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 text-xs font-black uppercase tracking-widest"
                style={{ background: "rgba(245,158,8,0.2)", color: G, border: "1px solid rgba(245,158,8,0.35)" }}>
                <Activity className="h-3.5 w-3.5" /> Trusted Intermediaries
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-5 leading-tight">
                Official IPO <span style={{ color: G }}>Registrars</span>
              </h1>
              <p className="text-white/65 max-w-2xl mx-auto mb-8 text-base md:text-lg font-medium leading-relaxed">
                Comprehensive directory of SEBI-registered registrars facilitating share allotment and registry services for Mainboard and SME IPOs.
              </p>

              {/* Search */}
              <div className="max-w-xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  placeholder="Search by Registrar Name or Location…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm font-medium focus:outline-none focus:bg-white/15 focus:border-[#f59e08]/50 transition-all"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <section style={{ background: `linear-gradient(135deg, ${N}, #003380)` }} className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Shield, value: "100%", label: "SEBI Registered" },
                { icon: Building2, value: "20+", label: "Active Registrars" },
                { icon: Activity, value: "1000+", label: "IPOs Processed" },
                { icon: Globe, value: "Pan-India", label: "Coverage" },
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center text-center py-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-2">
                    <s.icon className="h-5 w-5" style={{ color: G }} />
                  </div>
                  <p className="text-xl font-black text-white mb-0.5">{s.value}</p>
                  <p className="text-xs text-white/50 font-bold uppercase tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CARDS ── */}
        <section className="py-14">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 rounded-full" style={{ background: G }} />
              <h2 className="text-2xl font-black" style={{ color: N }}>
                Registered IPO Registrars
                <span className="text-slate-400 text-base font-semibold ml-2">({registrars.length} listed)</span>
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <div key={i} className="h-80 rounded-2xl bg-white border border-slate-200 animate-pulse" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                <Building2 className="h-14 w-14 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-black mb-2" style={{ color: N }}>No registrars found</h3>
                <p className="text-slate-400 font-medium">Try adjusting your search criteria.</p>
                <button onClick={() => setSearch("")} className="mt-4 text-sm font-black" style={{ color: G }}>Clear Search</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((r, idx) => (
                  <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: idx * 0.06 }}
                    className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all flex flex-col">
                    {/* Top accent */}
                    <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${N}, ${G})` }} />

                    <div className="p-6 pb-4">
                      <div className="flex justify-between items-start mb-5">
                        <div className="w-20 h-20 rounded-xl border border-slate-200 bg-white p-2 flex items-center justify-center shadow-sm group-hover:border-[#f59e08]/40 transition-colors overflow-hidden">
                          {r.image ? (
                            <img src={getImageUrl(r.image)} alt={r.name} className="w-full h-full object-contain" />
                          ) : (
                            <Building2 className="h-10 w-10 text-slate-300" />
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {r.registrar_year && (
                            <span className="flex items-center gap-1 text-[10px] font-black px-3 py-1 rounded-full"
                              style={{ background: "rgba(0,21,41,0.06)", color: N }}>
                              <Calendar className="h-3 w-3" /> Est. {r.registrar_year}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-[10px] font-black px-3 py-1 rounded-full"
                            style={{ background: "rgba(34,197,94,0.1)", color: "#16a34a", border: "1px solid rgba(34,197,94,0.2)" }}>
                            <Activity className="h-3 w-3" /> SEBI Registered
                          </span>
                        </div>
                      </div>
                      <h3 className="text-lg font-black leading-snug mb-2 group-hover:text-[#f59e08] transition-colors" style={{ color: N }}>
                        {r.name}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                        <MapPin className="h-4 w-4 text-[#f59e08]" />
                        {r.location || "Head Office, India"}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="px-6 py-4 grid grid-cols-2 gap-3 border-y border-slate-100" style={{ background: "#F8FAFC" }}>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mainboard</p>
                        <p className="text-xl font-black" style={{ color: N }}>
                          {r.mainboard_ipo || "0"}<span className="text-xs font-normal text-slate-400 ml-1">IPOs</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">SME Portal</p>
                        <p className="text-xl font-black" style={{ color: G2 }}>
                          {r.sme_ipo || "0"}<span className="text-xs font-normal text-slate-400 ml-1">IPOs</span>
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-4 mt-auto">
                      <Link to={`/list-of-ipo-registrar/${r.slug}`}
                        className="flex items-center justify-center gap-2 w-full h-11 rounded-xl font-black text-sm transition-all hover:scale-105"
                        style={{ background: `linear-gradient(135deg, ${N}, #003380)`, color: "white", boxShadow: "0 4px 16px rgba(0,21,41,0.2)" }}>
                        View Details <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                  className="flex items-center gap-1 px-5 h-11 rounded-xl font-black text-sm text-white transition-all disabled:opacity-40"
                  style={{ background: N }}>
                  <ChevronLeft className="h-4 w-4" /> Prev
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)}
                    className="w-11 h-11 rounded-xl font-black text-sm transition-all"
                    style={page === i + 1
                      ? { background: G, color: N, boxShadow: "0 4px 12px rgba(245,158,8,0.35)" }
                      : { background: "#f1f5f9", color: "#475569" }}>
                    {i + 1}
                  </button>
                ))}
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                  className="flex items-center gap-1 px-5 h-11 rounded-xl font-black text-sm text-white transition-all disabled:opacity-40"
                  style={{ background: N }}>
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── INFO SECTION ── */}
        <section className="py-20 bg-white border-t border-slate-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-black uppercase tracking-widest"
                  style={{ background: "rgba(245,158,8,0.12)", color: G2, border: "1px solid rgba(245,158,8,0.25)" }}>
                  <Activity className="h-3.5 w-3.5" /> Role of a Registrar
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-8 leading-tight" style={{ color: N }}>
                  Role of a Registrar in <span style={{ color: G }}>IPO Allotment</span>
                </h2>
                <div className="space-y-6">
                  {[
                    { icon: Users, title: "Share Processing", color: N,
                      desc: "Registrars handle the massive influx of applications from retail, HNI, and institutional investors during the IPO subscription window." },
                    { icon: Activity, title: "Basis of Allotment", color: G2,
                      desc: "They finalize the allotment basis in coordination with Stock Exchanges and SEBI, ensuring fair distribution according to approved norms." },
                    { icon: Globe, title: "Registry Maintenance", color: N,
                      desc: "Post-listing, they maintain the record of shareholders and handle dividends, corporate actions, bonus issues, and transfer requests." },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                        style={{ background: i === 1 ? "rgba(245,158,8,0.1)" : "rgba(0,21,41,0.06)" }}>
                        <item.icon className="h-7 w-7" style={{ color: item.color }} />
                      </div>
                      <div>
                        <h4 className="font-black text-lg mb-1" style={{ color: N }}>{item.title}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                    alt="Market Analysis" className="w-full h-72 object-cover" />
                  <div className="p-8" style={{ background: N }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6" style={{ color: G }} />
                      </div>
                      <div>
                        <p className="font-black text-white text-base">Official Registrar Support</p>
                        <p className="text-white/55 text-xs font-medium">Connected with all major RTA agents in India</p>
                      </div>
                    </div>
                    <Link to="/contact"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-sm mt-4 transition-all hover:scale-105"
                      style={{ background: `linear-gradient(135deg, ${G}, ${G2})`, color: N }}>
                      Get Registrar Guidance <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-16 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${N}, #002147, #003380)` }}>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl font-black text-white mb-3">Need Help Choosing a <span style={{ color: G }}>Registrar?</span></h2>
            <p className="text-white/60 max-w-lg mx-auto font-medium mb-8">Our experts help you select the right registrar for your IPO and ensure smooth allotment processes.</p>
            <Link to="/contact"
              className="inline-flex items-center gap-2 px-8 h-14 rounded-xl font-black text-base transition-all hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${G}, ${G2})`, color: N, boxShadow: "0 8px 32px rgba(245,158,8,0.35)" }}>
              Contact Our Experts <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Registrars;
