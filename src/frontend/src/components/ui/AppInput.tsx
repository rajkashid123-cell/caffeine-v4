import { cn } from "@/lib/utils";
import { forwardRef } from "react";

/**
 * AppInput — token-based text input.
 * bg-card border-border focus-ring using accent color.
 * error state via aria-invalid or hasError prop.
 * No inline styles. No hardcoded colors.
 */
export interface AppInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Show error styling */
  hasError?: boolean;
  /** Icon to render inside the left of the input */
  icon?: React.ReactNode;
  /** Error message rendered below the input */
  errorMessage?: string;
}

export const AppInput = forwardRef<HTMLInputElement, AppInputProps>(
  ({ className, hasError, icon, errorMessage, ...props }, ref) => {
    return (
      <div className="relative flex flex-col gap-1">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none flex items-center">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          aria-invalid={hasError ? true : undefined}
          className={cn(
            // Base
            "flex h-9 w-full rounded-md text-sm",
            "bg-card border border-border",
            "px-3 py-2 text-foreground",
            "placeholder:text-muted-foreground/60",
            // Focus
            "outline-none transition-[color,box-shadow] duration-150",
            "focus-visible:border-accent/70 focus-visible:ring-2 focus-visible:ring-accent/30",
            // Error
            hasError &&
              "border-destructive/70 ring-2 ring-destructive/20 focus-visible:ring-destructive/30",
            // Disabled
            "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
            // Icon padding
            icon && "pl-9",
            className,
          )}
          {...props}
        />
        {errorMessage && (
          <p className="text-xs text-destructive mt-0.5">{errorMessage}</p>
        )}
      </div>
    );
  },
);
AppInput.displayName = "AppInput";
