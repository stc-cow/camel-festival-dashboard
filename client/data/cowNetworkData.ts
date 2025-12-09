export interface COWUnit {
  name: string;
  tech: string;
  latitude: number;
  longitude: number;
  status: "active" | "warning" | "inactive";
  signalStrength: number;
  coverage: number;
  activeUsers: number;
  dataUsage: number;
}

export const cowUnits: COWUnit[] = [
  {
    name: "CWH076",
    tech: "2G/4G",
    latitude: 25.59805,
    longitude: 46.87754,
    status: "active",
    signalStrength: 92,
    coverage: 95,
    activeUsers: 1245,
    dataUsage: 87,
  },
  {
    name: "CWH022",
    tech: "2G/4G/5G",
    latitude: 25.63587,
    longitude: 46.83091,
    status: "active",
    signalStrength: 96,
    coverage: 98,
    activeUsers: 2156,
    dataUsage: 92,
  },
  {
    name: "CWH188",
    tech: "2G/4G/5G",
    latitude: 25.64236,
    longitude: 46.81855,
    status: "active",
    signalStrength: 94,
    coverage: 96,
    activeUsers: 1876,
    dataUsage: 89,
  },
  {
    name: "CWH094",
    tech: "2G/4G/5G",
    latitude: 25.67764,
    longitude: 46.85573,
    status: "active",
    signalStrength: 98,
    coverage: 99,
    activeUsers: 2534,
    dataUsage: 95,
  },
  {
    name: "COW652",
    tech: "2G/4G/5G",
    latitude: 25.67445,
    longitude: 46.8308,
    status: "active",
    signalStrength: 91,
    coverage: 93,
    activeUsers: 1432,
    dataUsage: 85,
  },
  {
    name: "CWS808",
    tech: "2G/4G/5G",
    latitude: 25.6609,
    longitude: 46.86093,
    status: "active",
    signalStrength: 95,
    coverage: 97,
    activeUsers: 2089,
    dataUsage: 91,
  },
  {
    name: "COW636",
    tech: "2G/4G/5G",
    latitude: 25.61766,
    longitude: 46.82656,
    status: "active",
    signalStrength: 93,
    coverage: 95,
    activeUsers: 1654,
    dataUsage: 88,
  },
  {
    name: "CWH352",
    tech: "2G/4G/5G",
    latitude: 25.68984,
    longitude: 46.852437,
    status: "active",
    signalStrength: 97,
    coverage: 98,
    activeUsers: 2312,
    dataUsage: 93,
  },
  {
    name: "CWH973",
    tech: "2G/4G/5G",
    latitude: 25.63117,
    longitude: 46.862969,
    status: "active",
    signalStrength: 89,
    coverage: 91,
    activeUsers: 987,
    dataUsage: 82,
  },
  {
    name: "CWH940",
    tech: "2G/4G/5G",
    latitude: 25.72821,
    longitude: 46.83006,
    status: "active",
    signalStrength: 92,
    coverage: 94,
    activeUsers: 1765,
    dataUsage: 86,
  },
  {
    name: "CWH941",
    tech: "2G/4G/5G",
    latitude: 25.70092,
    longitude: 46.87303,
    status: "active",
    signalStrength: 94,
    coverage: 96,
    activeUsers: 2001,
    dataUsage: 90,
  },
  {
    name: "CWH942",
    tech: "2G/4G/5G",
    latitude: 25.73222,
    longitude: 46.86446,
    status: "active",
    signalStrength: 96,
    coverage: 97,
    activeUsers: 2243,
    dataUsage: 92,
  },
  {
    name: "CWH943",
    tech: "2G/4G/5G",
    latitude: 25.72473,
    longitude: 46.89682,
    status: "warning",
    signalStrength: 78,
    coverage: 82,
    activeUsers: 1432,
    dataUsage: 78,
  },
  {
    name: "CWH935",
    tech: "2G/4G/5G",
    latitude: 25.67836,
    longitude: 46.90278,
    status: "active",
    signalStrength: 91,
    coverage: 93,
    activeUsers: 1678,
    dataUsage: 84,
  },
  {
    name: "CWH937",
    tech: "2G/4G/5G",
    latitude: 25.647401,
    longitude: 46.843437,
    status: "active",
    signalStrength: 95,
    coverage: 96,
    activeUsers: 2134,
    dataUsage: 89,
  },
  {
    name: "CWH944",
    tech: "2G/4G/5G",
    latitude: 25.6327,
    longitude: 46.890079,
    status: "active",
    signalStrength: 90,
    coverage: 92,
    activeUsers: 1545,
    dataUsage: 83,
  },
  {
    name: "CWH945",
    tech: "2G/4G/5G",
    latitude: 25.701437,
    longitude: 46.916691,
    status: "active",
    signalStrength: 93,
    coverage: 95,
    activeUsers: 1823,
    dataUsage: 87,
  },
];

export function getNetworkStats() {
  const activeCOWs = cowUnits.filter((u) => u.status === "active").length;
  const warningCOWs = cowUnits.filter((u) => u.status === "warning").length;
  const avgSignalStrength =
    cowUnits.reduce((sum, u) => sum + u.signalStrength, 0) / cowUnits.length;
  const totalActiveUsers = cowUnits.reduce((sum, u) => sum + u.activeUsers, 0);
  const avgDataUsage =
    cowUnits.reduce((sum, u) => sum + u.dataUsage, 0) / cowUnits.length;

  return {
    totalCOWs: cowUnits.length,
    activeCOWs,
    warningCOWs,
    avgSignalStrength: Math.round(avgSignalStrength),
    totalActiveUsers,
    avgDataUsage: Math.round(avgDataUsage),
    networkUptime: 99.8,
  };
}
