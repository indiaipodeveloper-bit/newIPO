import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Home, ChevronRight, FileText, Calendar, Download, Eye, 
  Search, ArrowRight, Newspaper, Loader2, Filter
} from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";

interface DailyDigest {
  id: number;
  title: string;
  image: string | null;
  pdf: string | null;
  created_at: string;
  updated_at: string;
}

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

  useEffect(() => {
    fetchData(page);
    window.scrollTo(0, 0);
  }, [page]);

  const filteredDigests = digests.filter(d => 
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Daily Reporter - IndiaIPO" 
        description="Stay updated with our daily market reports, IPO snapshots and financial digests."
      />
      <Header />
      
      <main>
        {/* Professional Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              {/* Breadcrumbs */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
              >
                <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
                  <Home className="h-4 w-4" /> Home
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground font-medium">Daily Reporter</span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider"
              >
                <Newspaper className="h-3.5 w-3.5" />
                Daily Market Insights
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight"
              >
                Daily <span className="text-primary italic">Reporter</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-muted-foreground mb-10 leading-relaxed"
              >
                Access our exclusive daily digests featuring market summaries, IPO updates, 
                and professional snapshots of the Indian financial landscape.
              </motion.p>
              
              {/* Search Bar */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full max-w-xl relative group"
              >
                <div className="absolute inset-y-0 left-4 flex items-center text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Search className="h-5 w-5" />
                </div>
                <Input 
                  placeholder="Search reports by title..." 
                  className="pl-12 h-14 rounded-2xl border-border bg-background shadow-lg focus-visible:ring-primary transition-all text-lg"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10 border-b border-border pb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  Latest Reports
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({total} total)
                  </span>
                </h2>
              </div>
              
              <div className="hidden md:flex items-center gap-2">
                <Button variant="outline" size="sm" className="rounded-full">
                  <Filter className="h-4 w-4 mr-2" /> Filter
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground animate-pulse font-medium">Fetching professional reports...</p>
              </div>
            ) : filteredDigests.length === 0 ? (
              <div className="py-20 text-center bg-muted/30 rounded-3xl border-2 border-dashed border-border">
                <div className="bg-background w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Search className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-bold mb-2">No matching reports found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria or check back later.</p>
                <Button variant="link" onClick={() => setSearch("")} className="mt-4 text-primary font-bold">
                  Clear Search
                </Button>
              </div>
            ) : (
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {filteredDigests.map((digest, index) => (
                    <motion.div
                      key={digest.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                    >
                      {/* Image Container */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                        {digest.image ? (
                          <img 
                            src={`/${digest.image}`} 
                            alt={digest.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-brand-blue/10">
                            <Newspaper className="h-12 w-12 text-primary/30" />
                          </div>
                        )}
                        
                        {/* Overlay Controls */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          {digest.pdf && (
                            <>
                              <Button 
                                size="sm" 
                                className="bg-white text-black hover:bg-white/90 rounded-full"
                                asChild
                              >
                                <a href={`/${digest.pdf}`} target="_blank" rel="noopener noreferrer">
                                  <Eye className="h-4 w-4 mr-2" /> View PDF
                                </a>
                              </Button>
                              <Button 
                                size="icon" 
                                variant="outline"
                                className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full"
                                asChild
                              >
                                <a href={`/${digest.pdf}`} download>
                                  <Download className="h-4 w-4" />
                                </a>
                              </Button>
                            </>
                          )}
                        </div>
                        
                        {/* Date Badge */}
                        <div className="absolute top-4 left-4">
                          <div className="bg-white/95 backdrop-blur-sm dark:bg-black/80 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-primary" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">
                              {new Date(digest.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-1">
                        <div className="mb-4 flex-1">
                          <h3 className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {digest.title}
                          </h3>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-border/50">
                          {digest.pdf ? (
                            <a 
                              href={`/${digest.pdf}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm font-bold text-primary group/link"
                            >
                              Open Report
                              <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover/link:translate-x-1" />
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">Report pending...</span>
                          )}
                          
                          <div className="flex items-center gap-1.5">
                            {digest.pdf && <FileText className="h-4 w-4 text-brand-red" />}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-2">
                <Button 
                  variant="outline" 
                  className="rounded-xl px-6 h-12"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <Button
                      key={p}
                      variant={page === p ? "default" : "ghost"}
                      className={`w-12 h-12 rounded-xl text-sm font-bold transition-all ${
                        page === p ? "shadow-lg shadow-primary/20 scale-110" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                      }`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  className="rounded-xl px-6 h-12"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-br from-primary to-brand-blue rounded-[3rem] p-10 md:p-20 relative overflow-hidden text-center text-white shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative z-10 max-w-2xl mx-auto"
              >
                <h3 className="text-3xl md:text-5xl font-bold mb-6">Expert IPO Guidance</h3>
                <p className="text-lg text-white/80 mb-10 leading-relaxed">
                  Navigating the IPO journey requires precision and expertise. 
                  Let our seasoned professionals help you achieve your public listing goals.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full h-14 px-10 font-bold shadow-xl" asChild>
                    <Link to="/contact">Get Free Consultation</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 rounded-full h-14 px-10 font-bold" asChild>
                    <Link to="/ipo-feasibility">Check Feasibility</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default DailyReporter;
