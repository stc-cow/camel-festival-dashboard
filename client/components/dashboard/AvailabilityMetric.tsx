import { Card } from "@/components/ui/card";

interface AvailabilityMetricProps {
  availability: number;
  affectedDevices: number;
  lastUpdated: string;
}

export function AvailabilityMetric({
  availability,
  affectedDevices,
  lastUpdated,
}: AvailabilityMetricProps) {
  const getAvailabilityColor = (avail: number) => {
    if (avail >= 99) return "text-green-400";
    if (avail >= 95) return "text-yellow-400";
    if (avail >= 90) return "text-orange-400";
    return "text-red-400";
  };

  const getProgressColor = (avail: number) => {
    if (avail >= 99) return "bg-green-500";
    if (avail >= 95) return "bg-yellow-500";
    if (avail >= 90) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-4">
      {/* Main Availability Card */}
      <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-purple-500/30 p-8 text-center">
        <div className="mb-4">
          <p className="text-purple-300 text-sm mb-2">System Availability</p>
          <div className={cn("text-5xl font-bold", getAvailabilityColor(availability))}>
            {availability.toFixed(2)}%
          </div>
        </div>

        {/* Circular Progress */}
        <svg className="w-24 h-24 mx-auto mb-4" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#A855F7"
            strokeWidth="8"
            opacity="0.2"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#00FF00"
            strokeWidth="8"
            strokeDasharray={`${(availability / 100) * 282.7} 282.7`}
            strokeLinecap="round"
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "50px 50px",
              transition: "stroke-dasharray 0.5s ease",
            }}
          />
        </svg>

        <div className="text-xs text-purple-300">
          Last updated: {lastUpdated}
        </div>
      </Card>

      {/* Affected Devices Info */}
      <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-purple-500/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-300 text-xs mb-1">
              Affected Devices
            </p>
            <p className="text-2xl font-bold text-red-400">{affectedDevices}</p>
          </div>
          <div className="text-right">
            <p className="text-purple-300 text-xs">Impact</p>
            <p className="text-xl font-bold text-yellow-400">High</p>
          </div>
        </div>
      </Card>

      {/* Status Overview */}
      <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-purple-500/30 p-4">
        <h4 className="text-sm font-bold text-purple-200 mb-3">
          Network Status
        </h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-purple-300">Operational</span>
            <span className="ml-auto text-xs text-green-400 font-semibold">
              94%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="text-xs text-purple-300">Degraded</span>
            <span className="ml-auto text-xs text-yellow-400 font-semibold">
              4%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-xs text-purple-300">Down</span>
            <span className="ml-auto text-xs text-red-400 font-semibold">2%</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
