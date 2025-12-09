import { cn } from "@/lib/utils";

interface Site {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: "active" | "inactive" | "warning";
  ticketsAvailable: number;
  ticketsSold: number;
}

interface SiteMapProps {
  sites: Site[];
}

export function SiteMap({ sites }: SiteMapProps) {
  // Normalize coordinates to map dimensions (0-100% for SVG)
  const minLat = 24.8;
  const maxLat = 25.2;
  const minLon = 46.6;
  const maxLon = 47.0;

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

  return (
    <div className="h-full bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 rounded-lg overflow-hidden relative">
      {/* Satellite map background with grid */}
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {/* Water/background gradient representation */}
        <defs>
          <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#0F172A", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#1E293B", stopOpacity: 1 }} />
          </linearGradient>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#3B82F6" strokeWidth="0.1" opacity="0.3" />
          </pattern>
        </defs>

        {/* Background */}
        <rect width="100" height="100" fill="url(#mapGradient)" />
        <rect width="100" height="100" fill="url(#grid)" />

        {/* Site markers */}
        {sites.map((site) => {
          const coords = getMapCoordinates(site.latitude, site.longitude);
          return (
            <g key={site.id}>
              {/* Pulse effect */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r="2.5"
                className={cn(
                  "opacity-50",
                  site.status === "active" && "animate-pulse",
                )}
                fill={
                  site.status === "active"
                    ? "#22C55E"
                    : site.status === "warning"
                      ? "#F59E0B"
                      : "#EF4444"
                }
              />
              {/* Main marker */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r="1.5"
                className={getStatusColor(site.status)}
              />
            </g>
          );
        })}
      </svg>

      {/* Legend and site info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4">
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-slate-300">Active Sites</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-slate-300">Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-slate-300">Inactive</span>
          </div>
        </div>
      </div>

      {/* Site info tooltip on hover */}
      <div className="absolute top-4 left-4 right-4 flex flex-col gap-2 max-h-32 overflow-y-auto">
        {sites.map((site) => (
          <div
            key={site.id}
            className={cn(
              "px-3 py-2 rounded-lg text-xs backdrop-blur-sm",
              site.status === "active" && "bg-green-500/20 border border-green-400/30",
              site.status === "warning" && "bg-amber-500/20 border border-amber-400/30",
              site.status === "inactive" && "bg-red-500/20 border border-red-400/30",
            )}
          >
            <div className="font-semibold text-white">{site.name}</div>
            <div className="text-slate-300 text-xs">
              {site.ticketsSold} / {site.ticketsAvailable} tickets
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
