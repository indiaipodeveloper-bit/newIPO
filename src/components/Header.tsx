import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu, X, ChevronDown, LogOut, LayoutDashboard, Zap, ExternalLink,
  ArrowUpRight, TrendingUp, BookOpen, Bell, BarChart2, FileText,
  Globe, Users, Briefcase, Activity, Star, ArrowRight,
  Mail, Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";

// ── Top Info Bar ────────────────────────────────────────────────
const TopBar = () => (
  <div
    className="w-full hidden sm:block"
    style={{ background: "#1a4d2e", color: "rgba(255,255,255,0.90)" }}
  >
    <div
      className="container mx-auto px-4 flex items-center justify-between text-[11.5px] font-medium py-1.5"
      style={{ letterSpacing: "0.02em" }}
    >
      {/* Left — contact info */}
      <div className="flex items-center gap-5">
        <a
          href="mailto:info@indiaipo.in"
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <Mail className="h-3 w-3 opacity-75" />
          INFO@INDIAIPO.IN
        </a>
        <span style={{ color: "rgba(255,255,255,0.25)" }}>|</span>
        <a
          href="tel:+917428337280"
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <Phone className="h-3 w-3 opacity-75" />
          +91-74283-37280
        </a>
      </div>

      {/* Right — tagline + socials */}
      <div className="flex items-center gap-4">
        <span
          className="uppercase tracking-widest text-[10.5px] font-bold"
          style={{ color: "rgba(255,255,255,0.65)" }}
        >
          Expert IPO Consultant
        </span>
        <span style={{ color: "rgba(255,255,255,0.20)" }}>|</span>

        {/* Facebook */}
        <a
          href="https://www.facebook.com/01indiapo"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-6 h-6 rounded-full transition-all hover:scale-110"
          style={{ background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.80)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#1877F2"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.10)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.80)"; }}
          aria-label="Facebook"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
          </svg>
        </a>

        {/* X / Twitter */}
        <a
          href="https://x.com/india_ipo1"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-6 h-6 rounded-full transition-all hover:scale-110"
          style={{ background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.80)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#000"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.10)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.80)"; }}
          aria-label="X / Twitter"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>

        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/company/india-ipo/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-6 h-6 rounded-full transition-all hover:scale-110"
          style={{ background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.80)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#0077B5"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.10)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.80)"; }}
          aria-label="LinkedIn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
      </div>
    </div>
  </div>
);
// ────────────────────────────────────────────────────────────────

interface SubItem {
  label: string;
  href: string;
  external?: boolean;
  badge?: string;
  badgeColor?: string;
  icon?: React.ReactNode;
  description?: string;
}

interface MegaColumn {
  title: string;
  icon?: React.ReactNode;
  items: SubItem[];
}

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  megaMenu?: MegaColumn[];
  dropdown?: SubItem[];
}

const STATIC_NAV_PREFIX: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    dropdown: [
      { label: "About IndiaIPO", href: "/about", icon: <Globe className="h-4 w-4" />, description: "Learn about our mission & vision" },
      { label: "Our CSR", href: "/csr", icon: <Users className="h-4 w-4" />, description: "Corporate social responsibility" },
    ],
  },
  {
    label: "IPO",
    href: "/ipo-services",
    megaMenu: [
      {
        title: "IPO Services",
        icon: <TrendingUp className="h-4 w-4" />,
        items: [
          {
            label: "All IPO Services",
            href: "/ipo-services",
            badge: "View All →",
            badgeColor: "bg-gradient-to-r from-[#001529] to-[#003366] text-white",
            icon: <Star className="h-4 w-4" />,
            description: "Complete IPO consulting",
          },
          { label: "Initial Public Offering (IPO)", href: "/services/initial-public-offering", icon: <TrendingUp className="h-4 w-4" />, description: "End-to-end IPO guidance" },
          { label: "SME IPO Consultation", href: "/services/sme-ipo", icon: <Briefcase className="h-4 w-4" />, description: "Tailored for SMEs" },
          { label: "Mainline IPO Consultation", href: "/services/mainline-ipo", icon: <BarChart2 className="h-4 w-4" />, description: "Large-cap market listing" },
          { label: "Follow-On Public Offer (FPO)", href: "/services/fpo", icon: <Activity className="h-4 w-4" />, description: "Secondary offering support" },
          { label: "Pre-IPO Funding Consultants", href: "/services/pre-ipo", icon: <FileText className="h-4 w-4" />, description: "Pre-listing funding strategy" },
        ],
      },
    ],
  },
  {
    label: "Services",
    href: "/services",
    megaMenu: [
      {
        title: "Capital Raising",
        icon: <TrendingUp className="h-4 w-4" />,
        items: [
          { label: "Social Stock Exchange", href: "/services/social-stock-exchange" },
          { label: "Private Placement", href: "/services/private-placement" },
          { label: "Project Funding", href: "/services/project-funding" },
          { label: "REIT", href: "/services/reit" },
          { label: "SM REIT", href: "/services/sm-reit" },
          { label: "Rights Issue Advisory", href: "/services/rights-issue" },
          { label: "InvIT Rights Issue", href: "/services/invit-rights" },
          { label: "InvIT Public Issue", href: "/services/invit-public" },
          { label: "Debt Syndication", href: "/services/debt-syndication" },
        ],
      },
      {
        title: "Finance Advisory",
        icon: <BarChart2 className="h-4 w-4" />,
        items: [
          { label: "Business Valuation", href: "/services/valuation" },
          { label: "Corporate Finance", href: "/services/corporate-finance" },
          { label: "Financial Modelling", href: "/services/financial-modelling" },
          { label: "Project Finance", href: "/services/project-finance" },
        ],
      },
    ],
  },
  { label: "Investors", href: "/investors" },
  {
    label: "Merchant Bankers",
    href: "/services#merchant-bankers",
    megaMenu: [
      {
        title: "SME",
        icon: <Briefcase className="h-4 w-4" />,
        items: [
          { label: "List of SME Merchant Bankers", href: "/merchant-bankers/sme" },
        ],
      },
      {
        title: "Mainboard",
        icon: <BarChart2 className="h-4 w-4" />,
        items: [
          { label: "List of Mainboard Merchant Bankers", href: "/merchant-bankers/mainboard-list" },
        ],
      },
    ],
  },
];

