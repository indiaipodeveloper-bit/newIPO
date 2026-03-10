import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, ChevronRight, Newspaper, Youtube, Loader2 } from "lucide-react";

const fallbackImage = "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1000&auto=format&fit=crop";

const videoSnaps = [
  { title: "IPO Market Weekly Roundup — Feb 28", views: "12K views" },
  { title: "GMP Analysis: Which IPOs Are Hot?", views: "8K views" },
  { title: "SME IPO Success Story — TechVista Solutions", views: "15K views" },
  { title: "Understanding IPO Allotment Process", views: "22K views" },
];

const CATEGORIES = ["All", "IPO", "Equity", "NSE", "BSE", "SEBI", "Economy"];

const NewsUpdates = () => {
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    setLoading(true);
    const url = activeCategory === "All" ? "/api/news" : `/api/news?category=${activeCategory}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
            setNewsItems(data);
        } else {
            console.error("API returned non-array:", data);
            setNewsItems([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setNewsItems([]);
        setLoading(false);
      });
  }, [activeCategory]);

  return (
    <div className="min-h-screen">
      <SEOHead title="News & Updates" description="Latest IPO news, market updates, and capital market insights from IndiaIPO." />
      <Header />
      <main>
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-bold font-heading text-primary-foreground mb-4"
            >
              News & <span className="text-accent">Updates</span>
            </motion.h1>
            <p className="text-primary-foreground/70 max-w-xl mx-auto">
              Stay informed with the latest from IPO markets, SEBI regulations, and capital market trends.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Markets & Money Update */}
              <div className="lg:col-span-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Newspaper className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-bold font-heading text-foreground">Markets & Money Update</h2>
                  </div>
                </div>

                {/* Category Filters */}
                <div className="flex overflow-x-auto pb-4 mb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        activeCategory === cat
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                
                {loading ? (
                  <div className="flex justify-center py-12 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : newsItems.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground border rounded-xl bg-card">
                    No news articles published yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {newsItems.map((item, idx) => {
                      const dateStr = item.published_at ? item.published_at.split('T')[0] : "No Date";
                      return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        viewport={{ once: true }}
                        className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors group cursor-pointer flex flex-col md:flex-row gap-4"
                        onClick={() => window.location.href = `/news/${item.slug || item.id}`}
                      >
                        {item.image && (
                          <div className="w-full md:w-40 h-32 md:h-auto rounded-lg overflow-hidden shrink-0">
                            <img src={item.image || fallbackImage} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e: any) => e.target.src = fallbackImage} />
                          </div>
                        )}
                        <div className="flex flex-col flex-1 justify-center">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{item.category}</span>
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0">{dateStr}</span>
                          </div>
                          <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
                          {item.description && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.description}</p>
                          )}
                        </div>
                      </motion.div>
                    )})}
                  </div>
                )}
              </div>

              {/* IPO & Market Snaps */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Youtube className="h-5 w-5 text-brand-red" />
                  <h2 className="text-xl font-bold font-heading text-foreground">IPO & Market Snaps</h2>
                </div>
                <div className="space-y-3">
                  {videoSnaps.map((vid, idx) => (
                    <div key={idx} className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors cursor-pointer group">
                      <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-brand-red/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-l-[14px] border-transparent border-l-primary-foreground ml-1" />
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="text-sm font-semibold text-foreground line-clamp-1">{vid.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{vid.views}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
    </div>
  );
};

export default NewsUpdates;
