import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import {
  Loader2, Calendar, TrendingUp, IndianRupee, ArrowLeft,
  Download, FileText, Info, BarChart3, Activity, Wallet,
  CheckCircle2, HelpCircle, Star, Shield, ChevronRight, Tag, Flame
} from "lucide-react";
import { getImgSrc } from "@/utils/image";
import { formatIndianNumber } from "@/lib/utils";

interface RelatedBlog {
  id: string;
  title: string;
  slug: string;
  image: string;
  category: string;
  upcoming: string;
  gmp_ipo_price: string;
  gmp_date: string;
  created_at: string;
}

interface AdminBlogFull {
  id: string; title: string; slug: string;
  image: string; content: string; faqs: string; status: string;
  confidential: string; upcoming: string; category: string;
  new_highlight_text: string; gmp_date: string; gmp_ipo_price: string;
  gmp: string; gmp_last_updated: string;
  ipo_details: string; ipo_description: string;
  ipo_timeline_details: string; ipo_timeline_description: string;
  ipo_lots_application: string; ipo_lots: string;
  ipo_lots_share: string; ipo_lots_amount: string;
  promotor_hold_pre_issue: string; promotor_hold_post_issue: string;
  finantial_information_ended: string; finantial_information_assets: string;
  finantial_information_revenue: string; finantial_information_profit_tax: string;
  financial_info_reserves_surplus: string; finantial_information_networth: string;
  finantial_information_borrowing: string;
  key_kpi: string; key_value: string; key_pri_ipo_eps: string;
  key_pos_ipo_eps: string; key_pre_ipo_pe: string; key_post_ipo_pe: string;
  competative_strenght: string;
  meta_title: string; description: string; keyword: string;
  rhp: string; drhp: string; confidential_drhp: string;
  created_at: string;
}

const isValid = (val: any) => {
  if (val === null || val === undefined) return false;
  const s = String(val).trim().toLowerCase();
  return s !== "null" && s !== "[null]" && s !== "" && s !== "undefined" && s !== "[]" && s !== "[\"null\"]";
};

const isValidRealData = (val: any) => {
  if (!isValid(val)) return false;
  const s = String(val).toLowerCase();
  return !s.includes("holding pre") && !s.includes("holding post") && s.replace(/[%\s]/g, "").length > 0;
};

const cleanGarbledText = (text: string) => {
  if (!text) return "";
  const s = String(text);
  if (s.toLowerCase() === "null" || s.toLowerCase() === "[null]" || s === "undefined" || s === "[]" || s === "[\"null\"]") return "";
  return s
    .replace(/\\u20b9/g, "₹")
    .replace(/\\u20b5/g, "₹")
    .replace(/&nbsp;/g, " ")
    .replace(/\["null"\]/g, "")
    .trim();
};

const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, '').trim();
};

const parseArrayData = (data: any): string[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data.map(d => cleanGarbledText(String(d)));
  const s = String(data).trim();
  if (s === "" || s === "[]") return [];
  // For a single string that says "null", we want to keep it as an element if we expect an array
  if (s.toLowerCase() === "null") return [""];
  if (s.startsWith('[') && s.endsWith(']')) {
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) {
        return parsed.map(d => cleanGarbledText(String(d)));
      }
    } catch (e) { }
  }
  if (s.includes(",")) {
    return s.split(",").map(item => cleanGarbledText(item.trim())).filter(item => item !== "");
  }
  return [cleanGarbledText(s)];
};

