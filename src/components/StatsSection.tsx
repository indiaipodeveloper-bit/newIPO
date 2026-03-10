import { stats } from "@/data/mockData";
import { useEffect, useState, useRef } from "react";
import statsBg from "@/assets/stats-bg.jpg";

const useCountUp = (target: number, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          animate();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
};

const formatNumber = (num: number) => {
  if (num >= 10000) return (num / 1000).toFixed(0) + "K";
  return num.toLocaleString("en-IN");
};

const StatsSection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0">
        <img src={statsBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/85" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary-foreground mb-3">
            Our Impact in <span className="text-accent">Numbers</span>
          </h2>
          <p className="text-primary-foreground/70 max-w-lg mx-auto">
            Trusted by hundreds of companies across India for their IPO journey
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const { count, ref } = useCountUp(stat.value);
            return (
              <div key={stat.label} ref={ref} className="text-center bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 border border-primary-foreground/10">
                <div className="text-4xl md:text-5xl font-bold font-heading text-accent mb-2">
                  {stat.prefix || ""}{formatNumber(count)}{stat.suffix}
                </div>
                <div className="text-sm text-primary-foreground/80 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
