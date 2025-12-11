import type { FestivalSite } from "@/data/festivalData";

interface FestivalSiteMapProps {
  sites: FestivalSite[];
  onSiteSelect?: (site: FestivalSite) => void;
}

export function FestivalSiteMap({
  sites,
  onSiteSelect,
}: FestivalSiteMapProps) {

  // Festival boundary coordinates (Al Ula area)
  const mapCenter = { lat: 25.633, lng: 46.828 };
  const mapBounds = {
    north: 25.645,
    south: 25.620,
    east: 46.845,
    west: 46.810,
  };

  // Normalize coordinates to SVG map (100x100)
  const getMapCoordinates = (lat: number, lng: number) => {
    const latRange = mapBounds.north - mapBounds.south;
    const lngRange = mapBounds.east - mapBounds.west;

    const x = ((lng - mapBounds.west) / lngRange) * 100;
    const y = ((mapBounds.north - lat) / latRange) * 100;

    return { x, y };
  };

  // Get marker color based on status
  const getMarkerColor = (status: string): string => {
    switch (status) {
      case "operational":
        return "#10B981"; // green
      case "warning":
        return "#F59E0B"; // amber
      case "critical":
        return "#EF4444"; // red
      default:
        return "#6B7280"; // gray
    }
  };

  // Get technology badge color
  const getTechColor = (tech: string): string => {
    switch (tech) {
      case "5G":
        return "#8B5CF6"; // violet
      case "4G":
        return "#3B82F6"; // blue
      case "2G":
        return "#6366F1"; // indigo
      default:
        return "#9CA3AF"; // gray
    }
  };

  // Count sites by status
  const statusCounts = {
    operational: sites.filter((s) => s.status === "operational").length,
    warning: sites.filter((s) => s.status === "warning").length,
    critical: sites.filter((s) => s.status === "critical").length,
  };

  // Count sites by technology
  const techCounts = {
    "5G": sites.filter((s) => s.technology === "5G").length,
    "4G": sites.filter((s) => s.technology === "4G").length,
    "2G": sites.filter((s) => s.technology === "2G").length,
  };

  return (
    <div className="w-full h-full bg-white/60 backdrop-blur-sm rounded-xl overflow-hidden relative border border-purple-200/30">
      {/* SVG Map */}
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Gradients and Patterns */}
        <defs>
          <linearGradient id="mapBackground" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#F5F3FF", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#E8E4F8", stopOpacity: 1 }} />
          </linearGradient>

          {/* Satellite texture */}
          <pattern id="satellitePattern" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill="#1E293B" />
            <circle cx="2" cy="2" r="0.5" fill="#334155" opacity="0.3" />
          </pattern>

          {/* Glow filters */}
          <filter id="siteGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="criticalGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.8" />
            </feComponentTransfer>
          </filter>
        </defs>

        {/* Background */}
        <rect width="100" height="100" fill="url(#mapBackground)" />
        <rect width="100" height="100" fill="url(#satellitePattern)" />

        {/* Festival boundary (optional grid/boundary) */}
        <rect
          x="5"
          y="5"
          width="90"
          height="90"
          fill="none"
          stroke="#475569"
          strokeWidth="0.5"
          opacity="0.3"
          strokeDasharray="2,2"
        />

        {/* Sites */}
        {sites.map((site) => {
          const coords = getMapCoordinates(site.latitude, site.longitude);
          const color = getMarkerColor(site.status);

          return (
            <g key={site.id} className="cursor-pointer" onClick={() => onSiteSelect?.(site)}>
              {/* Outer glow for critical/warning */}
              {(site.status === "critical" || site.status === "warning") && (
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="3"
                  fill={color}
                  opacity="0.2"
                  className="animate-pulse"
                />
              )}

              {/* Main marker circle */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r="1.5"
                fill={color}
                filter="url(#siteGlow)"
              />

              {/* Border ring */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r="1.8"
                fill="none"
                stroke={color}
                strokeWidth="0.2"
                opacity="0.5"
              />

              {/* Technology indicator (small ring) */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r="2.3"
                fill="none"
                stroke={getTechColor(site.technology)}
                strokeWidth="0.15"
                opacity="0.4"
              />

              {/* X mark for critical status */}
              {site.status === "critical" && (
                <>
                  <line
                    x1={coords.x - 1}
                    y1={coords.y - 1}
                    x2={coords.x + 1}
                    y2={coords.y + 1}
                    stroke={color}
                    strokeWidth="0.2"
                  />
                  <line
                    x1={coords.x + 1}
                    y1={coords.y - 1}
                    x2={coords.x - 1}
                    y2={coords.y + 1}
                    stroke={color}
                    strokeWidth="0.2"
                  />
                </>
              )}

              {/* Hover tooltip */}
              <title>
                {site.name} ({site.technology}) - {site.status}
              </title>
            </g>
          );
        })}

        {/* Center marker for map center */}
        <circle
          cx="50"
          cy="50"
          r="0.5"
          fill="#64748B"
          opacity="0.3"
        />
      </svg>

      {/* Legend - Bottom Left */}
      <div className="absolute bottom-4 left-4 bg-slate-950/60 backdrop-blur-md rounded-lg p-3 border border-slate-700/50">
        <div className="text-xs font-semibold text-slate-300 mb-2">Status</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-slate-400">Operational ({statusCounts.operational})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-slate-400">Warning ({statusCounts.warning})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-slate-400">Critical ({statusCounts.critical})</span>
          </div>
        </div>
      </div>

      {/* Technology Legend - Bottom Right */}
      <div className="absolute bottom-4 right-4 bg-slate-950/60 backdrop-blur-md rounded-lg p-3 border border-slate-700/50">
        <div className="text-xs font-semibold text-slate-300 mb-2">Technology</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet-500" />
            <span className="text-slate-400">5G ({techCounts["5G"]})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-slate-400">4G ({techCounts["4G"]})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-slate-400">2G ({techCounts["2G"]})</span>
          </div>
        </div>
      </div>

      {/* Location name overlay - Top */}
      <div className="absolute top-4 left-4 bg-slate-950/60 backdrop-blur-md rounded-lg px-3 py-2 border border-slate-700/50">
        <div className="text-xs text-slate-400">Festival Area</div>
        <div className="text-sm font-semibold text-white">Al Ula, Saudi Arabia</div>
      </div>
    </div>
  );
}
