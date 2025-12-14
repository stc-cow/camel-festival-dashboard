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


// Calculate Festival Statistics
export function getFestivalStats() {
  const totalSites = festivalSites.length;
  const operationalSites = festivalSites.filter(
    (s) => s.status === "operational",
  ).length;
  const warningSites = festivalSites.filter(
    (s) => s.status === "warning",
  ).length;
  const criticalSites = festivalSites.filter(
    (s) => s.status === "critical",
  ).length;

  const availability = ((operationalSites / totalSites) * 100).toFixed(2);

  const totalTickets = festivalTickets.length;
  const openTickets = festivalTickets.filter((t) => t.status === "open").length;
  const inProgressTickets = festivalTickets.filter(
    (t) => t.status === "in-progress",
  ).length;
  const resolvedTickets = festivalTickets.filter(
    (t) => t.status === "resolved",
  ).length;

  const criticalTickets = festivalTickets.filter(
    (t) => t.severity === "critical",
  ).length;
  const highTickets = festivalTickets.filter(
    (t) => t.severity === "high",
  ).length;

  return {
    totalSites,
    operationalSites,
    warningSites,
    criticalSites,
    availability,
    totalTickets,
    openTickets,
    inProgressTickets,
    resolvedTickets,
    criticalTickets,
    highTickets,
  };
}

// Get tickets by status
export function getTicketsByStatus(status: string) {
  return festivalTickets.filter((t) => t.status === status);
}

// Get sites by location
export function getSitesByLocation(location: string) {
  return festivalSites.filter((s) =>
    s.location.toLowerCase().includes(location.toLowerCase()),
  );
}

// Google Sheets Integration Structure
export interface GoogleSheetsConfig {
  sheetId: string;
  mapDataTab: string;
  kpiTab: string;
  ticketsTab: string;
  refreshInterval: number; // in seconds
}

// Configuration for Google Sheets integration (update these with actual sheet URLs)
export const googleSheetsConfig: GoogleSheetsConfig = {
  sheetId: "", // Will be provided by user
  mapDataTab: "MapData",
  kpiTab: "KPI",
  ticketsTab: "Tickets",
  refreshInterval: 30, // Auto-refresh every 30 seconds
};

// Function to fetch data from Google Sheets (to be implemented)
export async function fetchFestivalDataFromSheets(_sheetId: string): Promise<{
  sites: FestivalSite[];
  tickets: FestivalTicket[];
}> {
  // This function will be implemented when user provides sheet URL
  // For now, return mock data
  return {
    sites: festivalSites,
    tickets: festivalTickets,
  };
}
