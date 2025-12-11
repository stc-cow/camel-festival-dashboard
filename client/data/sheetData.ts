import type { FestivalSite, FestivalTicket } from "./festivalData";

interface SheetRow {
  COWName: string;
  Tech: string;
  Lat: string;
  Long: string;
  PowerStatus?: string;
  NetworkStatus?: string;
  TicketID?: string;
  Issue?: string;
  Severity?: string;
  Status?: string;
  CreatedAt?: string;
  LastUpdate?: string;
  Notes?: string;
}

// Google Sheet public CSV export URL
const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1WVROxCmhtU9W6GFme3lWaJ4jhYPaAmSAunC3dMPSyys/export?format=csv&gid=1338846885";

// Parse CSV data
function parseCSV(csv: string): SheetRow[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim());
  const rows: SheetRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    if (values.length < 4) continue; // Skip incomplete rows

    const row: SheetRow = {
      COWName: values[0] || "",
      Tech: values[1] || "",
      Lat: values[2] || "",
      Long: values[3] || "",
      PowerStatus: values[4] || undefined,
      NetworkStatus: values[5] || undefined,
      TicketID: values[6] || undefined,
      Issue: values[7] || undefined,
      Severity: values[8] || undefined,
      Status: values[9] || undefined,
      CreatedAt: values[10] || undefined,
      LastUpdate: values[11] || undefined,
      Notes: values[12] || undefined,
    };

    if (row.COWName) {
      rows.push(row);
    }
  }

  return rows;
}

// Map sheet data to FestivalSite
function sheetRowToSite(row: SheetRow): FestivalSite {
  // Parse technology (extract individual techs from "2G/4G/5G" format)
  const primaryTech = row.Tech.split("/")[0] || "4G";

  // Map network status to site status
  let status: "operational" | "warning" | "critical" = "operational";
  if (row.NetworkStatus) {
    if (row.NetworkStatus.toLowerCase() === "critical") {
      status = "critical";
    } else if (row.NetworkStatus.toLowerCase() === "warning") {
      status = "warning";
    }
  }

  return {
    id: row.COWName,
    name: row.COWName,
    location: row.COWName, // Using COWName as location since no location field exists
    latitude: parseFloat(row.Lat),
    longitude: parseFloat(row.Long),
    technology: (primaryTech as "2G" | "4G" | "5G") || "4G",
    status: status,
    lastUpdate: row.LastUpdate || new Date().toISOString(),
  };
}

// Map sheet data to FestivalTicket
function sheetRowToTicket(row: SheetRow): FestivalTicket | null {
  if (!row.TicketID) return null;

  let severity: "low" | "medium" | "high" | "critical" = "medium";
  if (row.Severity) {
    const sev = row.Severity.toLowerCase();
    if (sev === "critical") severity = "critical";
    else if (sev === "high") severity = "high";
    else if (sev === "low") severity = "low";
  }

  let status: "open" | "in-progress" | "resolved" = "open";
  if (row.Status) {
    const stat = row.Status.toLowerCase();
    if (stat === "in-progress" || stat === "in progress") status = "in-progress";
    else if (stat === "resolved" || stat === "closed") status = "resolved";
  }

  return {
    id: row.TicketID,
    siteId: row.COWName,
    siteName: row.COWName,
    issue: row.Issue || "No description",
    severity: severity,
    status: status,
    createdAt: row.CreatedAt || new Date().toISOString(),
    updatedAt: row.LastUpdate || new Date().toISOString(),
    dispatcherNotes: row.Notes || "",
  };
}

// Fetch and parse sheet data
export async function fetchSheetData(): Promise<{
  sites: FestivalSite[];
  tickets: FestivalTicket[];
  stats: {
    totalSites: number;
    operationalSites: number;
    warningSites: number;
    criticalSites: number;
    availability: string;
  };
}> {
  try {
    const response = await fetch(SHEET_URL);
    const csv = await response.text();
    const rows = parseCSV(csv);

    // Convert rows to sites and tickets
    const sites = rows.map(sheetRowToSite);
    const tickets = rows
      .map(sheetRowToTicket)
      .filter((t) => t !== null) as FestivalTicket[];

    // Calculate stats
    const operationalSites = sites.filter((s) => s.status === "operational")
      .length;
    const warningSites = sites.filter((s) => s.status === "warning").length;
    const criticalSites = sites.filter((s) => s.status === "critical").length;
    const availability = (
      (operationalSites / sites.length) *
      100
    ).toFixed(0);

    return {
      sites,
      tickets,
      stats: {
        totalSites: sites.length,
        operationalSites,
        warningSites,
        criticalSites,
        availability,
      },
    };
  } catch (error) {
    console.error("Failed to fetch sheet data:", error);
    // Return empty data on error
    return {
      sites: [],
      tickets: [],
      stats: {
        totalSites: 0,
        operationalSites: 0,
        warningSites: 0,
        criticalSites: 0,
        availability: "0",
      },
    };
  }
}
