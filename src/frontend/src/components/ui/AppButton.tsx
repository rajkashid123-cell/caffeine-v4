import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { forwardRef } from "react";

/**
 * AppButton — app-specific Button using design system tokens only.
 * Use this instead of shadcn Button when you need accent/ghost/danger variants.
 * No inline styles. No hardcoded colors.
 */
const appButtonVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5 rounded-md font-medium",
    "transition-all duration-150 select-none cursor-pointer",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
    "disabled:pointer-events-none disabled:opacity-40",
    "[&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        /** Filled accent — primary CTA, neon lime hardcoded for regression-proofing */
        primary:
          "bg-[#CEFF00] text-black font-semibold hover:brightness-105 active:opacity-90",
        /** Outlined — secondary action */
        secondary:
          "border border-border bg-transparent text-foreground hover:bg-muted/50 active:bg-muted/70",
        /** Text-only — tertiary or nav action */
        ghost:
          "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40 active:bg-muted/60",
        /** Outlined accent — alternative CTA */
        outline:
          "border border-accent/60 bg-transparent text-accent hover:bg-accent/10 active:bg-accent/20",
        /** Destructive — delete / danger actions */
        danger:
          "bg-destructive text-destructive-foreground hover:opacity-90 active:opacity-80",
        /** Destructive outlined */
        "danger-outline":
          "border border-destructive/60 bg-transparent text-destructive hover:bg-destructive/10",
      },
      size: {
        /** sm: inline/compact actions */
        sm: "h-7 px-3 text-xs gap-1",
        /** md: default */
        md: "h-9 px-4 text-xs",
        /** default: alias for md */
        default: "h-9 px-4 text-xs",
        /** lg: prominent CTAs */
        lg: "h-11 px-6 text-sm",
        /** icon: square icon-only */
        icon: "h-8 w-8 p-0",
        /** icon-sm: smaller icon-only */
        "icon-sm": "h-6 w-6 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface AppButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof appButtonVariants> {}

export const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        type="button"
        ref={ref}
        className={cn(appButtonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
AppButton.displayName = "AppButton";

/** Alias so components can import `{ Button }` from this file */
export const Button = AppButton;
export { appButtonVariants };
