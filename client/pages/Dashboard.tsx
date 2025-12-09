import { useState } from "react";
import { SiteMap } from "@/components/dashboard/SiteMap";
import { PerformanceKPI } from "@/components/dashboard/PerformanceKPI";
import { TicketsTable } from "@/components/dashboard/TicketsTable";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  MapPin,
  Ticket,
  BarChart3,
  RefreshCw,
} from "lucide-react";

// Mock data
const mockSites = [
  {
    id: "1",
    name: "North Venue",
    latitude: 25.0,
    longitude: 46.7,
    status: "active" as const,
    ticketsAvailable: 5000,
    ticketsSold: 4200,
  },
  {
    id: "2",
    name: "Central Grounds",
    latitude: 25.05,
    longitude: 46.8,
    status: "active" as const,
    ticketsAvailable: 7000,
    ticketsSold: 5800,
  },
  {
    id: "3",
    name: "South Plaza",
    latitude: 24.95,
    longitude: 46.75,
    status: "active" as const,
    ticketsAvailable: 3000,
    ticketsSold: 2100,
  },
  {
    id: "4",
    name: "East Pavilion",
    latitude: 25.02,
    longitude: 46.9,
    status: "warning" as const,
    ticketsAvailable: 4000,
    ticketsSold: 1500,
  },
];

const mockMetrics = [
  {
    label: "Tickets Sold",
    value: 13600,
    target: 19000,
    color: "#10B981",
    icon: <Ticket className="w-5 h-5" />,
  },
  {
    label: "Revenue Generated",
    value: 680000,
    target: 950000,
    color: "#F59E0B",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    label: "Active Sites",
    value: 3,
    target: 4,
    color: "#3B82F6",
    icon: <MapPin className="w-5 h-5" />,
  },
  {
    label: "Conversion Rate",
    value: 71,
    target: 100,
    color: "#8B5CF6",
    icon: <BarChart3 className="w-5 h-5" />,
  },
];

const mockTickets = [
  {
    id: "1",
    ticketNumber: "KAC-2024-001",
    site: "North Venue",
    status: "sold" as const,
    price: 250,
    purchaseDate: "2024-01-15",
    visitorName: "Ahmed Al-Saari",
    email: "ahmed@example.com",
  },
  {
    id: "2",
    ticketNumber: "KAC-2024-002",
    site: "Central Grounds",
    status: "sold" as const,
    price: 300,
    purchaseDate: "2024-01-15",
    visitorName: "Fatima Al-Dosari",
    email: "fatima@example.com",
  },
  {
    id: "3",
    ticketNumber: "KAC-2024-003",
    site: "South Plaza",
    status: "sold" as const,
    price: 200,
    purchaseDate: "2024-01-15",
    visitorName: "Mohammed Al-Shehri",
    email: "mohammed@example.com",
  },
  {
    id: "4",
    ticketNumber: "KAC-2024-004",
    site: "East Pavilion",
    status: "reserved" as const,
    price: 250,
    purchaseDate: "2024-01-14",
    visitorName: "Layla Al-Mutairi",
    email: "layla@example.com",
  },
  {
    id: "5",
    ticketNumber: "KAC-2024-005",
    site: "North Venue",
    status: "sold" as const,
    price: 250,
    purchaseDate: "2024-01-14",
    visitorName: "Khalid Al-Rasheed",
    email: "khalid@example.com",
  },
  {
    id: "6",
    ticketNumber: "KAC-2024-006",
    site: "Central Grounds",
    status: "available" as const,
    price: 300,
    purchaseDate: "2024-01-13",
  },
  {
    id: "7",
    ticketNumber: "KAC-2024-007",
    site: "South Plaza",
    status: "sold" as const,
    price: 200,
    purchaseDate: "2024-01-13",
    visitorName: "Nora Al-Harbi",
    email: "nora@example.com",
  },
  {
    id: "8",
    ticketNumber: "KAC-2024-008",
    site: "North Venue",
    status: "sold" as const,
    price: 250,
    purchaseDate: "2024-01-12",
    visitorName: "Samir Al-Sulami",
    email: "samir@example.com",
  },
];

export default function Dashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate data refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Ticket Insights Dashboard
              </h1>
              <p className="text-slate-400 mt-1">
                King Abdulaziz Camel Festival - Real-time Monitoring
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2 bg-slate-700 hover:bg-slate-600 text-white"
              size="sm"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Performance Metrics */}
        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white">Performance KPIs</h2>
            <p className="text-sm text-slate-400">
              Monitor key metrics across all festival sites
            </p>
          </div>
          <PerformanceKPI metrics={mockMetrics} />
        </div>

        {/* Map and Table Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Satellite Map */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white">Sites Location</h2>
              <p className="text-sm text-slate-400">
                Festival venues on satellite map
              </p>
            </div>
            <div className="h-96 rounded-lg overflow-hidden shadow-xl border border-slate-700">
              <SiteMap sites={mockSites} />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-2 space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white">Quick Stats</h2>
              <p className="text-sm text-slate-400">
                Current festival performance snapshot
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border-emerald-700/30 p-6 hover:border-emerald-600/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-300 mb-1">Total Revenue</p>
                    <div className="text-2xl font-bold text-emerald-400">
                      680K SAR
                    </div>
                    <p className="text-xs text-emerald-600 mt-1">71% of target</p>
                  </div>
                  <div className="text-emerald-600/40">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30 p-6 hover:border-blue-600/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-300 mb-1">Tickets Sold</p>
                    <div className="text-2xl font-bold text-blue-400">13.6K</div>
                    <p className="text-xs text-blue-600 mt-1">Out of 19K total</p>
                  </div>
                  <div className="text-blue-600/40">
                    <Ticket className="w-8 h-8" />
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-700/30 p-6 hover:border-purple-600/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-300 mb-1">Active Sites</p>
                    <div className="text-2xl font-bold text-purple-400">3/4</div>
                    <p className="text-xs text-purple-600 mt-1">1 site warning</p>
                  </div>
                  <div className="text-purple-600/40">
                    <MapPin className="w-8 h-8" />
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 border-amber-700/30 p-6 hover:border-amber-600/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-amber-300 mb-1">Conversion</p>
                    <div className="text-2xl font-bold text-amber-400">71%</div>
                    <p className="text-xs text-amber-600 mt-1">Above average</p>
                  </div>
                  <div className="text-amber-600/40">
                    <BarChart3 className="w-8 h-8" />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white">Recent Tickets</h2>
            <p className="text-sm text-slate-400">
              Latest ticket transactions and status
            </p>
          </div>
          <TicketsTable tickets={mockTickets} />
        </div>
      </div>
    </div>
  );
}
