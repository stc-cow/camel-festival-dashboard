import { Card } from "@/components/ui/card";
import { PowerTicket } from "@/data/powerOutageData";
import { cn } from "@/lib/utils";

interface PowerOutagesTableProps {
  tickets: PowerTicket[];
}

export function PowerOutagesTable({ tickets }: PowerOutagesTableProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "high":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "low":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "text-red-400";
      case "in-progress":
        return "text-yellow-400";
      case "resolved":
        return "text-green-400";
      default:
        return "text-slate-400";
    }
  };

  const getTypeIcon = (type: string) => {
    return type === "outage" ? "⚡" : "🔌";
  };

  return (
    <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-purple-500/30 overflow-hidden">
      <div className="p-4 border-b border-purple-500/20">
        <h3 className="text-sm font-bold text-purple-200">Running SA TEs</h3>
        <p className="text-xs text-purple-400 mt-1">
          Active Service Tickets and Events
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-purple-500/20 bg-purple-900/30">
              <th className="px-4 py-3 text-left text-purple-300 font-semibold">
                Type
              </th>
              <th className="px-4 py-3 text-left text-purple-300 font-semibold">
                Ticket ID
              </th>
              <th className="px-4 py-3 text-left text-purple-300 font-semibold">
                Location
              </th>
              <th className="px-4 py-3 text-left text-purple-300 font-semibold">
                Severity
              </th>
              <th className="px-4 py-3 text-left text-purple-300 font-semibold">
                Duration (min)
              </th>
              <th className="px-4 py-3 text-left text-purple-300 font-semibold">
                Status
              </th>
              <th className="px-4 py-3 text-left text-purple-300 font-semibold">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-500/10">
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="hover:bg-purple-900/20 transition-colors"
              >
                <td className="px-4 py-3">
                  <span className="text-lg">{getTypeIcon(ticket.type)}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-purple-300">
                    {ticket.id}
                  </span>
                </td>
                <td className="px-4 py-3 text-purple-300">{ticket.location}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "px-2 py-1 rounded border text-xs font-medium",
                      getSeverityColor(ticket.severity)
                    )}
                  >
                    {ticket.severity.charAt(0).toUpperCase() +
                      ticket.severity.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3 text-purple-300">
                  {ticket.duration || 0}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "font-semibold capitalize",
                      getStatusColor(ticket.status)
                    )}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-purple-400 text-xs">
                  {new Date(ticket.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 bg-purple-900/20 border-t border-purple-500/20 text-xs text-purple-400">
        Showing {tickets.length} active tickets
      </div>
    </Card>
  );
}
