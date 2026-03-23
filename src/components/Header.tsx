import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, Zap, ExternalLink, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";

interface SubItem {
  label: string;
  href: string;
  external?: boolean;
  badge?: string;
  badgeColor?: string;
}

interface MegaColumn {
  title: string;
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
      { label: "About IndiaIPO", href: "/about" },

      { label: "Our CSR", href: "/csr" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    megaMenu: [
      {
        title: "IPO",
        items: [
          { label: "🌟 All IPO Services", href: "/ipo-services", badge: "View All IPO Services →", badgeColor: "bg-[#001529] text-white" },
          { label: "Initial Public Offering (IPO)", href: "/services/initial-public-offering" },
          { label: "SME IPO Consultation", href: "/services/sme-ipo" },
          { label: "Mainline IPO Consultation", href: "/services/mainline-ipo" },
          { label: "Follow-On Public Offer (FPO)", href: "/services/fpo" },
          { label: "Pre-IPO Funding Consultants", href: "/services/pre-ipo" },
        ],
      },
      {
        title: "Capital Raising",
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
        items: [
          { label: "List of SME Merchant Bankers", href: "/merchant-bankers/sme" },
        ],
      },
      {
        title: "MAINBOARD",
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
    icon: <Zap className="h-3.5 w-3.5" />,
    dropdown: [
      { label: "Markets & Money Update", href: "/news-updates" },
      { label: "IPO & Market Snaps", href: "/ipo-and-market-snaps" },
    ],
  },
  { label: "Contact Us", href: "/contact" },
];

const REPORTS_COLUMN: MegaColumn = {
  title: "Reports",
  items: [
    { label: "Daily Reporter", href: "/reports/daily-reporter", badge: "Daily Reporter", badgeColor: "bg-brand-green text-primary-foreground" },
    { label: "IPO Calendar", href: "/ipo-calendar" },
    { label: "Upcoming IPO Calendar", href: "/reports/upcoming-ipo-calendar" },
    { label: "Mainline IPO Report", href: "/reports/mainline-ipo-report" },
    { label: "SME IPO Report", href: "/reports/sme-ipo-report" },
    { label: "SME IPOs by Sector", href: "/reports/sme-ipos-by-sector" },
    { label: "Mainboard IPOs by Sector", href: "/reports/mainboard-ipos-by-sector" },
  ],
};

const FALLBACK_KNOWLEDGE: SubItem[] = [
  { label: "IPO World Magazine", href: "https://ipoworld.org/", external: true, badge: "IPO World Magazine", badgeColor: "bg-brand-blue text-primary-foreground" },
  { label: "IPO Process", href: "/ipo-knowledge/ipo-process" },
  { label: "Pre-IPO Process Guidance", href: "/ipo-knowledge/pre-ipo-process" },
  { label: "IPO Blogs", href: "/ipo-blogs" },
  { label: "Sector Wise IPO List In India", href: "/sector-wise-ipo" },
  { label: "List of IPO Registrar", href: "/list-of-ipo-registrar" },
];

const FALLBACK_NOTIFICATIONS: SubItem[] = [
  { label: "SEBI ICDR Amendment Regulations", href: "/notifications/sebi-icdr-amendments" },
  { label: "SEBI SME IPO ICDR Amendments", href: "/notifications/sebi-sme-icdr-amendments" },
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
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [notifItems, setNotifItems] = useState<SubItem[]>(FALLBACK_NOTIFICATIONS);
  const [knowledgeItems, setKnowledgeItems] = useState<SubItem[]>(FALLBACK_KNOWLEDGE);

  useEffect(() => {
    fetch("/api/notifications")
      .then(r => r.ok ? r.json() : null)
      .then((data: APINotif[] | null) => {
        if (data && data.length > 0) {
          const active = data.filter(n => n.is_active == 1 || n.is_active === true);
          if (active.length > 0) {
            setNotifItems(active.map(n => ({
              label: n.title,
              href: n.link ? (n.link.startsWith('http') ? n.link : `https://${n.link}`) : `/notifications/${n.slug}`,
              external: !!n.link
            })));
          }
        }
      })
      .catch(() => { });

    fetch("/api/knowledge/categories")
      .then(r => r.ok ? r.json() : null)
      .then((data: APICategory[] | null) => {
        if (data && data.length > 0) {
          const active = data.filter(c => (c.is_active == 1 || c.is_active === true) && !["SEBI ICDR Amendment Regulations", "SEBI SME IPO ICDR Amendments", "ICDR", "BSE SME Eligibility Criteria", "NSE Emerge Eligibility Criteria"].includes(c.name));
          if (active.length > 0) {
            setKnowledgeItems([
              { label: "IPO Blogs", href: "/ipo-blogs" },
              ...active.map(c => {
                const nameLower = c.name.toLowerCase();
                if (nameLower === "ipo world magazine") {
                  return {
                    label: "IPO World Magazine",
                    href: "https://ipoworld.org/",
                    external: true,
                    badge: "IPO World Magazine",
                    badgeColor: "bg-brand-blue text-primary-foreground"
                  };
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
    icon: <Zap className="h-3.5 w-3.5" />,
    megaMenu: [
      REPORTS_COLUMN,
      { title: "IPO Knowledge", items: knowledgeItems },
      { title: "Notifications / Circulars", items: notifItems },
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
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="India IPO" className="h-16 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => (link.megaMenu || link.dropdown) ? handleMouseEnter(link.label) : undefined}
              onMouseLeave={handleMouseLeave}
            >
              {link.megaMenu || link.dropdown ? (
                <button
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors rounded-md
                    ${activeMenu === link.label ? "text-primary" : "text-foreground/80 hover:text-primary"}
                    ${location.pathname === link.href ? "text-primary underline underline-offset-4 decoration-2 decoration-primary" : ""}`}
                >
                  {link.icon}
                  {link.label}
                  <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${activeMenu === link.label ? "rotate-180" : ""}`} />
                </button>
              ) : (
                <Link
                  to={link.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-md
                    ${location.pathname === link.href ? "text-primary underline underline-offset-4 decoration-2 decoration-primary" : "text-foreground/80 hover:text-primary"}`}
                >
                  {link.label}
                </Link>
              )}

              {/* Mega Menu */}
              <AnimatePresence>
                {activeMenu === link.label && link.megaMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50"
                    onMouseEnter={() => handleMouseEnter(link.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div
                      className="bg-background rounded-xl border border-border shadow-xl p-6"
                      style={{ minWidth: "600px", maxWidth: link.megaMenu.length > 2 ? "820px" : "500px" }}
                    >
                      <div className={`grid gap-8 ${link.megaMenu.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
                        {link.megaMenu.map((col) => (
                          <div key={col.title}>
                            <h4 className="text-sm font-bold text-primary mb-3 uppercase tracking-wide">{col.title}</h4>
                            <div className="space-y-0.5">
                              {col.items.map((item) => (
                                <div key={item.label}>
                                  {item.badge ? (
                                    item.external ? (
                                      <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-block px-3 py-1 rounded-md text-xs font-semibold mb-2 ${item.badgeColor}`}
                                      >
                                        {item.badge}
                                      </a>
                                    ) : (
                                      <Link
                                        to={item.href}
                                        className={`inline-block px-3 py-1 rounded-md text-xs font-semibold mb-2 ${item.badgeColor}`}
                                      >
                                        {item.badge}
                                      </Link>
                                    )
                                  ) : item.external ? (
                                    <a
                                      href={item.href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-foreground/70 hover:text-primary hover:bg-secondary rounded-md transition-colors"
                                    >
                                      {item.label}
                                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                    </a>
                                  ) : (
                                    <Link
                                      to={item.href}
                                      className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-foreground/70 hover:text-primary hover:bg-secondary rounded-md transition-colors"
                                    >
                                      {item.label}
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

              {/* Simple Dropdown */}
              <AnimatePresence>
                {activeMenu === link.label && link.dropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute left-0 top-full pt-2 z-50"
                    onMouseEnter={() => handleMouseEnter(link.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="bg-background rounded-xl border border-border shadow-xl py-2 min-w-[220px]">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.label}
                          to={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground/70 hover:text-primary hover:bg-secondary transition-colors"
                        >
                          {item.label}
                          {item.external && <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
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
                <button className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-md">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                    {user?.name?.[0] || "U"}
                  </div>
                  <ChevronDown className="h-3 w-3" />
                </button>
                <AnimatePresence>
                  {activeMenu === "user-menu" && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full pt-2 z-50"
                    >
                      <div className="bg-background rounded-xl border border-border shadow-xl py-2 min-w-[180px]">
                        <div className="px-4 py-2 border-b border-border">
                          <p className="text-sm font-medium text-foreground">{user?.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{user?.role?.replace("_", " ")}</p>
                        </div>
                        <button
                          onClick={logout}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-destructive hover:bg-secondary transition-colors"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <>
              <Link
                to="/ipo-services"
                className={`px-4 py-2 text-sm font-bold rounded-full border-2 transition-all ${
                  location.pathname === "/ipo-services"
                    ? "border-[#001529] bg-[#001529] text-white"
                    : "border-[#001529] text-[#001529] hover:bg-[#001529] hover:text-white"
                }`}
              >
                IPO Services
              </Link>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-full px-5" asChild>
                <Link to="/ipo-feasibility">
                  Check IPO Feasibility
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="xl:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
            className="xl:hidden bg-background border-t border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
              {navLinks.map((link) => (
                <div key={link.label}>
                  {link.megaMenu || link.dropdown ? (
                    <>
                      <button
                        onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                        className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-md"
                      >
                        <span className="flex items-center gap-1.5">
                          {link.icon}
                          {link.label}
                        </span>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileExpanded === link.label ? "rotate-180" : ""}`} />
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
                            <div className="pl-4 pb-2 space-y-3">
                              {link.megaMenu?.map((col) => (
                                <div key={col.title}>
                                  <p className="text-xs font-bold text-primary uppercase tracking-wide px-3 py-1">{col.title}</p>
                                  {col.items.map((item) => (
                                    item.external ? (
                                      <a
                                        key={item.label}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-foreground/60 hover:text-primary transition-colors"
                                        onClick={() => setMobileOpen(false)}
                                      >
                                        {item.label}
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    ) : (
                                      <Link
                                        key={item.label}
                                        to={item.href}
                                        className="block px-3 py-1.5 text-sm text-foreground/60 hover:text-primary transition-colors"
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
                                  className="block px-3 py-1.5 text-sm text-foreground/60 hover:text-primary transition-colors"
                                  onClick={() => setMobileOpen(false)}
                                >
                                  {item.label}
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
                      className={`block px-3 py-2.5 text-sm font-medium rounded-md transition-colors
                        ${location.pathname === link.href ? "text-primary bg-primary/5" : "text-foreground/80 hover:text-primary"}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
              <Link
                to="/ipo-services"
                className="block px-3 py-2.5 text-sm font-bold text-[#001529] bg-[#001529]/5 hover:bg-[#001529]/10 rounded-md transition-colors border border-[#001529]/20"
                onClick={() => setMobileOpen(false)}
              >
                🌟 IPO Services (All)
              </Link>
              <div className="pt-3 border-t border-border space-y-2">
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <Button variant="ghost" className="text-primary justify-start w-full" asChild>
                        <Link to="/admin" onClick={() => setMobileOpen(false)}><LayoutDashboard className="h-4 w-4 mr-2" />Admin Panel</Link>
                      </Button>
                    )}
                    <Button variant="ghost" className="text-destructive justify-start w-full" onClick={() => { logout(); setMobileOpen(false); }}>
                      <LogOut className="h-4 w-4 mr-2" />Logout ({user?.name})
                    </Button>
                  </>
                ) : (
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold w-full rounded-full" asChild>
                    <Link to="/contact" onClick={() => setMobileOpen(false)}>
                      Check IPO Feasibility
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
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
