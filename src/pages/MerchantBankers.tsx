import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { ExternalLink, MapPin, Search, TrendingUp, ArrowRight, Shield, Star, Building2, Phone, CheckCircle, Award, Users, Globe, Info, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Banker {
  id: string;
  name: string;
  category: string;
  location: string | null;
  sebi_registration: string | null;
  website: string | null;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  services: string | null;
  total_ipos: number | null;
  established_year: number | null;
  description: string | null;
  logo_url: string | null;
  sort_order: number;
  total_raised: number | null;
  avg_size: number | null;
  avg_subscription: number | null;
}

const MerchantBankersPage = ({ type }: { type: "sme" | "mainboard" }) => {
  const isSME = type === "sme";
  const [bankers, setBankers] = useState<Banker[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/bankers?category=${type}`)
      .then(res => res.json())
      .then(data => {
        setBankers(data.filter((b: Banker) => b.is_active));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [type]);

  const filtered = bankers.filter(
    (b) => b.name.toLowerCase().includes(search.toLowerCase()) || b.location?.toLowerCase().includes(search.toLowerCase())
  );

  const title = isSME ? "List of SME Merchant Bankers" : "List of Mainboard Merchant Bankers";

  return (
    <div className="min-h-screen">
      <SEOHead
        title={title}
        description={`Complete directory of SEBI registered ${isSME ? "SME" : "Mainboard"} merchant bankers in India with IPO stats, contact details, and performance data.`}
        keywords={`${title}, SEBI registered, IPO merchant bankers, BRLM India`}
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-primary py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-72 h-72 bg-accent rounded-full blur-[120px]" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-brand-green rounded-full blur-[150px]" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-accent/20 text-accent border border-accent/30 mb-6">
                <Shield className="h-3.5 w-3.5" />
                SEBI Registered
              </span>
              <h1 className="text-3xl md:text-5xl font-bold font-heading text-primary-foreground mb-4">
                {isSME ? "SME" : "Mainboard"} <span className="text-accent">Merchant Bankers</span>
              </h1>
              <p className="text-primary-foreground/70 max-w-2xl mx-auto mb-8">
                {isSME
                  ? "Complete directory of SEBI-registered Merchant Bankers for SME IPOs on BSE SME & NSE Emerge"
                  : "India's top SEBI-registered Merchant Bankers for Mainline IPO advisory and book running"}
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to={isSME ? "/merchant-bankers/mainboard" : "/merchant-bankers/sme"}>
                  <Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                    View {isSME ? "Mainboard" : "SME"} Bankers <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
                <Link to="/ipo-feasibility">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Check IPO Feasibility
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column — Banker Cards */}
              <div className="flex-1">
                {/* Search */}
                <div className="relative mb-8">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search merchant bankers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 h-12 text-base bg-card"
                  />
                </div>

                <p className="text-sm text-muted-foreground mb-6">{filtered.length} SEBI-registered {isSME ? "SME" : "Mainboard"} merchant bankers found</p>

                {loading ? (
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-card rounded-xl border border-border p-6 animate-pulse">
                        <div className="h-6 bg-muted rounded w-2/3 mb-3" />
                        <div className="h-4 bg-muted rounded w-full mb-4" />
                        <div className="grid grid-cols-4 gap-4">
                          {[1, 2, 3, 4].map((j) => <div key={j} className="h-16 bg-muted rounded" />)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filtered.map((banker, i) => (
                      <motion.div
                        key={banker.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, ease: "easeOut" as const }}
                        className="bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
                      >
                        {/* Top — Blue header */}
                        <div className="bg-primary/95 p-5 flex items-start gap-4">
                          <div className="w-16 h-16 rounded-xl bg-background flex items-center justify-center text-primary font-bold text-2xl shrink-0 shadow-md">
                            {banker.logo_url ? (
                              <img src={banker.logo_url} alt={banker.name} className="w-full h-full rounded-xl object-contain p-1" />
                            ) : (
                              banker.name[0]
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-primary-foreground mb-1">{banker.name}</h3>
                            <p className="text-sm text-primary-foreground/70 line-clamp-2">
                              {banker.description || `${banker.name} is a SEBI Registered Category I Merchant Banker located in ${banker.location || "India"}.`}
                            </p>
                          </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border border-b border-border">
                          {[
                            { label: "IPOS", value: banker.total_ipos || 0 },
                            { label: "TOTAL RAISED (CR)", value: `₹${(banker.total_raised || 0).toLocaleString("en-IN")}` },
                            { label: "AVG SIZE (CR)", value: `₹${banker.avg_size || 0}` },
                            { label: "AVG SUBSCRIPTION", value: `${banker.avg_subscription || 0}x` },
                          ].map((stat) => (
                            <div key={stat.label} className="py-4 px-4 text-center">
                              <div className="text-lg font-bold text-primary">{stat.value}</div>
                              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{stat.label}</div>
                            </div>
                          ))}
                        </div>

                        {/* Bottom — Actions & Meta */}
                        <div className="p-4 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-primary border-primary/30 hover:bg-primary/5"
                              onClick={() => setExpandedId(expandedId === banker.id ? null : banker.id)}
                            >
                              <Info className="h-3.5 w-3.5 mr-1" />
                              View Details
                            </Button>
                            {banker.website && (
                              <a href={banker.website} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm" className="text-muted-foreground">
                                  <Globe className="h-3.5 w-3.5 mr-1" /> Website
                                </Button>
                              </a>
                            )}
                          </div>
                          <Link to="/contact">
                            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                              <MessageSquare className="h-3.5 w-3.5 mr-1" /> Connect
                            </Button>
                          </Link>
                        </div>

                        {/* Expanded Details */}
                        {expandedId === banker.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-border px-5 py-4 bg-secondary/30"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="space-y-2">
                                {banker.location && (
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="h-3.5 w-3.5 text-primary" />
                                    <span>{banker.location}</span>
                                  </div>
                                )}
                                {banker.sebi_registration && (
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Shield className="h-3.5 w-3.5 text-primary" />
                                    <span>SEBI Reg: <span className="font-mono text-xs">{banker.sebi_registration}</span></span>
                                  </div>
                                )}
                                {banker.established_year && (
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Building2 className="h-3.5 w-3.5 text-primary" />
                                    <span>Established: {banker.established_year}</span>
                                  </div>
                                )}
                              </div>
                              <div>
                                {banker.services && (
                                  <div>
                                    <p className="text-xs font-semibold text-foreground mb-2">Services</p>
                                    <div className="flex flex-wrap gap-1.5">
                                      {banker.services.split(",").map((s) => (
                                        <span key={s.trim()} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                          {s.trim()}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Sidebar */}
              <div className="w-full lg:w-80 shrink-0 space-y-6">
                {/* CTA Card */}
                <div className="bg-card rounded-xl border border-border p-6 text-center sticky top-20">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    Want to List Your Business through {isSME ? "SME" : "Mainboard"} IPO?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">We can Help!</p>
                  <Link to="/contact">
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                      Contact Us <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>

                {/* Quick Info */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h4 className="font-semibold text-foreground mb-4">How to Choose the Right Banker</h4>
                  <div className="space-y-3">
                    {[
                      { icon: Award, text: "Check track record & IPO success rate" },
                      { icon: Star, text: "Evaluate sector expertise & experience" },
                      { icon: Users, text: "Verify investor network strength" },
                      { icon: Shield, text: "Confirm SEBI registration status" },
                      { icon: CheckCircle, text: "Assess post-listing support quality" },
                    ].map((tip) => (
                      <div key={tip.text} className="flex items-start gap-2.5">
                        <tip.icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-sm text-muted-foreground">{tip.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Links */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
                  <div className="space-y-2">
                    {[
                      { label: "IPO Calendar", href: "/ipo-calendar" },
                      { label: "IPO Calculator", href: "/ipo-calculator" },
                      { label: "IPO Knowledge", href: "/ipo-knowledge" },
                      { label: "Our Services", href: "/services" },
                      { label: "Reports", href: "/reports" },
                    ].map((link) => (
                      <Link key={link.label} to={link.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1">
                        <ArrowRight className="h-3 w-3" />
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-8 text-center">
                Frequently Asked <span className="text-primary">Questions</span>
              </h2>
              <div className="space-y-4">
                {(isSME ? [
                  { q: "What is the minimum turnover required for SME IPO?", a: "Companies with a minimum post-issue paid-up capital of up to ₹25 crores can list on the SME platform. The minimum application size is typically ₹1,00,000 (1 lakh) for SME IPOs." },
                  { q: "How much does an SME merchant banker charge?", a: "Fees typically range from 3-6% of the issue size, plus out-of-pocket expenses. The exact fee depends on the issue size, complexity, and the banker's reputation." },
                  { q: "How long does the SME IPO process take?", a: "The entire process from appointment of merchant banker to listing typically takes 4-6 months, depending on SEBI/exchange observations and market conditions." },
                  { q: "What is the role of Market Maker in SME IPO?", a: "Market makers are mandatory for SME IPOs. They provide liquidity by continuously quoting buy and sell prices for the stock post-listing, typically for 3 years." },
                ] : [
                  { q: "What is a BRLM in Mainboard IPO?", a: "BRLM stands for Book Running Lead Manager — the primary merchant banker who manages the entire IPO process including due diligence, pricing, marketing, and compliance with SEBI regulations." },
                  { q: "Can a company have multiple BRLMs?", a: "Yes, large mainboard IPOs often have 2-5 BRLMs who divide responsibilities like institutional marketing, retail distribution, compliance, and post-listing activities." },
                  { q: "What is the minimum issue size for Mainboard IPO?", a: "The minimum post-issue paid-up capital should exceed ₹10 crores, and the issue size is typically ₹25 crores or more." },
                  { q: "How are mainboard IPOs priced?", a: "Mainboard IPOs use the book building process where a price band is set. Institutional investors bid within this range, and the final price is determined based on demand." },
                ]).map((faq, i) => (
                  <div key={i} className="bg-card rounded-xl border border-border p-5">
                    <h3 className="font-semibold text-foreground mb-2 flex items-start gap-2">
                      <span className="text-primary font-bold">Q.</span>
                      {faq.q}
                    </h3>
                    <p className="text-sm text-muted-foreground pl-6">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-primary-foreground mb-4">
              Need Help Choosing the Right Merchant Banker?
            </h2>
            <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8">
              Our IPO consultancy team can connect you with the best SEBI-registered merchant bankers suited for your company's IPO journey.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold" asChild>
                <Link to="/ipo-feasibility">Check IPO Feasibility <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/contact">Contact Our Experts</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export const SMEMerchantBankers = () => <MerchantBankersPage type="sme" />;
export const MainboardMerchantBankers = () => <MerchantBankersPage type="mainboard" />;

const MerchantBankersRoute = () => {
  const { category } = useParams<{ category: string }>();
  return <MerchantBankersPage type={(category as "sme" | "mainboard") || "sme"} />;
};
export default MerchantBankersRoute;
