// Festival Sites Data
export interface FestivalSite {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  technology: string;
  status: "operational" | "warning" | "critical";
  lastUpdate: string;
}

// Ticket Data
export interface FestivalTicket {
  id: string;
  siteId: string;
  siteName: string;
  issue: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "in-progress" | "resolved";
  createdAt: string;
  updatedAt: string;
  dispatcherNotes: string;
}
