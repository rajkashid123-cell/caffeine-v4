import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PageWrapperProps {
  /** Optional header content — rendered in a flex-shrink-0 wrapper */
  header?: ReactNode;
  children: ReactNode;
  className?: string;
  /**
   * When true (default) the content area scrolls vertically.
   * When false the content area is overflow-hidden and fills height.
   */
  scrollable?: boolean;
  /**
   * When false (default) the content inner receives `p-6` padding.
   * When true no padding is applied — useful for full-bleed canvases.
   */
  noPadding?: boolean;
}

/**
 * PageWrapper — enforces identical outer structure on every interior page.
 *
 * Usage:
 *   <PageWrapper header={<ModeHeader ... />}>
 *     ... page content ...
 *   </PageWrapper>
 */
export function PageWrapper({
  header,
  children,
  className,
  scrollable = true,
  noPadding = false,
}: PageWrapperProps) {
  return (
    <div
      className={cn("flex flex-col h-full min-h-0 bg-background", className)}
    >
      {/* Header slot — does not shrink */}
      {header && <div className="flex-shrink-0">{header}</div>}

      {/* Content area */}
      {scrollable ? (
        <div className="flex-1 overflow-y-auto">
          <div className={noPadding ? "h-full" : "p-6"}>{children}</div>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className={noPadding ? "h-full" : "p-6 flex flex-col flex-1"}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export default PageWrapper;