const STATIC_NAV_SUFFIX: NavItem[] = [
  {
    label: "News/Updates",
    href: "/news-updates",
    icon: <Zap className="h-3.5 w-3.5 text-amber-500" />,
    dropdown: [
      { label: "Markets & Money Update", href: "/news-updates", icon: <TrendingUp className="h-4 w-4" />, description: "Live market insights" },
      { label: "IPO & Market Snaps", href: "/ipo-and-market-snaps", icon: <Activity className="h-4 w-4" />, description: "Quick market snapshots" },
    ],
  },
  { label: "Contact Us", href: "/contact" },
];

const REPORTS_COLUMN: MegaColumn = {
  title: "Reports",
  icon: <FileText className="h-4 w-4" />,
  items: [
    { label: "Daily Reporter", href: "/reports/daily-reporter", badge: "Daily Reporter", badgeColor: "bg-emerald-500 text-white" },
    { label: "IPO Calendar", href: "/ipo-calendar" },
    { label: "Upcoming IPO Calendar", href: "/reports/upcoming-ipo-calendar" },
    { label: "Mainline IPO Report", href: "/reports/mainline-ipo-report" },
    { label: "SME IPO Report", href: "/reports/sme-ipo-report" },
    { label: "SME IPOs by Sector", href: "/reports/sme-ipos-by-sector" },
    { label: "Mainboard IPOs by Sector", href: "/reports/mainboard-ipos-by-sector" },
  ],
};

