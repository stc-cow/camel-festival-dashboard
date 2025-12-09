import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface Ticket {
  id: string;
  ticketNumber: string;
  site: string;
  status: "sold" | "available" | "reserved" | "cancelled";
  price: number;
  purchaseDate: string;
  visitorName?: string;
  email?: string;
}

interface TicketsTableProps {
  tickets: Ticket[];
}

export function TicketsTable({ tickets }: TicketsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "sold":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "reserved":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "available":
        return "bg-slate-500/10 text-slate-300 border-slate-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900/50">
              <th className="px-6 py-4 text-left font-semibold text-slate-300">
                Ticket #
              </th>
              <th className="px-6 py-4 text-left font-semibold text-slate-300">
                Site
              </th>
              <th className="px-6 py-4 text-left font-semibold text-slate-300">
                Visitor
              </th>
              <th className="px-6 py-4 text-left font-semibold text-slate-300">
                Price
              </th>
              <th className="px-6 py-4 text-left font-semibold text-slate-300">
                Date
              </th>
              <th className="px-6 py-4 text-left font-semibold text-slate-300">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {tickets.map((ticket, index) => (
              <tr
                key={ticket.id}
                className={cn(
                  "hover:bg-slate-800/50 transition-colors",
                  index % 2 === 0 && "bg-slate-900/30",
                )}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-600" />
                    <span className="font-mono text-slate-200">
                      {ticket.ticketNumber}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-300">{ticket.site}</td>
                <td className="px-6 py-4">
                  <div className="text-slate-300">
                    {ticket.visitorName ? (
                      <>
                        <div className="font-medium">{ticket.visitorName}</div>
                        <div className="text-xs text-slate-500">
                          {ticket.email}
                        </div>
                      </>
                    ) : (
                      <span className="text-slate-500 italic">Unassigned</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-emerald-400 font-semibold">
                    {ticket.price} SAR
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-400 text-xs">
                  {new Date(ticket.purchaseDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border",
                      getStatusColor(ticket.status),
                    )}
                  >
                    {getStatusLabel(ticket.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer stats */}
      <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-700 flex justify-between text-sm">
        <div className="text-slate-400">
          Showing <span className="text-white font-semibold">{tickets.length}</span> tickets
        </div>
        <div className="flex gap-6 text-xs">
          <div>
            <span className="text-slate-500">Total Revenue: </span>
            <span className="text-emerald-400 font-semibold">
              {tickets
                .filter((t) => t.status === "sold")
                .reduce((sum, t) => sum + t.price, 0)
                .toLocaleString()}{" "}
              SAR
            </span>
          </div>
          <div>
            <span className="text-slate-500">Conversion Rate: </span>
            <span className="text-blue-400 font-semibold">
              {Math.round(
                (tickets.filter((t) => t.status === "sold").length /
                  tickets.length) *
                  100,
              )}
              %
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
