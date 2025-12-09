import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";

interface KPIMetric {
  label: string;
  value: number;
  target: number;
  color: string;
  icon: React.ReactNode;
}

interface PerformanceKPIProps {
  metrics: KPIMetric[];
}

export function PerformanceKPI({ metrics }: PerformanceKPIProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const percentage = (metric.value / metric.target) * 100;
        const data = [
          { name: "Achieved", value: metric.value },
          { name: "Remaining", value: metric.target - metric.value },
        ];

        const colors = [metric.color, "#E2E8F0"];

        return (
          <Card key={index} className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-slate-600 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm text-slate-400 mb-1">{metric.label}</p>
                <div className="text-2xl font-bold text-white">
                  {metric.value.toLocaleString()}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  of {metric.target.toLocaleString()} target
                </p>
              </div>
              <div className="text-slate-600">{metric.icon}</div>
            </div>

            {/* Donut Chart */}
            <div className="h-24 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={40}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {colors.map((color, i) => (
                      <Cell key={`cell-${i}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1E293B",
                      border: "1px solid #475569",
                      borderRadius: "6px",
                    }}
                    labelStyle={{ color: "#F1F5F9" }}
                    formatter={(value: number) => value.toLocaleString()}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Progress indicator */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-400">Progress</span>
                <span className="text-xs font-semibold text-emerald-400">
                  {Math.round(percentage)}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
