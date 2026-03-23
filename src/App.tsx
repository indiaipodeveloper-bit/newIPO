import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { lazy, Suspense } from "react";
import WhatsAppButton from "./components/WhatsAppButton";

// Lazy-loaded pages for code splitting
const Index = lazy(() => import("./pages/Index"));
const IPOCalendar = lazy(() => import("./pages/IPOCalendar"));
const Services = lazy(() => import("./pages/Services"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetails = lazy(() => import("./pages/BlogDetails"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const IPOCalculator = lazy(() => import("./pages/IPOCalculator"));
const IPOFeasibility = lazy(() => import("./pages/IPOFeasibility"));
const Investors = lazy(() => import("./pages/Investors"));
const NewsUpdates = lazy(() => import("./pages/NewsUpdates"));
const NewsDetails = lazy(() => import("./pages/NewsDetails"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Careers = lazy(() => import("./pages/Careers"));
const Reports = lazy(() => import("./pages/Reports"));
const IPOKnowledge = lazy(() => import("./pages/IPOKnowledge"));
const IPOProcess = lazy(() => import("./pages/IPOProcess"));
const PreIPOProcess = lazy(() => import("./pages/PreIPOProcess"));
const IPOBlogs = lazy(() => import("./pages/IPOBlogs"));
const IPOBlogDetails = lazy(() => import("./pages/IPOBlogDetails"));
const MerchantBankersPage = lazy(() => import("./pages/MerchantBankers"));
const MainboardBankersPage = lazy(() => import("./pages/MainboardBankers"));
const ManageKnowledge = lazy(() => import("./pages/admin/ManageKnowledge"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ManageIPOs = lazy(() => import("./pages/admin/ManageIPOs"));
const ManageBlogs = lazy(() => import("./pages/admin/ManageBlogs"));
const ManageNews = lazy(() => import("./pages/admin/ManageNews"));
const ManageLeads = lazy(() => import("./pages/admin/ManageLeads"));
const ManageInvestors = lazy(() => import("./pages/admin/ManageInvestors"));
const ManageIPOFeasibility = lazy(() => import("./pages/admin/ManageIPOFeasibility"));
const ManageAdminBlogs = lazy(() => import("./pages/admin/ManageAdminBlogs"));
const ManageCSR = lazy(() => import("./pages/admin/ManageCSR"));
const ManageMarketSnaps = lazy(() => import('./pages/admin/ManageMarketSnaps'));
const MarketSnaps = lazy(() => import('./pages/MarketSnaps'));
const CSR = lazy(() => import("./pages/CSR"));
const ManageUsers = lazy(() => import("./pages/admin/ManageUsers"));
const ManageReports = lazy(() => import("./pages/admin/ManageReports"));
const ManageSubscriptions = lazy(() => import("./pages/admin/ManageSubscriptions"));
const AdminSEO = lazy(() => import("./pages/admin/AdminSEO"));
const ManagePages = lazy(() => import("./pages/admin/ManagePages"));
const ManageNavigation = lazy(() => import("./pages/admin/ManageNavigation"));
const ManageBanners = lazy(() => import("./pages/admin/ManageBanners"));
const ManageMerchantBankers = lazy(() => import("./pages/admin/ManageMerchantBankers"));
const ManageMainboardBankers = lazy(() => import("./pages/admin/ManageMainboardBankers"));
const ManageCareerApplications = lazy(() => import("./pages/admin/ManageCareerApplications"));
const NotificationView = lazy(() => import("./pages/NotificationView"));
const ManageNotifications = lazy(() => import("./pages/admin/ManageNotifications"));
const ManageVideos = lazy(() => import("./pages/admin/ManageVideos"));
const ManagePopup = lazy(() => import("./pages/admin/ManagePopup"));
const Registrars = lazy(() => import("./pages/Registrars"));
const ManageRegistrars = lazy(() => import("./pages/admin/ManageRegistrars"));
const ManageRegistrarFaqs = lazy(() => import("./pages/admin/ManageRegistrarFaqs"));
const DailyReporter = lazy(() => import("./pages/DailyReporter"));
const ManageDailyDigests = lazy(() => import("./pages/admin/ManageDailyDigests"));
const RegistrarDetails = lazy(() => import("./pages/RegistrarDetails"));
const Sectors = lazy(() => import("./pages/Sectors"));
const ManageSectors = lazy(() => import("./pages/admin/ManageSectors"));
const ConsultantPage = lazy(() => import("./pages/ConsultantPage"));
const ConsultantDetail = lazy(() => import("./pages/ConsultantDetail"));
const ManageConsultants = lazy(() => import("./pages/admin/ManageConsultants"));
const ManageConsultantEnquiries = lazy(() => import("./pages/admin/ManageConsultantEnquiries"));
const NotFound = lazy(() => import("./pages/NotFound"));
const IPOServices = lazy(() => import("./pages/IPOServices"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground">Loading…</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/ipo-calendar" element={<IPOCalendar />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              <Route path="/ipo-services" element={<IPOServices />} />
              <Route path="/about" element={<About />} />
              <Route path="/about-us" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/ipo-calculator" element={<IPOCalculator />} />
              <Route path="/ipo-feasibility" element={<IPOFeasibility />} />
              <Route path="/investors" element={<Investors />} />
              <Route path="/news-updates" element={<NewsUpdates />} />
              <Route path="/ipo-and-market-snaps" element={<MarketSnaps />} />
              <Route path="/csr" element={<CSR />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/news/:slug" element={<NewsDetails />} />
              <Route path="/reports/daily-reporter" element={<DailyReporter />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/reports/:slug" element={<Reports />} />
              <Route path="/ipo-knowledge" element={<IPOKnowledge />} />
              <Route path="/ipo-knowledge/ipo-process" element={<IPOProcess />} />
              <Route path="/ipo-knowledge/pre-ipo-process" element={<PreIPOProcess />} />
              <Route path="/ipo-knowledge/:slug" element={<IPOKnowledge />} />
              <Route path="/ipo-blogs" element={<IPOBlogs />} />
              <Route path="/ipo-blogs/:slug" element={<IPOBlogDetails />} />
              <Route path="/sector-wise-ipo" element={<Sectors />} />
              <Route path="/merchant-bankers/:category" element={<MerchantBankersPage />} />
              <Route path="/merchant-bankers/mainboard-list" element={<MainboardBankersPage />} />
              <Route path="/notifications/:slug" element={<NotificationView />} />
              <Route path="/list-of-ipo-registrar" element={<Registrars />} />
              <Route path="/list-of-ipo-registrar/:slug" element={<RegistrarDetails />} />
              <Route path="/consultants" element={<ConsultantPage />} />
              <Route path="/consultants/:id" element={<ConsultantDetail />} />

              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/ipos" element={<ManageIPOs />} />
              <Route path="/admin/blogs" element={<ManageBlogs />} />
              <Route path="/admin/news" element={<ManageNews />} />
              <Route path="/admin/leads" element={<ManageLeads />} />
              <Route path="/admin/investors" element={<ManageInvestors />} />
              <Route path="/admin/ipo-feasibility" element={<ManageIPOFeasibility />} />
              <Route path="/admin/ipo-blogs" element={<ManageAdminBlogs />} />
              <Route path="/admin/csr" element={<ManageCSR />} />
              <Route path="/admin/market-snaps" element={<ManageMarketSnaps />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/reports" element={<ManageReports />} />
              <Route path="/admin/seo" element={<AdminSEO />} />
              <Route path="/admin/pages" element={<ManagePages />} />
              <Route path="/admin/navigation" element={<ManageNavigation />} />
              <Route path="/admin/banners" element={<ManageBanners />} />
              <Route path="/admin/merchant-bankers" element={<ManageMerchantBankers />} />
              <Route path="/admin/mainboard-bankers" element={<ManageMainboardBankers />} />
              <Route path="/admin/career-applications" element={<ManageCareerApplications />} />
              <Route path="/admin/knowledge" element={<ManageKnowledge />} />
              <Route path="/admin/notifications" element={<ManageNotifications />} />
              <Route path="/admin/videos" element={<ManageVideos />} />
              <Route path="/admin/subscriptions" element={<ManageSubscriptions />} />
              <Route path="/admin/popup" element={<ManagePopup />} />
              <Route path="/admin/registrars" element={<ManageRegistrars />} />
              <Route path="/admin/registrar-faqs" element={<ManageRegistrarFaqs />} />
              <Route path="/admin/sectors" element={<ManageSectors />} />
              <Route path="/admin/daily-digests" element={<ManageDailyDigests />} />
              <Route path="/admin/consultants" element={<ManageConsultants />} />
              <Route path="/admin/consultant-enquiries" element={<ManageConsultantEnquiries />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <WhatsAppButton />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
