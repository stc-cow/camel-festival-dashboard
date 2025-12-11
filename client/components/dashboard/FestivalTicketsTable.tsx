import type { FestivalTicket } from "@/data/festivalData";

interface FestivalTicketsTableProps {
  tickets: FestivalTicket[];
}

export function FestivalTicketsTable({ tickets }: FestivalTicketsTableProps) {
  // Get severity badge color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "high":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      case "medium":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "low":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "in-progress":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "resolved":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  // Format time difference
  const getTimeString = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="w-full bg-transparent backdrop-blur-none rounded-xl border-0 overflow-hidden">
      {/* Header */}
      <div className="bg-transparent border-b border-purple-200/30 px-6 py-4">
        <h3 className="text-sm font-bold text-black">
          Dispatch Tickets & Issues
        </h3>
        <p className="text-xs text-black font-bold mt-1">
          {tickets.length} ticket{tickets.length !== 1 ? "s" : ""} | Last updated:{" "}
          {new Date().toLocaleTimeString()}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* Table Head */}
          <thead className="bg-transparent border-b border-purple-200/30 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                Ticket ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                Site
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                Issue
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                Severity
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                Notes
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-purple-200/30">
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="bg-white/20 hover:bg-white/40 transition-colors duration-200"
                >
                  {/* Ticket ID */}
                  <td className="px-6 py-3">
                    <code className="text-xs font-bold text-black">
                      {ticket.id}
                    </code>
                  </td>

                  {/* Site Name */}
                  <td className="px-6 py-3">
                    <div className="text-black font-bold text-xs">{ticket.siteName}</div>
                  </td>

                  {/* Issue */}
                  <td className="px-6 py-3 max-w-xs">
                    <p className="text-black font-bold text-xs truncate">{ticket.issue}</p>
                  </td>

                  {/* Severity */}
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border capitalize ${getSeverityColor(
                        ticket.severity
                      )}`}
                    >
                      {ticket.severity}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border capitalize ${getStatusColor(
                        ticket.status
                      )}`}
                    >
                      {ticket.status}
                    </span>
                  </td>

                  {/* Created Time */}
                  <td className="px-6 py-3 text-slate-600 text-xs">
                    {getTimeString(ticket.createdAt)}
                  </td>

                  {/* Notes */}
                  <td className="px-6 py-3 max-w-sm">
                    <p className="text-slate-600 text-xs truncate">
                      {ticket.dispatcherNotes}
                    </p>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center">
                  <p className="text-slate-600 text-sm">
                    No tickets at this time
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with stats */}
      <div className="bg-transparent border-t border-purple-200/30 px-6 py-3 grid grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-600">Total</span>
          <p className="font-semibold text-slate-800 mt-1">{tickets.length}</p>
        </div>
        <div>
          <span className="text-slate-600">Critical</span>
          <p className="font-semibold text-red-600 mt-1">
            {tickets.filter((t) => t.severity === "critical").length}
          </p>
        </div>
        <div>
          <span className="text-slate-600">Open</span>
          <p className="font-semibold text-orange-600 mt-1">
            {tickets.filter((t) => t.status === "open").length}
          </p>
        </div>
        <div>
          <span className="text-slate-600">In Progress</span>
          <p className="font-semibold text-blue-600 mt-1">
            {tickets.filter((t) => t.status === "in-progress").length}
          </p>
        </div>
      </div>
    </div>
  );
}
