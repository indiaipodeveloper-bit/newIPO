import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Shield, Users, Target, Award, TrendingUp, Building2, CheckCircle2,
  ArrowRight, Star, Globe, BookOpen, Scale, Briefcase, Heart,
  Eye, Lightbulb, Handshake, BarChart3, Clock, MapPin, Phone, Mail
} from "lucide-react";
import aboutTeam from "@/assets/about-team.jpg";
import aboutOffice from "@/assets/about-office.jpg";
import aboutLeadership from "@/assets/about-leadership.jpg";
import aboutVision from "@/assets/about-vision.jpg";
import logo from "@/assets/logo.png";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const stats = [
  { value: "450+", label: "Successful IPOs", icon: TrendingUp },
  { value: "₹85,000 Cr", label: "Funds Raised", icon: BarChart3 },
  { value: "98%", label: "Success Rate", icon: Target },
  { value: "15+", label: "Years Experience", icon: Clock },
  { value: "50+", label: "Expert Team", icon: Users },
  { value: "Pan India", label: "Presence", icon: MapPin },
];

const values = [
  { icon: Shield, title: "Integrity", desc: "We uphold the highest ethical standards in every transaction and interaction. Our commitment to transparency builds lasting trust with our clients." },
  { icon: Target, title: "Excellence", desc: "We strive for perfection in every IPO we manage. Our meticulous approach ensures maximum value for companies going public." },
  { icon: Handshake, title: "Partnership", desc: "We don't just advise — we become an extension of your team. Your success is our success, and we're committed for the long haul." },
  { icon: Lightbulb, title: "Innovation", desc: "We continuously evolve our strategies and adopt cutting-edge technologies to give our clients a competitive edge in the capital markets." },
  { icon: Heart, title: "Client First", desc: "Every decision we make is guided by what's best for our clients. We personalize our approach to each company's unique needs and goals." },
  { icon: Globe, title: "Impact", desc: "We believe in creating lasting economic impact. Every company we help go public creates jobs, drives innovation, and grows the economy." },
];

const timeline = [
  { year: "2010", title: "Founded", desc: "IndiaIPO was established with a vision to democratize access to capital markets for Indian businesses." },
  { year: "2013", title: "100th IPO", desc: "Reached the milestone of 100 successful IPO listings, establishing ourselves as a trusted market leader." },
  { year: "2016", title: "SME Focus", desc: "Launched dedicated SME IPO division, helping small and medium enterprises access the capital markets." },
  { year: "2018", title: "₹25,000 Cr Raised", desc: "Crossed ₹25,000 crores in aggregate funds raised for our clients across sectors." },
  { year: "2020", title: "Digital Transformation", desc: "Launched digital advisory platform, making IPO consultancy accessible pan-India." },
  { year: "2022", title: "300+ IPOs", desc: "Crossed 300 successful IPO listings with a 98% success rate — industry-leading performance." },
  { year: "2024", title: "International Expansion", desc: "Expanded advisory services to include cross-border listings and international investor roadshows." },
  { year: "2026", title: "450+ IPOs & Growing", desc: "Today, IndiaIPO stands as India's most trusted IPO consultancy with ₹85,000 Cr+ funds raised." },
];

const team = [
  { name: "Rajesh Sharma", role: "Founder & CEO", desc: "25+ years in investment banking and capital markets. Former VP at leading merchant bank." },
  { name: "Priya Mehta", role: "Head of IPO Advisory", desc: "CA with 18 years experience in IPO structuring. Managed 200+ successful IPO listings." },
  { name: "Vikram Singh", role: "Chief Legal Officer", desc: "Corporate law expert with specialization in SEBI regulations and ICDR compliance." },
  { name: "Anita Desai", role: "Director, SME Division", desc: "Pioneer in SME IPO consultancy. Helped 150+ SMEs access the capital markets." },
];

