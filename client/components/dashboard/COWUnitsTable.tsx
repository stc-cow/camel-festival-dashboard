import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { COWUnit } from "@/data/cowNetworkData";
import { Signal, MapPin, Users, TrendingUp } from "lucide-react";

interface COWUnitsTableProps {
  cowUnits: COWUnit[];
}

export function COWUnitsTable({ cowUnits }: COWUnitsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "warning":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "inactive":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getSignalQuality = (strength: number) => {
    if (strength >= 90) return "Excellent";
    if (strength >= 75) return "Good";
    if (strength >= 60) return "Fair";
    return "Poor";
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900/50">
              <th className="px-6 py-4 text-left font-semibold text-slate-300">
                COW ID
              </th>
              <th className="px-6 py-4 text-left font-semibold text-slate-300">
                Technology
              </th>
              <th className="px-6 py-4 text-left font-semibold text-slate-300">
                Signal Strength
              </th>
              <th className="px-6 py-4 text-left font-semibold text-slate-300">
                Coverage
              </th>
              <th className="px-6 py-4 text-left font-semibold text-slate-300">
                Active Users
              </th>
              <th className="px-6 py-4 text-left font-semibold text-slate-300">
                Data Usage
              </th>
              <th className="px-6 py-4 text-left font-semibold text-slate-300">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {cowUnits.map((unit, index) => (
              <tr
                key={unit.name}
                className={cn(
                  "hover:bg-slate-800/50 transition-colors",
                  index % 2 === 0 && "bg-slate-900/30"
                )}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-600" />
                    <span className="font-mono font-semibold text-slate-200">
                      {unit.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20">
                    <TrendingUp className="w-3 h-3 text-blue-400" />
                    <span className="text-blue-300 text-xs font-medium">
                      {unit.tech}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Signal className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="text-slate-200 font-semibold">
                        {unit.signalStrength}%
                      </div>
                      <div className="text-xs text-slate-500">
                        {getSignalQuality(unit.signalStrength)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <div className="flex items-center gap-1">
                      <span className="text-emerald-300 font-semibold">
                        {unit.coverage}%
                      </span>
                      <div className="w-16 bg-slate-700 rounded h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full"
                          style={{ width: `${unit.coverage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-300 font-semibold">
                      {unit.activeUsers.toLocaleString()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-slate-300">
                    <div className="font-semibold">{unit.dataUsage}%</div>
                    <div className="w-12 bg-slate-700 rounded h-1 mt-1 overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all",
                          unit.dataUsage > 90
                            ? "bg-red-500"
                            : unit.dataUsage > 70
                              ? "bg-amber-500"
                              : "bg-green-500"
                        )}
                        style={{ width: `${unit.dataUsage}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border",
                      getStatusColor(unit.status)
                    )}
                  >
                    {getStatusLabel(unit.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer stats */}
      <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-700 flex justify-between text-sm flex-wrap gap-4">
        <div className="text-slate-400">
          Showing <span className="text-white font-semibold">{cowUnits.length}</span> COW units
        </div>
        <div className="flex gap-6 text-xs flex-wrap">
          <div>
            <span className="text-slate-500">Avg Signal: </span>
            <span className="text-cyan-400 font-semibold">
              {Math.round(
                cowUnits.reduce((sum, u) => sum + u.signalStrength, 0) /
                  cowUnits.length
              )}
              %
            </span>
          </div>
          <div>
            <span className="text-slate-500">Total Active Users: </span>
            <span className="text-purple-400 font-semibold">
              {cowUnits
                .reduce((sum, u) => sum + u.activeUsers, 0)
                .toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-slate-500">Avg Coverage: </span>
            <span className="text-emerald-400 font-semibold">
              {Math.round(
                cowUnits.reduce((sum, u) => sum + u.coverage, 0) /
                  cowUnits.length
              )}
              %
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
