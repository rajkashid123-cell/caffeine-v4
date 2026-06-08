import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DesignFlow } from "@/components/design-mode/DesignFlow";
import { ModeHeader } from "@/components/layout/ModeHeader";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useProjects } from "@/hooks/useProjects";
import { getContextualSteps } from "@/lib/designFlowData";
import { assembleSpec } from "@/lib/specAssembler";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { DesignFlowAnswers, SpecSection } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { Clock, Copy, FileText, Hammer, Sparkles } from "lucide-react";
import { useState } from "react";

export function DesignPage() {
  const navigate = useNavigate();
  const { projects, createProject, updateAnswers, updateSpec } = useProjects();
  const activeProjectId = useAppStore((s) => s.activeProjectId);
  const setActiveProject = useAppStore((s) => s.setActiveProject);
  const setMode = useAppStore((s) => s.setMode);
  const designFlowActive = useAppStore((s) => s.designFlowActive);
  const startDesignFlow = useAppStore((s) => s.startDesignFlow);
  const endDesignFlow = useAppStore((s) => s.endDesignFlow);
  const designFlowProjectId = useAppStore((s) => s.designFlowProjectId);

  const setSidebarCollapsed = useAppStore((s) => s.setSidebarCollapsed);
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const [sidebarWasCollapsed, setSidebarWasCollapsed] = useState<
    boolean | null
  >(null);

  const [namingActive, setNamingActive] = useState(false);
  const [pendingName, setPendingName] = useState("");
  const [namingSource, setNamingSource] = useState<"scratch" | null>(null);
  const [draftPickerOpen, setDraftPickerOpen] = useState(false);

  const activeProject = projects.find(
    (p) => p.id === (designFlowProjectId ?? activeProjectId),
  );
  const flowAnswers: DesignFlowAnswers = activeProject?.answers
    ? (() => {
        try {
          return JSON.parse(activeProject.answers) as DesignFlowAnswers;
        } catch {
          return {};
        }
      })()
    : {};

  const draftProjects = projects.filter(
    (p) =>
      p.deploymentStatus === "notDeployed" || p.deploymentStatus === "failed",
  );

  function handleStartScratch() {
    setNamingSource("scratch");
    setNamingActive(true);
    setPendingName("");
    setDraftPickerOpen(false);
  }

  function handleCloneTemplate() {
    navigate({ to: "/market" });
  }

  function handleContinueDraft() {
    setDraftPickerOpen((v) => !v);
    setNamingActive(false);
  }

  function handleStartWithName(name: string) {
    const finalName = name.trim() || "My App Idea";
    const project = createProject(finalName);
    setActiveProject(project.id);
    setSidebarWasCollapsed(sidebarCollapsed);
    setSidebarCollapsed(true);
    startDesignFlow(project.id);
    setNamingActive(false);
    setPendingName("");
    setNamingSource(null);
  }

  function handleExistingProjectFlow(projectId: string) {
    setActiveProject(projectId);
    setSidebarWasCollapsed(sidebarCollapsed);
    setSidebarCollapsed(true);
    startDesignFlow(projectId);
    setDraftPickerOpen(false);
  }

  function handleEndDesignFlow() {
    if (sidebarWasCollapsed !== null) {
      setSidebarCollapsed(sidebarWasCollapsed);
      setSidebarWasCollapsed(null);
    }
    endDesignFlow();
  }

  function handleSaveAnswers(answers: DesignFlowAnswers) {
    const id = designFlowProjectId ?? activeProjectId;
    if (!id) return;
    updateAnswers(id, JSON.stringify(answers));
  }

  const [completeError, setCompleteError] = useState<string | null>(null);
  const [liveSpec, setLiveSpec] = useState<SpecSection[]>(() => {
    if (!flowAnswers || Object.keys(flowAnswers).length === 0) return [];
    try {
      return assembleSpec(flowAnswers).sections.map((s) => ({
        heading: s.heading,
        content: s.content,
      }));
    } catch {
      return [];
    }
  });
  const [specPanelOpen, setSpecPanelOpen] = useState(true);

  const visibleSteps = getContextualSteps(flowAnswers);
  const answeredKeys = new Set(
    Object.keys(flowAnswers).filter((k) => {
      const v = flowAnswers[k as keyof DesignFlowAnswers];
      return (
        v !== undefined && v !== "" && (Array.isArray(v) ? v.length > 0 : true)
      );
    }),
  );
  const remainingSteps = visibleSteps.filter(
    (s) => s.answerKey && !answeredKeys.has(s.answerKey),
  );
  const hasRemainingSteps = remainingSteps.length > 0;

  function handleComplete(answers: DesignFlowAnswers) {
    const id = designFlowProjectId ?? activeProjectId;
    if (!id) return;
    setCompleteError(null);
    try {
      updateAnswers(id, JSON.stringify(answers));
      const blueprint = assembleSpec(answers);
      updateSpec(
        id,
        blueprint.sections.map((s) => ({
          heading: s.heading,
          content: s.content,
        })),
      );
    } catch (err) {
      console.error("[DesignPage] handleComplete failed:", err);
      setCompleteError(
        err instanceof Error
          ? err.message
          : "Failed to save spec. Please try again.",
      );
    }
  }

  function handleOpenOrganize() {
    handleEndDesignFlow();
    setMode("organize");
    navigate({ to: "/organize" });
  }

  function handleStartIterating() {
    const id = designFlowProjectId ?? activeProjectId;
    if (id) setActiveProject(id);
    handleEndDesignFlow();
    setMode("develop");
    navigate({ to: "/develop" });
  }

  // ── Design flow active ──
  if (designFlowActive && (designFlowProjectId ?? activeProjectId)) {
    const name = activeProject?.name ?? "My App Idea";
    return (
      <ErrorBoundary fallbackLabel="Design">
        <PageWrapper noPadding scrollable={false}>
          <div
            className="flex-shrink-0 flex items-center justify-between gap-4 px-6 h-16 bg-card border-b border-border"
            data-ocid="design.flow.header"
          >
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={handleEndDesignFlow}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                data-ocid="design.flow.exit_button"
                aria-label="Exit design flow"
              >
                ← Back
              </button>
              <span className="text-sm font-semibold text-foreground truncate max-w-56">
                {name}
              </span>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-muted-foreground tabular-nums">
                  {visibleSteps.length - remainingSteps.length} /{" "}
                  {visibleSteps.length} steps
                </span>
                <div
                  className="h-1 w-24 rounded-full bg-border overflow-hidden"
                  aria-hidden="true"
                >
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        visibleSteps.length > 0
                          ? Math.round(
                              ((visibleSteps.length - remainingSteps.length) /
                                visibleSteps.length) *
                                100,
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSpecPanelOpen((v) => !v)}
              className={cn(
                "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors flex-shrink-0",
                specPanelOpen
                  ? "bg-accent/10 border-accent/30 text-accent"
                  : "bg-muted/40 border-border text-muted-foreground hover:text-foreground",
              )}
              data-ocid="design.flow.spec_panel_toggle"
            >
              <FileText size={12} />
              Spec
            </button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            <div
              className={cn(
                "flex items-start justify-center overflow-hidden transition-all duration-300",
                specPanelOpen ? "flex-1 p-8" : "w-full p-8",
              )}
            >
              <div className="w-full h-full bg-card border border-border rounded-xl overflow-hidden flex flex-col shadow-sm">
                <DesignFlow
                  projectName={name}
                  initialAnswers={flowAnswers}
                  onComplete={handleComplete}
                  onSaveAnswers={handleSaveAnswers}
                  onOpenOrganize={handleOpenOrganize}
                  onStartIterating={handleStartIterating}
                  onSpecUpdate={setLiveSpec}
                />
              </div>
            </div>

            {specPanelOpen && (
              <div
                className="w-72 shrink-0 border-l border-border bg-muted/20 flex flex-col overflow-hidden"
                data-ocid="design.flow.spec_panel"
              >
                <div className="px-4 py-3 border-b border-border flex-shrink-0">
                  <p className="text-xs font-medium text-foreground">
                    Spec so far
                  </p>
                  <p className="text-2xs text-muted-foreground mt-0.5">
                    Updates with every choice
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                  {liveSpec.length === 0 ? (
                    <div
                      className="flex flex-col items-center justify-center h-full text-center py-8"
                      data-ocid="design.flow.spec_panel.empty_state"
                    >
                      <FileText
                        size={28}
                        className="text-muted-foreground/30 mb-3"
                      />
                      <p className="text-xs text-muted-foreground">
                        Make your first selection to start building your spec.
                      </p>
                    </div>
                  ) : (
                    <>
                      {liveSpec.map((section) => (
                        <div
                          key={section.heading}
                          className="p-3 rounded-lg bg-card border border-border shadow-sm"
                        >
                          <p className="text-2xs font-semibold text-foreground mb-1">
                            {section.heading}
                          </p>
                          <p className="text-2xs text-muted-foreground leading-relaxed whitespace-pre-line line-clamp-4">
                            {section.content}
                          </p>
                        </div>
                      ))}
                      {hasRemainingSteps && (
                        <div
                          className="py-4 px-3 rounded-lg border border-dashed border-border bg-muted/20 text-center"
                          data-ocid="design.flow.spec_panel.remaining_placeholder"
                        >
                          <p className="text-2xs text-muted-foreground">
                            More decisions to come...
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </PageWrapper>
      </ErrorBoundary>
    );
  }

  // ── Entry point: three-path hero ──
  const pathCards = [
    {
      key: "scratch",
      icon: Hammer,
      accentVar: "var(--design-accent)",
      title: "Build from scratch",
      description:
        "Answer a few questions and we'll generate a complete spec for your app.",
      onClick: handleStartScratch,
      ocid: "design.path.scratch",
    },
    {
      key: "clone",
      icon: Copy,
      accentVar: "var(--develop-accent)",
      title: "Clone a template",
      description:
        "Start from a proven app in the Market and customize it for your needs.",
      onClick: handleCloneTemplate,
      ocid: "design.path.clone",
    },
    {
      key: "continue",
      icon: Clock,
      accentVar: "var(--organize-accent)",
      title: "Continue a draft",
      description:
        draftProjects.length > 0
          ? `You have ${draftProjects.length} draft${
              draftProjects.length !== 1 ? "s" : ""
            } in progress.`
          : "No drafts yet — start a new project first.",
      onClick: draftProjects.length > 0 ? handleContinueDraft : undefined,
      disabled: draftProjects.length === 0,
      ocid: "design.path.continue",
    },
  ];

  return (
    <ErrorBoundary fallbackLabel="Design">
      <PageWrapper
        header={
          <ModeHeader title="Design" subtitle="Turn your idea into a spec" />
        }
      >
        <div
          className="flex flex-col gap-6"
          data-mode="design"
          data-ocid="design.page"
        >
          {completeError && (
            <div
              className="px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive"
              data-ocid="design.error_state"
            >
              {completeError}
            </div>
          )}

          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              What are you building?
            </h1>
            <p className="text-base text-muted-foreground">
              Choose how you want to start.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6" data-ocid="design.paths">
            {pathCards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.key}
                  type="button"
                  onClick={card.disabled ? undefined : card.onClick}
                  disabled={card.disabled}
                  className={cn(
                    "flex flex-col items-start gap-4 p-6 rounded-xl bg-card border border-border text-left",
                    "transition-all duration-200",
                    card.disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-elevated hover:border-border/80 cursor-pointer",
                  )}
                  data-ocid={card.ocid}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${card.accentVar}22` }}
                  >
                    <Icon size={20} style={{ color: card.accentVar }} />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground mb-1.5">
                      {card.title}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                  {!card.disabled && (
                    <span
                      className="mt-auto text-xs font-medium flex items-center gap-1"
                      style={{ color: card.accentVar }}
                    >
                      {card.key === "scratch" && "Start designing"}
                      {card.key === "clone" && "Browse templates"}
                      {card.key === "continue" && "See drafts"}
                      <Sparkles size={11} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {namingActive && namingSource === "scratch" && (
            <div
              className="p-5 rounded-xl bg-card border border-border shadow-sm max-w-sm"
              data-ocid="design.name_prompt"
            >
              <p className="text-sm font-semibold text-foreground mb-1">
                Name your project
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Give it a working name — you can change it later.
              </p>
              <input
                type="text"
                value={pendingName}
                onChange={(e) => setPendingName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleStartWithName(pendingName);
                  if (e.key === "Escape") {
                    setNamingActive(false);
                    setNamingSource(null);
                  }
                }}
                placeholder="e.g. My booking app"
                className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 mb-3"
                data-ocid="design.name_input"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStartWithName(pendingName)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                  data-ocid="design.name_confirm_button"
                >
                  Start designing →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNamingActive(false);
                    setNamingSource(null);
                  }}
                  className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-ocid="design.name_cancel_button"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {draftPickerOpen && draftProjects.length > 0 && (
            <div data-ocid="design.draft_picker">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                Your drafts
              </p>
              <div className="space-y-2">
                {draftProjects.slice(0, 6).map((project, i) => {
                  const lastEdited = new Date(
                    Number(project.updatedAt),
                  ).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  });
                  return (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => handleExistingProjectFlow(project.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border hover:border-accent/40 hover:bg-accent/5 transition-all duration-150 text-left"
                      data-ocid={`design.draft.item.${i + 1}`}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-foreground"
                        style={{ backgroundColor: project.iconColor }}
                      >
                        {project.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {project.name}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {project.metadata.maturity}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {lastEdited}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </PageWrapper>
    </ErrorBoundary>
  );
}
