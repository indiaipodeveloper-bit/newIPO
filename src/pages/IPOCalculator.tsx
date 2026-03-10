import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

const IPOCalculator = () => {
  const [pricePerShare, setPricePerShare] = useState<number>(0);
  const [lotSize, setLotSize] = useState<number>(0);
  const [numLots, setNumLots] = useState<number>(1);
  const [listingPrice, setListingPrice] = useState<number>(0);

  const totalInvestment = pricePerShare * lotSize * numLots;
  const totalShares = lotSize * numLots;
  const listingValue = listingPrice * totalShares;
  const profit = listingValue - totalInvestment;
  const returnPct = totalInvestment > 0 ? ((profit / totalInvestment) * 100).toFixed(2) : "0";

  return (
    <div className="min-h-screen">
      <SEOHead
        title="IPO Calculator"
        description="Calculate your IPO investment returns, profit/loss, and listing gains with our free IPO calculator."
        keywords="IPO calculator, IPO investment calculator, IPO returns, listing gains calculator"
      />
      <Header />
      <main>
        <section className="gradient-navy py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
              IPO <span className="text-gradient-gold">Calculator</span>
            </h1>
            <p className="text-primary-foreground/60 max-w-lg mx-auto">
              Calculate your potential IPO returns before you invest.
            </p>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">Investment Calculator</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">IPO Price (₹ per share)</label>
                    <Input type="number" value={pricePerShare || ""} onChange={(e) => setPricePerShare(Number(e.target.value))} placeholder="e.g. 340" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Lot Size (shares)</label>
                    <Input type="number" value={lotSize || ""} onChange={(e) => setLotSize(Number(e.target.value))} placeholder="e.g. 44" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Number of Lots</label>
                    <Input type="number" value={numLots || ""} onChange={(e) => setNumLots(Number(e.target.value))} placeholder="e.g. 1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Expected Listing Price (₹)</label>
                    <Input type="number" value={listingPrice || ""} onChange={(e) => setListingPrice(Number(e.target.value))} placeholder="e.g. 385" />
                  </div>
                </div>

                {/* Results */}
                <div className="gradient-navy rounded-xl p-6 space-y-4">
                  <h3 className="text-sm font-semibold text-primary-foreground uppercase tracking-wide">Results</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card rounded-lg p-3">
                      <p className="text-xs text-primary-foreground/50">Total Investment</p>
                      <p className="text-lg font-bold text-primary-foreground">₹{totalInvestment.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="glass-card rounded-lg p-3">
                      <p className="text-xs text-primary-foreground/50">Total Shares</p>
                      <p className="text-lg font-bold text-primary-foreground">{totalShares}</p>
                    </div>
                    <div className="glass-card rounded-lg p-3">
                      <p className="text-xs text-primary-foreground/50">Listing Value</p>
                      <p className="text-lg font-bold text-primary-foreground">₹{listingValue.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="glass-card rounded-lg p-3">
                      <p className="text-xs text-primary-foreground/50">Profit / Loss</p>
                      <p className={`text-lg font-bold ${profit >= 0 ? "text-success" : "text-destructive"}`}>
                        {profit >= 0 ? "+" : ""}₹{profit.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                  <div className="text-center pt-2">
                    <p className="text-xs text-primary-foreground/50">Return on Investment</p>
                    <p className={`text-2xl font-bold ${profit >= 0 ? "text-success" : "text-destructive"}`}>
                      {profit >= 0 ? "+" : ""}{returnPct}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default IPOCalculator;
