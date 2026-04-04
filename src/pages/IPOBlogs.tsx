import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getImageUrl } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Loader2, Calendar, TrendingUp, IndianRupee, ArrowRight, ChevronLeft, ChevronRight, Home, Newspaper, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getImgSrc } from "@/utils/image";

interface IPOBlog {
  id: string; title: string; slug: string;
  image: string; category: string; upcoming: string; status: string;
  gmp_date: string; gmp_ipo_price: string; gmp: string; created_at: string;
}

const isValid = (val: any) => {
  if (val === null || val === undefined) return false;
  const s = String(val).toLowerCase().trim();
  return s !== "null" && s !== "[null]" && s !== "" && s !== "undefined";
};

const N = "#001529", G = "#f59e08", G2 = "#d97706";

const IPOBlogs = () => {
  const [blogs, setBlogs] = useState<IPOBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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
    const fetch_ = async () => {
      setLoading(true);
      try {
        let url = `/api/admin-blogs?page=${page}&limit=12&summary=1`;
        if (filter === "current") url += "&upcoming=0";
        if (filter === "upcoming") url += "&upcoming=1";
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setBlogs(data.data || []);
          setTotalPages(data.totalPages || 1);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch_();
  }, [filter, page]);

  const filters = [
    { key: "all", label: "All IPOs" },
    { key: "current", label: "Current IPOs" },
    { key: "upcoming", label: "Upcoming IPOs" },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F8FAFC" }}>
      <SEOHead
        title="IPO Blogs & Updates | IndiaIPO — GMP, Reviews & Analysis"
        description="Read the latest updates, GMP reviews and comprehensive details about Current and Upcoming IPOs in India. Expert analysis and market insights."
        keywords="IPO blogs India, IPO GMP today, IPO review, current IPO list, upcoming IPO 2025, IPO analysis IndiaIPO"
      />
      <Header />

      {/* ── HERO ── */}
      <section className="py-14 relative overflow-hidden bg-[#001529]">
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
            <span className="text-white/90 font-semibold">IPO Blogs</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 text-xs font-black uppercase tracking-widest"
              style={{ background: "rgba(245,158,8,0.2)", color: G, border: "1px solid rgba(245,158,8,0.35)" }}>
              <Newspaper className="h-3.5 w-3.5" /> Market Insights
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-5 leading-tight">
              IPO Blogs & <span style={{ color: G }}>Updates</span>
            </h1>
            <p className="text-white/65 max-w-2xl mx-auto text-base md:text-lg font-medium leading-relaxed">
              Stay ahead of the market with comprehensive analysis, GMP tracking, and detailed reviews of all Current and Upcoming Initial Public Offerings.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="flex-1">
        {/* ── FILTERS ── */}
        <div className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex flex-wrap gap-3 justify-center">
            {filters.map(f => (
              <button key={f.key} onClick={() => { setFilter(f.key); setPage(1); }}
                className="px-6 h-10 rounded-xl text-sm font-black transition-all"
                style={filter === f.key
                  ? { background: `linear-gradient(135deg, ${N}, #003380)`, color: "white", boxShadow: "0 4px 16px rgba(0,21,41,0.25)" }
                  : { background: "#F8FAFC", color: "#64748b", border: "1px solid #e2e8f0" }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-12 h-12 border-4 rounded-full animate-spin mb-4"
                style={{ borderColor: `${N} transparent transparent transparent` }} />
              <p className="text-slate-400 font-semibold">Loading expert IPO insights…</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-24 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
              <TrendingUp className="h-14 w-14 mx-auto mb-4 text-slate-200" />
              <h3 className="text-xl font-black mb-2" style={{ color: N }}>No IPOs Found</h3>
              <p className="text-slate-400 font-medium">No IPO blogs match the current filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              <AnimatePresence>
                {blogs.map((blog, idx) => (
                  <motion.div key={blog.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}>
                    <Link to={`/ipo-blogs/${blog.slug || blog.id}`} className="block h-full group">
                      <div className="h-full bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all flex flex-col">
                        {/* Top accent */}
                        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${N}, ${G})` }} />

                        {/* Image */}
                        <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden flex items-center justify-center p-4">
                          {isValid(getImgSrc(blog.image)) ? (
                            <img src={getImgSrc(blog.image)!} alt={blog.title}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-16 h-16 rounded-full flex items-center justify-center"
                              style={{ background: "rgba(0,21,41,0.06)" }}>
                              <TrendingUp className="h-8 w-8 text-slate-300" />
                            </div>
                          )}
                          {/* Status badge */}
                          <div className="absolute top-3 right-3">
                            {blog.upcoming === "1" ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black"
                                style={{ background: "rgba(245,158,8,0.15)", color: G2, border: "1px solid rgba(245,158,8,0.3)" }}>
                                Upcoming
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black"
                                style={{ background: "rgba(34,197,94,0.12)", color: "#16a34a", border: "1px solid rgba(34,197,94,0.25)" }}>
                                Current
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Body */}
                        <div className="p-4 flex-1 flex flex-col">
                          <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: G2 }}>
                            {(blog.category || "IPO").replace("_", " ")}
                          </div>
                          <h3 className="font-black text-sm leading-snug mb-3 line-clamp-2 transition-colors group-hover:text-[#f59e08]"
                            style={{ color: N }} title={blog.title}>{blog.title}</h3>



                          <div className="mt-4 flex items-center gap-1 text-xs font-black opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
                            style={{ color: G }}>
                            Read Full Details <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="flex items-center gap-1 px-5 h-11 rounded-xl font-black text-sm text-white transition-all disabled:opacity-40"
                style={{ background: N }}>
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const p = i + 1;
                if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className="w-11 h-11 rounded-xl font-black text-sm transition-all"
                      style={p === page
                        ? { background: G, color: N, boxShadow: "0 4px 12px rgba(245,158,8,0.35)" }
                        : { background: "#f1f5f9", color: "#475569" }}>
                      {p}
                    </button>
                  );
                }
                if (p === page - 2 || p === page + 2) return <span key={p} className="text-slate-400">…</span>;
                return null;
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="flex items-center gap-1 px-5 h-11 rounded-xl font-black text-sm text-white transition-all disabled:opacity-40"
                style={{ background: N }}>
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ── CTA ── */}
      <section className="py-16 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${N}, #002147, #003380)` }}>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-black text-white mb-3">
            Planning Your <span style={{ color: G }}>IPO Journey?</span>
          </h2>
          <p className="text-white/60 max-w-lg mx-auto font-medium mb-8">
            Get expert advisory from SEBI-registered consultants and take the first step toward going public.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/ipo-feasibility"
              className="inline-flex items-center gap-2 px-8 h-14 rounded-xl font-black text-base transition-all hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${G}, ${G2})`, color: N, boxShadow: "0 8px 32px rgba(245,158,8,0.35)" }}>
              Check IPO Feasibility <Zap className="h-5 w-5" />
            </Link>
            <Link to="/contact"
              className="inline-flex items-center gap-2 px-8 h-14 rounded-xl font-black text-base text-white border border-white/25 hover:bg-white/10 transition-all">
              Contact Experts
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default IPOBlogs;
