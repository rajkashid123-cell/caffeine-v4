import { cn } from "@/lib/utils";
import type React from "react";
import type { ReactNode } from "react";

interface ModeCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  selected?: boolean;
  hoverable?: boolean;
  "data-ocid"?: string;
  role?: string;
  tabIndex?: number;
  "aria-label"?: string;
}

/**
 * Shared card component used across all mode workspaces.
 * Consistent border-radius (rounded-xl), shadow (shadow-[var(--shadow-card)]),
 * padding (p-4 or p-5), hover state, and selection state.
 * Never invent per-mode card styles — use this.
 */
export function ModeCard({
  children,
  className,
  style,
  onClick,
  selected,
  hoverable = false,
  "data-ocid": ocid,
  role,
  tabIndex,
  "aria-label": ariaLabel,
}: ModeCardProps) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        role={role}
        tabIndex={tabIndex}
        aria-label={ariaLabel}
        data-ocid={ocid}
        className={cn(
          "rounded-xl border bg-card text-left w-full shadow-[var(--shadow-card)] transition-all duration-150",
          selected
            ? "border-accent bg-accent/5 shadow-[0_0_0_2px_var(--ring)]"
            : "border-border",
          !selected &&
            "hover:border-accent/40 hover:bg-accent/5 hover:shadow-md",
          "cursor-pointer focus-ring",
          className,
        )}
        style={style}
      >
        {children}
      </button>
    );
  }
  return (
    <div
      role={role}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      data-ocid={ocid}
      className={cn(
        "rounded-xl border bg-card text-left w-full shadow-[var(--shadow-card)] transition-all duration-150",
        selected
          ? "border-accent bg-accent/5 shadow-[0_0_0_2px_var(--ring)]"
          : "border-border",
        hoverable &&
          !selected &&
          "hover:border-accent/40 hover:bg-accent/5 hover:shadow-md",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
