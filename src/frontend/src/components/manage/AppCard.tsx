// App overview card with plain-language metrics and health status
import { AlertTriangle, CheckCircle, Server } from "lucide-react";
import type { LiveApp } from "./types";

interface SparklineProps {
  data: number[];
  isWarn: boolean;
  width?: number;
  height?: number;
}

function Sparkline({ data, isWarn, width = 80, height = 32 }: SparklineProps) {
  if (!data || data.length < 2) {
    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
      />
    );
  }
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const strokeColor = isWarn
    ? "var(--manage-health-warn)"
    : "var(--manage-health-ok)";
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      <polyline
        points={pts}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface AppCardProps {
  app: LiveApp;
  selected: boolean;
  onToggle: () => void;
  className?: string;
}

export function AppCard({ app, selected, onToggle, className }: AppCardProps) {
  const isWarn = app.health === "warn" || app.health === "critical";

  const healthLabel = app.healthLabel;
  const healthStatusColor = isWarn
    ? "var(--manage-health-warn)"
    : "var(--manage-health-ok)";
  const healthBorderColor = selected
    ? "var(--live-accent)"
    : isWarn
      ? "var(--manage-health-warn)"
      : "var(--manage-health-ok)";
  const healthBg = isWarn
    ? "var(--manage-health-warn-bg)"
    : "var(--manage-health-ok-bg)";

  // Plain-language runway
  const runwayLabel = app.runway;
  const runwayHealth =
    app.health === "critical"
      ? "var(--manage-health-warn)"
      : "var(--manage-health-ok)";

  // Plain-language cost
  const costLabel = app.burnRateDisplay;

  return (
    <button
      type="button"
      onClick={onToggle}
      data-ocid={`manage.tile.${app.id}`}
      className={`w-full text-left rounded-xl transition-all duration-200 hover:shadow-md focus-ring ${
        selected ? "" : "bg-card"
      } ${className ?? ""}`}
      style={{
        background: selected ? "var(--live-accent-subtle)" : undefined,
        border: `1px solid ${selected ? "var(--live-accent-border)" : "var(--color-border)"}`,
        borderLeft: `4px solid ${healthBorderColor}`,
      }}
    >
      {/* Top row: identity + health */}
      <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: healthBg }}
          >
            <Server size={16} style={{ color: healthStatusColor }} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {app.name}
            </p>
            <p className="text-xs mt-0.5 text-muted-foreground whitespace-nowrap">
              {app.version} · updated {app.lastDeploy}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isWarn ? (
            <AlertTriangle
              size={13}
              style={{ color: "var(--manage-health-warn)" }}
            />
          ) : (
            <CheckCircle
              size={13}
              style={{ color: "var(--manage-health-ok)" }}
            />
          )}
          <span
            className="text-xs font-semibold whitespace-nowrap"
            style={{ color: healthStatusColor }}
          >
            {healthLabel}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-border/50" />

      {/* Stats row: plain-language metrics + sparkline */}
      <div className="px-5 py-4 flex items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <div className="flex-shrink-0">
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              Users
            </p>
            <p className="text-sm font-semibold mt-0.5 text-foreground whitespace-nowrap">
              {app.users.toLocaleString()}
            </p>
          </div>
          <div className="flex-shrink-0">
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              Fuel left
            </p>
            <p
              className="text-sm font-semibold mt-0.5 whitespace-nowrap"
              style={{ color: runwayHealth }}
            >
              {runwayLabel}
            </p>
          </div>
          <div className="flex-shrink-0">
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              Cost/day
            </p>
            <p className="text-sm font-semibold mt-0.5 text-foreground whitespace-nowrap">
              {costLabel}
            </p>
          </div>
          <div className="flex-shrink-0">
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              Description
            </p>
            <p className="text-sm font-semibold mt-0.5 text-foreground whitespace-nowrap truncate max-w-[200px]">
              {app.description}
            </p>
          </div>
        </div>
        <div
          className="flex-shrink-0 overflow-hidden rounded"
          style={{ width: 80, height: 32 }}
        >
          <Sparkline
            data={app.burnHistory}
            isWarn={isWarn}
            width={80}
            height={32}
          />
        </div>
      </div>
    </button>
  );
}
