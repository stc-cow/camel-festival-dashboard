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
    <div className="flex flex-col items-center justify-center h-full w-full bg-transparent backdrop-blur-none rounded-xl border-0 p-4 sm:p-6">
      {/* SVG Gauge */}
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mb-4 sm:mb-6 flex-shrink-0">
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
          <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900">{value}</div>
          <div className="text-sm sm:text-base md:text-lg text-slate-700 font-semibold">{unit}</div>
        </div>
      </div>

      {/* Label and status */}
      <div className="text-center mb-3 sm:mb-4 w-full">
        <h3 className="text-sm sm:text-base md:text-xl font-bold text-slate-800">{label}</h3>
        <p className="text-xs sm:text-sm md:text-base font-semibold mt-1 sm:mt-2" style={{ color: color.main }}>
          {color.label}
        </p>
      </div>

      {/* Threshold indicators */}
      <div className="w-full space-y-2 text-xs sm:text-sm flex-shrink-0">
        <div className="flex justify-between items-center text-slate-700 font-medium">
          <span>Excellent</span>
          <span>{threshold.excellent}%</span>
        </div>
        <div className="w-full h-1.5 sm:h-2 bg-slate-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}
