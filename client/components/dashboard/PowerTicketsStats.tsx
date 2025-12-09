import { Card } from "@/components/ui/card";
import { AlertTriangle, AlertCircle, AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PowerTicketsStatsProps {
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  openCount: number;
  inProgressCount: number;
}

export function PowerTicketsStats({
  criticalCount,
  highCount,
  mediumCount,
  lowCount,
  openCount,
  inProgressCount,
}: PowerTicketsStatsProps) {
  return (
    <div className="space-y-6">
      {/* Running Power Tickets Section */}
      <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-purple-500/30 p-6">
        <h3 className="text-sm font-bold text-purple-200 mb-4">
          Running Power Tickets
        </h3>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: "Critical", count: criticalCount, color: "bg-red-600" },
            { label: "High", count: highCount, color: "bg-orange-600" },
            { label: "Medium", count: mediumCount, color: "bg-yellow-600" },
            { label: "Low", count: lowCount, color: "bg-blue-600" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-purple-400/30 p-3 bg-purple-950/30 hover:bg-purple-900/40 transition-colors"
            >
              <div className="text-xs text-purple-300 mb-1">{item.label}</div>
              <div className={cn("text-2xl font-bold text-white")}>
                {item.count}
              </div>
              <div className={cn("w-full h-1 rounded mt-2", item.color)} />
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-purple-500/20 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-purple-300 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-red-400" />
              Open
            </span>
            <span className="text-white font-semibold">{openCount}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-purple-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-400" />
              In Progress
            </span>
            <span className="text-white font-semibold">{inProgressCount}</span>
          </div>
        </div>
      </Card>

      {/* Power Alarms and Outages */}
      <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-purple-500/30 p-6">
        <h3 className="text-sm font-bold text-purple-200 mb-4">
          Power Alarms and Outages Last 8 hrs
        </h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          <div className="text-xs text-purple-300 p-2 rounded bg-purple-950/30">
            COW076 - Critical Power Loss
          </div>
          <div className="text-xs text-purple-300 p-2 rounded bg-purple-950/30">
            COW022 - High Voltage Spike
          </div>
          <div className="text-xs text-purple-300 p-2 rounded bg-purple-950/30">
            COW188 - Power Outage
          </div>
          <div className="text-xs text-purple-300 p-2 rounded bg-purple-950/30">
            COW094 - Battery Low
          </div>
        </div>
      </Card>

      {/* Recorded Changes and Power Loss */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-purple-500/30 p-4">
          <div className="text-xs text-purple-300 mb-2">
            Recorded Changes Last 8 hrs
          </div>
          <div className="text-3xl font-bold text-white">0</div>
        </Card>
        <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-purple-500/30 p-4">
          <div className="text-xs text-purple-300 mb-2">
            Recorded Power Loss Last 8 hrs
          </div>
          <div className="text-3xl font-bold text-white">0</div>
        </Card>
      </div>
    </div>
  );
}
