import { Building2, TrendingUp, BarChart3, Wallet, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import servicesImg from "@/assets/services-ipo.jpg";

const serviceCards = [
  {
    title: "SME IPO",
    description: "End-to-end advisory for SME Initial Public Offerings on BSE SME and NSE Emerge platforms.",
    icon: Building2,
    color: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
  },
  {
    title: "Mainline IPO",
    description: "Comprehensive consultancy for mainboard IPO listings with SEBI compliance and investor roadshows.",
    icon: TrendingUp,
    color: "bg-brand-green/10 text-brand-green group-hover:bg-brand-green group-hover:text-primary-foreground",
  },
  {
    title: "FPO Advisory",
    description: "Follow-on Public Offering strategy, documentation, and execution for listed companies.",
    icon: BarChart3,
    color: "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground",
  },
  {
    title: "Pre-IPO Funding",
    description: "Connect with institutional investors and HNIs for pre-IPO capital raising and valuation.",
    icon: Wallet,
    color: "bg-brand-red/10 text-brand-red group-hover:bg-brand-red group-hover:text-primary-foreground",
  },
];

const ServicesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Services Cards */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20 mb-6">
                What We Offer
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-foreground mb-4 leading-tight">
                Comprehensive <span className="text-primary">IPO Services</span>
              </h2>
              <p className="text-muted-foreground mb-10 text-base max-w-lg">
                From feasibility to listing day — we provide complete IPO advisory services tailored to your business needs.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {serviceCards.map((service, idx) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    to="/services"
                    className="group block bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 h-full"
                  >
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 ${service.color}`}>
                      <service.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-bold font-heading text-foreground mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{service.description}</p>
                    <span className="inline-flex items-center text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">
                      Learn More <ArrowRight className="ml-1 h-4 w-4" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Image + CTA */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative hidden lg:block"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img src={servicesImg} alt="IPO Trading Floor" className="w-full h-[560px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent rounded-2xl" />
            </div>
            <div className="absolute bottom-8 left-8 right-8">
              <h3 className="text-2xl font-bold font-heading text-background mb-3">Ready to Go Public?</h3>
              <p className="text-background/80 text-sm mb-5">Get a free IPO feasibility assessment from our experts today.</p>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold rounded-xl gold-glow" asChild>
                <Link to="/ipo-feasibility">
                  Check Feasibility Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            {/* Decorative */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-4 border-b-4 border-primary rounded-br-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
