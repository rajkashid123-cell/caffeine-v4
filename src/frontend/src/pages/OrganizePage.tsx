import { ErrorBoundary } from "@/components/ErrorBoundary";
import { BreadcrumbHeader } from "@/components/layout/BreadcrumbHeader";
import { ModeHeader } from "@/components/layout/ModeHeader";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { BulkActionBar } from "@/components/organize/BulkActionBar";
import { FilterBar } from "@/components/organize/FilterBar";
import { HubsPanel } from "@/components/organize/HubsPanel";
import { ProjectCard } from "@/components/organize/ProjectCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { useProjects } from "@/hooks/useProjects";
import { getSortedProjects } from "@/lib/sampleProjects";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { DeploymentStatus, Maturity, Project } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Copy,
  FileText,
  Flag,
  IterationCcw,
  LayoutGrid,
  Network,
  Pencil,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export function OrganizePage() {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const activeProjectId = useAppStore((s) => s.activeProjectId);
  const setActiveProject = useAppStore((s) => s.setActiveProject);
  const organizeFilters = useAppStore((s) => s.organizeFilters);
  const organizeSortBy = useAppStore((s) => s.organizeSortBy);
  const organizeView = useAppStore((s) => s.organizeView);
  const setOrganizeView = useAppStore((s) => s.setOrganizeView);
  const setMode = useAppStore((s) => s.setMode);

  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const updateProject = useAppStore((s) => s.updateProject);

  useEffect(() => {
    setActiveProject(null);
  }, [setActiveProject]);

  const isFiltering =
    !!organizeFilters.priority ||
    !!organizeFilters.maturity ||
    !!organizeFilters.deploymentStatus ||
    organizeFilters.tags.length > 0;

  const maturityCounts = useMemo(() => {
    const counts: Partial<Record<Maturity, number>> = {};
    for (const p of projects) {
      const m = p.metadata.maturity as Maturity;
      counts[m] = (counts[m] ?? 0) + 1;
    }
    return counts;
  }, [projects]);

  const flaggedCount = useMemo(
    () => projects.filter((p) => p.metadata.attentionFlag).length,
    [projects],
  );

  const MATURITY_DOTS: Record<Maturity, string> = {
    idea: "bg-muted-foreground/40",
    exploring: "bg-secondary",
    defining: "bg-accent",
    building: "bg-[color:oklch(var(--color-amber))]",
    live: "bg-accent",
  };

  const MATURITY_ORDER: Maturity[] = [
    "idea",
    "exploring",
    "defining",
    "building",
    "live",
  ];

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const p of projects)
      for (const t of p.metadata?.tags ?? []) set.add(t);
    return Array.from(set).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    const sorted = getSortedProjects(projects, organizeSortBy);
    return sorted.filter((p) => {
      if (
        organizeFilters.priority &&
        p.metadata.priority !== organizeFilters.priority
      )
        return false;
      if (
        organizeFilters.maturity &&
        p.metadata.maturity !== organizeFilters.maturity
      )
        return false;
      if (
        organizeFilters.deploymentStatus &&
        p.deploymentStatus !== organizeFilters.deploymentStatus
      )
        return false;
      if (organizeFilters.tags.length > 0) {
        const hasAll = organizeFilters.tags.every((t) =>
          (p.metadata?.tags ?? []).includes(t),
        );
        if (!hasAll) return false;
      }
      return true;
    });
  }, [projects, organizeSortBy, organizeFilters]);

  const [focusedId, setFocusedId] = useState<string | null>(null);

  function handleCardClick(id: string) {
    setFocusedId(id);
    setCheckedIds([]);
  }

  function handleCheckboxClick(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function handleBackFromDetail() {
    setFocusedId(null);
    setActiveProject(null);
  }

  const focusedProject = focusedId
    ? projects.find((p) => p.id === focusedId)
    : null;

  const subtitleNode =
    projects.length > 0 ? (
      <div
        className="flex items-center gap-3 flex-wrap"
        data-ocid="organize.stats_row"
      >
        {isFiltering ? (
          <span className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {filtered.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {projects.length}
            </span>{" "}
            projects
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {projects.length}
            </span>{" "}
            project{projects.length !== 1 ? "s" : ""}
          </span>
        )}
        <span className="text-xs text-muted-foreground/30" aria-hidden="true">
          ·
        </span>
        <div className="flex items-center gap-3 flex-wrap">
          {MATURITY_ORDER.filter((m) => (maturityCounts[m] ?? 0) > 0).map(
            (m) => (
              <span
                key={m}
                className="flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                <span
                  className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${MATURITY_DOTS[m]}`}
                />
                <span className="capitalize">{m}</span>
                <span className="font-medium text-foreground">
                  {maturityCounts[m]}
                </span>
              </span>
            ),
          )}
        </div>
        {flaggedCount > 0 && (
          <>
            <span className="text-xs text-border" aria-hidden="true">
              ·
            </span>
            <span
              className="flex items-center gap-1 text-xs font-medium"
              style={{ color: "var(--live-health-warn)" }}
            >
              <AlertTriangle size={11} />
              <span className="font-medium">{flaggedCount}</span> flagged
            </span>
          </>
        )}
      </div>
    ) : undefined;

  if (focusedProject) {
    return (
      <ErrorBoundary fallbackLabel="Organize">
        <ProjectDetailScreen
          project={focusedProject}
          onBack={handleBackFromDetail}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary fallbackLabel="Organize">
      <PageWrapper
        noPadding
        scrollable={false}
        header={
          <ModeHeader
            title="Organize"
            subtitle={subtitleNode}
            actions={
              <div className="flex items-center rounded-md border border-border bg-muted/40 p-0.5 gap-0.5">
                <button
                  type="button"
                  onClick={() => setOrganizeView("grid")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors focus-ring",
                    organizeView === "grid"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  data-ocid="organize.tab.projects"
                >
                  <LayoutGrid size={12} />
                  Projects
                </button>
                <button
                  type="button"
                  onClick={() => setOrganizeView("hubs")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors focus-ring",
                    organizeView === "hubs"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  data-ocid="organize.tab.hubs"
                >
                  <Network size={12} />
                  Hubs
                </button>
              </div>
            }
            below={
              <FilterBar resultCount={filtered.length} allTags={allTags} />
            }
            data-ocid="organize.header"
          />
        }
      >
        <div
          data-mode="organize"
          data-ocid="organize.page"
          className="flex flex-col flex-1 min-h-0 h-full relative"
        >
          {organizeView === "hubs" ? (
            <div className="flex-1 overflow-y-auto min-h-0 px-6 py-6">
              <HubsPanel />
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
                {filtered.length === 0 ? (
                  <EmptyState
                    icon={LayoutGrid}
                    title="No projects match"
                    description="Adjust your filters or start a new project."
                    actionLabel="Start designing"
                    onAction={() => {
                      setMode("design");
                      navigate({ to: "/design" });
                    }}
                    data-ocid="organize.empty_state"
                  />
                ) : (
                  <div
                    className="grid gap-4"
                    style={{
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(260px, 1fr))",
                      alignItems: "start",
                    }}
                    data-ocid="organize.project.list"
                  >
                    {filtered.map((project, i) => (
                      <ProjectCard
                        key={project.id}
                        project={project as Project & { isSample?: boolean }}
                        isSelected={activeProjectId === project.id}
                        isChecked={checkedIds.includes(project.id)}
                        onCardClick={() => handleCardClick(project.id)}
                        onCheckboxClick={(e) =>
                          handleCheckboxClick(project.id, e)
                        }
                        index={i + 1}
                        onDeploy={(projectId) => {
                          updateProject({
                            ...project,
                            deploymentStatus: "live" as DeploymentStatus,
                            metadata: {
                              ...project.metadata,
                              maturity: "live" as Maturity,
                            },
                          } as Project);
                          void projectId;
                        }}
                        onGoLive={() => {
                          setActiveProject(project.id);
                          setMode("live");
                          navigate({ to: "/live" });
                        }}
                        onApplyUpdate={() => {
                          updateProject({
                            ...project,
                            creatorUpdateAvailable: false,
                            pendingUpdate: null,
                            updateConflict: false,
                            lastCreatorUpdate: Date.now(),
                          } as Project);
                        }}
                        onSkipUpdate={() => {
                          updateProject({
                            ...project,
                            creatorUpdateAvailable: false,
                            pendingUpdate: null,
                          } as Project);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <BulkActionBar
                selectedIds={checkedIds}
                onClearSelection={() => setCheckedIds([])}
              />
            </>
          )}
        </div>
      </PageWrapper>
    </ErrorBoundary>
  );
}

// ─── ProjectDetailScreen ──────────────────────────────────────────────────────

const PRIORITY_LABELS = { high: "High", medium: "Medium", low: "Low" };
const MATURITY_LABELS = {
  idea: "Idea",
  exploring: "Exploring",
  defining: "Defining",
  building: "Building",
  live: "Live",
};

function ProjectDetailScreen({
  project,
  onBack,
}: {
  project: Project;
  onBack: () => void;
}) {
  const navigate = useNavigate();
  const { updateMetadata, deleteProject, duplicateProject } = useProjects();
  const setActiveProject = useAppStore((s) => s.setActiveProject);
  const setMode = useAppStore((s) => s.setMode);
  const [tagInput, setTagInput] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isLive = project.deploymentStatus === "live";
  const hasSections = (project.specSections?.length ?? 0) > 0;

  function setPriority(priority: "high" | "medium" | "low" | undefined) {
    updateMetadata(project.id, { ...project.metadata, priority });
  }

  function setMaturity(
    m: "idea" | "exploring" | "defining" | "building" | "live",
  ) {
    updateMetadata(project.id, { ...project.metadata, maturity: m });
  }

  function toggleFlag() {
    updateMetadata(project.id, {
      ...project.metadata,
      attentionFlag: !project.metadata.attentionFlag,
    });
  }

  function addTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && tagInput.trim()) {
      const newTag = tagInput.trim().toLowerCase();
      if (!project.metadata.tags.includes(newTag)) {
        updateMetadata(project.id, {
          ...project.metadata,
          tags: [...project.metadata.tags, newTag],
        });
      }
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    updateMetadata(project.id, {
      ...project.metadata,
      tags: project.metadata.tags.filter((t) => t !== tag),
    });
  }

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    deleteProject(project.id);
    setActiveProject(null);
    onBack();
  }

  function handleDuplicate() {
    duplicateProject(project.id, `${project.name} (copy)`);
    onBack();
  }

  const headerActions = (
    <div className="flex items-center gap-2 flex-shrink-0">
      <button
        type="button"
        onClick={() => {
          setActiveProject(project.id);
          setMode("design");
          navigate({ to: "/design" });
        }}
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-border bg-muted/40 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        data-ocid="organize.detail.open_design_button"
      >
        <Pencil size={12} />
        Open in Design
      </button>
      <button
        type="button"
        onClick={() => {
          setActiveProject(project.id);
          setMode("develop");
          navigate({ to: "/develop" });
        }}
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-border bg-muted/40 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        data-ocid="organize.detail.open_develop_button"
      >
        <IterationCcw size={12} />
        Open in Develop
      </button>
      {isLive && (
        <button
          type="button"
          onClick={() => {
            setActiveProject(project.id);
            setMode("live");
            navigate({ to: "/live" });
          }}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-accent/15 text-accent hover:bg-accent/25 transition-colors"
          data-ocid="organize.detail.open_live_button"
        >
          Open in Live
        </button>
      )}
    </div>
  );

  return (
    <PageWrapper
      noPadding
      scrollable={false}
      header={
        <BreadcrumbHeader
          onBack={onBack}
          backLabel="Organize"
          title={project.name}
          action={headerActions}
          data-ocid="organize.detail.header"
        />
      }
    >
      <div
        data-mode="organize"
        data-ocid="organize.detail_page"
        className="flex flex-col flex-1 min-h-0 h-full overflow-y-auto"
      >
        <div className="px-6 py-6 flex flex-col gap-8">
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-1 flex flex-col gap-6">
              <section>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Priority
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(["high", "medium", "low"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() =>
                        setPriority(
                          project.metadata.priority === p ? undefined : p,
                        )
                      }
                      className={cn(
                        "text-xs px-2.5 py-1 rounded-full border transition-colors",
                        project.metadata.priority === p
                          ? "bg-accent text-accent-foreground border-accent"
                          : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40",
                      )}
                      data-ocid={`organize.detail.priority.${p}`}
                    >
                      {PRIORITY_LABELS[p]}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Maturity
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      "idea",
                      "exploring",
                      "defining",
                      "building",
                      "live",
                    ] as const
                  ).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMaturity(m)}
                      className={cn(
                        "text-xs px-2.5 py-1 rounded-full border transition-colors",
                        project.metadata.maturity === m
                          ? "bg-accent text-accent-foreground border-accent"
                          : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40",
                      )}
                      data-ocid={`organize.detail.maturity.${m}`}
                    >
                      {MATURITY_LABELS[m]}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Tags
                </p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {project.metadata.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-destructive transition-colors"
                        aria-label={`Remove tag ${tag}`}
                        data-ocid={`organize.detail.tag.remove.${tag}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                  placeholder="Add tag, press Enter"
                  className="w-full text-xs bg-background border border-border rounded-md px-2.5 py-1.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  data-ocid="organize.detail.tag.input"
                />
              </section>

              <section className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Attention flag
                </span>
                <button
                  type="button"
                  onClick={toggleFlag}
                  className={cn(
                    "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors",
                    project.metadata.attentionFlag
                      ? "bg-[color:oklch(var(--color-status-warning)/0.10)] border-[color:oklch(var(--color-status-warning)/0.40)] text-[color:oklch(var(--color-status-warning))]"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                  data-ocid="organize.detail.flag_toggle"
                >
                  <Flag size={11} />
                  {project.metadata.attentionFlag ? "Flagged" : "Flag"}
                </button>
              </section>

              <section className="pt-2 border-t border-border flex flex-col gap-1.5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                  Actions
                </p>
                <button
                  type="button"
                  onClick={handleDuplicate}
                  className="flex items-center gap-2 text-xs px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors w-full text-left"
                  data-ocid="organize.detail.duplicate_button"
                >
                  <Copy size={13} />
                  Duplicate project
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className={cn(
                    "flex items-center gap-2 text-xs px-3 py-2 rounded-md transition-colors w-full text-left",
                    confirmDelete
                      ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                      : "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                  )}
                  data-ocid="organize.detail.delete_button"
                >
                  <Trash2 size={13} />
                  {confirmDelete ? "Confirm delete?" : "Delete project"}
                </button>
              </section>
            </div>

            <div className="col-span-2 flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-1">
                <FileText size={14} className="text-muted-foreground" />
                <p className="text-sm font-semibold text-foreground">Spec</p>
                {hasSections && (
                  <span className="text-xs text-muted-foreground ml-1">
                    {project.specSections!.length} section
                    {project.specSections!.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {hasSections ? (
                project.specSections!.map((section, i) => (
                  <div
                    key={`${section.heading}-${i}`}
                    className="rounded-xl border border-border bg-card p-5"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                      {section.heading}
                    </p>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {section.content}
                    </p>
                  </div>
                ))
              ) : (
                <div
                  className="flex flex-col items-center justify-center gap-3 py-16 rounded-xl border border-dashed border-border text-center"
                  data-ocid="organize.detail.spec_empty_state"
                >
                  <div className="w-10 h-10 rounded-full bg-muted/60 flex items-center justify-center">
                    <FileText size={18} className="text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      No spec yet
                    </p>
                    <p className="text-xs text-muted-foreground max-w-[240px]">
                      Complete the Design flow for this project to generate a
                      spec.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveProject(project.id);
                      setMode("design");
                      navigate({ to: "/design" });
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
                    data-ocid="organize.detail.start_design_button"
                  >
                    <Pencil size={12} />
                    Start in Design
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
