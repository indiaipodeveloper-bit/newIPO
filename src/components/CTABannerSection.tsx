import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const CTABannerSection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/75" />
      </div>
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-background italic mb-4">
          Take Your First Step To Your IPO Success
        </h2>
        <p className="text-background/70 max-w-2xl mx-auto mb-8 text-lg">
          Your path to success at IPO begins with one step. Get in touch with our experts today for a free consultation and embark on a well-planned journey towards listing in the public market.
        </p>
        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base px-8 rounded-lg" asChild>
          <Link to="/contact">
            Contact Now
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default CTABannerSection;
