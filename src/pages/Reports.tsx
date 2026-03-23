import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home, ChevronRight, TrendingUp, Search, FileText, Calendar,
  BarChart3, PieChart, Info, Loader2, ChevronLeft,
  ChevronRight as ChevronRightIcon, ArrowUpRight,
} from "lucide-react";
import { ipoListApi } from "@/services/api";

const SPECIAL_SLUGS = [
  "ipo-calendar", "upcoming-ipo-calendar", "mainline-ipo-report",
  "sme-ipo-report", "sme-ipos-by-sector", "mainboard-ipos-by-sector",
];

const formatDate = (dateStr: any, options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short" }) => {
  if (!dateStr || dateStr === "0" || dateStr === 0) return "TBA";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? "TBA" : d.toLocaleDateString("en-IN", options);
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45 } }),
};

const Reports = () => {
  const { slug } = useParams();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 0 });

  useEffect(() => { fetchData(); }, [slug, pagination.page, search]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let params: any = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: search,
      };
      if (slug?.includes("by-sector")) params.sort = "sector_name";
      if (slug === "upcoming-ipo-calendar") params.upcoming = "1";
      else if (slug === "mainline-ipo-report") params.category = "mainline";
      else if (slug === "sme-ipo-report") params.category = "sme";
      else if (slug === "sme-ipos-by-sector") params.category = "sme";
      else if (slug === "mainboard-ipos-by-sector") params.category = "mainline";
      const res = await ipoListApi.getAll(params);
      setItems(res.data);
      setPagination((prev) => ({ ...prev, total: res.pagination.total, totalPages: res.pagination.totalPages }));
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const getTitle = () => {
    switch (slug) {
      case "upcoming-ipo-calendar": return "Upcoming IPO Calendar";
      case "mainline-ipo-report": return "Mainline IPO Report";
      case "sme-ipo-report": return "SME IPO Report";
      case "sme-ipos-by-sector": return "SME IPOs by Sector";
      case "mainboard-ipos-by-sector": return "Mainboard IPOs by Sector";
      default: return "IPO Calendar";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <SEOHead
        title={`${getTitle()} | IndiaIPO — Real-Time IPO Data`}
        description={`Detailed ${getTitle()} with company info, GMP, issue size, price band and more. Track all IPOs on IndiaIPO.`}
        keywords={`${getTitle()}, IPO calendar India, IPO list, BSE NSE IPO, SME IPO, mainboard IPO`}
      />
      <Header />

      <main>
        {/* ── HERO ── */}
        <section className="bg-gradient-to-br from-[#001529] via-[#002147] to-[#003380] py-14 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
              style={{ background: "#f59e08", filter: "blur(80px)", transform: "translate(25%,-25%)" }} />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-white/50 text-sm mb-6 flex-wrap">
              <Link to="/" className="hover:text-white flex items-center gap-1 transition-colors">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white/70">Reports</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white/90 font-semibold">{getTitle()}</span>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 bg-[#f59e08]/20 border border-[#f59e08]/30 rounded-full px-4 py-1.5 mb-5">
                <div className="w-2 h-2 rounded-full bg-[#f59e08] animate-pulse" />
                <span className="text-[#f59e08] text-xs font-black uppercase tracking-widest">Live Data</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">
                {getTitle().split(" ").map((word, i) => (
                  <span key={i} className={i % 2 === 1 ? "text-[#f59e08]" : ""}>{word} </span>
                ))}
              </h1>
              <p className="text-white/65 max-w-2xl font-medium">
                Professional real-time tracking of {getTitle().toLowerCase()} for smart investment decisions.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── TABLE SECTION ── */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            {/* Table card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              {/* Toolbar */}
              <div className="px-5 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4"
                style={{ background: "linear-gradient(135deg, #001529 0%, #003380 100%)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f59e08]/20 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-[#f59e08]" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-white">Live {getTitle()}</h2>
                    <p className="text-white/50 text-xs">{pagination.total} records found</p>
                  </div>
                </div>
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <input
                    placeholder="Search company name…"
                    className="w-full pl-10 pr-4 h-10 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm font-medium focus:outline-none focus:bg-white/15 focus:border-[#f59e08]/40 transition-all"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: "#001529" }}>
                      {["Company", "Dates", "Issue Size", "Price Band", "GMP", "Status"].map((h) => (
                        <th key={h} className="px-5 py-4 text-left text-[#f59e08] font-black text-xs uppercase tracking-widest whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-24 text-center">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#001529] to-[#003380] flex items-center justify-center mx-auto mb-4">
                            <Loader2 className="h-7 w-7 animate-spin text-[#f59e08]" />
                          </div>
                          <p className="text-slate-500 font-semibold">Fetching real-time data…</p>
                        </td>
                      </tr>
                    ) : items.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-24 text-center">
                          <Info className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                          <p className="text-slate-500 font-semibold">No records matching your search</p>
                        </td>
                      </tr>
                    ) : (
                      items.map((item, idx) => (
                        <tr key={item.id}
                          className={`hover:bg-[#f59e08]/05 transition-colors group ${idx % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}`}>
                          {/* Company */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {item.logo ? (
                                <img src={String(item.logo)} alt="" className="w-10 h-10 rounded-lg object-contain border border-slate-200 bg-white p-1 group-hover:scale-105 transition-transform" />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-[#001529]/08 flex items-center justify-center text-[#001529] font-black text-sm">
                                  {String(item.issuer_company)[0]}
                                </div>
                              )}
                              <div>
                                <p className="font-black text-[#001529] text-sm group-hover:text-[#f59e08] transition-colors">{item.issuer_company}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase"
                                    style={{ background: "rgba(0,21,41,0.08)", color: "#001529" }}>
                                    {item.exchange || "BSE/NSE"}
                                  </span>
                                  {item.sector_name && <span className="text-[9px] text-slate-400 uppercase font-semibold">{item.sector_name}</span>}
                                </div>
                              </div>
                            </div>
                          </td>
                          {/* Dates */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-[#001529]">
                              {formatDate(item.open_date)} – {formatDate(item.close_date)}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                              <Calendar className="h-2.5 w-2.5" />
                              Listing: {formatDate(item.listing_date, { day: "2-digit", month: "short", year: "numeric" })}
                            </p>
                          </td>
                          {/* Issue Size */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="font-black text-[#001529]">₹{item.issue_size || "0"}</span>
                            <span className="text-xs text-slate-400 ml-1">Cr</span>
                          </td>
                          {/* Price Band */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-[#001529]">
                              ₹{item.issue_lowest_price || "0"} – ₹{item.issue_highest_price || "0"}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5">Lot: {item.lot_size || "0"} shares</p>
                          </td>
                          {/* GMP */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className={`text-sm font-black ${Number(item.gmp) > 0 ? "text-green-600" : "text-red-500"}`}>
                              {Number(item.gmp) > 0 ? `+₹${item.gmp}` : `₹${item.gmp}`}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5">Current: ₹{item.current_price || "0"}</p>
                          </td>
                          {/* Status */}
                          <td className="px-5 py-4 text-center">
                            {item.blog_slug ? (
                              <Link to={`/ipo-blogs/${item.blog_slug}`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-black text-white transition-all hover:scale-105"
                                style={{ background: "linear-gradient(135deg, #001529, #003380)" }}>
                                Analyze <ArrowUpRight className="h-3 w-3" />
                              </Link>
                            ) : (
                              <span className={`inline-block px-3 py-1.5 rounded-full text-[10px] font-black uppercase ${
                                String(item.status).toLowerCase() === "active"
                                  ? "bg-green-50 text-green-600 border border-green-200"
                                  : "bg-slate-100 text-slate-500"
                              }`}>
                                {item.status}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between bg-[#F8FAFC]">
                  <p className="text-xs text-slate-400 font-semibold hidden md:block">
                    Page {pagination.page} of {pagination.totalPages}
                  </p>
                  <div className="flex items-center gap-2 mx-auto md:mx-0">
                    <button onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                      disabled={pagination.page === 1}
                      className="flex items-center gap-1 px-4 h-9 rounded-xl font-black text-xs bg-[#001529] text-white hover:bg-[#002147] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                      <ChevronLeft className="h-4 w-4" /> Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {(() => {
                        const pages: any[] = [];
                        const { page, totalPages } = pagination;
                        const delta = 1;
                        for (let i = 1; i <= totalPages; i++) {
                          if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
                            if (pages.length > 0 && i - pages[pages.length - 1] > 1) pages.push(-1);
                            pages.push(i);
                          }
                        }
                        return pages.map((p, idx) =>
                          p === -1 ? (
                            <span key={`e${idx}`} className="px-1 text-slate-400 text-xs">…</span>
                          ) : (
                            <button key={p} onClick={() => setPagination((prev) => ({ ...prev, page: p }))}
                              className="w-9 h-9 rounded-xl text-xs font-black transition-all"
                              style={pagination.page === p
                                ? { background: "#f59e08", color: "#001529" }
                                : { background: "#f1f5f9", color: "#475569" }}>
                              {p}
                            </button>
                          )
                        );
                      })()}
                    </div>
                    <button onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                      disabled={pagination.page >= pagination.totalPages}
                      className="flex items-center gap-1 px-4 h-9 rounded-xl font-black text-xs bg-[#001529] text-white hover:bg-[#002147] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                      Next <ChevronRightIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Info cards under table */}
            <div className="mt-10 grid md:grid-cols-3 gap-6">
              {[
                { icon: PieChart, title: "Professional Analysis", desc: "Every IPO record is verified and tracked with precision to give you the most accurate prediction of listing gains and market sentiment.", gold: false },
                { icon: Calendar, title: "Real-Time Updates", desc: "Our database is updated daily with the latest GMP, price adjustments, and listing dates as soon as they are announced by SEBI.", gold: false },
                { icon: TrendingUp, title: "IPO Feasibility", desc: "Curious about your own company's IPO journey? Let our experts guide you through complex SEBI regulations.", gold: true },
              ].map((c, i) => (
                <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className={`p-6 rounded-2xl border ${c.gold
                    ? "border-[#f59e08]/30 bg-gradient-to-br from-[#001529] to-[#003380] text-white"
                    : "border-slate-200 bg-white"}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${c.gold ? "bg-[#f59e08]/20" : "bg-gradient-to-br from-[#001529] to-[#003380]"}`}>
                    <c.icon className={`h-6 w-6 ${c.gold ? "text-[#f59e08]" : "text-[#f59e08]"}`} />
                  </div>
                  <h3 className={`text-lg font-black mb-2 ${c.gold ? "text-[#f59e08]" : "text-[#001529]"}`}>{c.title}</h3>
                  <p className={`text-sm leading-relaxed mb-4 ${c.gold ? "text-white/60" : "text-slate-500"}`}>{c.desc}</p>
                  {c.gold && (
                    <Link to="/ipo-feasibility"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-sm text-[#001529] transition-all hover:scale-105"
                      style={{ background: "linear-gradient(135deg, #f59e08, #d97706)" }}>
                      Check Eligibility Now
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Reports;
