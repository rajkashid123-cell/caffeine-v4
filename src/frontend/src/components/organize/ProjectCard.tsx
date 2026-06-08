import { ModeCard } from "@/components/layout/ModeCard";
import { Badge } from "@/components/ui/AppBadge";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";
import {
  AlertTriangle,
  CheckCircle,
  Flame,
  Rocket,
  SkipForward,
  Upload,
  X,
} from "lucide-react";
import * as React from "react";
const MATURITY_VARIANT: Record<
  string,
  "idea" | "exploring" | "defining" | "building" | "live" | "default"
> = {
  idea: "idea",
  exploring: "exploring",
  defining: "defining",
  building: "building",
  live: "live",
};

const MATURITY_LABEL: Record<string, string> = {
  idea: "Idea",
  exploring: "Exploring",
  defining: "Defining",
  building: "Building",
  live: "Live",
};

const PRIORITY_DOT: Record<string, string> = {
  high: "bg-[oklch(var(--color-priority-high))]",
  medium: "bg-[oklch(var(--color-priority-medium))]",
  low: "bg-[oklch(var(--color-priority-low))]",
};

const PRIORITY_LABEL: Record<string, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

// Cloned badge uses design system tokens — no hardcoded color

interface ProjectCardProps {
  project: Project & { isSample?: boolean };
  isSelected: boolean;
  onGoLive?: () => void;
  onDeploy?: (projectId: string) => void;
  isChecked: boolean;
  onCardClick: (rect: DOMRect) => void;
  onCheckboxClick: (e: React.MouseEvent) => void;
  index: number;
  onApplyUpdate?: () => void;
  onSkipUpdate?: () => void;
}

const DEPLOY_STAGES = [
  "Preparing...",
  "Uploading...",
  "Verifying...",
  "Going live...",
  "Live!",
];

