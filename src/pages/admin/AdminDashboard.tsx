import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Link } from "react-router-dom";
import {
  TrendingUp, Users, FileText, BookOpen, MessageSquare,
  BarChart3, Star, Briefcase, Bell, UserCheck, Building2,
  RefreshCw, ArrowUp, CheckCircle, Clock, Activity,
  Mail, Eye, EyeOff, ChevronRight
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const API_BASE = "/api";


interface DashboardStats {
  totalIPOs: number;
  activeIPOs: number;
  upcomingIPOs: number;
  totalBlogs: number;
  totalReports: number;
  totalUsers: number;
  totalLeads: number;
  unreadLeads: number;
  totalSubscriptions: number;
  totalConsultantEnquiries: number;
  unreadConsultantEnquiries: number;
  totalMerchantEnquiries: number;
  unreadMerchantEnquiries: number;
  totalInvestorEnquiries: number;
  totalCareerApplications: number;
  totalAdminBlogs: number;
  leadsTrend: { month: string; count: number }[];
  subscriptionsTrend: { month: string; count: number }[];
  enquiryBreakdown: { type: string; count: number }[];
  recentActivity: { type: string; name: string; email: string; created_at: string }[];
}

// Color palette for charts
const CHART_COLORS = ["#6366f1", "#22d3ee", "#f59e0b", "#10b981", "#f43f5e", "#a78bfa"];

const PIE_COLORS: Record<string, string> = {
  Consultant: "#6366f1",
  Merchant: "#22d3ee",
  Investor: "#f59e0b",
  Leads: "#10b981",
};

const activityIcon: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  lead: { icon: MessageSquare, color: "text-emerald-400", label: "New Lead" },
  consultant_enquiry: { icon: UserCheck, color: "text-indigo-400", label: "Consultant Enquiry" },
  merchant_enquiry: { icon: Building2, color: "text-cyan-400", label: "Merchant Enquiry" },
  career: { icon: Briefcase, color: "text-amber-400", label: "Career Application" },
};

function timeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// Stat Card Component
function StatCard({
  label,
  value,
  icon: Icon,
  color,
  badge,
  badgeColor,
  href,
  sub,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  badge?: number;
  badgeColor?: string;
  href: string;
  sub?: string;
}) {
  return (
    <Link
      to={href}
      className="group relative shadow-xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-5 backdrop-blur-sm hover:border-white/20 hover:from-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20 block"
    >
      {/* Glow */}
      <div
        className={`absolute -top-6 -right-6 h-24 w-24 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity ${color}`}
      />
      <div className="relative flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
            {label}
          </span>




          <span className="text-4xl font-bold text-foreground tracking-tight">
            {typeof value === "number" ? value.toLocaleString() : value}
          </span>
          {sub && (
            <span className="text-xs text-muted-foreground/60 flex items-center gap-1">
              <ArrowUp className="h-3 w-3 text-emerald-400" />
              {sub}
            </span>
          )}
        </div>
        <div
          className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-lg`}
        >
          <Icon className="h-6 w-6 text-white" />
          {badge !== undefined && badge > 0 && (
            <span
              className={`absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${badgeColor || "bg-red-500"}`}
            >
              {badge > 99 ? "99+" : badge}
            </span>
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
        View Details
        <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

// Custom Pie Chart Label
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return percent > 0.05 ? (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/dashboard/stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setLastUpdated(new Date());
      }
    } catch (e) {
      console.error("Failed to fetch dashboard stats", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  const statCards = stats
    ? [
      {
        label: "Total IPOs",
        value: stats.totalIPOs,
        icon: TrendingUp,
        color: "from-indigo-500 to-purple-600",
        bg: "from-indigo-500",
        href: "/admin/ipos",
        sub: `${stats.activeIPOs} Active · ${stats.upcomingIPOs} Upcoming`,
      },
      {
        label: "Leads",
        value: stats.totalLeads,
        icon: MessageSquare,
        color: "from-emerald-500 to-teal-600",
        bg: "from-emerald-500",
        href: "/admin/leads",
        badge: stats.unreadLeads,
        badgeColor: "bg-red-500",
        sub: `${stats.unreadLeads} unread`,
      },
      {
        label: "Consultant Enquiries",
        value: stats.totalConsultantEnquiries,
        icon: UserCheck,
        color: "from-violet-500 to-indigo-600",
        bg: "from-violet-500",
        href: "/admin/consultant-enquiries",
        badge: stats.unreadConsultantEnquiries,
        badgeColor: "bg-red-500",
        sub: `${stats.unreadConsultantEnquiries} unread`,
      },
      {
        label: "Merchant Enquiries",
        value: stats.totalMerchantEnquiries,
        icon: Building2,
        color: "from-cyan-500 to-blue-600",
        bg: "from-cyan-500",
        href: "/admin/merchant-enquiries",
        badge: stats.unreadMerchantEnquiries,
        badgeColor: "bg-red-500",
        sub: `${stats.unreadMerchantEnquiries} unread`,
      },
      {
        label: "Investor Enquiries",
        value: stats.totalInvestorEnquiries,
        icon: Star,
        color: "from-amber-500 to-orange-600",
        bg: "from-amber-500",
        href: "/admin/investors",
        sub: "Total investor interests",
      },
      {
        label: "Subscriptions",
        value: stats.totalSubscriptions,
        icon: Bell,
        color: "from-pink-500 to-rose-600",
        bg: "from-pink-500",
        href: "/admin/subscriptions",
        sub: "Active newsletter subs",
      },
      {
        label: "Career Applications",
        value: stats.totalCareerApplications,
        icon: Briefcase,
        color: "from-lime-500 to-green-600",
        bg: "from-lime-500",
        href: "/admin/career-applications",
        sub: "Pending review",
      },
      {
        label: "Users",
        value: stats.totalUsers,
        icon: Users,
        color: "from-fuchsia-500 to-purple-600",
        bg: "from-fuchsia-500",
        href: "/admin/users",
        sub: "Registered accounts",
      },
      {
        label: "Reports",
        value: stats.totalReports,
        icon: FileText,
        color: "from-teal-500 to-cyan-600",
        bg: "from-teal-500",
        href: "/admin/reports",
        sub: "IPO research reports",
      },
      {
        label: "Blogs",
        value: stats.totalBlogs + stats.totalAdminBlogs,
        icon: BookOpen,
        color: "from-blue-500 to-indigo-600",
        bg: "from-blue-500",
        href: "/admin/blogs",
        sub: `${stats.totalAdminBlogs} IPO blogs`,
      },
    ]
    : [];

  const totalEnquiries =
    (stats?.totalLeads ?? 0) +
    (stats?.totalConsultantEnquiries ?? 0) +
    (stats?.totalMerchantEnquiries ?? 0) +
    (stats?.totalInvestorEnquiries ?? 0);

  return (
    <AdminLayout>
      <div className="space-y-8 px-1">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Real-time overview of your IPO platform activity
            </p>
          </div>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {lastUpdated ? `Updated ${timeAgo(lastUpdated.toISOString())}` : "Refresh"}
          </button>
        </div>

        {/* Loading skeleton */}
        {loading && !stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-36 rounded-2xl border border-white/10 bg-white/5 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Stat Grid */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {statCards.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
          </div>
        )}

        {/* Charts Row */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Leads Trend - Area Chart */}
            <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-foreground text-base">Leads Trend</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Last 6 months incoming leads</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  <Activity className="h-3 w-3" />
                  Live
                </span>
              </div>
              {(() => {
                // Pad data: if only 1 point, add dummy months before it so the area renders
                let chartData = stats.leadsTrend.length > 0 ? [...stats.leadsTrend] : [];
                if (chartData.length === 1) {
                  chartData = [
                    { month: '', count: 0 },
                    { month: '', count: 0 },
                    chartData[0],
                    { month: '', count: 0 },
                  ];
                }
                if (chartData.length === 0) {
                  return <div className="h-52 flex flex-col items-center justify-center text-muted-foreground text-sm gap-2"><Activity className="h-8 w-8 opacity-30" /><span>No leads data yet</span></div>;
                }
                return (
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} width={30} />
                      <Tooltip
                        contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, color: "#111", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                        cursor={{ stroke: "#10b981", strokeWidth: 1, strokeDasharray: "4 4" }}
                      />
                      <Area type="monotone" dataKey="count" name="Leads" stroke="#10b981" strokeWidth={2.5} fill="url(#leadsGrad)" dot={{ fill: "#10b981", r: 5, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 7, fill: "#10b981" }} />
                    </AreaChart>
                  </ResponsiveContainer>
                );
              })()}
            </div>

            {/* Enquiry Breakdown - Pie Chart */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-foreground text-base">Enquiry Breakdown</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">By category</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">
                  <BarChart3 className="h-3 w-3" />
                  All time
                </span>
              </div>
              {totalEnquiries > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={170}>
                    <PieChart>
                      <Pie
                        data={stats.enquiryBreakdown.filter(e => e.count > 0)}
                        dataKey="count"
                        nameKey="type"
                        cx="50%"
                        cy="50%"
                        outerRadius={75}
                        innerRadius={38}
                        labelLine={false}
                        label={renderCustomLabel}
                        strokeWidth={2}
                        stroke="#fff"
                      >
                        {stats.enquiryBreakdown.map((entry) => (
                          <Cell key={entry.type} fill={PIE_COLORS[entry.type] || CHART_COLORS[0]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, color: "#111", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-3 space-y-2">
                    {stats.enquiryBreakdown.map((entry) => (
                      <div key={entry.type} className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[entry.type] }} />
                          {entry.type}
                        </span>
                        <span className="text-xs font-bold text-foreground">{entry.count}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-52 flex flex-col items-center justify-center text-muted-foreground text-sm gap-2"><BarChart3 className="h-8 w-8 opacity-30" /><span>No enquiry data yet</span></div>
              )}
            </div>
          </div>
        )}

        {/* Subscriptions Bar Chart + Recent Activity */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Subscriptions Bar Chart */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-foreground text-base">Subscriptions Growth</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Last 6 months</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-pink-600 bg-pink-50 border border-pink-200 px-2.5 py-1 rounded-full">
                  <Bell className="h-3 w-3" />
                  Newsletter
                </span>
              </div>
              {(() => {
                let chartData = stats.subscriptionsTrend.length > 0 ? [...stats.subscriptionsTrend] : [];
                if (chartData.length === 1) {
                  chartData = [{ month: '', count: 0 }, chartData[0], { month: '', count: 0 }];
                }
                if (chartData.length === 0) {
                  return <div className="h-48 flex flex-col items-center justify-center text-muted-foreground text-sm gap-2"><Bell className="h-8 w-8 opacity-30" /><span>No subscription data yet</span></div>;
                }
                return (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData} barSize={22} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
                      <Tooltip
                        contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, color: "#111", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                      />
                      <Bar dataKey="count" name="Subscribers" radius={[6, 6, 0, 0]}>
                        {chartData.map((_, index) => (
                          <Cell key={index} fill={`hsl(${320 + index * 15}, 75%, 60%)`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                );
              })()}
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-foreground text-base">Recent Activity</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Latest platform actions</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600 bg-cyan-50 border border-cyan-200 px-2.5 py-1 rounded-full">
                  <Activity className="h-3 w-3" />
                  Real-time
                </span>
              </div>
              <div className="space-y-2.5">
                {stats.recentActivity.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">No recent activity</p>
                )}
                {stats.recentActivity.map((item, i) => {
                  const meta = activityIcon[item.type] || { icon: Bell, color: "text-gray-500", label: "Event" };
                  const Icon = meta.icon;
                  const bgColors: Record<string, string> = {
                    "text-emerald-400": "bg-emerald-50 border-emerald-100 text-emerald-600",
                    "text-indigo-400": "bg-indigo-50 border-indigo-100 text-indigo-600",
                    "text-cyan-400": "bg-cyan-50 border-cyan-100 text-cyan-600",
                    "text-amber-400": "bg-amber-50 border-amber-100 text-amber-600",
                  };
                  const iconCls = bgColors[meta.color] || "bg-gray-50 border-gray-100 text-gray-500";
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 hover:bg-gray-100 transition-colors"
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${iconCls}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{meta.label} · {item.email}</p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground ml-2 whitespace-nowrap">
                        {timeAgo(item.created_at)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {stats && (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-bold text-foreground text-base mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { label: "Add IPO", href: "/admin/ipos", icon: TrendingUp, color: "bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100" },
                { label: "View Leads", href: "/admin/leads", icon: MessageSquare, color: "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100" },
                { label: "Consultant Enquiries", href: "/admin/consultant-enquiries", icon: UserCheck, color: "bg-violet-50 border-violet-200 text-violet-600 hover:bg-violet-100" },
                { label: "Merchant Enquiries", href: "/admin/merchant-enquiries", icon: Building2, color: "bg-cyan-50 border-cyan-200 text-cyan-600 hover:bg-cyan-100" },
                { label: "Investor Enquiries", href: "/admin/investors", icon: Star, color: "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100" },
                { label: "Subscriptions", href: "/admin/subscriptions", icon: Bell, color: "bg-pink-50 border-pink-200 text-pink-600 hover:bg-pink-100" },
                { label: "Career Apps", href: "/admin/career-applications", icon: Briefcase, color: "bg-lime-50 border-lime-200 text-lime-600 hover:bg-lime-100" },
                { label: "Manage Blogs", href: "/admin/blogs", icon: BookOpen, color: "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100" },
                { label: "Manage Reports", href: "/admin/reports", icon: FileText, color: "bg-teal-50 border-teal-200 text-teal-600 hover:bg-teal-100" },
                { label: "Users", href: "/admin/users", icon: Users, color: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-600 hover:bg-fuchsia-100" },
                { label: "Market Snaps", href: "/admin/market-snaps", icon: BarChart3, color: "bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100" },
                { label: "Notifications", href: "/admin/notifications", icon: Bell, color: "bg-yellow-50 border-yellow-200 text-yellow-600 hover:bg-yellow-100" },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.label}
                    to={action.href}
                    className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center text-xs font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md ${action.color}`}
                  >
                    <Icon className="h-5 w-5" />
                    {action.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
