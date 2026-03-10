import { testimonials } from "@/data/mockData";
import { Quote, Star } from "lucide-react";
import { motion } from "framer-motion";
import testimonialBg from "@/assets/testimonial-bg.jpg";

const TestimonialsSection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <img src={testimonialBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/90" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-accent/20 text-accent border border-accent/30 mb-6">
            <Star className="h-3.5 w-3.5" />
            Client Stories
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-background mb-4">
            What Our <span className="text-accent">Clients Say</span>
          </h2>
          <p className="text-background/60 max-w-xl mx-auto">
            Hear from the companies that trusted us with their IPO journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="bg-background/10 backdrop-blur-sm border border-background/10 rounded-2xl p-8 hover:bg-background/15 transition-all group"
            >
              <Quote className="h-10 w-10 text-accent/50 mb-5" />
              <p className="text-background/80 leading-relaxed mb-8 text-base italic">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-lg font-heading">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-background font-heading">{t.name}</div>
                  <div className="text-xs text-background/50">{t.role}, {t.company}</div>
                </div>
              </div>
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-accent fill-accent" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
