import { ITERATE_ACTIONS, generateActionResult } from "@/lib/iterateActions";
import type { ActionResult, IterateAction } from "@/lib/iterateActions";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { Project } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  BookmarkPlus,
  Check,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Crosshair,
  Eye,
  Feather,
  FileText,
  Layers,
  Lightbulb,
  ListChecks,
  Loader2,
  MapIcon,
  Play,
  Save,
  Send,
  Sparkles,
  Type,
  User,
  X,
} from "lucide-react";
import type React from "react";
import { Component, type ReactNode, useRef, useState } from "react";
import { ModeHeader } from "../components/layout/ModeHeader";
import { PageWrapper } from "../components/layout/PageWrapper";

// ─── Icon map ────────────────────────────────────────────────────────────────

const ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string; size?: number }>
> = {
  ClipboardCheck,
  Eye,
  CheckSquare,
  Layers,
  Type,
  User,
  ListChecks,
  FileText,
  Feather,
  Crosshair,
  Lightbulb,
  MapIcon,
};

// ─── Constants ───────────────────────────────────────────────────────────────

const MATURITY_COLORS: Record<string, string> = {
  idea: "bg-muted text-muted-foreground",
  exploring:
    "bg-[color:oklch(var(--color-status-warning)/0.15)] text-[color:oklch(var(--color-status-warning))]",
  defining: "bg-primary/10 text-primary",
  building: "bg-accent/10 text-accent",
  live: "bg-[color:oklch(var(--color-status-success)/0.15)] text-[color:oklch(var(--color-status-success))]",
};

const CATEGORY_ORDER = ["Review", "Generate", "Improve"] as const;

const KEYWORD_MAP: Array<{ keyword: string; actionId: string }> = [
  { keyword: "audit", actionId: "spec-audit" },
  { keyword: "visual", actionId: "visual-pass" },
  { keyword: "feature", actionId: "feature-review" },
  { keyword: "consistency", actionId: "consistency-check" },
  { keyword: "headline", actionId: "alternative-headline" },
  { keyword: "user story", actionId: "user-story" },
  { keyword: "acceptance", actionId: "acceptance-criteria" },
  { keyword: "summary", actionId: "spec-summary" },
  { keyword: "simplify", actionId: "simplify-language" },
  { keyword: "scope", actionId: "sharpen-scope" },
  { keyword: "example", actionId: "add-examples" },
  { keyword: "navigation", actionId: "navigation-review" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getRelativeDate(ts: number | bigint | undefined): string {
  if (!ts) return "\u2014";
  const ms = typeof ts === "bigint" ? Number(ts) / 1_000_000 : ts;
  const diff = Date.now() - ms;
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function groupByCategory(actions: IterateAction[]) {
  return CATEGORY_ORDER.map((cat) => ({
    label: cat,
    actions: actions.filter((a) => a.category === cat),
  }));
}

// ─── MaturityBadge ───────────────────────────────────────────────────────────

function MaturityBadge({ maturity }: { maturity: string }) {
  const colorClass =
    MATURITY_COLORS[maturity] ?? "bg-muted text-muted-foreground";
  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide",
        colorClass,
      )}
    >
      {maturity}
    </span>
  );
}

// ─── SectionErrorBoundary ────────────────────────────────────────────────────

class SectionErrorBoundary extends Component<
  { children: ReactNode; label: string },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; label: string }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full text-center p-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Something went wrong in this section.
            </p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="text-xs text-accent hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── ProjectPicker ───────────────────────────────────────────────────────────

