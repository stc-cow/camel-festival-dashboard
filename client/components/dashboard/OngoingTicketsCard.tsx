import type { FestivalTicket } from "@/data/festivalData";

interface OngoingTicketsCardProps {
  tickets: FestivalTicket[];
}

export function OngoingTicketsCard({ tickets }: OngoingTicketsCardProps) {
  const getSeverityCount = (severity: string) => {
    return tickets.filter((t) => t.severity === severity).length;
  };

  const getTotalOutageTickets = () => {
    return tickets.filter((t) => t.severity === "critical" || t.severity === "high").length;
  };

  const getTotalPowerTickets = () => {
    return tickets.length;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return { bg: "bg-red-500/30", text: "text-red-600", border: "border-red-400" };
      case "high":
        return { bg: "bg-orange-500/30", text: "text-orange-600", border: "border-orange-400" };
      case "medium":
        return { bg: "bg-amber-500/30", text: "text-amber-600", border: "border-amber-400" };
      case "low":
        return { bg: "bg-blue-500/30", text: "text-blue-600", border: "border-blue-400" };
      default:
        return { bg: "bg-slate-500/30", text: "text-slate-600", border: "border-slate-400" };
    }
  };

  const severities = [
    { label: "Critical", value: "critical" },
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
  ];

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Ongoing Power Tickets */}
      <div className="w-full bg-white/80 backdrop-blur-sm rounded-lg border border-purple-200/50 shadow-md p-3">
        {/* Title */}
        <h3 className="text-xs font-bold text-black mb-2 whitespace-nowrap">
          Ongoing Power Tickets:
        </h3>

        {/* Severity Cards Grid */}
        <div className="grid grid-cols-2 gap-1.5">
          {severities.map((sev) => {
            const count = getSeverityCount(sev.value);
            const colors = getSeverityColor(sev.value);

            return (
              <div
                key={sev.value}
                className={`${colors.bg} border ${colors.border} rounded px-2 py-1.5 text-center`}
              >
                <div className={`text-xs font-bold ${colors.text}`}>
                  {sev.label}
                </div>
                <div className={`text-lg font-bold ${colors.text}`}>
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Total Outage Tickets */}
      <div className="w-full bg-white/80 backdrop-blur-sm rounded-lg border border-red-200/50 shadow-md p-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-black">Total Outage Tickets</h3>
          <div className="text-2xl font-bold text-red-600">{getTotalOutageTickets()}</div>
        </div>
      </div>

      {/* Total Power Tickets */}
      <div className="w-full bg-white/80 backdrop-blur-sm rounded-lg border border-purple-200/50 shadow-md p-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-black">Total Power Tickets</h3>
          <div className="text-2xl font-bold text-purple-600">{getTotalPowerTickets()}</div>
        </div>
      </div>
    </div>
  );
}
