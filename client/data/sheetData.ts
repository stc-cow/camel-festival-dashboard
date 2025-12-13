import type { FestivalSite, FestivalTicket } from "./festivalData";

interface SheetRow {
  COWName: string;
  Tech: string;
  Lat: string;
  Long: string;
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
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-w_0g3Jw25ORAUBiDwfGSGpdGco4-CYPJ1uKNuA88G2-HKMeoO54eaqjqJHr-9lLietSy0KaqIwvW/pub?gid=1338846885&single=true&output=csv";

// Parse CSV data with proper quoted field handling
function parseCSV(csv: string): SheetRow[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];

  const rows: SheetRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Parse CSV line handling quoted fields
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      const nextChar = line[j + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          j++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    if (values.length < 4) continue; // Skip incomplete rows

    const row: SheetRow = {
      COWName: values[0] || "",
      Tech: values[1] || "",
      Lat: values[2] || "",
      Long: values[3] || "",
      TicketID: values[4] || undefined,
      Issue: values[5] || undefined,
      Severity: values[6] || undefined,
      Status: values[7] || undefined,
      CreatedAt: values[8] || undefined,
      LastUpdate: values[9] || undefined,
      Notes: values[10] || undefined,
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
  if (row.Severity && row.Severity.trim()) {
    const sev = row.Severity.trim().toLowerCase();
    if (sev.includes("critical")) {
      severity = "critical";
    } else if (sev.includes("high")) {
      severity = "high";
    } else if (sev.includes("low")) {
      severity = "low";
    } else if (sev.includes("medium")) {
      severity = "medium";
    }
  }

  let status: "open" | "in-progress" | "resolved" = "open";
  if (row.Status && row.Status.trim()) {
    const stat = row.Status.trim().toLowerCase();
    if (stat.includes("resolved") || stat.includes("closed")) {
      status = "resolved";
    } else if (stat.includes("in-progress") || stat.includes("in progress")) {
      status = "in-progress";
    } else if (stat.includes("assigned") || stat.includes("pending")) {
      status = "in-progress";
    } else if (stat.includes("open")) {
      status = "open";
    }
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

// Mock data fallback
const MOCK_DATA = {
  sites: [
    {
      id: "CWH001",
      name: "CWH001",
      location: "Al Ula",
      latitude: 26.6868,
      longitude: 37.9833,
      technology: "5G" as const,
      status: "operational" as const,
      lastUpdate: new Date().toISOString(),
    },
    {
      id: "CWH002",
      name: "CWH002",
      location: "Al Ula",
      latitude: 26.7,
      longitude: 38.0,
      technology: "4G" as const,
      status: "operational" as const,
      lastUpdate: new Date().toISOString(),
    },
    {
      id: "CWH003",
      name: "CWH003",
      location: "Al Ula",
      latitude: 26.65,
      longitude: 37.95,
      technology: "5G" as const,
      status: "warning" as const,
      lastUpdate: new Date().toISOString(),
    },
  ] as FestivalSite[],
  tickets: [
    {
      id: "TKT001",
      siteId: "CWH001",
      siteName: "CWH001",
      issue: "Signal strength low",
      severity: "medium" as const,
      status: "open" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dispatcherNotes: "Scheduled for maintenance",
    },
  ] as FestivalTicket[],
};

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
    const response = await fetch(SHEET_URL, {
      mode: "cors",
      credentials: "omit",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const csv = await response.text();
    const rows = parseCSV(csv);

    if (rows.length === 0) {
      console.warn("No data found in sheet, using mock data");
      return generateStats(MOCK_DATA.sites, MOCK_DATA.tickets);
    }

    // Convert rows to sites and tickets
    const sites = rows.map(sheetRowToSite);
    const tickets = rows
      .map(sheetRowToTicket)
      .filter((t) => t !== null) as FestivalTicket[];

    return generateStats(sites, tickets);
  } catch (error) {
    console.warn("Failed to fetch sheet data, using mock data:", error);
    return generateStats(MOCK_DATA.sites, MOCK_DATA.tickets);
  }
}

// Helper function to generate stats
function generateStats(
  sites: FestivalSite[],
  tickets: FestivalTicket[],
): {
  sites: FestivalSite[];
  tickets: FestivalTicket[];
  stats: {
    totalSites: number;
    operationalSites: number;
    warningSites: number;
    criticalSites: number;
    availability: string;
  };
} {
  const operationalSites = sites.filter(
    (s) => s.status === "operational",
  ).length;
  const warningSites = sites.filter((s) => s.status === "warning").length;
  const criticalSites = sites.filter((s) => s.status === "critical").length;
  const availability =
    sites.length > 0
      ? ((operationalSites / sites.length) * 100).toFixed(0)
      : "0";

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
}
