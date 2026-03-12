import { useState, useEffect } from "react";
import { sectorApi } from "@/services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { LayoutGrid, Search, ArrowRight, ChevronRight, TrendingUp, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Sector {
  id: string;
  name: string;
  description: string;
  mainline_count: number;
  sme_count: number;
  total_count: number;
}

const Sectors = () => {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    sectorApi.getAll()
      .then(setSectors)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredSectors = sectors.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/50">
      <SEOHead 
        title="Sector-wise IPO List in India | Industry Analysis" 
        description="Explore IPOs by industry sector. View mainline and SME IPO counts for various sectors in the Indian stock market."
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
            <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate('/')}>Home</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">Resources</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium underline underline-offset-4 decoration-primary/30">Sector Wise IPO</span>
          </nav>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-800 tracking-tight">
                Sector-wise <span className="text-brand-blue">IPO List</span>
              </h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Analysis of Indian IPOs categorized by industry sectors and market segments.
              </p>
            </div>
            
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Find a sector..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 bg-white border-slate-200 rounded-lg shadow-sm focus:ring-brand-blue/10 focus:border-brand-blue/30 text-sm"
              />
            </div>
          </div>

          {/* Quick Stats Summary */}
          {!loading && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
               <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">Total Sectors</p>
                  <p className="text-xl font-semibold text-slate-800">{sectors.length}</p>
               </div>
               <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <p className="text-[10px] font-medium text-brand-blue uppercase tracking-wider mb-1">Mainline Issues</p>
                  <p className="text-xl font-semibold text-slate-800">{sectors.reduce((acc, s) => acc + Number(s.mainline_count), 0)}</p>
               </div>
               <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <p className="text-[10px] font-medium text-brand-orange uppercase tracking-wider mb-1">SME IPO Issues</p>
                  <p className="text-xl font-semibold text-slate-800">{sectors.reduce((acc, s) => acc + Number(s.sme_count), 0)}</p>
               </div>
               <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <p className="text-[10px] font-medium text-slate-800 uppercase tracking-wider mb-1">Cumulative Total</p>
                  <p className="text-xl font-semibold text-brand-blue">{sectors.reduce((acc, s) => acc + Number(s.total_count), 0)}</p>
               </div>
            </div>
          )}

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/70 border-b border-slate-200">
                  <TableHead className="py-4 pl-6 font-semibold text-slate-700 uppercase tracking-wider text-[10px]">Sector Information</TableHead>
                  <TableHead className="py-4 font-semibold text-slate-700 text-center uppercase tracking-wider text-[10px]">Mainline</TableHead>
                  <TableHead className="py-4 font-semibold text-slate-700 text-center uppercase tracking-wider text-[10px]">SME IPO</TableHead>
                  <TableHead className="py-4 font-semibold text-slate-700 text-center uppercase tracking-wider text-[10px]">Total Issues</TableHead>
                  <TableHead className="py-4 pr-6 text-right font-semibold text-slate-700 uppercase tracking-wider text-[10px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [1, 2, 3, 4, 5, 6].map(i => (
                    <TableRow key={i}>
                      <TableCell colSpan={5} className="py-6 px-6">
                        <div className="h-4 bg-slate-100 animate-pulse rounded-md w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredSectors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-16 text-center">
                      <div className="flex flex-col items-center opacity-40">
                         <LayoutGrid className="w-12 h-12 mb-2 text-slate-300" />
                         <p className="text-slate-500 font-medium">No industry sectors found matching your search.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSectors.map((sector) => (
                    <TableRow 
                      key={sector.id} 
                      className="group hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0 cursor-pointer"
                      onClick={() => navigate(`/reports?sector=${encodeURIComponent(sector.name)}`)}
                    >
                      <TableCell className="py-4 pl-6">
                        <div className="flex items-center gap-4">
                           <div className="p-2.5 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-brand-blue group-hover:text-white transition-all shadow-sm">
                             <LayoutGrid className="w-4 h-4" />
                           </div>
                           <div>
                             <div className="font-medium text-slate-900 text-[15px] capitalize tracking-tight group-hover:text-brand-blue transition-colors">
                               {sector.name.toLowerCase()}
                             </div>
                             {sector.description && (
                               <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{sector.description}</p>
                             )}
                           </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <span className="inline-flex items-center justify-center min-w-[32px] px-2.5 py-1 rounded-md bg-brand-blue/5 text-brand-blue text-sm font-medium border border-brand-blue/10">
                          {sector.mainline_count}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <span className="inline-flex items-center justify-center min-w-[32px] px-2.5 py-1 rounded-md bg-brand-orange/5 text-brand-orange text-sm font-medium border border-brand-orange/10">
                          {sector.sme_count}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <div className="font-semibold text-slate-800 text-base">{sector.total_count}</div>
                      </TableCell>
                      <TableCell className="py-4 pr-6 text-right">
                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-[11px] font-medium hover:border-brand-blue hover:text-brand-blue transition-all shadow-sm">
                          Explore
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )
                }
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-10 p-6 rounded-2xl bg-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-slate-200">
             <div className="space-y-1">
                <h3 className="text-xl font-medium tracking-tight">Need expert consultation on your IPO journey?</h3>
                <p className="text-slate-400 text-sm">Our team of experts can guide you through the complexities of the public market.</p>
             </div>
             <button 
                onClick={() => navigate('/ipo-feasibility')}
                className="px-6 py-2.5 bg-brand-blue text-white rounded-full text-sm font-semibold hover:bg-white hover:text-brand-blue transition-all shrink-0 shadow-lg shadow-brand-blue/20"
             >
                Check IPO Feasibility
             </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sectors;
