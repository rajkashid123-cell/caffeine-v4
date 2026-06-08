import { Flame, Tag, Timer, Users } from "lucide-react";
import { BurnSparkline } from "./BurnSparkline";
import { MetricTile } from "./MetricTile";
import type { LiveApp } from "./types";

interface Props {
  app: LiveApp;
}

export default function OperationsPanel({ app }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricTile
          label="Users"
          status={String(app.users)}
          technical="active users"
          health="ok"
        />
        <MetricTile
          label="Burn rate"
          status={app.burnRateDisplay}
          technical={`${app.burnRateNum} cycles/day`}
          health={app.runwayDays < 14 ? "warn" : "ok"}
        />
        <MetricTile
          label="Runway"
          status={`${app.runwayDays} days`}
          technical="remaining"
          health={app.runwayDays < 14 ? "warn" : "ok"}
        />
        <MetricTile
          label="Version"
          status={app.version}
          technical="current"
          health="ok"
        />
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="text-sm font-medium text-foreground mb-3">
          Burn rate trend (7 days)
        </div>
        <BurnSparkline data={app.burnHistory} width={400} height={64} />
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="text-sm font-medium text-foreground mb-2">
          Health summary
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {app.name} is currently{" "}
          <span
            className="font-medium"
            style={{
              color:
                app.health === "ok"
                  ? "var(--live-health-ok)"
                  : app.health === "warn"
                    ? "var(--live-health-warn)"
                    : "var(--live-health-critical)",
            }}
          >
            {app.healthLabel.toLowerCase()}
          </span>
          . It serves{" "}
          <span className="font-medium text-foreground">
            {app.users.toLocaleString()}
          </span>{" "}
          users and burns{" "}
          <span className="font-medium text-foreground">
            {app.burnRateDisplay}
          </span>
          . At this rate, the app has{" "}
          <span className="font-medium text-foreground">
            {app.runwayDays} days
          </span>{" "}
          of runway remaining.
        </p>
      </div>
    </div>
  );
}
