import { Badge } from "@/components/ui/AppBadge";
import { useProjects } from "@/hooks/useProjects";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { Project } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { Copy, Flag, IterationCcw, Trash2, X } from "lucide-react";
import * as React from "react";
import { useEffect, useRef, useState } from "react";

interface Props {
  projectId: string;
  onClose: () => void;
  anchorRect?: DOMRect;
}

const PRIORITY_LABELS = { high: "High", medium: "Medium", low: "Low" };
const MATURITY_LABELS = {
  idea: "Idea",
  exploring: "Exploring",
  defining: "Defining",
  building: "Building",
  live: "Live",
};

export function DetailPanel({ projectId, onClose, anchorRect }: Props) {
  // Compute popup position from anchor rect
  // Opens to the right of the card by default; flips left if near right edge
  const popupStyle = React.useMemo(() => {
    if (!anchorRect) return {};
    const PANEL_W = 304; // w-76 ≈ 304px
    const GAP = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const spaceRight = vw - anchorRect.right;
    const openLeft = spaceRight < PANEL_W + GAP + 16;
    const left = openLeft
      ? Math.max(8, anchorRect.left - PANEL_W - GAP)
      : Math.min(anchorRect.right + GAP, vw - PANEL_W - 8);
    // Vertically: align top with card top, clamp to viewport
    const PANEL_MAX_H = Math.min(560, vh - 32);
    const top = Math.min(anchorRect.top, vh - PANEL_MAX_H - 16);
    return {
      left: `${left}px`,
      top: `${Math.max(8, top)}px`,
      width: `${PANEL_W}px`,
      maxHeight: `${PANEL_MAX_H}px`,
    } as React.CSSProperties;
  }, [anchorRect]);
  const panelRef = useRef<HTMLDivElement>(null);
  const { projects, updateMetadata, deleteProject, duplicateProject } =
    useProjects();
  const setActiveProject = useAppStore((s) => s.setActiveProject);
  const setMode = useAppStore((s) => s.setMode);
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === projectId);

  const [tagInput, setTagInput] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!project) return null;

  function toggleFlag() {
    if (!project) return;
    updateMetadata(project.id, {
      ...project.metadata,
      attentionFlag: !project.metadata.attentionFlag,
    });
  }

  function setPriority(priority: "high" | "medium" | "low" | undefined) {
    if (!project) return;
    updateMetadata(project.id, { ...project.metadata, priority });
  }

  function setMaturity(
    maturity: "idea" | "exploring" | "defining" | "building" | "live",
  ) {
    if (!project) return;
    updateMetadata(project.id, { ...project.metadata, maturity });
  }

  function addTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!project) return;
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
    if (!project) return;
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
    deleteProject(projectId);
    setActiveProject(null);
    onClose();
  }

  function handleDuplicate() {
    duplicateProject(projectId, `${project!.name} (copy)`);
    onClose();
  }

  const statusColor =
    project.deploymentStatus === "live"
      ? "text-[var(--color-status-deployed)]"
      : project.deploymentStatus === "failed"
        ? "text-[var(--color-status-error)]"
        : "text-muted-foreground";

  // If anchorRect is provided, render as a floating popup; otherwise fallback to side panel
  const isPopup = !!anchorRect;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Enter" && onClose()}
        aria-hidden="true"
      />

      {/* Panel — popup mode when anchorRect is given, side panel otherwise */}
      <aside
        ref={panelRef}
        className={cn(
          "fixed z-50 bg-card border border-border shadow-elevated flex flex-col",
          isPopup
            ? "rounded-xl overflow-hidden"
            : "right-0 top-0 h-full w-80 border-l rounded-none",
        )}
        style={
          isPopup ? popupStyle : { animation: "slideInRight 0.25s ease-out" }
        }
        data-ocid="detail.panel"
        aria-label="Project details"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-border flex-shrink-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: project.iconColor }}
          >
            <span className="text-accent-foreground text-xs font-bold">
              {project.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {project.name}
            </p>
            <p className={cn("text-xs-plus capitalize", statusColor)}>
              {project.deploymentStatus === "notDeployed"
                ? "Not deployed"
                : project.deploymentStatus}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Close panel"
            data-ocid="detail.close_button"
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Priority */}
          <section>
            <div className="text-xs-plus uppercase tracking-widest text-muted-foreground font-medium block mb-2">
              Priority
            </div>
            <div className="flex gap-1.5">
              {(["high", "medium", "low"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() =>
                    setPriority(project.metadata.priority === p ? undefined : p)
                  }
                  className={cn(
                    "text-xs px-2.5 py-1 rounded-full border transition-colors",
                    project.metadata.priority === p
                      ? "bg-accent text-accent-foreground border-accent"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40",
                  )}
                  data-ocid={`detail.priority.${p}`}
                >
                  {PRIORITY_LABELS[p]}
                </button>
              ))}
            </div>
          </section>

          {/* Maturity */}
          <section>
            <div className="text-xs-plus uppercase tracking-widest text-muted-foreground font-medium block mb-2">
              Maturity
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(
                ["idea", "exploring", "defining", "building", "live"] as const
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
                  data-ocid={`detail.maturity.${m}`}
                >
                  {MATURITY_LABELS[m]}
                </button>
              ))}
            </div>
          </section>

          {/* Tags */}
          <section>
            <div className="text-xs-plus uppercase tracking-widest text-muted-foreground font-medium block mb-2">
              Tags
            </div>
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
                    data-ocid={`detail.tag.remove.${tag}`}
                  >
                    <X size={10} />
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
              className="w-full text-xs bg-background border border-border rounded px-2.5 py-1.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              data-ocid="detail.tag.input"
            />
          </section>

          {/* Flag */}
          <section className="flex items-center justify-between">
            <span className="text-xs-plus uppercase tracking-widest text-muted-foreground font-medium">
              Flag for attention
            </span>
            <button
              type="button"
              onClick={toggleFlag}
              className={cn(
                "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors",
                project.metadata.attentionFlag
                  ? "bg-[var(--color-status-warning)]/10 border-[var(--color-status-warning)]/40 text-[var(--color-status-warning)]"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
              data-ocid="detail.flag_toggle"
            >
              <Flag size={11} />
              {project.metadata.attentionFlag ? "Flagged" : "Flag"}
            </button>
          </section>

          {/* Version info */}
          {project.versionHistory.length > 0 && (
            <section>
              <p className="text-xs-plus uppercase tracking-widest text-muted-foreground font-medium mb-2">
                Latest version
              </p>
              <p className="text-xs text-muted-foreground">
                v
                {
                  project.versionHistory[project.versionHistory.length - 1]
                    .version
                }
                {" — "}
                {
                  project.versionHistory[project.versionHistory.length - 1]
                    .changeSummary
                }
              </p>
            </section>
          )}
        </div>

        {/* Actions footer */}
        <div className="flex flex-col gap-1.5 p-4 border-t border-border flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveProject(projectId);
              setMode("develop");
              navigate({ to: "/develop" });
              onClose();
            }}
            className="flex items-center gap-2 text-xs px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors w-full"
            data-ocid="detail.open_develop_button"
          >
            <IterationCcw size={13} />
            Open in Develop
          </button>
          <button
            type="button"
            onClick={handleDuplicate}
            className="flex items-center gap-2 text-xs px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors w-full"
            data-ocid="detail.duplicate_button"
          >
            <Copy size={13} />
            Duplicate project
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className={cn(
              "flex items-center gap-2 text-xs px-3 py-2 rounded-md transition-colors w-full",
              confirmDelete
                ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                : "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
            )}
            data-ocid="detail.delete_button"
          >
            <Trash2 size={13} />
            {confirmDelete ? "Confirm delete?" : "Delete project"}
          </button>
        </div>
      </aside>
    </>
  );
}
