import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight, Bell, Zap } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import newsletterBg from "@/assets/newsletter-bg.jpg";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        toast.success("Thank you for subscribing!");
        setEmail("");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to subscribe");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
      console.error(err);
    }
  };

  return (
    <section id="newsletter-section" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <img src={newsletterBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/90" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-6">
              <Mail className="h-8 w-8 text-accent" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary-foreground mb-4 leading-tight">
              Never Miss an <span className="text-accent">IPO Update</span>
            </h2>
            <p className="text-primary-foreground/70 mb-6 text-base max-w-lg">
              Get the latest IPO news, GMP updates, and market analysis delivered straight to your inbox. Join 25,000+ investors already subscribed.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-primary-foreground/60">
              <span className="flex items-center gap-1.5"><Bell className="h-4 w-4 text-accent" /> Daily GMP Updates</span>
              <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-accent" /> IPO Alerts</span>
              <span className="flex items-center gap-1.5"><Mail className="h-4 w-4 text-accent" /> Weekly Digest</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/15 rounded-2xl p-8">
              <h3 className="text-xl font-bold font-heading text-primary-foreground mb-2">Subscribe Now</h3>
              <p className="text-sm text-primary-foreground/60 mb-6">Free forever. Unsubscribe anytime.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 h-12 rounded-xl text-base"
                />
                <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold rounded-xl text-base gold-glow">
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
              <p className="text-[11px] text-primary-foreground/40 mt-4 text-center">
                Join 25,000+ investors. No spam, ever.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
