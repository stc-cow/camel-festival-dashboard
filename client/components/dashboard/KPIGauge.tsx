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
    <div className="flex flex-col items-center justify-center h-full w-full bg-transparent backdrop-blur-none rounded-xl border-0 p-0">
      {/* SVG Gauge - Smaller size */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-24 md:h-24 flex-shrink-0">
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

          {/* Center circle for 3D effect - transparent */}
          <circle cx="50" cy="50" r="35" fill="rgba(255, 255, 255, 0.3)" />
        </svg>

        {/* Center text - % on same line */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex items-baseline">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">{value}</div>
            <div className="text-xs sm:text-sm md:text-base text-black font-bold ml-0.5">{unit}</div>
          </div>
        </div>
      </div>

      {/* Label only */}
      <div className="text-center w-full">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-black">{label}</h3>
      </div>
    </div>
  );
}
