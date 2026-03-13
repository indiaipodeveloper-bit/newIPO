import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";

import vol9 from "@/assets/magazine-vol9.jpg";
import vol8 from "@/assets/magazine-vol8.jpg";
import vol7 from "@/assets/magazine-vol7.jpg";
import vol6 from "@/assets/magazine-vol6.jpg";

const magazines = [
  { title: "IPO World - Volume 9", date: "February 6, 2026", slug: "vol-9", cover: vol9 },
  { title: "IPO World - Volume 8", date: "January 9, 2026", slug: "vol-8", cover: vol8 },
  { title: "IPO World - Volume 7", date: "December 11, 2025", slug: "vol-7", cover: vol7 },
  { title: "IPO World - Volume 6", date: "November 13, 2025", slug: "vol-6", cover: vol6 },
  { title: "IPO World - Volume 5", date: "October 9, 2025", slug: "vol-5", cover: vol9 },
  { title: "IPO World - Volume 4", date: "September 11, 2025", slug: "vol-4", cover: vol8 },
];

const IPOWorldSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section id="magazine-section" className="py-24 bg-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
            <BookOpen className="h-3.5 w-3.5" />
            IPO World Monthly Editions
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-foreground">
            A Complete 360° View Of IPOs & <span className="text-primary">Capital Markets</span>
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-8 h-1 rounded-full bg-primary" />
            <div className="w-8 h-1 rounded-full bg-primary/40" />
          </div>
        </div>

        {/* Scrollable carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-2 md:-left-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background border border-border shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute -right-2 md:-right-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background border border-border shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {magazines.map((mag, idx) => (
              <motion.div
                key={mag.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-[280px] sm:w-[300px] snap-start bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-shadow group"
              >
                {/* Magazine Cover */}
                <div className="relative h-[380px] overflow-hidden">
                  <img
                    src={mag.cover}
                    alt={mag.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-[10px] font-bold px-3 py-1 rounded-md shadow-md">
                    Premium
                  </span>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h4 className="font-bold font-heading text-foreground text-base mb-2">{mag.title}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                    <Calendar className="h-3.5 w-3.5" />
                    {mag.date}
                  </div>
                  <Button className="w-full bg-brand-green text-primary-foreground hover:bg-brand-green/90 font-semibold text-sm rounded-xl" asChild>
                    <Link to="/#newsletter-section" onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('newsletter-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}>
                      Read Magazine
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IPOWorldSection;
