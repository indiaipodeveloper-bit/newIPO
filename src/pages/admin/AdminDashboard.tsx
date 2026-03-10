import AdminLayout from "@/components/AdminLayout";
import { BarChart3, FileText, BookOpen, Users, MessageSquare, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const cards = [
  { label: "Total IPOs", value: "12", icon: TrendingUp, href: "/admin/ipos", color: "text-primary" },
  { label: "Total Blogs", value: "8", icon: BookOpen, href: "/admin/blogs", color: "text-info" },
  { label: "Total Reports", value: "15", icon: FileText, href: "/admin/reports", color: "text-brand-green" },
  { label: "Total Users", value: "245", icon: Users, href: "/admin/users", color: "text-accent" },
  { label: "Total Leads", value: "89", icon: MessageSquare, href: "/admin/leads", color: "text-brand-red" },
  { label: "Active IPOs", value: "3", icon: BarChart3, href: "/admin/ipos", color: "text-primary" },
];

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your platform activity</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.label}
                to={card.href}
                className="bg-card border border-border rounded-xl p-5 hover:border-accent/30 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{card.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${card.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { text: "New lead from Rajesh Kumar — TechCorp Pvt Ltd", time: "2 hours ago" },
              { text: "IPO 'GreenEnergy Power' status changed to Open", time: "5 hours ago" },
              { text: "New user registered — priya.sharma@gmail.com", time: "1 day ago" },
              { text: "Blog 'Top 10 IPOs March 2026' published", time: "2 days ago" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <span className="text-sm text-muted-foreground">{item.text}</span>
                <span className="text-xs text-muted-foreground/60 shrink-0 ml-4">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
