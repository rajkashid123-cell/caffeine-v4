import { useProjects } from "@/hooks/useProjects";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { AppMode } from "@/store/useAppStore";
import type { Project } from "@/types";
import { useLocation, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  Activity as ActivityIcon,
  BookOpen,
  Box,
  ChevronsLeft,
  ChevronsRight,
  House,
  Layers,
  LayoutGrid,
  Leaf,
  Lock,
  Moon,
  Pencil,
  Plus,
  Settings,
  ShoppingBag,
  Stethoscope,
  Sun,
  Terminal,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";

const MODE_CONFIG: {
  id: AppMode;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  path: string;
}[] = [
  {
    id: "design",
    label: "Design",
    icon: Pencil,
    path: "/design",
  },
  {
    id: "develop",
    label: "Develop",
    icon: Zap,
    path: "/develop",
  },
  {
    id: "organize",
    label: "Organize",
    icon: LayoutGrid,
    path: "/organize",
  },
  {
    id: "live",
    label: "Live",
    icon: Activity,
    path: "/live",
  },
  {
    id: "market",
    label: "Market",
    icon: ShoppingBag,
    path: "/market",
  },
];

const PROMINENT_MODES = ["organize", "live", "market"] as const;
const MUTED_MODES = ["design", "develop"] as const;

const ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  Stethoscope,
  Users,
  Lock,
  Activity: ActivityIcon,
  Layers,
  BookOpen,
  Box,
  Pencil,
  Zap,
  LayoutGrid,
  Settings,
  Plus,
};

function ProjectIcon({ project }: { project: Project }) {
  const Ico = ICON_MAP[project.icon] ?? Box;
  return (
    <span
      className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 text-accent-foreground"
      style={{ backgroundColor: project.iconColor }}
    >
      <Ico size={14} />
    </span>
  );
}

function extractRoles(specSections: import("@/types").SpecSection[]): string[] {
  const rolesSection = specSections.find(
    (s) =>
      s.heading.toLowerCase().includes("role") ||
      s.heading.toLowerCase().includes("access"),
  );
  if (!rolesSection) return ["Admin", "Member", "Viewer"];

  const lines = rolesSection.content
    .split("\n")
    .map((l) => l.replace(/^[-*•]\s*/, "").trim())
    .filter((l) => l.length > 1 && l.length < 40);

  return lines.length >= 2 ? lines.slice(0, 6) : ["Admin", "Member", "Viewer"];
}

