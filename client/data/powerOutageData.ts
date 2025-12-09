export interface PowerTicket {
  id: string;
  location: string;
  severity: "critical" | "high" | "medium" | "low";
  type: "outage" | "power";
  status: "open" | "in-progress" | "resolved";
  createdAt: string;
  duration?: number;
  affectedArea?: string;
}

export interface PowerOutageEvent {
  id: string;
  location: string;
  latitude: number;
  longitude: number;
  startTime: string;
  duration: number;
  severity: "critical" | "high" | "medium" | "low";
  affectedDevices: number;
}

export const powerTickets: PowerTicket[] = [
  {
    id: "PT-2025-001",
    location: "COW076",
    severity: "critical",
    type: "outage",
    status: "open",
    createdAt: "2025-12-09T13:45:00",
    duration: 12,
    affectedArea: "North Zone",
  },
  {
    id: "PT-2025-002",
    location: "COW022",
    severity: "critical",
    type: "power",
    status: "in-progress",
    createdAt: "2025-12-09T12:30:00",
    duration: 84,
    affectedArea: "Central Zone",
  },
  {
    id: "PT-2025-003",
    location: "COW188",
    severity: "high",
    type: "outage",
    status: "open",
    createdAt: "2025-12-09T11:20:00",
    duration: 155,
    affectedArea: "East Zone",
  },
  {
    id: "PT-2025-004",
    location: "COW094",
    severity: "high",
    type: "power",
    status: "open",
    createdAt: "2025-12-09T10:15:00",
    duration: 260,
    affectedArea: "South Zone",
  },
  {
    id: "PT-2025-005",
    location: "COW652",
    severity: "medium",
    type: "outage",
    status: "resolved",
    createdAt: "2025-12-09T09:00:00",
    duration: 45,
    affectedArea: "West Zone",
  },
  {
    id: "PT-2025-006",
    location: "CWS808",
    severity: "medium",
    type: "power",
    status: "resolved",
    createdAt: "2025-12-08T20:30:00",
    duration: 120,
    affectedArea: "North Zone",
  },
  {
    id: "PT-2025-007",
    location: "COW636",
    severity: "low",
    type: "outage",
    status: "resolved",
    createdAt: "2025-12-08T18:45:00",
    duration: 30,
    affectedArea: "Central Zone",
  },
  {
    id: "PT-2025-008",
    location: "CWH352",
    severity: "low",
    type: "power",
    status: "resolved",
    createdAt: "2025-12-08T16:20:00",
    duration: 25,
    affectedArea: "East Zone",
  },
];

export const outageEvents: PowerOutageEvent[] = [
  {
    id: "OE-001",
    location: "North Zone",
    latitude: 25.72,
    longitude: 46.87,
    startTime: "2025-12-09T13:45:00",
    duration: 12,
    severity: "critical",
    affectedDevices: 2345,
  },
  {
    id: "OE-002",
    location: "Central Zone",
    latitude: 25.63,
    longitude: 46.83,
    startTime: "2025-12-09T12:30:00",
    duration: 84,
    severity: "critical",
    affectedDevices: 3456,
  },
  {
    id: "OE-003",
    location: "East Zone",
    latitude: 25.68,
    longitude: 46.89,
    startTime: "2025-12-09T11:20:00",
    duration: 155,
    severity: "high",
    affectedDevices: 1234,
  },
];

export function getPowerStats() {
  const criticalCount = powerTickets.filter(
    (t) => t.severity === "critical"
  ).length;
  const highCount = powerTickets.filter((t) => t.severity === "high").length;
  const mediumCount = powerTickets.filter(
    (t) => t.severity === "medium"
  ).length;
  const lowCount = powerTickets.filter((t) => t.severity === "low").length;
  const openCount = powerTickets.filter((t) => t.status === "open").length;
  const inProgressCount = powerTickets.filter(
    (t) => t.status === "in-progress"
  ).length;

  const totalOutageDuration = powerTickets
    .filter((t) => t.type === "outage")
    .reduce((sum, t) => sum + (t.duration || 0), 0);

  // Calculate availability: assuming 8 hour window = 480 minutes
  const windowDuration = 480;
  const totalDowntime = powerTickets
    .filter((t) => t.status !== "resolved")
    .reduce((sum, t) => sum + (t.duration || 0), 0);
  const availability = Math.max(
    0,
    ((windowDuration - totalDowntime) / windowDuration) * 100
  );

  return {
    criticalCount,
    highCount,
    mediumCount,
    lowCount,
    openCount,
    inProgressCount,
    totalTickets: powerTickets.length,
    totalOutageDuration,
    availability: availability.toFixed(2),
    totalAffectedDevices: outageEvents.reduce(
      (sum, e) => sum + e.affectedDevices,
      0
    ),
  };
}
