import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { mockIPOs } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

const statusColor: Record<string, string> = {
  Open: "bg-success/15 text-success border-success/30",
  Upcoming: "bg-info/15 text-info border-info/30",
  Closed: "bg-destructive/15 text-destructive border-destructive/30",
  Listed: "bg-accent/15 text-accent border-accent/30",
};

const IPOCalendar = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");

  const filtered = mockIPOs.filter((ipo) => {
    const matchSearch = ipo.companyName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || ipo.status === statusFilter;
    const matchSector = sectorFilter === "all" || ipo.sector === sectorFilter;
    return matchSearch && matchStatus && matchSector;
  });

  const sectors = [...new Set(mockIPOs.map((i) => i.sector))];

  return (
    <div className="min-h-screen">
      <SEOHead title="IPO Calendar" description="Track upcoming, open, and recently listed IPOs in India with real-time data, GMP, and subscription status." keywords="IPO calendar, upcoming IPO, IPO dates, IPO schedule India" />
      <Header />
      <main>
        <section className="gradient-navy py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
              IPO <span className="text-gradient-gold">Calendar</span>
            </h1>
            <p className="text-primary-foreground/60 max-w-lg mx-auto">
              Track all upcoming, open, and recently listed IPOs with real-time data.
            </p>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Listed">Listed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sectorFilter} onValueChange={setSectorFilter}>
                <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Sector" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  {sectors.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left py-3 px-4 font-semibold">Company</th>
                      <th className="text-left py-3 px-4 font-semibold hidden sm:table-cell">Sector</th>
                      <th className="text-left py-3 px-4 font-semibold">Issue Size</th>
                      <th className="text-left py-3 px-4 font-semibold hidden md:table-cell">Price Range</th>
                      <th className="text-left py-3 px-4 font-semibold hidden md:table-cell">Lot Size</th>
                      <th className="text-left py-3 px-4 font-semibold hidden lg:table-cell">Open</th>
                      <th className="text-left py-3 px-4 font-semibold hidden lg:table-cell">Close</th>
                      <th className="text-left py-3 px-4 font-semibold">GMP</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((ipo) => (
                      <tr key={ipo.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 font-medium">{ipo.companyName}</td>
                        <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{ipo.sector}</td>
                        <td className="py-3 px-4">{ipo.issueSize}</td>
                        <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{ipo.priceRange}</td>
                        <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{ipo.lotSize}</td>
                        <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">{ipo.openDate}</td>
                        <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">{ipo.closeDate}</td>
                        <td className="py-3 px-4 font-medium text-success">{ipo.gmp}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className={statusColor[ipo.status]}>{ipo.status}</Badge>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={9} className="py-8 text-center text-muted-foreground">No IPOs found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default IPOCalendar;
