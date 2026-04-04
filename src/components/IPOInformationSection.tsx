import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Newspaper, ChevronRight, TrendingUp, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const IPOInformationSection = () => {
  const [news, setNews] = useState<any[]>([]);
  const [ipoBlogs, setIpoBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [newsRes, ipoBlogsRes] = await Promise.all([
          fetch("/api/news"),
          fetch("/api/admin-blogs?page=1&limit=8&summary=1")
        ]);

        if (newsRes.ok) {
          const newsData = await newsRes.json();
          setNews(Array.isArray(newsData) ? newsData.slice(0, 8) : []);
        }

        if (ipoBlogsRes.ok) {
          const ipoBlogsData = await ipoBlogsRes.json();
          setIpoBlogs(ipoBlogsData.data || []);
        }
      } catch (error) {
        console.error("Error fetching data for IPOInformationSection:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
            <TrendingUp className="h-3.5 w-3.5" />
            Market Insights
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground">
            IPO <span className="text-primary">Information</span>
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-8 h-1 rounded-full bg-primary" />
            <div className="w-8 h-1 rounded-full bg-primary/40" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* News Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-bold text-primary mb-5 flex items-center gap-2">
              <Newspaper className="h-5 w-5" />
              News & Updates
            </h3>
            <div className="space-y-3 min-h-[280px]">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-6 w-6 animate-spin text-primary/40" />
                </div>
              ) : news.length > 0 ? (
                news.map((item) => (
                  <Link
                    key={item.id}
                    to={`/news/${item.slug || item.id}`}
                    className="flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors group"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-primary/30 group-hover:bg-primary shrink-0" />
                    <span className="line-clamp-1 group-hover:underline underline-offset-4">{item.title}</span>
                  </Link>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No news updates available.</p>
              )}
            </div>
            <Button className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold w-full sm:w-auto shadow-sm" asChild>
              <Link to="/news-updates">
                Read More News
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </motion.div>

          {/* IPO Blogs Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-bold text-primary mb-5 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              IPO Blogs
            </h3>
            <div className="space-y-3 min-h-[280px]">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-6 w-6 animate-spin text-primary/40" />
                </div>
              ) : ipoBlogs.length > 0 ? (
                ipoBlogs.map((blog) => (
                  <Link
                    key={blog.id}
                    to={`/ipo-blogs/${blog.slug || blog.id}`}
                    className="flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors group"
                  >
                    <ChevronRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform shrink-0" />
                    <span className="line-clamp-1 group-hover:underline underline-offset-4">{blog.title}</span>
                  </Link>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No IPO blogs available.</p>
              )}
            </div>
            <Button className="mt-6 bg-slate-900 text-white hover:bg-slate-800 font-semibold w-full sm:w-auto shadow-sm" asChild>
              <Link to="/ipo-blogs">
                Read More IPO Blogs
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default IPOInformationSection;

