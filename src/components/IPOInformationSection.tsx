import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileEdit, ChevronRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const blogs = [
  "SME IPO in India: Complete Guide to SME IPO for Growing Bus…",
  "Fixed Price vs Book Building IPO – Which One is Right for You",
  "Pre-IPO Planning: Why It's Crucial for a Successful Listing",
  "10 Steps to Prepare Your Business for an IPO in India",
  "How to Raise Working Capital through SME IPO",
  "Can a Startup Go for an IPO? Here's What You Need to Know",
  "IPO for Manufacturing Companies – A Step-by-Step Guide",
  "QIB Route for IPO Listing: Meaning of SEBI ICDR Regulations",
];

const ipoBlogs = [
  "Srinibas Pradhan Constructions IPO",
  "Acetech E-Commerce IPO",
  "Striders Impex IPO",
  "Yaap Digital IPO",
  "Manilam Industries IPO",
  "Mobilise App Lab IPO",
  "Yashhtej Industries (India) IPO",
  "Elfin Agro India IPO",
];

const IPOInformationSection = () => {
  return (
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
            <TrendingUp className="h-3.5 w-3.5" />
            Market Insights
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground">
            IPO <span className="text-primary">Information</span>
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-8 h-1 rounded-full bg-primary" />
            <div className="w-8 h-1 rounded-full bg-primary/40" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-primary mb-5">Blogs</h3>
            <div className="space-y-3">
              {blogs.map((blog) => (
                <Link
                  key={blog}
                  to="/blog"
                  className="flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors group"
                >
                  <FileEdit className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" />
                  <span className="line-clamp-1">{blog}</span>
                </Link>
              ))}
            </div>
            <Button className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" asChild>
              <Link to="/blog">
                Read More Blogs
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-primary mb-5">IPO Blogs</h3>
            <div className="space-y-3">
              {ipoBlogs.map((blog) => (
                <Link
                  key={blog}
                  to="/blog"
                  className="flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors group"
                >
                  <ChevronRight className="h-4 w-4 text-accent group-hover:text-primary shrink-0" />
                  <span>{blog}</span>
                </Link>
              ))}
            </div>
            <Button className="mt-6 bg-foreground text-background hover:bg-foreground/90 font-semibold" asChild>
              <Link to="/blog">
                Read More IPO Blogs
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default IPOInformationSection;
