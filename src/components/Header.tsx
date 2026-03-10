import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronRight, LogOut, LayoutDashboard, Zap, ExternalLink, ArrowUpRight } from "lucide-react";
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

const navLinks: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    dropdown: [
      { label: "About IndiaIPO", href: "/about" },
      { label: "Our Team", href: "/about#team" },
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
          { label: "Initial Public Offering (IPO)", href: "/services#ipo" },
          { label: "SME IPO Consultation", href: "/services#sme-ipo" },
          { label: "Mainline IPO Consultation", href: "/services#mainline-ipo" },
          { label: "Follow-On Public Offer (FPO)", href: "/services#fpo" },
          { label: "Pre-IPO Funding Consultants", href: "/services#pre-ipo" },
        ],
      },
      {
        title: "Capital Raising",
        items: [
          { label: "Social Stock Exchange", href: "/services#sse" },
          { label: "Private Placement", href: "/services#private-placement" },
          { label: "Project Funding", href: "/services#project-funding" },
          { label: "REIT", href: "/services#reit" },
          { label: "SM REIT", href: "/services#sm-reit" },
          { label: "Rights Issue Advisory", href: "/services#rights-issue" },
          { label: "InvIT Rights Issue", href: "/services#invit-rights" },
          { label: "InvIT Public Issue", href: "/services#invit-public" },
          { label: "Debt Syndication", href: "/services#debt-syndication" },
        ],
      },
      {
        title: "Finance Advisory",
        items: [
          { label: "Business Valuation", href: "/services#valuation" },
          { label: "Corporate Finance", href: "/services#corporate-finance" },
          { label: "Financial Modelling", href: "/services#financial-modelling" },
          { label: "Project Finance", href: "/services#project-finance" },
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
          { label: "List of SME Merchant Bankers", href: "/merchant-bankers/sme", external: true },
        ],
      },
      {
        title: "MAINBOARD",
        items: [
          { label: "List of Mainboard Merchant Bankers", href: "/merchant-bankers/mainboard", external: true },
        ],
      },
    ],
  },
  {
    label: "Resources",
    href: "/reports",
    icon: <Zap className="h-3.5 w-3.5" />,
    megaMenu: [
      {
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
      },
      {
        title: "IPO Knowledge",
        items: [
          { label: "IPO World Magazine", href: "/ipo-knowledge/ipo-world-magazine", badge: "IPO World Magazine", badgeColor: "bg-brand-blue text-primary-foreground" },
          { label: "IPO Process", href: "/ipo-knowledge/ipo-process" },
          { label: "Pre-IPO Process Guidance", href: "/ipo-knowledge/pre-ipo-process" },
          { label: "IPO Blogs", href: "/blog" },
          { label: "Sector Wise IPO List In India", href: "/ipo-knowledge/sector-wise-ipo-list" },
          { label: "List of IPO Registrar", href: "/ipo-knowledge/ipo-registrar-list" },
        ],
      },
      {
        title: "Notifications / Circulars",
        items: [
          { label: "SEBI ICDR Amendment Regulations", href: "/notifications/sebi-icdr-amendments" },
          { label: "SEBI SME IPO ICDR Amendments", href: "/notifications/sebi-sme-icdr-amendments" },
          { label: "ICDR", href: "/notifications/icdr" },
          { label: "BSE SME Eligibility Criteria", href: "/notifications/bse-sme-eligibility" },
          { label: "NSE Emerge Eligibility Criteria", href: "/notifications/nse-emerge-eligibility" },
        ],
      },
    ],
  },
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

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="India IPO" className="h-12 w-auto" />
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
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-2"
                    onMouseEnter={() => handleMouseEnter(link.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="bg-background rounded-xl border border-border shadow-xl p-6 min-w-[600px]"
                      style={{ maxWidth: link.megaMenu.length > 2 ? "820px" : "500px" }}
                    >
                      <div className={`grid gap-8 ${link.megaMenu.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
                        {link.megaMenu.map((col) => (
                          <div key={col.title}>
                            <h4 className="text-sm font-bold text-primary mb-3 uppercase tracking-wide">{col.title}</h4>
                            <div className="space-y-0.5">
                              {col.items.map((item) => (
                                <div key={item.label}>
                                  {item.badge ? (
                                    <Link
                                      to={item.href}
                                      className={`inline-block px-3 py-1 rounded-md text-xs font-semibold mb-2 ${item.badgeColor}`}
                                    >
                                      {item.badge}
                                    </Link>
                                  ) : (
                                    <Link
                                      to={item.href}
                                      className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-foreground/70 hover:text-primary hover:bg-secondary rounded-md transition-colors"
                                    >
                                      {item.label}
                                      {item.external && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
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
                    className="absolute left-0 top-full pt-2"
                    onMouseEnter={() => handleMouseEnter(link.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="bg-background rounded-xl border border-border shadow-xl py-2 min-w-[220px]">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.label}
                          to={item.href}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground/70 hover:text-primary hover:bg-secondary transition-colors"
                        >
                          {item.label}
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
                      className="absolute right-0 top-full pt-2"
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
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-full px-5" asChild>
              <Link to="/ipo-feasibility">
                Check IPO Feasibility
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
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
