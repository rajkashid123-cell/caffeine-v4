import type { IterateAction } from "@/lib/iterateActions";
import { cn } from "@/lib/utils";
import {
  Accessibility,
  Brain,
  CheckSquare,
  Compass,
  Cpu,
  Eye,
  GitBranch,
  Layers,
  Monitor,
  Palette,
  Plus,
  Rocket,
  Scissors,
  Type,
  UserPlus,
  Wind,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Accessibility,
  Brain,
  CheckSquare,
  Compass,
  Cpu,
  Eye,
  GitBranch,
  Layers,
  Monitor,
  Palette,
  Plus,
  Rocket,
  Scissors,
  Type,
  UserPlus,
  Wind,
  Zap,
};

const CATEGORY_COLORS: Record<string, string> = {
  Audits: "text-accent",
  Passes: "text-accent",
  Generators: "text-accent",
};

interface ActionCardProps {
  action: IterateAction;
  isRunning: boolean;
  onRun: (action: IterateAction) => void;
}

export function ActionCard({ action, isRunning, onRun }: ActionCardProps) {
  const Icon = ICON_MAP[action.icon] ?? Eye;
  const iconColor = CATEGORY_COLORS[action.category] ?? "text-muted-foreground";

  return (
    <button
      type="button"
      onClick={() => onRun(action)}
      disabled={isRunning}
      className={cn(
        "flex flex-col gap-3 p-4 rounded-xl bg-card border border-border text-left w-full min-h-[120px]",
        "shadow-[var(--shadow-card)]",
        "hover:border-accent/50 hover:bg-accent/5 hover:ring-1 hover:ring-accent/20 transition-all duration-150",
        "disabled:opacity-50 disabled:pointer-events-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
      )}
      data-ocid={`iterate.action.${action.id}`}
    >
      <div className="p-2 rounded-md bg-muted/50 w-fit">
        <Icon size={16} className={iconColor} />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground mb-1">
          {action.name}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {action.description}
        </p>
      </div>
      <span className="mt-auto text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {action.category}
      </span>
    </button>
  );
}
