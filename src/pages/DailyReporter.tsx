import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, ChevronRight, FileText, Calendar, Download, Eye,
  Search, ArrowRight, Newspaper, Loader2, TrendingUp, BarChart3, Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

interface DailyDigest {
  id: number;
  title: string;
  image: string | null;
  pdf: string | null;
  created_at: string;
  updated_at: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.45 } }),
};

const stats = [
  { icon: Newspaper, value: "Daily", label: "Reports Published" },
  { icon: BarChart3, value: "500+", label: "Total Digests" },
  { icon: TrendingUp, value: "Real-Time", label: "Market Insights" },
  { icon: Zap, value: "100%", label: "SEBI Aligned" },
];

const DailyReporter = () => {
  const [digests, setDigests] = useState<DailyDigest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = async (currentPage: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/daily-digests?page=${currentPage}&limit=12`);
      if (res.ok) {
        const result = await res.json();
        setDigests(result.data);
        setTotalPages(result.pagination.totalPages);
        setTotal(result.pagination.total);
      }
    } catch (err) {
      console.error("Error fetching daily digests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(page); window.scrollTo(0, 0); }, [page]);

  const filteredDigests = digests.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <SEOHead
        title="Daily Reporter | IndiaIPO — Daily Market Digests & IPO Snapshots"
        description="Access IndiaIPO's exclusive daily market digests featuring IPO summaries, GMP updates, and financial snapshots of the Indian capital market landscape."
        keywords="Daily IPO reporter, market digest India, daily IPO news, IPO snapshots, IndiaIPO daily report"
      />
      <Header />

      <main>
        {/* ── HERO ── */}
        <section className="bg-gradient-to-br from-[#001529] via-[#002147] to-[#003380] pt-14 pb-36 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-5"
              style={{ background: "#f59e08", filter: "blur(100px)", transform: "translate(25%,-25%)" }} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#F8FAFC]" />

          <div className="container mx-auto px-4 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-white/50 text-sm mb-8 flex-wrap">
              <Link to="/" className="hover:text-white flex items-center gap-1 transition-colors">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white/80">Daily Reporter</span>
            </div>

            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 bg-[#f59e08]/20 border border-[#f59e08]/30 rounded-full px-4 py-1.5 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#f59e08] animate-pulse" />
                <span className="text-[#f59e08] text-xs font-black uppercase tracking-widest">
                  <Newspaper className="h-3 w-3 inline mr-1" /> Daily Market Intelligence
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-5 leading-tight max-w-3xl">
                Daily <span className="text-[#f59e08]">Reporter</span>
              </h1>
              <p className="text-white/65 max-w-2xl text-base md:text-lg font-medium leading-relaxed mb-10">
                Access our exclusive daily digests featuring market summaries, IPO updates, and professional snapshots of the Indian financial landscape — published every trading day.
              </p>
              {/* Search bar */}
              <div className="relative max-w-lg">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Search reports by title…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm font-medium focus:outline-none focus:bg-white/15 focus:border-[#f59e08]/50 transition-all"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <section className="bg-gradient-to-r from-[#001529] to-[#003380] py-10 -mt-1 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s, i) => (
                <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className="bg-white/8 border border-white/12 rounded-2xl p-5 text-center hover:bg-white/12 transition-all">
                  <div className="w-11 h-11 rounded-xl bg-[#f59e08]/20 flex items-center justify-center mx-auto mb-3">
                    <s.icon className="h-5 w-5 text-[#f59e08]" />
                  </div>
                  <div className="text-2xl font-black text-white mb-1">{s.value}</div>
                  <div className="text-white/55 text-xs font-semibold">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTENT ── */}
        <section className="py-14">
          <div className="container mx-auto px-4">
            {/* Header row */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 rounded-full bg-[#f59e08]" />
              <h2 className="text-2xl font-black text-[#001529]">Latest Reports</h2>
              <span className="ml-2 text-slate-400 text-sm font-semibold">({total} total)</span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#001529] to-[#003380] flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-[#f59e08]" />
                </div>
                <p className="text-slate-500 font-semibold">Fetching professional reports…</p>
              </div>
            ) : filteredDigests.length === 0 ? (
              <div className="py-24 text-center bg-white rounded-3xl border border-slate-200">
                <div className="w-16 h-16 rounded-2xl bg-[#001529]/08 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-[#001529]/30" />
                </div>
                <h3 className="text-xl font-black text-[#001529] mb-2">No matching reports found</h3>
                <p className="text-slate-400 font-medium mb-4">Try adjusting your search.</p>
                <button onClick={() => setSearch("")}
                  className="text-sm font-black text-[#f59e08] hover:underline">Clear Search</button>
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredDigests.map((digest, i) => (
                    <motion.div key={digest.id} layout custom={i} initial="hidden" animate="visible" exit={{ opacity: 0, scale: 0.9 }} variants={fadeUp}
                      className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all flex flex-col">
                      {/* Image */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                        {digest.image ? (
                          <img src={`/${digest.image}`} alt={digest.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg, rgba(0,21,41,0.08), rgba(0,51,128,0.12))" }}>
                            <Newspaper className="h-12 w-12 text-[#001529]/20" />
                          </div>
                        )}
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          {digest.pdf && (
                            <>
                              <a href={`/${digest.pdf}`} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#001529] text-xs font-black hover:bg-white/90 transition-all">
                                <Eye className="h-3.5 w-3.5" /> View PDF
                              </a>
                              <a href={`/${digest.pdf}`} download
                                className="w-9 h-9 rounded-xl bg-[#f59e08] text-[#001529] flex items-center justify-center hover:bg-[#d97706] transition-all">
                                <Download className="h-4 w-4" />
                              </a>
                            </>
                          )}
                        </div>
                        {/* Date badge */}
                        <div className="absolute top-3 left-3">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 shadow-sm">
                            <Calendar className="h-3 w-3 text-[#f59e08]" />
                            <span className="text-[10px] font-black text-[#001529] uppercase tracking-wide">
                              {new Date(digest.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                        </div>
                        {/* Top accent */}
                        <div className="absolute top-0 left-0 right-0 h-0.5"
                          style={{ background: "linear-gradient(90deg, #001529, #f59e08)" }} />
                      </div>
                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-black text-[#001529] text-sm leading-snug line-clamp-2 mb-3 group-hover:text-[#f59e08] transition-colors flex-1">
                          {digest.title}
                        </h3>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          {digest.pdf ? (
                            <a href={`/${digest.pdf}`} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-black text-[#001529] hover:text-[#f59e08] transition-colors">
                              Open Report <ArrowRight className="h-3.5 w-3.5" />
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Coming soon…</span>
                          )}
                          {digest.pdf && <FileText className="h-4 w-4 text-red-400" />}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
                  className="px-5 h-11 rounded-xl font-black text-sm bg-[#001529] text-white hover:bg-[#002147] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1">
                  <ChevronRight className="h-4 w-4 rotate-180" /> Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)}
                    className="w-11 h-11 rounded-xl text-sm font-black transition-all"
                    style={p === page
                      ? { background: "#f59e08", color: "#001529", boxShadow: "0 4px 12px rgba(245,158,8,0.35)" }
                      : { background: "#f1f5f9", color: "#475569" }}>
                    {p}
                  </button>
                ))}
                <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}
                  className="px-5 h-11 rounded-xl font-black text-sm bg-[#001529] text-white hover:bg-[#002147] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1">
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-gradient-to-r from-[#001529] via-[#002147] to-[#003380] py-20 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
              style={{ background: "#f59e08", filter: "blur(80px)", transform: "translate(20%,-30%)" }} />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Expert <span className="text-[#f59e08]">IPO Guidance</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto text-base font-medium mb-10">
              Navigating the IPO journey requires precision and expertise. Let our seasoned professionals help you achieve your public listing goals.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact"
                className="inline-flex items-center gap-2 px-8 h-14 rounded-xl font-black text-base transition-all hover:scale-105 shadow-2xl"
                style={{ background: "linear-gradient(135deg, #f59e08, #d97706)", color: "#001529", boxShadow: "0 8px 32px rgba(245,158,8,0.35)" }}>
                Get Free Consultation <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/ipo-feasibility"
                className="inline-flex items-center gap-2 px-8 h-14 rounded-xl font-black text-base text-white border border-white/25 hover:bg-white/10 transition-all">
                Check Feasibility
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DailyReporter;
