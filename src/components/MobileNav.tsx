import { Link, useLocation } from "react-router-dom";
import { Home, BarChart2, TrendingUp, Newspaper, Users } from "lucide-react";

const MobileNav = () => {
  const location = useLocation();
  const navItems = [
    { icon: Home, label: "Home", to: "/" },
    { icon: BarChart2, label: "IPOs", to: "/ipo-blogs" },
    { icon: Users, label: "Bankers", to: "/merchant-bankers/mainboard-list" },
    { icon: Newspaper, label: "News", to: "/news-updates" },
  ];
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full flex justify-between items-center px-2 pb-6 pt-2 bg-white shadow-[0_-12px_40px_rgba(25,28,30,0.06)] z-[999] rounded-t-3xl border-t border-slate-100">
      {navItems.map((item, i) => {
        const Icon = item.icon;
        const active = location.pathname === item.to || (item.to !== "/" && location.pathname.startsWith(item.to));
        return (
          <Link key={i} to={item.to} className={`flex-1 flex flex-col items-center justify-center p-2 rounded-2xl mx-1 transition-all active:scale-90 ${active ? "bg-blue-50 text-blue-900" : "text-slate-400"}`}>
            <Icon className="h-5 w-5 mb-1" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-center whitespace-nowrap">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileNav;
