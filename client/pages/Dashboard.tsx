import { useState } from "react";
import { SiteMap } from "@/components/dashboard/SiteMap";
import { PerformanceKPI } from "@/components/dashboard/PerformanceKPI";
import { COWUnitsTable } from "@/components/dashboard/COWUnitsTable";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Radio,
  Users,
  Activity,
  RefreshCw,
  Wifi,
  AlertTriangle,
} from "lucide-react";
import { cowUnits, getNetworkStats } from "@/data/cowNetworkData";

export default function Dashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const stats = getNetworkStats();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const networkMetrics = [
    {
      label: "Active COW Units",
      value: stats.activeCOWs,
      target: stats.totalCOWs,
      color: "#10B981",
      icon: <Radio className="w-5 h-5" />,
    },
    {
      label: "Avg Signal Strength",
      value: stats.avgSignalStrength,
      color: "#3B82F6",
      icon: <Wifi className="w-5 h-5" />,
      unit: "%",
    },
    {
      label: "Active Users",
      value: stats.totalActiveUsers,
      color: "#F59E0B",
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: "Network Uptime",
      value: stats.networkUptime,
      color: "#8B5CF6",
      icon: <Activity className="w-5 h-5" />,
      unit: "%",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <Radio className="w-8 h-8 text-blue-400" />
                GSM COW Network Dashboard
              </h1>
              <p className="text-slate-400 mt-1">
                Real-time monitoring of Cell on Wheel network performance (2G/4G/5G)
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2 bg-slate-700 hover:bg-slate-600 text-white"
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

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {stats.warningCOWs > 0 && (
          <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-300 mb-1">Network Alert</h3>
              <p className="text-sm text-amber-200">
                {stats.warningCOWs} COW unit{stats.warningCOWs > 1 ? "s" : ""} requiring attention
              </p>
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white">Network Performance</h2>
            <p className="text-sm text-slate-400">
              Key performance indicators across the COW network
            </p>
          </div>
          <PerformanceKPI metrics={networkMetrics} />
        </div>

        {/* Map and Quick Stats Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Network Coverage Map */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white">Network Coverage Map</h2>
              <p className="text-sm text-slate-400">
                COW unit locations and status
              </p>
            </div>
            <div className="h-96 rounded-lg overflow-hidden shadow-xl border border-slate-700">
              <SiteMap cowUnits={cowUnits} />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-2 space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white">Network Summary</h2>
              <p className="text-sm text-slate-400">
                Current network status snapshot
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30 p-6 hover:border-blue-600/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-300 mb-1">Total COW Units</p>
                    <div className="text-3xl font-bold text-blue-400">
                      {stats.totalCOWs}
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      {stats.activeCOWs} active, {stats.warningCOWs} warning
                    </p>
                  </div>
                  <div className="text-blue-600/40">
                    <Radio className="w-8 h-8" />
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-cyan-900/20 to-cyan-800/10 border-cyan-700/30 p-6 hover:border-cyan-600/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-cyan-300 mb-1">Avg Signal</p>
                    <div className="text-3xl font-bold text-cyan-400">
                      {stats.avgSignalStrength}%
                    </div>
                    <p className="text-xs text-cyan-600 mt-1">
                      Network coverage quality
                    </p>
                  </div>
                  <div className="text-cyan-600/40">
                    <Wifi className="w-8 h-8" />
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-700/30 p-6 hover:border-purple-600/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-300 mb-1">Active Users</p>
                    <div className="text-3xl font-bold text-purple-400">
                      {(stats.totalActiveUsers / 1000).toFixed(1)}K
                    </div>
                    <p className="text-xs text-purple-600 mt-1">
                      Connected devices
                    </p>
                  </div>
                  <div className="text-purple-600/40">
                    <Users className="w-8 h-8" />
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border-emerald-700/30 p-6 hover:border-emerald-600/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-300 mb-1">Uptime</p>
                    <div className="text-3xl font-bold text-emerald-400">
                      {stats.networkUptime}%
                    </div>
                    <p className="text-xs text-emerald-600 mt-1">
                      Network availability
                    </p>
                  </div>
                  <div className="text-emerald-600/40">
                    <Activity className="w-8 h-8" />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* COW Units Table */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white">COW Units Details</h2>
            <p className="text-sm text-slate-400">
              Complete list of all Cell on Wheel units with performance metrics
            </p>
          </div>
          <COWUnitsTable cowUnits={cowUnits} />
        </div>
      </div>
    </div>
  );
}
