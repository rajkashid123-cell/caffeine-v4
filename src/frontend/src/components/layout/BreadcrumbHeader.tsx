import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

interface BreadcrumbHeaderProps {
  /** Handler for the back button */
  onBack: () => void;
  /** Label shown next to the chevron */
  backLabel: string;
  /** Primary title of the current detail view */
  title: string;
  /** Optional secondary line below the title */
  subtitle?: string;
  /** Optional right-side action node (e.g. a Button) */
  action?: ReactNode;
  /**
   * Optional accent colour class for the title text.
   * Must be a Tailwind class that references a CSS variable, e.g. "text-accent".
   * Defaults to "text-foreground".
   */
  accentColor?: string;
  className?: string;
  "data-ocid"?: string;
}

/**
 * BreadcrumbHeader — consistent back-navigation header for all detail views.
 * Same height (h-16) and visual treatment as ModeHeader.
 *
 * Used by: Organize detail, Live detail, Market detail.
 */
export function BreadcrumbHeader({
  onBack,
  backLabel,
  title,
  subtitle,
  action,
  accentColor = "text-foreground",
  className,
  "data-ocid": ocid,
}: BreadcrumbHeaderProps) {
  return (
    <div className={cn("flex-shrink-0 bg-card", className)} data-ocid={ocid}>
      <div className="flex items-center gap-4 px-6 h-16 border-b border-border">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground -ml-2 px-2"
          data-ocid="breadcrumb.back_button"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">{backLabel}</span>
        </Button>

        {/* Divider */}
        <div className="w-px h-5 bg-border flex-shrink-0" />

        {/* Title / subtitle */}
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
          <span
            className={cn(
              "text-lg font-bold tracking-tight truncate leading-tight",
              accentColor,
            )}
          >
            {title}
          </span>
          {subtitle && (
            <span className="text-xs text-muted-foreground truncate">
              {subtitle}
            </span>
          )}
        </div>

        {/* Optional right-side action */}
        {action && (
          <div className="flex items-center gap-2 flex-shrink-0">{action}</div>
        )}
      </div>
    </div>
  );
}

export default BreadcrumbHeader;
