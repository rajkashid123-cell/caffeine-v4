import {
  AlertTriangle,
  Flame,
  Timer,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { BurnSparkline } from "./BurnSparkline";
import { MetricTile } from "./MetricTile";
import type { LiveApp } from "./types";

interface Props {
  app: LiveApp;
}

function formatCycles(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

export default function CyclesPanel({ app }: Props) {
  const burn = app.burnRateNum;
  const days = app.runwayDays;

  const cost30 = burn * 30;
  const cost60 = burn * 60;
  const cost90 = burn * 90;

  const trend =
    app.burnHistory.length >= 2
      ? app.burnHistory[app.burnHistory.length - 1] - app.burnHistory[0]
      : 0;

  const urgency: "critical" | "warn" | "ok" =
    days < 7 ? "critical" : days < 14 ? "warn" : "ok";

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricTile
          label="Daily usage"
          status={app.burnRateDisplay}
          technical={`${burn.toLocaleString()} credits/day`}
          health={urgency}
        />
        <MetricTile
          label="Days remaining"
          status={`${days} days`}
          technical={`${days}d left`}
          health={urgency}
        />
        <MetricTile
          label="7-day trend"
          status={trend > 0 ? `+${trend}%` : `${trend}%`}
          technical="vs previous period"
          health={trend > 0 ? "warn" : "ok"}
        />
        <MetricTile
          label="Status"
          status={
            days < 7
              ? "Needs attention"
              : days < 14
                ? "Watch closely"
                : "All good"
          }
          technical="based on credits left"
          health={urgency}
        />
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="text-sm font-medium text-foreground mb-3">
          Daily usage trend (7 days)
        </div>
        <BurnSparkline data={app.burnHistory} width={400} height={64} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground mb-1">
            30-day estimate
          </div>
          <div className="text-lg font-semibold text-foreground">
            {formatCycles(cost30)} credits
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {app.burnRateDisplay} × 30 days
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground mb-1">
            60-day estimate
          </div>
          <div className="text-lg font-semibold text-foreground">
            {formatCycles(cost60)} credits
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {app.burnRateDisplay} × 60 days
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground mb-1">
            90-day estimate
          </div>
          <div className="text-lg font-semibold text-foreground">
            {formatCycles(cost90)} credits
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {app.burnRateDisplay} × 90 days
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="text-sm font-medium text-foreground mb-2">
          Credit summary
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          At the current daily usage of{" "}
          <span className="font-medium text-foreground">
            {app.burnRateDisplay}
          </span>
          , {app.name} will use approximately{" "}
          <span className="font-medium text-foreground">
            {formatCycles(cost30)} credits
          </span>{" "}
          over the next 30 days. With{" "}
          <span className="font-medium text-foreground">{days} days</span> of
          credits remaining, consider topping up if this drops below 14 days.
        </p>
      </div>
    </div>
  );
}
