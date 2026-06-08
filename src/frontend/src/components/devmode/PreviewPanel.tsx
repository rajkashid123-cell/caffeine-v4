import type { SpecSection } from "@/backend";
import { useProjects } from "@/hooks/useProjects";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import {
  Activity,
  BarChart2,
  Bell,
  BookOpen,
  Calendar,
  ChevronRight,
  Cog,
  FileText,
  LayoutDashboard,
  List,
  MessageSquare,
  Monitor,
  Shield,
  ShieldAlert,
  User,
  Users,
  X,
} from "lucide-react";
import { type ReactNode, useEffect, useRef } from "react";

// ─── Role parsing ──────────────────────────────────────────────────────────────

const ROLE_KEYWORDS = [
  "admin",
  "administrator",
  "manager",
  "member",
  "viewer",
  "guest",
  "editor",
  "owner",
  "moderator",
  "operator",
  "user",
  "staff",
  "client",
  "subscriber",
];

function extractRolesFromSections(sections: SpecSection[]): string[] {
  // Look for a dedicated roles/permissions section first
  const rolesSection = sections.find((s) => {
    const h = s.heading.toLowerCase();
    return (
      h.includes("role") ||
      h.includes("permission") ||
      h.includes("access") ||
      h.includes("user type")
    );
  });

  const sourceText = rolesSection
    ? rolesSection.content
    : sections.map((s) => s.content).join(" ");

  const found: string[] = [];
  for (const keyword of ROLE_KEYWORDS) {
    const regex = new RegExp(`\\b${keyword}s?\\b`, "i");
    if (regex.test(sourceText)) {
      const label = keyword.charAt(0).toUpperCase() + keyword.slice(1);
      if (!found.includes(label)) found.push(label);
    }
  }

  // Always guarantee Admin is first and present
  const withAdmin = found.includes("Admin") ? found : ["Admin", ...found];
  // Cap at 5 to keep the role pill row manageable
  return withAdmin.slice(0, 5);
}

// ─── Screen parsing ────────────────────────────────────────────────────────────

const ADMIN_KEYWORDS = [
  "admin",
  "manage",
  "settings",
  "deploy",
  "configure",
  "delete",
  "approve",
  "invite",
  "access control",
  "permissions",
  "audit",
  "system",
];

