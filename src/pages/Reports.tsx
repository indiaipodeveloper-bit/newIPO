import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { getImageUrl } from "@/lib/utils";
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
import { getImgSrc } from "@/utils/image";

const statusColor: Record<string, string> = {
  Open: "bg-green-50 text-green-600 border-green-200",
  Upcoming: "bg-blue-50 text-blue-600 border-blue-200",
  Closed: "bg-red-50 text-red-600 border-red-200",
  Active: "bg-green-50 text-green-600 border-green-200",
};

const getCalculatedStatus = (item: any) => {
  if (item.status === 'Inactive') return 'Inactive';
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const openDate = item.open_date ? new Date(item.open_date) : null;
  const closeDate = item.close_date ? new Date(item.close_date) : null;
  if (openDate && now < openDate) return 'Upcoming';
  if (openDate && closeDate && now >= openDate && now <= closeDate) return 'Active';
  if (closeDate && now > closeDate) return 'Closed';
  return item.status || 'Active';
};

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sectorFilter = searchParams.get("sector");

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 0 });
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

  useEffect(() => { fetchData(); }, [slug, sectorFilter, pagination.page, search]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let params: any = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: search,
      };
      if (sectorFilter) params.sector_name = sectorFilter;
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
    if (sectorFilter) return `${sectorFilter} IPOs List`;
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
        <section className="bg-[#001529] py-14 relative overflow-hidden">
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

          <div className="absolute inset-0 pointer-events-none z-1">
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

              {/* Table (Desktop) */}
              <div className="overflow-x-auto hidden lg:block">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: "#001529" }}>
                      {["Company", "Dates", "Issue Size", "Price Band", "Lot Size", "Status"].map((h) => (
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
                      items.map((item, idx) => {
                        const displayStatus = getCalculatedStatus(item);
                        return (
                        <tr key={`desktop-${item.id}`}
                          onClick={() => item.blog_slug ? navigate(`/ipo-blogs/${item.blog_slug}`) : null}
                          className={`hover:bg-[#f59e08]/05 transition-colors group cursor-pointer ${idx % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}`}>
                          {/* Company */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {getImgSrc(item.logo || item.blog_image) ? (
                                <img src={getImgSrc(item.logo || item.blog_image)!} alt="" className="w-10 h-10 rounded-lg object-contain border border-slate-200 bg-white p-1 group-hover:scale-105 transition-transform" />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-[#001529]/08 flex items-center justify-center text-[#001529] font-black text-sm">
                                  {String(item.issuer_company || "?")[0]}
                                </div>
                              )}
                              <div>
                                <p className="font-black text-[#001529] text-sm group-hover:text-[#f59e08] transition-colors">{item.issuer_company}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase"
                                    style={{ background: "rgba(0,21,41,0.08)", color: "#001529" }}>
                                    {item.exchange || "BSE/NSE"}
                                  </span>
                                  {item.sector_name && (
                                    <span className="text-[9px] font-black italic text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tight ml-2">
                                      {item.sector_name}
                                    </span>
                                  )}
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
                            <span className="font-black text-[#001529]">
                              {item.issue_size && item.issue_size !== '0' ? `₹${item.issue_size} Cr` : "TBA"}
                            </span>
                          </td>
                          {/* Price Band */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-[#001529]">
                              {item.issue_lowest_price && item.issue_lowest_price !== '0' ? `₹${item.issue_lowest_price} – ₹${item.issue_highest_price}` : "TBA"}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5">Price Per Share</p>
                          </td>
                          {/* Lot Size */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="text-sm font-black text-[#001529] italic">
                              {item.lot_size || "TBA"}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5">Minimum Lot</p>
                          </td>
                          {/* Status */}
                          <td className="px-5 py-4 text-center">
                            <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-sm border ${
                              statusColor[String(displayStatus)] || "bg-slate-100 text-slate-500 border-slate-200"
                            }`}>
                              {displayStatus}
                            </span>
                          </td>
                        </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Cards Layout (Mobile Only) */}
              <div className="bg-[#F8FAFC]/30 p-4 border-slate-100 lg:hidden relative z-10 w-full overflow-hidden">
                {loading ? (
                  <div className="py-20 flex flex-col items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-[#f59e08] mb-4" />
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Fetching records...</span>
                  </div>
                ) : items.length === 0 ? (
                  <div className="py-20 text-center flex flex-col items-center justify-center">
                    <Info className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-[#001529] mb-1">No Matching IPOs</h3>
                    <p className="text-slate-500 text-sm">Try adjusting your filters to find what you're looking for.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((item, idx) => {
                      const displayStatus = getCalculatedStatus(item);
                      const statusLabel = displayStatus === "Active" ? "Open" : displayStatus;
                      
                      let borderColor = "border-slate-200";
                      let statusBg = "bg-slate-100";
                      let statusText = "text-slate-600";
                      let dotColor = "bg-slate-500";

                      if (displayStatus === "Open" || displayStatus === "Active") {
                        borderColor = "border-green-500";
                        statusBg = "bg-green-50";
                        statusText = "text-green-600";
                        dotColor = "bg-green-500";
                      } else if (displayStatus === "Upcoming") {
                        borderColor = "border-blue-500";
                        statusBg = "bg-blue-50";
                        statusText = "text-blue-600";
                        dotColor = "bg-blue-500";
                      } else if (displayStatus === "Closed") {
                        borderColor = "border-red-500";
                        statusBg = "bg-red-50";
                        statusText = "text-red-600";
                        dotColor = "bg-red-500";
                      } else if (displayStatus === "Listed") {
                        borderColor = "border-purple-500";
                        statusBg = "bg-purple-50";
                        statusText = "text-purple-600";
                        dotColor = "bg-purple-500";
                      }

                      const getInitials = (name: string) => {
                        if (!name) return '?';
                        return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
                      }

                      return (
                        <motion.div 
                          key={`mobile-${item.id}`} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`bg-white rounded-xl shadow-sm border border-slate-200 border-l-[5px] ${borderColor} transition-all overflow-hidden flex flex-col`}
                        >
                          {/* Top Section - Company, Sector, Status, Exchange */}
                          <div className="p-4 flex justify-between items-start gap-3 border-b border-slate-100/80 border-dashed">
                            <div className="flex items-start gap-3">
                              <div className="h-10 w-10 bg-[#001529] rounded-lg text-white flex items-center justify-center font-black text-xs shrink-0 overflow-hidden shadow-sm mt-0.5">
                                {getImgSrc(item.logo || item.blog_image) ? (
                                  <img src={getImgSrc(item.logo || item.blog_image)!} alt={item.issuer_company} className="h-full w-full object-contain bg-white p-1" />
                                ) : (
                                  getInitials(item.issuer_company)
                                )}
                              </div>
                              <div className="flex flex-col">
                                <h3 className="font-bold text-[#001529] text-[14px] leading-tight line-clamp-2">{item.issuer_company}</h3>
                                <span className="text-[9px] font-black italic text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tight mt-1.5 w-max">
                                  {item.sector_name || item.issue_category || 'Sector TBA'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <div className={`flex items-center gap-1.5 ${statusBg} ${statusText} px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest w-max`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${dotColor} animate-pulse`}></span>
                                {statusLabel}
                              </div>
                              <span className="bg-[#001529] text-[#f59e08] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider w-max shadow-sm">
                                {item.exchange || 'BSE/NSE'}
                              </span>
                            </div>
                          </div>

                          {/* Middle Section - IPO Dates, Size, Band, Lot size */}
                          <div className="p-4 grid grid-cols-2 gap-y-4 gap-x-3">
                            <div className="flex flex-col">
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">IPO Dates</p>
                              <p className="text-[12px] font-bold text-[#001529]">{formatDate(item.open_date)} - {formatDate(item.close_date)}</p>
                              <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Listing: {formatDate(item.listing_date, { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                            </div>
                            <div className="flex flex-col">
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Issue Size</p>
                              <p className="text-[12px] font-black text-blue-600">{item.issue_size && item.issue_size !== '0' && item.issue_size !== 0 ? `₹${item.issue_size} Cr.` : 'TBA'}</p>
                              <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Aggregate</p>
                            </div>
                            <div className="flex flex-col">
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Price Band</p>
                              <p className="text-[12px] font-bold text-[#001529]">{item.issue_lowest_price && item.issue_lowest_price !== '0' ? `₹${item.issue_lowest_price} - ₹${item.issue_highest_price}` : 'TBA'}</p>
                              <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Per Share</p>
                            </div>
                            <div className="flex flex-col">
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Lot Size</p>
                              <p className="text-[12px] font-bold text-[#001529]">{item.lot_size || 'TBA'}</p>
                              <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Minimum Lot</p>
                            </div>
                          </div>

                          {/* Bottom Section - Details */}
                          <div className="px-4 pb-4 mt-auto">
                            {item.blog_slug ? (
                              <Button asChild size="sm" className="w-full bg-[#001529] hover:bg-[#002147] text-[#f59e08] rounded-xl font-bold shadow-lg h-10 transition-colors">
                                <Link to={`/ipo-blogs/${item.blog_slug}`}>
                                  Analyze Details <ArrowUpRight className="h-4 w-4 ml-1.5" />
                                </Link>
                              </Button>
                            ) : (
                              <Button disabled size="sm" variant="outline" className="w-full rounded-xl font-bold text-slate-300 h-10 border-slate-200">
                                No Details Available
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="px-4 md:px-5 py-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between bg-[#F8FAFC] gap-4">
                  <p className="text-xs text-slate-400 font-semibold hidden md:block">
                    Page {pagination.page} of {pagination.totalPages}
                  </p>
                  <div className="flex items-center justify-between md:justify-end gap-1 md:gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                    <button onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                      disabled={pagination.page === 1}
                      className="flex items-center justify-center gap-1 px-2.5 md:px-4 h-9 min-w-[36px] rounded-xl font-black text-xs bg-[#001529] text-white hover:bg-[#002147] disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0">
                      <ChevronLeft className="h-4 w-4" /> <span className="hidden md:inline">Previous</span>
                    </button>
                    <div className="flex items-center gap-1 px-1">
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
                            <span key={`e${idx}`} className="px-0.5 md:px-1 text-slate-400 text-xs">…</span>
                          ) : (
                            <button key={p} onClick={() => setPagination((prev) => ({ ...prev, page: p }))}
                              className="w-8 h-8 md:w-9 md:h-9 shrink-0 rounded-xl text-xs font-black transition-all"
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
                      className="flex items-center justify-center gap-1 px-2.5 md:px-4 h-9 min-w-[36px] rounded-xl font-black text-xs bg-[#001529] text-white hover:bg-[#002147] disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0">
                      <span className="hidden md:inline">Next</span> <ChevronRightIcon className="h-4 w-4" />
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