const services = [
  "Initial Public Offering (IPO) Advisory",
  "SME IPO Consultation",
  "Mainline IPO Consultation",
  "Follow-On Public Offer (FPO)",
  "Pre-IPO Funding",
  "Business Valuation",
  "DRHP Preparation & Filing",
  "SEBI Compliance & Regulatory",
  "Investor Relations",
  "Corporate Finance Advisory",
  "Financial Modelling",
  "Post-Listing Support",
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="About IndiaIPO - India's Premier IPO Consultancy"
        description="Learn about IndiaIPO — India's premier IPO consultancy with 450+ successful listings and ₹85,000 Cr funds raised. SEBI registered, trusted by hundreds of companies."
        keywords="IndiaIPO, about, IPO consultancy, SEBI registered, merchant banker"
      />
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img src={aboutOffice} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/85 to-purple-900/80" />
          </div>
          <div className="relative container mx-auto px-4 py-20 md:py-28">
            <div className="max-w-3xl">
              <motion.div {...fadeUp}>
                <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6 backdrop-blur-sm border border-white/20">
                  Since 2010 • SEBI Registered
                </span>
              </motion.div>
              <motion.h1 {...fadeUp} transition={{ delay: 0.1 }} className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                India's Most Trusted
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">
                  IPO Consultancy
                </span>
              </motion.h1>
              <motion.p {...fadeUp} transition={{ delay: 0.2 }} className="text-lg text-white/70 mb-8 max-w-2xl leading-relaxed">
                At IndiaIPO, we hand-hold Founders, Businessmen, Entrepreneurs, MSMEs and startups through the complete IPO journey — from capital planning and DRHP to listing and life after IPO. Our team blends on-ground founder experience, market research and regulatory expertise.
              </motion.p>
              <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-white/90 font-bold rounded-full px-8">
                  <Link to="/contact">Check IPO Feasibility <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8">
                  <Link to="/services">Our Services</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-center text-white"
                  >
                    <Icon className="h-5 w-5 mx-auto mb-2 text-white/60" />
                    <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                    <div className="text-xs text-white/60 mt-1">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div {...fadeUp}>
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Story</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                  Building India's Capital Market Ecosystem
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Founded in 2010, IndiaIPO has grown to become one of India's most trusted IPO consultancy platforms. We have helped over 450 companies navigate the complex process of going public, raising more than ₹85,000 crores in aggregate across Mainboard and SME segments.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our team comprises experienced merchant bankers, chartered accountants, company secretaries, legal experts, and capital market professionals who bring decades of combined experience. We are SEBI-registered and follow the highest standards of corporate governance.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  What sets us apart is our end-to-end approach — from initial feasibility assessment to post-listing support. We don't just help companies list; we help them thrive in the public market. Our deep understanding of SEBI regulations, ICDR requirements, and market dynamics ensures a smooth and successful IPO journey.
                </p>
                <div className="flex flex-wrap gap-3">
                  {["SEBI Registered", "450+ IPOs", "Pan India", "End-to-End Advisory"].map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" /> {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
              <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="relative">
                <img src={aboutTeam} alt="IndiaIPO Team" className="rounded-2xl shadow-2xl w-full" />
                <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground rounded-xl p-5 shadow-xl hidden md:block">
                  <div className="text-3xl font-bold">15+</div>
                  <div className="text-sm text-primary-foreground/70">Years of Excellence</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section id="vision" className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="order-2 lg:order-1">
                <img src={aboutVision} alt="Our Vision" className="rounded-2xl shadow-2xl w-full" />
              </motion.div>
              <motion.div {...fadeUp} className="order-1 lg:order-2">
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Eye className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Our Vision</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    To be the most trusted and comprehensive IPO consultancy platform in India, empowering every deserving company — from startups to large enterprises — to access the capital markets with confidence. We envision a future where going public is not a privilege of the few, but an opportunity for all businesses that meet the criteria.
                  </p>
                </div>
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Target className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    To provide end-to-end IPO advisory services with complete transparency, regulatory compliance, and client-first approach. We aim to simplify the complex IPO process, reduce time-to-listing, and maximize value for our clients through expert guidance at every stage — from DRHP filing to listing day and beyond.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Star className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Our Promise</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    We promise to be your trusted partner throughout the IPO journey. From the first consultation to the listing bell ceremony, we're with you at every step. Our 98% success rate is a testament to our commitment to excellence and client satisfaction.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div {...fadeUp} className="text-center mb-12">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">What Drives Us</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">Our Core Values</h2>
              <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
                These principles guide every decision we make and every IPO we manage.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((v, idx) => {
                const Icon = v.icon;
                return (
                  <motion.div
                    key={v.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{v.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Journey Timeline */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-blue-900 to-blue-950">
          <div className="container mx-auto px-4">
            <motion.div {...fadeUp} className="text-center mb-16">
              <span className="text-sm font-semibold text-blue-300 uppercase tracking-wider">Our Journey</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Milestones That Define Us</h2>
            </motion.div>
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-blue-500/30 transform md:-translate-x-px" />
              {timeline.map((item, idx) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`relative flex items-start gap-6 mb-10 ${
                    idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${idx % 2 === 0 ? "md:text-right" : "md:text-left"} hidden md:block`}>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                      <div className="text-2xl font-bold text-blue-300 mb-1">{item.year}</div>
                      <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                      <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <div className="relative z-10 w-4 h-4 rounded-full bg-blue-400 border-4 border-blue-900 shrink-0 mt-6 md:mt-8" />
                  <div className="flex-1 md:hidden">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                      <div className="text-xl font-bold text-blue-300 mb-1">{item.year}</div>
                      <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-white/60">{item.desc}</p>
                    </div>
                  </div>
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section id="team" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div {...fadeUp} className="text-center mb-12">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Meet Our Leaders</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">Leadership Team</h2>
              <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
                Experienced professionals with decades of combined expertise in capital markets, investment banking, and regulatory compliance.
              </p>
            </motion.div>
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
                <img src={aboutLeadership} alt="Leadership Team" className="rounded-2xl shadow-xl w-full h-64 object-cover" />
              </motion.div>
              <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="flex flex-col justify-center">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our leadership team brings together the best minds in investment banking, corporate law, chartered accountancy, and capital markets. With over 100 years of combined experience, they have guided hundreds of companies through successful IPO listings.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Each member of our leadership team is deeply committed to client success and brings unique expertise to the table. From navigating SEBI regulations to structuring complex deals, our leaders ensure every IPO is executed to perfection.
                </p>
              </motion.div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, idx) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg hover:border-primary/30 transition-all"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <h4 className="font-bold text-foreground text-lg">{member.name}</h4>
                  <p className="text-sm text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{member.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div {...fadeUp}>
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">What We Offer</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                  Comprehensive IPO Services
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  We offer a full spectrum of IPO advisory services, covering every aspect of the going-public process. Our integrated approach ensures nothing falls through the cracks.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map((s) => (
                    <div key={s} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
                <Button asChild className="mt-8 bg-primary text-primary-foreground font-semibold rounded-full px-8">
                  <Link to="/services">Explore All Services <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </motion.div>
              <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="grid grid-cols-2 gap-4">
                {[
                  { icon: Building2, label: "IPO Advisory", count: "450+" },
                  { icon: Scale, label: "SEBI Compliance", count: "100%" },
                  { icon: Briefcase, label: "Pre-IPO", count: "200+" },
                  { icon: BookOpen, label: "DRHP Filed", count: "500+" },
                ].map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <motion.div
                      key={card.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-all"
                    >
                      <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                      <div className="text-2xl font-bold text-foreground">{card.count}</div>
                      <div className="text-xs text-muted-foreground mt-1">{card.label}</div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div {...fadeUp} className="text-center mb-12">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Why IndiaIPO</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">Why Companies Choose Us</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { title: "SEBI Registered & Compliant", desc: "Fully registered with SEBI and compliant with all ICDR regulations. We ensure your IPO meets every regulatory requirement." },
                { title: "End-to-End Support", desc: "From initial feasibility assessment to listing day celebrations and post-listing support — we're with you at every step." },
                { title: "Sector Expertise", desc: "Deep experience across IT, Manufacturing, FMCG, Pharma, Finance, Real Estate, and 20+ other sectors." },
                { title: "Fastest Time-to-Market", desc: "Our streamlined processes and regulatory expertise ensure the fastest possible time from DRHP filing to listing." },
                { title: "Strong Network", desc: "Extensive network of institutional investors, HNIs, anchor investors, and market makers across India." },
                { title: "Post-Listing Support", desc: "Our relationship doesn't end at listing. We provide ongoing support for investor relations, compliance, and growth." },
              ].map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center mb-4 text-lg font-bold">
                    {idx + 1}
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700" />
          <div className="absolute inset-0 opacity-10">
            <img src={aboutOffice} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative container mx-auto px-4 text-center">
            <motion.div {...fadeUp}>
              <img src={logo} alt="IndiaIPO" className="h-16 w-auto mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Take Your Company Public?
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
                Get a free IPO feasibility assessment from India's most trusted IPO consultancy. Our experts will evaluate your company and guide you through every step.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-white/90 font-bold rounded-full px-8 shadow-xl">
                  <Link to="/contact">
                    Check IPO Feasibility <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8">
                  <Link to="/services">View Services</Link>
                </Button>
              </div>
              <div className="flex justify-center gap-8 mt-10">
                <a href="tel:+919876543210" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm">
                  <Phone className="h-4 w-4" /> +91 98765 43210
                </a>
                <a href="mailto:info@indiaipo.com" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm">
                  <Mail className="h-4 w-4" /> info@indiaipo.com
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
