import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getImageUrl } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";

interface SocialVideo {
  id: number;
  title: string;
  url: string;
  img_url: string;
  status: string;
  created_at: string;
}

import {
  Newspaper, Youtube, Loader2, ChevronLeft, ChevronRight,
  Calendar, Tag, ArrowRight, TrendingUp, Bell, PlayCircle,
  Search, Home, Clock, Eye, Bookmark, Share2, Mail, Phone,
  BarChart3, Zap, Globe,
} from "lucide-react";

const fallbackImage =
  "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1000&auto=format&fit=crop";

const CATEGORIES = ["All", "IPO", "Equity", "NSE", "BSE", "SEBI", "Economy"];
const NEWS_PER_PAGE = 6;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: "easeOut" },
  }),
};

/* ── Stat items shown in hero ── */
const heroStats = [
  { icon: <Newspaper className="h-4 w-4" />, label: "Daily News Updates" },
  { icon: <TrendingUp className="h-4 w-4" />, label: "Market Insights" },
  { icon: <BarChart3 className="h-4 w-4" />, label: "SEBI Regulatory Alerts" },
  { icon: <Youtube className="h-4 w-4" />, label: "Video Market Snaps" },
];

/* ── Trust bar stats ── */
const trustStats = [
  { value: "10,000+", label: "Monthly Readers", icon: Eye },
  { value: "500+", label: "News Articles", icon: Newspaper },
  { value: "Daily", label: "Updates Published", icon: Clock },
  { value: "100%", label: "SEBI Aligned", icon: Zap },
];