export function Sidebar() {
  const [_settingsHint, _setSettingsHint] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const activeMode = useAppStore((s) => s.activeMode);
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const setMode = useAppStore((s) => s.setMode);
  const activeProjectId = useAppStore((s) => s.activeProjectId);
  const setActiveProject = useAppStore((s) => s.setActiveProject);
  const devMode = useAppStore((s) => s.devMode);
  const setDevMode = useAppStore((s) => s.setDevMode);
  const isLauncherMode = useAppStore((s) => s.isLauncherMode);
  const setIsLauncherMode = useAppStore((s) => s.setIsLauncherMode);
  const projects = useAppStore((s) => s.projects);
  // — Theme state from store —
  const storeTheme = useAppStore((s) => s.theme);
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const setStoreTheme = useAppStore((s) => s.setTheme);
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode);
  const { projects: allProjects } = useProjects();

  const activeProject =
    allProjects.find((p) => p.id === activeProjectId) ?? allProjects[0];
  const roles = activeProject
    ? extractRoles(
        activeProject.specSections as import("@/types").SpecSection[],
      )
    : ["Admin", "Member", "Viewer"];

  const activeProjectIsCloned =
    activeProject?.metadata.tags?.includes("cloned") ?? false;
  const _isLauncherContext = isLauncherMode || activeProjectIsCloned;

  const sidebarWidth = sidebarCollapsed ? "w-16" : "w-64";
  // Only show project list in design and develop modes
  const showProjectList = activeMode === "design" || activeMode === "develop";

  function handleModeClick(mode: AppMode, path: string) {
    setMode(mode);
    navigate({ to: path });
    if (isLauncherMode && (mode === "design" || mode === "develop")) {
      setIsLauncherMode(false);
    }
  }

  function handleProjectClick(id: string) {
    setActiveProject(activeProjectId === id ? null : id);
  }

  // Determine active mode from current path
  const currentPath = location.pathname;
  const isDashboardActive = currentPath === "/dashboard" || currentPath === "/";

  // Split modes into prominent and muted for launcher view
  const prominentModes = MODE_CONFIG.filter((m) =>
    PROMINENT_MODES.includes(m.id as (typeof PROMINENT_MODES)[number]),
  );
  const mutedModes = MODE_CONFIG.filter((m) =>
    MUTED_MODES.includes(m.id as (typeof MUTED_MODES)[number]),
  );

  function renderModeButton(modeConfig: (typeof MODE_CONFIG)[number]) {
    const { id, label, icon: Icon, path } = modeConfig;
    const isActive =
      !isDashboardActive &&
      (currentPath.startsWith(path) ||
        (currentPath === "/" && id === "design"));
    const isMuted =
      isLauncherMode &&
      MUTED_MODES.includes(id as (typeof MUTED_MODES)[number]);

    return (
      <button
        key={id}
        type="button"
        onClick={() => handleModeClick(id, path)}
        title={
          isMuted
            ? "Available for advanced editing"
            : sidebarCollapsed
              ? `${label} mode`
              : undefined
        }
        aria-label={`${label} mode`}
        className={cn(
          "flex items-center h-9 rounded-md text-sm font-medium focus-ring",
          "transition-all duration-200 ease-in-out",
          sidebarCollapsed ? "justify-center px-0 w-full" : "gap-3 px-3",
          isActive
            ? "bg-sidebar-accent/15 border-l-2 border-accent text-accent"
            : "hover:bg-sidebar-accent/10 border-l-2 border-transparent text-sidebar-foreground",
          isMuted && !isActive ? "launcher-muted-text launcher-muted-icon" : "",
        )}
        data-ocid={`sidebar.mode.${id}`}
        aria-current={isActive ? "page" : undefined}
      >
        <span
          className={cn(
            "flex-shrink-0",
            isActive ? "text-accent" : "text-sidebar-foreground",
          )}
        >
          <Icon className="w-[1.125rem] h-[1.125rem] transition-colors duration-200" />
        </span>
        {!sidebarCollapsed && (
          <span className="whitespace-nowrap leading-none text-sm">
            {label}
          </span>
        )}
      </button>
    );
  }

  return (
    <aside
      className={cn(
        "flex flex-col flex-shrink-0 h-full bg-sidebar border-r border-sidebar-border overflow-hidden",
        "transition-all duration-200 ease-in-out",
        sidebarWidth,
      )}
      data-ocid="sidebar"
    >
      {/* Header — Wordmark + Collapse Toggle */}
      <div className="flex items-center justify-between h-16 px-3 border-b border-sidebar-border flex-shrink-0">
        {!sidebarCollapsed && (
          <span className="text-sidebar-primary font-semibold text-sm tracking-tight font-display">
            caffeine
          </span>
        )}
        <button
          type="button"
          onClick={toggleSidebar}
          className={cn(
            "p-1.5 rounded-md hover:bg-sidebar-accent/20 transition-colors focus-ring text-sidebar-foreground",
            sidebarCollapsed ? "mx-auto" : "ml-auto",
          )}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          data-ocid="sidebar.toggle"
        >
          {sidebarCollapsed ? (
            <ChevronsRight className="w-[1.125rem] h-[1.125rem]" />
          ) : (
            <ChevronsLeft className="w-[1.125rem] h-[1.125rem]" />
          )}
        </button>
      </div>

      {/* New Project Button */}
      <div
        className={cn(
          "py-3 border-b border-sidebar-border flex-shrink-0",
          sidebarCollapsed ? "flex justify-center px-2" : "px-3",
        )}
      >
        {sidebarCollapsed ? (
          <button
            type="button"
            onClick={() => {
              setMode("design");
              navigate({ to: "/design" });
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground hover:opacity-90 transition-opacity flex-shrink-0"
            title="New project"
            aria-label="New project"
            data-ocid="sidebar.new_button"
          >
            <Plus className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setMode("design");
              navigate({ to: "/design" });
            }}
            className="flex items-center gap-2 w-full rounded-md bg-sidebar-primary text-sidebar-primary-foreground hover:opacity-90 transition-opacity font-medium text-sm px-3 py-2"
            data-ocid="sidebar.new_button"
          >
            <Plus className="w-4 h-4" />
            <span>New project</span>
          </button>
        )}
      </div>

      {/* Mode Navigation */}
      <nav
        className="flex flex-col gap-0.5 px-2 py-3 border-b border-sidebar-border flex-shrink-0"
        onKeyDown={(e) => {
          const buttons = Array.from(
            e.currentTarget.querySelectorAll<HTMLButtonElement>("button"),
          );
          const idx = buttons.indexOf(
            document.activeElement as HTMLButtonElement,
          );
          if (e.key === "ArrowDown" && idx < buttons.length - 1) {
            e.preventDefault();
            buttons[idx + 1].focus();
          } else if (e.key === "ArrowUp" && idx > 0) {
            e.preventDefault();
            buttons[idx - 1].focus();
          }
        }}
      >
        {/* Home / Dashboard nav item */}
        <button
          type="button"
          onClick={() => navigate({ to: "/dashboard" })}
          title={sidebarCollapsed ? "Dashboard" : undefined}
          aria-label="Dashboard"
          aria-current={isDashboardActive ? "page" : undefined}
          className={cn(
            "flex items-center h-9 rounded-md text-sm font-medium focus-ring",
            "transition-all duration-200 ease-in-out",
            sidebarCollapsed ? "justify-center px-0 w-full" : "gap-3 px-3",
            isDashboardActive
              ? "bg-sidebar-accent/15 border-l-2 border-accent text-accent"
              : "hover:bg-sidebar-accent/10 border-l-2 border-transparent text-sidebar-foreground",
          )}
          data-ocid="sidebar.mode.dashboard"
        >
          <span
            className="flex-shrink-0"
            style={{ color: isDashboardActive ? undefined : undefined }}
          >
            <House
              className={cn(
                "w-[1.125rem] h-[1.125rem] transition-colors duration-200",
                isDashboardActive ? "text-accent" : "text-sidebar-foreground",
              )}
            />
          </span>
          {!sidebarCollapsed && (
            <span className="whitespace-nowrap leading-none">Home</span>
          )}
        </button>

        {isLauncherMode ? (
          <>
            {/* Prominent modes section */}
            {!sidebarCollapsed && (
              <p className="text-xs uppercase tracking-wider text-sidebar-muted-foreground px-3 pt-2 pb-0.5">
                Your app
              </p>
            )}
            {prominentModes.map(renderModeButton)}

            {/* Separator between prominent and muted */}
            <div className="border-t border-border/30 my-2" />

            {/* Muted modes section */}
            {!sidebarCollapsed && (
              <p className="text-xs uppercase tracking-wider text-sidebar-muted-foreground px-3 pt-2 pb-0.5">
                Build
              </p>
            )}
            {mutedModes.map(renderModeButton)}
          </>
        ) : (
          MODE_CONFIG.map(renderModeButton)
        )}
      </nav>

      {isLauncherMode && (
        <p className="px-3 py-2 text-xs text-sidebar-muted-foreground">
          Your app is ready to explore.
        </p>
      )}

      {/* Projects List — only in design and develop modes */}
      <div className="flex-1 overflow-y-auto min-h-0 py-2">
        {showProjectList && (
          <>
            {!sidebarCollapsed && (
              <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-2 text-sidebar-muted-foreground">
                Projects
              </p>
            )}
            <div
              className={cn(
                "flex flex-col gap-0.5 px-2",
                sidebarCollapsed && "items-center",
              )}
            >
              {projects.length === 0 && !sidebarCollapsed && (
                <p className="text-xs px-1 py-2 leading-snug text-sidebar-muted-foreground">
                  No projects yet.
                  <br />
                  Click{" "}
                  <span className="font-medium text-accent">New project</span>{" "}
                  to begin.
                </p>
              )}
              {projects.slice(0, 10).map((project) => {
                const isSelected = activeProjectId === project.id;
                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => handleProjectClick(project.id)}
                    title={project.name}
                    className={cn(
                      "flex items-center h-9 gap-2.5 rounded-md text-sm focus-ring text-sidebar-foreground",
                      "transition-all duration-200 ease-in-out",
                      sidebarCollapsed
                        ? "justify-center px-0 w-full"
                        : "px-2.5 w-full",
                      isSelected
                        ? "bg-sidebar-accent/20"
                        : "hover:bg-sidebar-accent/10",
                    )}
                    data-ocid={`sidebar.project.${project.id}`}
                  >
                    <span className="relative flex-shrink-0">
                      <ProjectIcon project={project} />
                      {project.metadata.attentionFlag && (
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[oklch(var(--color-status-warning))]" />
                      )}
                    </span>
                    {!sidebarCollapsed && (
                      <span className="truncate flex-1 min-w-0 text-left">
                        {project.name}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Dev Mode toggle + role switcher — only in design/develop with a selected project */}
      {(activeMode === "design" || activeMode === "develop") &&
        activeProjectId && (
          <div
            className={cn(
              "border-t border-sidebar-border flex-shrink-0 px-3 py-2",
              sidebarCollapsed
                ? "flex flex-col items-center gap-2"
                : "flex flex-col gap-1.5",
            )}
          >
            <div
              className={cn(
                "flex items-center gap-2 h-7",
                sidebarCollapsed && "justify-center",
              )}
            >
              {/* Toggle switch */}
              <button
                type="button"
                role="switch"
                aria-checked={devMode.enabled}
                title={devMode.enabled ? "Dev mode on" : "Dev mode off"}
                onClick={() =>
                  setDevMode({
                    enabled: !devMode.enabled,
                    selectedRole: devMode.selectedRole || roles[0],
                  })
                }
                className={cn(
                  "relative inline-flex h-4 w-7 flex-shrink-0 rounded-full border-2 border-transparent",
                  "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
                  devMode.enabled
                    ? "bg-sidebar-primary"
                    : "bg-sidebar-foreground/20",
                )}
                aria-label="Toggle dev mode"
                data-ocid="sidebar.devmode_toggle"
              >
                <span
                  className={cn(
                    "pointer-events-none block h-3 w-3 rounded-full bg-sidebar-foreground/90 shadow-sm",
                    "transition-transform duration-200",
                    devMode.enabled ? "translate-x-3" : "translate-x-0",
                  )}
                />
              </button>
              {!sidebarCollapsed && (
                <span
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wider transition-colors",
                    devMode.enabled
                      ? "text-accent"
                      : "text-sidebar-muted-foreground",
                  )}
                >
                  DEV
                </span>
              )}
            </div>

            {/* Role switcher — only when devMode ON and not collapsed */}
            {devMode.enabled && !sidebarCollapsed && (
              <select
                value={devMode.selectedRole || roles[0]}
                onChange={(e) => setDevMode({ selectedRole: e.target.value })}
                className="w-full text-xs rounded-md px-2 py-1 border border-sidebar-border focus:outline-none bg-sidebar text-sidebar-foreground"
                aria-label="Preview role"
                data-ocid="sidebar.devmode_role_select"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

      {/* Footer — fixed h-16 to match header */}
      <div className="flex items-center justify-between h-16 flex-shrink-0 px-3 border-t border-sidebar-border">
        {/* Style toggle — Classic vs Soils */}
        {sidebarCollapsed ? (
          <button
            type="button"
            onClick={() =>
              setStoreTheme(storeTheme === "classic" ? "soils" : "classic")
            }
            title={`Switch to ${
              storeTheme === "classic" ? "Apple" : "Classic"
            } style`}
            className="p-2 rounded-md hover:bg-sidebar-accent/15 transition-colors flex-shrink-0 focus-ring text-sidebar-muted-foreground hover:text-sidebar-foreground mx-auto"
            aria-label={`Switch to ${
              storeTheme === "classic" ? "Apple" : "Classic"
            } style`}
            data-ocid="sidebar.style_toggle"
          >
            {storeTheme === "classic" ? (
              <Terminal className="w-4 h-4" />
            ) : (
              <Leaf className="w-4 h-4" />
            )}
          </button>
        ) : (
          <fieldset
            className="flex items-center gap-1 border-0 p-0 m-0"
            aria-label="Visual style"
          >
            <button
              type="button"
              onClick={() => setStoreTheme("classic")}
              className={cn(
                "flex items-center gap-1 justify-center text-xs px-2 py-1 rounded-md transition-all font-medium",
                storeTheme === "classic"
                  ? "bg-accent text-accent-foreground"
                  : "text-sidebar-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/15",
              )}
              aria-pressed={storeTheme === "classic"}
              data-ocid="sidebar.style.classic"
            >
              <Terminal className="w-3 h-3" />
              Classic
            </button>
            <button
              type="button"
              onClick={() => setStoreTheme("soils")}
              className={cn(
                "flex items-center gap-1 justify-center text-xs px-2 py-1 rounded-md transition-all font-medium",
                storeTheme === "soils"
                  ? "bg-accent text-accent-foreground"
                  : "text-sidebar-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/15",
              )}
              aria-pressed={storeTheme === "soils"}
              data-ocid="sidebar.style.apple"
            >
              <Leaf className="w-3 h-3" />
              Apple
            </button>
          </fieldset>
        )}

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleDarkMode}
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="p-2 rounded-md hover:bg-sidebar-accent/15 transition-colors flex-shrink-0 focus-ring text-sidebar-muted-foreground hover:text-sidebar-foreground"
          aria-label={
            isDarkMode ? "Switch to light mode" : "Switch to dark mode"
          }
          data-ocid="sidebar.theme_toggle"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
