import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import type { ReactNode } from "react";

/**
 * AppCard — token-based container primitive.
 * Uses bg-card, border-border, shadow-card/shadow-elevated.
 * No inline styles. No hardcoded colors.
 *
 * variants:
 *   default    — standard surface with border + card-shadow
 *   interactive — adds hover lift effect (for clickable cards)
 *   ghost      — no border, no shadow (for nested / inline content)
 *   elevated   — stronger shadow (for panels, popovers)
 */
const appCardVariants = cva(
  "relative flex flex-col rounded-lg bg-card text-card-foreground transition-all duration-150",
  {
    variants: {
      variant: {
        default: "border border-border shadow-[var(--shadow-card)]",
        interactive: [
          "border border-border shadow-[var(--shadow-card)]",
          "cursor-pointer hover:border-accent/40 hover:shadow-[var(--shadow-elevated)] hover:-translate-y-0.5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        ],
        ghost: "border-0 shadow-none bg-transparent",
        elevated: "border border-border shadow-[var(--shadow-elevated)]",
      },
      padding: {
        none: "",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  },
);

export interface AppCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof appCardVariants> {
  /** Forward as <article> or other semantic element */
  as?: React.ElementType;
}

/**
 * AppCard — base container
 * @example
 * <AppCard variant="interactive" padding="lg" onClick={...}>
 *   <AppCardTitle>Project name</AppCardTitle>
 *   <AppCardBody>description</AppCardBody>
 * </AppCard>
 */
export function AppCard({
  className,
  variant,
  padding,
  as: Component = "div",
  ...props
}: AppCardProps) {
  return (
    <Component
      className={cn(appCardVariants({ variant, padding }), className)}
      {...props}
    />
  );
}

/** Title row inside a card */
export function AppCardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "font-semibold text-sm text-foreground leading-snug",
        className,
      )}
      {...props}
    />
  );
}

/** Muted body text inside a card */
export function AppCardBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("text-xs text-muted-foreground leading-relaxed", className)}
      {...props}
    />
  );
}

/** Flex row for card footer actions */
export function AppCardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 mt-auto pt-3 border-t border-border/50",
        className,
      )}
      {...props}
    />
  );
}

/** Horizontal divider inside a card */
export function AppCardDivider({
  className,
  ...props
}: React.HTMLAttributes<HTMLHRElement>) {
  return (
    <hr
      className={cn("border-0 border-t border-border/50 my-3", className)}
      {...props}
    />
  );
}

/** Muted header label in a card */
export function AppCardLabel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "text-2xs font-medium uppercase tracking-wider text-muted-foreground/70 mb-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { appCardVariants };
