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
    <div className="min-h-screen w-full bg-white overflow-hidden">
      {/* Background Logo - Full coverage */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          opacity: 0.2,
          backgroundImage:
            "url('https://cdn.builder.io/api/v1/image/assets%2Fabc8ab05f7d144f289a582747d3e5ca3%2F05f4fcc453d9459f8f665ef4cbf3168c?format=webp&width=800')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 w-full h-screen flex flex-col">
        {/* Header */}
        <header className="bg-gradient-to-r from-purple-600 to-purple-700 backdrop-blur-md border-b border-purple-500/50 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
          {/* Left: STC Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fabc8ab05f7d144f289a582747d3e5ca3%2F7b8e4dc97baf45f1befa845a6b1010f6?format=webp&width=800"
              alt="STC Logo"
              className="h-8 sm:h-10 object-contain"
            />
          </div>

          {/* Center: Title */}
          <div className="flex-1 text-center min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold text-white truncate sm:truncate">
              King Abdulaziz Camel Festival
            </h1>
            <p className="text-xs text-purple-100 mt-0.5 sm:mt-1 hidden sm:block">
              Network & Connectivity Dashboard
            </p>
          </div>

          {/* Right: ACES Logo + Refresh */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-2">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fabc8ab05f7d144f289a582747d3e5ca3%2F76fe7c8a618a4f37aefd6179ec954af9?format=webp&width=800"
                alt="ACES Logo"
                className="h-8 sm:h-10 object-contain"
              />
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              size="sm"
              className="gap-1 sm:gap-2 bg-purple-500 hover:bg-purple-600 text-white text-xs sm:text-sm px-2 sm:px-4"
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
          <div className="w-full h-full grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
            {/* Left Panel - KPI Gauge */}
            <div className="md:col-span-1 flex flex-col h-full">
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
            <div className="md:col-span-2 flex flex-col h-full">
              <div className="flex-1 min-h-0">
                <FestivalSiteMap
                  sites={sites}
                  onSiteSelect={setSelectedSite}
                />
              </div>
            </div>

            {/* Right Panel - Sites List */}
            <div className="md:col-span-1 flex flex-col h-full">
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
        <div className="flex-1 overflow-hidden px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="h-full overflow-hidden">
            <FestivalTicketsTable tickets={tickets} />
          </div>
        </div>

        {/* Status Bar */}
        <footer className="bg-slate-100 backdrop-blur-md border-t border-purple-200/50 px-4 sm:px-6 py-2 text-xs text-slate-600">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span className="text-xs">
              Sites:{" "}
              <span className="text-slate-800 font-semibold">
                {stats.totalSites}
              </span>
              {" "}| ✓{" "}
              <span className="text-green-400 font-semibold">
                {stats.operationalSites}
              </span>
              {" "}| ⚠{" "}
              <span className="text-amber-400 font-semibold">
                {stats.warningSites}
              </span>
              {" "}| ✕{" "}
              <span className="text-red-400 font-semibold">
                {stats.criticalSites}
              </span>
            </span>
            <span className="text-xs">
              Updated: {lastRefreshed.toLocaleTimeString()}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
