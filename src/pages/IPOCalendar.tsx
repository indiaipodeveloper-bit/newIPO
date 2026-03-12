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

const statusColor: Record<string, string> = {
  Open: "bg-green-500/10 text-green-600 border-green-200",
  Upcoming: "bg-blue-500/10 text-blue-600 border-blue-200",
  Closed: "bg-red-500/10 text-red-600 border-red-200",
  Listed: "bg-purple-500/10 text-purple-600 border-purple-200",
  Active: "bg-green-500/10 text-green-600 border-green-200",
};

const formatDate = (dateStr: any, options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' }) => {
  if (!dateStr || dateStr === "0" || dateStr === 0) return 'TBA';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? 'TBA' : d.toLocaleDateString('en-IN', options);
};

const IPOCalendar = () => {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 0 });

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
        <section className="bg-gradient-to-br from-[#001529] to-[#003366] pt-16 pb-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 transform translate-x-20"></div>
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

            {/* Premium Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                    <th className="px-8 py-5 text-left font-bold text-xs uppercase tracking-widest whitespace-nowrap">Company & Sector</th>
                    <th className="px-8 py-5 text-left font-bold text-xs uppercase tracking-widest whitespace-nowrap">IPO Dates</th>
                    <th className="px-8 py-5 text-left font-bold text-xs uppercase tracking-widest whitespace-nowrap">Issue Size</th>
                    <th className="px-8 py-5 text-left font-bold text-xs uppercase tracking-widest whitespace-nowrap">Price Band</th>
                    <th className="px-8 py-5 text-left font-bold text-xs uppercase tracking-widest whitespace-nowrap">Expt. GMP</th>
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
                  ) : items.map((item, idx) => (
                    <tr key={item.id} className="group hover:bg-blue-50/30 transition-all cursor-default">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          {item.logo ? (
                            <div className="h-12 w-12 bg-white rounded-xl border border-slate-100 p-2 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                              <img src={String(item.logo)} alt="" className="max-h-full max-w-full object-contain" />
                            </div>
                          ) : (
                            <div className="h-12 w-12 bg-blue-600/5 rounded-xl border border-blue-600/10 flex items-center justify-center text-blue-600 font-black text-xl">
                              {String(item.issuer_company)[0]}
                            </div>
                          )}
                          <div>
                            <p className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">{item.issuer_company}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-bold text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                {item.exchange || 'BSE/NSE'}
                              </span>
                              <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter italic">
                                {item.sector_name || item.issue_category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">
                             {formatDate(item.open_date)} - {formatDate(item.close_date)}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                            Listing: {formatDate(item.listing_date, { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                           <span className="text-sm font-black text-slate-900">₹{item.issue_size || '0'} Cr</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Aggregate Issue</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                           <span className="text-sm font-bold text-slate-900">₹{item.issue_lowest_price || '0'} - {item.issue_highest_price || '0'}</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Lot: {item.lot_size || '0'} Shares</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex flex-col">
                            <span className={`text-base font-black ${Number(item.gmp) > 0 ? "text-green-600" : "text-slate-400"}`}>
                              {Number(item.gmp) > 0 ? `+₹${item.gmp}` : `₹${item.gmp || '0'}`}
                            </span>
                            <div className="flex items-center gap-1 mt-1">
                               <TrendingUp className={`h-2.5 w-2.5 ${Number(item.gmp) > 0 ? "text-green-600" : "text-slate-300"}`} />
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Current GMP</span>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <Badge className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${statusColor[String(item.status)] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
                           {item.status}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-10 py-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest hidden md:block">
                   Showing Page {pagination.page} of {pagination.totalPages}
                 </p>
                 <div className="flex items-center gap-2 mx-auto md:mx-0">
                    <Button 
                      variant="outline" 
                      onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                      disabled={pagination.page === 1}
                      className="rounded-xl h-12 px-6 border-slate-200 font-bold"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" /> Prev
                    </Button>
                    <div className="flex items-center gap-2 px-2 overflow-hidden">
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
                             <span key={`ell-${idx}`} className="text-slate-300 px-1">...</span>
                           ) : (
                             <button
                               key={p}
                               onClick={() => setPagination(prev => ({ ...prev, page: p }))}
                               className={`h-10 w-10 flex-shrink-0 rounded-xl text-sm font-black transition-all ${
                                 pagination.page === p ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "text-slate-400 hover:bg-slate-100"
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
                      className="rounded-xl h-12 px-6 border-slate-200 font-bold"
                    >
                      Next <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                 </div>
              </div>
            )}
          </div>
          
          {/* Analysis Info Bottom */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
             <div className="p-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <TrendingUp className="h-24 w-24" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">Deep Insight Engine</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  Click on the <span className="text-blue-600 font-bold">"Analyze"</span> button to access exhaustive fundamental analysis, GMP history, and company financials for each IPO. Our experts break down complex RHP data into actionable insights.
                </p>
             </div>
             <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] shadow-xl text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <CalendarIcon className="h-24 w-24 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-4">Real-time DB Sync</h3>
                <p className="text-white/80 leading-relaxed font-medium mb-6">
                  Our database is synchronized in true real-time with SEBI filings and exchange notifications. Never miss a price band discovery or an allotment date change ever again.
                </p>
                <div className="h-1 w-24 bg-[#FFD700] rounded-full"></div>
             </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default IPOCalendar;
