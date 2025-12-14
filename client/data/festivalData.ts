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

// Mock Festival Sites
export const festivalSites: FestivalSite[] = [
  {
    id: "S001",
    name: "Main Entrance",
    location: "North Gate",
    latitude: 25.64,
    longitude: 46.831,
    technology: "5G",
    status: "operational",
    lastUpdate: new Date().toISOString(),
  },
  {
    id: "S002",
    name: "VIP Pavilion",
    location: "Central Arena",
    latitude: 25.635,
    longitude: 46.825,
    technology: "5G",
    status: "operational",
    lastUpdate: new Date().toISOString(),
  },
  {
    id: "S003",
    name: "Racing Track",
    location: "East Wing",
    latitude: 25.63,
    longitude: 46.835,
    technology: "4G",
    status: "operational",
    lastUpdate: new Date().toISOString(),
  },
  {
    id: "S004",
    name: "Exhibition Hall",
    location: "West Zone",
    latitude: 25.638,
    longitude: 46.82,
    technology: "5G",
    status: "operational",
    lastUpdate: new Date().toISOString(),
  },
  {
    id: "S005",
    name: "Cafeteria Area",
    location: "South Pavilion",
    latitude: 25.628,
    longitude: 46.828,
    technology: "4G",
    status: "warning",
    lastUpdate: new Date().toISOString(),
  },
  {
    id: "S006",
    name: "Parking Zone",
    location: "Perimeter",
    latitude: 25.625,
    longitude: 46.84,
    technology: "2G",
    status: "operational",
    lastUpdate: new Date().toISOString(),
  },
];

// Mock Festival Tickets
export const festivalTickets: FestivalTicket[] = [
  {
    id: "TKT001",
    siteId: "S005",
    siteName: "Cafeteria Area",
    issue: "Network signal degradation",
    severity: "high",
    status: "in-progress",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 300000).toISOString(),
    dispatcherNotes:
      "Signal fluctuation near food court, investigating interference",
  },
  {
    id: "TKT002",
    siteId: "S003",
    siteName: "Racing Track",
    issue: "Intermittent connectivity",
    severity: "medium",
    status: "open",
    createdAt: new Date(Date.now() - 5400000).toISOString(),
    updatedAt: new Date(Date.now() - 600000).toISOString(),
    dispatcherNotes:
      "Possible metal structure interference, pending site visit",
  },
  {
    id: "TKT003",
    siteId: "S001",
    siteName: "Main Entrance",
    issue: "High bandwidth demand",
    severity: "medium",
    status: "in-progress",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    dispatcherNotes: "Load balancing in progress, capacity upgrade scheduled",
  },
  {
    id: "TKT004",
    siteId: "S006",
    siteName: "Parking Zone",
    issue: "Equipment malfunction",
    severity: "critical",
    status: "open",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 900000).toISOString(),
    dispatcherNotes:
      "2G tower backup power failure, emergency repairs underway",
  },
];

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
