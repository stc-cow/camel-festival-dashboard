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
  // Calculate needle rotation: -90 degrees at 0, 90 degrees at 100
  const rotation = ((value / 100) * 180) - 90;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-white/10 backdrop-blur-sm rounded-lg border border-white/80 p-4" style={{ boxShadow: "0 0 12px rgba(168, 85, 247, 0.6), inset 0 0 0 1px rgba(168, 85, 247, 0.4)" }}>
      {/* SVG Needle Gauge */}
      <div className="relative w-32 h-20 flex-shrink-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 200 120"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Gauge background arc (0-180 degrees) */}
          <path
            d="M 30 100 A 70 70 0 0 1 170 100"
            fill="none"
            stroke="rgba(148, 163, 184, 0.3)"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Colored arc segments */}
          {/* Red zone (0-30) */}
          <path
            d="M 30 100 A 70 70 0 0 1 55 48"
            fill="none"
            stroke="#EF4444"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Yellow zone (30-60) */}
          <path
            d="M 55 48 A 70 70 0 0 1 100 31"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Green zone (60-100) */}
          <path
            d="M 100 31 A 70 70 0 0 1 170 100"
            fill="none"
            stroke="#10B981"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Scale markers */}
          <text x="20" y="110" fontSize="10" fill="#1f2937" textAnchor="middle" fontWeight="bold">0</text>
          <text x="100" y="15" fontSize="10" fill="#1f2937" textAnchor="middle" fontWeight="bold">50</text>
          <text x="180" y="110" fontSize="10" fill="#1f2937" textAnchor="middle" fontWeight="bold">100</text>

          {/* Needle/Pointer */}
          <g
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: "100px 100px",
              transition: "transform 0.5s ease-out",
            }}
          >
            {/* Needle line */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="35"
              stroke="#10B981"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Needle tip circle */}
            <circle cx="100" cy="35" r="4" fill="#10B981" />
          </g>

          {/* Center circle */}
          <circle cx="100" cy="100" r="6" fill="#10B981" />
        </svg>

        {/* Center text - % value */}
        <div className="absolute inset-0 flex items-end justify-center pb-2">
          <div className="flex items-baseline gap-0.5">
            <div className="text-xl font-bold text-black">{value}</div>
            <div className="text-xs font-bold text-black">{unit}</div>
          </div>
        </div>
      </div>

      {/* Availability Label */}
      <div className="text-center text-xs font-bold text-black mt-2">
        {label}
      </div>
    </div>
  );
}
