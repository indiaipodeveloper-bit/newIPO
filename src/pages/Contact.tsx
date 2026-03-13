import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Loader2,
  Clock,
  Building2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Shield,
  Users,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

const faqs = [
  {
    q: "What services does IndiaIPO offer?",
    a: "IndiaIPO provides end-to-end IPO advisory services including pre-IPO funding, DRHP preparation, regulatory compliance, merchant banking, and post-listing support for both SME and Mainboard IPOs.",
  },
  {
    q: "How can I apply for an IPO through IndiaIPO?",
    a: "You can apply through our platform by creating an account, linking your ASBA-enabled bank account or UPI ID, and submitting your application for any open IPO. Our team is available to guide you at every step.",
  },
  {
    q: "What is the typical response time for enquiries?",
    a: "We typically respond to all queries within 24 business hours. For urgent matters, you can reach us on our WhatsApp or call our office directly during business hours.",
  },
  {
    q: "Does IndiaIPO assist with SME IPOs?",
    a: "Yes, we have a dedicated SME IPO desk that assists companies in raising capital through NSE Emerge and BSE SME platforms, offering complete end-to-end support.",
  },
  {
    q: "Is IndiaIPO registered with SEBI?",
    a: "IndiaIPO operates in full compliance with SEBI regulations. Our merchant banking partners and intermediaries are all SEBI-registered entities.",
  },
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [banner, setBanner] = useState<any>(null);

  useEffect(() => {
    fetch("/api/banners")
      .then(res => res.json())
      .then(data => {
        const pageBanner = data.find((b: any) => b.page_path === "/contact" && b.is_active);
        if (pageBanner) setBanner(pageBanner);
      })
      .catch(err => console.error("Failed to fetch banner:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || null,
          company: form.company.trim() || null,
          message: form.message.trim(),
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      toast.success("Thank you! We'll get back to you within 24 hours.");
      setForm({ name: "", email: "", phone: "", company: "", message: "" });
    } catch (err: any) {
      toast.error("Failed to submit. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Contact Us | IndiaIPO"
        description="Get in touch with IndiaIPO for IPO consultancy, pre-IPO funding, and capital market advisory. Visit our offices in Delhi and Mumbai."
        keywords="contact IndiaIPO, IPO consultation, IPO advisory contact, IndiaIPO Delhi, IndiaIPO Mumbai"
      />
      <Header />

      <main>
        {/* ── Hero Banner ── */}
        <section
          className="relative py-24 overflow-hidden"
          style={{
            background: banner?.image_url 
              ? `linear-gradient(rgba(10, 25, 47, 0.7), rgba(10, 25, 47, 0.7)), url('${banner.image_url}') center/cover no-repeat`
              : "linear-gradient(135deg, hsl(220 72% 22%) 0%, hsl(220 72% 38%) 55%, hsl(220 72% 45%) 100%)",
          }}
        >
          {/* decorative circles */}
          <div
            className="absolute top-[-80px] right-[-80px] w-[340px] h-[340px] rounded-full opacity-10"
            style={{ background: "hsl(35 95% 52%)" }}
          />
          <div
            className="absolute bottom-[-60px] left-[-60px] w-[260px] h-[260px] rounded-full opacity-10"
            style={{ background: "hsl(35 95% 52%)" }}
          />

          <div className="container mx-auto px-4 text-center relative z-10">
            <span
              className="inline-block px-5 py-1.5 rounded-full text-sm font-semibold mb-5 tracking-widest uppercase"
              style={{
                background: "hsl(35 95% 52% / 0.18)",
                color: "hsl(35 95% 65%)",
                border: "1px solid hsl(35 95% 52% / 0.35)",
              }}
            >
              We're Here to Help
            </span>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 leading-tight"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Get In{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, hsl(35 95% 52%), hsl(45 93% 65%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Touch
              </span>{" "}
              With Us
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
              Whether you're planning your IPO journey or looking for capital market advisory —
              our expert team is just a message away.
            </p>

            {/* quick stats */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { icon: <TrendingUp className="h-5 w-5" />, val: "500+", label: "IPOs Advised" },
                { icon: <Users className="h-5 w-5" />, val: "10,000+", label: "Investors Served" },
                { icon: <Building2 className="h-5 w-5" />, val: "2", label: "Office Locations" },
                { icon: <Shield className="h-5 w-5" />, val: "24hrs", label: "Response Time" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center gap-1 py-4 px-3 rounded-xl"
                  style={{
                    background: "hsl(0 0% 100% / 0.08)",
                    border: "1px solid hsl(0 0% 100% / 0.12)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center mb-1"
                    style={{ background: "hsl(35 95% 52% / 0.25)", color: "hsl(35 95% 65%)" }}
                  >
                    {s.icon}
                  </div>
                  <span className="text-white font-bold text-xl">{s.val}</span>
                  <span className="text-white/60 text-xs text-center">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact Cards ── */}
        <section className="py-14 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <MapPin className="h-6 w-6" />,
                  title: "Corporate Office",
                  lines: ["808, 8th Floor, D-Mall,", "Netaji Subhash Place, Pitampura,", "Delhi – 110034"],
                  accent: true,
                },
                {
                  icon: <Building2 className="h-6 w-6" />,
                  title: "Regional Office",
                  lines: ["Office No. 601,", "Shagun Insignia, Ulwe, Sector-19,", "Navi Mumbai – 410206"],
                  accent: false,
                },
                {
                  icon: <Mail className="h-6 w-6" />,
                  title: "Email Us",
                  lines: ["info@indiaipo.in"],
                  link: "mailto:info@indiaipo.in",
                  accent: false,
                },
                {
                  icon: <Phone className="h-6 w-6" />,
                  title: "Call Us",
                  lines: ["+91-74283-37280", "+91-96509-82781"],
                  link: "tel:+917428337280",
                  accent: false,
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl p-6 flex flex-col gap-3 shadow-md hover:shadow-lg transition-shadow"
                  style={{
                    background: "white",
                    border: card.accent ? "2px solid hsl(35 95% 52%)" : "1px solid hsl(220 15% 90%)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: card.accent
                        ? "hsl(35 95% 52%)"
                        : "hsl(220 72% 45% / 0.1)",
                      color: card.accent ? "white" : "hsl(220 72% 45%)",
                    }}
                  >
                    {card.icon}
                  </div>
                  <h3
                    className="font-bold text-base"
                    style={{ color: "hsl(220 72% 30%)", fontFamily: "Montserrat, sans-serif" }}
                  >
                    {card.title}
                  </h3>
                  <div className="space-y-0.5">
                    {card.lines.map((l) =>
                      card.link ? (
                        <a
                          key={l}
                          href={card.link}
                          className="block text-sm font-medium transition-colors"
                          style={{ color: "hsl(220 72% 45%)" }}
                        >
                          {l}
                        </a>
                      ) : (
                        <p key={l} className="text-sm text-muted-foreground leading-relaxed">
                          {l}
                        </p>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Business hours */}
            <div
              className="mt-6 rounded-2xl p-5 flex flex-wrap items-center gap-4"
              style={{
                background: "linear-gradient(135deg, hsl(220 72% 45% / 0.07), hsl(35 95% 52% / 0.05))",
                border: "1px solid hsl(220 72% 45% / 0.15)",
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "hsl(220 72% 45%)", color: "white" }}
              >
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: "hsl(220 72% 30%)" }}>
                  Business Hours
                </p>
                <p className="text-sm text-muted-foreground">
                  Monday – Saturday &nbsp;|&nbsp; 10:00 AM – 6:00 PM IST &nbsp;|&nbsp; Sunday: Closed
                </p>
              </div>
              <a
                href="https://wa.me/917428337280"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 shadow-sm"
                style={{ background: "#25D366", color: "white" }}
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ── Map + Form ── */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-extrabold mb-3"
                style={{ color: "hsl(220 72% 30%)", fontFamily: "Montserrat, sans-serif" }}
              >
                Find Us &{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, hsl(35 95% 52%), hsl(45 93% 60%))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Send a Message
                </span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Visit our offices or fill in the form — we will get back to you promptly.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
              {/* Map Column */}
              <div className="flex flex-col gap-6">
                {/* Corporate Office Map */}
                <div className="rounded-2xl overflow-hidden shadow-md border" style={{ border: "1px solid hsl(220 15% 90%)" }}>
                  <div
                    className="px-4 py-3 flex items-center gap-2"
                    style={{ background: "hsl(220 72% 45%)" }}
                  >
                    <MapPin className="h-4 w-4 text-white" />
                    <span className="text-white font-semibold text-sm">
                      Corporate Office — Delhi
                    </span>
                  </div>
                  <iframe
                    title="IndiaIPO Corporate Office - Delhi"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3499.497560388396!2d77.14895067539765!3d28.699148275618043!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d03a4d49aefb5%3A0xbf8da851b5d7ba5!2sD%20Mall%2C%20Netaji%20Subhash%20Place%2C%20Pitampura%2C%20Delhi%2C%20110034!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                    width="100%"
                    height="260"
                    style={{ border: 0, display: "block" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                {/* Regional Office Map */}
                <div className="rounded-2xl overflow-hidden shadow-md" style={{ border: "1px solid hsl(220 15% 90%)" }}>
                  <div
                    className="px-4 py-3 flex items-center gap-2"
                    style={{ background: "hsl(35 95% 52%)" }}
                  >
                    <MapPin className="h-4 w-4 text-white" />
                    <span className="text-white font-semibold text-sm">
                      Regional Office — Navi Mumbai
                    </span>
                  </div>
                  <iframe
                    title="IndiaIPO Regional Office - Navi Mumbai"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.3456789!2d73.0285!3d18.9985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ef63a95ea0c1%3A0x1!2sUlwe%2C%20Sector%2019%2C%20Navi%20Mumbai%2C%20Maharashtra%20410206!5e0!3m2!1sen!2sin!4v1710000000001!5m2!1sen!2sin"
                    width="100%"
                    height="260"
                    style={{ border: 0, display: "block" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl p-8 shadow-lg"
                  style={{
                    background: "white",
                    border: "1px solid hsl(220 15% 90%)",
                  }}
                >
                  <h3
                    className="text-xl font-bold mb-6"
                    style={{ color: "hsl(220 72% 30%)", fontFamily: "Montserrat, sans-serif" }}
                  >
                    Send Us a Message
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-1.5 block">
                        Full Name <span style={{ color: "hsl(35 95% 52%)" }}>*</span>
                      </label>
                      <Input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your full name"
                        maxLength={100}
                        className="border-slate-200 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-1.5 block">
                        Email Address <span style={{ color: "hsl(35 95% 52%)" }}>*</span>
                      </label>
                      <Input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-1.5 block">
                        Phone Number
                      </label>
                      <Input
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 XXXXX XXXXX"
                        maxLength={20}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-1.5 block">
                        Company Name
                      </label>
                      <Input
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        placeholder="Your company"
                        maxLength={200}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">
                      Subject
                    </label>
                    <Input placeholder="e.g. IPO Advisory, SME IPO, Pre-IPO Funding" />
                  </div>

                  <div className="mb-6">
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">
                      Your Message <span style={{ color: "hsl(35 95% 52%)" }}>*</span>
                    </label>
                    <Textarea
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us about your IPO requirements or queries..."
                      rows={5}
                      maxLength={2000}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full font-bold py-3 text-base rounded-xl flex items-center justify-center gap-2 transition-all"
                    style={{
                      background: "linear-gradient(135deg, hsl(220 72% 45%), hsl(220 72% 38%))",
                      color: "white",
                      boxShadow: "0 4px 16px hsl(220 72% 45% / 0.35)",
                    }}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                    {loading ? "Sending..." : "Send Message"}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground mt-4">
                    🔒 Your information is safe with us. We never share your data.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ── Why Choose IndiaIPO ── */}
        <section
          className="py-16"
          style={{
            background:
              "linear-gradient(135deg, hsl(220 72% 22%) 0%, hsl(220 72% 38%) 60%, hsl(220 72% 45%) 100%)",
          }}
        >
          <div className="container mx-auto px-4 text-center">
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white mb-3"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Why Connect With{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, hsl(35 95% 52%), hsl(45 93% 65%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                IndiaIPO?
              </span>
            </h2>
            <p className="text-white/70 max-w-xl mx-auto mb-12">
              India's trusted capital market advisory platform with a decade of expertise.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Shield className="h-6 w-6" />,
                  title: "SEBI Compliant",
                  desc: "All our services operate under the strict guidelines of SEBI and other regulatory bodies ensuring full compliance.",
                },
                {
                  icon: <TrendingUp className="h-6 w-6" />,
                  title: "End-to-End IPO Support",
                  desc: "From DRHP drafting to listing day, we handle every aspect of your IPO journey with precision.",
                },
                {
                  icon: <Users className="h-6 w-6" />,
                  title: "Expert Team",
                  desc: "Our team of seasoned investment bankers, CA professionals, and market analysts ensure the best outcomes.",
                },
                {
                  icon: <Building2 className="h-6 w-6" />,
                  title: "Pan-India Presence",
                  desc: "With offices in Delhi and Navi Mumbai, we serve clients across the country with dedicated regional support.",
                },
                {
                  icon: <MessageCircle className="h-6 w-6" />,
                  title: "24-hr Response",
                  desc: "We value your time. All enquiries receive a dedicated response within 24 business hours.",
                },
                {
                  icon: <ArrowRight className="h-6 w-6" />,
                  title: "SME & Mainboard",
                  desc: "Whether it's an NSE Emerge SME IPO or a Mainboard listing, our advisors cater to every scale.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl p-6 text-left flex gap-4 transition-all hover:scale-[1.02]"
                  style={{
                    background: "hsl(0 0% 100% / 0.08)",
                    border: "1px solid hsl(0 0% 100% / 0.14)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "hsl(35 95% 52% / 0.25)", color: "hsl(35 95% 65%)" }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                    <p className="text-white/60 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ Section ── */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-10">
              <h2
                className="text-3xl md:text-4xl font-extrabold mb-3"
                style={{ color: "hsl(220 72% 30%)", fontFamily: "Montserrat, sans-serif" }}
              >
                Frequently Asked{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, hsl(35 95% 52%), hsl(45 93% 60%))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Questions
                </span>
              </h2>
              <p className="text-muted-foreground">
                Got questions? We've answered the most common ones below.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden shadow-sm"
                  style={{ border: "1px solid hsl(220 15% 90%)", background: "white" }}
                >
                  <button
                    className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-secondary/40"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span
                      className="font-semibold text-sm pr-4"
                      style={{ color: "hsl(220 72% 30%)" }}
                    >
                      {faq.q}
                    </span>
                    {openFaq === i ? (
                      <ChevronUp
                        className="h-4 w-4 shrink-0"
                        style={{ color: "hsl(35 95% 52%)" }}
                      />
                    ) : (
                      <ChevronDown
                        className="h-4 w-4 shrink-0"
                        style={{ color: "hsl(220 72% 45%)" }}
                      />
                    )}
                  </button>
                  {openFaq === i && (
                    <div
                      className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t"
                      style={{ borderColor: "hsl(220 15% 93%)" }}
                    >
                      <p className="pt-4">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section
          className="py-14"
          style={{
            background:
              "linear-gradient(135deg, hsl(35 95% 48%) 0%, hsl(35 95% 52%) 50%, hsl(45 93% 60%) 100%)",
          }}
        >
          <div className="container mx-auto px-4 text-center">
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white mb-4"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Ready to Begin Your IPO Journey?
            </h2>
            <p className="text-white/80 max-w-lg mx-auto mb-8 text-lg">
              Connect with our experts today and take the first step towards a successful public
              listing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+917428337280"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm transition-all hover:scale-105 shadow-lg"
                style={{ background: "hsl(220 72% 38%)", color: "white" }}
              >
                <Phone className="h-4 w-4" />
                Call Now: +91-74283-37280
              </a>
              <a
                href="mailto:info@indiaipo.in"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm transition-all hover:scale-105 shadow-lg"
                style={{
                  background: "white",
                  color: "hsl(220 72% 38%)",
                }}
              >
                <Mail className="h-4 w-4" />
                info@indiaipo.in
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
