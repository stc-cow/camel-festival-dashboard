interface KPIGaugeProps {
  value: number; // 0-100
  label: string;
  unit?: string;
  threshold?: {
    excellent: number;
    good: number;
    warning: number;
  };
}

export function KPIGauge({
  value,
  label,
  unit = "%",
  threshold = { excellent: 90, good: 70, warning: 50 },
}: KPIGaugeProps) {
  // Determine color based on value
  const getColor = () => {
    if (value >= threshold.excellent) {
      return {
        main: "#10B981",
        light: "#D1FAE5",
        label: "Excellent",
      };
    } else if (value >= threshold.good) {
      return {
        main: "#3B82F6",
        light: "#DBEAFE",
        label: "Good",
      };
    } else if (value >= threshold.warning) {
      return {
        main: "#F59E0B",
        light: "#FEF3C7",
        label: "Warning",
      };
    } else {
      return {
        main: "#EF4444",
        light: "#FEE2E2",
        label: "Critical",
      };
    }
  };

  const color = getColor();
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center h-full bg-transparent backdrop-blur-none rounded-xl border-0 p-6">
      {/* SVG Gauge */}
      <div className="relative w-32 h-32 mb-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(148, 163, 184, 0.2)"
            strokeWidth="3"
          />

          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color.main}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />

          {/* Center circle for 3D effect */}
          <circle cx="50" cy="50" r="35" fill="rgba(255, 255, 255, 0.95)" />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-slate-800">{value}</div>
          <div className="text-xs text-slate-600">{unit}</div>
        </div>
      </div>

      {/* Label and status */}
      <div className="text-center mb-3">
        <h3 className="text-sm font-semibold text-slate-700">{label}</h3>
        <p className="text-xs font-medium mt-1" style={{ color: color.main }}>
          {color.label}
        </p>
      </div>

      {/* Threshold indicators */}
      <div className="w-full space-y-2 text-xs">
        <div className="flex justify-between items-center text-slate-600">
          <span>Excellent</span>
          <span>{threshold.excellent}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}