function ProjectPicker({ onSelect }: { onSelect: (id: string) => void }) {
  const { projects } = useAppStore();
  const navigate = useNavigate();
  const setMode = useAppStore((s) => s.setMode);

  const iterableProjects = projects.filter(
    (p) => p.metadata?.maturity !== undefined,
  );

  return (
    <div className="flex flex-col" data-ocid="develop.project_picker">
      {/* Projects grid */}
      {iterableProjects.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center gap-5 p-16 text-center"
          data-ocid="develop.project_picker.empty_state"
        >
          <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
            <Sparkles size={24} className="text-accent" />
          </div>
          <div className="space-y-1.5">
            <p className="text-base font-semibold text-foreground">
              No projects to develop yet
            </p>
            <p className="text-sm text-muted-foreground max-w-[280px]">
              Complete the Design flow for a project first — once you have a
              draft, come back here to improve it.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setMode("design");
              navigate({ to: "/design" });
            }}
            className="px-5 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            data-ocid="develop.project_picker.go_design_button"
          >
            Go to Design
          </button>
        </div>
      ) : (
        <div className="px-6 pb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            {iterableProjects.length}{" "}
            {iterableProjects.length === 1 ? "project" : "projects"}
          </p>
          <div className="grid grid-cols-3 gap-4">
            {iterableProjects.map((project, i) => {
              const maturity = project.metadata?.maturity ?? "idea";
              const sectionCount = project.specSections?.length ?? 0;
              return (
                <button
                  key={project.id}
                  type="button"
                  data-ocid={`develop.project_picker.item.${i + 1}`}
                  onClick={() => onSelect(project.id)}
                  className="flex flex-col items-start gap-4 p-5 rounded-xl border border-border bg-card hover:border-accent/50 hover:bg-accent/5 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-start justify-between w-full gap-2">
                    <span className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors leading-snug">
                      {project.name ?? "Untitled"}
                    </span>
                    <MaturityBadge maturity={maturity} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground w-full">
                    <div className="flex items-center gap-1.5">
                      <FileText size={11} />
                      <span>
                        {sectionCount} section
                        {sectionCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <span className="text-muted-foreground/30">·</span>
                    <span>Edited {getRelativeDate(project.updatedAt)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SpecDraftPanel (LEFT — hero, 65% width) ─────────────────────────────────

function SpecDraftPanel({
  project,
  onSwitchProject,
}: {
  project: Project;
  onSwitchProject: () => void;
}) {
  const hasSections = (project.specSections?.length ?? 0) > 0;

  return (
    <div
      className="flex-1 min-w-0 flex flex-col overflow-hidden border-r border-border"
      data-ocid="develop.spec_draft_panel"
    >
      {/* Panel header — h-16 matches ModeHeader rhythm */}
      <div className="shrink-0 flex items-center justify-between px-6 h-16 border-b border-border bg-card">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
            <FileText size={13} className="text-accent" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate leading-tight">
              {project.name ?? "Untitled"}
            </p>
            <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
              Current draft
            </p>
          </div>
          <MaturityBadge maturity={project.metadata?.maturity ?? "idea"} />
        </div>
        <button
          type="button"
          onClick={onSwitchProject}
          className="shrink-0 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted/40"
          data-ocid="develop.spec_draft.switch_project_button"
        >
          Switch project
        </button>
      </div>

      {/* Draft content — readable width, comfortable line length */}
      <div className="flex-1 overflow-y-auto">
        {hasSections ? (
          <div className="px-8 py-6">
            <div className="flex flex-col gap-6">
              {project.specSections!.map((section, i) => (
                <div
                  key={`${section.heading}-${i}`}
                  className="group"
                  data-ocid={`develop.spec_section.${i + 1}`}
                >
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    {section.heading}
                  </h3>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {section.content}
                  </p>
                  {i < project.specSections!.length - 1 && (
                    <div className="mt-6 border-b border-border/50" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center h-full text-center gap-4 p-10"
            data-ocid="develop.spec_draft.empty_state"
          >
            <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center">
              <FileText size={20} className="text-muted-foreground" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-foreground">
                No draft yet
              </p>
              <p className="text-sm text-muted-foreground max-w-[280px] leading-relaxed">
                This project doesn&apos;t have a spec yet. Complete the Design
                flow to generate the first draft, then come back to develop it.
              </p>
            </div>
            <p className="text-xs text-muted-foreground/70">
              You can still run actions — they will provide general guidance
              based on your project settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TweakEditor ─────────────────────────────────────────────────────────────

function TweakEditor({
  content,
  onConfirm,
  onCancel,
}: {
  content: string;
  onConfirm: (text: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(content);
  return (
    <div className="flex flex-col gap-2">
      <textarea
        className="w-full rounded-lg border border-border bg-background text-sm text-foreground p-3 resize-none focus:outline-none focus:ring-1 focus:ring-accent/50"
        rows={5}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        data-ocid="develop.tweak_editor.textarea"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onConfirm(value)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-foreground text-xs font-semibold hover:opacity-90 transition-colors"
          data-ocid="develop.tweak_editor.confirm_button"
        >
          <Check size={12} /> Confirm
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="develop.tweak_editor.cancel_button"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── RightPanel (35% width — actions + result + chat) ────────────────────────

interface ChatMsg {
  role: "user" | "ai";
  text: string;
  timestamp: number;
}

// ─── Saved Sequences ─────────────────────────────────────────────────────────

interface SavedSequence {
  id: string;
  name: string;
  actionIds: string[];
  createdAt: number;
}

function RightPanel({
  project,
  selectedActionId,
  runningActionId,
  result,
  isTweaking,
  acceptedActionIds,
  savedSequences,
  sequenceProgress,
  onSelectAction,
  onAccept,
  onTweak,
  onDiscard,
  onTweakConfirm,
  onTweakCancel,
  onTriggerAction,
  onSaveSequence,
  onRunSequence,
  onDeleteSequence,
}: {
  project: Project;
  selectedActionId: string | null;
  runningActionId: string | null;
  result: ActionResult | null;
  isTweaking: boolean;
  acceptedActionIds: string[];
  savedSequences: SavedSequence[];
  sequenceProgress: { sequenceId: string; step: number; total: number } | null;
  onSelectAction: (action: IterateAction) => void;
  onAccept: () => void;
  onTweak: () => void;
  onDiscard: () => void;
  onTweakConfirm: (text: string) => void;
  onTweakCancel: () => void;
  onTriggerAction: (actionId: string) => void;
  onSaveSequence: (name: string, actionIds: string[]) => void;
  onRunSequence: (sequence: SavedSequence) => void;
  onDeleteSequence: (id: string) => void;
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [sequenceName, setSequenceName] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "ai",
      text: `Ready to help improve "${
        project.name ?? "Untitled"
      }". Click an action on the left, or type what you want to improve below.`,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  function toggleCategory(label: string) {
    setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  function handleSaveSequence() {
    const name =
      sequenceName.trim() || `Sequence (${acceptedActionIds.length} actions)`;
    onSaveSequence(name, [...acceptedActionIds]);
    setShowSaveDialog(false);
    setSequenceName("");
  }

  function sendMessage() {
    const text = input.trim();
    if (!text) return;
    const userMsg: ChatMsg = { role: "user", text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const lower = text.toLowerCase();
    const matched = KEYWORD_MAP.find((k) => lower.includes(k.keyword));

    setTimeout(() => {
      if (matched) {
        const actionName =
          ITERATE_ACTIONS.find((a) => a.id === matched.actionId)?.name ??
          matched.actionId;
        const aiMsg: ChatMsg = {
          role: "ai",
          text: `Running "${actionName}" for you...`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        onTriggerAction(matched.actionId);
      } else {
        const availableActions = ITERATE_ACTIONS.slice(0, 4)
          .map((a) => a.name)
          .join(", ");
        const aiMsg: ChatMsg = {
          role: "ai",
          text: `I can run actions like ${availableActions}, and more. Try typing "audit", "simplify", "scope", or any action name from the list above.`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        50,
      );
    }, 800);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div
      className="w-96 shrink-0 flex flex-col overflow-hidden bg-card/30"
      data-ocid="develop.right_panel"
    >
      {/* ── Action library ── */}
      <div
        className="shrink-0 overflow-y-auto border-b border-border"
        style={{ maxHeight: "52%" }}
        data-ocid="develop.action_library"
      >
        <div className="px-4 pt-4 pb-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Actions
          </p>
          <p className="text-[11px] text-muted-foreground/70 mt-0.5">
            Click any action to run it on your draft
          </p>
        </div>
        {/* ── Saved Sequences ── */}
        {savedSequences.length > 0 && (
          <div className="px-2 pb-1">
            <button
              type="button"
              onClick={() => toggleCategory("__sequences__")}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="develop.saved_sequences_section"
            >
              <span className="flex items-center gap-1.5">
                <BookmarkPlus size={11} /> Saved sequences
              </span>
              {collapsed.__sequences__ ? (
                <ChevronRight size={11} />
              ) : (
                <ChevronDown size={11} />
              )}
            </button>
            {!collapsed.__sequences__ && (
              <div className="flex flex-col gap-0.5 mt-0.5">
                {savedSequences.map((seq) => {
                  const isRunning = sequenceProgress?.sequenceId === seq.id;
                  return (
                    <div
                      key={seq.id}
                      className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-transparent hover:bg-muted/40 group"
                      data-ocid={`develop.saved_sequence.${seq.id}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-foreground truncate leading-snug">
                          {seq.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {isRunning
                            ? `Running ${sequenceProgress.step}/${sequenceProgress.total}...`
                            : `${seq.actionIds.length} action${seq.actionIds.length !== 1 ? "s" : ""}`}
                        </p>
                      </div>
                      {isRunning ? (
                        <Loader2
                          size={12}
                          className="shrink-0 animate-spin text-accent"
                        />
                      ) : (
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => onRunSequence(seq)}
                            className="w-6 h-6 rounded flex items-center justify-center text-accent hover:bg-accent/10 transition-colors"
                            aria-label="Run sequence"
                            data-ocid={`develop.saved_sequence.run_button.${seq.id}`}
                          >
                            <Play size={10} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteSequence(seq.id)}
                            className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            aria-label="Delete sequence"
                            data-ocid={`develop.saved_sequence.delete_button.${seq.id}`}
                          >
                            <X size={10} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        <div className="px-2 pb-3">
          {groupByCategory(ITERATE_ACTIONS).map(({ label, actions }) => {
            const isCollapsed = collapsed[label] ?? false;
            return (
              <div key={label} className="mb-1">
                <button
                  type="button"
                  onClick={() => toggleCategory(label)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  data-ocid={`develop.action_category.${label.toLowerCase()}`}
                >
                  <span>{label}</span>
                  {isCollapsed ? (
                    <ChevronRight size={11} />
                  ) : (
                    <ChevronDown size={11} />
                  )}
                </button>
                {!isCollapsed && (
                  <div className="flex flex-col gap-0.5 mt-0.5">
                    {actions.map((action) => {
                      const Icon = ICON_MAP[action.icon] ?? FileText;
                      const isActive = selectedActionId === action.id;
                      const isRunning = runningActionId === action.id;
                      return (
                        <button
                          key={action.id}
                          type="button"
                          data-ocid={`develop.action.${action.id}`}
                          onClick={() => onSelectAction(action)}
                          className={cn(
                            "flex items-start gap-2.5 px-2.5 py-2 rounded-lg border text-left transition-all",
                            isActive
                              ? "bg-accent/10 border-accent/30"
                              : "border-transparent hover:bg-muted/40",
                          )}
                        >
                          {isRunning ? (
                            <Loader2
                              size={12}
                              className="shrink-0 mt-0.5 animate-spin text-accent"
                            />
                          ) : (
                            <Icon
                              size={12}
                              className={cn(
                                "shrink-0 mt-0.5",
                                isActive
                                  ? "text-accent"
                                  : "text-muted-foreground",
                              )}
                            />
                          )}
                          <div className="min-w-0">
                            <p
                              className={cn(
                                "text-[11px] font-medium leading-snug",
                                isActive ? "text-accent" : "text-foreground",
                              )}
                            >
                              {action.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5 line-clamp-1">
                              {action.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Result area — only shown when a result exists ── */}
      {result && (
        <div
          className="flex-shrink-0 flex flex-col border-b border-border px-4 py-4 bg-accent/5 overflow-y-auto"
          style={{ maxHeight: "36%" }}
          data-ocid="develop.result_area"
        >
          <div className="mb-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-accent mb-0.5">
              {result.actionName}
            </p>
            <p className="text-xs font-semibold text-foreground">
              {result.title}
            </p>
          </div>
          {isTweaking ? (
            <TweakEditor
              content={result.items.join("\n")}
              onConfirm={onTweakConfirm}
              onCancel={onTweakCancel}
            />
          ) : (
            <>
              <ul className="flex flex-col gap-1.5 mb-3">
                {result.items.map((item, i) => (
                  <li
                    key={`${result.actionId}-${i}`}
                    className="text-[11px] text-foreground/80 leading-relaxed pl-2.5 border-l-2 border-accent/40"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={onAccept}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-accent text-accent-foreground text-[11px] font-semibold hover:opacity-90 transition-colors"
                  data-ocid="develop.result.accept_button"
                >
                  <Check size={11} /> Accept
                </button>
                <button
                  type="button"
                  onClick={onTweak}
                  className="px-2.5 py-1.5 rounded-lg border border-accent/40 text-accent text-[11px] font-semibold hover:bg-accent/10 transition-colors"
                  data-ocid="develop.result.tweak_button"
                >
                  Tweak
                </button>
                <button
                  type="button"
                  onClick={onDiscard}
                  className="px-2.5 py-1.5 rounded-lg text-muted-foreground text-[11px] hover:text-foreground transition-colors"
                  data-ocid="develop.result.discard_button"
                >
                  Discard
                </button>
              </div>
            </>
          )}
          {/* Save sequence — appears when 2+ actions have been accepted this session */}
          {!isTweaking && acceptedActionIds.length >= 1 && (
            <div className="mt-3 pt-3 border-t border-border/50">
              {showSaveDialog ? (
                <div
                  className="flex flex-col gap-2"
                  data-ocid="develop.save_sequence_dialog"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Save as sequence
                  </p>
                  <input
                    type="text"
                    placeholder={`Sequence (${acceptedActionIds.length + 1} actions)`}
                    value={sequenceName}
                    onChange={(e) => setSequenceName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveSequence();
                      if (e.key === "Escape") setShowSaveDialog(false);
                    }}
                    className="w-full rounded-lg border border-border bg-background text-[11px] text-foreground px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-accent/50"
                    data-ocid="develop.save_sequence.name_input"
                  />
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={handleSaveSequence}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-accent text-accent-foreground text-[11px] font-semibold hover:opacity-90 transition-colors"
                      data-ocid="develop.save_sequence.confirm_button"
                    >
                      <Save size={10} /> Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSaveDialog(false)}
                      className="px-2.5 py-1.5 rounded-lg border border-border text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                      data-ocid="develop.save_sequence.cancel_button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSaveDialog(true)}
                  className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                  data-ocid="develop.result.save_sequence_button"
                >
                  <BookmarkPlus size={11} />
                  Save as sequence ({acceptedActionIds.length + 1} action
                  {acceptedActionIds.length !== 0 ? "s" : ""})
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* No result placeholder when empty */}
      {!result && (
        <div
          className="shrink-0 flex items-center gap-2.5 px-4 py-3 border-b border-border bg-muted/20"
          data-ocid="develop.result.empty_state"
        >
          <Sparkles size={14} className="text-muted-foreground/40 shrink-0" />
          <p className="text-[11px] text-muted-foreground/60">
            Select an action to see the result here
          </p>
        </div>
      )}

      {/* ── Chat panel ── */}
      <div
        className="flex-1 flex flex-col min-h-0"
        data-ocid="develop.chat_panel"
      >
        <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2">
          {messages.map((msg, i) => (
            <div
              key={`msg-${msg.timestamp}-${i}`}
              className={cn(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-xl px-3 py-2 text-[11px] leading-relaxed",
                  msg.role === "user"
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-foreground",
                )}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="shrink-0 flex items-end gap-2 px-3 py-3 border-t border-border">
          <textarea
            className="flex-1 resize-none rounded-lg border border-border bg-background text-[11px] text-foreground px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent/50 min-h-[36px] max-h-24"
            placeholder="Type an action name or describe what to improve..."
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            data-ocid="develop.chat_panel.input"
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={!input.trim()}
            className="shrink-0 w-8 h-8 rounded-lg bg-accent text-accent-foreground flex items-center justify-center hover:opacity-90 transition-colors disabled:opacity-40"
            data-ocid="develop.chat_panel.send_button"
          >
            <Send size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DevelopPage ─────────────────────────────────────────────────────────────

export function DevelopPage() {
  const { projects, activeProjectId, setActiveProject } = useAppStore();
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [runningActionId, setRunningActionId] = useState<string | null>(null);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [isTweaking, setIsTweaking] = useState(false);
  const [acceptedActionIds, setAcceptedActionIds] = useState<string[]>([]);
  const [savedSequences, setSavedSequences] = useState<SavedSequence[]>([]);
  const [sequenceProgress, setSequenceProgress] = useState<{
    sequenceId: string;
    step: number;
    total: number;
  } | null>(null);

  const activeProject = projects.find((p) => p.id === activeProjectId) ?? null;
  const showPicker = !activeProjectId || !activeProject;

  function handleSelectAction(action: IterateAction) {
    if (!activeProject) return;
    setSelectedActionId(action.id);
    setRunningActionId(action.id);
    setResult(null);
    setIsTweaking(false);
    setTimeout(() => {
      setRunningActionId(null);
      setResult(generateActionResult(action, activeProject));
    }, 700);
  }

  function handleTriggerAction(actionId: string) {
    const action = ITERATE_ACTIONS.find((a) => a.id === actionId);
    if (action && activeProject) handleSelectAction(action);
  }

  function handleAccept() {
    if (result) {
      setAcceptedActionIds((prev) => [...prev, result.actionId]);
    }
    setResult(null);
    setSelectedActionId(null);
    setIsTweaking(false);
  }

  function handleDiscard() {
    setResult(null);
    setSelectedActionId(null);
    setIsTweaking(false);
  }

  function handleTweak() {
    setIsTweaking(true);
  }

  function handleTweakConfirm(_text: string) {
    if (result) {
      setAcceptedActionIds((prev) => [...prev, result.actionId]);
    }
    setResult(null);
    setSelectedActionId(null);
    setIsTweaking(false);
  }

  function handleSaveSequence(name: string, actionIds: string[]) {
    // include the current pending result's action if not yet accepted
    const allIds = result ? [...actionIds, result.actionId] : actionIds;
    const newSeq: SavedSequence = {
      id: `seq-${Date.now()}`,
      name,
      actionIds: allIds,
      createdAt: Date.now(),
    };
    setSavedSequences((prev) => [newSeq, ...prev]);
  }

  function handleRunSequence(sequence: SavedSequence) {
    if (!activeProject || sequenceProgress) return;
    const actions = sequence.actionIds
      .map((id) => ITERATE_ACTIONS.find((a) => a.id === id))
      .filter(Boolean) as IterateAction[];
    if (actions.length === 0) return;

    setResult(null);
    setIsTweaking(false);
    setAcceptedActionIds([]);

    let step = 0;
    const runNext = () => {
      if (step >= actions.length) {
        setSequenceProgress(null);
        return;
      }
      const action = actions[step];
      setSequenceProgress({
        sequenceId: sequence.id,
        step: step + 1,
        total: actions.length,
      });
      setSelectedActionId(action.id);
      setRunningActionId(action.id);
      setTimeout(() => {
        setRunningActionId(null);
        setResult(generateActionResult(action, activeProject));
        step += 1;
        setTimeout(runNext, 1200);
      }, 800);
    };
    runNext();
  }

  function handleDeleteSequence(id: string) {
    setSavedSequences((prev) => prev.filter((s) => s.id !== id));
  }

  function handleTweakCancel() {
    setIsTweaking(false);
  }

  return (
    <>
      {showPicker ? (
        <PageWrapper
          header={
            <ModeHeader
              title="Develop"
              subtitle="Improve your spec with one-click actions"
            />
          }
        >
          <div
            className="flex flex-col gap-6"
            data-mode="develop"
            data-ocid="develop.page"
          >
            <SectionErrorBoundary label="project-picker">
              <ProjectPicker onSelect={(id) => setActiveProject(id)} />
            </SectionErrorBoundary>
          </div>
        </PageWrapper>
      ) : (
        <PageWrapper noPadding scrollable={false}>
          <div
            className="flex h-full min-h-0 overflow-hidden"
            data-mode="develop"
            data-ocid="develop.page"
          >
            <SectionErrorBoundary label="spec-draft">
              <SpecDraftPanel
                project={activeProject!}
                onSwitchProject={() => setActiveProject(null)}
              />
            </SectionErrorBoundary>
            <SectionErrorBoundary label="right-panel">
              <RightPanel
                project={activeProject!}
                selectedActionId={selectedActionId}
                runningActionId={runningActionId}
                result={result}
                isTweaking={isTweaking}
                acceptedActionIds={acceptedActionIds}
                savedSequences={savedSequences}
                sequenceProgress={sequenceProgress}
                onSelectAction={handleSelectAction}
                onAccept={handleAccept}
                onTweak={handleTweak}
                onDiscard={handleDiscard}
                onTweakConfirm={handleTweakConfirm}
                onTweakCancel={handleTweakCancel}
                onTriggerAction={handleTriggerAction}
                onSaveSequence={handleSaveSequence}
                onRunSequence={handleRunSequence}
                onDeleteSequence={handleDeleteSequence}
              />
            </SectionErrorBoundary>
          </div>
        </PageWrapper>
      )}
    </>
  );
}