const FALLBACK_KNOWLEDGE: SubItem[] = [
  { label: "IPO World Magazine", href: "https://ipoworld.org/", external: true, badge: "IPO World Magazine", badgeColor: "bg-blue-600 text-white" },
  { label: "IPO Process", href: "/ipo-knowledge/ipo-process" },
  { label: "Pre-IPO Process Guidance", href: "/ipo-knowledge/pre-ipo-process" },
  { label: "IPO Blogs", href: "/ipo-blogs" },
  { label: "Sector Wise IPO List In India", href: "/sector-wise-ipo" },
  { label: "List of IPO Registrar", href: "/list-of-ipo-registrar" },
];

const FALLBACK_NOTIFICATIONS: SubItem[] = [
  { label: "ICDR", href: "/notifications/icdr" },
  { label: "BSE SME Eligibility Criteria", href: "/notifications/bse-sme-eligibility" },
  { label: "NSE Emerge Eligibility Criteria", href: "/notifications/nse-emerge-eligibility" },
];

interface APINotif { id: string; title: string; slug: string; is_active: boolean | number; link: string | null; }
interface APICategory { id: string; name: string; slug: string; is_active: boolean | number; }

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [notifItems, setNotifItems] = useState<SubItem[]>(FALLBACK_NOTIFICATIONS);
  const [knowledgeItems, setKnowledgeItems] = useState<SubItem[]>(FALLBACK_KNOWLEDGE);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("/api/notifications")
      .then(r => r.ok ? r.json() : null)
      .then((data: APINotif[] | null) => {
        if (data && data.length > 0) {
          const active = data.filter(n => n.is_active == 1 || n.is_active === true);
          if (active.length > 0) {
            const apiItems = active.map(n => ({
              label: n.title,
              href: n.link ? (n.link.startsWith('http') ? n.link : `https://${n.link}`) : `/notifications/${n.slug}`,
              external: !!n.link
            }));
            const mandatory = [
              { label: "BSE SME Eligibility Criteria", href: "/notifications/bse-sme-eligibility" },
              { label: "NSE Emerge Eligibility Criteria", href: "/notifications/nse-emerge-eligibility" },
            ];
            setNotifItems([...apiItems, ...mandatory.filter(m => !apiItems.some(a => a.href === m.href))]);
          }
        }
      })
      .catch(() => { });

    fetch("/api/knowledge/categories")
      .then(r => r.ok ? r.json() : null)
      .then((data: APICategory[] | null) => {
        if (data && data.length > 0) {
          const active = data.filter(c =>
            (c.is_active == 1 || c.is_active === true) &&
            !["SEBI ICDR Amendment Regulations", "SEBI SME IPO ICDR Amendments", "ICDR", "BSE SME Eligibility Criteria", "NSE Emerge Eligibility Criteria"].includes(c.name)
          );
          if (active.length > 0) {
            setKnowledgeItems([
              { label: "IPO Blogs", href: "/ipo-blogs" },
              ...active.map(c => {
                const nameLower = c.name.toLowerCase();
                if (nameLower === "ipo world magazine") {
                  return { label: "IPO World Magazine", href: "https://ipoworld.org/", external: true, badge: "IPO World Magazine", badgeColor: "bg-blue-600 text-white" };
                }
                return {
                  label: c.name,
                  href: (nameLower === "list of ipo registrar" || nameLower === "registrar")
                    ? "/list-of-ipo-registrar"
                    : (nameLower === "sector wise ipo list in india" || c.slug === "sector-wise-ipo-list")
                      ? "/sector-wise-ipo"
                      : `/ipo-knowledge/${c.slug}`
                };
              })
            ]);
          }
        }
      })
      .catch(() => { });
  }, []);

  const resourcesNavItem: NavItem = {
    label: "Resources",
    href: "/reports",
    icon: <Zap className="h-3.5 w-3.5 text-amber-500" />,
    megaMenu: [
      REPORTS_COLUMN,
      { title: "IPO Knowledge", icon: <BookOpen className="h-4 w-4" />, items: knowledgeItems },
      { title: "Notifications / Circulars", icon: <Bell className="h-4 w-4" />, items: notifItems },
    ],
  };

  const navLinks: NavItem[] = [
    ...STATIC_NAV_PREFIX,
    resourcesNavItem,
    ...STATIC_NAV_SUFFIX,
  ];

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 150);
  };

  useEffect(() => {
    setMobileOpen(false);
    setActiveMenu(null);
  }, [location.pathname]);

  return (
    <header
      className="sticky top-0 z-50 w-full transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(255,255,255,0.97)"
          : "rgba(255,255,255,1)",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(0,21,41,0.10)"
          : "1px solid rgba(0,21,41,0.07)",
        boxShadow: scrolled
          ? "0 4px 32px rgba(0,21,41,0.10)"
          : "0 1px 8px rgba(0,21,41,0.05)",
      }}
    >
      <TopBar />
      {/* Gradient top accent line */}
      <div
        style={{
          height: "3px",
          background: "linear-gradient(90deg, #001529 0%, #0052a3 40%, #00aaff 70%, #e6b800 100%)",
        }}
      />

      <div className="container mx-auto flex h-[68px] items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <img
            src={logo}
            alt="India IPO"
            className="h-[52px] w-auto transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-0">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            const isMenuOpen = activeMenu === link.label;

            return (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => (link.megaMenu || link.dropdown) ? handleMouseEnter(link.label) : undefined}
                onMouseLeave={handleMouseLeave}
              >
                {link.megaMenu || link.dropdown ? (
                  <button
                    className="group flex items-center gap-1.5 px-3.5 py-2.5 text-[13.5px] font-semibold transition-all duration-200 rounded-lg relative"
                    style={{
                      color: isActive || isMenuOpen ? "#001529" : "#374151",
                    }}
                  >
                    {/* Active indicator dot */}
                    {isActive && (
                      <span
                        className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                        style={{ background: "#001529" }}
                      />
                    )}
                    {/* Hover bg */}
                    <span
                      className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ background: "rgba(0,21,41,0.06)" }}
                    />
                    <span className="relative flex items-center gap-1.5">
                      {link.icon}
                      {link.label}
                      <ChevronDown
                        className="h-3.5 w-3.5 transition-transform duration-200"
                        style={{
                          transform: isMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                          color: isMenuOpen ? "#001529" : "#6b7280",
                        }}
                      />
                    </span>
                  </button>
                ) : (
                  <Link
                    to={link.href}
                    className="group flex items-center gap-1.5 px-3.5 py-2.5 text-[13.5px] font-semibold transition-all duration-200 rounded-lg relative"
                    style={{ color: isActive ? "#001529" : "#374151" }}
                  >
                    <span
                      className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ background: "rgba(0,21,41,0.06)" }}
                    />
                    {isActive && (
                      <span
                        className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                        style={{ background: "#001529" }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </Link>
                )}

                {/* ── Mega Menu ── */}
                <AnimatePresence>
                  {isMenuOpen && link.megaMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-2.5 z-50"
                      onMouseEnter={() => handleMouseEnter(link.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div
                        className="rounded-2xl overflow-hidden"
                        style={{
                          minWidth: link.megaMenu.length > 2 ? "800px" : link.megaMenu.length > 1 ? "560px" : "340px",
                          maxWidth: link.megaMenu.length > 2 ? "860px" : "600px",
                          background: "rgba(255,255,255,0.98)",
                          border: "1px solid rgba(0,21,41,0.10)",
                          boxShadow: "0 20px 60px rgba(0,21,41,0.15), 0 4px 16px rgba(0,21,41,0.08)",
                        }}
                      >
                        {/* Dropdown header accent */}
                        <div
                          style={{
                            height: "3px",
                            background: "linear-gradient(90deg, #001529 0%, #0052a3 50%, #00aaff 100%)",
                          }}
                        />
                        <div
                          className={`grid gap-0`}
                          style={{
                            gridTemplateColumns: `repeat(${link.megaMenu.length}, 1fr)`,
                          }}
                        >
                          {link.megaMenu.map((col, colIdx) => (
                            <div key={col.title} className="p-5" style={{ borderRight: colIdx < link.megaMenu!.length - 1 ? "1px solid rgba(0,21,41,0.07)" : "none" }}>
                              {/* Column header */}
                              <div className="flex items-center gap-2 mb-3 pb-2.5" style={{ borderBottom: "1px solid rgba(0,21,41,0.08)" }}>
                                {col.icon && (
                                  <span
                                    className="flex items-center justify-center w-7 h-7 rounded-lg"
                                    style={{ background: "rgba(0,21,41,0.08)", color: "#001529" }}
                                  >
                                    {col.icon}
                                  </span>
                                )}
                                <h4
                                  className="text-[11px] font-bold uppercase tracking-widest"
                                  style={{ color: "#001529", letterSpacing: "0.1em" }}
                                >
                                  {col.title}
                                </h4>
                              </div>

                              {/* Items */}
                              <div className="space-y-0.5">
                                {col.items.map((item) => (
                                  <div key={item.label}>
                                    {item.badge ? (
                                      item.external ? (
                                        <a
                                          href={item.href}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold mb-2.5 ${item.badgeColor} transition-transform hover:scale-105`}
                                        >
                                          {item.icon && item.icon}
                                          {item.badge}
                                          <ExternalLink className="h-3 w-3 opacity-70" />
                                        </a>
                                      ) : (
                                        <Link
                                          to={item.href}
                                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold mb-2.5 ${item.badgeColor} transition-transform hover:scale-105`}
                                        >
                                          {item.icon && item.icon}
                                          {item.badge}
                                          <ArrowRight className="h-3 w-3 opacity-70" />
                                        </Link>
                                      )
                                    ) : item.external ? (
                                      <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group/item flex items-center gap-2 px-2.5 py-2 rounded-xl transition-all duration-150"
                                        style={{ color: "#4b5563" }}
                                        onMouseEnter={e => {
                                          (e.currentTarget as HTMLElement).style.background = "rgba(0,21,41,0.05)";
                                          (e.currentTarget as HTMLElement).style.color = "#001529";
                                        }}
                                        onMouseLeave={e => {
                                          (e.currentTarget as HTMLElement).style.background = "transparent";
                                          (e.currentTarget as HTMLElement).style.color = "#4b5563";
                                        }}
                                      >
                                        {item.icon && <span className="shrink-0 opacity-50">{item.icon}</span>}
                                        <div className="flex flex-col min-w-0">
                                          <span className="text-[13px] font-medium truncate">{item.label}</span>
                                          {item.description && <span className="text-[11px] opacity-60 truncate">{item.description}</span>}
                                        </div>
                                        <ExternalLink className="h-3 w-3 ml-auto shrink-0 opacity-40" />
                                      </a>
                                    ) : (
                                      <Link
                                        to={item.href}
                                        className="group/item flex items-center gap-2 px-2.5 py-2 rounded-xl transition-all duration-150"
                                        style={{ color: "#4b5563" }}
                                        onMouseEnter={e => {
                                          (e.currentTarget as HTMLElement).style.background = "rgba(0,21,41,0.05)";
                                          (e.currentTarget as HTMLElement).style.color = "#001529";
                                        }}
                                        onMouseLeave={e => {
                                          (e.currentTarget as HTMLElement).style.background = "transparent";
                                          (e.currentTarget as HTMLElement).style.color = "#4b5563";
                                        }}
                                      >
                                        {item.icon && <span className="shrink-0 opacity-50">{item.icon}</span>}
                                        <div className="flex flex-col min-w-0">
                                          <span className="text-[13px] font-medium truncate">{item.label}</span>
                                          {item.description && <span className="text-[11px] opacity-60 truncate">{item.description}</span>}
                                        </div>
                                        <ArrowRight className="h-3 w-3 ml-auto shrink-0 opacity-0 group-hover/item:opacity-40 transition-opacity" />
                                      </Link>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Simple Dropdown ── */}
                <AnimatePresence>
                  {isMenuOpen && link.dropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute left-0 top-full pt-2.5 z-50"
                      onMouseEnter={() => handleMouseEnter(link.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div
                        className="rounded-2xl overflow-hidden min-w-[240px]"
                        style={{
                          background: "rgba(255,255,255,0.98)",
                          border: "1px solid rgba(0,21,41,0.10)",
                          boxShadow: "0 20px 60px rgba(0,21,41,0.15), 0 4px 16px rgba(0,21,41,0.08)",
                        }}
                      >
                        <div
                          style={{
                            height: "3px",
                            background: "linear-gradient(90deg, #001529 0%, #0052a3 50%, #00aaff 100%)",
                          }}
                        />
                        <div className="py-2 px-2">
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.label}
                              to={item.href}
                              target={item.external ? "_blank" : undefined}
                              rel={item.external ? "noopener noreferrer" : undefined}
                              className="group/item flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150"
                              style={{ color: "#4b5563" }}
                              onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.background = "rgba(0,21,41,0.05)";
                                (e.currentTarget as HTMLElement).style.color = "#001529";
                              }}
                              onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.background = "transparent";
                                (e.currentTarget as HTMLElement).style.color = "#4b5563";
                              }}
                            >
                              {item.icon && (
                                <span
                                  className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                                  style={{ background: "rgba(0,21,41,0.07)", color: "#001529" }}
                                >
                                  {item.icon}
                                </span>
                              )}
                              <div className="flex flex-col min-w-0">
                                <span className="text-[13.5px] font-semibold truncate">{item.label}</span>
                                {item.description && (
                                  <span className="text-[11px] opacity-55 truncate mt-0.5">{item.description}</span>
                                )}
                              </div>
                              {item.external
                                ? <ExternalLink className="h-3.5 w-3.5 ml-auto shrink-0 opacity-40" />
                                : <ArrowRight className="h-3.5 w-3.5 ml-auto shrink-0 opacity-0 group-hover/item:opacity-50 transition-opacity" />
                              }
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="hidden xl:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Button variant="ghost" size="sm" className="text-primary" asChild>
                  <Link to="/admin"><LayoutDashboard className="h-4 w-4 mr-1" />Admin</Link>
                </Button>
              )}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("user-menu")}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium transition-colors rounded-lg hover:bg-black/5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                    style={{ background: "linear-gradient(135deg, #001529, #0052a3)" }}
                  >
                    {user?.name?.[0] || "U"}
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                </button>
                <AnimatePresence>
                  {activeMenu === "user-menu" && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full pt-2.5 z-50"
                    >
                      <div
                        className="rounded-2xl overflow-hidden min-w-[200px]"
                        style={{
                          background: "rgba(255,255,255,0.98)",
                          border: "1px solid rgba(0,21,41,0.10)",
                          boxShadow: "0 20px 60px rgba(0,21,41,0.15)",
                        }}
                      >
                        <div style={{ height: "3px", background: "linear-gradient(90deg, #001529, #0052a3)" }} />
                        <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(0,21,41,0.07)" }}>
                          <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                          <p className="text-xs text-gray-500 capitalize mt-0.5">{user?.role?.replace("_", " ")}</p>
                        </div>
                        <div className="p-2">
                          <button
                            onClick={logout}
                            className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 text-red-600 hover:bg-red-50"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <button
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-100"
              style={{
                background: "linear-gradient(135deg, #001529 0%, #003d78 60%, #0066cc 100%)",
                boxShadow: "0 4px 15px rgba(0,21,41,0.30)",
              }}
              onClick={() => window.location.href = "/ipo-feasibility"}
            >
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(135deg, #002a52 0%, #0052a3 60%, #0080ff 100%)" }}
              />
              <span className="relative">Check IPO Feasibility</span>
              <ArrowUpRight className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="xl:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 hover:bg-black/5"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <AnimatePresence mode="wait">
            {mobileOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X className="h-5 w-5" style={{ color: "#001529" }} />
              </motion.div>
            ) : (
              <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Menu className="h-5 w-5" style={{ color: "#001529" }} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="xl:hidden overflow-hidden"
            style={{ borderTop: "1px solid rgba(0,21,41,0.09)", background: "rgba(255,255,255,0.99)" }}
          >
            <div className="container mx-auto px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
              {navLinks.map((link) => (
                <div key={link.label}>
                  {link.megaMenu || link.dropdown ? (
                    <>
                      <button
                        onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                        className="flex items-center justify-between w-full px-4 py-3 text-[13.5px] font-semibold rounded-xl transition-colors"
                        style={{
                          color: mobileExpanded === link.label ? "#001529" : "#374151",
                          background: mobileExpanded === link.label ? "rgba(0,21,41,0.05)" : "transparent",
                        }}
                      >
                        <span className="flex items-center gap-2">
                          {link.icon}
                          {link.label}
                        </span>
                        <ChevronDown
                          className="h-4 w-4 transition-transform duration-200"
                          style={{ transform: mobileExpanded === link.label ? "rotate(180deg)" : "rotate(0)", color: "#6b7280" }}
                        />
                      </button>
                      <AnimatePresence>
                        {mobileExpanded === link.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 pb-2 space-y-3 pt-1">
                              {link.megaMenu?.map((col) => (
                                <div key={col.title}>
                                  <div className="flex items-center gap-1.5 px-3 py-1 mb-1">
                                    {col.icon && <span style={{ color: "#001529", opacity: 0.6 }}>{col.icon}</span>}
                                    <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#001529" }}>{col.title}</p>
                                  </div>
                                  {col.items.map((item) => (
                                    item.external ? (
                                      <a
                                        key={item.label}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium rounded-lg transition-colors"
                                        style={{ color: "#6b7280" }}
                                        onClick={() => setMobileOpen(false)}
                                      >
                                        {item.label}
                                        <ExternalLink className="h-3 w-3 shrink-0 opacity-50" />
                                      </a>
                                    ) : (
                                      <Link
                                        key={item.label}
                                        to={item.href}
                                        className="block px-3 py-2 text-[13px] font-medium rounded-lg transition-colors"
                                        style={{ color: "#6b7280" }}
                                        onClick={() => setMobileOpen(false)}
                                      >
                                        {item.label}
                                      </Link>
                                    )
                                  ))}
                                </div>
                              ))}
                              {link.dropdown?.map((item) => (
                                <Link
                                  key={item.label}
                                  to={item.href}
                                  className="flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium rounded-lg transition-colors"
                                  style={{ color: "#6b7280" }}
                                  onClick={() => setMobileOpen(false)}
                                >
                                  {item.icon && <span style={{ color: "#001529", opacity: 0.5 }}>{item.icon}</span>}
                                  <div>
                                    <span className="block">{item.label}</span>
                                    {item.description && <span className="text-[11px] opacity-60">{item.description}</span>}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={link.href}
                      className="block px-4 py-3 text-[13.5px] font-semibold rounded-xl transition-colors"
                      style={{
                        color: location.pathname === link.href ? "#001529" : "#374151",
                        background: location.pathname === link.href ? "rgba(0,21,41,0.05)" : "transparent",
                      }}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}

              <div className="pt-3 mt-2 space-y-2" style={{ borderTop: "1px solid rgba(0,21,41,0.08)" }}>
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <Button variant="ghost" className="text-primary justify-start w-full" asChild>
                        <Link to="/admin" onClick={() => setMobileOpen(false)}>
                          <LayoutDashboard className="h-4 w-4 mr-2" />Admin Panel
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      className="text-red-600 justify-start w-full"
                      onClick={() => { logout(); setMobileOpen(false); }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />Logout ({user?.name})
                    </Button>
                  </>
                ) : (
                  <Link
                    to="/ipo-feasibility"
                    className="flex items-center justify-center gap-2 w-full py-3 text-sm font-bold text-white rounded-full transition-all"
                    style={{ background: "linear-gradient(135deg, #001529 0%, #003d78 60%, #0066cc 100%)" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    Check IPO Feasibility
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
