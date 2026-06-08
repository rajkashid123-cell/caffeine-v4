import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-10 gap-3",
        className,
      )}
      data-ocid="empty_state"
    >
      {Icon && (
        <div className="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center">
          <Icon size={20} className="text-muted-foreground" />
        </div>
      )}
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground max-w-xs">
            {description}
          </p>
        )}
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="text-xs font-medium px-4 py-2 rounded-md bg-accent text-accent-foreground hover:opacity-90 transition-opacity mt-1"
          data-ocid="empty_state.action_button"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
