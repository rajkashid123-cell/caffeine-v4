import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";

/**
 * AppBadge — token-based status/label badges.
 * All colors reference CSS custom properties via Tailwind — no raw palette values.
 * Used for: maturity (idea/draft/live), priority (high/medium/low),
 * market badges (original/template/white-label/cloned), and general status.
 */
const appBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs-plus font-medium transition-colors leading-none whitespace-nowrap",
  {
    variants: {
      variant: {
        // ── General ─────────────────────────────────────────────────────
        default: "bg-muted text-muted-foreground",
        accent: "bg-accent/20 text-accent",
        // ── Status ──────────────────────────────────────────────────────
        success:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300",
        warning:
          "bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300",
        error: "bg-red-100 text-red-700 dark:bg-red-950/70 dark:text-red-300",
        info: "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
        deployed:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300",
        building:
          "bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300",
        // ── Maturity ────────────────────────────────────────────────────
        idea: "bg-muted text-muted-foreground",
        exploring:
          "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
        defining:
          "bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
        draft:
          "bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300",
        live: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300",
        failed: "bg-red-100 text-red-700 dark:bg-red-950/70 dark:text-red-300",
        archived: "bg-muted text-muted-foreground",
        // ── Priority ────────────────────────────────────────────────────
        high: "bg-red-100 text-red-700 dark:bg-red-950/70 dark:text-red-300",
        medium:
          "bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300",
        low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300",
        // ── Market badges ───────────────────────────────────────────────
        // Original=bg-emerald-500/10 text-emerald-400 border-emerald-500/20
        original:
          "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        // Template=bg-amber-500/10 text-amber-400 border-amber-500/20
        template: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
        // White-label=bg-sky-500/10 text-sky-400 border-sky-500/20
        "white-label": "bg-sky-500/10 text-sky-400 border border-sky-500/20",
        // Cloned=bg-neutral-500/10 text-neutral-400 border-neutral-500/20
        cloned:
          "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20",
        // ── Attention ───────────────────────────────────────────────────
        attention:
          "bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300",
      },
      size: {
        sm: "text-2xs px-1.5 py-px",
        md: "text-xs-plus px-2 py-0.5",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

/** Alias so components can import `{ Badge }` from this file */
export const Badge = AppBadge;
export type BadgeProps = AppBadgeProps;

export interface AppBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof appBadgeVariants> {}

export function AppBadge({
  className,
  variant,
  size,
  ...props
}: AppBadgeProps) {
  return (
    <span
      className={cn(appBadgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}
