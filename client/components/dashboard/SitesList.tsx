import type { FestivalSite } from "@/data/festivalData";

interface SitesListProps {
  sites: FestivalSite[];
  onSiteSelect?: (site: FestivalSite) => void;
}

export function SitesList({ sites, onSiteSelect }: SitesListProps) {
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "warning":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "critical":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  // Get technology badge color
  const getTechColor = (tech: string) => {
    switch (tech) {
      case "5G":
        return "bg-violet-500/20 text-violet-300 border-violet-500/30";
      case "4G":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "2G":
        return "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return "✓";
      case "warning":
        return "⚠";
      case "critical":
        return "✕";
      default:
        return "○";
    }
  };

  return (
    <div className="h-full bg-transparent backdrop-blur-none rounded-xl border-0 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-transparent border-b border-purple-200/30 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-800">Festival Sites</h3>
        <p className="text-xs text-slate-500 mt-1">{sites.length} locations</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2 p-3">
          {sites.map((site) => (
            <div
              key={site.id}
              onClick={() => onSiteSelect?.(site)}
              className="p-3 rounded-lg border border-purple-300/40 bg-white/40 hover:bg-white/60 hover:border-purple-400/50 cursor-pointer transition-all duration-200 group"
            >
              {/* Site header with status */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {site.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{site.location}</p>
                </div>
                <span className="text-lg leading-none">{getStatusIcon(site.status)}</span>
              </div>

              {/* Badges */}
              <div className="flex gap-2 flex-wrap">
                {/* Technology badge */}
                <span
                  className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getTechColor(
                    site.technology
                  )}`}
                >
                  {site.technology}
                </span>

                {/* Status badge */}
                <span
                  className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border capitalize ${getStatusColor(
                    site.status
                  )}`}
                >
                  {site.status}
                </span>
              </div>

              {/* Last update */}
              <div className="mt-2 pt-2 border-t border-slate-700/20">
                <p className="text-xs text-slate-500">
                  Updated: {new Date(site.lastUpdate).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
