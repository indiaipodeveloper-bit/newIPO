import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, Loader2, Calendar, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialMedia {
  id: string | number;
  title: string;
  url: string;
  img_url: string;
  status: string;
  created_at: string;
}

const MarketSnaps = () => {
  const [videos, setVideos] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [playingVideoId, setPlayingVideoId] = useState<string | number | null>(null);
  
  // YouTube Pagination State
  const [pageTokens, setPageTokens] = useState<Record<number, string | null>>({ 1: null });

  const limit = 12;

  const fetchVideos = async (currentPage: number) => {
    try {
      setLoading(true);
      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
      const playlistId = import.meta.env.VITE_YOUTUBE_PLAYLIST_ID;
      
      const token = pageTokens[currentPage] || null;
      const tokenParam = token ? `&pageToken=${token}` : "";
      
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${limit}&playlistId=${playlistId}&key=${apiKey}${tokenParam}`
      );
      
      if (res.ok) {
        const data = await res.json();
        const mappedVideos: SocialMedia[] = data.items.map((item: any) => ({
          id: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
          img_url: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
          status: "published",
          created_at: item.snippet.publishedAt,
        }));
        setVideos(mappedVideos);

        // Update total pages based on YouTube's pageInfo
        if (data.pageInfo) {
          setTotalPages(Math.ceil(data.pageInfo.totalResults / limit));
        }

        // Store the next page token
        if (data.nextPageToken) {
          setPageTokens(prev => ({ ...prev, [currentPage + 1]: data.nextPageToken }));
        }
      }
    } catch (err) {
      console.error("Failed to load videos from YouTube", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const extractYoutubeId = (url: string) => {
    if (!url) return null;
    if (!url.includes('/')) {
        const potentialId = url.split('?')[0];
        if (potentialId.length === 11) return potentialId;
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getVideoLink = (url: string) => {
    if (!url) return "#";
    if (!url.includes('/')) {
        const id = url.split('?')[0];
        if (id.length === 11) return `https://www.youtube.com/watch?v=${id}`;
    }
    return url;
  };

  const getThumbnail = (video: SocialMedia) => {
    if (video.img_url && video.img_url.startsWith('http')) return video.img_url;
    
    let yId = extractYoutubeId(video.url);
    if (!yId && video.img_url && !video.img_url.startsWith('http')) {
        const fallbackId = video.img_url.split('?')[0];
        if (fallbackId.length === 11) yId = fallbackId;
    }

    if (yId && yId.length === 11) return `https://img.youtube.com/vi/${yId}/hqdefault.jpg`;
    return "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80"; // Fallback
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead title="Watch Our IPO Video Updates | IPO & Market Snaps" description="Catch the latest IPO updates, market analyses, and trending financial news visually." />
      <Header />

      <main className="flex-1">
        {/* Dynamic Hero Section */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-foreground text-background">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-background/5 to-accent/10 opacity-30 mix-blend-overlay" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
          </div>
          
          <div className="container relative z-10 px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent font-semibold text-sm mb-6 backdrop-blur-md">
                <PlayCircle className="w-4 h-4 fill-accent text-foreground" />
                <span>Market Snaps & Media</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black font-heading tracking-tight mb-6 drop-shadow-sm">
                Watch Our <br className="md:hidden" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-gold-light">IPO Video Updates</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Stay ahead of the curve with our expert daily visual briefings, deep-dive IPO analyses, and real-time market sentiment breakdowns.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Controls Section */}
        <section className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-16 z-30">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Showing Page {page} of {totalPages || 1}
            </p>
            <div className="flex bg-muted/50 p-1 rounded-lg border border-border">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Video Feed Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground animate-pulse">Loading updates...</p>
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-24 bg-muted/20 rounded-3xl border border-dashed border-border">
                <PlayCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold font-heading text-foreground mb-2">No Videos Found</h3>
                <p className="text-muted-foreground">Stay tuned! We'll be posting new updates shortly.</p>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-6 max-w-4xl mx-auto"}>
                <AnimatePresence mode="popLayout">
                  {videos.map((video, idx) => {
                    const yId = extractYoutubeId(video.url);
                    const isPlaying = playingVideoId === video.id;

                    return (
                      <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`group flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:shadow-2xl hover:border-primary/40 transition-all duration-300 ${viewMode === "list" ? "md:flex-row" : ""}`}
                      >
                        <div className={`relative overflow-hidden bg-black ${viewMode === "list" ? "md:w-2/5 shrink-0" : "aspect-video"}`}>
                          {isPlaying && yId ? (
                            <iframe
                              src={`https://www.youtube.com/embed/${yId}?autoplay=1`}
                              title={video.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full border-0 absolute inset-0"
                            />
                          ) : (
                            <>
                              <img 
                                src={getThumbnail(video)} 
                                alt={video.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                              />
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                              <button 
                                onClick={() => setPlayingVideoId(video.id)}
                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full h-full focus:outline-none"
                              >
                                <div className="w-16 h-16 rounded-full bg-accent/90 backdrop-blur-sm flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                  <PlayCircle className="w-8 h-8 text-black fill-accent border-none" />
                                </div>
                              </button>
                            </>
                          )}
                        </div>
                        
                        <div className="p-6 flex flex-col justify-center flex-1">
                          <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-3 uppercase tracking-wider">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(video.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <h3 className={`font-bold font-heading text-foreground group-hover:text-primary transition-colors line-clamp-2 ${viewMode === "list" ? "text-xl md:text-2xl mb-4" : "text-lg mb-2"}`}>
                            {video.title}
                          </h3>
                          <div className="mt-auto pt-4 flex items-center justify-between">
                            {!isPlaying ? (
                              <button 
                                onClick={() => setPlayingVideoId(video.id)}
                                className="text-sm font-semibold text-accent group-hover:text-gold transition-colors flex items-center focus:outline-none"
                              >
                                Play Video <span className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">→</span>
                              </button>
                            ) : (
                              <span className="text-sm font-semibold text-primary flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Playing
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-16">
                <Button 
                  variant="outline" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-full w-12 h-12 p-0 flex items-center justify-center"
                >
                  ←
                </Button>
                
                <div className="flex gap-1 overflow-x-auto max-w-[200px] px-2 hide-scrollbar">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNumber = i + 1;
                    const isAvailable = pageTokens[pageNumber] !== undefined || pageNumber === 1;
                    
                    return (
                      <Button
                        key={pageNumber}
                        variant={page === pageNumber ? "default" : "ghost"}
                        onClick={() => setPage(pageNumber)}
                        disabled={!isAvailable}
                        className={`min-w-[40px] h-10 rounded-full font-bold ${page === pageNumber ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground'} ${!isAvailable ? 'opacity-30 cursor-not-allowed' : ''}`}
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>

                <Button 
                  variant="outline" 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-full w-12 h-12 p-0 flex items-center justify-center"
                >
                  →
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MarketSnaps;
