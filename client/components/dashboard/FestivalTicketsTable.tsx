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


  return (
    <div className="w-full bg-transparent backdrop-blur-none rounded-xl overflow-hidden" style={{
      border: "3px solid rgb(168, 85, 247)",
      boxShadow: "inset 0 0 0 2px rgb(236, 72, 153), 0 0 0 1px rgb(168, 85, 247)"
    }}>
      {/* Header - One Line */}
      <div className="bg-transparent border-b-2 border-purple-500 px-3 py-1 flex items-center justify-between">
        <h3 className="text-xs font-bold text-black">
          Dispatch Tickets & Issues
        </h3>
        <p className="text-xs text-black font-bold" style={{ fontSize: "10px" }}>
          {tickets.length} ticket{tickets.length !== 1 ? "s" : ""} | Last updated:{" "}
          {new Date().toLocaleTimeString()}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border-0">
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          {/* Table Head */}
          <thead className="bg-transparent sticky top-0">
            <tr>
              <th className="px-2 py-1 text-left text-xs font-bold text-black uppercase tracking-wider" style={{ border: "1px solid rgb(168, 85, 247)" }}>
                COWName
              </th>
              <th className="px-2 py-1 text-left text-xs font-bold text-black uppercase tracking-wider" style={{ border: "1px solid rgb(168, 85, 247)" }}>
                TicketID
              </th>
              <th className="px-2 py-1 text-left text-xs font-bold text-black uppercase tracking-wider" style={{ border: "1px solid rgb(168, 85, 247)" }}>
                Issue
              </th>
              <th className="px-2 py-1 text-left text-xs font-bold text-black uppercase tracking-wider" style={{ border: "1px solid rgb(168, 85, 247)" }}>
                Severity
              </th>
              <th className="px-2 py-1 text-left text-xs font-bold text-black uppercase tracking-wider" style={{ border: "1px solid rgb(168, 85, 247)" }}>
                Status
              </th>
              <th className="px-2 py-1 text-left text-xs font-bold text-black uppercase tracking-wider" style={{ border: "1px solid rgb(168, 85, 247)" }}>
                CreatedAt
              </th>
              <th className="px-2 py-1 text-left text-xs font-bold text-black uppercase tracking-wider" style={{ border: "1px solid rgb(168, 85, 247)" }}>
                LastUpdate
              </th>
              <th className="px-2 py-1 text-left text-xs font-bold text-black uppercase tracking-wider" style={{ border: "1px solid rgb(168, 85, 247)" }}>
                Notes
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <tr key={ticket.id} className="bg-white/20 hover:bg-white/40 transition-colors duration-200">
                  {/* COWName */}
                  <td className="px-2 py-1" style={{ border: "1px solid rgb(168, 85, 247)" }}>
                    <p className="text-black font-bold text-xs">{ticket.siteName}</p>
                  </td>

                  {/* Ticket ID */}
                  <td className="px-2 py-1" style={{ border: "1px solid rgb(168, 85, 247)" }}>
                    <code className="text-xs font-bold text-black">
                      {ticket.id}
                    </code>
                  </td>

                  {/* Issue */}
                  <td className="px-2 py-1 max-w-xs" style={{ border: "1px solid rgb(168, 85, 247)" }}>
                    <p className="text-black font-bold text-xs truncate">{ticket.issue}</p>
                  </td>

                  {/* Severity */}
                  <td className="px-2 py-1" style={{ border: "1px solid rgb(168, 85, 247)" }}>
                    <span
                      className={`inline-flex items-center px-1 py-0.5 rounded text-xs font-medium border capitalize ${getSeverityColor(
                        ticket.severity
                      )}`}
                    >
                      {ticket.severity}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-2 py-1" style={{ border: "1px solid rgb(168, 85, 247)" }}>
                    <span
                      className={`inline-flex items-center px-1 py-0.5 rounded text-xs font-medium border capitalize ${getStatusColor(
                        ticket.status
                      )}`}
                    >
                      {ticket.status}
                    </span>
                  </td>

                  {/* Created At */}
                  <td className="px-2 py-1 text-black font-bold text-xs" style={{ border: "1px solid rgb(168, 85, 247)" }}>
                    {new Date(ticket.createdAt).toLocaleString()}
                  </td>

                  {/* Last Update */}
                  <td className="px-2 py-1 text-black font-bold text-xs" style={{ border: "1px solid rgb(168, 85, 247)" }}>
                    {new Date(ticket.updatedAt).toLocaleString()}
                  </td>

                  {/* Notes */}
                  <td className="px-2 py-1 max-w-sm" style={{ border: "1px solid rgb(168, 85, 247)" }}>
                    <p className="text-black font-bold text-xs truncate">
                      {ticket.dispatcherNotes}
                    </p>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-2 py-2 text-center" style={{ border: "1px solid rgb(168, 85, 247)" }}>
                  <p className="text-black font-bold text-xs">
                    No tickets at this time
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with stats */}
      <div className="bg-transparent px-3 py-1 grid grid-cols-4 gap-2 text-xs" style={{ borderTop: "2px solid rgb(168, 85, 247)" }}>
        <div>
          <span className="text-black font-bold text-xs">Total</span>
          <p className="font-bold text-black mt-0">{tickets.length}</p>
        </div>
        <div>
          <span className="text-black font-bold text-xs">Critical</span>
          <p className="font-bold text-black mt-0">
            {tickets.filter((t) => t.severity === "critical").length}
          </p>
        </div>
        <div>
          <span className="text-black font-bold text-xs">Open</span>
          <p className="font-bold text-black mt-0">
            {tickets.filter((t) => t.status === "open").length}
          </p>
        </div>
        <div>
          <span className="text-black font-bold text-xs">In Progress</span>
          <p className="font-bold text-black mt-0">
            {tickets.filter((t) => t.status === "in-progress").length}
          </p>
        </div>
      </div>
    </div>
  );
}
