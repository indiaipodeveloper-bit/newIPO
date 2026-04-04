import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import {
  Calendar, ArrowLeft, Loader2, Tag, TrendingUp, ChevronRight,
  Facebook, Twitter, Linkedin, Share2, Flame, Home, Clock,
  Eye, Bookmark, Phone, Mail, ArrowRight, Bell, Newspaper,
  BarChart3, Globe, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const fallbackImage =
  "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200&auto=format&fit=crop";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

/* ── Why choose us quick cards ── */
const quickInsights = [
  { icon: TrendingUp, title: "IPO GMP Tracker", desc: "Live grey market premium updates for all open and upcoming IPOs." },
  { icon: Bell, title: "SEBI Alerts", desc: "Instant regulatory updates and circular analysis from SEBI." },
  { icon: BarChart3, title: "Market Data", desc: "NSE/BSE index data, FII/DII flows, and sector analysis." },
  { icon: Globe, title: "Economy Updates", desc: "Macro-economic policy changes affecting capital markets." },
];

/* ─────────────────────────────────────────────────────────────
   Smart Article Renderer
   - If content has real HTML tags → render as proper styled prose
   - If content is plain text → split into paragraphs, detect
     ALSO READ / KEY FACTS / headings, render professionally
───────────────────────────────────────────────────────────── */
const hasHtmlTags = (str: string) => /<[a-z][\s\S]*>/i.test(str);

const ArticleContent = ({ content }: { content: string }) => {
  if (!content) {
    return <p className="text-slate-400 italic">No content available.</p>;
  }

  /* ── HTML content: render with prose classes + inline style fix ── */
  if (hasHtmlTags(content)) {
    return (
      <>
        <style>{`
          .article-prose p { margin-bottom: 1.25rem; color: #475569; line-height: 1.85; font-size: 1rem; font-weight: 500; }
          .article-prose h2 { font-size: 1.5rem; font-weight: 900; color: #001529; margin-top: 2.5rem; margin-bottom: 1.5rem; padding: 0.75rem 1rem; background: #eff6ff; border-left: 5px solid #1a56db; border-radius: 0 0.5rem 0.5rem 0; }
          .article-prose h3 { font-size: 1.2rem; font-weight: 900; color: #001529; margin-top: 2rem; margin-bottom: 1rem; padding: 0.5rem 1rem; background: #f8fafc; border-left: 4px solid #94a3b8; border-radius: 0 0.4rem 0.4rem 0; }
          .article-prose h4 { font-size: 1rem; font-weight: 800; color: #001529; margin-top: 1.5rem; margin-bottom: 0.5rem; }
          .article-prose strong, .article-prose b { color: #001529; font-weight: 700; }
          .article-prose a { color: #001529; font-weight: 600; text-decoration: underline; text-decoration-color: #f59e08; }
          .article-prose a:hover { color: #f59e08; }
          .article-prose ul { list-style: none; padding: 0; margin: 1rem 0 1.25rem; }
          .article-prose ul li { display: flex; align-items: flex-start; gap: 0.6rem; margin-bottom: 0.6rem; color: #475569; font-size: 0.95rem; font-weight: 500; }
          .article-prose ul li::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: #f59e08; flex-shrink: 0; margin-top: 0.45rem; }
          .article-prose ol { padding-left: 1.5rem; margin: 1rem 0 1.25rem; }
          .article-prose ol li { margin-bottom: 0.5rem; color: #475569; font-weight: 500; }
          .article-prose blockquote { margin: 1.5rem 0; padding: 1rem 1.25rem; border-left: 4px solid #f59e08; background: rgba(245,158,8,0.06); border-radius: 0 0.75rem 0.75rem 0; font-style: italic; color: #334155; }
          .article-prose img { border-radius: 1rem; width: 100%; margin: 1.5rem 0; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .article-prose table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.875rem; }
          .article-prose th { background: #001529; color: #f59e08; font-weight: 800; padding: 0.6rem 1rem; text-align: left; }
          .article-prose td { border: 1px solid #e2e8f0; padding: 0.6rem 1rem; color: #475569; }
          .article-prose tr:nth-child(even) td { background: #F8FAFC; }
        `}</style>
        <div className="article-prose" dangerouslySetInnerHTML={{ __html: content }} />
      </>
    );
  }

  /* ── Plain-text content: smart paragraph parser ── */
  const rawParagraphs = content
    .split(/\n{2,}|\r\n\r\n/)
    .map(p => p.trim())
    .filter(Boolean);

  // If no double-newlines found, split by single newlines
  const paragraphs = rawParagraphs.length <= 1
    ? content.split(/\n/).map(p => p.trim()).filter(Boolean)
    : rawParagraphs;

  // Collect "key facts" (lines with : patterns like "Issue Size: ₹120 Cr")
  const keyFactLines: { label: string; value: string }[] = [];
  const keyFactPattern = /^([A-Za-z][A-Za-z\s\/\-]+)\s*:\s*(.+)$/;

  const renderedParagraphs: JSX.Element[] = [];
  let paraIndex = 0;

  paragraphs.forEach((para, i) => {
    // Detect "ALSO READ:" style call-out
    if (/^(also read|see also|read also|related)/i.test(para)) {
      renderedParagraphs.push(
        <div key={`also-${i}`} className="my-5 p-4 rounded-xl border-l-4 flex items-center gap-3"
          style={{ borderColor: "#f59e08", background: "rgba(245,158,8,0.06)" }}>
          <span className="text-xs font-black uppercase tracking-widest shrink-0" style={{ color: "#d97706" }}>Also Read</span>
          <span className="text-sm font-semibold text-slate-600">{para.replace(/^(also read|see also|read also|related)[:\s]*/i, "")}</span>
        </div>
      );
      return;
    }

    // Detect Note / Disclaimer
    if (/^(note|disclaimer|important|please note)/i.test(para)) {
      renderedParagraphs.push(
        <div key={`note-${i}`} className="my-5 p-4 rounded-xl border border-slate-200 bg-slate-50 flex gap-3">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400 shrink-0 pt-0.5">Note</span>
          <p className="text-sm font-medium text-slate-500 leading-relaxed m-0">{para.replace(/^(note|disclaimer|important|please note)[:\s]*/i, "")}</p>
        </div>
      );
      return;
    }

    // Detect short headings (ALL CAPS, ends with ":", or short non-sentence)
    const isHeading = (para.length < 80 && para === para.toUpperCase() && para.length > 5) ||
      (para.endsWith(":") && para.length < 80 && !para.includes(".")) ||
      (para.length < 50 && !para.includes(".") && !para.includes(",") && paraIndex > 0);

    if (isHeading) {
      renderedParagraphs.push(
        <h2 key={`h-${i}`} className="text-xl font-black mt-10 mb-5 px-4 py-3 border-l-8 rounded-r-xl"
          style={{ color: "#001529", background: "#eff6ff", borderLeftColor: "#1a56db" }}>
          {para.replace(/:$/, "")}
        </h2>
      );
      return;
    }

    // Detect key-value fact lines and collect them
    const factMatch = para.match(keyFactPattern);
    if (factMatch && para.split(".").length <= 2 && !para.includes(",") && para.length < 100) {
      keyFactLines.push({ label: factMatch[1].trim(), value: factMatch[2].trim() });
      return;
    }

    // Regular paragraph — first para gets dropcap treatment
    const isFirst = paraIndex === 0;
    paraIndex++;

    // Long paragraphs get a subtle divider before them (every 3rd)
    const needsDivider = paraIndex > 1 && paraIndex % 4 === 0;

    renderedParagraphs.push(
      <div key={`p-${i}`}>
        {needsDivider && (
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-100" />
            <div className="w-2 h-2 rounded-full bg-[#f59e08]/40" />
            <div className="flex-1 h-px bg-slate-100" />
          </div>
        )}
        <p className={`leading-[1.9] text-slate-600 mb-5 font-medium ${isFirst ? "text-[1.05rem]" : "text-[0.96rem]"}`}>
          {isFirst && (
            <span className="float-left text-6xl font-black leading-none mr-3 mt-1"
              style={{ color: "#001529", lineHeight: 0.8 }}>
              {para[0]}
            </span>
          )}
          {isFirst ? para.slice(1) : para}
        </p>
      </div>
    );
  });

  // Insert key facts box after the 2nd paragraph (if any)
  const factsBox = keyFactLines.length >= 2 ? (
    <div key="facts" className="my-8 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <div className="px-5 py-3 flex items-center gap-2" style={{ background: "#001529" }}>
        <span className="font-black text-xs uppercase tracking-widest" style={{ color: "#f59e08" }}>Key Details</span>
      </div>
      <div className="divide-y divide-slate-100">
        {keyFactLines.map((f, fi) => (
          <div key={fi} className={`flex items-center justify-between px-5 py-3 ${fi % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}`}>
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">{f.label}</span>
            <span className="text-sm font-black" style={{ color: "#001529" }}>{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  ) : null;

  // Weave facts box in after index 1 (second rendered paragraph)
  const finalOutput: JSX.Element[] = [];
  renderedParagraphs.forEach((el, i) => {
    finalOutput.push(el);
    if (i === 1 && factsBox) finalOutput.push(factsBox);
  });
  // If fewer than 2 paragraphs, append at end
  if (renderedParagraphs.length <= 1 && factsBox) finalOutput.push(factsBox);

  return <div className="article-body">{finalOutput}</div>;
};

export default function NewsDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState<any>(null);
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError(false);

    fetch(`/api/news/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => { setNews(data); })
      .catch(() => { setError(true); })
      .finally(() => { setLoading(false); });

    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLatestNews(
            data.filter((item) => item.slug !== slug && item.id.toString() !== slug).slice(0, 8)
          );
        }
      })
      .catch((err) => console.error("Error fetching latest news:", err));
  }, [slug]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#001529] to-[#003380] flex items-center justify-center shadow-xl">
            <Loader2 className="h-8 w-8 animate-spin text-[#f59e08]" />
          </div>
          <p className="text-slate-500 font-semibold">Loading article…</p>
        </main>
        <Footer />
      </div>
    );
  }

  /* ── Error state ── */
  if (error || !news) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <div className="w-20 h-20 rounded-3xl bg-[#001529] flex items-center justify-center mb-5 shadow-xl">
            <Newspaper className="h-10 w-10 text-[#f59e08]" />
          </div>
          <h1 className="text-3xl font-black text-[#001529] mb-3">Article Not Found</h1>
          <p className="text-slate-500 mb-6 max-w-md">
            The article you are looking for does not exist or has been removed. Browse our latest news below.
          </p>
          <Button
            className="font-black rounded-xl px-8 h-12 text-sm"
            style={{ background: "linear-gradient(135deg, #001529, #003380)", color: "white" }}
            onClick={() => navigate("/news-updates")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedDate =
    news.published_at && !isNaN(new Date(news.published_at).getTime())
      ? new Date(news.published_at).toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
      })
      : "No date";

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = news.title || "";

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <SEOHead
        title={`${news.title} | IndiaIPO News`}
        description={news.description || "Latest news and updates from IndiaIPO."}
        keywords={`${news.category || "IPO"}, IPO news India, ${news.title?.split(" ").slice(0, 4).join(" ")}, capital market news`}
      />
      <Header />

      <main className="flex-1">

        {/* ══════════════════════════════════
            HERO — full bleed image
        ══════════════════════════════════ */}
        <section className="relative h-[380px] md:h-[520px] w-full overflow-hidden">
          <img
            src={news.image || fallbackImage}
            alt={news.title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e: any) => { e.target.src = fallbackImage; }}
          />
          {/* Multi-layer overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#001529] via-[#001529]/60 to-[#001529]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001529]/40 to-transparent" />

          {/* Decorative accent line at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1"
            style={{ background: "linear-gradient(90deg, #001529, #f59e08, #001529)" }} />

          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="container mx-auto px-4 pb-10 md:pb-14">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-white/50 text-xs mb-5 flex-wrap">
                <Link to="/" className="hover:text-white flex items-center gap-1 transition-colors">
                  <Home className="h-3 w-3" /> Home
                </Link>
                <ChevronRight className="h-3 w-3" />
                <Link to="/news-updates" className="hover:text-white transition-colors">News & Updates</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-white/70 line-clamp-1 max-w-[150px]">{news.title}</span>
              </div>

              {/* Back button */}
              <button
                onClick={() => navigate("/news-updates")}
                className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-semibold mb-5 transition-colors group"
              >
                <div className="w-7 h-7 rounded-full border border-white flex items-center justify-center transition-all bg-transparent group-hover:bg-white/5">
                  <ArrowLeft className="h-3.5 w-3.5" />
                </div>
                Back to all updates
              </button>

              {/* Category badge */}
              {news.category && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4"
                  style={{ background: "rgba(245,158,8,0.2)", color: "#f59e08", border: "1px solid rgba(245,158,8,0.35)" }}>
                  <Tag className="h-3 w-3" /> {news.category}
                </div>
              )}

              {/* Title */}
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight max-w-4xl drop-shadow-lg">
                {news.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 text-white/65 text-sm">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-[#f59e08]" />
                  <span className="font-semibold text-white">{formattedDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-[#f59e08]/70" />
                  <span>~5 min read</span>
                </div>
                {news.author && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-[#f59e08]/30 flex items-center justify-center text-[10px] font-black text-[#f59e08]">
                      {news.author.charAt(0)}
                    </div>
                    <span>{news.author}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            MAIN CONTENT + SIDEBAR
        ══════════════════════════════════ */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">

            {/* ── Main Article (2/3) ── */}
            <div className="xl:col-span-2">

              {/* Share bar */}
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200 flex-wrap">
                <span className="text-sm font-black text-slate-500 flex items-center gap-2">
                  <Share2 className="w-4 h-4" /> Share Article
                </span>
                {/* Facebook */}
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all hover:scale-110">
                  <Facebook className="w-4 w-4" />
                </a>
                {/* X/Twitter */}
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center hover:bg-slate-800 hover:text-white transition-all hover:scale-110">
                  <span className="font-black text-sm leading-none">X</span>
                </a>
                {/* LinkedIn */}
                <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-[#0A66C2]/10 text-[#0A66C2] flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-all hover:scale-110">
                  <Linkedin className="w-4 h-4" />
                </a>
                {/* WhatsApp */}
                <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-green-50 text-green-500 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all hover:scale-110">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                </a>
                {/* Copy link */}
                <button
                  onClick={handleCopy}
                  className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all hover:scale-105"
                  style={{ background: copied ? "linear-gradient(135deg, #001529, #003380)" : "#f1f5f9", color: copied ? "white" : "#001529" }}>
                  {copied ? "✓ Copied!" : "Copy Link"}
                </button>
              </div>

              {/* Article content */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 md:p-10 mb-8">
                <ArticleContent content={news.content} />
              </div>

              {/* Tags + Bookmark row */}
              <div className="flex items-center gap-3 flex-wrap mb-12 pb-6 border-b border-slate-200">
                {news.category && (
                  <span className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest"
                    style={{ background: "rgba(0,21,41,0.08)", color: "#001529" }}>
                    <Tag className="h-3 w-3 inline mr-1" /> {news.category}
                  </span>
                )}

              </div>

              {/* Quick Insights Section */}
              {/* <div className="mb-12">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-1 h-8 rounded-full bg-[#f59e08]" />
                  <h3 className="text-xl font-black text-[#001529]">Related Market Insights</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {quickInsights.map((item, i) => (
                    <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#001529] to-[#003380] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <item.icon className="h-5 w-5 text-[#f59e08]" />
                      </div>
                      <h4 className="font-black text-[#001529] text-sm mb-1">{item.title}</h4>
                      <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div> */}


              {latestNews.slice(0, 3).length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-8 rounded-full bg-[#f59e08]" />
                    <h3 className="text-xl font-black text-[#001529]">You May Also Like</h3>
                  </div>
                  <div className="space-y-4">
                    {latestNews.slice(0, 3).map((item, i) => {
                      const date = item.published_at ? item.published_at.split("T")[0] : "";
                      return (
                        <Link key={item.id} to={`/news/${item.slug || item.id}`}
                          className="group flex gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                          <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-slate-100">
                            <img src={item.image || fallbackImage} alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e: any) => (e.target.src = fallbackImage)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            {item.category && (
                              <span className="text-[9px] font-black uppercase tracking-widest text-[#f59e08]">{item.category}</span>
                            )}
                            <h4 className="text-sm font-bold text-[#001529] leading-snug line-clamp-2 mt-1 group-hover:text-[#f59e08] transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-xs text-slate-400 mt-1 font-medium">{date}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#f59e08] shrink-0 self-center transition-colors" />
                        </Link>
                      );
                    })}
                  </div>
                  <Link to="/news-updates"
                    className="flex items-center justify-center gap-2 mt-4 py-3 rounded-xl text-sm font-black text-[#001529] hover:text-[#f59e08] transition-colors">
                    View All News <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* ── Sidebar (1/3) ── */}
            <aside className="xl:col-span-1">
              <div className="sticky top-24 space-y-5">

                {/* IPO Advisory CTA */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                  <div className="h-1.5" style={{ background: "linear-gradient(90deg, #001529, #f59e08)" }} />
                  <div className="p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-[#001529] flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Phone className="h-6 w-6 text-[#f59e08]" />
                    </div>
                    <h3 className="text-xl font-black text-[#001529] mb-2">IPO Advisory</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-5">
                      Want to list your company? Our SEBI-registered advisors are ready to guide you through every step.
                    </p>
                    <Link to="/contact"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-black text-[#001529] transition-all hover:scale-105 shadow-lg"
                      style={{ background: "linear-gradient(135deg, #f59e08, #d97706)", boxShadow: "0 4px 16px rgba(245,158,8,0.35)" }}>
                      Get Free Consultation <ArrowRight className="h-4 w-4" />
                    </Link>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <a href="tel:+917428337280"
                        className="text-base font-black hover:underline"
                        style={{ color: "#001529" }}>
                        +91-74283-37280
                      </a>
                    </div>
                  </div>
                </div>

                {/* Trending News */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2"
                    style={{ background: "#001529" }}>
                    <TrendingUp className="h-4 w-4 text-[#f59e08]" />
                    <h3 className="font-black text-white text-sm uppercase tracking-widest">Trending Now</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {latestNews.slice(0, 4).length === 0 ? (
                      <p className="text-slate-400 text-sm py-4 text-center">No trending news.</p>
                    ) : (
                      latestNews.slice(0, 4).map((item, idx) => {
                        const date = item.published_at ? item.published_at.split("T")[0] : "";
                        return (
                          <Link key={item.id} to={`/news/${item.slug || item.id}`}
                            className="group flex gap-3 p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors">
                            <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                              <img src={item.image || fallbackImage} alt=""
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={(e: any) => (e.target.src = fallbackImage)} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[9px] font-black uppercase tracking-widest text-[#f59e08]">{item.category}</span>
                              <h4 className="text-xs font-bold text-[#001529] leading-snug line-clamp-2 mt-0.5 group-hover:text-[#f59e08] transition-colors">
                                {item.title}
                              </h4>
                              <p className="text-[10px] text-slate-400 mt-1">{date}</p>
                            </div>
                          </Link>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Latest News */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2"
                    style={{ background: "rgba(245,158,8,0.08)", borderBottom: "2px solid #f59e08" }}>
                    <Flame className="h-4 w-4 text-[#f59e08]" />
                    <h3 className="font-black text-[#001529] text-sm uppercase tracking-widest">Latest News</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {latestNews.slice(4, 8).length === 0 ? (
                      <p className="text-slate-400 text-sm py-4 text-center">No more news.</p>
                    ) : (
                      latestNews.slice(4, 8).map((item) => {
                        const date = item.published_at ? item.published_at.split("T")[0] : "";
                        return (
                          <Link key={item.id} to={`/news/${item.slug || item.id}`}
                            className="group flex gap-3 p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors">
                            <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                              <img src={item.image || fallbackImage} alt=""
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={(e: any) => (e.target.src = fallbackImage)} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[9px] font-black uppercase tracking-widest text-[#f59e08]">{item.category}</span>
                              <h4 className="text-xs font-bold text-[#001529] leading-snug line-clamp-2 mt-0.5 group-hover:text-[#f59e08] transition-colors">
                                {item.title}
                              </h4>
                              <p className="text-[10px] text-slate-400 mt-1">{date}</p>
                            </div>
                          </Link>
                        );
                      })
                    )}
                  </div>
                  <div className="px-4 pb-4">
                    <button
                      className="w-full py-2.5 rounded-xl text-sm font-black border border-[#001529]/20 text-[#001529] hover:bg-[#001529] hover:text-white flex items-center justify-center gap-2 transition-all group"
                      onClick={() => navigate("/news-updates")}>
                      View All News <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Quick Contact */}
                <div className="bg-[#001529] rounded-2xl p-6">
                  <h4 className="text-white font-black text-sm uppercase tracking-widest mb-4">Contact Us</h4>
                  <div className="space-y-3">
                    <a href="mailto:info@indiaipo.in"
                      className="flex items-center gap-3 text-white/70 hover:text-white text-sm font-semibold transition-colors">
                      <Mail className="h-4 w-4 text-[#f59e08]" /> info@indiaipo.in
                    </a>
                    <a href="tel:+917428337280"
                      className="flex items-center gap-3 text-white/70 hover:text-white text-sm font-semibold transition-colors">
                      <Phone className="h-4 w-4 text-[#f59e08]" /> +91-74283-37280
                    </a>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <Link to="/ipo-services"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-black transition-all hover:scale-105"
                      style={{ background: "linear-gradient(135deg, #f59e08, #d97706)", color: "#001529" }}>
                      IPO Services <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

              </div>
            </aside>
          </div>
        </section>

        {/* ══════════════════════════════════
            BOTTOM CTA BAND
        ══════════════════════════════════ */}
        <section className="bg-gradient-to-r from-[#001529] via-[#002147] to-[#003380] py-20 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
              style={{ background: "#f59e08", filter: "blur(80px)", transform: "translate(20%,-30%)" }} />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#f59e08]/15 border border-[#f59e08]/30 rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#f59e08] animate-pulse" />
              <span className="text-[#f59e08] text-xs font-black uppercase tracking-widest">
                <Bell className="h-3 w-3 inline mr-1" /> Stay Informed
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
              Never Miss an <span className="text-[#f59e08]">IPO Alert</span><br />
              or Market Update
            </h2>
            <p className="text-white/60 max-w-xl mx-auto text-base font-medium mb-10 leading-relaxed">
              Get personalized IPO alerts, GMP updates, and market news on WhatsApp. Free to subscribe — unsubscribe anytime.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact"
                className="inline-flex items-center gap-2 px-8 h-14 rounded-xl font-black text-base transition-all hover:scale-105 shadow-2xl"
                style={{ background: "linear-gradient(135deg, #f59e08, #d97706)", color: "#001529", boxShadow: "0 8px 32px rgba(245,158,8,0.35)" }}>
                <Phone className="h-5 w-5" /> Get in Touch
              </Link>
              <Link to="/news-updates"
                className="inline-flex items-center gap-2 px-8 h-14 rounded-xl font-black text-base text-white border border-white bg-transparent transition-all hover:bg-white/5 shadow-md">
                <Newspaper className="h-5 w-5" /> Browse All News
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
