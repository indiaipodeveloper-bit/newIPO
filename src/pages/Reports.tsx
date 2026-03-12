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
  BarChart3, PieChart, Info, Loader2, ChevronLeft, ChevronRight as ChevronRightIcon,
  ArrowUpRight
} from "lucide-react";
import { ipoListApi } from "@/services/api";

const SPECIAL_SLUGS = [
  "ipo-calendar",
  "upcoming-ipo-calendar",
  "mainline-ipo-report",
  "sme-ipo-report",
  "sme-ipos-by-sector",
  "mainboard-ipos-by-sector"
];

const formatDate = (dateStr: any, options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' }) => {
  if (!dateStr || dateStr === "0" || dateStr === 0) return 'TBA';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? 'TBA' : d.toLocaleDateString('en-IN', options);
};

const Reports = () => {
  const { slug } = useParams();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 0 });

  useEffect(() => {
    fetchData();
  }, [slug, pagination.page, search]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let params: any = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: search
      };

      if (slug?.includes("by-sector")) {
        params.sort = "sector_name";
      }

      // Set filters based on slug
      if (slug === "upcoming-ipo-calendar") {
        params.upcoming = "1";
      } else if (slug === "mainline-ipo-report") {
        params.category = "mainline";
      } else if (slug === "sme-ipo-report") {
        params.category = "sme";
      } else if (slug === "sme-ipos-by-sector") {
        params.category = "sme";
        // Sectors are usually handled by sorting or specific filters, here we'll just ensure it's SME
      } else if (slug === "mainboard-ipos-by-sector") {
        params.category = "mainline"; // Mainboard and Mainline often used interchangeably here
      }

      const res = await ipoListApi.getAll(params);
      setItems(res.data);
      setPagination(prev => ({ ...prev, total: res.pagination.total, totalPages: res.pagination.totalPages }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch(slug) {
      case "upcoming-ipo-calendar": return "Upcoming IPO Calendar";
      case "mainline-ipo-report": return "Mainline IPO Report";
      case "sme-ipo-report": return "SME IPO Report";
      case "sme-ipos-by-sector": return "SME IPOs by Sector";
      case "mainboard-ipos-by-sector": return "Mainboard IPOs by Sector";
      default: return "IPO Reports";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title={`${getTitle()} - IndiaIPO`}
        description={`Detailed ${getTitle()} including company info, gmp, issue size and more.`}
      />
      <Header />
      <main>
        <section className="bg-gradient-to-r from-[#001529] via-[#002140] to-[#003366] py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-sm text-white/70 mb-6">
              <Link to="/" className="flex items-center gap-1 hover:text-white transition-colors">
                <Home className="h-4 w-4" /> Home
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link to="/reports" className="hover:text-white">Reports</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white font-medium">{getTitle()}</span>
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-bold text-white tracking-tight"
            >
              {getTitle().split(' ').map((word, i) => (
                <span key={i} className={i % 2 === 1 ? "text-[#FFD700]" : ""}>{word} </span>
              ))}
            </motion.h1>
            <p className="text-white/60 mt-3 max-w-2xl">
              Professional real-time tracking of {getTitle().toLowerCase()} for smart investment decisions.
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
              {/* Toolbar */}
              <div className="p-4 md:p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Live {getTitle()}</h2>
                    <p className="text-xs text-muted-foreground">{pagination.total} records found</p>
                  </div>
                </div>
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search company name..." 
                    className="pl-10 h-11 rounded-xl"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
                  />
                </div>
              </div>

              {/* Unique Table Styling */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#001529] text-white">
                      <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">Company</th>
                      <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">Dates</th>
                      <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">Issue Size</th>
                      <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">Price Band</th>
                      <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">GMP</th>
                      <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-24 text-center">
                          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
                          <p className="text-muted-foreground font-medium">Fetching real-time data...</p>
                        </td>
                      </tr>
                    ) : items.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-24 text-center">
                          <Info className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
                          <p className="text-muted-foreground font-medium">No records matching your search</p>
                        </td>
                      </tr>
                    ) : items.map((item, idx) => (
                      <tr key={item.id} className={`hover:bg-primary/5 transition-colors group ${idx % 2 === 0 ? "bg-background" : "bg-muted/10"}`}>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            {item.logo ? (
                              <img src={String(item.logo)} alt="" className="w-10 h-10 rounded-lg object-contain border border-border bg-white p-1 group-hover:scale-110 transition-transform" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {String(item.issuer_company)[0]}
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer">{item.issuer_company}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-[10px] py-0">{item.exchange || 'BSE/NSE'}</Badge>
                                {item.sector_name && <span className="text-[10px] text-muted-foreground uppercase">{item.sector_name}</span>}
                                {(!item.sector_name && item.issue_category) && <span className="text-[10px] text-muted-foreground capitalize">{item.issue_category}</span>}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm font-medium text-foreground">
                            {formatDate(item.open_date)} - {formatDate(item.close_date)}
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1">Listing: {formatDate(item.listing_date, { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className="font-bold text-foreground">₹{item.issue_size || '0'}</span>
                          <span className="text-[10px] text-muted-foreground ml-1">Cr</span>
                        </td>
                        <td className="px-6 py-5">
                           <div className="text-sm font-semibold text-foreground">
                             ₹{item.issue_lowest_price || '0'} - ₹{item.issue_highest_price || '0'}
                           </div>
                           <p className="text-[10px] text-muted-foreground mt-1">Lot: {item.lot_size || '0'} Shares</p>
                        </td>
                        <td className="px-6 py-5">
                          <div className={`text-sm font-bold ${Number(item.gmp) > 0 ? "text-success" : "text-destructive"}`}>
                            {Number(item.gmp) > 0 ? `+₹${item.gmp}` : `₹${item.gmp}`}
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1">Current Price: ₹{item.current_price || '0'}</p>
                        </td>
                        <td className="px-6 py-5 text-center">
                          {item.blog_slug ? (
                            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-lg font-bold px-3 py-0 h-8 text-[10px] uppercase tracking-wider shadow-lg shadow-primary/20">
                              <Link to={`/ipo-blogs/${item.blog_slug}`}>Analyze <ArrowUpRight className="h-3 w-3 ml-1" /></Link>
                            </Button>
                          ) : (
                            <Badge className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                              String(item.status).toLowerCase() === 'active' ? "bg-success/10 text-success border-success/30" : "bg-muted text-muted-foreground border-border"
                            }`}>
                              {item.status}
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="p-4 md:p-6 border-t border-border flex items-center justify-between">
                  <p className="text-sm text-muted-foreground hidden md:block">
                    Showing Page {pagination.page} of {pagination.totalPages}
                  </p>
                  <div className="flex items-center gap-2 mx-auto md:mx-0">
                    <Button 
                      variant="outline" 
                      onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                      disabled={pagination.page === 1}
                      className="rounded-xl"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {(() => {
                        const pages = [];
                        const { page, totalPages } = pagination;
                        const delta = 1;
                        
                        for (let i = 1; i <= totalPages; i++) {
                          if (
                            i === 1 || 
                            i === totalPages || 
                            (i >= page - delta && i <= page + delta)
                          ) {
                            if (pages.length > 0 && i - pages[pages.length - 1] > 1) {
                              pages.push(-1);
                            }
                            pages.push(i);
                          }
                        }
                        
                        return pages.map((p, idx) => (
                          p === -1 ? (
                            <span key={`ell-${idx}`} className="text-muted-foreground px-1">...</span>
                          ) : (
                            <Button
                              key={p}
                              variant={pagination.page === p ? "default" : "ghost"}
                              size="sm"
                              onClick={() => setPagination(prev => ({ ...prev, page: p }))}
                              className="h-9 w-9 rounded-lg flex-shrink-0"
                            >
                              {p}
                            </Button>
                          )
                        ));
                      })()}
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                      disabled={pagination.page >= pagination.totalPages}
                      className="rounded-xl"
                    >
                      Next <ChevronRightIcon className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-12 grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-[#001529]/5 rounded-3xl border border-primary/10">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-primary/30">
                  <PieChart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-[#001529] mb-3">Professional Analysis</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Every IPO record is verified and tracked with precision to give you the most accurate prediction of listing gains and market sentiment.
                </p>
              </div>
              
              <div className="p-6 bg-[#001529]/5 rounded-3xl border border-primary/10">
                <div className="w-12 h-12 bg-[#FFD700] rounded-2xl flex items-center justify-center text-[#001529] mb-6 shadow-lg shadow-[#FFD700]/30">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-[#001529] mb-3">Real-time Updates</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Our database is updated daily with the latest GMP, price adjustments, and listing dates as soon as they are announced by SEBI.
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-[#001529] to-[#003366] rounded-3xl text-white shadow-xl">
                 <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-[#FFD700]">
                   <TrendingUp className="h-5 w-5" />
                   IPO Feasibility
                 </h3>
                 <p className="text-white/70 text-sm mb-6">
                   Curious about your own company's IPO journey? Let our experts guide you through the complex SEBI regulations.
                 </p>
                 <Button asChild className="w-full bg-[#FFD700] text-[#001529] hover:bg-[#FFD700]/90 font-bold h-12 rounded-xl">
                   <Link to="/ipo-feasibility">Check Eligibility Now</Link>
                 </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Reports;
