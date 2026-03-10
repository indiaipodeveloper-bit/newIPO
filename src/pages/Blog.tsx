import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Calendar, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

// Default fallback image if URL is missing
const fallbackImage = "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1000&auto=format&fit=crop";

export default function Blog() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blogs?status=published")
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load blogs:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen">
      <SEOHead title="Blog" description="IPO insights, market analysis, GMP updates, and investment guides from IndiaIPO experts." keywords="IPO blog, IPO news, GMP updates, market analysis" />
      <Header />
      <main>
        <section className="gradient-navy py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-primary-foreground mb-3">
              IPO <span className="text-gradient-gold">Blog</span>
            </h1>
            <p className="text-primary-foreground/60 max-w-lg mx-auto">
              Expert insights, market analysis, and IPO guides.
            </p>
          </div>
        </section>

        <section className="py-12 bg-background min-h-[400px]">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p>Loading latest insights...</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-2">No blogs published yet</h3>
                <p>Check back later for market updates and IPO analysis.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((post, idx) => (
                  <motion.article
                    key={post.id}
                    onClick={() => window.location.href = `/blog/${post.slug}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col"
                  >
                    <div className="relative h-52 overflow-hidden shrink-0">
                      <img
                        src={post.image_url || fallbackImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e: any) => { e.target.src = fallbackImage; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
                      {post.category && (
                        <span className="absolute top-4 left-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-lg">
                          {post.category}
                        </span>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h2 className="text-lg font-bold font-heading text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h2>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">{post.excerpt}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {post.created_at && !isNaN(new Date(post.created_at).getTime()) 
                            ? new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : "No date"}
                        </span>
                        </div>
                        <span className="text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform inline-flex items-center">
                          Read <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