const NewsUpdates = () => {
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [videos, setVideos] = useState<SocialVideo[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
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

  /* ── fetch news ── */
  useEffect(() => {
    setNewsLoading(true);
    setCurrentPage(1);
    const url =
      activeCategory === "All" ? "/api/news" : `/api/news?category=${activeCategory}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => { setNewsItems(Array.isArray(d) ? d : []); setNewsLoading(false); })
      .catch(() => { setNewsItems([]); setNewsLoading(false); });
  }, [activeCategory]);

  /* ── fetch YouTube videos ── */
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setVideosLoading(true);
        const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
        const playlistId = import.meta.env.VITE_YOUTUBE_PLAYLIST_ID;
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=4&playlistId=${playlistId}&key=${apiKey}`
        );
        if (res.ok) {
          const data = await res.json();
          const mapped: SocialVideo[] = data.items.map((item: any) => ({
            id: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
            img_url: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
            status: "published",
            created_at: item.snippet.publishedAt,
          }));
          setVideos(mapped);
        }
      } catch (err) {
        console.error("YouTube fetch failed:", err);
      } finally {
        setVideosLoading(false);
      }
    };
    fetchVideos();
  }, []);

  /* ── helpers ── */
  const extractYoutubeId = (url: string) => {
    if (!url) return null;
    if (!url.includes('/')) { const p = url.split('?')[0]; if (p.length === 11) return p; }
    const m = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    return m && m[2].length === 11 ? m[2] : null;
  };

  const getThumbnail = (vid: SocialVideo) => {
    if (vid.img_url && vid.img_url.startsWith('http')) return vid.img_url;
    let yId = extractYoutubeId(vid.url);
    if (!yId && vid.img_url && !vid.img_url.startsWith('http')) {
      const fb = vid.img_url.split('?')[0];
      if (fb.length === 11) yId = fb;
    }
    if (yId && yId.length === 11) return `https://img.youtube.com/vi/${yId}/hqdefault.jpg`;
    return 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80';
  };

  /* ── filter + paginate ── */
  const filtered = newsItems.filter(
    (item) =>
      !searchQuery ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / NEWS_PER_PAGE);
  const paginatedNews = filtered.slice(
    (currentPage - 1) * NEWS_PER_PAGE,
    currentPage * NEWS_PER_PAGE
  );
  const goToPage = (p: number) => {
    setCurrentPage(p);
    window.scrollTo({ top: 480, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden w-full flex flex-col">
      <SEOHead
        title="News & Updates | IndiaIPO — Latest IPO & Market News"
        description="Stay ahead with the latest IPO news, SEBI regulations, BSE/NSE market updates, and capital market insights from IndiaIPO — India's most trusted IPO advisory."
        keywords="IPO news India, SEBI updates, NSE BSE market news, IPO market updates, capital market news, India IPO news"
      />
      <Header />

      <main>

        {/* ══════════════════════════════════
            HERO SECTION
        ══════════════════════════════════ */}
        <section className="bg-[#001529] pt-14 pb-36 relative overflow-hidden">
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

          {/* Decorative blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-1">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-5"
              style={{ background: "#f59e08", filter: "blur(100px)", transform: "translate(25%,-25%)" }} />
          </div>
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#F8FAFC]" />

          <div className="container mx-auto px-4 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-white/50 text-sm mb-8 flex-wrap">
              <Link to="/" className="hover:text-white flex items-center gap-1 transition-colors">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white/80">News & Updates</span>
            </div>

            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              {/* Live badge */}
              <div className="inline-flex items-center gap-2 bg-[#f59e08]/20 border border-[#f59e08]/30 rounded-full px-4 py-1.5 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#f59e08] animate-pulse" />
                <span className="text-[#f59e08] text-xs font-black uppercase tracking-widest">
                  <Bell className="h-3 w-3 inline mr-1" /> Live Market Intelligence
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white mb-5 leading-tight max-w-4xl">
                IPO News &amp; <span className="text-[#f59e08]">Market Updates</span>
              </h1>
              <p className="text-white/65 max-w-2xl text-base md:text-lg font-medium leading-relaxed mb-10">
                Stay ahead with the latest from IPO markets, SEBI regulations, BSE/NSE announcements, and capital market intelligence — all in one place, updated daily.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-3">
                {heroStats.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white/80"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)" }}>
                    <span className="text-[#f59e08]">{s.icon}</span>
                    {s.label}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════
            TRUST STATS BAR
        ══════════════════════════════════ */}
        <section className="bg-gradient-to-r from-[#001529] to-[#003380] py-10 -mt-1 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {trustStats.map((s, i) => (
                <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className="bg-white/8 border border-white/12 rounded-2xl p-5 text-center hover:bg-white/12 transition-all">
                  <div className="w-11 h-11 rounded-xl bg-[#f59e08]/20 flex items-center justify-center mx-auto mb-3">
                    <s.icon className="h-5 w-5 text-[#f59e08]" />
                  </div>
                  <div className="text-2xl font-black text-white mb-1">{s.value}</div>
                  <div className="text-white/55 text-xs font-semibold">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            SEARCH + CATEGORIES
        ══════════════════════════════════ */}
        <section className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Search box */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search news articles…"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#001529]/20 focus:border-[#001529]/40 font-medium"
                />
              </div>
              {/* Category pills */}
              <div className="flex overflow-x-auto pb-0 gap-2 scrollbar-hide flex-1">
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeCategory === cat
                      ? "bg-[#001529] text-white shadow-md"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                      }`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            MAIN CONTENT
        ══════════════════════════════════ */}
        <section className="py-14">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

              {/* ── Left: News Feed (2/3) ── */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-1 h-8 rounded-full bg-[#f59e08]" />
                  <h2 className="text-2xl font-black text-[#001529]">Markets &amp; Money Update</h2>
                  <span className="ml-auto text-xs font-black px-3 py-1 rounded-full"
                    style={{ background: "rgba(0,21,41,0.08)", color: "#001529" }}>
                    {filtered.length} Articles
                  </span>
                </div>

                {/* News list */}
                {newsLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-[#001529]" />
                    <p className="text-slate-500 font-medium">Fetching latest news…</p>
                  </div>
                ) : paginatedNews.length === 0 ? (
                  <div className="text-center py-20 rounded-3xl bg-white border border-slate-200">
                    <Newspaper className="h-14 w-14 mx-auto mb-4 text-slate-300" />
                    <p className="text-slate-500 font-semibold text-lg">No news found</p>
                    <p className="text-slate-400 text-sm mt-1">Try a different category or search term</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {paginatedNews.map((item, idx) => {
                      const date = item.published_at
                        ? new Date(item.published_at).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })
                        : "No Date";
                      return (
                        <motion.div key={item.id} custom={idx} initial="hidden" whileInView="visible"
                          viewport={{ once: true }} variants={fadeUp}>
                          <Link to={`/news/${item.slug || item.id}`}
                            className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden flex flex-col md:flex-row gap-0 block">
                            {/* Top accent line */}
                            <div className="absolute" />
                            {/* Thumbnail */}
                            {item.image && (
                              <div className="w-full md:w-52 h-44 md:h-auto shrink-0 overflow-hidden relative">
                                <img src={item.image || fallbackImage} alt={item.title}
                                  onError={(e: any) => (e.target.src = fallbackImage)}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
                              </div>
                            )}
                            {/* Content */}
                            <div className="flex flex-col justify-between p-5 flex-1 relative">
                              <div
                                className="absolute top-0 left-0 right-0 h-0.5 rounded-t-none"
                                style={{ background: "linear-gradient(90deg, #001529, #f59e08)" }}
                              />
                              <div>
                                <div className="flex items-center gap-2 mb-3 flex-wrap">
                                  {item.category && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                                      style={{ background: "rgba(0,21,41,0.08)", color: "#001529" }}>
                                      <Tag className="h-2.5 w-2.5" /> {item.category}
                                    </span>
                                  )}
                                  <span className="ml-auto flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                                    <Calendar className="h-3 w-3" /> {date}
                                  </span>
                                </div>
                                <h3 className="font-black text-base leading-snug line-clamp-2 mb-2 text-[#001529] group-hover:text-[#f59e08] transition-colors">
                                  {item.title}
                                </h3>
                                {item.description && (
                                  <p className="text-sm text-slate-500 line-clamp-2 font-medium leading-relaxed">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                                <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#001529] group-hover:text-[#f59e08] transition-colors">
                                  Read Full Article <ArrowRight className="h-3.5 w-3.5" />
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => { e.preventDefault(); navigator.share?.({ title: item.title, url: `/news/${item.slug || item.id}` }); }}
                                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#001529] hover:text-white text-slate-400 flex items-center justify-center transition-all"
                                  >
                                    <Share2 className="h-3.5 w-3.5" />
                                  </button>
                                  {/* <button
                                    onClick={(e) => e.preventDefault()}
                                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#f59e08] hover:text-white text-slate-400 flex items-center justify-center transition-all"
                                  >
                                    <Bookmark className="h-3.5 w-3.5" />
                                  </button> */}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Pagination */}
                {!newsLoading && totalPages > 1 && (() => {
                  const delta = 2;
                  const range: (number | "…")[] = [];
                  const rangeSet = new Set<number>();
                  [1, totalPages, ...Array.from({ length: delta * 2 + 1 }, (_, i) => currentPage - delta + i)]
                    .filter((p) => p >= 1 && p <= totalPages)
                    .sort((a, b) => a - b)
                    .forEach((p) => rangeSet.add(p));
                  const sorted = Array.from(rangeSet).sort((a, b) => a - b);
                  sorted.forEach((p, i) => {
                    if (i > 0 && p - sorted[i - 1] > 1) range.push("…");
                    range.push(p);
                  });
                  return (
                    <div className="flex items-center justify-center flex-wrap gap-2 mt-10">
                      <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}
                        className="px-4 h-10 rounded-xl flex items-center gap-1 text-sm font-bold transition-all disabled:opacity-40 bg-[#001529] text-white hover:bg-[#002147] disabled:bg-slate-200 disabled:text-slate-400">
                        <ChevronLeft className="h-4 w-4" /> Prev
                      </button>
                      {range.map((p, i) =>
                        p === "…" ? (
                          <span key={`e${i}`} className="w-10 h-10 flex items-center justify-center text-slate-400 text-sm">…</span>
                        ) : (
                          <button key={p} onClick={() => goToPage(p as number)}
                            className="w-10 h-10 rounded-xl text-sm font-black transition-all"
                            style={p === currentPage
                              ? { background: "#f59e08", color: "#001529", boxShadow: "0 4px 12px rgba(245,158,8,0.35)" }
                              : { background: "#f1f5f9", color: "#475569" }}>
                            {p}
                          </button>
                        )
                      )}
                      <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}
                        className="px-4 h-10 rounded-xl flex items-center gap-1 text-sm font-bold transition-all disabled:opacity-40 bg-[#001529] text-white hover:bg-[#002147] disabled:bg-slate-200 disabled:text-slate-400">
                        Next <ChevronRight className="h-4 w-4" />
                      </button>
                      <span className="w-full text-center text-xs text-slate-400 mt-1">
                        Page {currentPage} of {totalPages} · {filtered.length} articles
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* ── Right: Videos + Sidebar (1/3) ── */}
              <div className="space-y-6">

                {/* Video section header */}
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 rounded-full bg-[#f59e08]" />
                  <h2 className="text-xl font-black text-[#001529]">IPO &amp; Market Snaps</h2>
                </div>

                {/* Videos */}
                {videosLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-[#f59e08]" />
                  </div>
                ) : videos.length === 0 ? (
                  <div className="text-center py-12 rounded-2xl bg-white border border-slate-200">
                    <Youtube className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p className="text-slate-400 text-sm font-medium">No videos available.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {videos.map((vid) => {
                      const yId = extractYoutubeId(vid.url);
                      const thumb = getThumbnail(vid);
                      const isPlaying = selectedVideo === String(vid.id);
                      const ytLink = yId ? `https://www.youtube.com/watch?v=${yId}` : vid.url;
                      return (
                        <div key={vid.id}
                          className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                          {/* Video area */}
                          {isPlaying && yId ? (
                            <div className="aspect-video">
                              <iframe width="100%" height="100%"
                                src={`https://www.youtube.com/embed/${yId}?autoplay=1&rel=0`}
                                title={vid.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen className="block w-full h-full border-0" />
                            </div>
                          ) : (
                            <div className="relative aspect-video cursor-pointer"
                              onClick={() => setSelectedVideo(String(vid.id))}>
                              <img src={thumb} alt={vid.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/35 group-hover:bg-black/25 transition-all">
                                <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform"
                                  style={{ background: "linear-gradient(135deg, #f59e08, #d97706)" }}>
                                  <PlayCircle className="h-8 w-8 text-white" />
                                </div>
                              </div>
                              {/* duration badge mock */}
                              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                WATCH
                              </div>
                            </div>
                          )}
                          <div className="p-3.5">
                            <h4 className="text-sm font-bold leading-snug line-clamp-2 text-[#001529] mb-2">{vid.title}</h4>
                            <a href={ytLink} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-black text-[#f59e08] hover:underline"
                              onClick={(e) => e.stopPropagation()}>
                              Watch on YouTube <ArrowRight className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Subscribe CTA */}
                <div className="rounded-2xl overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #001529 0%, #003380 100%)" }}>
                  <div className="p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-[#f59e08]/20 flex items-center justify-center mx-auto mb-4">
                      <Youtube className="h-7 w-7 text-[#f59e08]" />
                    </div>
                    <p className="font-black text-white text-base mb-1">Subscribe to Our Channel</p>
                    <p className="text-white/55 text-xs mb-5 leading-relaxed">
                      Get the latest IPO videos, GMP updates, and market insights delivered to your feed.
                    </p>
                    <a href="https://www.youtube.com/@IndiaIPO" target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all hover:scale-105 shadow-xl"
                      style={{ background: "linear-gradient(135deg, #f59e08, #d97706)", color: "#001529", boxShadow: "0 4px 16px rgba(245,158,8,0.4)" }}>
                      <Youtube className="h-4 w-4" /> Subscribe Now
                    </a>
                  </div>
                </div>

                {/* Quick Info Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100" style={{ background: "#001529" }}>
                    <h3 className="font-black text-white text-sm uppercase tracking-widest flex items-center gap-2">
                      <Globe className="h-4 w-4 text-[#f59e08]" /> Stay Connected
                    </h3>
                  </div>
                  <div className="p-5 space-y-3">
                    <a href="mailto:info@indiaipo.in"
                      className="flex items-center gap-3 text-sm font-semibold text-slate-600 hover:text-[#001529] transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-[#001529]/08 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-[#001529]" />
                      </div>
                      info@indiaipo.in
                    </a>
                    <a href="tel:+917428337280"
                      className="flex items-center gap-3 text-sm font-semibold text-slate-600 hover:text-[#001529] transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-[#f59e08]/10 flex items-center justify-center">
                        <Phone className="h-4 w-4 text-[#f59e08]" />
                      </div>
                      +91-74283-37280
                    </a>
                    <a href="https://wa.me/917428337280" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm font-semibold text-slate-600 hover:text-[#001529] transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                        <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                        </svg>
                      </div>
                      WhatsApp Alerts
                    </a>
                  </div>
                  <div className="px-5 pb-5">
                    <Link to="/contact"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-black text-white transition-all hover:scale-105"
                      style={{ background: "linear-gradient(135deg, #001529, #003380)", boxShadow: "0 4px 16px rgba(0,21,41,0.25)" }}>
                      Get IPO Advisory <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            WHAT WE COVER — INFO BAND
        ══════════════════════════════════ */}
        <section className="bg-white py-16 border-t border-slate-200">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-[#f59e08]/12 border border-[#f59e08]/30 rounded-full px-4 py-1.5 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#f59e08]" />
                <span className="text-[#f59e08] text-xs font-black uppercase tracking-widest">Our Coverage</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-[#001529] mb-4">
                What We <span className="text-[#f59e08]">Cover</span>
              </h2>
              <p className="text-slate-500 font-medium max-w-2xl mx-auto">
                India IPO's news desk monitors and analyses every major development in India's capital markets — so you never miss a beat.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: TrendingUp, title: "IPO Watch", desc: "Track every upcoming, open, and recently listed IPO with GMP, subscription, and allotment updates." },
                { icon: Zap, title: "SEBI Circulars", desc: "Instant analysis of all SEBI regulatory changes, circulars, and their impact on markets and investors." },
                { icon: BarChart3, title: "Market Data", desc: "NSE/BSE index movements, sector performance, FII/DII flows, and daily market intelligence." },
                { icon: Globe, title: "Economy & Policy", desc: "RBI policy updates, government economic reforms, and global macro factors affecting Indian markets." },
              ].map((item, i) => (
                <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200 hover:shadow-lg hover:-translate-y-1.5 transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#001529] to-[#003380] flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                    <item.icon className="h-6 w-6 text-[#f59e08]" />
                  </div>
                  <h3 className="font-black text-[#001529] text-base mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            CTA BAND
        ══════════════════════════════════ */}
        <section className="bg-gradient-to-r from-[#001529] via-[#002147] to-[#003380] py-20 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
              style={{ background: "#f59e08", filter: "blur(80px)", transform: "translate(20%,-30%)" }} />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#f59e08]/15 border border-[#f59e08]/30 rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#f59e08] animate-pulse" />
              <span className="text-[#f59e08] text-xs font-black uppercase tracking-widest">Never Miss a Beat</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-5 leading-tight">
              Get Real-Time IPO Alerts &amp;<br />
              <span className="text-[#f59e08]">Market Intelligence</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-base font-medium mb-10 leading-relaxed">
              Connect with our advisory team to receive personalized IPO alerts, GMP updates, and market insights directly on WhatsApp or email — tailored to your investment interests.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/contact"
                className="inline-flex items-center gap-2 px-8 h-14 rounded-xl font-black text-base transition-all hover:scale-105 shadow-2xl"
                style={{ background: "linear-gradient(135deg, #f59e08, #d97706)", color: "#001529", boxShadow: "0 8px 32px rgba(245,158,8,0.35)" }}>
                <Phone className="h-5 w-5" /> Get in Touch
              </a>
              <a href="https://wa.me/917428337280" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 h-14 rounded-xl font-black text-base transition-all hover:bg-white/10 border border-white/25 text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                WhatsApp Alerts
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default NewsUpdates;
