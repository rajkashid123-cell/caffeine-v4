import { ErrorBoundary } from "@/components/ErrorBoundary";
import { selectHasHydrated, useAppStore } from "@/store/useAppStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { router } from "./router";

// ─── Anti-FOUC: read theme preferences from localStorage synchronously ────────
// This runs before React hydrates so the correct data-theme + dark class are
// applied before the first paint, preventing a flash of the wrong theme.
function applyStoredTheme() {
  try {
    // Try Zustand persist store first (caffeine-app-state)
    const raw = localStorage.getItem("caffeine-app-state");
    let theme = localStorage.getItem("caffeine-theme") ?? "soils";
    let dark = localStorage.getItem("caffeine-dark") === "true";
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.state?.theme) theme = parsed.state.theme;
        if (typeof parsed?.state?.isDarkMode === "boolean")
          dark = parsed.state.isDarkMode;
      } catch {
        /* ignore */
      }
    }
    document.documentElement.setAttribute("data-theme", theme);
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } catch {
    /* ignore storage errors */
  }
}
applyStoredTheme();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
});

// ─── Hydration gate ───────────────────────────────────────────────────────────
/** Holds render until Zustand persist has rehydrated from localStorage.
 *  Falls through after 300ms so a stuck rehydration never blocks the UI. */
function HydrationGate({ children }: { children: ReactNode }) {
  const hydrated = useAppStore(selectHasHydrated);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 300);
    return () => clearTimeout(t);
  }, []);

  if (!hydrated && !timedOut) {
    return <div className="h-screen w-screen bg-background" aria-hidden />;
  }
  return <>{children}</>;
}

// ─── Theme sync — keep document.documentElement in sync with store after mount ─
function ThemeSync() {
  const theme = useAppStore((s) => s.theme);
  const isDarkMode = useAppStore((s) => s.isDarkMode);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("caffeine-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("caffeine-dark", String(isDarkMode));
  }, [isDarkMode]);

  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HydrationGate>
          <ThemeSync />
          {/* RouterProvider must be inside HydrationGate so route beforeLoad
              guards can read hydrated Zustand state for redirect decisions. */}
          <RouterProvider router={router} />
        </HydrationGate>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
