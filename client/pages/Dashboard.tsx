import { useState, useEffect } from "react";
import { FestivalSiteMap } from "@/components/dashboard/FestivalSiteMap";
import { KPIGauge } from "@/components/dashboard/KPIGauge";
import { SitesList } from "@/components/dashboard/SitesList";
import { FestivalTicketsTable } from "@/components/dashboard/FestivalTicketsTable";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import {
  festivalSites,
  festivalTickets,
  getFestivalStats,
  type FestivalSite,
} from "@/data/festivalData";

export default function Dashboard() {
  const [sites, setSites] = useState(festivalSites);
  const [tickets, setTickets] = useState(festivalTickets);
  const [selectedSite, setSelectedSite] = useState<FestivalSite | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const stats = getFestivalStats();

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate data refresh
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLastRefreshed(new Date());
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 overflow-hidden">
      {/* Background Logo - Semi-transparent */}
      <div
        className="fixed inset-0 pointer-events-none opacity-25 flex items-center justify-center"
        style={{
          background:
            "url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22><text x=%2250%25%22 y=%2250%25%22 font-size=%22120%22 font-weight=%22bold%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 fill=%22%23666%22>🐫</text></svg>')",
          backgroundSize: "400px 400px",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 w-full h-screen flex flex-col">
        {/* Header */}
        <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-700/50 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
          {/* Left: STC Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
              STC
            </div>
          </div>

          {/* Center: Title */}
          <div className="flex-1 text-center min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold text-white truncate sm:truncate">
              King Abdulaziz Camel Festival
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 sm:mt-1 hidden sm:block">
              Network & Connectivity Dashboard
            </p>
          </div>

          {/* Right: ACES Logo + Refresh */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                ACES
              </div>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              size="sm"
              className="gap-1 sm:gap-2 bg-slate-700 hover:bg-slate-600 text-white text-xs sm:text-sm px-2 sm:px-4"
            >
              <RefreshCw
                className={`w-3 h-3 sm:w-4 sm:h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </header>

        {/* Main Content Area - Flexible Grid */}
        <div className="flex-1 overflow-hidden p-4 sm:p-6">
          <div className="w-full h-full grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
            {/* Left Panel - KPI Gauge */}
            <div className="md:col-span-2 flex flex-col h-full">
              <div className="flex-1 min-h-0">
                <KPIGauge
                  value={parseInt(stats.availability)}
                  label="Network Availability"
                  unit="%"
                  threshold={{ excellent: 95, good: 85, warning: 75 }}
                />
              </div>
            </div>

            {/* Center Panel - 3D Satellite Map */}
            <div className="md:col-span-6 flex flex-col h-full">
              <div className="flex-1 min-h-0">
                <FestivalSiteMap
                  sites={sites}
                  onSiteSelect={setSelectedSite}
                />
              </div>
            </div>

            {/* Right Panel - Sites List */}
            <div className="md:col-span-4 flex flex-col h-full">
              <div className="flex-1 min-h-0">
                <SitesList
                  sites={sites}
                  onSiteSelect={setSelectedSite}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Panel - Tickets Table */}
        <div className="flex-1 overflow-hidden px-6 pb-6">
          <div className="h-full overflow-hidden">
            <FestivalTicketsTable tickets={tickets} />
          </div>
        </div>

        {/* Status Bar */}
        <footer className="bg-slate-950/80 backdrop-blur-md border-t border-slate-700/50 px-6 py-2 text-xs text-slate-400">
          <div className="flex justify-between items-center">
            <span>
              Total Sites: {stats.totalSites} | Operational:{" "}
              <span className="text-green-400 font-semibold">
                {stats.operationalSites}
              </span>
              | Warning:{" "}
              <span className="text-amber-400 font-semibold">
                {stats.warningSites}
              </span>
              | Critical:{" "}
              <span className="text-red-400 font-semibold">
                {stats.criticalSites}
              </span>
            </span>
            <span>
              Last updated: {lastRefreshed.toLocaleTimeString()}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
