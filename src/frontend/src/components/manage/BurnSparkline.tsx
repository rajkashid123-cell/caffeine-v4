// Inline SVG sparkline for burn rate — no external library

interface BurnSparklineProps {
  /** 7 data points (daily values) */
  data: number[];
  /** Width of the SVG element in px */
  width?: number;
  /** Height of the SVG element in px */
  height?: number;
  /** CSS color for the line stroke */
  lineColor?: string;
  /** CSS color for the area fill (semi-transparent) */
  fillColor?: string;
  /** Whether to show the end-point dot */
  dot?: boolean;
}

export function BurnSparkline({
  data,
  width = 64,
  height = 24,
  lineColor = "var(--live-accent)",
  fillColor,
  dot = true,
}: BurnSparklineProps) {
  if (!data || data.length < 2) return null;

  const pad = 2;
  const w = width - pad * 2;
  const h = height - pad * 2;

  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;

  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * w;
    const y = pad + h - ((v - minVal) / range) * h;
    return { x, y };
  });

  // Polyline points string
  const linePoints = pts
    .map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(" ");

  // Closed path for fill area
  const fillPath = [
    `M ${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`,
    ...pts.slice(1).map((p) => `L ${p.x.toFixed(2)},${p.y.toFixed(2)}`),
    `L ${pts[pts.length - 1].x.toFixed(2)},${(pad + h).toFixed(2)}`,
    `L ${pts[0].x.toFixed(2)},${(pad + h).toFixed(2)}`,
    "Z",
  ].join(" ");

  const last = pts[pts.length - 1];
  const resolvedFill = fillColor ?? lineColor;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      style={{ flexShrink: 0, display: "block" }}
    >
      {/* Area fill */}
      <path d={fillPath} fill={resolvedFill} opacity={0.12} />
      {/* Line */}
      <polyline
        points={linePoints}
        fill="none"
        stroke={lineColor}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* End dot */}
      {dot && <circle cx={last.x} cy={last.y} r={2.5} fill={lineColor} />}
    </svg>
  );
}

// Trend arrow + pct helper
export interface TrendIndicatorProps {
  current: number;
  previous: number;
  /** Threshold % change before showing "up" or "down" (default: 5) */
  threshold?: number;
}

export function TrendIndicator({
  current,
  previous,
  threshold = 5,
}: TrendIndicatorProps) {
  if (!previous) return null;
  const pctChange = ((current - previous) / previous) * 100;
  const absChange = Math.abs(pctChange);
  const isUp = pctChange > threshold;
  const isDown = pctChange < -threshold;

  if (!isUp && !isDown) {
    return (
      <span
        className="inline-flex items-center gap-0.5 text-xs tabular-nums"
        style={{ color: "var(--color-muted-foreground)" }}
        title="Stable — less than 5% change"
      >
        {/* Stable em dash */}
        <span style={{ fontSize: "10px" }}>&#8212;</span>
        <span className="text-[10px]">{absChange.toFixed(0)}%</span>
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-0.5 text-xs tabular-nums font-medium"
      style={{
        color: isUp ? "var(--live-health-warn)" : "var(--live-health-ok)",
      }}
      title={`${isUp ? "+" : "-"}${absChange.toFixed(1)}% vs 7-day average`}
    >
      <svg
        width="8"
        height="10"
        viewBox="0 0 8 10"
        aria-hidden="true"
        style={{
          transform: isDown ? "rotate(180deg)" : undefined,
          flexShrink: 0,
        }}
      >
        <path d="M4 1 L7 5 H5 V9 H3 V5 H1 Z" fill="currentColor" />
      </svg>
      <span className="text-[10px]">{absChange.toFixed(0)}%</span>
    </span>
  );
}

/** Projected runway indicator — renders a compact pill */
export function RunwayIndicator({ days }: { days: number }) {
  const isWarn = days < 30;
  const isCritical = days < 14;
  const color = isCritical
    ? "var(--live-health-warn)"
    : isWarn
      ? "var(--color-status-warning, oklch(0.7 0.16 80))"
      : "var(--live-health-ok)";
  const bg = isCritical
    ? "var(--live-health-warn-bg)"
    : isWarn
      ? "oklch(0.96 0.04 90 / 0.7)"
      : "var(--live-health-ok-bg)";
  const label =
    days < 7
      ? "Top up urgent"
      : days < 14
        ? "Top up soon"
        : days < 30
          ? `${days}d — watch closely`
          : days < 60
            ? `${days} days`
            : `${days}d — plenty of fuel`;

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{ color, background: bg }}
    >
      <svg width="7" height="8" viewBox="0 0 7 8" aria-hidden="true">
        <rect
          x="1"
          y="0"
          width="5"
          height="7"
          rx="1"
          fill="currentColor"
          opacity={0.25}
        />
        <rect
          x="1"
          y={7 - Math.min(7, Math.round((days / 90) * 7))}
          width="5"
          height={Math.min(7, Math.round((days / 90) * 7))}
          rx="0.5"
          fill="currentColor"
        />
        <rect
          x="2"
          y="-0.5"
          width="3"
          height="1.5"
          rx="0.5"
          fill="currentColor"
        />
      </svg>
      {label}
    </span>
  );
}