export function ProjectCard({
  project,
  isSelected,
  isChecked,
  onCardClick,
  onCheckboxClick,
  index,
  onGoLive,
  onDeploy,
  onApplyUpdate,
  onSkipUpdate,
}: ProjectCardProps) {
  const cardRef = React.useRef<HTMLButtonElement>(null);
  const [showUpdatePanel, setShowUpdatePanel] = React.useState(false);
  const [deployState, setDeployState] = React.useState<
    "idle" | "deploying" | "live"
  >("idle");
  const [deployStage, setDeployStage] = React.useState(0);
  const isCloned =
    project.metadata.tags?.includes("cloned") ||
    project.metadata.tags?.includes("white-label");
  return (
    <ModeCard
      selected={isSelected || isChecked}
      onClick={() => {
        if (cardRef.current) {
          onCardClick(cardRef.current.getBoundingClientRect());
        }
      }}
      data-ocid={`organize.project.item.${index}`}
      className="relative flex flex-col select-none"
    >
      {/* Attention flag dot — top right */}
      {project.metadata.attentionFlag && (
        <span
          className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-warning z-10"
          aria-label="Flagged for attention"
        />
      )}

      {/* Main always-visible content */}
      <div className="flex items-start gap-3 p-4 pb-2">
        <div
          className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-accent-foreground text-xs font-bold mt-0.5"
          style={{ backgroundColor: project.iconColor }}
          aria-hidden="true"
        >
          {project.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <p className="text-sm font-medium text-foreground truncate leading-tight">
              {project.name}
            </p>
            {/* Deployment status indicator */}
            {deployState === "deploying" && (
              <span
                className="flex-shrink-0 flex items-center gap-1 text-2xs"
                style={{ color: "oklch(var(--color-status-building))" }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{
                      backgroundColor: "oklch(var(--color-status-building))",
                    }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-1.5 w-1.5"
                    style={{
                      backgroundColor: "oklch(var(--color-status-building))",
                    }}
                  />
                </span>
              </span>
            )}
            {(deployState === "live" ||
              project.deploymentStatus === "live") && (
              <span
                className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[oklch(var(--color-lime-500,0.85_0.28_120))]"
                aria-label="Live"
              />
            )}
            {project.deploymentStatus === "notDeployed" &&
              deployState === "idle" && (
                <span
                  className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[oklch(var(--color-status-warning)/0.7)]"
                  aria-label="Draft"
                />
              )}
            {isCloned && (
              <span className="flex-shrink-0 text-xs px-1.5 py-0.5 rounded-full border font-medium border-accent/40 text-accent bg-accent/8">
                Cloned
              </span>
            )}
            {project.isSample && (
              <span className="flex-shrink-0 text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                Sample
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {MATURITY_LABEL[project.metadata.maturity] ??
              project.metadata.maturity}
          </p>
        </div>
      </div>

      {/* Always-visible metadata area */}
      <div className="flex items-center gap-1.5 px-4 pb-3 flex-wrap gap-y-1.5">
        {/* Maturity badge */}
        <Badge
          variant={MATURITY_VARIANT[project.metadata.maturity] ?? "default"}
        >
          {MATURITY_LABEL[project.metadata.maturity] ??
            project.metadata.maturity}
        </Badge>

        {/* Priority indicator */}
        {project.metadata.priority && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                PRIORITY_DOT[project.metadata.priority],
              )}
            />
            {PRIORITY_LABEL[project.metadata.priority]}
          </span>
        )}

        {/* Tags (up to 2) */}
        {project.metadata.tags.slice(0, 2).map((tag) => (
          <Chip key={tag} label={tag} />
        ))}

        {/* Burn indicator */}
        {project.burnRate != null && project.metadata.maturity === "live" && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs",
              project.burnRateStatus === "critical" &&
                "text-[oklch(var(--color-status-error))]",
              project.burnRateStatus === "elevated" &&
                "text-[oklch(var(--color-status-warning))]",
              (!project.burnRateStatus ||
                project.burnRateStatus === "normal") &&
                "text-muted-foreground",
            )}
            data-ocid={`organize.project.burn_indicator.${index}`}
          >
            <Flame size={12} />
            {project.burnRateStatus === "critical"
              ? "Fuel critical"
              : project.burnRateStatus === "elevated"
                ? `~${Math.round(1000000 / project.burnRate)} days of fuel (elevated)`
                : `~${Math.round(1000000 / project.burnRate)} days of fuel`}
          </span>
        )}

        {/* Update available — for cloned projects */}
        {isCloned && project.creatorUpdateAvailable && (
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowUpdatePanel((v) => !v);
              }}
              className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-[oklch(var(--color-status-warning)/0.12)] text-[oklch(var(--color-status-warning))] border border-[oklch(var(--color-status-warning)/0.3)] hover:bg-[oklch(var(--color-status-warning)/0.2)] transition-colors"
              data-ocid={`organize.project.update_button.${index}`}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[oklch(var(--color-status-warning)/0.75)] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[oklch(var(--color-status-warning))]" />
              </span>
              Update available
            </button>
            {project.updateConflict && (
              <span
                className="absolute -top-1.5 -right-1.5 text-[oklch(var(--color-status-warning)/0.7)] dark:text-[oklch(var(--color-status-warning)/0.8)]"
                title="Applying this update may overwrite your custom changes. Review carefully before applying."
                data-ocid={`organize.project.update_conflict.${index}`}
              >
                <AlertTriangle size={12} />
              </span>
            )}
          </div>
        )}

        {/* Deploy button — for all projects not yet live */}
        {project.deploymentStatus !== "live" &&
          deployState !== "live" &&
          (deployState === "deploying" ? (
            <span
              className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border"
              style={{
                color: "oklch(var(--color-status-building))",
                backgroundColor: "oklch(var(--color-status-building-bg))",
                borderColor: "oklch(var(--color-status-building) / 0.3)",
              }}
              data-ocid={`organize.project.deploying_state.${index}`}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{
                    backgroundColor: "oklch(var(--color-status-building))",
                  }}
                />
                <span
                  className="relative inline-flex rounded-full h-1.5 w-1.5"
                  style={{
                    backgroundColor: "oklch(var(--color-status-building))",
                  }}
                />
              </span>
              {DEPLOY_STAGES[deployStage]}
            </span>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setDeployState("deploying");
                setDeployStage(0);
                const timers = [600, 1200, 1800, 2400].map((delay, i) =>
                  setTimeout(() => setDeployStage(i + 1), delay),
                );
                setTimeout(() => {
                  timers.forEach(clearTimeout);
                  setDeployState("live");
                  onDeploy?.(project.id);
                }, 3000);
              }}
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border transition-colors hover:opacity-80"
              style={{
                color: "oklch(var(--color-status-building))",
                backgroundColor: "oklch(var(--color-status-building-bg))",
                borderColor: "oklch(var(--color-status-building) / 0.3)",
              }}
              data-ocid={`organize.project.deploy_button.${index}`}
            >
              <Upload size={10} /> Deploy
            </button>
          ))}

        {/* Go live — for cloned projects that are not yet live (fallback) */}
        {isCloned &&
          project.metadata.maturity !== "live" &&
          deployState !== "deploying" &&
          deployState !== "live" &&
          onGoLive && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onGoLive();
              }}
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-accent/12 text-accent border border-accent/30 hover:bg-accent/20 transition-colors"
              data-ocid={`organize.project.go_live_button.${index}`}
            >
              <Rocket size={10} /> Go live
            </button>
          )}

        {/* Checkbox — bottom right, stops propagation so it doesn't open detail */}
        <span className="ml-auto flex-shrink-0">
          <input
            type="checkbox"
            checked={isChecked}
            readOnly
            tabIndex={0}
            aria-label="Select project"
            onClick={(e) => {
              e.stopPropagation();
              onCheckboxClick(e as unknown as React.MouseEvent);
            }}
            className={cn(
              "inline-flex w-4 h-4 rounded border items-center justify-center transition-colors cursor-pointer appearance-none",
              isChecked
                ? "bg-accent border-accent ring-2 ring-accent/30"
                : "bg-background border-border hover:border-accent/60",
            )}
            data-ocid={`organize.project.checkbox.${index}`}
          />
        </span>
      </div>

      {/* Inline update review panel */}
      {showUpdatePanel && project.pendingUpdate && (
        <div
          className="mx-4 mb-3 rounded-lg border border-[oklch(var(--color-status-warning)/0.2)] dark:border-[oklch(var(--color-status-warning)/0.3)] bg-[oklch(var(--color-status-warning)/0.06)] dark:bg-[oklch(var(--color-status-warning)/0.08)] p-3 space-y-2"
          data-ocid={`organize.project.update_panel.${index}`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[oklch(var(--color-status-warning))]">
              Version {project.pendingUpdate.version}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowUpdatePanel(false);
              }}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close update panel"
              data-ocid={`organize.project.update_close.${index}`}
            >
              <X size={12} />
            </button>
          </div>
          <ul className="space-y-1">
            {project.pendingUpdate.changeSummary
              .split("\n")
              .filter((s) => s.trim())
              .slice(0, 3)
              .map((item) => (
                <li
                  key={item}
                  className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-1.5"
                >
                  <span className="mt-0.5 w-1 h-1 rounded-full bg-[oklch(var(--color-status-warning))] flex-shrink-0" />
                  {item.trim().replace(/^[-•]\s*/, "")}
                </li>
              ))}
          </ul>
          {project.updateConflict && (
            <p className="text-2xs text-[oklch(var(--color-status-warning)/0.7)] flex items-center gap-1">
              <AlertTriangle size={10} />
              Applying this update may overwrite your custom changes.
            </p>
          )}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onApplyUpdate?.();
                setShowUpdatePanel(false);
              }}
              className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-medium px-3 py-1.5 rounded-md bg-[oklch(var(--color-status-warning))] text-white hover:bg-[oklch(var(--color-status-warning)/0.85)] transition-colors"
              data-ocid={`organize.project.update_apply.${index}`}
            >
              <CheckCircle size={11} />
              Apply update
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSkipUpdate?.();
                setShowUpdatePanel(false);
              }}
              className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-medium px-3 py-1.5 rounded-md border border-border bg-card text-foreground hover:bg-muted transition-colors"
              data-ocid={`organize.project.update_skip.${index}`}
            >
              <SkipForward size={11} />
              Skip for now
            </button>
          </div>
        </div>
      )}
    </ModeCard>
  );
}
