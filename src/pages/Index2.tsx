import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";
import SitePopup from "@/components/SitePopup";
import { mockIPOs, blogPosts } from "@/data/mockData";
import { getImgSrc } from "@/utils/image";
import heroVideo from "@/assets/ccvindia1.mp4";

interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string;
  video_url?: string | null;
  type?: "image" | "video";
  cta_text: string | null;
  cta_link: string | null;
  badge_text?: string | null;
  cta2_text?: string | null;
  cta2_link?: string | null;
  sort_order: number;
  is_active?: boolean;
}

const fallbackBanners: Banner[] = [
  {
    id: "1",
    title: "Invest in IPOs Smarter",
    subtitle: "Track real-time GMP, analyze deep market insights, and participate in India's growth story with confidence.",
    image_url: "",
    video_url: "/video/ccvindia1.mp4",
    type: "video",
    cta_text: "Explore IPOs",
    cta_link: "/ipo-calendar",
    badge_text: "SEBI Registered IPO Consultancy",
    cta2_text: "View GMP",
    cta2_link: "/ipo-calendar",
    sort_order: 1,
  },
];

import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";
import report from "@/assets/coverIm.webp"
import {
  ArrowRight, ChevronRight, TrendingUp, Play, ShieldCheck,
  Zap, Monitor, Shield, Download, Activity, BarChart2,
  ChevronDown, Globe, Users, Mail, Home, Newspaper,
  User, BarChart, Lightbulb, Search, ChevronLeft,
  CheckCircle2, Building2, Scale, Briefcase, BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer3 from "@/components/Footer"
import AboutPreview from "@/components/AboutPreview";
import ServicesSection from "@/components/ServicesSection";
import gmpAlertsBg from "@/assets/gmp_alerts_bg.png";
import verifiedDataBg from "@/assets/verified_data_bg.png";
import expertAnalysisBg from "@/assets/expert_analysis_bg.png";
import seamlessInterfaceBg from "@/assets/seamless_interface_bg.png";
import sebiAnalystBg from "@/assets/sebi_analyst_bg.png";
import { Footer } from "react-day-picker";

const blogImgs: Record<string, string> = { "blog-1": blog1, "blog-2": blog2, "blog-3": blog3 };

const MarqueeStyles = () => (
  <style>{`
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee-mobile {
      width: max-content;
      animation: marquee 20s linear infinite;
    }
    .animate-marquee-mobile > * {
      flex-shrink: 0;
    }
    @media (min-width: 768px) {
      .animate-marquee-mobile {
        animation: none;
        width: 100%;
        transform: none !important;
      }
    }
  `}</style>
);

/* ── 1. HERO ── */
const Hero = () => {
  const [banners, setBanners] = useState<Banner[]>(fallbackBanners);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const res = await fetch("/api/banners?page=/");
        const data = await res.json();
        const activeBanners = data.filter((b: Banner) => b.is_active);
        if (activeBanners.length > 0) {
          const mapped = activeBanners.map((b: Banner) => ({
            ...b,
            image_url: b.image_url || "/assets/hero-banner-1.jpg",
            type: b.video_url ? "video" : (b.type || "image"),
            video_url: b.video_url
          }));
          setBanners(mapped);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadBanners();
  }, []);

  const banner = banners[current];

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative overflow-hidden flex items-center bg-slate-950" style={{ minHeight: 720 }}>
      {/* Background with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0"
        >
          {banner?.video_url ? (
            <video
              src={getImgSrc(banner.video_url) || ""}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : banner?.image_url ? (
            <img
              src={getImgSrc(banner.image_url) || ""}
              alt={banner.title || "Banner"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-900" />
          )}
          {/* Overlay Gradient */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.6) 50%, rgba(15,23,42,0.2) 100%)" }} />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 container mx-auto px-4 py-24 md:py-32 w-full">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              {banner.badge_text && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-6 backdrop-blur-sm"
                >
                  <ShieldCheck className="h-4 w-4" />
                  {banner.badge_text}
                </motion.span>
              )}

              <motion.h1
                className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight mb-6"
              >
                {banner.title}
              </motion.h1>

              <motion.p
                className="text-xl text-white/70 leading-relaxed mb-10 max-w-lg"
              >
                {banner.subtitle}
              </motion.p>

              <div className="flex flex-wrap gap-4">
                <Link to={banner.cta_link || "/ipo-calendar"} className="px-8 py-4 bg-amber-700 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-amber-600 hover:shadow-amber-900/20 transition-all flex items-center gap-2 active:scale-95">
                  {banner.cta_text || "Explore IPOs"} <ArrowRight className="h-5 w-5" />
                </Link>
                {banner.cta2_text ? (
                  <Link to={banner.cta2_link || "/ipo-calendar"} className="px-8 py-4 bg-blue-800/70 text-blue-100 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700/80 transition-all active:scale-95 backdrop-blur-sm">
                    {banner.cta2_text}
                  </Link>
                ) : (
                  <Link to="/ipo-calendar" className="px-8 py-4 bg-blue-800/70 text-blue-100 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700/80 transition-all active:scale-95 backdrop-blur-sm">
                    View GMP
                  </Link>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slider Controls */}
      {banners.length > 1 && (
        <>
          <div className="absolute bottom-10 left-4 md:left-8 z-20 flex gap-4">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-md transition-all border border-white/10"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-md transition-all border border-white/10"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          <div className="absolute bottom-12 right-4 md:right-8 z-20 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`transition-all duration-500 rounded-full h-1.5 ${i === current ? "bg-amber-500 w-8" : "bg-white/30 w-4 hover:bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

/* ── 2. LIVE IPO LISTINGS ── */
const statusStyle: Record<string, string> = {
  Open: "bg-green-200 text-green-800",
  Upcoming: "bg-slate-200 text-slate-600",
  Closed: "bg-red-100 text-red-800",
  Listed: "bg-blue-100 text-blue-800",
};
const actionBtn: Record<string, { label: string; cls: string }> = {
  Open: { label: "View Details", cls: "bg-blue-900 text-white hover:bg-blue-800" },
  Upcoming: { label: "View Details", cls: "bg-slate-200 text-slate-700 hover:bg-slate-300" },
  Closed: { label: "View Details", cls: "border border-blue-900 text-blue-900 hover:bg-blue-50" },
  Listed: { label: "View Details", cls: "bg-blue-900 text-white hover:bg-blue-800" },
};

const LiveIPOs = () => {
  const [ipos, setIpos] = useState(mockIPOs.slice(0, 3));
  useEffect(() => {
    fetch("/api/ipos?limit=3").then(r => r.ok ? r.json() : null).then(d => { if (Array.isArray(d) && d.length) setIpos(d.slice(0, 3)); }).catch(() => { });
  }, []);
  return (
    <section className="py-20 px-4 container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-end mb-12"
      >
        <div>
          <span className="text-amber-700 font-bold tracking-widest uppercase text-xs mb-2 block">Market Watch</span>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Live IPO Listings</h2>
        </div>
        <Link to="/ipo-calendar" className="hidden md:flex text-blue-900 font-bold items-center gap-1 hover:underline">
          View all listings <ChevronRight className="h-4 w-4" />
        </Link>
      </motion.div>
      <div className="overflow-hidden md:overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-6 md:grid md:grid-cols-3 md:gap-8 animate-marquee-mobile hover:[animation-play-state:paused]">
          {/* First set */}
          {ipos.map((ipo, idx) => {
            const btn = actionBtn[ipo.status] || actionBtn.Upcoming;
            const hi = parseInt(ipo.priceRange.split("-").pop()?.replace("₹", "").trim() || "100");
            const gmpN = parseInt(ipo.gmp.replace("+", "").replace("-", ""));
            const pct = Math.round(gmpN / hi * 100);
            return (
              <motion.div
                key={ipo.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
                }}
                className="flex-shrink-0 w-[85vw] md:w-auto snap-center bg-white p-6 rounded-2xl shadow-[0_12px_40px_rgba(25,28,30,0.06)] transition-all group border border-slate-100 flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-blue-900 text-lg group-hover:bg-blue-900 group-hover:text-white transition-colors duration-500">
                    {ipo.companyName.slice(0, 2).toUpperCase()}
                  </div>
                  <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-tighter rounded-full ${statusStyle[ipo.status] || statusStyle.Upcoming}`}>{ipo.status}</span>
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-blue-900 transition-colors text-slate-900 line-clamp-1">{ipo.companyName}</h3>
                <div className="grid grid-cols-2 gap-y-4 mb-6 flex-1">
                  <div><p className="text-xs text-slate-500">Price Band</p><p className="text-sm font-bold text-slate-900">{ipo.priceRange}</p></div>
                  <div><p className="text-xs text-slate-500">Expected GMP</p><p className="text-sm font-bold text-green-700">+{pct}%</p></div>
                  <div><p className="text-xs text-slate-500">Subscription</p><p className="text-sm font-bold text-slate-900">{ipo.subscription}</p></div>
                  <div><p className="text-xs text-slate-500">Lot Size</p><p className="text-sm font-bold text-slate-900">{ipo.lotSize} shares</p></div>
                </div>
                <button className={`w-full py-3 rounded-xl font-bold transition-all active:scale-95 mt-auto ${btn.cls}`}>{btn.label}</button>
              </motion.div>
            );
          })}
          {/* Duplicate set for marquee on mobile */}
          {ipos.map((ipo, idx) => {
            const btn = actionBtn[ipo.status] || actionBtn.Upcoming;
            const hi = parseInt(ipo.priceRange.split("-").pop()?.replace("₹", "").trim() || "100");
            const gmpN = parseInt(ipo.gmp.replace("+", "").replace("-", ""));
            const pct = Math.round(gmpN / hi * 100);
            return (
              <div
                key={`dup-${ipo.id}-${idx}`}
                className="flex-shrink-0 w-[85vw] md:hidden bg-white p-6 rounded-2xl shadow-[0_12px_40px_rgba(25,28,30,0.06)] border border-slate-100 flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-blue-900 text-lg">
                    {ipo.companyName.slice(0, 2).toUpperCase()}
                  </div>
                  <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-tighter rounded-full ${statusStyle[ipo.status] || statusStyle.Upcoming}`}>{ipo.status}</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900 line-clamp-1">{ipo.companyName}</h3>
                <div className="grid grid-cols-2 gap-y-4 mb-6 flex-1">
                  <div><p className="text-xs text-slate-500">Price Band</p><p className="text-sm font-bold text-slate-900">{ipo.priceRange}</p></div>
                  <div><p className="text-xs text-slate-500">Expected GMP</p><p className="text-sm font-bold text-green-700">+{pct}%</p></div>
                  <div><p className="text-xs text-slate-500">Subscription</p><p className="text-sm font-bold text-slate-900">{ipo.subscription}</p></div>
                  <div><p className="text-xs text-slate-500">Lot Size</p><p className="text-sm font-bold text-slate-900">{ipo.lotSize} shares</p></div>
                </div>
                <button className={`w-full py-3 rounded-xl font-bold ${btn.cls}`}>{btn.label}</button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ── 3. GMP SECTION ── */
const gmpItems = [
  { name: "Indegene Limited", date: "12 May", gmp: "+₹125", pct: "28%", icon: <TrendingUp className="h-5 w-5 text-green-700" />, bg: "bg-green-100" },
  { name: "Aadhar Housing", date: "15 May", gmp: "+₹42", pct: "14%", icon: <BarChart2 className="h-5 w-5 text-blue-700" />, bg: "bg-blue-100" },
  { name: "Go Digit Insure", date: "20 May", gmp: "+₹15", pct: "5%", icon: <Activity className="h-5 w-5 text-amber-700" />, bg: "bg-amber-100" },
  { name: "TBO Tek Ltd", date: "19 May", gmp: "+₹540", pct: "60%", icon: <BarChart className="h-5 w-5 text-slate-600" />, bg: "bg-slate-100" },
];
const GMPSection = () => (
  <section className="bg-slate-50 py-24 px-6 overflow-hidden border-y border-slate-200">
    <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-16 items-center">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="lg:w-1/3"
      >
        <span className="text-green-700 font-bold tracking-widest uppercase text-xs mb-2 block">Market Trends</span>
        <h2 className="text-4xl font-extrabold tracking-tight mb-6 text-slate-900">Top Performing <br />GMP Assets</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">Grey Market Premium (GMP) indicators help you gauge potential listing gains before the stock hits the market.</p>
        <Link to="/ipo-calendar" className="flex items-center gap-3 text-slate-900 font-bold group">
          View Real-time GMP Dashboard
          <span className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center group-hover:translate-x-2 transition-transform">
            <TrendingUp className="h-4 w-4" />
          </span>
        </Link>
      </motion.div>
      <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6 w-full">
        {gmpItems.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{
              scale: 1.03,
              y: -4,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
            }}
            className="bg-white p-3 md:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm border border-slate-100 transition-all gap-3"
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${item.bg} flex-shrink-0 flex items-center justify-center`}>{item.icon}</div>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 text-xs md:text-base truncate">{item.name}</h4>
                <p className="text-[9px] md:text-[10px] text-slate-500">Date: {item.date}</p>
              </div>
            </div>
            <div className="text-left sm:text-right w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-50">
              <p className="text-green-700 font-black text-xs md:text-base flex items-center gap-1 sm:justify-end"><TrendingUp className="h-3 md:h-3.5 w-3 md:w-3.5" />{item.gmp}</p>
              <p className="text-[9px] md:text-[10px] font-medium text-slate-500">GMP ({item.pct})</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ── 3.5 IPO TABLE SECTION ── */
const Marquee = "marquee" as any;
const IPOTable = () => {
  return (
    <section className="py-24 px-4 container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full text-blue-700 text-xs font-bold mb-4">
            <Activity className="h-4 w-4" />
            To Be Listed
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Open / Upcoming <span className="text-blue-900">IPOs</span></h2>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-4 justify-between min-w-[200px]">
            <span className="text-slate-500 font-medium">Issue Open</span>
            <span className="w-10 h-3 bg-green-400 rounded-full border border-green-500"></span>
          </div>
          <div className="flex items-center gap-4 justify-between min-w-[200px]">
            <span className="text-slate-500 font-medium">Issue Closed But Unlisted</span>
            <span className="w-10 h-3 bg-amber-400 rounded-full border border-amber-500"></span>
          </div>
          <div className="flex items-center gap-4 justify-between min-w-[200px]">
            <span className="text-slate-500 font-medium">Listing Today</span>
            <span className="w-10 h-3 bg-red-400 rounded-full border border-red-500"></span>
          </div>
        </div>
      </motion.div>

      {/* ── DESKTOP TABLE (hidden on mobile) ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200 shadow-xl custom-scrollbar max-h-[600px] overflow-y-auto bg-white"
      >
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="sticky top-0 z-20">
            <tr className="bg-slate-800 text-white/90">
              <th className="px-6 py-4 font-semibold text-[11px] uppercase tracking-widest text-center border-r border-white/5 w-24">Logo</th>
              <th className="px-6 py-4 font-semibold text-[11px] uppercase tracking-widest border-r border-white/5">UPCOMING IPO LIST</th>
              <th className="px-6 py-4 font-semibold text-[11px] uppercase tracking-widest border-r border-white/5">DATE</th>
              <th className="px-6 py-4 font-semibold text-[11px] uppercase tracking-widest border-r border-white/5 text-center">TYPE</th>
              <th className="px-6 py-4 font-semibold text-[11px] uppercase tracking-widest border-r border-white/5 text-center">SIZE</th>
              <th className="px-6 py-4 font-semibold text-[11px] uppercase tracking-widest border-r border-white/5 text-center whitespace-nowrap">PRICE BAND</th>
              <th className="px-6 py-4 font-semibold text-[11px] uppercase tracking-widest text-center">GMP(₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { name: "Safety Controls & Devices Ltd. IPO", date: "06 Apr - 08 Apr", type: "BSE SME", size: "₹1,920 Cr.", price: "₹75.00 to ₹80.00", gmp: "-", icon: <Globe className="text-slate-300 h-5 w-5" />, highlight: false },
              { name: "Emiac Technologies Ltd. IPO", date: "27 Mar - 08 Apr", type: "NSE SME", size: "₹32 Cr.", price: "₹93.00 to ₹98.00", gmp: "-", icon: <Home className="text-slate-400 h-5 w-5" />, highlight: true },
              { name: "Vivid Electromech Ltd. IPO", date: "25 Mar - 30 Mar", type: "NSE SME", size: "₹131 Cr.", price: "₹528.00 to ₹555.00", gmp: "-", icon: <Building2 className="text-slate-300 h-5 w-5" />, highlight: true },
              { name: "Amir Chand Jagdish Kumar (Exports) Ltd. IPO", date: "24 Mar - 27 Mar", type: "BSE, NSE", size: "₹440 Cr.", price: "₹201.00 to ₹212.00", gmp: "₹2.5 (1.18%)", gmpColor: "text-green-600", icon: <Building2 className="text-slate-300 h-5 w-5" />, highlight: false },
              { name: "Sai Parenteral's Ltd. IPO", date: "24 Mar - 27 Mar", type: "BSE, NSE", size: "₹409 Cr.", price: "₹372.00 to ₹392.00", gmp: "-", icon: <Building2 className="text-slate-400 h-5 w-5" />, highlight: false },
              { name: "Powerica Ltd. IPO", date: "24 Mar - 27 Mar", type: "BSE, NSE", size: "₹1,100 Cr.", price: "₹375.00 to ₹395.00", gmp: "₹3 (0.76%)", gmpColor: "text-green-600", icon: <Building2 className="text-slate-300 h-5 w-5" />, highlight: false },
              { name: "Highness Microelectronics Ltd. IPO", date: "24 Mar - 27 Mar", type: "BSE SME", size: "₹22 Cr.", price: "₹114.00 to ₹120.00", gmp: "₹25 (20.83%)", gmpColor: "text-green-600", icon: <Activity className="text-slate-400 h-5 w-5" />, highlight: false },
              { name: "Tinco Engineering India Ltd. IPO", date: "23 Mar - 25 Mar", type: "BSE SME", size: "₹61 Cr.", price: "₹784.00 to ₹789.00", gmp: "-", icon: <Activity className="text-slate-300 h-5 w-5" />, highlight: false },
            ].map((ipo, idx) => (
              <motion.tr
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ backgroundColor: "rgba(0,0,0,0.02)", scale: 1.005 }}
                className={`${ipo.highlight ? "bg-green-100/40" : "bg-white"} transition-all border-b border-slate-100`}
              >
                <td className="px-6 py-4 text-center border-r border-slate-100">
                  <div className={`w-10 h-10 mx-auto bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center ${ipo.highlight ? "shadow-sm" : ""}`}>
                    {ipo.icon}
                  </div>
                </td>
                <td className={`px-6 py-4 font-semibold text-[13px] text-slate-900 border-r border-slate-100 ${ipo.highlight ? "font-bold" : ""}`}>{ipo.name}</td>
                <td className="px-6 py-4 border-r border-slate-100">
                  <div className="flex items-center gap-2 text-[12px] text-slate-500">
                    <Newspaper className="h-4 w-4" /> {ipo.date}
                  </div>
                </td>
                <td className="px-6 py-4 text-center text-[12px] border-r border-slate-100 text-slate-500 font-medium whitespace-nowrap">{ipo.type}</td>
                <td className="px-6 py-4 text-center font-bold text-[13px] text-blue-700 border-r border-slate-100">{ipo.size}</td>
                <td className="px-6 py-4 text-center text-[12px] border-r border-slate-100 text-slate-500 font-medium whitespace-nowrap">{ipo.price}</td>
                <td className={`px-6 py-4 text-center text-[12px] font-medium ${ipo.gmpColor || "text-slate-300"}`}>{ipo.gmp}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* ── MOBILE CARDS (hidden on desktop) ── */}
      <div className="md:hidden space-y-3">
        {[
          { name: "Safety Controls & Devices Ltd. IPO", date: "06 Apr - 08 Apr", type: "BSE SME", size: "₹1,920 Cr.", price: "₹75 - ₹80", gmp: "-", gmpColor: "", highlight: false, status: "Open" },
          { name: "Emiac Technologies Ltd. IPO", date: "27 Mar - 08 Apr", type: "NSE SME", size: "₹32 Cr.", price: "₹93 - ₹98", gmp: "-", gmpColor: "", highlight: true, status: "Open" },
          { name: "Vivid Electromech Ltd. IPO", date: "25 Mar - 30 Mar", type: "NSE SME", size: "₹131 Cr.", price: "₹528 - ₹555", gmp: "-", gmpColor: "", highlight: true, status: "Closed" },
          { name: "Amir Chand Jagdish Kumar (Exports) Ltd. IPO", date: "24 Mar - 27 Mar", type: "BSE, NSE", size: "₹440 Cr.", price: "₹201 - ₹212", gmp: "₹2.5 (1.18%)", gmpColor: "text-green-600", highlight: false, status: "Closed" },
          { name: "Sai Parenteral's Ltd. IPO", date: "24 Mar - 27 Mar", type: "BSE, NSE", size: "₹409 Cr.", price: "₹372 - ₹392", gmp: "-", gmpColor: "", highlight: false, status: "Closed" },
          { name: "Powerica Ltd. IPO", date: "24 Mar - 27 Mar", type: "BSE, NSE", size: "₹1,100 Cr.", price: "₹375 - ₹395", gmp: "₹3 (0.76%)", gmpColor: "text-green-600", highlight: false, status: "Closed" },
          { name: "Highness Microelectronics Ltd. IPO", date: "24 Mar - 27 Mar", type: "BSE SME", size: "₹22 Cr.", price: "₹114 - ₹120", gmp: "₹25 (20.83%)", gmpColor: "text-green-600", highlight: false, status: "Upcoming" },
          { name: "Tinco Engineering India Ltd. IPO", date: "23 Mar - 25 Mar", type: "BSE SME", size: "₹61 Cr.", price: "₹784 - ₹789", gmp: "-", gmpColor: "", highlight: false, status: "Closed" },
        ].map((ipo, idx) => {
          const statusConfig: Record<string, { border: string; badge: string; dot: string }> = {
            Open: { border: "border-l-4 border-l-green-500", badge: "bg-green-100 text-green-700", dot: "bg-green-500" },
            Upcoming: { border: "border-l-4 border-l-blue-500", badge: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
            Closed: { border: "border-l-4 border-l-slate-300", badge: "bg-slate-100 text-slate-600", dot: "bg-slate-400" },
          };
          const sc = statusConfig[ipo.status] || statusConfig.Closed;
          const initials = ipo.name.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.04 }}
              className={`bg-white rounded-2xl shadow-sm border border-slate-100 ${sc.border} overflow-hidden`}
            >
              {/* Card Header */}
              <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center font-extrabold text-white text-xs flex-shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-[13px] leading-snug line-clamp-2">{ipo.name}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${sc.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                    {ipo.status}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-800 text-white rounded-md">{ipo.type}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="mx-4 h-px bg-slate-100" />

              {/* Data Pills Row */}
              <div className="grid grid-cols-2 gap-2 p-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Date</span>
                  <span className="text-[11px] font-semibold text-slate-700">{ipo.date}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Issue Size</span>
                  <span className="text-[11px] font-bold text-blue-700">{ipo.size}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Price Band</span>
                  <span className="text-[11px] font-semibold text-slate-700">{ipo.price}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">GMP</span>
                  <span className={`text-[11px] font-bold ${ipo.gmpColor || "text-slate-400"}`}>
                    {ipo.gmp === "-" ? "—" : ipo.gmp}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 text-[11px] font-bold text-red-600 italic leading-relaxed">
        <Marquee scrollamount="5">
          Note: The data provided on Grey Market Premium (GMP) is solely for informational purposes related to the grey market news. IndiaIPO does not engage in or facilitate grey market trading.
        </Marquee>
      </div>
    </section>
  );
};











/* ── 4. BENTO GRID ── */
const BentoGrid = () => (
  <section className="py-24 px-4 container mx-auto">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl font-extrabold tracking-tight mb-16 text-center text-slate-900"
    >
      Built for Modern Investors
    </motion.h2>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="md:col-span-2 relative overflow-hidden group bg-blue-900 text-white p-10 rounded-3xl flex flex-col justify-between h-80 transition-all duration-500 hover:shadow-2xl"
      >
        <img src={gmpAlertsBg} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700" alt="" />
        <div className="absolute inset-0 bg-blue-900/60 group-hover:bg-blue-900/40 transition-colors" />
        <div className="relative z-10"><Zap className="h-10 w-10 fill-white" /></div>
        <div className="relative z-10"><h3 className="text-2xl font-bold mb-3">Real-time GMP Alerts</h3><p className="opacity-90 text-sm leading-relaxed">Never miss a movement. Get instant push notifications on GMP shifts for all active IPOs in the market.</p></div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white relative overflow-hidden group p-8 rounded-3xl flex flex-col justify-between h-80 shadow-sm border border-slate-100 transition-all duration-500 hover:shadow-xl"
      >
        <img src={verifiedDataBg} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-700" alt="" />
        <div className="absolute inset-0 bg-white/40" />
        <div className="relative z-10"><ShieldCheck className="h-10 w-10 text-green-700" /></div>
        <div className="relative z-10"><h3 className="text-xl font-bold mb-2 text-slate-900">Verified Data</h3><p className="text-slate-600 text-sm font-medium">Source direct from SEBI filings and trusted exchange feeds.</p></div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-amber-100 relative overflow-hidden group text-amber-950 p-8 rounded-3xl flex flex-col justify-between h-80 transition-all duration-500 hover:shadow-xl"
      >
        <img src={expertAnalysisBg} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" alt="" />
        <div className="absolute inset-0 bg-amber-100/60" />
        <div className="relative z-10"><Lightbulb className="h-10 w-10" /></div>
        <div className="relative z-10"><h3 className="text-xl font-bold mb-2">Expert Analysis</h3><p className="text-amber-900/80 text-sm font-medium">Simplified reports and 'Subscribe or Avoid' calls from top analysts.</p></div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="md:col-span-2 bg-slate-200 relative overflow-hidden group p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 h-80 transition-all duration-500 hover:shadow-xl"
      >
        <img src={seamlessInterfaceBg} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-700" alt="" />
        <div className="absolute inset-0 bg-slate-200/50" />
        <div className="flex-1 relative z-10">
          <Monitor className="h-10 w-10 text-blue-900 mb-6" />
          <h3 className="text-2xl font-bold mb-3 text-slate-900">Seamless Interface</h3>
          <p className="text-slate-600 text-sm leading-relaxed font-medium">Clean, clutter-free investment experience designed for the next generation of Indian wealth creators.</p>
        </div>
        <div className="hidden md:flex relative z-10 w-36 h-48 bg-white/40 backdrop-blur-md rounded-2xl items-center justify-center text-slate-600 text-xs font-black border border-white/40 shadow-lg">App Preview</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="md:col-span-2 relative overflow-hidden group bg-green-800 text-white p-10 rounded-3xl flex flex-col justify-between h-80 transition-all duration-500 hover:shadow-2xl"
      >
        <img src={sebiAnalystBg} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" alt="" />
        <div className="absolute inset-0 bg-green-800/70 group-hover:bg-green-800/50 transition-colors" />
        <div className="flex justify-between items-start relative z-10">
          <Shield className="h-10 w-10 text-green-300" />
          <span className="text-[10px] font-black tracking-[0.2em] px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full uppercase">Trust Factor</span>
        </div>
        <div className="relative z-10"><h3 className="text-2xl font-bold mb-3">Expert Market Insights</h3><p className="opacity-90 text-sm leading-relaxed">Empower your investment journey with deep-dive research and data-driven analysis from our team of experienced market specialists.</p></div>
      </motion.div>
    </div>
  </section>
);

/* ── 5. VIDEO SECTION ── */
const VideoCard = ({ v }: { v: { id: string; title: string; youtube_id: string } }) => {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="w-[300px] md:w-[380px] group cursor-pointer flex-shrink-0">
      <div className="relative rounded-2xl overflow-hidden mb-4 h-52 md:h-60 shadow-xl border border-white/5">
        {playing ? (
          <iframe src={`https://www.youtube.com/embed/${v.youtube_id}?autoplay=1&rel=0`} title={v.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute inset-0 w-full h-full" />
        ) : (
          <button onClick={() => setPlaying(true)} className="absolute inset-0 w-full h-full">
            <img src={`https://img.youtube.com/vi/${v.youtube_id}/hqdefault.jpg`} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <Play className="h-6 w-6 text-white fill-white ml-0.5" />
              </div>
            </div>
            <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-white">12:45</div>
          </button>
        )}
      </div>
      <h3 className="font-bold text-base md:text-lg mb-2 text-white line-clamp-2 leading-tight group-hover:text-blue-300 transition-colors uppercase tracking-tight">{v.title}</h3>
      <div className="flex items-center gap-2 text-[10px] md:text-xs text-slate-400 font-medium">
        <span>24K views</span>
        <span className="w-1 h-1 bg-slate-600 rounded-full" />
        <span>2 hours ago</span>
      </div>
    </div>
  );
};

const VideoSection = () => {
  const [videos, setVideos] = useState<{ id: string; title: string; youtube_id: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
        const plId = import.meta.env.VITE_YOUTUBE_PLAYLIST_ID;
        if (apiKey && plId) {
          const r = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=6&playlistId=${plId}&key=${apiKey}`);
          if (r.ok) { const d = await r.json(); setVideos(d.items.map((i: any) => ({ id: i.snippet.resourceId.videoId, title: i.snippet.title, youtube_id: i.snippet.resourceId.videoId }))); return; }
        }
        const r = await fetch("/api/videos");
        const d = await r.json();
        if (Array.isArray(d) && d.length) setVideos(d.map((v: any) => ({ id: String(v.id), title: v.title, youtube_id: v.youtube_id || "" })));
      } catch (_) { }
    };
    load();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const move = clientWidth * 0.8;
      const scrollTo = direction === 'left' ? scrollLeft - move : scrollLeft + move;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!videos.length) return null;
  return (
    <section className="py-24 px-4 bg-[#0f172a] text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex justify-between items-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">IPO Analysis Videos</h2>
          <div className="flex gap-4">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all active:scale-95"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all active:scale-95"
              aria-label="Scroll Right"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          ref={scrollRef}
          className="overflow-hidden pb-8 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          <div className="flex gap-6 md:gap-8 animate-marquee-mobile hover:[animation-play-state:paused] md:flex-row md:overflow-x-auto md:snap-x md:snap-mandatory">
            {/* First set of videos */}
            {videos.map((v, i) => (
              <div key={`${v.id}-${i}`} className="snap-start">
                <VideoCard v={v} />
              </div>
            ))}
            {/* Duplicate set for continuous marquee - visible only during marquee animation */}
            {videos.map((v, i) => (
              <div key={`dup-${v.id}-${i}`} className="md:hidden">
                <VideoCard v={v} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ── 6. MARKET INSIGHTS (IPO Blogs Carousel) ── */
const catColors: Record<string, string> = {
  Strategy: "bg-amber-100 text-amber-800",
  Taxation: "bg-green-100 text-green-800",
  Analysis: "bg-blue-100 text-blue-800",
  Education: "bg-indigo-100 text-indigo-800",
  Reports: "bg-orange-100 text-orange-800",
  General: "bg-slate-100 text-slate-700",
};

const fallbackBlogs = [
  { img: blog1, category: "Strategy", title: "5 Metrics to check before applying for a Fintech IPO", excerpt: "Understanding the burn rate and customer acquisition cost is vital when evaluating high-growth fintech companies.", slug: "" },
  { img: blog2, category: "Taxation", title: "Capital Gains Tax: What IPO investors need to know", excerpt: "LTCG vs STCG—navigating the tax implications of your IPO listing gains to maximize your net profit returns.", slug: "" },
  { img: blog3, category: "Analysis", title: "Why HNI subscription matters more than Retail", excerpt: "High Net-worth Individual interest often signals institutional confidence which can drive secondary market demand.", slug: "" },
  { img: blog1, category: "Education", title: "SME IPO vs Mainline IPO: Key Differences", excerpt: "Understanding the fundamental differences between SME and Mainline IPOs to make informed investment decisions.", slug: "" },
  { img: blog2, category: "Reports", title: "IPO Market Outlook 2025: What to Expect", excerpt: "A comprehensive analysis of India's IPO pipeline and market conditions for the coming year.", slug: "" },
];

const MarketInsights = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ipo-blogs?status=published&limit=10")
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (Array.isArray(d) && d.length > 0) setBlogs(d);
        else {
          // try alternate endpoint
          return fetch("/api/blogs?status=published&limit=10")
            .then(r => r.ok ? r.json() : [])
            .then(d2 => { if (Array.isArray(d2) && d2.length > 0) setBlogs(d2); });
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const displayBlogs = blogs.length > 0 ? blogs : fallbackBlogs;

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const move = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({ left: dir === "left" ? -move : move, behavior: "smooth" });
  };

  return (
    <section className="py-24 bg-slate-50 border-y border-slate-200 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <span className="text-blue-700 font-bold tracking-widest uppercase text-xs mb-2 block">IPO Blogs</span>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Market <span className="text-blue-900">Insights</span></h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-slate-300 bg-white flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-95 shadow-sm"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-slate-300 bg-white flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-95 shadow-sm"
              aria-label="Scroll Right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <Link
              to="/ipo-blogs"
              className="hidden md:inline-flex items-center gap-1.5 px-5 py-2 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-700 transition-colors ml-2"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        {/* Scrollable Cards */}
        <div className="overflow-hidden md:overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-6 animate-marquee-mobile hover:[animation-play-state:paused]">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[300px] md:w-[340px] snap-start bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
                  <div className="h-48 bg-slate-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-slate-200 rounded w-1/3" />
                    <div className="h-4 bg-slate-200 rounded w-full" />
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                  </div>
                </div>
              ))
              : displayBlogs.map((item: any, i: number) => {
                const category = item.category || "General";
                const catCls = catColors[category] || catColors.General;
                const image = item.image_url || item.img || blog1;
                const slug = item.slug || item.new_slug || "";
                const blogUrl = slug ? `/ipo-blogs/${slug}` : "/ipo-blogs";

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="flex-shrink-0 w-[300px] md:w-[340px] snap-start"
                  >
                    <Link
                      to={blogUrl}
                      className="group block bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full"
                    >
                      {/* Image */}
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => { (e.target as HTMLImageElement).src = blog1; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        {/* Category badge on image */}
                        <span className={`absolute top-3 left-3 text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full ${catCls}`}>
                          {category}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 line-clamp-2 group-hover:text-blue-900 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">
                          {item.excerpt || item.meta_description || item.title}
                        </p>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <span className="text-[11px] text-slate-400 font-medium">
                            {item.created_at ? new Date(item.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "IndiaIPO"}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 group-hover:gap-2 transition-all">
                            Read More <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            {/* Duplicate for marquee */}
            {!loading && displayBlogs.map((item: any, i: number) => {
              const category = item.category || "General";
              const catCls = catColors[category] || catColors.General;
              const image = item.image_url || item.img || blog1;
              const slug = item.slug || item.new_slug || "";
              const blogUrl = slug ? `/ipo-blogs/${slug}` : "/ipo-blogs";

              return (
                <div
                  key={`dup-${i}`}
                  className="flex-shrink-0 w-[300px] md:hidden"
                >
                  <Link
                    to={blogUrl}
                    className="group block bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm h-full"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = blog1; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <span className={`absolute top-3 left-3 text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full ${catCls}`}>
                        {category}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">
                        {item.excerpt || item.meta_description || item.title}
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile View All button */}
        <div className="mt-8 text-center md:hidden">
          <Link to="/ipo-blogs" className="inline-flex items-center gap-1.5 px-6 py-3 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-700 transition-colors">
            View All Blogs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};



const SuccessStories = () => (
  <section className="py-24 px-4 container mx-auto border-y border-slate-200">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      <h2 className="text-4xl font-extrabold tracking-tight mb-4 text-slate-900">Our Success Stories</h2>
      <p className="text-slate-500 max-w-2xl mx-auto">Hear from the founders and executives who have successfully navigated their IPO journey with our expert advisory services.</p>
    </motion.div>
    <div className="overflow-hidden md:overflow-visible pb-8 scrollbar-hide">
      <div className="flex gap-6 md:grid md:grid-cols-3 md:gap-8 animate-marquee-mobile hover:[animation-play-state:paused]">
        {[
          { name: "Rajesh Singhania", role: "CEO, TechFlow Solutions", text: "The advisory team at IndiaIPO was instrumental in our transition to a public company. Their strategic guidance helped us raise the essential capital needed for our nationwide expansion." },
          { name: "Meera Iyer", role: "CFO, GreenEarth Ventures", text: "Launching an IPO is complex, but IndiaIPO's expert advice made it seamless. They helped us tap into the nation's potential by structuring our offering for long-term growth." },
          { name: "Vikram Malhotra", role: "MD, Skyline Infrastructure", text: "Their deep market insights were crucial for our capital raising journey. IndiaIPO fuels future opportunities by positioning companies perfectly for the public market." }
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex-shrink-0 w-[300px] md:w-full p-8 bg-white rounded-3xl relative border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 md:hover:-translate-y-2 group h-full flex flex-col"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 font-bold group-hover:bg-blue-900 group-hover:text-white transition-colors duration-500">
                {s.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{s.name}</h4>
                <p className="text-xs text-slate-500">{s.role}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 italic leading-relaxed flex-1">"{s.text}"</p>
          </motion.div>
        ))}
        {/* Duplicate set for mobile marquee */}
        {[
          { name: "Rajesh Singhania", role: "CEO, TechFlow Solutions", text: "The advisory team at IndiaIPO was instrumental in our transition to a public company. Their strategic guidance helped us raise the essential capital needed for our nationwide expansion." },
          { name: "Meera Iyer", role: "CFO, GreenEarth Ventures", text: "Launching an IPO is complex, but IndiaIPO's expert advice made it seamless. They helped us tap into the nation's potential by structuring our offering for long-term growth." },
          { name: "Vikram Malhotra", role: "MD, Skyline Infrastructure", text: "Their deep market insights were crucial for our capital raising journey. IndiaIPO fuels future opportunities by positioning companies perfectly for the public market." }
        ].map((s, i) => (
          <div
            key={`dup-${i}`}
            className="flex-shrink-0 w-[300px] md:hidden p-8 bg-white rounded-3xl relative border border-slate-100 shadow-sm flex flex-col"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 font-bold">
                {s.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{s.name}</h4>
                <p className="text-xs text-slate-500">{s.role}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 italic leading-relaxed flex-1">"{s.text}"</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);





/* ── 7. ACADEMY + FAQ ── */
const academyItems = [
  { n: "01", color: "bg-blue-100 text-blue-900", title: "What is an IPO?", desc: "Initial Public Offering is when a private company offers shares to the public for the first time to raise capital for growth." },
  { n: "02", color: "bg-green-100 text-green-800", title: "Understanding GMP", desc: "Grey Market Premium is the price at which IPO shares are traded unofficially before they are listed on the stock exchange." },
  { n: "03", color: "bg-amber-100 text-amber-800", title: "How to Apply?", desc: "Most investors apply via ASBA (Application Supported by Blocked Amount) through their bank accounts or UPI apps." },
];
const faqItems = [
  { q: "Is GMP a guaranteed listing price?", a: "No, GMP is purely based on market sentiment and demand-supply in the unofficial grey market. It can change rapidly before the listing day." },
  { q: "How long does it take for allotment?", a: "Typically, allotment is finalized within 3-4 working days after the issue closes for subscription." },
  { q: "Can I apply with multiple PAN cards?", a: "No, each investor can only apply once under a single PAN card for a particular IPO." },
];
const AcademyFAQ = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-24 px-6 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-extrabold tracking-tight mb-12 text-slate-900">IPO Academy</h2>
          <div className="space-y-6">
            {academyItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-white rounded-2xl flex items-start gap-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className={`w-14 h-14 rounded-full ${item.color} flex-shrink-0 flex items-center justify-center font-bold text-xl`}>{item.n}</div>
                <div><h4 className="font-bold text-lg mb-2 text-slate-900">{item.title}</h4><p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-extrabold tracking-tight mb-12 text-slate-900">Frequently Asked</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
                <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex justify-between items-center font-bold p-4 cursor-pointer text-left text-slate-900 hover:bg-slate-50 transition-colors">
                  {item.q}
                  <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform flex-shrink-0 ${open === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-slate-500 text-sm border-t border-slate-100 pt-4 leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ── 8. ANNUAL REPORT ── */
const AnnualReport = () => (
  <section className="py-24 px-4 container mx-auto">
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="bg-[#0f172a] rounded-[3rem] p-12 md:p-20 text-white flex flex-col md:flex-row items-center gap-12 overflow-hidden relative shadow-2xl"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="md:w-3/5 relative z-10">
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-green-300 font-black tracking-[0.3em] uppercase text-xs mb-4 block"
        >
          Premium Access
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight"
        >
          The 2025 IPO <br />Annual Report
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-blue-100 text-lg mb-8 max-w-md"
        >
          Get deep-dive analysis on the upcoming bull run, sector-wise growth projections, and curated high-conviction picks for the year.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <Link to="/reports" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-900 rounded-xl font-bold shadow-xl hover:bg-blue-50 transition-all active:scale-95">
            Download Full PDF <Download className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, rotate: 10, x: 20 }}
        whileInView={{ opacity: 1, rotate: 3, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="md:w-2/5 flex justify-center relative z-10"
      >
        <div className="w-64 h-80 bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden border-4 border-white transform hover:scale-105 transition-transform duration-500 cursor-pointer">
          <div className="h-40 bg-gradient-to-br from-blue-800 to-blue-600 flex items-center justify-center p-4">
            <img
              src={report}
              alt="Report"
              className="h-full w-full object-cover drop-shadow-lg"
            />
          </div>
          <div className="p-4 text-slate-900 flex-1">
            <p className="text-[10px] font-black uppercase text-blue-600 mb-1">Q4 Edition</p>
            <h4 className="font-bold text-sm mb-4 leading-tight">State of the Market: IPO Sector Report</h4>
            <div className="space-y-2">
              <div className="w-full h-1 bg-slate-100 rounded-full" />
              <div className="w-3/4 h-1 bg-slate-100 rounded-full" />
              <div className="w-1/2 h-1 bg-slate-100 rounded-full" />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  </section>
);

/* ── 9. NEWSLETTER ── */
const Newsletter = () => {
  const [email, setEmail] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const r = await fetch("/api/subscriptions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (r.ok) { toast.success("Thank you for subscribing!"); setEmail(""); }
      else { const err = await r.json(); toast.error(err.error || "Failed"); }
    } catch (_) { toast.error("An error occurred."); }
  };
  return (
    <section className="bg-slate-100 py-24 px-6 border-t border-slate-200">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center"
      >
        <h2 className="text-4xl font-extrabold tracking-tight mb-4 text-slate-900">Stay ahead of the curve</h2>
        <p className="text-slate-500 mb-10">Get real-time GMP updates and listing alerts delivered straight to your inbox every morning.</p>
        <form onSubmit={submit} className="flex flex-col md:flex-row gap-4">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email address" className="flex-grow bg-white border border-slate-200 focus:ring-2 focus:ring-blue-900 rounded-2xl px-6 py-4 text-slate-900 outline-none transition-all shadow-sm" />
          <button type="submit" className="bg-blue-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-800 shadow-lg transition-all active:scale-95 whitespace-nowrap">Subscribe Now</button>
        </form>
        <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-bold">We respect your privacy. Unsubscribe at any time.</p>
      </motion.div>
    </section>
  );
};

/* ── 10. FOOTER ── */
const Footer2 = () => (
  <footer className="bg-slate-50 border-t border-slate-200 w-full pt-16 pb-32 md:pb-16">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="md:col-span-1">
        <span className="text-xl font-bold text-blue-900 mb-4 block">IndiaIPO</span>
        <p className="text-sm leading-relaxed text-slate-600 mb-6">India's premier IPO tracking and analysis platform. We empower investors with data-driven insights and real-time market sentiment.</p>
        <div className="flex gap-4">
          {[Globe, Users, Mail].map((Icon, i) => (
            <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center hover:bg-blue-900 hover:text-white transition-all text-slate-600">
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
      {[
        { title: "Resources", links: [{ label: "Explore IPOs", to: "/ipo-calendar" }, { label: "GMP Tracker", to: "/ipo-calendar" }, { label: "IPO Allotment", to: "/ipo-calendar" }, { label: "Buyback Tracker", to: "/" }] },
        { title: "Company", links: [{ label: "About Us", to: "/about" }, { label: "Contact", to: "/contact" }, { label: "Privacy Policy", to: "/" }, { label: "Terms of Service", to: "/" }] },
        { title: "Legal", links: [{ label: "SEBI Disclaimer", to: "/" }, { label: "Sitemap", to: "/" }, { label: "Risk Disclosures", to: "/" }] },
      ].map(col => (
        <div key={col.title}>
          <h4 className="font-bold text-blue-900 mb-6 uppercase text-xs tracking-widest">{col.title}</h4>
          <ul className="space-y-4 text-sm">
            {col.links.map((l, i) => (
              <li key={i}><Link to={l.to} className="text-slate-500 hover:text-blue-700 transition-colors hover:underline decoration-orange-500 decoration-2 underline-offset-4">{l.label}</Link></li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-200">
      <p className="text-xs text-slate-500 text-center leading-relaxed">© 2024 IndiaIPO. SEBI Registered Research Analyst. All data provided is for educational purposes only. Please consult a certified financial advisor before making any investment decisions.</p>
    </div>
  </footer>
);


/* ── PAGE ROOT ── */
const Index2 = () => (
  <div className="min-h-screen bg-[#f8f9fb] text-slate-900 font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
    <SEOHead
      title="Invest in IPOs Smarter | IndiaIPO"
      description="Track real-time GMP, analyze deep market insights, and participate in India's growth story with confidence."
      keywords="IPO, SME IPO, GMP tracker, IPO India, SEBI"
      jsonLd={{ "@context": "https://schema.org", "@type": "Organization", "name": "IndiaIPO", "url": "https://indiaipo.in" }}
    />
    {/* NO HEADER */}
    <main>
      <MarqueeStyles />
      <Header />
      <Hero />
      <AboutPreview />
      <ServicesSection />
      <LiveIPOs />
      <GMPSection />
      <IPOTable />
      <BentoGrid />
      <VideoSection />
      <MarketInsights />
      <AcademyFAQ />
      <SuccessStories />
      <AnnualReport />
      <Newsletter />
      <Footer3 />
    </main>
    {/* <Footer2 /> */}

    <SitePopup />
  </div>
);

export default Index2;