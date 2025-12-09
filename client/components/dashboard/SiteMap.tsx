import { cn } from "@/lib/utils";

interface COWUnitPower {
  id: string;
  name: string;
  status: "active" | "warning" | "inactive";
  latitude: number;
  longitude: number;
  power: "critical" | "high" | "normal";
}

interface SiteMapProps {
  cowUnits: COWUnitPower[];
}

export function SiteMap({ cowUnits }: SiteMapProps) {
  // Normalize coordinates to map dimensions
  const minLat = 25.59;
  const maxLat = 25.74;
  const minLon = 46.81;
  const maxLon = 46.92;

  const getMapCoordinates = (lat: number, lon: number) => {
    const x = ((lon - minLon) / (maxLon - minLon)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return { x, y };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "fill-green-500 animate-pulse";
      case "warning":
        return "fill-amber-500";
      case "inactive":
        return "fill-red-500";
      default:
        return "fill-blue-500";
    }
  };

  const activeCOWs = cowUnits.filter((u) => u.status === "active").length;
  const warningCOWs = cowUnits.filter((u) => u.status === "warning").length;

  return (
    <div className="h-full bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 rounded-lg overflow-hidden relative">
      {/* Network map background */}
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Gradient background */}
        <defs>
          <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#0F172A", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#1E293B", stopOpacity: 1 }} />
          </linearGradient>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path
              d="M 10 0 L 0 0 0 10"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="0.1"
              opacity="0.3"
            />
          </pattern>
        </defs>

        {/* Background */}
        <rect width="100" height="100" fill="url(#mapGradient)" />
        <rect width="100" height="100" fill="url(#grid)" />

        {/* COW Unit markers */}
        {cowUnits.map((unit) => {
          const coords = getMapCoordinates(unit.latitude, unit.longitude);
          return (
            <g key={unit.name}>
              {/* Pulse effect for active units */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r="2.5"
                className={cn(
                  "opacity-50",
                  unit.status === "active" && "animate-pulse"
                )}
                fill={
                  unit.status === "active"
                    ? "#22C55E"
                    : unit.status === "warning"
                      ? "#F59E0B"
                      : "#EF4444"
                }
              />
              {/* Main marker */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r="1.5"
                className={getStatusColor(unit.status)}
              />
              {/* Label on hover (text element) */}
              <title>{unit.name}</title>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-950 via-purple-950/80 to-transparent p-4">
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-purple-200">Normal Power</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="text-purple-200">High Alert</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-purple-200">Critical</span>
          </div>
        </div>
      </div>

      {/* COW info overlay */}
      <div className="absolute top-4 left-4 right-4 flex flex-col gap-2 max-h-28 overflow-y-auto">
        {cowUnits.slice(0, 3).map((unit) => {
          const powerColor =
            unit.power === "critical"
              ? "bg-red-500/20 border-red-400/30"
              : unit.power === "high"
                ? "bg-yellow-500/20 border-yellow-400/30"
                : "bg-green-500/20 border-green-400/30";

          return (
            <div
              key={unit.name}
              className={cn(
                "px-3 py-2 rounded-lg text-xs backdrop-blur-sm border",
                powerColor
              )}
            >
              <div className="font-semibold text-white">{unit.name}</div>
              <div className="text-purple-200 text-xs">
                Power: {unit.power === "critical" ? "🔴 Critical" : unit.power === "high" ? "🟡 High" : "🟢 Normal"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
