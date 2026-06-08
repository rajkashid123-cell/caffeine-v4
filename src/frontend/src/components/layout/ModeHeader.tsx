import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ModeHeaderProps {
  /** Primary title/content for the left side */
  title: ReactNode;
  /** Optional subtitle or secondary info below the title */
  subtitle?: ReactNode;
  /** Right-aligned controls/badges */
  actions?: ReactNode;
  /** Extra row rendered below (e.g. metrics row, filter bar anchored to header) */
  below?: ReactNode;
  className?: string;
  "data-ocid"?: string;
}

/**
 * Shared header used across all five mode workspaces.
 * Consistent height (h-16), bg-card, border-b, px-6.
 * All modes use this — never invent a per-page header.
 */
export function ModeHeader({
  title,
  subtitle,
  actions,
  below,
  className,
  "data-ocid": ocid,
}: ModeHeaderProps) {
  return (
    <div className={cn("flex-shrink-0 bg-card", className)} data-ocid={ocid}>
      <div className="flex items-center gap-4 px-6 h-16 border-b border-border">
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
          {typeof title === "string" ? (
            <span className="text-lg font-bold text-accent tracking-tight truncate leading-tight">
              {title}
            </span>
          ) : (
            title
          )}
          {subtitle && (
            <div className="flex items-center gap-3">{subtitle}</div>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>
        )}
      </div>
      {below && <div>{below}</div>}
    </div>
  );
}
