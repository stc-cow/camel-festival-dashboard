import type { FestivalTicket, FestivalSite } from "@/data/festivalData";

interface SiteMetricsCardProps {
  sites: FestivalSite[];
  tickets: FestivalTicket[];
}

export function SiteMetricsCard({ sites, tickets }: SiteMetricsCardProps) {
  const getDegradedTickets = () => {
    return tickets.filter(
      (t) => t.severity === "medium" || t.severity === "high" || t.severity === "critical",
    ).length;
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-xs">
      {/* Total Sites */}
      <div className="w-full bg-white/10 backdrop-blur-sm rounded-lg border border-white/80 shadow-lg p-5" style={{ boxShadow: "0 0 12px rgba(168, 85, 247, 0.6), inset 0 0 0 1px rgba(168, 85, 247, 0.4)" }}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-black">Total Sites</h3>
          <div className="text-3xl font-bold text-blue-600">
            {sites.length}
          </div>
        </div>
      </div>

      {/* Degraded Tickets */}
      <div className="w-full bg-white/10 backdrop-blur-sm rounded-lg border border-white/80 shadow-lg p-5" style={{ boxShadow: "0 0 12px rgba(168, 85, 247, 0.6), inset 0 0 0 1px rgba(168, 85, 247, 0.4)" }}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-black">Degraded Tickets</h3>
          <div className="text-3xl font-bold text-orange-600">
            {getDegradedTickets()}
          </div>
        </div>
      </div>
    </div>
  );
}
