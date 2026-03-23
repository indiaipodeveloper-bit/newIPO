import { useState, useEffect } from "react";
import { sectorApi } from "@/services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { LayoutGrid, Search, ArrowRight, ChevronRight, TrendingUp, BarChart3, Home, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

interface Sector {
  id: string; name: string; description: string;
  mainline_count: number; sme_count: number; total_count: number;
}

const N = "#001529", G = "#f59e08", G2 = "#d97706";

const Sectors = () => {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    sectorApi.getAll().then(setSectors).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = sectors.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  const totalMainline = sectors.reduce((a, s) => a + Number(s.mainline_count), 0);
  const totalSME      = sectors.reduce((a, s) => a + Number(s.sme_count), 0);
  const totalAll      = sectors.reduce((a, s) => a + Number(s.total_count), 0);

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      <SEOHead
        title="Sector-wise IPO List in India | IndiaIPO — Industry Analysis"
        description="Explore IPOs by industry sector. View mainline and SME IPO counts for all sectors in the Indian stock market with in-depth analysis."
        keywords="sector wise IPO list India, industry IPO analysis, IT sector IPO, BFSI IPO, manufacturing IPO India, SME mainboard sector"
      />
      <Header />
      <main>
        {/* ── HERO ── */}
        <section className="py-14 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${N} 0%, #002147 55%, #003380 100%)` }}>
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-5"
              style={{ background: G, filter: "blur(100px)", transform: "translate(25%,-25%)" }} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1"
            style={{ background: `linear-gradient(90deg, ${N}, ${G}, ${N})` }} />

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-2 text-white/50 text-sm mb-6 flex-wrap">
              <Link to="/" className="hover:text-white flex items-center gap-1 transition-colors">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white/70">Resources</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white/90 font-semibold">Sector-wise IPO</span>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 text-xs font-black uppercase tracking-widest"
                  style={{ background: "rgba(245,158,8,0.2)", color: G, border: "1px solid rgba(245,158,8,0.35)" }}>
                  <BarChart3 className="h-3.5 w-3.5" /> Industry Analysis
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
                  Sector-wise <span style={{ color: G }}>IPO List</span>
                </h1>
                <p className="text-white/60 mt-3 font-medium max-w-xl">
                  Analysis of Indian IPOs categorized by industry sectors and market segments for smarter investment decisions.
                </p>
              </div>
              <div className="relative w-full md:w-80 shrink-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  placeholder="Find a sector…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm font-medium focus:outline-none focus:bg-white/15 focus:border-[#f59e08]/50 transition-all"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── STATS ── */}
        {!loading && (
          <section style={{ background: `linear-gradient(135deg, ${N}, #003380)` }} className="py-8">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: LayoutGrid, val: sectors.length, lbl: "Total Sectors", c: "white" },
                  { icon: TrendingUp,  val: totalMainline,  lbl: "Mainline Issues", c: G },
                  { icon: Zap,         val: totalSME,       lbl: "SME IPO Issues",  c: G2 },
                  { icon: BarChart3,   val: totalAll,       lbl: "Cumulative Total",c: "white" },
                ].map((s, i) => (
                  <div key={i} className="flex flex-col items-center text-center py-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-2">
                      <s.icon className="h-5 w-5" style={{ color: G }} />
                    </div>
                    <p className="text-2xl font-black text-white mb-0.5">{s.val}</p>
                    <p className="text-xs text-white/50 font-bold uppercase tracking-wide">{s.lbl}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── TABLE ── */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-7 rounded-full" style={{ background: G }} />
              <h2 className="text-xl font-black" style={{ color: N }}>All Industry Sectors</h2>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              {/* Table toolbar */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4"
                style={{ background: `linear-gradient(135deg, ${N}, #003380)` }}>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" style={{ color: G }} />
                  <span className="font-black text-white text-sm">{filtered.length} Sectors</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: N }}>
                      {["Sector Information", "Mainline", "SME IPO", "Total Issues", "Action"].map((h, i) => (
                        <th key={h} className={`px-5 py-4 text-xs font-black uppercase tracking-widest whitespace-nowrap ${i === 0 ? "text-left" : i === 4 ? "text-right" : "text-center"}`}
                          style={{ color: G }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      [...Array(6)].map((_, i) => (
                        <tr key={i}>
                          <td colSpan={5} className="px-5 py-4">
                            <div className="h-4 bg-slate-100 animate-pulse rounded-lg w-full" />
                          </td>
                        </tr>
                      ))
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-16 text-center">
                          <LayoutGrid className="w-12 h-12 mx-auto mb-3 text-slate-200" />
                          <p className="text-slate-400 font-semibold">No sectors found matching your search.</p>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((sector, idx) => (
                        <tr key={sector.id}
                          className={`group hover:bg-[#f59e08]/05 transition-colors cursor-pointer ${idx % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}`}
                          onClick={() => navigate(`/reports?sector=${encodeURIComponent(sector.name)}`)}>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 rounded-xl transition-all group-hover:scale-110"
                                style={{ background: "rgba(0,21,41,0.06)" }}>
                                <LayoutGrid className="w-4 h-4 group-hover:text-[#f59e08] transition-colors" style={{ color: N }} />
                              </div>
                              <div>
                                <div className="font-black text-sm capitalize transition-colors group-hover:text-[#f59e08]"
                                  style={{ color: N }}>{sector.name.toLowerCase()}</div>
                                {sector.description && (
                                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-medium">{sector.description}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className="inline-flex items-center justify-center min-w-[36px] px-3 py-1 rounded-lg text-sm font-black"
                              style={{ background: "rgba(0,21,41,0.06)", color: N }}>
                              {sector.mainline_count}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className="inline-flex items-center justify-center min-w-[36px] px-3 py-1 rounded-lg text-sm font-black"
                              style={{ background: "rgba(245,158,8,0.1)", color: G2 }}>
                              {sector.sme_count}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className="text-base font-black" style={{ color: N }}>{sector.total_count}</span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-black transition-all group-hover:text-white"
                              style={{
                                borderColor: "rgba(0,21,41,0.15)",
                                color: N,
                              }}
                              onMouseEnter={e => {
                                (e.currentTarget as HTMLButtonElement).style.background = N;
                                (e.currentTarget as HTMLButtonElement).style.color = G;
                              }}
                              onMouseLeave={e => {
                                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                                (e.currentTarget as HTMLButtonElement).style.color = N;
                              }}>
                              Explore <ArrowRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CTA banner */}
            <div className="mt-10 p-8 rounded-2xl relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${N}, #003380)` }}>
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5"
                style={{ background: G, filter: "blur(60px)", transform: "translate(30%,-30%)" }} />
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div>
                  <h3 className="text-xl font-black text-white mb-1">Need expert consultation on your IPO journey?</h3>
                  <p className="text-white/55 text-sm font-medium">Our team guides you through the complexities of the public market.</p>
                </div>
                <button onClick={() => navigate("/ipo-feasibility")}
                  className="flex items-center gap-2 px-7 h-12 rounded-xl font-black text-sm transition-all hover:scale-105 shrink-0"
                  style={{ background: `linear-gradient(135deg, ${G}, ${G2})`, color: N, boxShadow: "0 4px 20px rgba(245,158,8,0.35)" }}>
                  Check IPO Feasibility <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Sectors;
