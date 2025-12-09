import { Card } from "@/components/ui/card";

interface KPIMetric {
  label: string;
  value: number;
  target?: number;
  color: string;
  icon: React.ReactNode;
  unit?: string;
}

interface PerformanceKPIProps {
  metrics: KPIMetric[];
}

function CircularProgress({
  percentage,
  color,
}: {
  percentage: number;
  color: string;
}) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg className="w-24 h-24" viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="#334155"
        strokeWidth="8"
      />
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        className="transition-all duration-500"
        style={{
          transform: "rotate(-90deg)",
          transformOrigin: "50px 50px",
        }}
      />
      <text
        x="50"
        y="55"
        textAnchor="middle"
        className="text-sm font-bold fill-white"
      >
        {Math.round(percentage)}%
      </text>
    </svg>
  );
}

export function PerformanceKPI({ metrics }: PerformanceKPIProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const percentage = (metric.value / metric.target) * 100;

        return (
          <Card
            key={index}
            className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-slate-600 transition-colors"
          >
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

            {/* Circular Progress Chart */}
            <div className="flex justify-center mb-4">
              <CircularProgress percentage={percentage} color={metric.color} />
            </div>

            {/* Progress bar */}
            <div>
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
