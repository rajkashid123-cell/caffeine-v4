import { PreviewPanel } from "@/components/devmode/PreviewPanel";
import { useAppStore } from "@/store/useAppStore";
import type { AppMode } from "@/store/useAppStore";
import { useEffect } from "react";
import { Sidebar } from "./Sidebar";

interface Props {
  children: React.ReactNode;
}

export function AppShell({ children }: Props) {
  const activeMode = useAppStore((s) => s.activeMode);
  const _sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const devModeEnabled = useAppStore((s) => s.devMode.enabled);

  // Apply mode class to document root for accent token switching
  useEffect(() => {
    document.documentElement.setAttribute("data-mode", activeMode);
  }, [activeMode]);

  // Keep data-theme in sync with store (also handled in ThemeSync, this is a safety net)
  const storeTheme = useAppStore((s) => s.theme);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", storeTheme);
  }, [storeTheme]);

  return (
    <div
      className="flex h-screen w-screen overflow-hidden bg-background"
      data-ocid="app.shell"
    >
      {/* Narrow viewport notice — non-blocking */}
      <div className="hidden max-[1023px]:flex fixed inset-0 z-50 items-center justify-center bg-background">
        <div className="text-center p-8 max-w-sm">
          <p className="text-lg font-medium text-foreground mb-2">
            Desktop browser required
          </p>
          <p className="text-sm text-muted-foreground">
            Caffeine is designed for desktop use. Please open this app in a
            browser window at least 1024px wide.
          </p>
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Workspace */}
      <main
        className="flex-1 flex min-w-0 overflow-hidden"
        data-ocid="app.workspace"
      >
        {/* Main content area */}
        <div
          className="flex flex-col min-w-0 h-full overflow-hidden bg-background transition-all duration-200 ease-in-out"
          style={{ flex: devModeEnabled ? "0 0 65%" : "1" }}
        >
          {children}
        </div>

        {/* Dev mode preview panel — only when enabled */}
        {devModeEnabled && (
          <div
            className="flex-shrink-0 overflow-hidden transition-all duration-200 ease-in-out"
            style={{ flex: "0 0 35%" }}
          >
            <PreviewPanel />
          </div>
        )}
      </main>
    </div>
  );
}
