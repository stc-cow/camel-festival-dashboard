import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { FestivalTicketsTable } from "./FestivalTicketsTable";
import type { FestivalTicket } from "@/data/festivalData";

interface TicketsTableOverlayProps {
  tickets: FestivalTicket[];
}

export function TicketsTableOverlay({ tickets }: TicketsTableOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/90 backdrop-blur-md rounded-lg px-4 py-2 border border-purple-200/50 text-xs font-bold text-black hover:bg-white transition-all flex items-center gap-2 shadow-md"
      >
        <span>Dispatch Tickets</span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronUp className="w-4 h-4" />
        )}
      </button>

      {/* Table - Collapsible */}
      {isOpen && (
        <div className="bg-white/95 backdrop-blur-md rounded-lg border border-purple-200/50 shadow-lg overflow-hidden max-h-64 overflow-y-auto">
          <FestivalTicketsTable tickets={tickets} />
        </div>
      )}
    </div>
  );
}
