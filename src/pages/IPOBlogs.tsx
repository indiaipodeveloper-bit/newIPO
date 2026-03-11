import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, TrendingUp, IndianRupee, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface IPOBlog {
  id: string; title: string; slug: string;
  image: string; category: string; upcoming: string; status: string;
  gmp_date: string; gmp_ipo_price: string; gmp: string;
  created_at: string;
}

const isValid = (val: any) => {
  if (val === null || val === undefined) return false;
  const s = String(val).toLowerCase().trim();
  return s !== "null" && s !== "[null]" && s !== "" && s !== "undefined";
};

const IPOBlogs = () => {
  const [blogs, setBlogs] = useState<IPOBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all"); // 'all', 'current', 'upcoming'
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBlogs = async () => {
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
      } catch (err) {
        console.error("Failed to load IPO blogs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [filter, page]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead 
        title="IPO Blogs & Updates - IndiaIPO" 
        description="Read the latest updates, GMP reviews, and comprehensive details about Current and Upcoming IPOs."
      />
      <Header />

      {/* Hero Section */}
      <section className="bg-primary/5 py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:32px]"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge className="mb-4 bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20">Market Insights</Badge>
          <h1 className="text-4xl lg:text-5xl font-bold font-heading text-foreground mb-4">
            IPO Blogs & Updates
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay ahead of the market with comprehensive analysis, GMP tracking, and detailed 
            reviews of all Current and Upcoming Initial Public Offerings.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <main className="flex-1 container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Button 
            variant={filter === "all" ? "default" : "outline"}
            className={filter === "all" ? "bg-primary text-primary-foreground" : ""}
            onClick={() => { setFilter("all"); setPage(1); }}
          >
            All IPOs
          </Button>
          <Button 
            variant={filter === "current" ? "default" : "outline"}
            className={filter === "current" ? "bg-emerald-600 hover:bg-emerald-700 text-white border-none" : "hover:border-emerald-600 hover:text-emerald-700"}
            onClick={() => { setFilter("current"); setPage(1); }}
          >
            Current IPOs
          </Button>
          <Button 
            variant={filter === "upcoming" ? "default" : "outline"}
            className={filter === "upcoming" ? "bg-amber-600 hover:bg-amber-700 text-white border-none" : "hover:border-amber-600 hover:text-amber-700"}
            onClick={() => { setFilter("upcoming"); setPage(1); }}
          >
            Upcoming IPOs
          </Button>
        </div>

        {/* Loading / Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading expert IPO insights...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 border border-dashed rounded-xl border-border bg-muted/20">
            <h3 className="text-xl font-semibold mb-2">No IPOs Found</h3>
            <p className="text-muted-foreground">We couldn't find any IPO blogs matching your filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {blogs.map((blog, idx) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <Link to={`/ipo-blogs/${blog.slug || blog.id}`} className="block h-full group">
                    <div className="h-full bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 flex flex-col">
                      <div className="aspect-[16/10] bg-muted relative overflow-hidden flex items-center justify-center p-4">
                        {isValid(blog.image) ? (
                          <img src={blog.image} alt={blog.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                            <TrendingUp className="h-10 w-10 text-primary/40" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          {blog.upcoming == "1" ? (
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300 shadow-sm backdrop-blur-md">Upcoming</Badge>
                          ) : (
                            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300 shadow-sm backdrop-blur-md">Current</Badge>
                          )}
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="text-xs font-semibold uppercase tracking-wider text-primary/80 mb-2">{(blog.category || 'IPO').replace('_', ' ')}</div>
                        <h3 className="font-bold text-lg leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2" title={blog.title}>
                          {blog.title}
                        </h3>
                        
                        <div className="mt-auto space-y-3 pt-4 border-t border-border">
                          {isValid(blog.gmp_ipo_price) && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground flex items-center"><IndianRupee className="w-3.5 h-3.5 mr-1"/> Price</span>
                              <span className="font-semibold">{blog.gmp_ipo_price}</span>
                            </div>
                          )}
                          {isValid(blog.gmp) && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground flex items-center"><TrendingUp className="w-3.5 h-3.5 mr-1"/> GMP</span>
                              <span className="font-semibold text-brand-green">{blog.gmp}</span>
                            </div>
                          )}
                          {isValid(blog.gmp_date) && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground flex items-center"><Calendar className="w-3.5 h-3.5 mr-1"/> Date</span>
                              <span className="font-medium text-xs text-right">{blog.gmp_date}</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-5 flex items-center text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                          Read Full Details <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Prev
            </Button>
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => {
                const p = i + 1;
                // Simple pagination logic to show limited numbers
                if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                  return (
                    <Button
                      key={p}
                      variant={p === page ? "default" : "outline"}
                      className={`w-10 h-10 p-0 ${p === page ? 'bg-primary' : 'hover:bg-primary/10'}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </Button>
                  );
                }
                if (p === page - 2 || p === page + 2) {
                  return <span key={p} className="text-muted-foreground px-1">...</span>;
                }
                return null;
              })}
            </div>
            <Button 
              variant="outline" 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default IPOBlogs;
