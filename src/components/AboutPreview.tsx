import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Award, Users, Target } from "lucide-react";
import { motion } from "framer-motion";
import aboutPreview from "@/assets/about-preview.jpg";

const AboutPreview = () => {
  return (
    <section className="py-24 bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img src={aboutPreview} alt="IndiaIPO Team discussing IPO strategy" className="w-full h-[480px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
            </div>
            {/* Floating Stats Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute -bottom-8 -right-4 lg:-right-8 bg-card border border-border rounded-2xl p-6 shadow-xl"
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "15+", label: "Years" },
                  { value: "450+", label: "IPOs" },
                  { value: "₹85K Cr", label: "Raised" },
                  { value: "98%", label: "Success" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-xl font-bold font-heading text-accent">{stat.value}</div>
                    <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            {/* Accent decoration */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-l-4 border-t-4 border-accent rounded-tl-3xl" />
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-6">
              <Award className="h-3.5 w-3.5" />
              SEBI Registered • Since 2010
            </span> */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-foreground mb-6 leading-tight">
              Why Companies Choose <span className="text-primary">IndiaIPO</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4 text-base">
              IndiaIPO is a premier IPO consultancy firm helping companies navigate the complex process of going public. With a track record of <strong className="text-foreground">450+ successful IPO listings</strong>, we bring deep expertise in SEBI regulations, investor relations, and capital market strategy.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8 text-base">
              Our team of experienced merchant bankers, legal experts, and financial advisors work closely with promoters to ensure a <strong className="text-foreground">seamless IPO journey</strong> — from feasibility assessment to listing day and beyond.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: Shield, label: "SEBI Compliant" },
                { icon: Users, label: "Expert Team" },
                { icon: Target, label: "End-to-End Advisory" },
                { icon: Award, label: "Proven Track Record" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3">
                  <item.icon className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                </div>
              ))}
            </div>

            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base px-8 rounded-xl group" asChild>
              <Link to="/about">
                Explore Our Journey
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