// ─── Section Header Component ──────
const SectionHeader = ({ icon: Icon, title, accent = "blue" }: { icon: any; title: string; accent?: string }) => {
  const accents: Record<string, string> = {
    blue: "bg-[#1e40af] text-white",
    gold: "bg-[#b45309] text-white",
    green: "bg-[#065f46] text-white",
    purple: "bg-[#4c1d95] text-white",
  };
  return (
    <div className={`flex items-center justify-between px-6 py-4 ${accents[accent]} border-b border-white/10 shadow-md relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
      <div className="flex items-center gap-3 relative z-10">
        <Icon className="w-5 h-5 text-white/90" />
        <h3 className="text-sm md:text-base font-black tracking-wider uppercase font-heading line-clamp-1">{title}</h3>
      </div>
      <div className="hidden sm:flex items-center gap-1.5 relative z-10">
        <div className="w-1 h-1 rounded-full bg-white/30" />
        <div className="w-1 h-1 rounded-full bg-white/50" />
        <div className="w-1 h-1 rounded-full bg-white/70" />
      </div>
    </div>
  );
};

// ─── FAQ Accordion Item ──────────────────────────────────────────
const FAQAccordionItem = ({ faq, index }: { faq: { question: string; answer: string }; index: number }) => {
  const [isOpen, setIsOpen] = useState(index === 0);
  return (
    <div className="border-b border-slate-100 last:border-0 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-violet-50/20 group"
      >
        <div className="flex gap-3">
          <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white mt-0.5 shadow-sm" style={{ background: '#4c1d95' }}>Q</span>
          <span className="font-bold text-slate-800 text-sm leading-tight transition-colors group-hover:text-[#4c1d95]">{faq.question}</span>
        </div>
        <div className={`shrink-0 w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-violet-50' : ''}`}>
          <HelpCircle className={`w-3 h-3 ${isOpen ? 'text-[#4c1d95]' : 'text-slate-300'}`} />
        </div>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-5 pb-5 pl-[44px]">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-600 leading-relaxed">
            {faq.answer}
          </div>
        </div>
      </div>
    </div>
  );
};

const hasHtmlTags = (str: string) => /<[a-z][\s\S]*>?/i.test(str);

const SmartBlogRenderer = ({ content }: { content: string }) => {
  if (!content) return <p className="text-slate-400 italic">No content available.</p>;

  const cleanContent = cleanGarbledText(content);

  if (hasHtmlTags(cleanContent)) {
    return (
      <>
        <style>{`
          .ipo-blog-prose p { margin-bottom: 1.4rem; color: #475569; line-height: 1.9; font-size: 1rem; font-weight: 500; }
          .ipo-blog-prose h2 { font-size: 1.4rem; font-weight: 900; color: #1e40af; margin-top: 2.8rem; margin-bottom: 1.2rem; padding: 0.85rem 1.25rem; background: #EEF2FF; border-left: 6px solid #1e40af; border-radius: 0 0.75rem 0.75rem 0; display: block; }
          .ipo-blog-prose h3 { font-size: 1.15rem; font-weight: 800; color: #1e3a8a; margin-top: 2rem; margin-bottom: 1rem; padding: 0.6rem 1rem; background: #f0f7ff; border-left: 4px solid #60a5fa; border-radius: 0 0.5rem 0.5rem 0; display: block; }
          .ipo-blog-prose h4 { font-size: 1rem; font-weight: 800; color: #1e3a8a; margin-top: 1.5rem; margin-bottom: 0.6rem; padding-left: 0.75rem; border-left: 3px solid #93c5fd; }
          .ipo-blog-prose strong, .ipo-blog-prose b { color: #1e3a8a; font-weight: 700; }
          .ipo-blog-prose a { color: #1d4ed8; font-weight: 600; text-decoration: underline; text-decoration-color: #93c5fd; }
          .ipo-blog-prose a:hover { color: #1e40af; }
          .ipo-blog-prose ul { list-style: none; padding: 0; margin: 1rem 0 1.4rem; }
          .ipo-blog-prose ul li { display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.65rem; color: #475569; font-size: 0.96rem; font-weight: 500; }
          .ipo-blog-prose ul li::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: #1e40af; flex-shrink: 0; margin-top: 0.5rem; }
          .ipo-blog-prose ol { padding-left: 1.5rem; margin: 1rem 0 1.4rem; }
          .ipo-blog-prose ol li { margin-bottom: 0.6rem; color: #475569; font-weight: 500; line-height: 1.7; }
          .ipo-blog-prose blockquote { margin: 1.75rem 0; padding: 1.25rem 1.5rem; border-left: 5px solid #1e40af; background: rgba(30,64,175,0.05); border-radius: 0 0.75rem 0.75rem 0; font-style: italic; color: #334155; font-weight: 500; }
          .ipo-blog-prose img { border-radius: 1rem; width: 100%; margin: 1.75rem 0; box-shadow: 0 4px 24px rgba(0,0,0,0.1); }
          .ipo-blog-prose table { width: 100%; border-collapse: collapse; margin: 1.75rem 0; font-size: 0.875rem; overflow: hidden; box-shadow: 0 1px 8px rgba(30,64,175,0.08); }
          .ipo-blog-prose th { background: #1e40af; color: #fff; font-weight: 800; padding: 0.75rem 1rem; text-align: left; font-size: 0.8rem; letter-spacing: 0.05em; text-transform: uppercase; }
          .ipo-blog-prose td { border: 1px solid #e2e8f0; padding: 0.65rem 1rem; color: #475569; }
          .ipo-blog-prose tr:nth-child(even) td { background: #f8fafc; }
          .ipo-blog-prose tr:hover td { background: #EEF2FF; }
        `}</style>
        <div className="ipo-blog-prose" dangerouslySetInnerHTML={{ __html: cleanContent }} />
      </>
    );
  }

  // Plain text renderer
  const rawParagraphs = cleanContent.split(/\n{2,}|\r\n\r\n/).map(p => p.trim()).filter(Boolean);
  const paragraphs = rawParagraphs.length <= 1 ? cleanContent.split(/\n/).map(p => p.trim()).filter(Boolean) : rawParagraphs;
  const rendered: JSX.Element[] = [];

  paragraphs.forEach((para, i) => {
    const isHeading = (para.length < 80 && para === para.toUpperCase() && para.length > 5) ||
      (para.endsWith(":") && para.length < 80 && !para.includes(".")) ||
      (para.length < 55 && !para.includes(".") && !para.includes(",") && i > 0);

    if (isHeading) {
      rendered.push(
        <h2 key={i} style={{ color: "#1e40af", background: "#EEF2FF", borderLeft: "6px solid #1e40af", borderRadius: "0 0.75rem 0.75rem 0", fontSize: "1.35rem", fontWeight: 900, margin: "2.5rem 0 1.2rem", padding: "0.85rem 1.25rem", display: "block" }}>
          {para.replace(/:$/, "")}
        </h2>
      );
    } else {
      const isFirst = i === 0;
      rendered.push(
        <p key={i} style={{ color: "#475569", lineHeight: 1.9, marginBottom: "1.3rem", fontSize: isFirst ? "1.05rem" : "0.97rem", fontWeight: 500 }}>
          {isFirst && (
            <span style={{ float: "left", fontSize: "4.5rem", fontWeight: 900, lineHeight: 0.75, marginRight: "0.5rem", marginTop: "0.25rem", color: "#1e40af", opacity: 0.85 }}>
              {para[0]}
            </span>
          )}
          {isFirst ? para.slice(1) : para}
        </p>
      );
    }
  });

  return <div>{rendered}</div>;
};

const IPOBlogDetails = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<AdminBlogFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState<RelatedBlog[]>([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/admin-blogs/${slug}`);
        if (res.ok) { const data = await res.json(); setBlog(data); }
        else setBlog(null);
      } catch (err) { console.error("Failed to fetch IPO blog:", err); }
      finally { setLoading(false); }
    };
    if (slug) fetchBlog();
  }, [slug]);

  // Fetch related blogs when main blog loads
  useEffect(() => {
    if (!blog) return;
    const fetchRelated = async () => {
      try {
        const cat = blog.category || 'ipo_blogs';
        const res = await fetch(`/api/admin-blogs?limit=20&summary=1`);
        if (res.ok) {
          const data = await res.json();
          const all: RelatedBlog[] = data.data || [];
          // First try same category, excluding current
          let filtered = all.filter(b => b.slug !== blog.slug && b.category === cat);
          // Fallback: any blog excluding current
          if (filtered.length < 3) {
            filtered = all.filter(b => b.slug !== blog.slug);
          }
          setRelatedBlogs(filtered.slice(0, 6));
        }
      } catch { /* silent */ }
    };
    fetchRelated();
  }, [blog]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f0f5ff]">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-20">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-[#1e40af]/20 border-t-[#1e40af] animate-spin" />
            <div className="w-8 h-8 rounded-full border-4 border-[#f59e0b]/20 border-b-[#f59e0b] animate-spin absolute top-4 left-4" />
          </div>
          <p className="mt-6 text-[#1e40af] font-semibold animate-pulse font-heading">Loading IPO Insights...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f0f5ff]">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
          <div className="w-20 h-20 rounded-full bg-[#1e40af]/10 flex items-center justify-center mb-6">
            <Info className="w-10 h-10 text-[#1e40af]" />
          </div>
          <h2 className="text-3xl font-bold mb-4 font-heading text-[#0f172a]">Post Not Found</h2>
          <p className="text-slate-500 mb-8">The IPO blog you're looking for does not exist or has been removed.</p>
          <Button asChild className="bg-[#1e40af] hover:bg-[#1d4ed8] text-white">
            <Link to="/ipo-blogs"><ArrowLeft className="w-4 h-4 mr-2" /> Back to IPO Blogs</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const timelineLabels = parseArrayData(blog.ipo_timeline_details);
  const timelineDates = parseArrayData(blog.ipo_timeline_description);
  const lots = parseArrayData(blog.ipo_lots);
  const lotShares = parseArrayData(blog.ipo_lots_share);
  const lotAmounts = parseArrayData(blog.ipo_lots_amount);
  const kpiNames = parseArrayData(blog.key_kpi);
  const kpiValues = parseArrayData(blog.key_value);
  const strengths = parseArrayData(blog.competative_strenght);

  const gmpPrice = formatIndianNumber(cleanGarbledText(String(parseArrayData(blog.gmp_ipo_price)[0] || blog.gmp_ipo_price || "")));
  const latestGmp = formatIndianNumber(cleanGarbledText(String(parseArrayData(blog.gmp)[0] || blog.gmp || "")));
  const gmpDate = cleanGarbledText(String(parseArrayData(blog.gmp_date)[0] || blog.gmp_date || ""));
  const gmpUpdated = cleanGarbledText(String(parseArrayData(blog.gmp_last_updated)[0] || blog.gmp_last_updated || ""));

  const finEnded = parseArrayData(blog.finantial_information_ended);
  const finAssets = parseArrayData(blog.finantial_information_assets);
  const finRevenue = parseArrayData(blog.finantial_information_revenue);
  const finProfit = parseArrayData(blog.finantial_information_profit_tax);
  const finReserves = parseArrayData(blog.financial_info_reserves_surplus);
  const finNetworth = parseArrayData(blog.finantial_information_networth);
  const finBorrowing = parseArrayData(blog.finantial_information_borrowing);

  const revenue = formatIndianNumber(cleanGarbledText(String(finRevenue[0] || blog.finantial_information_revenue || "")));
  const profit = formatIndianNumber(cleanGarbledText(String(finProfit[0] || blog.finantial_information_profit_tax || "")));
  const networth = formatIndianNumber(cleanGarbledText(String(finNetworth[0] || blog.finantial_information_networth || "")));
  const borrowing = formatIndianNumber(cleanGarbledText(String(finBorrowing[0] || blog.finantial_information_borrowing || "")));
  const preHolding = cleanGarbledText(String(parseArrayData(blog.promotor_hold_pre_issue)[0] || blog.promotor_hold_pre_issue || ""));
  const postHolding = cleanGarbledText(String(parseArrayData(blog.promotor_hold_post_issue)[0] || blog.promotor_hold_post_issue || ""));
  const preEps = cleanGarbledText(blog.key_pri_ipo_eps || "");
  const postEps = cleanGarbledText(blog.key_pos_ipo_eps || "");
  const prePe = cleanGarbledText(blog.key_pre_ipo_pe || "");
  const postPe = cleanGarbledText(blog.key_post_ipo_pe || "");
  const appInfoArray = parseArrayData(blog.ipo_lots_application);

  const isUpcoming = blog.upcoming === "1";

  const defaultLabels = [
    "IPO Date", "Listing Date", "Face Value", "Issue Price Band",
    "Lot Size", "Sale Type", "Total Issue Size", "Reserved for Market Maker",
    "Fresh Issue(Ex Market Maker)", "Offer for Sale", "Net Offered to Public",
    "Issue Type", "Listing At", "Share Holding Pre Issue", "Share Holding Post Issue"
  ];
  const ipoDetailsLabels = parseArrayData(blog.ipo_details);
  const ipoDescItems = parseArrayData(blog.ipo_description);

  // ── Smart Data Mapping Logic ──────────────────────────────────
  const getSmartIpoDetails = () => {
    const labels = ipoDetailsLabels.length > 0 ? ipoDetailsLabels : defaultLabels;
    const finalMap: Record<string, string> = {};
    const usedIndices = new Set<number>();

    // 0. Primary Pass: Direct Mapping if lengths match (Most reliable for form-based data)
    if (labels.length === ipoDescItems.length) {
      return labels.map((l, i) => ({
        label: l,
        value: isValid(ipoDescItems[i]) ? ipoDescItems[i] : "-"
      }));
    }

    // 1. First Pass: Handle items with explicit labels (e.g., "Face Value: 10")
    ipoDescItems.forEach((item, idx) => {
      const parts = item.split(/[:–-](.+)/);
      if (parts.length > 1) {
        const key = parts[0].trim();
        const val = parts.slice(1).join("").trim();
        if (isValid(val)) {
          finalMap[key] = val;
          usedIndices.add(idx);
        }
      }
    });

    // 2. Second Pass: Heuristic matching for values without labels
    const allDescValues = ipoDescItems.map((v, i) => ({ v, i, l: v.toLowerCase() }));

    ipoDescItems.forEach((item, idx) => {
      if (usedIndices.has(idx) || !isValid(item)) return;
      const val = item.toLowerCase();
      let targetLabel = "";

      // Heuristics for unstructured data
      if (val.includes("₹") && !val.includes("cr") && !val.includes("agg")) {
        const numMatch = val.match(/\d+/);
        const numericValue = numMatch ? parseInt(numMatch[0]) : 0;

        if (val.includes("to") || val.includes("-")) {
          targetLabel = "Issue Price Band";
        } else if (val.includes("per share") || val.includes("per equity")) {
          if (numericValue <= 10) targetLabel = "Face Value";
          else targetLabel = "Issue Price Band";
        }
      }
      else if (val.includes("shares") && (item.length < 15 || val.includes("lot"))) targetLabel = "Lot Size";
      else if (val.includes("bse") || val.includes("nse")) targetLabel = "Listing At";
      else if (val.includes("building") || val.includes("fixed price")) targetLabel = "Issue Type";
      else if (val.includes("fresh") || val.includes("ofs") || val.includes("capital")) targetLabel = "Sale Type";
      else if (/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/.test(val)) {
        if (val.includes("to") || val.includes("-")) targetLabel = "IPO Date";
        else targetLabel = "Listing Date";
      }
      else if (val.includes("shares")) {
        // High priority: Specific Keywords
        if (val.includes("market maker") || val.includes("markets") || val.includes("arihant") || val.includes("nikunj") || val.includes("stock brokers")) {
          targetLabel = "Reserved for Market Maker";
        } else if (val.includes("ofs") || val.includes("offer for sale") || val.includes("shares of ₹")) {
          targetLabel = "Offer for Sale";
        } else if (val.includes("fresh") && val.includes("issue")) {
          targetLabel = "Fresh Issue(Ex Market Maker)";
        } else if (val.includes("net") || val.includes("public")) {
          targetLabel = "Net Offered to Public";
        } else if (val.includes("agg") || val.includes("up to")) {
          // Sequential heuristic for aggregated items
          const upTos = allDescValues.filter(x => x.l.includes("shares") && (x.l.includes("agg") || x.l.includes("up to")));
          const uIdx = upTos.findIndex(x => x.i === idx);

          if (uIdx === 0) targetLabel = "Total Issue Size";
          else if (uIdx === upTos.length - 1) targetLabel = "Net Offered to Public";
          else {
            // Check remaining labels in order: Market Maker, Fresh, OFS, etc.
            if (!finalMap["Reserved for Market Maker"] || finalMap["Reserved for Market Maker"] === "-") targetLabel = "Reserved for Market Maker";
            else if (!finalMap["Fresh Issue(Ex Market Maker)"] || finalMap["Fresh Issue(Ex Market Maker)"] === "-") targetLabel = "Fresh Issue(Ex Market Maker)";
            else if (!finalMap["Offer for Sale"] || finalMap["Offer for Sale"] === "-") targetLabel = "Offer for Sale";
          }
        } else {
          // Likely Holdings or other counts (no "agg")
          const hldings = allDescValues.filter(x => x.l.includes("shares") && !x.l.includes("market") && !x.l.includes("public") && !x.l.includes("lot") && !x.l.includes("agg") && !x.l.includes("up to"));
          const hIdx = hldings.findIndex(x => x.i === idx);
          if (hIdx === hldings.length - 2) targetLabel = "Share Holding Pre Issue";
          else if (hIdx === hldings.length - 1) targetLabel = "Share Holding Post Issue";
        }
      }

      if (targetLabel && (!finalMap[targetLabel] || finalMap[targetLabel] === "-")) {
        finalMap[targetLabel] = item;
        usedIndices.add(idx);
      }
    });

    // 3. Third Pass: Priority Blog Fields (ONLY if not found in descriptions and looks like real data)
    if (!finalMap["IPO Date"] && isValidRealData(gmpDate)) finalMap["IPO Date"] = gmpDate;
    if (!finalMap["Issue Price Band"] && isValidRealData(gmpPrice)) finalMap["Issue Price Band"] = gmpPrice;
    if (!finalMap["Share Holding Pre Issue"] && isValidRealData(preHolding)) finalMap["Share Holding Pre Issue"] = preHolding;
    if (!finalMap["Share Holding Post Issue"] && isValidRealData(postHolding)) finalMap["Share Holding Post Issue"] = postHolding;

    // Construct final list based on correct label order
    const result: { label: string; value: string }[] = labels.map(l => ({
      label: l,
      value: finalMap[l] || "-"
    }));

    // Add any truly unknown items
    ipoDescItems.forEach((item, idx) => {
      if (!usedIndices.has(idx)) {
        result.push({ label: `Extra Detail`, value: formatIndianNumber(item) });
      }
    });

    return result;
  };

  const finalIpoDetails = getSmartIpoDetails();

  // ── Smart Timeline Mapping ───────────────────────────────────
  const getSmartTimeline = () => {
    const labels = timelineLabels.length > 0 ? timelineLabels : [
      "IPO Open Date", "IPO Close Date", "Tentative Allotment",
      "Initiation of Refunds", "Credit of Shares to Demat",
      "Tentative Listing Date", "Cut-off time for UPI mandate confirmation"
    ];
    const finalMap: Record<string, string> = {};
    const usedIndices = new Set<number>();

    // 1. Explicit Key:Value matching
    timelineDates.forEach((item, idx) => {
      const parts = item.split(/[:–-](.+)/);
      if (parts.length > 1) {
        const key = parts[0].trim();
        const val = parts.slice(1).join("").trim();
        if (isValid(val)) {
          finalMap[key] = val;
          usedIndices.add(idx);
        }
      }
    });

    // 2. Heuristics for remaining dates
    timelineDates.forEach((item, idx) => {
      if (usedIndices.has(idx)) return;
      const lower = item.toLowerCase();

      if (lower.includes("5:00 pm") || lower.includes("cut-off") || lower.includes("mandate")) {
        finalMap["Cut-off time for UPI mandate confirmation"] = item;
        usedIndices.add(idx);
      } else if (/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/.test(lower) || /\d{1,2}[\/\-]\d{1,2}/.test(lower)) {
        // Find first empty non-cutoff slot
        const emptySlot = labels.find(l => !finalMap[l] && l !== "Cut-off time for UPI mandate confirmation");
        if (emptySlot) {
          finalMap[emptySlot] = item;
          usedIndices.add(idx);
        }
      }
    });

    // 3. Fallback for any remaining unassigned items
    labels.forEach((l, i) => {
      if (!finalMap[l] && timelineDates[i] && !usedIndices.has(i)) {
        finalMap[l] = timelineDates[i];
        usedIndices.add(i);
      }
    });

    return labels.map(l => ({ label: l, value: finalMap[l] || "-" }));
  };
  // ── Smart KPI Mapping ───────────────────────────────────────
  const getSmartKpis = () => {
    const defaultLabels = ["ROE", "ROCE", "Debt/Equity", "RoNW", "PAT Margin", "EBITDA Margin", "Price to Book Value"];
    const labels = kpiNames.length > 0 ? kpiNames : defaultLabels;
    const finalMap: Record<string, string> = {};

    // Direct Mapping if lengths match
    if (labels.length === kpiValues.length) {
      return labels.map((l, i) => ({
        label: l,
        value: isValid(kpiValues[i]) ? kpiValues[i] : "-"
      }));
    }

    let valPtr = 0;
    labels.forEach((label) => {
      if (valPtr >= kpiValues.length) return;

      const lowerL = label.toLowerCase();
      const currentVal = kpiValues[valPtr];
      const isValPercentage = currentVal.includes("%");

      // Categorize if this label EXPECTS a percentage
      const expectsPercentage = lowerL.includes("roe") ||
        lowerL.includes("roce") ||
        lowerL.includes("ronw") ||
        lowerL.includes("margin");

      if (expectsPercentage === isValPercentage) {
        // Correct type match, assign and move pointer
        finalMap[label] = currentVal;
        valPtr++;
      } else {
        // Type mismatch! 
        finalMap[label] = "-";
      }
    });

    return labels.map(l => ({ label: l, value: finalMap[l] || "-" }));
  };

  const finalTimeline = getSmartTimeline();
  const finalKpis = getSmartKpis();
  const displayTitle = blog.title.replace(/\s+IPO$/i, "").trim();

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f5ff]">
      <SEOHead
        title={stripHtml(blog.meta_title) || `${stripHtml(blog.title)} - IndiaIPO`}
        description={stripHtml(blog.description) || `Read details and updates about ${stripHtml(blog.title)}`}
        keywords={blog.keyword || undefined}
        ogImage={getImgSrc(blog.image) || undefined}
      />
      <Header />

      {/* ─── PREMIUM HERO BANNER ─────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0c1e4a 0%, #1e3a8a 45%, #1e40af 70%, #1d4ed8 100%)' }}>
        {/* Decorative grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        {/* Gold accent glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)', transform: 'translate(30%, -40%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-8" style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)', transform: 'translate(-30%, 40%)' }} />

        {/* Background image overlay */}
        {isValid(getImgSrc(blog.image)) && (
          <div className="absolute inset-0">
            <img src={getImgSrc(blog.image)!} alt="" className="w-full h-full object-cover opacity-[0.07]" />
          </div>
        )}

        <div className="relative container mx-auto px-4 py-10 lg:py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs mb-8 text-blue-200/70">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/ipo-blogs" className="hover:text-white transition-colors">IPO Blogs</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/90 truncate max-w-[200px]">{blog.title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Left Content */}
            <div className="flex-1">
              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 mb-5">
                <span className={`inline-flex items-center gap-1.5 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide ${isUpcoming ? 'bg-amber-500/90' : 'bg-emerald-500/90'}`}>
                  {isUpcoming ? "⏳ UPCOMING IPO" : "✅ CURRENT IPO"}
                </span>
                <span className="inline-flex items-center gap-1.5 text-blue-100 text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <Tag className="w-3 h-3" />
                  {(blog.category || 'IPO').replace(/_/g, ' ').toUpperCase()}
                </span>
                {blog.confidential === "1" && (
                  <span className="inline-flex items-center gap-1 text-red-200 text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)' }}>
                    <Shield className="w-3 h-3" /> CONFIDENTIAL
                  </span>
                )}
                {isValid(blog.new_highlight_text) && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white' }}>
                    <Star className="w-3 h-3" /> {blog.new_highlight_text}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-5 font-heading">
                {blog.title}
              </h1>

              {(isValid(blog.description) || isValid(blog.ipo_details)) && (
                <p className="text-blue-200/75 text-sm md:text-base leading-relaxed max-w-2xl mb-7">
                  {stripHtml(cleanGarbledText(isValid(blog.description) ? blog.description : blog.ipo_details)).substring(0, 220)}
                  {stripHtml(cleanGarbledText(isValid(blog.description) ? blog.description : blog.ipo_details)).length > 220 ? '...' : ''}
                </p>
              )}

              {/* Key Metrics Pills */}
              <div className="flex flex-wrap gap-3">
                {isValid(gmpPrice) && (
                  <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
                    <IndianRupee className="w-4 h-4 text-amber-400" />
                    <div>
                      <p className="text-[9px] text-blue-300 uppercase font-bold tracking-widest">Price Band</p>
                      <p className="text-white font-black text-sm leading-none">{gmpPrice}</p>
                    </div>
                  </div>
                )}
                {isValid(latestGmp) && (
                  <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <div>
                      <p className="text-[9px] text-emerald-300 uppercase font-bold tracking-widest">Latest GMP</p>
                      <p className="text-emerald-300 font-black text-sm leading-none">{latestGmp}</p>
                    </div>
                  </div>
                )}
                {isValid(gmpDate) && (
                  <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
                    <Calendar className="w-4 h-4 text-blue-300" />
                    <div>
                      <p className="text-[9px] text-blue-300 uppercase font-bold tracking-widest">IPO Date</p>
                      <p className="text-white font-black text-sm leading-none">{gmpDate}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Company Image Card */}
            {isValid(getImgSrc(blog.image)) && (
              <div className="lg:w-64 shrink-0">
                <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: '2px solid rgba(245,158,11,0.4)', background: 'rgba(255,255,255,0.05)' }}>
                  <img src={getImgSrc(blog.image)!} alt={blog.title} className="w-full h-48 object-cover" />
                  <div className="p-3 text-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <p className="text-white/80 text-xs font-semibold truncate">{blog.title}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 28L1440 28L1440 0C1200 22 720 28 360 14C180 7 60 0 0 0L0 28Z" fill="#f0f5ff" />
          </svg>
        </div>
      </div>

      {/* ─── MAIN CONTENT ───────────────────────────────────────────── */}
      <main className="flex-1 container mx-auto px-4 pt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-8 space-y-5">

            {/* IPO Details Table */}
            {finalIpoDetails.length > 0 && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
                <SectionHeader icon={Info} title={`${blog.title.replace(/\s+IPO$/i, "").trim()} IPO Details`} accent="blue" />
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <th className="py-2.5 px-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-2/5" style={{ borderRight: '1px solid #e2e8f0' }}>Detail</th>
                        <th className="py-2.5 px-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {finalIpoDetails.map((detail, idx) => (
                        <tr key={idx} className="transition-colors hover:bg-blue-50/40" style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#fff' : '#fafbff' }}>
                          <td className="py-3 px-5 font-semibold text-slate-500 text-sm" style={{ borderRight: '1px solid #f1f5f9' }}>{detail.label}</td>
                          <td className="py-3 px-5 font-bold text-slate-800 text-sm">{formatIndianNumber(detail.value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Main Content Section */}
            {isValid(blog.content) && (
              <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100 mb-12 relative">
                {/* Decorative glow */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

                <SectionHeader icon={FileText} title={`About ${blog.title}`} accent="blue" />
                <div className="p-8 md:p-14 relative z-10">
                  <SmartBlogRenderer content={blog.content} />
                </div>
              </div>
            )}

            {/* Financial Highlights */}
            {(isValid(blog.finantial_information_assets) || finEnded.length > 0) && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
                <SectionHeader icon={BarChart3} title={`${blog.title} Financial Information`} accent="green" />
                <div className="p-5">
                  {/* Summary Cards */}
                  {(isValid(revenue) || isValid(profit) || isValid(networth) || isValid(borrowing)) && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      {[
                        { label: "Latest Revenue", val: revenue, color: "#1e40af", bg: "#eff6ff", border: "#bfdbfe" },
                        { label: "Profit After Tax", val: profit, color: "#065f46", bg: "#f0fdf4", border: "#bbf7d0" },
                        { label: "Net Worth", val: networth, color: "#4c1d95", bg: "#f5f3ff", border: "#ddd6fe" },
                        { label: "Total Borrowing", val: borrowing, color: "#9a3412", bg: "#fff7ed", border: "#fed7aa" },
                      ].filter(m => isValid(m.val)).map((m, i) => (
                        <div key={i} className="rounded-xl p-4 text-center" style={{ background: m.bg, border: `1px solid ${m.border}` }}>
                          <p className="text-[9px] font-black uppercase tracking-wider mb-1.5" style={{ color: m.color }}>{m.label}</p>
                          <p className="text-lg font-black" style={{ color: '#0f172a' }}>{m.val}</p>
                          <p className="text-[9px] text-slate-400 mt-0.5">₹ Crore</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Financial Table */}
                  <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid #e2e8f0' }}>
                    {finEnded.length > 0 ? (
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr style={{ background: 'linear-gradient(135deg, #1e3a8a, #1e40af)' }}>
                            {['Period Ended', ...(finAssets.length > 0 ? ['Assets'] : []), ...(finRevenue.length > 0 ? ['Total Income'] : []), ...(finProfit.length > 0 ? ['Profit After Tax'] : []), ...(finNetworth.length > 0 ? ['Net Worth'] : []), ...(finReserves.length > 0 ? ['Reserves & Surplus'] : []), ...(finBorrowing.length > 0 ? ['Total Borrowing'] : [])].map((h, i) => (
                              <th key={i} className="p-3 text-left text-xs font-bold text-blue-100 uppercase tracking-wide whitespace-nowrap" style={{ borderRight: '1px solid rgba(255,255,255,0.1)' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {finEnded.map((date, idx) => (
                            <tr key={idx} className="transition-colors hover:bg-blue-50/50" style={{ background: idx % 2 === 0 ? '#fff' : '#f8faff', borderBottom: '1px solid #e2e8f0' }}>
                              <td className="p-3 font-bold text-[#1e40af] text-xs whitespace-nowrap" style={{ borderRight: '1px solid #e2e8f0' }}>{date}</td>
                              {finAssets.length > 0 && <td className="p-3 text-slate-700 text-xs" style={{ borderRight: '1px solid #e2e8f0' }}>{formatIndianNumber(finAssets[idx]) || "—"}</td>}
                              {finRevenue.length > 0 && <td className="p-3 text-slate-700 text-xs" style={{ borderRight: '1px solid #e2e8f0' }}>{formatIndianNumber(finRevenue[idx]) || "—"}</td>}
                              {finProfit.length > 0 && <td className="p-3 font-semibold text-emerald-700 text-xs" style={{ borderRight: '1px solid #e2e8f0' }}>{formatIndianNumber(finProfit[idx]) || "—"}</td>}
                              {finNetworth.length > 0 && <td className="p-3 text-slate-700 text-xs" style={{ borderRight: '1px solid #e2e8f0' }}>{formatIndianNumber(finNetworth[idx]) || "—"}</td>}
                              {finReserves.length > 0 && <td className="p-3 text-slate-700 text-xs" style={{ borderRight: '1px solid #e2e8f0' }}>{formatIndianNumber(finReserves[idx]) || "—"}</td>}
                              {finBorrowing.length > 0 && <td className="p-3 text-slate-700 text-xs">{formatIndianNumber(finBorrowing[idx]) || "—"}</td>}
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr style={{ background: '#f8fafc' }}>
                            <td colSpan={10} className="p-2.5 text-right text-[10px] font-bold italic" style={{ color: '#ef4444' }}>
                              Amount in ₹ Crore
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    ) : (
                      <div
                        className="prose prose-sm max-w-none p-4 [&_table]:w-full [&_table]:border-collapse [&_th]:p-3 [&_th]:text-left [&_th]:font-bold [&_th]:text-white [&_th]:border [&_th]:border-blue-700 [&_td]:p-3 [&_td]:border [&_td]:border-slate-200 [&_td]:text-slate-700"
                        style={{ ['--tw-prose-th-background' as any]: '#1e40af' }}
                        dangerouslySetInnerHTML={{ __html: cleanGarbledText(blog.finantial_information_assets) }}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Key Performance Indicators (ROE, ROCE, etc.) */}
            {finalKpis.length > 0 && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
                <SectionHeader icon={Activity} title={`${displayTitle} Key Performance Indicator`} accent="blue" />
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <th className="text-left py-3 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">KPI</th>
                        <th className="text-right py-3 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Values</th>
                      </tr>
                    </thead>
                    <tbody>
                      {finalKpis.map((kpi, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors" style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 !== 0 ? '#fafbff' : '#fff' }}>
                          <td className="py-3 px-5 font-semibold text-slate-600">{kpi.label}</td>
                          <td className="py-3 px-5 text-right font-black text-slate-800">{kpi.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* EPS & P/E Table */}
            {(isValidRealData(prePe) || isValidRealData(preEps)) && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm mt-5" style={{ border: '1px solid #e2e8f0' }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <th className="py-3 px-5 w-1/3"></th>
                        <th className="text-center py-3 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Pre IPO</th>
                        <th className="text-center py-3 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Post IPO</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-blue-50/40 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="py-3.5 px-5 font-bold text-slate-800">EPS (Rs)</td>
                        <td className="py-3.5 px-5 text-center font-black text-slate-700">{isValidRealData(preEps) ? preEps : "-"}</td>
                        <td className="py-3.5 px-5 text-center font-black text-slate-700">{isValidRealData(postEps) ? postEps : "-"}</td>
                      </tr>
                      <tr className="hover:bg-blue-50/40 transition-colors" style={{ borderBottom: '1px solid #f1f5f9', background: '#fafbff' }}>
                        <td className="py-3.5 px-5 font-bold text-slate-800">P/E (x)</td>
                        <td className="py-3.5 px-5 text-center font-black text-slate-700">{isValidRealData(prePe) ? prePe : "-"}</td>
                        <td className="py-3.5 px-5 text-center font-black text-slate-700">{isValidRealData(postPe) ? postPe : "-"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}


            {/* FAQs */}
            {isValid(blog.faqs) && (() => {
              let faqItems: { question: string; answer: string }[] = [];
              try {
                const parsed = JSON.parse(blog.faqs);
                if (Array.isArray(parsed)) {
                  faqItems = parsed.filter(f => f && f.question && f.answer).map(f => ({ question: cleanGarbledText(f.question), answer: cleanGarbledText(f.answer) }));
                }
              } catch (e) { }
              if (faqItems.length === 0) return null;
              return (
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
                  <SectionHeader icon={HelpCircle} title="Frequently Asked Questions" accent="purple" />
                  <div className="divide-y" style={{ borderColor: '#f1f5f9' }}>
                    {faqItems.map((faq, idx) => (
                      <FAQAccordionItem key={idx} faq={faq} index={idx} />
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* ─── RIGHT SIDEBAR ─── */}
          <div className="lg:col-span-4 space-y-4">

            {/* Competitive Strengths (Moved here) */}
            {strengths.length > 0 && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
                <SectionHeader icon={CheckCircle2} title="Competitive Strengths" accent="green" />
                <div className="p-4 space-y-3">
                  {strengths.map((s, idx) => (
                    <div key={idx} className="flex gap-3 items-start p-3.5 rounded-xl transition-all hover:bg-emerald-50/50" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                      <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white mt-0.5 shadow-sm" style={{ background: 'linear-gradient(135deg, #065f46, #047857)' }}>{idx + 1}</div>
                      <p className="text-[13px] font-bold text-slate-700 leading-snug">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related IPO Blogs */}
            {relatedBlogs.length > 0 && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
                <SectionHeader icon={Flame} title="Related IPO Blogs" accent="blue" />
                <div className="divide-y" style={{ borderColor: '#f1f5f9' }}>
                  {relatedBlogs.map((rb) => {
                    const rbPrice = cleanGarbledText(String(rb.gmp_ipo_price || ''));
                    const rbDate = cleanGarbledText(String(rb.gmp_date || ''));
                    const rbImg = getImgSrc(rb.image);
                    const isUp = rb.upcoming === '1';
                    return (
                      <Link
                        key={rb.id}
                        to={`/ipo-blogs/${rb.slug}`}
                        className="flex gap-3 p-3.5 hover:bg-blue-50/40 transition-colors group block"
                      >
                        {/* Thumbnail */}
                        <div className="shrink-0 w-14 h-14 rounded-xl overflow-hidden" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                          {isValid(rbImg) ? (
                            <img src={rbImg!} alt={rb.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BarChart3 className="w-6 h-6" style={{ color: '#1e40af' }} />
                            </div>
                          )}
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-[#1e40af] transition-colors">{rb.title}</p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isUp ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                              {isUp ? 'Upcoming' : 'Current'}
                            </span>
                            {/* {isValid(rbPrice) && (
                              <span className="text-[9px] text-slate-500 font-semibold flex items-center gap-0.5">
                                <IndianRupee className="w-2.5 h-2.5" />{rbPrice}
                              </span>
                            )}
                            {isValid(rbDate) && (
                              <span className="text-[9px] text-slate-400 flex items-center gap-0.5">
                                <Calendar className="w-2.5 h-2.5" />{rbDate}
                              </span>
                            )} */}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#1e40af] shrink-0 self-center transition-colors" />
                      </Link>
                    );
                  })}
                </div>
                <div className="px-4 py-3" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                  <Link to="/ipo-blogs" className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#1e40af] hover:text-[#1d4ed8] transition-colors">
                    View All IPO Blogs <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Official Documents */}
            {(isValid(blog.drhp) || isValid(blog.rhp) || isValid(blog.confidential_drhp)) && (
              <div className="rounded-2xl overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, #0c1e4a 0%, #1e3a8a 60%, #1e40af 100%)', border: '1px solid rgba(245,158,11,0.3)' }}>
                <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="flex items-center gap-2 text-white font-bold text-sm font-heading">
                    <FileText className="w-4 h-4 text-amber-400" /> Official Documents
                  </div>
                  <p className="text-[10px] text-blue-300/60 mt-0.5">Download regulatory filings</p>
                </div>
                <div className="p-4 space-y-2.5">
                  {[
                    { label: "Download DRHP", icon: "📄", link: blog.drhp },
                    { label: "Download RHP", icon: "📋", link: blog.rhp },
                    { label: "Confidential DRHP", icon: "🔒", link: blog.confidential_drhp }
                  ].map((doc, idx) => {
                    if (!isValid(doc.link)) return null;
                    const rawLink = String(doc.link || '').trim();
                    const isExternal = rawLink.startsWith('http');
                    let href: string;
                    if (isExternal) { href = rawLink; }
                    else if (rawLink.startsWith('/uploads') || rawLink.startsWith('uploads/')) { href = rawLink.startsWith('/') ? rawLink : `/${rawLink}`; }
                    else { href = `/uploads/${rawLink}`; }
                    return (
                      <a key={idx} href={href} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-white text-sm font-semibold transition-all group hover:scale-[1.02]"
                        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(245,158,11,0.2)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                      >
                        <span className="flex items-center gap-2"><span>{doc.icon}</span>{doc.label}</span>
                        <Download className="w-4 h-4 text-amber-400 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* IPO Timeline */}
            {finalTimeline.length > 0 && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
                <SectionHeader icon={Calendar} title={`${displayTitle} IPO Timeline`} accent="blue" />
                <table className="w-full text-sm">
                  <tbody>
                    {finalTimeline.map((item, idx) => (
                      <tr key={idx} className="transition-colors hover:bg-blue-50/30" style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#fff' : '#fafbff' }}>
                        <td className="py-2.5 px-5 text-slate-500 font-medium text-xs">{item.label}</td>
                        <td className="py-2.5 px-5 text-right font-bold text-[#1e40af] text-[11px] leading-tight">
                          {item.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Lot Size Table */}
            {lots.length > 0 && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
                <SectionHeader icon={TrendingUp} title="IPO Lot Size" accent="gold" />
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: '#fffbeb', borderBottom: '1px solid #fed7aa' }}>
                      <th className="text-left py-2.5 px-5 text-xs font-bold text-amber-700 uppercase">Investors</th>
                      <th className="text-center py-2.5 px-3 text-xs font-bold text-amber-700 uppercase">No.of lots</th>
                      <th className="text-center py-2.5 px-3 text-xs font-bold text-amber-700 uppercase">Shares Offered</th>
                      <th className="text-right py-2.5 px-5 text-xs font-bold text-amber-700 uppercase">Max Bid Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lots.map((lot, idx) => (
                      <tr key={idx} className="hover:bg-amber-50/30 transition-colors" style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#fff' : '#fffdf7' }}>
                        <td className="py-3 px-5 font-semibold text-slate-700 text-xs">{appInfoArray[idx] || "—"}</td>
                        <td className="py-3 px-3 text-center font-bold text-amber-700 text-xs">{lot}</td>
                        <td className="py-3 px-3 text-center text-slate-600 font-semibold text-xs">{cleanGarbledText(lotShares[idx] || "—")}</td>
                        <td className="py-3 px-5 text-right font-black text-slate-900 text-xs">{cleanGarbledText(lotAmounts[idx] || "—")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Investor categories integrated into table */}
              </div>
            )}

            {/* GMP Card */}
            {isValid(latestGmp) && (
              <div className="rounded-2xl p-5 text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)' }}>
                <p className="text-emerald-200 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Grey Market Premium
                </p>
                <p className="text-4xl font-black mb-1 font-heading">{latestGmp}</p>
                {isValid(gmpPrice) && <p className="text-emerald-200 text-sm">vs. Issue Price: <span className="font-bold text-white">{gmpPrice}</span></p>}
                {isValid(gmpUpdated) && <p className="text-emerald-300/70 text-[10px] mt-3">Last Updated: {gmpUpdated}</p>}
              </div>
            )}

            {/* Promoter Holding */}
            {(isValidRealData(preHolding) || isValidRealData(postHolding)) && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
                <SectionHeader icon={Wallet} title="Promoter Holding" accent="purple" />
                <div className="p-5 space-y-5">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-slate-500">Post-Issue Holding</span>
                      <span style={{ color: '#4c1d95' }}>{isValidRealData(preHolding) ? preHolding : "-"}</span>
                    </div>
                    {isValidRealData(preHolding) && preHolding.includes('%') && (
                      <div className="h-2.5 w-full rounded-full overflow-hidden" style={{ background: '#f1f5f9' }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: preHolding, background: 'linear-gradient(90deg, #4c1d95, #7c3aed)' }} />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-slate-500">Pre-Issue Holding</span>
                      <span style={{ color: '#065f46' }}>{isValidRealData(postHolding) ? postHolding : "-"}</span>
                    </div>
                    {isValidRealData(postHolding) && postHolding.includes('%') && (
                      <div className="h-2.5 w-full rounded-full overflow-hidden" style={{ background: '#f1f5f9' }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: postHolding, background: 'linear-gradient(90deg, #065f46, #059669)' }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default IPOBlogDetails;
