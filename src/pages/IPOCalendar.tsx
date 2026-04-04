import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Loader2, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter, TrendingUp, FileText, ArrowUpRight, Home } from "lucide-react";
import { ipoListApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { getImgSrc } from "@/utils/image";
import { getImageUrl } from "@/lib/utils";

const statusColor: Record<string, string> = {
  Open: "bg-green-500/10 text-green-600 border-green-200",
  Upcoming: "bg-blue-500/10 text-blue-600 border-blue-200",
  Closed: "bg-red-500/10 text-red-600 border-red-200",
  Listed: "bg-purple-500/10 text-purple-600 border-purple-200",
  Active: "bg-green-500/10 text-green-600 border-green-200",
};

const getCalculatedStatus = (item: any) => {
  if (item.status === 'Inactive') return 'Inactive';
  const now = new Date();
  now.setHours(0, 0, 0, 0); // focus on dates
  
  const openDate = item.open_date ? new Date(item.open_date) : null;
  const closeDate = item.close_date ? new Date(item.close_date) : null;
  
  if (openDate && now < openDate) return 'Upcoming';
  if (openDate && closeDate && now >= openDate && now <= closeDate) return 'Active';
  if (closeDate && now > closeDate) return 'Closed';
  
  return item.status || 'Active';
};

const formatDate = (dateStr: any, options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' }) => {
  if (!dateStr || dateStr === "0" || dateStr === 0) return 'TBA';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? 'TBA' : d.toLocaleDateString('en-IN', options);
};

const IPOCalendar = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
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

  useEffect(() => {
    fetchData();
  }, [pagination.page, search, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await ipoListApi.getAll({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: search,
        status: statusFilter === "all" ? "" : statusFilter
      });
      setItems(res.data);
      setPagination(prev => ({ ...prev, total: res.pagination.total, totalPages: res.pagination.totalPages }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <SEOHead
        title="IPO Calendar - Real-time Master Schedule | IndiaIPO"
        description="Track all upcoming and current Mainline & SME IPOs. Detailed schedule with dates, gmp, price band and professional analysis."
      />
      <Header />

      <main>
        {/* Modern Hero Section */}
        <section className="bg-[#001529] pt-16 pb-32 relative overflow-hidden">
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

          <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 transform translate-x-20 z-1"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-2 text-white/50 text-sm mb-6">
              <Link to="/" className="hover:text-white flex items-center gap-1"><Home className="h-3 w-3" /> Home</Link>
              <span>/</span>
              <span className="text-white">IPO Calendar</span>
            </div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight"
            >
              Master <span className="text-[#FFD700]">IPO Schedule</span>
            </motion.h1>
            <p className="text-white/70 max-w-2xl text-lg md:text-xl font-medium">
              Your real-time command center for Mainline and SME IPO listings. Track every milestone from announcement to listing.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 -mt-10 mb-20 relative z-20">
          <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 border border-slate-200 overflow-hidden">

            {/* Control Bar */}
            <div className="p-6 md:p-10 border-b border-slate-100 bg-white flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <CalendarIcon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 leading-none">Live Calendar</h2>
                  <p className="text-slate-500 mt-2 font-medium">{pagination.total} Upcoming & Active Issues</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    placeholder="Search company..."
                    className="pl-12 h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all text-base"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
                  />
                </div>
                <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPagination(p => ({ ...p, page: 1 })); }}>
                  <SelectTrigger className="w-full sm:w-[180px] h-14 rounded-2xl border-slate-200 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-blue-600" />
                      <SelectValue placeholder="Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Issues</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Upcoming">Upcoming</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Premium Table Content (Desktop Only) */}
            <div className="overflow-x-auto hidden lg:block">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                    <th className="px-8 py-5 text-left font-bold text-xs uppercase tracking-widest whitespace-nowrap">Company & Sector</th>
                    <th className="px-8 py-5 text-left font-bold text-xs uppercase tracking-widest whitespace-nowrap">IPO Dates</th>
                    <th className="px-8 py-5 text-left font-bold text-xs uppercase tracking-widest whitespace-nowrap">Issue Size</th>
                    <th className="px-8 py-5 text-left font-bold text-xs uppercase tracking-widest whitespace-nowrap">Price Band</th>
                    <th className="px-8 py-5 text-left font-bold text-xs uppercase tracking-widest whitespace-nowrap">Lot Size</th>
                    <th className="px-8 py-5 text-center font-bold text-xs uppercase tracking-widest whitespace-nowrap">Status</th>
                    <th className="px-8 py-5 text-right font-bold text-xs uppercase tracking-widest whitespace-nowrap">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-32 text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                        <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing with Exchange...</span>
                      </td>
                    </tr>
                  ) : items.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-32 text-center">
                        <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                          <FileText className="h-10 w-10" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Matching IPOs</h3>
                        <p className="text-slate-400">Try adjusting your filters to find what you're looking for.</p>
                      </td>
                    </tr>
                  ) : items.map((item, idx) => {
                    const displayStatus = getCalculatedStatus(item);
                    return (
                    <motion.tr 
                      key={`desktop-${item.id}`} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.002, backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                      className="group transition-all cursor-pointer border-b border-slate-50" 
                      onClick={() => item.blog_slug ? navigate(`/ipo-blogs/${item.blog_slug}`) : null}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          {getImgSrc(item.logo || item.blog_image) ? (
                            <div className="h-12 w-12 bg-white rounded-xl border border-slate-100 p-2 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                              <img src={getImgSrc(item.logo || item.blog_image)!} alt="" className="max-h-full max-w-full object-contain" />
                            </div>
                          ) : (
                            <div className="h-12 w-12 bg-blue-600/5 rounded-xl border border-blue-600/10 flex items-center justify-center text-blue-600 font-black text-xl">
                              {String(item.issuer_company || '?')[0]}
                            </div>
                          )}
                          <div>
                            <p className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">{item.issuer_company}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-bold text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                {item.exchange || 'BSE/NSE'}
                              </span>
                                  <span className="text-[10px] font-black italic text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tight">
                                    {item.sector_name || item.issue_category}
                                  </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700">
                            {formatDate(item.open_date)} - {formatDate(item.close_date)}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                            Listing: {formatDate(item.listing_date, { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col text-slate-900">
                          <span className="text-sm font-black italic">
                            {item.issue_size && item.issue_size !== '0' && item.issue_size !== 0 ? `₹${item.issue_size} Cr` : 'TBA'}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Aggregate Issue</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col text-slate-900">
                          <span className="text-sm font-bold">
                            {item.issue_lowest_price && item.issue_lowest_price !== '0' ? `₹${item.issue_lowest_price} - ${item.issue_highest_price}` : 'TBA'}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">Price Per Share</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col text-slate-900">
                          <span className="text-sm font-black italic">
                            {item.lot_size || 'TBA'}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">Minimum Lot</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <Badge className={`rounded-full px-4 py-1.5 text-[10px] shadow-sm font-black uppercase tracking-widest border ${statusColor[String(displayStatus)] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
                          {displayStatus}
                        </Badge>
                      </td>
                      <td className="px-8 py-6 text-right">
                        {item.blog_slug ? (
                          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold px-4 shadow-lg shadow-blue-600/10">
                            <Link to={`/ipo-blogs/${item.blog_slug}`}>
                              Analyze <ArrowUpRight className="h-4 w-4 ml-1.5" />
                            </Link>
                          </Button>
                        ) : (
                          <Button disabled size="sm" variant="outline" className="rounded-xl font-bold text-slate-300 px-4">
                            No Details
                          </Button>
                        )}
                      </td>
                    </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Premium Card Layout (Replacing Table for Mobile First) */}
            <div className="bg-[#f8fafc]/50 p-4 border-t border-slate-100 lg:hidden">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center">
                  <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                  <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing with Exchange...</span>
                </div>
              ) : items.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center justify-center">
                  <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                    <FileText className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">No Matching IPOs</h3>
                  <p className="text-slate-500 text-sm">Try adjusting your filters to find what you're looking for.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
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
                            <div className="h-10 w-10 bg-[#1A202C] rounded-lg text-white flex items-center justify-center font-black text-xs shrink-0 overflow-hidden shadow-sm mt-0.5">
                              {getImgSrc(item.logo || item.blog_image) ? (
                                <img src={getImgSrc(item.logo || item.blog_image)!} alt={item.issuer_company} className="h-full w-full object-contain bg-white p-1" />
                              ) : (
                                getInitials(item.issuer_company)
                              )}
                            </div>
                            <div className="flex flex-col">
                              <h3 className="font-bold text-slate-900 text-[14px] leading-tight line-clamp-2">{item.issuer_company}</h3>
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
                            <span className="bg-[#1A202C] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider w-max shadow-sm">
                              {item.exchange || 'BSE/NSE'}
                            </span>
                          </div>
                        </div>

                        {/* Middle Section - IPO Dates, Size, Band, Lot size */}
                        <div className="p-4 grid grid-cols-2 gap-y-4 gap-x-3">
                          <div className="flex flex-col">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">IPO Dates</p>
                            <p className="text-[12px] font-bold text-slate-800">{formatDate(item.open_date)} - {formatDate(item.close_date)}</p>
                            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Listing: {formatDate(item.listing_date, { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Issue Size</p>
                            <p className="text-[12px] font-black text-blue-600">{item.issue_size && item.issue_size !== '0' && item.issue_size !== 0 ? `₹${item.issue_size} Cr.` : 'TBA'}</p>
                            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Aggregate</p>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Price Band</p>
                            <p className="text-[12px] font-bold text-slate-800">{item.issue_lowest_price && item.issue_lowest_price !== '0' ? `₹${item.issue_lowest_price} - ₹${item.issue_highest_price}` : 'TBA'}</p>
                            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Per Share</p>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Lot Size</p>
                            <p className="text-[12px] font-bold text-slate-800">{item.lot_size || 'TBA'}</p>
                            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Minimum Lot</p>
                          </div>
                        </div>

                        {/* Bottom Section - Details */}
                        <div className="px-4 pb-4 mt-auto">
                          {item.blog_slug ? (
                            <Button asChild size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/10 h-10">
                              <Link to={`/ipo-blogs/${item.blog_slug}`}>
                                Analyze Details <ArrowUpRight className="h-4 w-4 ml-1.5" />
                              </Link>
                            </Button>
                          ) : (
                            <Button disabled size="sm" variant="outline" className="w-full rounded-xl font-bold text-slate-300 h-10">
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
              <div className="px-4 md:px-10 py-6 md:py-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between bg-slate-50/30 gap-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest hidden md:block">
                  Showing Page {pagination.page} of {pagination.totalPages}
                </p>
                <div className="flex items-center justify-between md:justify-end gap-1.5 md:gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                  <Button
                    variant="outline"
                    onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="rounded-xl h-10 px-3 md:h-12 md:px-6 border-slate-200 font-bold shrink-0"
                  >
                    <ChevronLeft className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Prev</span>
                  </Button>
                  <div className="flex items-center gap-1 md:gap-2 px-1">
                    {(() => {
                      const pages = [];
                      const { page, totalPages } = pagination;
                      const delta = 1; // Number of pages to show around current page

                      for (let i = 1; i <= totalPages; i++) {
                        if (
                          i === 1 ||
                          i === totalPages ||
                          (i >= page - delta && i <= page + delta)
                        ) {
                          if (pages.length > 0 && i - pages[pages.length - 1] > 1) {
                            pages.push(-1); // Indicator for ellipsis
                          }
                          pages.push(i);
                        }
                      }

                      return pages.map((p, idx) => (
                        p === -1 ? (
                          <span key={`ell-${idx}`} className="text-slate-300 px-1 text-xs md:text-sm">...</span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => setPagination(prev => ({ ...prev, page: p }))}
                            className={`h-9 w-9 md:h-10 md:w-10 flex-shrink-0 rounded-xl text-xs md:text-sm font-black transition-all ${pagination.page === p ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "text-slate-400 hover:bg-slate-100"
                              }`}
                          >
                            {p}
                          </button>
                        )
                      ));
                    })()}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                    disabled={pagination.page >= pagination.totalPages}
                    className="rounded-xl h-10 px-3 md:h-12 md:px-6 border-slate-200 font-bold shrink-0"
                  >
                    <span className="hidden md:inline">Next</span> <ChevronRight className="h-4 w-4 md:ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Analysis Info Bottom */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="p-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group transition-all"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <TrendingUp className="h-24 w-24" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">Deep Insight Engine</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                Click on the <span className="text-blue-600 font-bold">"Analyze"</span> button to access exhaustive fundamental analysis, GMP history, and company financials for each IPO. Our experts break down complex RHP data into actionable insights.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] shadow-xl text-white relative overflow-hidden group transition-all"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <CalendarIcon className="h-24 w-24 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-4">Real-time DB Sync</h3>
              <p className="text-white/80 leading-relaxed font-medium mb-6">
                Our database is synchronized in true real-time with SEBI filings and exchange notifications. Never miss a price band discovery or an allotment date change ever again.
              </p>
              <div className="h-1 w-24 bg-[#FFD700] rounded-full"></div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default IPOCalendar;
