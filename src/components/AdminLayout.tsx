import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, FileText, BookOpen, Users, MessageSquare, Settings, LogOut, Menu, X, TrendingUp, Globe, Navigation, Layout, Image, Building2, GraduationCap, Bell, Video, Newspaper, Briefcase, PlayCircle, ClipboardCheck, Megaphone, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Manage IPOs", href: "/admin/ipos", icon: TrendingUp },
  { label: "Manage Blogs", href: "/admin/blogs", icon: BookOpen },
  { label: "News / Updates", href: "/admin/news", icon: Newspaper },
  { label: "Merchant Bankers (SME)", href: "/admin/merchant-bankers", icon: Building2 },
  { label: "Mainboard Bankers", href: "/admin/mainboard-bankers", icon: Building2 },
  { label: "Reports", href: "/admin/reports", icon: FileText },
  { label: "IPO Knowledge", href: "/admin/knowledge", icon: GraduationCap },
  { label: "Manage Registrars", href: "/admin/registrars", icon: Users },
  { label: "Registrar FAQs", href: "/admin/registrar-faqs", icon: HelpCircle },
  { label: "Notifications PDFs", href: "/admin/notifications", icon: Bell },
  { label: "IPO Videos", href: "/admin/videos", icon: Video },
  { label: "Market Snaps", href: "/admin/market-snaps", icon: PlayCircle },
  { label: "Daily Reporter", href: "/admin/daily-digests", icon: FileText },
  { label: "Check IPO Feasibility", href: "/admin/ipo-feasibility", icon: ClipboardCheck },
  { label: "Career Applications", href: "/admin/career-applications", icon: GraduationCap },
  { label: "Manage CSR", href: "/admin/csr", icon: Globe },
  { label: "Investor Enquiries", href: "/admin/investors", icon: Briefcase },
  { label: "Leads", href: "/admin/leads", icon: MessageSquare, badgeKey: "leads" },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Pages", href: "/admin/pages", icon: Layout },
  { label: "Navigation", href: "/admin/navigation", icon: Navigation },
  { label: "Manage IPO Blogs", href: "/admin/ipo-blogs", icon: BookOpen },
  { label: "Site Popup", href: "/admin/popup", icon: Megaphone },
  { label: "SEO Settings", href: "/admin/seo", icon: Settings },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadLeads, setUnreadLeads] = useState(0);

  useEffect(() => {
    // Fetch unread leads count
    const fetchUnread = async () => {
      try {
        const res = await fetch("/api/leads");
        if (res.ok) {
          const leads = await res.json();
          const unread = leads.filter((l: any) => !l.is_read).length;
          setUnreadLeads(unread);
        }
      } catch (err) { console.error(err); }
    };
    fetchUnread();

    // Fallback to polling for demo purposes without websockets
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">You need admin privileges to access this page.</p>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <Link to="/login">Login as Admin</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-primary-foreground/10">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="IndiaIPO" className="h-8 w-auto" />
            <span className="text-xs text-primary-foreground/50">Admin</span>
          </Link>
          <button className="lg:hidden text-primary-foreground" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto flex-1" style={{ maxHeight: 'calc(100vh - 64px - 100px)' }}>
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.href;
            const badge = link.badgeKey === "leads" ? unreadLeads : 0;
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? "bg-accent/20 text-accent" : "text-primary-foreground/60 hover:text-accent hover:bg-primary-foreground/5"
                  }`}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{link.label}</span>
                {badge > 0 && (
                  <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-primary-foreground/10">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">
              {user?.name?.[0] || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-primary-foreground truncate">{user?.name}</div>
              <div className="text-xs text-primary-foreground/40 capitalize">{user?.role?.replace("_", " ")}</div>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-40 bg-card border-b border-border h-14 flex items-center px-4 gap-4">
          <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="text-sm font-semibold text-foreground capitalize">
            {sidebarLinks.find((l) => l.href === location.pathname)?.label || "Admin"}
          </h2>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default AdminLayout;
