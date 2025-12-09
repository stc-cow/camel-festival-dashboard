import { useState } from "react";
import { PowerTicketsStats } from "@/components/dashboard/PowerTicketsStats";
import { AvailabilityMetric } from "@/components/dashboard/AvailabilityMetric";
import { PowerOutagesTable } from "@/components/dashboard/PowerOutagesTable";
import { SiteMap } from "@/components/dashboard/SiteMap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { powerTickets, getPowerStats } from "@/data/powerOutageData";

export default function Dashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const stats = getPowerStats();
  const lastUpdated = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  // Get COW units for map
  const cowUnits = [
    {
      id: "COW076",
      name: "COW076",
      status: "active" as const,
      latitude: 25.59805,
      longitude: 46.87754,
      power: "critical",
    },
    {
      id: "COW022",
      name: "COW022",
      status: "warning" as const,
      latitude: 25.63587,
      longitude: 46.83091,
      power: "critical",
    },
    {
      id: "COW188",
      name: "COW188",
      status: "warning" as const,
      latitude: 25.64236,
      longitude: 46.81855,
      power: "high",
    },
    {
      id: "COW094",
      name: "COW094",
      status: "active" as const,
      latitude: 25.67764,
      longitude: 46.85573,
      power: "high",
    },
    {
      id: "COW652",
      name: "COW652",
      status: "active" as const,
      latitude: 25.67445,
      longitude: 46.8308,
      power: "normal",
    },
    {
      id: "CWS808",
      name: "CWS808",
      status: "active" as const,
      latitude: 25.6609,
      longitude: 46.86093,
      power: "normal",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-purple-500/30 bg-purple-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚡</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Power & Outage Insight
                </h1>
                <p className="text-purple-300 text-xs">
                  Real-time power system monitoring
                </p>
              </div>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2 bg-purple-700 hover:bg-purple-600 text-white"
              size="sm"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert Bar */}
        {stats.openCount > 0 && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-300 mb-1">
                Active Power Issues
              </h3>
              <p className="text-sm text-red-200">
                {stats.openCount} open ticket{stats.openCount > 1 ? "s" : ""}{" "}
                requiring attention
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Power Tickets Stats */}
          <div className="lg:col-span-1">
            <PowerTicketsStats
              criticalCount={stats.criticalCount}
              highCount={stats.highCount}
              mediumCount={stats.mediumCount}
              lowCount={stats.lowCount}
              openCount={stats.openCount}
              inProgressCount={stats.inProgressCount}
            />
          </div>

          {/* Right Panel - Map and Availability */}
          <div className="lg:col-span-2 space-y-8">
            {/* Map Section */}
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-white">
                  Coverage Map - Power Status
                </h2>
                <p className="text-sm text-purple-300">
                  Outage locations and affected areas
                </p>
              </div>
              <div className="h-80 rounded-lg overflow-hidden shadow-lg border border-purple-500/30">
                <SiteMap cowUnits={cowUnits} />
              </div>
            </div>

            {/* Availability Metric */}
            <div>
              <AvailabilityMetric
                availability={parseFloat(stats.availability as string)}
                affectedDevices={stats.totalAffectedDevices}
                lastUpdated={lastUpdated}
              />
            </div>
          </div>
        </div>

        {/* Full Width - Power Outages Table */}
        <div className="mt-8">
          <PowerOutagesTable tickets={powerTickets} />
        </div>

        {/* Summary Stats Footer */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-purple-500/30 p-4">
            <p className="text-xs text-purple-300 mb-2">Total Tickets</p>
            <p className="text-2xl font-bold text-white">{stats.totalTickets}</p>
          </Card>
          <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-purple-500/30 p-4">
            <p className="text-xs text-purple-300 mb-2">Total Outage Time</p>
            <p className="text-2xl font-bold text-yellow-400">
              {stats.totalOutageDuration}
            </p>
            <p className="text-xs text-purple-400 mt-1">minutes (8h)</p>
          </Card>
          <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-purple-500/30 p-4">
            <p className="text-xs text-purple-300 mb-2">System Status</p>
            <p className="text-2xl font-bold text-green-400">Operational</p>
          </Card>
          <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-purple-500/30 p-4">
            <p className="text-xs text-purple-300 mb-2">Next Review</p>
            <p className="text-lg font-bold text-white">15:30</p>
            <p className="text-xs text-purple-400 mt-1">Today</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
