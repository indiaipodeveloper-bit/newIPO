import React from "react";
import { 
  Building2, TrendingUp, BarChart3, Wallet, FileText, 
  Briefcase, LineChart, PieChart, ShieldCheck, Scale, 
  Globe, LayoutDashboard, Target, Landmark, Coins, 
  HandCoins, Banknote, AreaChart 
} from "lucide-react";

export type ServiceData = {
  id: string;
  slug: string;
  category: "IPO" | "CAPITAL RAISING" | "FINANCE ADVISORY";
  title: string;
  icon: React.ReactNode;
  shortDescription: string;
  fullDescription: string;
  keyBenefits: string[];
  processSteps: { title: string; desc: string }[];
};

export const servicesData: ServiceData[] = [
  // --- IPO CATEGORY ---
  {
    id: "sme-ipo",
    slug: "sme-ipo",
    category: "IPO",
    title: "SME IPO Consultation",
    icon: <Building2 className="h-10 w-10" />,
    shortDescription: "End-to-end advisory for Small and Medium Enterprise IPOs on BSE SME and NSE Emerge platforms.",
    fullDescription: "Our SME IPO Consultation service empowers high-growth small and medium enterprises to tap into the public markets. We provide comprehensive guidance through the complex regulatory landscape of BSE SME and NSE Emerge, ensuring your business is valuation-ready, compliant, and positioned for a successful listing that unlocks vital growth capital.",
    keyBenefits: [
      "Access to alternative, low-cost capital for expansion",
      "Enhanced brand visibility and corporate governance",
      "Liquidity for early-stage investors and promoters",
      "Lower compliance burden compared to Mainboard listings"
    ],
    processSteps: [
      { title: "Eligibility Assessment", desc: "Evaluating financial track record against stock exchange criteria." },
      { title: "Restructuring & Preparation", desc: "Aligning corporate structure and financials for listing." },
      { title: "DRHP Drafting", desc: "Preparing the Draft Red Herring Prospectus with legal teams." },
      { title: "Exchange Approval", desc: "Filing and obtaining necessary in-principle approvals." },
      { title: "Marketing & Issue", desc: "Conducting roadshows and opening the issue to the public." },
      { title: "Listing Ceremony", desc: "Ringing the bell and managing post-listing compliance." }
    ]
  },
  {
    id: "mainline-ipo",
    slug: "mainline-ipo",
    category: "IPO",
    title: "Mainline IPO Consultation",
    icon: <TrendingUp className="h-10 w-10" />,
    shortDescription: "Comprehensive consultancy for mainboard IPO listings with full SEBI compliance and institutional investor roadshows.",
    fullDescription: "A Mainboard IPO is a monumental milestone. We offer specialized advisory services for large-cap companies aiming to list on the primary boards of BSE and NSE. Our team orchestrates the entire process, negotiating with underwriters, drafting offer documents, and strategically pricing the issue to ensure maximum institutional and retail subscription.",
    keyBenefits: [
      "Massive capital generation for large-scale operations",
      "National and international brand recognition",
      "Ability to attract top-tier institutional investors (QIBs)",
      "Currency for future mergers and acquisitions"
    ],
    processSteps: [
      { title: "Strategic Planning", desc: "Determining issue size, pricing strategy, and timing." },
      { title: "Due Diligence", desc: "Rigorous legal, financial, and operational audits." },
      { title: "SEBI Filing", desc: "Drafting and filing the DRHP with the Securities and Exchange Board of India." },
      { title: "Pre-Issue Marketing", desc: "Engaging anchor investors and QIBs through global roadshows." },
      { title: "Book Building", desc: "Discovering optimal price through the bidding process." },
      { title: "Allotment & Listing", desc: "Finalizing shares and debut trading on the main exchanges." }
    ]
  },
  {
    id: "initial-public-offering",
    slug: "initial-public-offering",
    category: "IPO",
    title: "Initial Public Offering (IPO)",
    icon: <Globe className="h-10 w-10" />,
    shortDescription: "General IPO advisory mapping out the best public listing strategy for your enterprise segment.",
    fullDescription: "Our holistic Initial Public Offering service is designed for companies exploring the capital markets but unsure of the specific route. We analyze your financials, sector, and growth trajectory to recommend whether an SME or Mainboard IPO suits you best, providing a strategic roadmap from private to public ownership.",
    keyBenefits: [
      "Unbiased assessment of listing feasibility",
      "Strategic roadmap tailored to company size",
      "Expert valuation and pricing guidance",
      "Seamless transition from private to public entity"
    ],
    processSteps: [
      { title: "Initial Consultation", desc: "Understanding company goals and financial health." },
      { title: "Feasibility Report", desc: "Analyzing market readiness and regulatory compliance." },
      { title: "Platform Selection", desc: "Choosing between SME or Mainboard exchanges." },
      { title: "Intermediary Appointment", desc: "Selecting lead managers, legal counsel, and registrars." },
      { title: "Execution Plan", desc: "Setting a timeline for drafting, filing, and listing." }
    ]
  },
  {
    id: "fpo",
    slug: "fpo",
    category: "IPO",
    title: "Follow-On Public Offer (FPO)",
    icon: <BarChart3 className="h-10 w-10" />,
    shortDescription: "Follow-on Public Offering strategy for listed companies seeking additional capital from the public markets.",
    fullDescription: "For companies already listed on the stock exchange, a Follow-On Public Offer (FPO) is the premier route to raise further equity capital. Whether it is a dilutive FPO to fund new projects or a non-dilutive FPO for promoters to offload shares, we provide precise regulatory and marketing strategies to ensure a fully subscribed issue.",
    keyBenefits: [
      "Raise additional capital without debt",
      "Improve stock liquidity and free float",
      "Fund large-scale diversification or acquisitions",
      "Reduce promoter debt effectively"
    ],
    processSteps: [
      { title: "Capital Assessment", desc: "Evaluating the exact capital requirement and purpose." },
      { title: "Board Approval", desc: "Securing necessary board and shareholder resolutions." },
      { title: "Pricing Strategy", desc: "Determining the floor price or price band relative to current market price." },
      { title: "Regulatory Filing", desc: "Filing the prospectus with SEBI and exchanges." },
      { title: "Marketing & Issue", desc: "Re-engaging investors and opening the issue." }
    ]
  },
  {
    id: "pre-ipo",
    slug: "pre-ipo",
    category: "IPO",
    title: "Pre-IPO Funding Consultants",
    icon: <Wallet className="h-10 w-10" />,
    shortDescription: "Connect with institutional investors and HNIs for pre-IPO capital raising and optimal valuation discovery.",
    fullDescription: "Pre-IPO funding bridges the gap between private equity and public markets. We connect late-stage private companies with targeted High Net Worth Individuals (HNIs) and institutional investors. This not only provides immediate growth capital but acts as a strong valuation benchmark, setting a positive tone for the upcoming actual IPO.",
    keyBenefits: [
      "Immediate capital injection before the formal IPO",
      "Establishes a solid baseline valuation",
      "Onboards strategic investors who add long-term value",
      "Builds market confidence ahead of public listing"
    ],
    processSteps: [
      { title: "Company Profiling", desc: "Creating compelling investment memorandums and pitch decks." },
      { title: "Investor Targeting", desc: "Identifying synergy-driven HNIs and institutional funds." },
      { title: "Valuation Discovery", desc: "Negotiating fair pre-listing valuations." },
      { title: "Term Sheet Finalization", desc: "Drafting and signing investment agreements." },
      { title: "Due Diligence Support", desc: "Facilitating investor audits and legal checks." }
    ]
  },

  // --- CAPITAL RAISING CATEGORY ---
  {
    id: "social-stock-exchange",
    slug: "social-stock-exchange",
    category: "CAPITAL RAISING",
    title: "Social Stock Exchange",
    icon: <HandCoins className="h-10 w-10" />,
    shortDescription: "Advisory for Non-Profit Organizations (NPOs) and Social Enterprises to raise funds via the Social Stock Exchange.",
    fullDescription: "The Social Stock Exchange (SSE) is a revolutionary platform allowing Social Enterprises and NPOs to raise capital. We guide organizations through the distinct eligibility criteria, help structure Zero Coupon Zero Principal (ZCZP) instruments, and ensure compliance with social impact reporting standards.",
    keyBenefits: [
      "Access to a dedicated pool of philanthropic capital",
      "Enhanced transparency and trust among donors",
      "Standardized impact measurement and reporting",
      "Zero debt burden for NPOs via ZCZP bonds"
    ],
    processSteps: [
      { title: "Social Impact Audit", desc: "Evaluating current social initiatives and outcomes." },
      { title: "Registration", desc: "Registering the entity on the SSE platform." },
      { title: "Instrument Structuring", desc: "Designing ZCZP bonds or equity structures for for-profit social enterprises." },
      { title: "Filing Offer Document", desc: "Submitting the necessary paperwork to the exchange." },
      { title: "Fundraising", desc: "Engaging impact investors and philanthropic institutions." }
    ]
  },
  {
    id: "private-placement",
    slug: "private-placement",
    category: "CAPITAL RAISING",
    title: "Private Placement",
    icon: <Briefcase className="h-10 w-10" />,
    shortDescription: "Raising capital through the direct sale of securities to a relatively small number of select investors.",
    fullDescription: "Private Placement is a rapid and cost-effective method of raising capital without the stringent regulatory requirements of a public issue. We assist in structuring the offering, drafting the Private Placement Offer Letter (PAS-4), and identifying strategic investors to subscribe to equity or debt securities.",
    keyBenefits: [
      "Faster turnaround time compared to public issues",
      "Lower regulatory and compliance costs",
      "Flexibility in structuring terms and pricing",
      "Maintains confidentiality of business operations"
    ],
    processSteps: [
      { title: "Structuring the Offer", desc: "Deciding between equity, preference shares, or debentures." },
      { title: "Board & Shareholder Resolution", desc: "Passing necessary resolutions as per the Companies Act." },
      { title: "Drafting Offer Letter", desc: "Preparing the PAS-4 document detailing the issue." },
      { title: "Investor Subscription", desc: "Receiving funds in a separate bank account." },
      { title: "Allotment & Return Filing", desc: "Alloting securities and filing Return of Allotment (PAS-3) with ROC." }
    ]
  },
  {
    id: "project-funding",
    slug: "project-funding",
    category: "CAPITAL RAISING",
    title: "Project Funding",
    icon: <Target className="h-10 w-10" />,
    shortDescription: "End-to-end financial structuring and syndication for large-scale infrastructure and industrial projects.",
    fullDescription: "Project Funding requires meticulous planning, as repayment depends heavily on the project's cash flow rather than the sponsor's balance sheet. We provide comprehensive advisory, from preparing bankable Detailed Project Reports (DPRs) to syndicating term loans and structured finance from a consortium of lenders.",
    keyBenefits: [
      "Non-recourse or limited recourse financing",
      "Longer tenures matching asset lifecycles",
      "Optimal debt-equity ratio structuring",
      "Risk mitigation across the project lifecycle"
    ],
    processSteps: [
      { title: "Project Conceptualization", desc: "Analyzing technical and financial viability." },
      { title: "DPR Preparation", desc: "Drafting a comprehensive Detailed Project Report." },
      { title: "Financial Modeling", desc: "Creating robust cash flow projections and sensitivity analyses." },
      { title: "Lender Syndication", desc: "Approaching banks, NBFCs, and sovereign funds." },
      { title: "Financial Closure", desc: "Signing loan agreements and initiating initial drawdown." }
    ]
  },
  {
    id: "reit",
    slug: "reit",
    category: "CAPITAL RAISING",
    title: "REIT (Real Estate Investment Trust)",
    icon: <Landmark className="h-10 w-10" />,
    shortDescription: "Structuring and listing of Real Estate Investment Trusts to monetize rent-yielding commercial assets.",
    fullDescription: "Real Estate Investment Trusts (REITs) offer a powerful way for developers to monetize large, completed, rent-yielding commercial properties. We advise on asset transfer structuring, sponsor holding regulations, establishing the trust, and managing the entire IPO process for the REIT.",
    keyBenefits: [
      "Monetize illiquid real estate assets",
      "Tax-efficient pass-through structure",
      "Access to global institutional capital",
      "Steady dividend yields for investors"
    ],
    processSteps: [
      { title: "Asset Identification", desc: "Selecting completed and income-generating properties." },
      { title: "Trust Formation", desc: "Establishing the REIT, Manager, and Trustee hierarchy." },
      { title: "Asset Transfer Structuring", desc: "Navigating stamp duty and capital gains implications." },
      { title: "Valuation & Rating", desc: "Independent valuation of the real estate portfolio." },
      { title: "Listing the REIT", desc: "Filing the Offer Document and issuing units to the public." }
    ]
  },
  {
    id: "sm-reit",
    slug: "sm-reit",
    category: "CAPITAL RAISING",
    title: "SM REIT",
    icon: <Building2 className="h-10 w-10" />,
    shortDescription: "Consultancy for Small and Medium Real Estate Investment Trusts to democratize real estate ownership.",
    fullDescription: "Small and Medium REITs (SM REITs) are the latest regulatory innovation allowing fractional ownership of smaller, yielding real estate assets (starting from ₹50 Crores). We guide asset managers in setting up micro-REIT structures, ensuring compliance with the new SEBI Fractional Ownership regulations.",
    keyBenefits: [
      "Lower threshold for asset monetization (₹50 Cr+)",
      "Regulated alternative to unregulated fractional platforms",
      "Diversified asset classes including warehousing and retail",
      "Retail investor participation with smaller ticket sizes"
    ],
    processSteps: [
      { title: "Scheme Design", desc: "Structuring the specific SM REIT scheme and asset SPVs." },
      { title: "SEBI Registration", desc: "Registering the Investment Manager under SM REIT regulations." },
      { title: "Asset Acquisition", desc: "Transferring identified assets into specific scheme SPVs." },
      { title: "Offer Document", desc: "Drafting the Scheme Information Document (SID)." },
      { title: "Fundraising & Listing", desc: "Raising capital from public/private investors and listing units." }
    ]
  },
  {
    id: "rights-issue",
    slug: "rights-issue",
    category: "CAPITAL RAISING",
    title: "Rights Issue Advisory",
    icon: <Scale className="h-10 w-10" />,
    shortDescription: "Assisting listed companies in raising capital directly from their existing shareholders.",
    fullDescription: "A Rights Issue allows listed companies to raise funds without diluting the ownership percentage of participating shareholders. We provide end-to-end advisory on fixing the entitlement ratio, pricing the issue at an attractive discount, managing renounceable rights trading, and overall compliance.",
    keyBenefits: [
      "No dilution of control for subscribing shareholders",
      "Lower marketing and issue expenses",
      "Rewarding existing loyal shareholders with discounted shares",
      "Surety of funds if underwritten"
    ],
    processSteps: [
      { title: "Issue Sizing & Pricing", desc: "Determining the total capital required and the offer price." },
      { title: "Record Date Finalization", desc: "Setting the date to determine eligible shareholders." },
      { title: "Letter of Offer", desc: "Drafting and filing the requisite documents with SEBI/Exchanges." },
      { title: "Rights Entitlement Trading", desc: "Facilitating the trading of REs on the stock exchange." },
      { title: "Allotment", desc: "Finalizing allotment based on subscriptions and renunciations." }
    ]
  },
  {
    id: "invit-rights",
    slug: "invit-rights",
    category: "CAPITAL RAISING",
    title: "InvIT Rights Issue",
    icon: <AreaChart className="h-10 w-10" />,
    shortDescription: "Specialized advisory for listed Infrastructure Investment Trusts raising capital through rights offerings.",
    fullDescription: "Infrastructure Investment Trusts (InvITs) frequently require large capital injections to acquire new infra assets (like toll roads or power grids). We assist listed InvITs in structuring Rights Issues, enabling existing unitholders to fund these acquisitions while maintaining their proportional yield.",
    keyBenefits: [
      "Non-dilutive growth capital for new asset acquisition",
      "Faster regulatory approval track",
      "Maintains the trust's overall yield metrics",
      "Cost-effective capital raising mechanism"
    ],
    processSteps: [
      { title: "Asset Pipeline Assessment", desc: "Valuing the new infrastructure assets to be acquired." },
      { title: "Ratio & Pricing", desc: "Determining the rights ratio and unit price." },
      { title: "Regulatory Approvals", desc: "Filing with SEBI under InvIT Rights Issue guidelines." },
      { title: "Unitholder Communication", desc: "Explaining the yield accretion to existing investors." },
      { title: "Issue Closure", desc: "Allotment of units and deployment of funds for acquisition." }
    ]
  },
  {
    id: "invit-public",
    slug: "invit-public",
    category: "CAPITAL RAISING",
    title: "InvIT Public Issue",
    icon: <LayoutDashboard className="h-10 w-10" />,
    shortDescription: "Comprehensive structuring and listing services for publicly offered Infrastructure Investment Trusts.",
    fullDescription: "Launching an InvIT via a Public Issue is a complex undertaking involving the transfer of massive infrastructure assets, securing AAA ratings, and marketing a yield-based product to retail and institutional investors. We manage the entire lifecycle from sponsor structuring to final listing on the exchanges.",
    keyBenefits: [
      "De-leveraging sponsor balance sheets",
      "Recycling capital into greenfield projects",
      "Creating a liquid, yield-generating instrument",
      "Accessing a broad base of domestic and foreign capital"
    ],
    processSteps: [
      { title: "Sponsor & Trust Setup", desc: "Establishing the InvIT legal framework and transferring assets." },
      { title: "Credit Rating", desc: "Securing top-tier ratings for the combined infra portfolio." },
      { title: "Filing Offer Document", desc: "Drafting the complex Offer Document for SEBI review." },
      { title: "Yield Marketing", desc: "Marketing the anticipated Internal Rate of Return (IRR) to investors." },
      { title: "Listing & Allocation", desc: "Listing the units for public trading." }
    ]
  },
  {
    id: "debt-syndication",
    slug: "debt-syndication",
    category: "CAPITAL RAISING",
    title: "Debt Syndication",
    icon: <Banknote className="h-10 w-10" />,
    shortDescription: "Sourcing and structuring optimal debt financing from consortiums of banks and financial institutions.",
    fullDescription: "When single-lender limits are exhausted, Debt Syndication brings together a consortium of banks to fund large capital requirements. We structure Working Capital Limits, Term Loans, and Non-Convertible Debentures (NCDs), negotiating the lowest possible interest rates and favorable covenants on your behalf.",
    keyBenefits: [
      "Fulfill massive funding requirements seamlessly",
      "Diversify lender relationships",
      "Negotiate highly competitive interest rates",
      "Optimize debt repayment schedules"
    ],
    processSteps: [
      { title: "Credit Assessment", desc: "Evaluating the company's borrowing capacity and credit rating." },
      { title: "Information Memorandum", desc: "Drafting a detailed IM for prospective lenders." },
      { title: "Lead Bank Appointment", desc: "Selecting the lead arranger to underwrite the debt." },
      { title: "Syndication & Appraisal", desc: "Onboarding participating banks and facilitating appraisals." },
      { title: "Documentation & Disbursement", desc: "Signing the consortium agreement and initiating drawdown." }
    ]
  },

  // --- FINANCE ADVISORY CATEGORY ---
  {
    id: "valuation",
    slug: "valuation",
    category: "FINANCE ADVISORY",
    title: "Business Valuation",
    icon: <PieChart className="h-10 w-10" />,
    shortDescription: "Accurate, compliant, and defensible enterprise valuation services for M&A, regulatory, and reporting purposes.",
    fullDescription: "Valuation is both an art and a science. Our Registered Valuers utilize globally accepted methodologies (DCF, Relative Valuation, Net Asset Value) to provide precise business valuations. Whether required for FEMA compliance, Income Tax, M&A transactions, or financial reporting, our reports stand up to intense regulatory scrutiny.",
    keyBenefits: [
      "Regulatory compliance (FEMA, IT Act, Companies Act)",
      "Strong negotiation baseline for Mergers & Acquisitions",
      "Accurate ESOP and Sweat Equity pricing",
      "Comprehensive financial and scenario modeling"
    ],
    processSteps: [
      { title: "Information Gathering", desc: "Collecting historical financials and future projections." },
      { title: "Management Discussions", desc: "Understanding the underlying business drivers and risks." },
      { title: "Methodology Selection", desc: "Choosing appropriate valuation approaches based on context." },
      { title: "Financial Modeling", desc: "Building the mathematical models and applying discount rates." },
      { title: "Report Issuance", desc: "Delivering a certified, comprehensive Valuation Report." }
    ]
  },
  {
    id: "corporate-finance",
    slug: "corporate-finance",
    category: "FINANCE ADVISORY",
    title: "Corporate Finance",
    icon: <Coins className="h-10 w-10" />,
    shortDescription: "Strategic advisory maximizing shareholder value through capital structuring, M&A, and restructuring.",
    fullDescription: "Our Corporate Finance advisory acts as an extension of your CFO's office. We provide strategic guidance on capital allocation, debt restructuring, mergers & amalgamations, and risk management. We analyze your long-term objectives to ensure every financial decision is accretive to overall shareholder value.",
    keyBenefits: [
      "Optimized Weighted Average Cost of Capital (WACC)",
      "Strategic alignment of M&A with core business",
      "Efficient capital restructuring to avert distress",
      "Enhanced overall enterprise value"
    ],
    processSteps: [
      { title: "Strategic Audit", desc: "Reviewing current capital structure and operational efficiency." },
      { title: "Gap Analysis", desc: "Identifying areas of suboptimal capital deployment." },
      { title: "Strategy Formulation", desc: "Recommending M&A, divestitures, or recapitalization." },
      { title: "Execution Advisory", desc: "Guiding the implementation of the chosen strategy." },
      { title: "Post-Implementation Review", desc: "Tracking metrics to ensure desired outcomes are achieved." }
    ]
  },
  {
    id: "financial-modelling",
    slug: "financial-modelling",
    category: "FINANCE ADVISORY",
    title: "Financial Modelling",
    icon: <LineChart className="h-10 w-10" />,
    shortDescription: "Building robust, dynamic, and error-free multi-sheet financial models for accurate forecasting.",
    fullDescription: "A robust financial model is the bedrock of any major corporate decision. We build dynamic, three-statement financial models from scratch. Our models incorporate complex sensitivity analyses, scenario building, and KPI tracking, empowering management to visualize the financial impact of strategic choices before executing them.",
    keyBenefits: [
      "Data-driven decision making",
      "Identify precise capital requirements over time",
      "Stress-test business plans under various scenarios",
      "Professional presentation format for investors/lenders"
    ],
    processSteps: [
      { title: "Assumption Finalization", desc: "Agreeing on macroeconomic and microeconomic inputs." },
      { title: "Historical Data Input", desc: "Establishing the baseline from past financial statements." },
      { title: "Projections & Linkages", desc: "Forecasting the Income Statement, Balance Sheet, and Cash Flow." },
      { title: "Scenario & Sensitivity", desc: "Adding toggles for best, base, and worst-case scenarios." },
      { title: "Review & Handover", desc: "Rigorous error-checking and training for the client." }
    ]
  },
  {
    id: "project-finance",
    slug: "project-finance",
    category: "FINANCE ADVISORY",
    title: "Project Finance",
    icon: <FileText className="h-10 w-10" />,
    shortDescription: "Specialized financial advisory for structuring, appraising, and securing funds for new ventures.",
    fullDescription: "Project Finance involves evaluating the economic viability of new industrial or infrastructure projects. We assist in preparing Detailed Project Reports (DPR), calculating IRR and Payback Periods, and advising on the optimal mix of equity, term loans, and working capital to ensure the project achieves financial closure smoothly.",
    keyBenefits: [
      "Rigorous viability assessment before capital commitment",
      "Clear visibility on debt servicing capabilities (DSCR)",
      "Structured to meet precise lender requirements",
      "Minimization of sponsor balance-sheet risk"
    ],
    processSteps: [
      { title: "Viability Study", desc: "Initial assessment of technical and commercial feasibility." },
      { title: "Cost & Means of Finance", desc: "Estimating total project cost and proposed funding mix." },
      { title: "DPR Preparation", desc: "Drafting the master document required by lenders." },
      { title: "Appraisal Support", desc: "Defending the projections during bank credit appraisals." },
      { title: "Sanction & Closure", desc: "Securing the sanction letter and fulfilling pre-disbursement conditions." }
    ]
  }
];
