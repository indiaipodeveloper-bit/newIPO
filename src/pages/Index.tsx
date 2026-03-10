import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import AboutPreview from "@/components/AboutPreview";
import ServicesSection from "@/components/ServicesSection";
import StatsSection from "@/components/StatsSection";
import IPOCalendarPreview from "@/components/IPOCalendarPreview";
import TestimonialsSection from "@/components/TestimonialsSection";
import NewsletterSection from "@/components/NewsletterSection";
import GMPSection from "@/components/GMPSection";
import IPOWorldSection from "@/components/IPOWorldSection";
import IPOInformationSection from "@/components/IPOInformationSection";
import IPOVideoSection from "@/components/IPOVideoSection";
import CTABannerSection from "@/components/CTABannerSection";

import SEOHead from "@/components/SEOHead";
import { blogPosts } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";

const blogImages: Record<string, string> = {
  "blog-1": blog1,
  "blog-2": blog2,
  "blog-3": blog3,
};

const BlogPreview = () => (
  <section className="py-24 bg-background">
    <div className="container mx-auto px-4">
      <div className="flex items-end justify-between mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
            <BookOpen className="h-3.5 w-3.5" />
            Expert Insights
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-foreground mb-3">
            Latest from <span className="text-primary">Blog</span>
          </h2>
          <p className="text-muted-foreground max-w-lg">Insights, analysis, and guides from our IPO experts</p>
        </motion.div>
        <Button variant="outline" className="hidden md:inline-flex border-primary/30 text-primary hover:bg-primary/5 rounded-xl font-semibold" asChild>
          <Link to="/blog">
            View All Articles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogPosts.map((post, idx) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300 group cursor-pointer"
          >
            <div className="relative h-52 overflow-hidden">
              <img
                src={blogImages[post.image]}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
              <span className="absolute top-4 left-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-lg">
                {post.category}
              </span>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold font-heading text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{post.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
                </div>
                <span className="text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform inline-flex items-center">
                  Read <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mt-8 text-center md:hidden">
        <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/5 rounded-xl" asChild>
          <Link to="/blog">View All Articles →</Link>
        </Button>
      </div>
    </div>
  </section>
);

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Home"
        description="India's leading IPO consultancy platform. Expert advisory for SME IPO, Mainline IPO, FPO, and Pre-IPO funding."
        keywords="IPO, SME IPO, Mainline IPO, FPO, Pre-IPO, IPO Consultancy India, SEBI, IPO Advisory"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "IndiaIPO",
          "url": "https://indiaipo.in",
          "description": "India's leading IPO consultancy platform",
          "sameAs": [],
          "contactPoint": { "@type": "ContactPoint", "telephone": "+91-98765-43210", "contactType": "customer service" }
        }}
      />
      <Header />
      <main>
        <HeroSection />
        <AboutPreview />
        <ServicesSection />
        <StatsSection />
        <GMPSection />
        <IPOCalendarPreview />
        <IPOWorldSection />
        <IPOInformationSection />
        <TestimonialsSection />
        <BlogPreview />
        <IPOVideoSection />
        <CTABannerSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
