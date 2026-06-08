import { ModeCard } from "@/components/layout/ModeCard";
import { ModeHeader } from "@/components/layout/ModeHeader";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useAppStore } from "@/store/useAppStore";
import type { Maturity, Project } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckSquare,
  Clock,
  Flame,
  Layers,
  LayoutTemplate,
  Lock,
  Rocket,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo } from "react";

const MATURITY_LABELS: Record<Maturity, string> = {
  idea: "Idea",
  exploring: "Exploring",
  defining: "Defining",
  building: "Building",
  live: "Live",
};

// Use only semantic Tailwind token classes — no raw oklch() or hex
const MATURITY_BADGE: Record<Maturity, { bg: string; text: string }> = {
  idea: { bg: "bg-muted", text: "text-muted-foreground" },
  exploring: { bg: "bg-muted", text: "text-muted-foreground" },
  defining: {
    bg: "bg-[color:oklch(var(--color-status-warning)/0.10)]",
    text: "text-[color:oklch(var(--color-status-warning))]",
  },
  building: { bg: "bg-accent/10", text: "text-accent" },
  live: { bg: "bg-accent/15", text: "text-accent" },
};

const ICON_MAP: Record<string, React.ReactNode> = {
  Stethoscope: <Stethoscope className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  Lock: <Lock className="w-4 h-4" />,
  CheckSquare: <CheckSquare className="w-4 h-4" />,
  CalendarCheck: <Clock className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
};

interface AttentionFlag {
  id: string;
  message: string;
  actionLabel: string;
  actionPath: string;
  variant: "warning" | "info" | "burn";
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

const GETTING_STARTED = [
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "Design your first app",
    description: "Answer a few questions and get a complete, exportable spec.",
    cta: "Start designing",
    path: "/design",
    mode: "design" as const,
    colorClass: "text-accent",
    bgClass: "bg-accent/10",
  },
  {
    icon: <ShoppingBag className="w-5 h-5" />,
    title: "Browse the app market",
    description: "Clone a ready-made template and customise it as your own.",
    cta: "Browse templates",
    path: "/market",
    mode: "market" as const,
    colorClass: "text-accent",
    bgClass: "bg-accent/10",
  },
  {
    icon: <Layers className="w-5 h-5" />,
    title: "Organise your portfolio",
    description: "Group projects into Hubs, add tags, set priorities.",
    cta: "Open Organize",
    path: "/organize",
    mode: "organize" as const,
    colorClass: "text-[color:oklch(var(--color-teal))]",
    bgClass: "bg-[color:oklch(var(--color-teal)/0.10)]",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "Manage a live app",
    description: "See health metrics, deploy history, and cost projections.",
    cta: "Open Manage",
    path: "/live",
    mode: "live" as const,
    colorClass: "text-[color:oklch(var(--color-status-warning))]",
    bgClass: "bg-[color:oklch(var(--color-status-warning)/0.10)]",
  },
];

