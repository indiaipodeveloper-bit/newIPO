import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Send, Upload, CheckCircle2, Briefcase, User, Mail, Phone, GraduationCap, FileText, ArrowRight } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { toast } from "sonner";

const Careers = () => {
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    email: "",
    phone: "",
    position_applied: "",
    experience: "",
    resume: "",
    coverletter: ""
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("folder", "career");

    setUploading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData
      });
      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ ...prev, resume: data.url }));
        toast.success("Resume uploaded successfully");
      } else {
        toast.error("Failed to upload resume");
      }
    } catch (err) {
      toast.error("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.resume) {
      toast.error("Please upload your resume");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success("Application submitted successfully!");
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        toast.error("Failed to submit application");
      }
    } catch (err) {
      toast.error("Error submitting application");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-grow flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center space-y-6 p-10 bg-card border border-border rounded-3xl shadow-xl"
                >
                    <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h2 className="text-3xl font-bold font-heading">Application Submitted!</h2>
                    <p className="text-muted-foreground">
                        Thank you for your interest in joining India IPO. Our HR team will review your application and get back to you soon.
                    </p>
                    <Button 
                        onClick={() => setSubmitted(false)}
                        className="bg-primary hover:bg-primary/90 rounded-full px-8"
                    >
                        Return to Careers
                    </Button>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead 
        title="Careers | Join Our Team at India IPO" 
        description="Launch your career with India's leading business services platform. Apply today to join our team of experts."
      />
      <Header />

      <main className="flex-grow">
        {/* Animated Banner */}
        <section className="relative py-24 bg-primary overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
                <motion.span 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-block px-4 py-1.5 bg-accent/20 text-accent rounded-full text-xs font-bold uppercase tracking-wider mb-6"
                >
                    We're Hiring
                </motion.span>
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-extrabold text-white mb-6 font-heading leading-tight"
                >
                    Elevate Your Career with <span className="text-accent underline decoration-white/20 underline-offset-8">India IPO</span>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-white/70 leading-relaxed mb-0"
                >
                    Be part of a dynamic team that's reshaping the future of capital markets in India. We value expertise, innovation, and passion.
                </motion.p>
            </div>
          </div>
          
          {/* Decorative shapes */}
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute top-24 -left-12 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl" />
        </section>

        {/* Form Section */}
        <section className="py-20 container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left side info */}
            <div className="lg:col-span-4 space-y-10">
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold font-heading text-foreground">Why join us?</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Join a collaborative environment where your ideas matter. We offer competitive growth opportunities, a premium work culture, and the chance to work with industry leaders.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {[
                        { icon: CheckCircle2, title: "Professional Growth", desc: "Structured mentoring and career paths." },
                        { icon: CheckCircle2, title: "Dynamic Environment", desc: "Fast-paced and innovation-driven culture." },
                        { icon: CheckCircle2, title: "Impactful Work", desc: "Shape India's economic future." }
                    ].map((item, idx) => (
                        <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-secondary/50 border border-border hover:border-primary/20 transition-all">
                            <div className="h-10 w-10 shrink-0 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                <item.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground text-sm">{item.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-8 bg-primary rounded-3xl text-white">
                    <h4 className="font-bold text-xl mb-4">Have Questions?</h4>
                    <p className="text-white/70 text-sm mb-6">Our HR team is here to help you throughout the application process.</p>
                    <a href="mailto:hr@indiaipo.in" className="flex items-center gap-2 text-accent font-bold hover:underline">
                        hr@indiaipo.in
                        <ArrowRight className="h-4 w-4" />
                    </a>
                </div>
            </div>

            {/* Application Form */}
            <div className="lg:col-span-8">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-[2.5rem] shadow-2xl p-8 md:p-12 relative overflow-hidden"
              >
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" />
                
                <div className="mb-10">
                    <h3 className="text-3xl font-bold font-heading text-foreground mb-2">Submit Your Application</h3>
                    <p className="text-muted-foreground">Complete the form below and attach your resume.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <User className="h-3 w-3" /> First Name *
                      </label>
                      <input 
                        required
                        type="text" 
                        placeholder="John"
                        className="w-full bg-secondary/30 border border-border hover:border-primary/30 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <User className="h-3 w-3" /> Last Name
                      </label>
                      <input 
                        type="text" 
                        placeholder="Doe"
                        className="w-full bg-secondary/30 border border-border hover:border-primary/30 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                        value={formData.last_name}
                        onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <Mail className="h-3 w-3" /> Email Address *
                      </label>
                      <input 
                        required
                        type="email" 
                        placeholder="john.doe@example.com"
                        className="w-full bg-secondary/30 border border-border hover:border-primary/30 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <Phone className="h-3 w-3" /> Phone Number
                      </label>
                      <input 
                        type="tel" 
                        placeholder="+91 98765 43210"
                        className="w-full bg-secondary/30 border border-border hover:border-primary/30 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <Briefcase className="h-3 w-3" /> Position Applied For
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. Sales Executive"
                        className="w-full bg-secondary/30 border border-border hover:border-primary/30 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                        value={formData.position_applied}
                        onChange={(e) => setFormData({...formData, position_applied: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <GraduationCap className="h-3 w-3" /> Experience (in years)
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. 5+ Years"
                        className="w-full bg-secondary/30 border border-border hover:border-primary/30 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                        value={formData.experience}
                        onChange={(e) => setFormData({...formData, experience: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      <FileText className="h-3 w-3" /> Resume / CV (PDF Only) *
                    </label>
                    <div className="relative group/upload">
                        <input 
                            type="file" 
                            accept=".pdf" 
                            id="resume" 
                            className="hidden" 
                            onChange={handleFileUpload}
                        />
                        <label 
                            htmlFor="resume"
                            className={`flex flex-col items-center justify-center w-full min-h-[120px] border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                                formData.resume 
                                ? 'bg-green-500/5 border-green-500/30 text-green-700' 
                                : 'bg-secondary/20 border-border hover:border-primary/40 hover:bg-secondary/40 text-muted-foreground'
                            }`}
                        >
                            {uploading ? (
                                <div className="flex flex-col items-center gap-2">
                                    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                    <span className="text-xs font-bold">Uploading Resume...</span>
                                </div>
                            ) : formData.resume ? (
                                <div className="flex flex-col items-center gap-2">
                                    <CheckCircle2 className="h-8 w-8" />
                                    <span className="text-xs font-bold">Resume Uploaded Successfully</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <Upload className="h-8 w-8 opacity-40 group-hover/upload:opacity-100 group-hover/upload:text-primary transition-all" />
                                    <span className="text-xs font-bold uppercase tracking-tighter">Click to select or drag PDF file here</span>
                                </div>
                            )}
                        </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      <FileText className="h-3 w-3" /> Cover Letter / Why Join Us?
                    </label>
                    <textarea 
                      rows={5}
                      placeholder="Share your story and career goals..."
                      className="w-full bg-secondary/30 border border-border hover:border-primary/30 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none placeholder:text-muted-foreground/50"
                      value={formData.coverletter}
                      onChange={(e) => setFormData({...formData, coverletter: e.target.value})}
                    />
                  </div>

                  <div className="pt-6">
                    <Button 
                      type="submit" 
                      disabled={submitting || uploading}
                      className="w-full bg-primary text-white hover:bg-primary/95 py-8 rounded-2xl text-xl font-extrabold shadow-xl shadow-primary/30 hover:shadow-primary/40 active:scale-[0.98] transition-all"
                    >
                      {submitting ? "Processing Application..." : (
                        <>
                          Send My Application
                          <Send className="ml-3 h-5 w-5" />
                        </>
                      )}
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground/60 mt-6 uppercase tracking-[0.2em]">
                      By submitting, you agree to our recruitment policy
                    </p>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Careers;
