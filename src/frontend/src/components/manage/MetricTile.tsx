// Reusable metric tile with plain-language label, status, health indicator, and progressive disclosure
import type { Health } from "./types";

interface MetricTileProps {
  label: string;
  status: string;
  technical: string;
  health: Health;
  subtitle?: string;
  showTechnical?: boolean;
}

export function MetricTile({
  label,
  status,
  technical,
  health,
  subtitle,
  showTechnical = false,
}: MetricTileProps) {
  const borderColor =
    health === "ok"
      ? "var(--manage-health-ok)"
      : health === "warn"
        ? "var(--manage-health-warn)"
        : "var(--manage-health-error)";

  const statusColor =
    health === "ok"
      ? "var(--manage-health-ok)"
      : health === "warn"
        ? "var(--manage-health-warn)"
        : "var(--manage-health-error)";

  return (
    <div
      className="rounded-lg bg-card border border-border pl-4 pr-3 py-3 flex flex-col gap-0.5 min-w-0"
      style={{ borderLeft: `3px solid ${borderColor}` }}
      data-ocid="manage.metric_tile"
    >
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p
        className="text-base font-semibold mt-0.5"
        style={{ color: statusColor }}
      >
        {status}
      </p>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      {showTechnical && (
        <p className="text-xs text-muted-foreground mt-1 font-mono">
          {technical}
        </p>
      )}
    </div>
  );
}
