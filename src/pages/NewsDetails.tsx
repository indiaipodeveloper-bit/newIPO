import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Calendar, ArrowLeft, Loader2, Tag, TrendingUp, ChevronRight, Facebook, Twitter, Linkedin, Instagram, Share2, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const fallbackImage = "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200&auto=format&fit=crop";

export default function NewsDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState<any>(null);
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    
    // Fetch current news
    fetch(`/api/news/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setNews(data);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });

    // Fetch latest/trending news for sidebar
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Filter out current news and take top 8
          setLatestNews(data.filter((item) => item.slug !== slug && item.id.toString() !== slug).slice(0, 8));
        }
      })
      .catch((err) => console.error("Error fetching latest news:", err));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-3xl font-bold mb-4">News Not Found</h1>
          <p className="text-muted-foreground mb-6">The article you are looking for does not exist or has been removed.</p>
          <Button onClick={() => navigate("/news-updates")}>Back to News</Button>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedDate = news.published_at && !isNaN(new Date(news.published_at).getTime()) 
    ? new Date(news.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "No date";

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title={news.title} 
        description={news.description} 
      />
      <Header />
      <main className="flex-1 bg-background pb-16">
        {/* Hero Section */}
        <section className="relative h-[400px] md:h-[500px] w-full bg-muted">
          <img
            src={news.image || fallbackImage}
            alt={news.title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e: any) => { e.target.src = fallbackImage; }}
          />
          <div className="absolute inset-0 bg-black/70 bg-gradient-to-t from-black/90 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-12">
              <Button 
                variant="ghost" 
                className="text-white hover:text-white/80 hover:bg-white/10 mb-6 pl-0"
                onClick={() => navigate("/news-updates")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to all updates
              </Button>
              
              {news.category && (
                <span className="inline-block bg-primary text-primary-foreground text-xs uppercase tracking-wider font-bold px-3 py-1.5 rounded-full mb-4">
                  {news.category}
                </span>
              )}
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-heading leading-tight max-w-4xl drop-shadow-md">
                {news.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-medium text-white">{formattedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-4 pt-12">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            
            {/* Main Article Content */}
            <div className="xl:col-span-2">
              
              {/* Share Icons */}
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border">
                <span className="text-sm font-semibold text-muted-foreground mr-2 flex items-center"><Share2 className="w-4 h-4 mr-2" /> Share</span>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(news.title)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-black/5 text-black flex items-center justify-center hover:bg-black hover:text-white transition-colors dark:bg-white/10 dark:text-white dark:hover:bg-white dark:hover:text-black">
                  <span className="font-bold text-lg leading-none">X</span>
                </a>
                <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(news.title)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#0A66C2]/10 text-[#0A66C2] flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#E1306C]/10 text-[#E1306C] flex items-center justify-center hover:bg-[#E1306C] hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(news.title + " " + window.location.href)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                </a>
              </div>

              <div 
                className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-a:text-primary prose-img:rounded-xl prose-img:shadow-sm"
                dangerouslySetInnerHTML={{ __html: news.content || "<p>No content available.</p>" }}
              />
            </div>

            {/* Sticky Sidebar: Trending / Latest News */}
            <aside className="xl:col-span-1">
              <div className="sticky top-24 bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold font-heading text-foreground">Trending Updates</h3>
                </div>
                
                <div className="flex flex-col gap-4 max-h-[calc(50vh-100px)] overflow-y-auto pr-2 custom-scrollbar border-b border-border pb-6 mb-6">
                  {latestNews.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No trending news found.</p>
                  ) : (
                    latestNews.slice(0, 4).map((item, idx) => {
                      const dateStr = item.published_at ? item.published_at.split('T')[0] : "";
                      return (
                        <Link 
                          to={`/news/${item.slug || item.id}`} 
                          key={item.id}
                          className="group flex gap-3 p-2 -mx-2 rounded-xl hover:bg-muted/50 transition-colors"
                        >
                          <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-muted">
                            <img 
                              src={item.image || fallbackImage} 
                              alt="" 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                              onError={(e: any) => e.target.src = fallbackImage}
                            />
                          </div>
                          <div className="flex flex-col justify-center flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-primary">{item.category}</span>
                            </div>
                            <h4 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1 tabular-nums">{dateStr}</p>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>

                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
                  <Flame className="h-6 w-6 text-brand-red" />
                  <h3 className="text-xl font-bold font-heading text-foreground">Latest News</h3>
                </div>
                
                <div className="flex flex-col gap-4 max-h-[calc(50vh-100px)] overflow-y-auto pr-2 custom-scrollbar">
                  {latestNews.length <= 4 ? (
                    <p className="text-muted-foreground text-sm">No more latest news found.</p>
                  ) : (
                    latestNews.slice(4, 8).map((item, idx) => {
                      const dateStr = item.published_at ? item.published_at.split('T')[0] : "";
                      return (
                        <Link 
                          to={`/news/${item.slug || item.id}`} 
                          key={item.id}
                          className="group flex gap-3 p-2 -mx-2 rounded-xl hover:bg-muted/50 transition-colors"
                        >
                          <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-muted">
                            <img 
                              src={item.image || fallbackImage} 
                              alt="" 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                              onError={(e: any) => e.target.src = fallbackImage}
                            />
                          </div>
                          <div className="flex flex-col justify-center flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-primary">{item.category}</span>
                            </div>
                            <h4 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1 tabular-nums">{dateStr}</p>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
                
                <Button variant="outline" className="w-full mt-6 group" onClick={() => navigate("/news-updates")}>
                  View All News <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </aside>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
