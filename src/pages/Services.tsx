import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Building2, TrendingUp, BarChart3, Wallet, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const allServices = [
  {
    id: "sme-ipo",
    title: "SME IPO",
    icon: <Building2 className="h-10 w-10" />,
    description: "End-to-end advisory for Small and Medium Enterprise IPOs on BSE SME and NSE Emerge platforms.",
    benefits: ["Lower listing requirements", "Faster time to market", "Access to growth capital", "Enhanced brand visibility"],
    steps: ["Eligibility Assessment", "Due Diligence & Documentation", "Merchant Banker Coordination", "SEBI Filing & Approval", "Roadshows & Marketing", "Listing Day Support"],
  },
  {
    id: "mainline-ipo",
    title: "Mainline IPO",
    icon: <TrendingUp className="h-10 w-10" />,
    description: "Comprehensive consultancy for mainboard IPO listings with full SEBI compliance and institutional investor roadshows.",
    benefits: ["Access to institutional investors", "Higher valuation potential", "Greater liquidity", "National brand recognition"],
    steps: ["Feasibility Study", "Valuation & Structuring", "DRHP Preparation", "SEBI Review Process", "Institutional Roadshows", "Book Building & Allotment"],
  },
  {
    id: "fpo",
    title: "FPO Advisory",
    icon: <BarChart3 className="h-10 w-10" />,
    description: "Follow-on Public Offering strategy for listed companies seeking additional capital from the public markets.",
    benefits: ["Raise additional capital", "Improve free float", "Strengthen balance sheet", "Reduce promoter debt"],
    steps: ["Capital Need Assessment", "Board & Shareholder Approvals", "Pricing Strategy", "SEBI Filing", "Offer Execution", "Post-Issue Compliance"],
  },
  {
    id: "pre-ipo",
    title: "Pre-IPO Funding",
    icon: <Wallet className="h-10 w-10" />,
    description: "Connect with institutional investors and HNIs for pre-IPO capital raising and optimal valuation discovery.",
    benefits: ["Early capital access", "Valuation benchmarking", "Strategic investor onboarding", "IPO readiness preparation"],
    steps: ["Company Profiling", "Investor Identification", "Pitch Deck & Data Room", "Term Sheet Negotiation", "Due Diligence Support", "Investment Closure"],
  },
];

const Services = () => {
  return (
    <div className="min-h-screen">
      <SEOHead title="Services" description="SME IPO, Mainline IPO, FPO Advisory, and Pre-IPO Funding — comprehensive IPO consultancy services by IndiaIPO." keywords="SME IPO, Mainline IPO, FPO, Pre-IPO funding, IPO advisory services" />
      <Header />
      <main>
        <section className="gradient-navy py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
              Our <span className="text-gradient-gold">Services</span>
            </h1>
            <p className="text-primary-foreground/60 max-w-lg mx-auto">
              Comprehensive IPO advisory solutions tailored for companies at every stage.
            </p>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 space-y-16">
            {allServices.map((service, i) => (
              <div key={service.id} id={service.id} className="scroll-mt-20">
                <div className={`grid md:grid-cols-2 gap-10 items-start ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                  <div>
                    <div className="w-16 h-16 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                      {service.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-3">{service.title}</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">{service.description}</p>
                    <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">Key Benefits</h3>
                    <div className="space-y-2 mb-6">
                      {service.benefits.map((b) => (
                        <div key={b} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-success shrink-0" />
                          {b}
                        </div>
                      ))}
                    </div>
                    <Button className="bg-accent text-accent-foreground hover:bg-gold-light font-semibold" asChild>
                      <Link to="/contact">
                        Schedule Consultation
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">Process Steps</h3>
                    <div className="space-y-4">
                      {service.steps.map((step, idx) => (
                        <div key={step} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold shrink-0">
                            {idx + 1}
                          </div>
                          <div className="pt-1 text-sm text-muted-foreground">{step}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
