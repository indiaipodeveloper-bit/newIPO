import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface SocialVideo {
  id: number;
  title: string;
  url: string;
  img_url: string;
  status: string;
  created_at: string;
}

import {
  Newspaper,
  Youtube,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Tag,
  ArrowRight,
  TrendingUp,
  Bell,
  PlayCircle,
} from "lucide-react";

const fallbackImage =
  "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1000&auto=format&fit=crop";

const CATEGORIES = ["All", "IPO", "Equity", "NSE", "BSE", "SEBI", "Economy"];
const NEWS_PER_PAGE = 6;

// ── colour helpers (match logo theme) ──────────────────────────────────────────
const NAVY = "hsl(220 72% 45%)";
const NAVY_DARK = "hsl(220 72% 30%)";
const NAVY_LIGHT = "hsl(220 72% 95%)";
const ORANGE = "hsl(35 95% 52%)";
const ORANGE_LIGHT = "hsl(35 95% 96%)";

const NewsUpdates = () => {
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [videos, setVideos] = useState<SocialVideo[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [banner, setBanner] = useState<any>(null);

  // ── fetch news ─────────────────────────────────────────────────────────────
  useEffect(() => {
    setNewsLoading(true);
    setCurrentPage(1);
    const url =
      activeCategory === "All"
        ? "/api/news"
        : `/api/news?category=${activeCategory}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        setNewsItems(Array.isArray(d) ? d : []);
        setNewsLoading(false);
      })
      .catch(() => {
        setNewsItems([]);
        setNewsLoading(false);
      });
  }, [activeCategory]);

  // ── fetch videos from social_media (same source as IPO & Market Snaps page) ──
  useEffect(() => {
    setVideosLoading(true);
    fetch("/api/social_media?status=published&page=1&limit=6")
      .then((r) => r.json())
      .then((d) => {
        setVideos(Array.isArray(d?.data) ? d.data : []);
        setVideosLoading(false);
      })
      .catch(() => {
        setVideos([]);
        setVideosLoading(false);
      });
  }, []);

  // ── fetch dynamic banner ────────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/banners")
      .then(res => res.json())
      .then(data => {
        const pageBanner = data.find((b: any) => b.page_path === "/news-updates" && b.is_active);
        if (pageBanner) setBanner(pageBanner);
      })
      .catch(err => console.error("Failed to fetch banner:", err));
  }, []);

  // ── helpers (same logic as MarketSnaps.tsx) ────────────────────────────────
  const extractYoutubeId = (url: string) => {
    if (!url) return null;
    if (!url.includes('/')) {
      const potentialId = url.split('?')[0];
      if (potentialId.length === 11) return potentialId;
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/ ;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
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

  // ── pagination ─────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(newsItems.length / NEWS_PER_PAGE);
  const paginatedNews = newsItems.slice(
    (currentPage - 1) * NEWS_PER_PAGE,
    currentPage * NEWS_PER_PAGE
  );

  const goToPage = (p: number) => {
    setCurrentPage(p);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="News & Updates | IndiaIPO"
        description="Latest IPO news, market updates, SEBI regulations, and capital market insights from IndiaIPO."
        keywords="IPO news, market updates, SEBI, NSE, BSE, capital market news"
      />
      <Header />

      <main>
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section
          className="relative py-20 overflow-hidden"
          style={{
            background: banner?.image_url 
              ? `linear-gradient(rgba(10, 25, 47, 0.7), rgba(10, 25, 47, 0.7)), url('${banner.image_url}') center/cover no-repeat`
              : `linear-gradient(135deg, hsl(220 72% 22%) 0%, hsl(220 72% 38%) 55%, hsl(220 72% 45%) 100%)`,
          }}
        >
          {/* decorative blobs */}
          <div
            className="absolute top-[-100px] right-[-100px] w-[380px] h-[380px] rounded-full pointer-events-none"
            style={{ background: `${ORANGE}1A` }}
          />
          <div
            className="absolute bottom-[-60px] left-[-60px] w-[250px] h-[250px] rounded-full pointer-events-none"
            style={{ background: `${ORANGE}14` }}
          />

          <div className="container mx-auto px-4 text-center relative z-10">
            {/* badge */}
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5"
              style={{
                background: `${ORANGE}2A`,
                color: "hsl(35 95% 72%)",
                border: `1px solid ${ORANGE}50`,
              }}
            >
              <Bell className="h-3.5 w-3.5" />
              Live Market Intelligence
            </span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              News &amp;{" "}
              <span
                style={{
                  background: `linear-gradient(135deg, ${ORANGE}, hsl(45 93% 65%))`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Updates
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/70 max-w-xl mx-auto text-lg"
            >
              Stay ahead with the latest from IPO markets, SEBI regulations, and
              capital market trends — all in one place.
            </motion.p>

            {/* quick stats */}
            <div className="mt-10 flex flex-wrap justify-center gap-6">
              {[
                { icon: <Newspaper className="h-4 w-4" />, label: "Daily News Updates" },
                { icon: <TrendingUp className="h-4 w-4" />, label: "Market Insights" },
                { icon: <Youtube className="h-4 w-4" />, label: "Video Snaps" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white/80"
                  style={{ background: "hsl(0 0% 100% / 0.1)", border: "1px solid hsl(0 0% 100% / 0.15)" }}
                >
                  <span style={{ color: "hsl(35 95% 65%)" }}>{s.icon}</span>
                  {s.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Main Content ─────────────────────────────────────────────────── */}
        <section className="py-14 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

              {/* ────── Left: News Feed ───────────────────────────────────── */}
              <div className="lg:col-span-2">
                {/* section header */}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: NAVY, color: "white" }}
                  >
                    <Newspaper className="h-5 w-5" />
                  </div>
                  <h2
                    className="text-2xl font-extrabold"
                    style={{ color: NAVY_DARK, fontFamily: "Montserrat, sans-serif" }}
                  >
                    Markets &amp; Money Update
                  </h2>
                  <span
                    className="ml-auto text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: NAVY_LIGHT, color: NAVY }}
                  >
                    {newsItems.length} Articles
                  </span>
                </div>

                {/* category pills */}
                <div className="flex overflow-x-auto pb-3 mb-6 gap-2 scrollbar-hide">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
                      style={
                        activeCategory === cat
                          ? { background: NAVY, color: "white", boxShadow: `0 4px 12px ${NAVY}40` }
                          : { background: "hsl(220 15% 95%)", color: "hsl(220 30% 30%)" }
                      }
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* news list */}
                {newsLoading ? (
                  <div className="flex justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin" style={{ color: NAVY }} />
                  </div>
                ) : paginatedNews.length === 0 ? (
                  <div
                    className="text-center py-16 rounded-2xl"
                    style={{ background: NAVY_LIGHT, border: `1px dashed ${NAVY}40` }}
                  >
                    <Newspaper className="h-10 w-10 mx-auto mb-3 opacity-30" style={{ color: NAVY }} />
                    <p className="text-muted-foreground font-medium">No news articles found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paginatedNews.map((item, idx) => {
                      const date = item.published_at
                        ? new Date(item.published_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "No Date";
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          viewport={{ once: true }}
                          onClick={() =>
                            (window.location.href = `/news/${item.slug || item.id}`)
                          }
                          className="group cursor-pointer rounded-2xl overflow-hidden flex flex-col md:flex-row gap-0 shadow-sm hover:shadow-md transition-all"
                          style={{ border: `1px solid hsl(220 15% 90%)`, background: "white" }}
                        >
                          {/* thumbnail */}
                          {item.image && (
                            <div className="w-full md:w-44 h-40 md:h-auto shrink-0 overflow-hidden">
                              <img
                                src={item.image || fallbackImage}
                                alt={item.title}
                                onError={(e: any) => (e.target.src = fallbackImage)}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          )}

                          {/* content */}
                          <div className="flex flex-col justify-center p-5 flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
                                style={{ background: NAVY_LIGHT, color: NAVY }}
                              >
                                <Tag className="h-2.5 w-2.5" />
                                {item.category}
                              </span>
                              <span className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {date}
                              </span>
                            </div>
                            <h3
                              className="font-bold text-base leading-snug line-clamp-2 mb-1 group-hover:text-blue-700 transition-colors"
                              style={{ color: "hsl(220 30% 18%)" }}
                            >
                              {item.title}
                            </h3>
                            {item.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {item.description}
                              </p>
                            )}
                            <div
                              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold"
                              style={{ color: NAVY }}
                            >
                              Read More <ArrowRight className="h-3 w-3" />
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* ── Pagination ── */}
                {!newsLoading && totalPages > 1 && (() => {
                  // Build page numbers with ellipsis
                  const delta = 2; // pages shown around current
                  const range: (number | "…")[] = [];
                  const rangeSet = new Set<number>();

                  // Always include first, last, and window around current
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
                    <div className="flex items-center justify-center flex-wrap gap-1.5 mt-8">
                      {/* Prev */}
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 h-9 rounded-lg flex items-center gap-1 text-sm font-semibold transition-all disabled:opacity-40"
                        style={
                          currentPage !== 1
                            ? { background: NAVY, color: "white" }
                            : { background: "hsl(220 15% 93%)", color: "hsl(220 15% 60%)" }
                        }
                      >
                        <ChevronLeft className="h-4 w-4" /> Prev
                      </button>

                      {range.map((p, i) =>
                        p === "…" ? (
                          <span
                            key={`ellipsis-${i}`}
                            className="w-9 h-9 flex items-center justify-center text-muted-foreground text-sm select-none"
                          >
                            …
                          </span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => goToPage(p as number)}
                            className="w-9 h-9 rounded-lg text-sm font-bold transition-all"
                            style={
                              p === currentPage
                                ? { background: NAVY, color: "white", boxShadow: `0 4px 12px ${NAVY}40` }
                                : { background: "hsl(220 15% 95%)", color: "hsl(220 30% 30%)" }
                            }
                          >
                            {p}
                          </button>
                        )
                      )}

                      {/* Next */}
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 h-9 rounded-lg flex items-center gap-1 text-sm font-semibold transition-all disabled:opacity-40"
                        style={
                          currentPage !== totalPages
                            ? { background: NAVY, color: "white" }
                            : { background: "hsl(220 15% 93%)", color: "hsl(220 15% 60%)" }
                        }
                      >
                        Next <ChevronRight className="h-4 w-4" />
                      </button>

                      <span className="w-full text-center text-xs text-muted-foreground mt-1">
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* ────── Right: IPO & Market Snaps ──────────────────────────── */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: ORANGE, color: "white" }}
                  >
                    <Youtube className="h-5 w-5" />
                  </div>
                  <h2
                    className="text-xl font-extrabold"
                    style={{ color: NAVY_DARK, fontFamily: "Montserrat, sans-serif" }}
                  >
                    IPO &amp; Market Snaps
                  </h2>
                </div>

                {videosLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-7 w-7 animate-spin" style={{ color: ORANGE }} />
                  </div>
                ) : videos.length === 0 ? (
                  <div
                    className="text-center py-12 rounded-2xl"
                    style={{ background: ORANGE_LIGHT, border: `1px dashed ${ORANGE}50` }}
                  >
                    <Youtube className="h-10 w-10 mx-auto mb-3 opacity-40" style={{ color: ORANGE }} />
                    <p className="text-muted-foreground text-sm">No videos available yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {videos.map((vid) => {
                      const yId = extractYoutubeId(vid.url);
                      const thumb = getThumbnail(vid);
                      const isPlaying = selectedVideo === String(vid.id);
                      const ytLink = yId
                        ? `https://www.youtube.com/watch?v=${yId}`
                        : vid.url;
                      return (
                      <div
                        key={vid.id}
                        className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                        style={{ border: `1px solid hsl(220 15% 90%)`, background: "white" }}
                      >
                        {/* YouTube embed / thumbnail */}
                        {isPlaying && yId ? (
                          <div className="aspect-video">
                            <iframe
                              width="100%"
                              height="100%"
                              src={`https://www.youtube.com/embed/${yId}?autoplay=1&rel=0`}
                              title={vid.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="block w-full h-full border-0"
                            />
                          </div>
                        ) : (
                          <div
                            className="relative aspect-video cursor-pointer group"
                            onClick={() => setSelectedVideo(String(vid.id))}
                          >
                            <img
                              src={thumb}
                              alt={vid.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-all">
                              <div
                                className="w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl"
                                style={{ background: ORANGE }}
                              >
                                <PlayCircle className="h-8 w-8 text-white" />
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="p-3">
                          <h4
                            className="text-sm font-bold leading-snug line-clamp-2"
                            style={{ color: NAVY_DARK }}
                          >
                            {vid.title}
                          </h4>
                          <a
                            href={ytLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold"
                            style={{ color: ORANGE }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Watch on YouTube <ArrowRight className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                )}

                {/* ── Subscribe CTA ── */}
                <div
                  className="mt-6 rounded-2xl p-5 text-center"
                  style={{
                    background: `linear-gradient(135deg, hsl(220 72% 22%) 0%, hsl(220 72% 38%) 100%)`,
                  }}
                >
                  <Youtube className="h-8 w-8 mx-auto mb-2" style={{ color: "hsl(35 95% 65%)" }} />
                  <p
                    className="font-bold text-sm text-white mb-1"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Subscribe to our Channel
                  </p>
                  <p className="text-white/60 text-xs mb-3">
                    Get the latest IPO videos and market insights.
                  </p>
                  <a
                    href="https://www.youtube.com/@IndiaIPO"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all hover:opacity-90"
                    style={{ background: ORANGE, color: "white" }}
                  >
                    <Youtube className="h-3.5 w-3.5" />
                    Subscribe Now
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── CTA Banner ──────────────────────────────────────────────────── */}
        <section
          className="py-14"
          style={{
            background: `linear-gradient(135deg, hsl(35 95% 46%) 0%, ${ORANGE} 50%, hsl(45 93% 60%) 100%)`,
          }}
        >
          <div className="container mx-auto px-4 text-center">
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white mb-3"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Never Miss an IPO Update
            </h2>
            <p className="text-white/80 max-w-lg mx-auto mb-6 text-base">
              Get real-time IPO alerts, GMP updates, and market news delivered straight to you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm transition-all hover:scale-105 shadow-lg"
                style={{ background: "hsl(220 72% 38%)", color: "white" }}
              >
                Get in Touch <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/917428337280"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm transition-all hover:scale-105 shadow-lg"
                style={{ background: "white", color: "hsl(220 72% 38%)" }}
              >
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
