import { useState, useEffect } from "react";
import { MaplibreView } from "@/components/dashboard/MaplibreView";
import { KPIGauge } from "@/components/dashboard/KPIGauge";
import { FestivalTicketsTable } from "@/components/dashboard/FestivalTicketsTable";
import { fetchSheetData } from "@/data/sheetData";
import type { FestivalSite, FestivalTicket } from "@/data/festivalData";

export default function Dashboard() {
  const [sites, setSites] = useState<FestivalSite[]>([]);
  const [tickets, setTickets] = useState<FestivalTicket[]>([]);
  const [selectedSite, setSelectedSite] = useState<FestivalSite | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [stats, setStats] = useState({
    totalSites: 0,
    operationalSites: 0,
    warningSites: 0,
    criticalSites: 0,
    availability: "0",
  });

  // Fetch data on mount and auto-refresh
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const data = await fetchSheetData();
      setSites(data.sites);
      setTickets(data.tickets);
      setStats(data.stats);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
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

          {/* Right: ACES Logo */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fabc8ab05f7d144f289a582747d3e5ca3%2F76fe7c8a618a4f37aefd6179ec954af9?format=webp&width=800"
                alt="ACES Logo"
                className="h-12 sm:h-16 object-contain"
              />
            </div>
          </div>
        </header>

        {/* Main Content Area - Map takes most space */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Map Container - 75% height */}
          <div className="flex-1 overflow-hidden relative">
            <MaplibreView
              sites={sites}
              onSiteSelect={setSelectedSite}
            />

            {/* KPI Overlay - Top Right */}
            <div className="absolute top-4 right-4 z-20">
              <div className="bg-transparent">
                <KPIGauge
                  value={parseInt(stats.availability) || 0}
                  label="Availability KPI"
                  unit="%"
                  threshold={{ excellent: 90, good: 75, warning: 50 }}
                />
              </div>
            </div>
          </div>

          {/* Tickets Table - Below Map - 25% height */}
          <div className="h-1/4 overflow-hidden px-3 sm:px-4 md:px-6 pb-2 sm:pb-3 md:pb-4 flex-shrink-0 bg-white/50 backdrop-blur-md border-t border-purple-200/30">
            <div className="h-full overflow-hidden">
              <FestivalTicketsTable tickets={tickets} />
            </div>
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