function getAttentionFlags(projects: Project[]): AttentionFlag[] {
  const flags: AttentionFlag[] = [];
  const now = Date.now();
  const staleThreshold = 14 * 86400000;

  for (const project of projects) {
    const updated = Number(project.updatedAt);
    const age = now - updated;

    if (project.creatorUpdateAvailable) {
      flags.push({
        id: `update-${project.id}`,
        message: `${project.name} has an update available from the creator`,
        actionLabel: "Review",
        actionPath: "/organize",
        variant: "info",
      });
    }

    if (age > staleThreshold && project.metadata.maturity !== "live") {
      flags.push({
        id: `stale-${project.id}`,
        message: `${project.name} hasn't been updated in ${Math.floor(age / 86400000)} days`,
        actionLabel: "Open",
        actionPath: "/design",
        variant: "warning",
      });
    }

    if (
      project.burnRateStatus === "elevated" ||
      project.burnRateStatus === "critical"
    ) {
      flags.push({
        id: `burn-${project.id}`,
        message: `${project.name} burn rate is ${project.burnRateStatus === "critical" ? "critical" : "elevated"} this week`,
        actionLabel: "View in Manage",
        actionPath: "/live",
        variant: "burn",
      });
    }
  }

  return flags.slice(0, 4);
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { projects, setActiveProject, setMode } = useAppStore();

  const recentProjects = useMemo(
    () =>
      [...projects]
        .sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt))
        .slice(0, 4),
    [projects],
  );

  const attentionFlags = useMemo(() => getAttentionFlags(projects), [projects]);

  const liveCount = useMemo(
    () => projects.filter((p) => p.deploymentStatus === "live").length,
    [projects],
  );

  const _draftCount = useMemo(
    () =>
      projects.filter(
        (p) =>
          p.metadata.maturity === "building" ||
          p.metadata.maturity === "defining",
      ).length,
    [projects],
  );

  const showGettingStarted = projects.length < 3;
  const iterationCount = 12; // simulated

  function handleStartDesigning() {
    setMode("design");
    navigate({ to: "/design" });
  }

  function handleBrowseTemplates() {
    setMode("market");
    navigate({ to: "/market" });
  }

  function handleViewAll() {
    setMode("organize");
    navigate({ to: "/organize" });
  }

  function handleOpenProject(projectId: string, path: string) {
    setActiveProject(projectId);
    setMode(path.replace("/", "") as Parameters<typeof setMode>[0]);
    navigate({ to: path });
  }

  function handleFlagAction(flag: { actionPath: string }) {
    const mode = flag.actionPath.replace("/", "") as Parameters<
      typeof setMode
    >[0];
    setMode(mode);
    navigate({ to: flag.actionPath });
  }

  return (
    <PageWrapper
      header={
        <ModeHeader
          title="Dashboard"
          subtitle={
            <span className="text-sm text-muted-foreground">
              {getFormattedDate()}
            </span>
          }
          data-ocid="dashboard.header"
        />
      }
    >
      <div
        className="flex flex-col gap-6"
        data-ocid="dashboard.page"
        data-mode="design"
      >
        {/* ── Action cards + stats ─────────────────────────────────────── */}
        <section data-ocid="dashboard.welcome_section">
          {/* Welcome headline */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              {getGreeting()}.
            </h1>
          </div>
          {/* Action cards */}
          <div className="grid grid-cols-4 gap-4 mt-6" data-mode="design">
            <button
              type="button"
              onClick={handleStartDesigning}
              className="flex flex-col p-6 rounded-xl bg-card border border-border hover:border-accent/40 cursor-pointer hover:shadow-[var(--shadow-elevated)] transition-all text-left group"
              data-ocid="dashboard.action_card.design"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-lg font-semibold text-foreground mt-4">
                Start designing
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Turn your idea into a complete spec.
              </p>
            </button>
            <button
              type="button"
              onClick={handleBrowseTemplates}
              className="flex flex-col p-6 rounded-xl bg-card border border-border hover:border-border/60 cursor-pointer hover:shadow-[var(--shadow-elevated)] transition-all text-left group"
              data-ocid="dashboard.action_card.templates"
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-foreground">
                <LayoutTemplate className="w-6 h-6" />
              </div>
              <p className="text-lg font-semibold text-foreground mt-4">
                Browse templates
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Clone and customise a ready-made app.
              </p>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("live");
                navigate({ to: "/live" });
              }}
              className="flex flex-col p-6 rounded-xl bg-card border border-border hover:border-[color:oklch(var(--color-amber)/0.4)] cursor-pointer hover:shadow-[var(--shadow-elevated)] transition-all text-left relative group"
              data-ocid="dashboard.action_card.live"
            >
              {liveCount > 0 && (
                <span className="absolute top-3 right-3 text-xs font-bold bg-accent/15 text-accent px-2 py-0.5 rounded-full">
                  {liveCount} live
                </span>
              )}
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Rocket className="w-6 h-6" />
              </div>
              <p className="text-lg font-semibold text-foreground mt-4">
                See live apps
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Monitor health, costs, and deployments.
              </p>
            </button>
            <button
              type="button"
              onClick={handleViewAll}
              className="flex flex-col p-6 rounded-xl bg-card border border-border hover:border-[color:oklch(var(--color-sage)/0.4)] cursor-pointer hover:shadow-[var(--shadow-elevated)] transition-all text-left relative group"
              data-ocid="dashboard.action_card.recent"
            >
              {projects.length > 0 && (
                <span className="absolute top-3 right-3 text-xs font-bold bg-[color:oklch(var(--color-sage)/0.12)] text-[color:oklch(var(--color-sage))] px-2 py-0.5 rounded-full">
                  {projects.length} total
                </span>
              )}
              <div className="w-10 h-10 rounded-xl bg-[color:oklch(var(--color-sage)/0.10)] flex items-center justify-center text-[color:oklch(var(--color-sage))]">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-lg font-semibold text-foreground mt-4">
                View recent work
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                See all projects, tags, and priorities.
              </p>
            </button>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-8 mt-6 text-sm text-muted-foreground">
            <span>
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </span>
            <span>{liveCount} live</span>
            <span>{iterationCount} iterations this month</span>
          </div>
        </section>

        {/* ── Recent projects ──────────────────────────────────────────── */}
        <section data-ocid="dashboard.projects_section">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">
              Recent projects
            </h2>
            {projects.length > 4 && (
              <button
                type="button"
                onClick={handleViewAll}
                className="text-xs font-medium text-accent hover:underline underline-offset-2 transition-colors"
                data-ocid="dashboard.view_all_link"
              >
                View all →
              </button>
            )}
          </div>

          {recentProjects.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-12 rounded-xl border border-dashed border-border text-center bg-card/40"
              data-ocid="dashboard.projects_empty_state"
            >
              <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">
                No projects yet
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Start designing or browse templates to create your first app.
              </p>
              <button
                type="button"
                onClick={handleStartDesigning}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
                data-ocid="dashboard.empty_start_button"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Start designing
              </button>
            </div>
          ) : (
            <div
              className="grid grid-cols-4 gap-4"
              data-ocid="dashboard.projects_list"
            >
              {recentProjects.map((project, i) => {
                const maturity = (project.metadata.maturity ??
                  "idea") as Maturity;
                const badge = MATURITY_BADGE[maturity];
                const isLive = project.deploymentStatus === "live";
                const updatedDate = new Date(
                  Number(project.updatedAt),
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });

                return (
                  <div
                    key={project.id}
                    className="flex flex-col gap-3 p-4 rounded-xl bg-card border border-border shadow-[var(--shadow-card)] hover:border-accent/30 transition-colors"
                    data-ocid={`dashboard.project.item.${i + 1}`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Project icon */}
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-foreground"
                        style={{
                          background: project.iconColor ?? "var(--muted)",
                        }}
                      >
                        {ICON_MAP[project.icon] ?? (
                          <span className="text-xs font-bold text-foreground">
                            {project.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>

                      {/* Name + date */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {project.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Edited {updatedDate}
                        </p>
                      </div>

                      {/* Maturity badge */}
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${badge.bg} ${badge.text}`}
                      >
                        {MATURITY_LABELS[maturity]}
                      </span>
                    </div>

                    {/* Card footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-xs text-muted-foreground truncate">
                        {project.metadata.tags?.includes("cloned")
                          ? "Cloned template"
                          : project.category.replace(/([A-Z])/g, " $1").trim()}
                      </span>

                      {isLive ? (
                        <button
                          type="button"
                          onClick={() => handleOpenProject(project.id, "/live")}
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-accent/15 text-accent hover:bg-accent/25 transition-colors flex-shrink-0"
                          data-ocid={`dashboard.project.manage_button.${i + 1}`}
                        >
                          <Rocket className="w-3 h-3" />
                          Manage
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            handleOpenProject(project.id, "/design")
                          }
                          className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md bg-muted text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                          data-ocid={`dashboard.project.open_button.${i + 1}`}
                        >
                          Open
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Attention flags ──────────────────────────────────────────── */}
        {attentionFlags.length > 0 && (
          <section data-ocid="dashboard.flags_section">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-4 h-4 text-[color:oklch(var(--color-amber))]" />
              <h2 className="text-sm font-semibold text-foreground">
                Needs attention
              </h2>
            </div>

            {
              <div
                className="flex flex-col gap-2"
                data-ocid="dashboard.flags_list"
              >
                {attentionFlags.map((flag, i) => {
                  const isWarning = flag.variant === "warning";
                  const isBurn = flag.variant === "burn";
                  return (
                    <div
                      key={flag.id}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                        isBurn
                          ? "border-[color:oklch(var(--color-amber)/0.25)] bg-[color:oklch(var(--color-amber)/0.06)]"
                          : isWarning
                            ? "border-[color:oklch(var(--color-amber)/0.25)] bg-[color:oklch(var(--color-amber)/0.06)]"
                            : "border-accent/20 bg-accent/5"
                      }`}
                      data-ocid={`dashboard.flag.item.${i + 1}`}
                    >
                      <AlertTriangle
                        className={`w-4 h-4 flex-shrink-0 ${
                          isBurn
                            ? "text-[color:oklch(var(--color-amber))]"
                            : isWarning
                              ? "text-[color:oklch(var(--color-amber))]"
                              : "text-accent"
                        }`}
                      />
                      <p className="flex-1 text-sm text-foreground">
                        {flag.message}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleFlagAction(flag)}
                        className={`flex-shrink-0 text-xs font-semibold underline-offset-2 hover:underline transition-colors ${
                          isBurn
                            ? "text-[color:oklch(var(--color-amber))]"
                            : isWarning
                              ? "text-[color:oklch(var(--color-amber))]"
                              : "text-accent"
                        }`}
                        data-ocid={`dashboard.flag.action_button.${i + 1}`}
                      >
                        {flag.actionLabel} →
                      </button>
                    </div>
                  );
                })}
              </div>
            }
          </section>
        )}

        {/* ── Getting started (shown when few projects) ─────────────────── */}
        {showGettingStarted && (
          <section data-ocid="dashboard.getting_started_section">
            <h2 className="text-sm font-semibold text-foreground mb-4">
              Get started
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {GETTING_STARTED.map((item) => (
                <ModeCard
                  key={item.path}
                  onClick={() => {
                    setMode(item.mode);
                    navigate({ to: item.path });
                  }}
                  className="p-4 text-left hover:bg-muted/40 transition-colors"
                  data-ocid={`dashboard.getting_started.${item.mode}_button`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${item.bgClass} ${item.colorClass}`}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground mb-0.5">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 mt-2 text-xs font-medium ${item.colorClass}`}
                      >
                        {item.cta} <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </ModeCard>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageWrapper>
  );
}
