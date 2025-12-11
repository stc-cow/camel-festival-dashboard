interface Wireless3DIconProps {
  status: "operational" | "warning" | "critical";
  size?: number;
}

export function Wireless3DIcon({ status, size = 28 }: Wireless3DIconProps) {
  // Dynamic color based on site status
  const colorMap: Record<string, string> = {
    operational: "#10B981", // green
    warning: "#F59E0B", // amber
    critical: "#EF4444", // red
  };

  const color = colorMap[status] || "#6B7280";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      style={{ pointerEvents: "none", userSelect: "none" }}
    >
      {/* 3D center pole */}
      <path
        d="M95 70 Q100 160 100 185 Q100 195 110 195 Q120 195 120 185 Q120 160 105 70 Z"
        fill={color}
      />

      {/* 3D top sphere */}
      <circle cx="110" cy="60" r="25" fill={color} />

      {/* Outer arcs */}
      <path
        d="M40 70 Q110 0 180 70"
        stroke={color}
        strokeWidth="18"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M55 95 Q110 35 165 95"
        stroke={color}
        strokeWidth="18"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M70 120 Q110 70 150 120"
        stroke={color}
        strokeWidth="18"
        fill="none"
        strokeLinecap="round"
      />

      {/* Right side mirrored arcs */}
      <path
        d="M180 70 Q110 0 40 70"
        stroke={color}
        strokeWidth="18"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M165 95 Q110 35 55 95"
        stroke={color}
        strokeWidth="18"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M150 120 Q110 70 70 120"
        stroke={color}
        strokeWidth="18"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
