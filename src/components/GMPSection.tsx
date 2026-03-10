import { mockIPOs } from "@/data/mockData";
import { TrendingUp, TrendingDown } from "lucide-react";

const GMPSection = () => {
  const iposWithGMP = mockIPOs.filter((i) => i.gmp && i.status !== "Listed");

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-3">
            Grey Market <span className="text-primary">Premium (GMP)</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Real-time GMP data to help you make informed IPO investment decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {iposWithGMP.map((ipo) => {
            const gmpValue = parseInt(ipo.gmp.replace("+", "").replace("-", ""));
            const isPositive = !ipo.gmp.startsWith("-");
            return (
              <div key={ipo.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{ipo.companyName}</h3>
                    <p className="text-xs text-muted-foreground">{ipo.sector} • {ipo.status}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? "text-brand-green" : "text-destructive"}`}>
                    {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    ₹{gmpValue}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Price Band</span>
                    <p className="font-medium text-foreground">{ipo.priceRange}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Expected Listing</span>
                    <p className="font-medium text-foreground">
                      {ipo.priceRange.split("-").pop()?.replace("₹", "").trim()
                        ? `₹${parseInt(ipo.priceRange.split("-").pop()?.replace("₹", "").trim() || "0") + gmpValue}`
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Subscription</span>
                    <p className="font-medium text-foreground">{ipo.subscription}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Lot Size</span>
                    <p className="font-medium text-foreground">{ipo.lotSize} shares</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GMPSection;
