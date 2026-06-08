import type { ReactNode } from "react";
import { Component } from "react";

interface Props {
  children: ReactNode;
  /** Names the section in the fallback card, e.g. "Design" or "Manage" */
  fallbackLabel?: string;
}

interface State {
  hasError: boolean;
  message: string;
}

/**
 * Wraps a section of the app. On render error, shows a calm inline fallback
 * card using the current mode's accent colour (via CSS var) instead of a
 * modal or overlay.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(err: unknown): State {
    return {
      hasError: true,
      message: err instanceof Error ? err.message : String(err),
    };
  }

  componentDidCatch(err: Error, info: import("react").ErrorInfo) {
    console.error(
      `[Caffeine] Render error in "${this.props.fallbackLabel ?? "section"}":`,
      err,
      info,
    );
  }

  render() {
    if (this.state.hasError) {
      const label = this.props.fallbackLabel ?? "This section";
      return (
        <div
          className="flex h-full w-full items-center justify-center p-8"
          data-ocid="error_boundary.error_state"
        >
          <div className="max-w-sm w-full rounded-xl border border-border bg-card p-8 text-center shadow-elevated">
            <p className="text-base font-semibold mb-2 text-accent">
              {label} ran into a problem
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Reload the page to continue.
            </p>
            <button
              type="button"
              className="text-xs font-medium px-4 py-2 rounded-md focus-ring bg-accent/12 text-accent border border-accent/30"
              onClick={() => window.location.reload()}
              aria-label="Reload the application"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
