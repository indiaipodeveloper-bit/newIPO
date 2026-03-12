import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { servicesData } from "@/data/servicesData";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, ChevronRight, Phone } from "lucide-react";
import NotFound from "./NotFound";

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = servicesData.find((s) => s.slug === slug);

  if (!service) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title={`${service.title} | IndiaIPO Services`}
        description={service.shortDescription}
        keywords={`${service.title}, IPO Consultancy, ${service.category}, Financial Services India`}
      />
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section 
          className="pt-20 pb-28 px-4 relative overflow-hidden"
          style={{ 
            background: 'linear-gradient(135deg, hsl(220 72% 22%) 0%, hsl(220 72% 38%) 55%, hsl(220 72% 45%) 100%)' 
          }}
        >
          {/* Abstract background shapes */}
          <div className="absolute inset-0 opacity-15 blur-3xl pointer-events-none">
            <div 
              className="absolute top-10 right-20 w-96 h-96 rounded-full" 
              style={{ background: 'hsl(35 95% 52%)' }} 
            />
            <div 
              className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full" 
              style={{ background: 'hsl(35 95% 52%)' }} 
            />
          </div>

          <div className="container mx-auto max-w-5xl relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-white/70 mb-8 font-medium">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/services" className="hover:text-white transition-colors">Services</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{service.title}</span>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
              <div 
                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl"
                style={{ 
                  background: 'linear-gradient(135deg, hsl(35 95% 52%), hsl(45 93% 65%))',
                  color: 'white'
                }}
              >
                {service.icon}
              </div>
              <div className="flex-1">
                <span 
                  className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 tracking-widest uppercase" 
                  style={{ 
                    background: 'hsl(35 95% 52% / 0.2)', 
                    color: 'hsl(35 95% 72%)', 
                    border: '1px solid hsl(35 95% 52% / 0.4)' 
                  }}
                >
                  {service.category}
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                  {service.title}
                </h1>
                <p className="text-lg md:text-xl text-white/80 max-w-3xl leading-relaxed">
                  {service.shortDescription}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 bg-background relative -mt-10 rounded-t-[40px] z-20">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Main Content (Left, 2 columns wide) */}
              <div className="lg:col-span-2 space-y-12">
                {/* Description */}
                <div>
                  <h2 
                    className="text-3xl font-bold mb-6"
                    style={{ color: 'hsl(220 72% 25%)' }}
                  >
                    Overview
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {service.fullDescription}
                  </p>
                </div>

                {/* Key Benefits */}
                <div>
                  <h2 
                    className="text-3xl font-bold mb-6"
                    style={{ color: 'hsl(220 72% 25%)' }}
                  >
                    Key Benefits
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {service.keyBenefits.map((benefit, idx) => (
                      <div 
                        key={idx} 
                        className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
                      >
                        <CheckCircle 
                          className="w-6 h-6 shrink-0 mt-0.5" 
                          style={{ color: 'hsl(35 95% 52%)' }} 
                        />
                        <span className="font-semibold text-foreground/90 leading-snug">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Process Steps */}
                <div>
                  <h2 
                    className="text-3xl font-bold mb-8"
                    style={{ color: 'hsl(220 72% 25%)' }}
                  >
                    Our Approach
                  </h2>
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.125rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                    {service.processSteps.map((step, idx) => (
                      <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        {/* Icon/Number Pin */}
                        <div 
                          className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10"
                          style={{ background: 'hsl(220 72% 45%)', color: 'white' }}
                        >
                          <span className="text-sm font-bold">{idx + 1}</span>
                        </div>
                        {/* Card */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card p-5 rounded-xl border border-border shadow-sm hover:shadow-lg hover:border-primary/20 transition-all">
                          <h3 className="font-bold text-lg mb-2 text-foreground">{step.title}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar (Right, 1 column wide) */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 bg-card rounded-2xl border border-border p-6 shadow-xl text-center overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2" style={{ background: 'linear-gradient(90deg, hsl(220 72% 45%), hsl(35 95% 52%))' }} />
                  
                  <div 
                    className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6 mt-4"
                    style={{ background: 'hsl(220 72% 95%)', color: 'hsl(220 72% 45%)' }}
                  >
                    <Phone className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-3">Ready to Start?</h3>
                  <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                    Consult with our experts to understand how our {service.title} advisory can accelerate your growth.
                  </p>
                  
                  <Button 
                    asChild 
                    className="w-full py-6 text-lg font-bold rounded-xl shadow-lg transition-transform hover:scale-105"
                    style={{ 
                      background: 'linear-gradient(135deg, hsl(35 95% 52%), hsl(45 93% 60%))', 
                      color: 'white', 
                      boxShadow: '0 4px 16px hsl(35 95% 52% / 0.35)' 
                    }}
                  >
                    <Link to="/contact">
                      Contact Us <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>

                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Or call us directly at</p>
                    <a 
                      href="tel:+918000000000" 
                      className="text-lg font-bold hover:underline"
                      style={{ color: 'hsl(220 72% 45%)' }}
                    >
                      +91 8000 000 000
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
