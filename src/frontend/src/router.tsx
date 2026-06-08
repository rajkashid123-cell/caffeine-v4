import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardPage } from "@/pages/DashboardPage";
import { DesignPage } from "@/pages/DesignPage";
import { DevelopPage } from "@/pages/DevelopPage";
import { LandingPage } from "@/pages/LandingPage";
import { LivePage } from "@/pages/LivePage";
import { MarketPage } from "@/pages/MarketPage";
import { OrganizePage } from "@/pages/OrganizePage";
import { SpecializePage } from "@/pages/SpecializePage";
import { useAppStore } from "@/store/useAppStore";
import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";

// ─── Root route ──────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// ─── Landing route (/)
// First-time visitors see the landing page.
// Returning users (onboarding complete) are redirected straight to /dashboard.
const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    const { hasCompletedOnboarding, onboardingComplete } =
      useAppStore.getState();
    if (hasCompletedOnboarding || onboardingComplete) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LandingPage,
});

// ─── App layout (AppShell wraps all interior app routes) ─────────────────────
function AppLayout() {
  return (
    <AppShell>
      <ErrorBoundary fallbackLabel="Page">
        <Outlet />
      </ErrorBoundary>
    </AppShell>
  );
}

const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app",
  // Guard: app routes require onboarding to be complete.
  // If not, send the user back to the landing page to begin onboarding.
  // On success, dashboard is the default landing state (not a mode page).
  beforeLoad: ({ location }) => {
    const { hasCompletedOnboarding, onboardingComplete } =
      useAppStore.getState();
    if (!hasCompletedOnboarding && !onboardingComplete) {
      throw redirect({ to: "/" });
    }
    // Redirect bare /app root to /dashboard
    if (location.pathname === "/") {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: AppLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const designRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/design",
  component: DesignPage,
});

const developRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/develop",
  component: DevelopPage,
});

const organizeRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/organize",
  component: OrganizePage,
});

const liveRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/live",
  component: LivePage,
});

const marketRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/market",
  component: MarketPage,
});

const specializeRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/market/specialize",
  component: SpecializePage,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  appLayoutRoute.addChildren([
    dashboardRoute,
    designRoute,
    developRoute,
    organizeRoute,
    liveRoute,
    marketRoute,
    specializeRoute,
  ]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
