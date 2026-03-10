import { mockIPOs } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const statusColor: Record<string, string> = {
  Open: "bg-brand-green/15 text-brand-green border-brand-green/30",
  Upcoming: "bg-primary/15 text-primary border-primary/30",
  Closed: "bg-destructive/15 text-destructive border-destructive/30",
  Listed: "bg-accent/15 text-accent border-accent/30",
};

const IPOCalendarPreview = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-2">
              IPO <span className="text-primary">Calendar</span>
            </h2>
            <p className="text-muted-foreground">Track upcoming and current IPOs in real-time</p>
          </div>
          <Button variant="outline" className="hidden md:inline-flex border-primary/30 text-primary hover:bg-primary/5" asChild>
            <Link to="/ipo-calendar">View All IPOs</Link>
          </Button>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-primary text-primary-foreground">
                  <th className="text-left py-3 px-4 font-semibold">Company</th>
                  <th className="text-left py-3 px-4 font-semibold hidden sm:table-cell">Sector</th>
                  <th className="text-left py-3 px-4 font-semibold">Issue Size</th>
                  <th className="text-left py-3 px-4 font-semibold hidden md:table-cell">Price Range</th>
                  <th className="text-left py-3 px-4 font-semibold hidden lg:table-cell">Open Date</th>
                  <th className="text-left py-3 px-4 font-semibold hidden lg:table-cell">Close Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockIPOs.slice(0, 5).map((ipo) => (
                  <tr key={ipo.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-foreground">{ipo.companyName}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{ipo.sector}</td>
                    <td className="py-3 px-4 text-foreground">{ipo.issueSize}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{ipo.priceRange}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">{ipo.openDate}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">{ipo.closeDate}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={statusColor[ipo.status]}>
                        {ipo.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-center md:hidden">
          <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/5" asChild>
            <Link to="/ipo-calendar">View All IPOs →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default IPOCalendarPreview;