function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s+/g, "")
    .replace(/[*_`~]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\n+/g, " ")
    .trim();
}

interface ScreenItem {
  title: string;
  description: string;
  isAdminOnly: boolean;
  icon: ReactNode;
}

function iconForScreen(title: string): ReactNode {
  const t = title.toLowerCase();
  if (t.includes("dashboard") || t.includes("home") || t.includes("overview"))
    return <LayoutDashboard className="w-icon-sm h-icon-sm" />;
  if (t.includes("setting") || t.includes("configure") || t.includes("config"))
    return <Cog className="w-icon-sm h-icon-sm" />;
  if (t.includes("user") || t.includes("member") || t.includes("team"))
    return <Users className="w-icon-sm h-icon-sm" />;
  if (t.includes("admin") || t.includes("manage"))
    return <ShieldAlert className="w-icon-sm h-icon-sm" />;
  if (t.includes("profile") || t.includes("account"))
    return <User className="w-icon-sm h-icon-sm" />;
  if (
    t.includes("calendar") ||
    t.includes("schedule") ||
    t.includes("appointment")
  )
    return <Calendar className="w-icon-sm h-icon-sm" />;
  if (t.includes("report") || t.includes("analytic") || t.includes("stat"))
    return <BarChart2 className="w-icon-sm h-icon-sm" />;
  if (t.includes("message") || t.includes("chat") || t.includes("inbox"))
    return <MessageSquare className="w-icon-sm h-icon-sm" />;
  if (t.includes("notif") || t.includes("alert"))
    return <Bell className="w-icon-sm h-icon-sm" />;
  if (t.includes("document") || t.includes("file") || t.includes("record"))
    return <FileText className="w-icon-sm h-icon-sm" />;
  if (t.includes("course") || t.includes("learn") || t.includes("educat"))
    return <BookOpen className="w-icon-sm h-icon-sm" />;
  if (t.includes("activ") || t.includes("log") || t.includes("history"))
    return <Activity className="w-icon-sm h-icon-sm" />;
  if (t.includes("access") || t.includes("permission") || t.includes("role"))
    return <Shield className="w-icon-sm h-icon-sm" />;
  if (t.includes("list") || t.includes("view") || t.includes("browse"))
    return <List className="w-icon-sm h-icon-sm" />;
  return <ChevronRight className="w-icon-sm h-icon-sm" />;
}

const FALLBACK_SCREENS: ScreenItem[] = [
  {
    title: "Dashboard",
    description: "Overview of key metrics and activity",
    isAdminOnly: false,
    icon: <LayoutDashboard className="w-icon-sm h-icon-sm" />,
  },
  {
    title: "Profile",
    description: "User profile and account settings",
    isAdminOnly: false,
    icon: <User className="w-icon-sm h-icon-sm" />,
  },
  {
    title: "Settings",
    description: "Application preferences and configuration",
    isAdminOnly: false,
    icon: <Cog className="w-icon-sm h-icon-sm" />,
  },
  {
    title: "List View",
    description: "Browsable list of primary content items",
    isAdminOnly: false,
    icon: <List className="w-icon-sm h-icon-sm" />,
  },
  {
    title: "Detail View",
    description: "Single item detail and actions",
    isAdminOnly: false,
    icon: <FileText className="w-icon-sm h-icon-sm" />,
  },
  {
    title: "Admin Panel",
    description: "Manage users, roles, and system settings",
    isAdminOnly: true,
    icon: <ShieldAlert className="w-icon-sm h-icon-sm" />,
  },
];

function parseScreensFromSections(sections: SpecSection[]): ScreenItem[] {
  // Find screen/feature sections
  const screenSections = sections.filter((s) => {
    const h = s.heading.toLowerCase();
    return (
      h.includes("screen") ||
      h.includes("page") ||
      h.includes("view") ||
      h.includes("dashboard") ||
      h.includes("feature")
    );
  });

  // Also derive synthetic screens from all sections if needed
  const sourceList = screenSections.length > 0 ? screenSections : sections;

  const items: ScreenItem[] = [];

  for (const section of sourceList) {
    const title = section.heading;
    const stripped = stripMarkdown(section.content);
    const description =
      stripped.slice(0, 80) + (stripped.length > 80 ? "…" : "");
    const lowerContent = section.content.toLowerCase();
    const lowerTitle = title.toLowerCase();

    const isAdminOnly = ADMIN_KEYWORDS.some(
      (kw) => lowerTitle.includes(kw) || lowerContent.includes(kw),
    );

    items.push({
      title,
      description,
      isAdminOnly,
      icon: iconForScreen(title),
    });
  }

  // Cap at 8 screens
  return items.slice(0, 8);
}

// ─── ScreenCard ────────────────────────────────────────────────────────────────

function ScreenCard({
  screen,
  isViewingAsAdmin,
}: { screen: ScreenItem; isViewingAsAdmin: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-xl border border-border p-4 transition-colors shadow-sm bg-background",
        screen.isAdminOnly && !isViewingAsAdmin
          ? "opacity-40 pointer-events-none"
          : "",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 text-accent bg-accent/10">
          {screen.icon}
        </div>
        {screen.isAdminOnly && isViewingAsAdmin && (
          <span
            className="text-2xs font-semibold px-1.5 py-0.5 rounded-full tracking-wide uppercase flex-shrink-0"
            style={{
              background: "var(--color-status-warning-bg)",
              color: "var(--color-status-warning)",
            }}
          >
            Admin only
          </span>
        )}
      </div>
      <div>
        <p
          className="text-sm-minus font-semibold leading-snug"
          style={{ color: "var(--foreground)" }}
        >
          {screen.title}
        </p>
        <p
          className="text-xs-plus leading-snug mt-0.5 line-clamp-2"
          style={{ color: "var(--muted-foreground)" }}
        >
          {screen.description}
        </p>
      </div>
    </div>
  );
}

// ─── PreviewPanel ──────────────────────────────────────────────────────────────

export function PreviewPanel() {
  const devMode = useAppStore((s) => s.devMode);
  const setDevMode = useAppStore((s) => s.setDevMode);
  const activeProjectId = useAppStore((s) => s.activeProjectId);
  const { projects } = useProjects();
  const panelRef = useRef<HTMLDivElement>(null);

  const project = projects.find((p) => p.id === activeProjectId) ?? projects[0];
  const specSections: SpecSection[] = project?.specSections ?? [];

  const roles = extractRolesFromSections(specSections);
  const currentRole =
    devMode.selectedRole && roles.includes(devMode.selectedRole)
      ? devMode.selectedRole
      : (roles[0] ?? "Admin");

  // Ensure selected role is synced if it was empty
  useEffect(() => {
    if (!devMode.selectedRole || !roles.includes(devMode.selectedRole)) {
      setDevMode({ selectedRole: roles[0] ?? "Admin" });
    }
  }, [devMode.selectedRole, roles, setDevMode]);

  const parsedScreens = parseScreensFromSections(specSections);
  const allScreens =
    parsedScreens.length > 0 ? parsedScreens : FALLBACK_SCREENS;

  const isAdmin =
    currentRole.toLowerCase() === "admin" ||
    currentRole.toLowerCase() === "administrator" ||
    currentRole.toLowerCase() === "owner";

  const visibleScreens = isAdmin
    ? allScreens
    : allScreens.filter((s) => !s.isAdminOnly);
  const hiddenCount = allScreens.length - visibleScreens.length;

  // Entry animation — slide in from right
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    el.style.transform = "translateX(24px)";
    el.style.opacity = "0";
    el.style.transition = "transform 220ms ease, opacity 200ms ease";
    requestAnimationFrame(() => {
      el.style.transform = "translateX(0)";
      el.style.opacity = "1";
    });
  }, []);

  return (
    <div
      ref={panelRef}
      className="flex flex-col h-full border-l border-border"
      style={{
        width: "100%",
        background: "var(--card)",
        boxShadow: "var(--shadow-elevated)",
      }}
      data-ocid="devmode.preview_panel"
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-2 px-4 h-16 border-b border-border flex-shrink-0">
        <Monitor
          className="w-[14px] h-[14px] flex-shrink-0"
          style={{ color: "var(--accent)" }}
        />
        <span
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: "var(--muted-foreground)" }}
        >
          Dev Preview
        </span>
        <button
          type="button"
          onClick={() => setDevMode({ enabled: false })}
          className="ml-auto p-1.5 rounded-md hover:bg-muted transition-colors"
          aria-label="Close preview panel"
          data-ocid="devmode.close_button"
        >
          <X
            className="w-icon-sm h-icon-sm"
            style={{ color: "var(--muted-foreground)" }}
          />
        </button>
      </div>

      {/* ── Simulated notice ── */}
      <div className="px-4 py-2 border-b border-border flex-shrink-0 bg-[var(--color-status-warning)]/[0.07]">
        <p className="text-2xs" style={{ color: "var(--muted-foreground)" }}>
          Simulated preview — not a running app. Screens and role culling
          reflect this project's spec.
        </p>
      </div>

      {/* ── Project label ── */}
      {project && (
        <div className="px-4 py-2.5 border-b border-border flex items-center gap-2 flex-shrink-0">
          <span
            className="text-xs-plus"
            style={{ color: "var(--muted-foreground)" }}
          >
            Previewing
          </span>
          <span
            className="text-xs-plus font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            {project.name}
          </span>
        </div>
      )}

      {/* ── Role selector ── */}
      <div className="px-4 py-3 border-b border-border flex-shrink-0">
        <p
          className="text-2xs font-medium uppercase tracking-widest mb-2"
          style={{ color: "var(--muted-foreground)" }}
        >
          Viewing as
        </p>
        <div className="flex flex-wrap gap-1.5">
          {roles.map((role) => {
            const active = role === currentRole;
            return (
              <button
                key={role}
                type="button"
                onClick={() => setDevMode({ selectedRole: role })}
                className={cn(
                  "px-3 py-1 rounded-full text-xs-plus font-medium transition-colors whitespace-nowrap",
                  active ? "" : "hover:bg-muted",
                )}
                style={
                  active
                    ? {
                        background: "var(--accent)",
                        color: "var(--accent-foreground)",
                      }
                    : {
                        background: "var(--muted)",
                        color: "var(--muted-foreground)",
                      }
                }
                data-ocid={`devmode.role_tab.${role.toLowerCase()}`}
              >
                {role}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Screen grid ── */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-3">
          <p
            className="text-xs-plus font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            Screens visible to{" "}
            <span style={{ color: "var(--accent)" }}>{currentRole}</span>
          </p>
          {hiddenCount > 0 && (
            <span
              className="text-2xs px-2 py-0.5 rounded-full"
              style={{
                background: "var(--muted)",
                color: "var(--muted-foreground)",
              }}
            >
              {hiddenCount} screen{hiddenCount !== 1 ? "s" : ""} hidden
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {visibleScreens.map((screen) => (
            <ScreenCard
              key={screen.title}
              screen={screen}
              isViewingAsAdmin={isAdmin}
            />
          ))}
        </div>

        {hiddenCount > 0 && (
          <p
            className="mt-4 text-2xs leading-relaxed"
            style={{ color: "var(--muted-foreground)", opacity: 0.7 }}
          >
            {hiddenCount} admin-only screen{hiddenCount !== 1 ? "s" : ""} not
            visible in this role. Switch to Admin to see all screens.
          </p>
        )}
      </div>
    </div>
  );
}
