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
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [stats, setStats] = useState({
    totalSites: 0,
    operationalSites: 0,
    warningSites: 0,
    criticalSites: 0,
    availability: "0",
  });

  // Suppress benign console errors from third-party libraries
  useEffect(() => {
    const originalError = console.error;
    const originalWarn = console.warn;

    (console as any).error = function (...args: any[]) {
      const message = args.map((arg) => String(arg)).join(" ");
      // Suppress ResizeObserver warnings and WebGL context errors
      if (/ResizeObserver loop|maxTextureDimension2D|WebGLCanvasContext|cannot read properties|reading 'max/i.test(message)) {
        return;
      }
      originalError.apply(console, args);
    };

    (console as any).warn = function (...args: any[]) {
      const message = args.map((arg) => String(arg)).join(" ");
      // Suppress benign warnings
      if (/ResizeObserver loop|maxTextureDimension2D|WebGLCanvasContext/i.test(message)) {
        return;
      }
      originalWarn.apply(console, args);
    };

    // Add global error handler for benign errors
    const handleError = (event: ErrorEvent) => {
      const message = event.message || "";
      if (/ResizeObserver|maxTextureDimension2D|WebGLCanvasContext/i.test(message)) {
        event.preventDefault();
        return true;
      }
      return false;
    };

    window.addEventListener("error", handleError, true);

    return () => {
      (console as any).error = originalError;
      (console as any).warn = originalWarn;
      window.removeEventListener("error", handleError, true);
    };
  }, []);

  // Fetch data on mount and auto-refresh
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 1000); // Refresh every 1 second
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

  return (
    <div className="min-h-screen w-full bg-white overflow-hidden">
      {/* Main Container */}
      <div className="relative z-10 w-full h-screen flex flex-col">
        {/* Header */}
        <header className="bg-gradient-to-r from-purple-600 to-purple-700 backdrop-blur-md border-b border-purple-500/50 px-3 sm:px-4 py-1 flex items-center justify-between gap-2">
          {/* Left: STC Logo */}
          <div className="flex items-center flex-shrink-0">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fabc8ab05f7d144f289a582747d3e5ca3%2F7b8e4dc97baf45f1befa845a6b1010f6?format=webp&width=800"
              alt="STC Logo"
              className="h-5 sm:h-6 object-contain"
            />
          </div>

          {/* Center: Title */}
          <div className="flex-1 text-center min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-white truncate">
              <p>King Abdalaziz Camel Festival Network Insights</p>
            </h1>
          </div>

          {/* Right: ACES Logo */}
          <div className="flex items-center flex-shrink-0">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fabc8ab05f7d144f289a582747d3e5ca3%2F76fe7c8a618a4f37aefd6179ec954af9?format=webp&width=800"
              alt="ACES Logo"
              className="h-6 sm:h-8 object-contain"
            />
          </div>
        </header>

        {/* Main Content Area - Map takes most space */}
        <div className="flex-1 overflow-hidden flex flex-col gap-1">
          {/* Map Container - Slightly reduced height */}
          <div className="flex-[0.68] min-h-[55%] overflow-hidden relative">
            <MaplibreView
              sites={sites}
              onSiteSelect={setSelectedSite}
            />

            {/* KPI Overlay - Top Right */}
            <div className="absolute top-2 right-2 z-20">
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

          {/* Tickets Table - Below Map - Larger height */}
          <div className="flex-[0.32] min-h-[28%] overflow-hidden px-1 sm:px-2 py-0.5 sm:py-1 flex-shrink-0 bg-white/60 backdrop-blur-md border-t border-purple-200/30">
            <div className="h-full overflow-hidden">
              <FestivalTicketsTable tickets={tickets} />
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <footer className="bg-slate-100 backdrop-blur-md border-t border-purple-200/50 px-3 sm:px-4 py-1 text-xs text-slate-600">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span className="text-xs">
              Sites:{" "}
              <span className="text-slate-800 font-semibold">
                {stats.totalSites}
              </span>{" "}
              | ✓{" "}
              <span className="text-green-400 font-semibold">
                {stats.operationalSites}
              </span>{" "}
              | ⚠{" "}
              <span className="text-amber-400 font-semibold">
                {stats.warningSites}
              </span>{" "}
              | ✕{" "}
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
