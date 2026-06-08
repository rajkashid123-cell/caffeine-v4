import { ChoiceCard } from "@/components/design-mode/ChoiceCard";
import { SelectionCounter, StepCard } from "@/components/design-mode/StepCard";
import {
  type FlowStepWithOptions,
  getContextualSteps,
  getSeedSelections,
} from "@/lib/designFlowData";
import { assembleSpec, specToMarkdown } from "@/lib/specAssembler";
import { cn } from "@/lib/utils";
import type { DesignFlowAnswers } from "@/types";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Download,
  ExternalLink,
  Layers,
  Pencil,
  Sparkles,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface DesignFlowProps {
  projectName: string;
  initialAnswers?: DesignFlowAnswers;
  onComplete: (answers: DesignFlowAnswers) => void;
  onSaveAnswers: (answers: DesignFlowAnswers) => void;
  onOpenOrganize: () => void;
  onStartIterating?: () => void;
  /** Called immediately after every selection — gives parent the live assembled spec */
  onSpecUpdate?: (sections: import("@/backend").SpecSection[]) => void;
}

export function DesignFlow({
  projectName,
  initialAnswers = {},
  onComplete,
  onSaveAnswers,
  onOpenOrganize,
  onStartIterating,
  onSpecUpdate,
}: DesignFlowProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<DesignFlowAnswers>(initialAnswers);
  // Track if we navigated back so auto-advance does not retrigger
  const didNavigateBack = useRef(false);

  // Recompute visible steps whenever answers change
  const visibleSteps = useMemo(() => getContextualSteps(answers), [answers]);
  const totalSteps = visibleSteps.length;

  // Clamp index in case steps were removed
  const safeIndex = Math.min(currentStepIndex, totalSteps - 1);
  const stepDef: FlowStepWithOptions = visibleSteps[safeIndex];

  const isReview = stepDef.id === "review";
  const isComplete = stepDef.id === "complete";

  // Use filteredOptions from getContextualSteps
  const options = stepDef.filteredOptions;

  // Current answer(s)
  const answersAsRecord = answers as Record<string, string | string[]>;
  const rawAnswer = answersAsRecord[stepDef.answerKey];
  const selectedIds: string[] = Array.isArray(rawAnswer)
    ? rawAnswer
    : rawAnswer
      ? [rawAnswer as string]
      : [];

  // Auto-advance: single-select (non-multi) steps advance after 300ms
  useEffect(() => {
    if (stepDef.multiSelect || isReview || isComplete || options.length === 0)
      return;
    if (selectedIds.length === 0) return;
    if (didNavigateBack.current) {
      didNavigateBack.current = false;
      return;
    }
    const timer = setTimeout(() => {
      if (safeIndex < totalSteps - 1) setCurrentStepIndex((i) => i + 1);
    }, 300);
    return () => clearTimeout(timer);
  }, [
    selectedIds.length,
    stepDef.multiSelect,
    isReview,
    isComplete,
    options.length,
    safeIndex,
    totalSteps,
  ]);

  function selectOption(optionId: string) {
    let updated: DesignFlowAnswers;
    if (stepDef.multiSelect) {
      const current =
        (answersAsRecord[stepDef.answerKey] as string[] | undefined) ?? [];
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      updated = { ...answers, [stepDef.answerKey]: next } as DesignFlowAnswers;
    } else {
      updated = {
        ...answers,
        [stepDef.answerKey]: optionId,
      } as DesignFlowAnswers;
    }
    setAnswers(updated);
    onSaveAnswers(updated);
    // TASK 3: notify parent with live assembled spec after every selection
    if (onSpecUpdate) {
      const blueprint = assembleSpec(updated);
      onSpecUpdate(
        blueprint.sections.map((s) => ({
          heading: s.heading,
          content: s.content,
        })),
      );
    }
  }

  function goBack() {
    if (safeIndex > 0) {
      didNavigateBack.current = true;
      setCurrentStepIndex((i) => i - 1);
    }
  }

  function goForward() {
    if (safeIndex < totalSteps - 1) {
      setCurrentStepIndex((i) => i + 1);
    } else {
      onComplete(answers);
    }
  }

  function jumpToStep(n: number) {
    const idx = visibleSteps.findIndex((s) => s.stepNumber === n);
    if (idx >= 0) {
      didNavigateBack.current = true;
      setCurrentStepIndex(idx);
    }
  }

  function handleExport() {
    const md = specToMarkdown(answers, projectName);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, "-").toLowerCase()}-spec.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Apply seed selections when stepping forward onto a new step
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally re-run only when index changes
  useEffect(() => {
    if (isReview || isComplete) return;
    if (
      answersAsRecord[stepDef.answerKey] !== undefined &&
      answersAsRecord[stepDef.answerKey] !== ""
    )
      return;
    const seeds = getSeedSelections(stepDef, answersAsRecord);
    if (seeds.length > 0 && !stepDef.multiSelect) {
      const updated = {
        ...answers,
        [stepDef.answerKey]: seeds[0],
      } as DesignFlowAnswers;
      setAnswers(updated);
    }
  }, [safeIndex]);

  const canContinue =
    isReview ||
    isComplete ||
    selectedIds.length > 0 ||
    stepDef.options.length === 0;

  const footer = (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={goBack}
        className={cn(
          "flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors",
          safeIndex === 0 && "invisible",
        )}
        data-ocid="design.flow.back_button"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      <div className="flex items-center gap-3">
        {isReview && (
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-md bg-muted text-foreground hover:bg-muted/70 transition-colors"
            data-ocid="design.review.export_button"
          >
            <Download size={14} />
            Export
          </button>
        )}
        {stepDef.multiSelect && selectedIds.length > 0 && (
          <SelectionCounter count={selectedIds.length} />
        )}
        {!isComplete && (
          <button
            type="button"
            onClick={goForward}
            disabled={!canContinue}
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-md transition-all",
              canContinue
                ? "bg-accent text-accent-foreground hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed",
            )}
            data-ocid="design.flow.continue_button"
          >
            {isReview ? "Finalise spec" : "Continue"}
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );

  // ─── Review step ───────────────────────────────────────────────────────────
  if (isReview) {
    const blueprint = assembleSpec(answers);
    return (
      <StepCard
        stepNumber={safeIndex + 1}
        totalSteps={totalSteps}
        phaseName={stepDef.phaseName}
        question={stepDef.question}
        hint={stepDef.hint}
        footer={footer}
      >
        <div className="space-y-3" data-ocid="design.review.section_list">
          {blueprint.sections.map((section) => (
            <div
              key={section.id}
              className="p-4 rounded-lg bg-card border border-border shadow-sm"
              data-ocid={`design.review.section.${section.id}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-semibold text-foreground">
                  {section.heading}
                </h3>
                {section.stepNumbers.length > 0 && (
                  <button
                    type="button"
                    onClick={() => jumpToStep(section.stepNumbers[0])}
                    className="flex items-center gap-1 text-2xs text-muted-foreground hover:text-accent transition-colors flex-shrink-0"
                    data-ocid={`design.review.edit.${section.id}`}
                  >
                    <Pencil size={10} />
                    Edit
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </StepCard>
    );
  }

  // ─── Complete step ──────────────────────────────────────────────────────────
  if (isComplete) {
    const blueprint = assembleSpec(answers);
    // Build a summary of key decisions made
    const keyDecisions: Array<{ label: string; value: string }> = [];
    if (answers.appType) {
      const appTypeMap: Record<string, string> = {
        dashboard: "Dashboard / Tool",
        marketplace: "Marketplace",
        social: "Social / Community",
        contentCms: "Content / CMS",
        booking: "Booking / Scheduling",
        tracker: "Tracker / Logger",
        clubManager: "Club / Team Manager",
        internalTool: "Internal Tool",
      };
      keyDecisions.push({
        label: "App type",
        value: appTypeMap[answers.appType] ?? answers.appType,
      });
    }
    if (answers.audience?.length) {
      const audMap: Record<string, string> = {
        consumers: "Consumers",
        businesses: "Businesses",
        internalTeam: "Internal Team",
        community: "Community",
        myself: "Just myself",
      };
      keyDecisions.push({
        label: "Audience",
        value: answers.audience.map((a) => audMap[a] ?? a).join(", "),
      });
    }
    if (answers.vibe) {
      const vibeMap: Record<string, string> = {
        calm: "Calm & Minimal",
        bold: "Bold & Energetic",
        warm: "Warm & Friendly",
        serious: "Serious & Professional",
        playful: "Playful",
        editorial: "Editorial",
      };
      keyDecisions.push({
        label: "Aesthetic",
        value: vibeMap[answers.vibe] ?? answers.vibe,
      });
    }
    if (answers.shellLayout) {
      const layoutMap: Record<string, string> = {
        sidebar: "Sidebar navigation",
        topnav: "Top navigation",
        tabbar: "Tab bar",
        minimal: "Minimal / no nav",
      };
      keyDecisions.push({
        label: "Navigation",
        value: layoutMap[answers.shellLayout] ?? answers.shellLayout,
      });
    }
    if (answers.coreFeatures?.length) {
      keyDecisions.push({
        label: "Features selected",
        value: `${answers.coreFeatures.length} feature${answers.coreFeatures.length > 1 ? "s" : ""}`,
      });
    }
    if (answers.rolesAccess?.length) {
      keyDecisions.push({
        label: "User roles",
        value: answers.rolesAccess.join(", "),
      });
    }
    if (answers.platformScope) {
      const platformMap: Record<string, string> = {
        desktop: "Desktop only",
        "desktop-mobile": "Desktop + Mobile",
        "mobile-first": "Mobile first",
        pwa: "Progressive Web App",
      };
      keyDecisions.push({
        label: "Platform",
        value: platformMap[answers.platformScope] ?? answers.platformScope,
      });
    }

    return (
      <div className="flex flex-col h-full" data-ocid="design.complete.page">
        {/* Progress bar — full */}
        <div className="h-0.5 bg-accent flex-shrink-0 rounded-full" />

        <div className="flex-1 overflow-y-auto px-8 py-6 min-h-0">
          {/* Success header */}
          <div className="flex flex-col items-center text-center mb-7">
            <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center mb-4">
              <Check size={26} className="text-accent" strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-1">
              Your spec is ready
            </h2>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              <span className="font-medium text-foreground">{projectName}</span>{" "}
              has been assembled into a complete, professional specification.
            </p>
          </div>

          {/* Key decisions summary */}
          {keyDecisions.length > 0 && (
            <div className="mb-7" data-ocid="design.complete.decisions">
              <p className="text-2xs uppercase tracking-widest font-medium text-muted-foreground mb-3">
                Key decisions
              </p>
              <div className="grid grid-cols-2 gap-2">
                {keyDecisions.map((d) => (
                  <div
                    key={d.label}
                    className="flex flex-col p-3 rounded-lg bg-card border border-border shadow-sm"
                  >
                    <span className="text-2xs text-muted-foreground mb-0.5">
                      {d.label}
                    </span>
                    <span className="text-xs font-medium text-foreground">
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Spec section count */}
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-accent/8 border border-accent/20 mb-7">
            <Layers size={14} className="text-accent flex-shrink-0" />
            <p className="text-xs text-foreground">
              <span className="font-semibold">
                {blueprint.sections.filter((s) => s.id !== "next").length} spec
                sections
              </span>{" "}
              assembled — ready to export or iterate.
            </p>
          </div>

          {/* Primary actions */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              data-ocid="design.complete.export_button"
            >
              <Download size={15} />
              Export as Markdown
            </button>
            {onStartIterating && (
              <button
                type="button"
                onClick={onStartIterating}
                className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-lg bg-card border border-border text-sm font-medium text-foreground hover:bg-accent/8 hover:border-accent/30 transition-all"
                data-ocid="design.complete.iterate_button"
              >
                <Sparkles size={14} className="text-accent" />
                Start iterating
                <ChevronRight size={14} className="text-muted-foreground" />
              </button>
            )}
            <button
              type="button"
              onClick={onOpenOrganize}
              className="flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="design.complete.organize_button"
            >
              <ExternalLink size={13} />
              Open in Organize
            </button>
          </div>
        </div>

        {/* Back button */}
        <div className="px-8 py-5 border-t border-border flex-shrink-0">
          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="design.flow.back_button"
          >
            <ArrowLeft size={14} />
            Back to review
          </button>
        </div>
      </div>
    );
  }

  // ─── Normal step ───────────────────────────────────────────────────────────────
  const isTwoCol =
    options.length >= 4 && !stepDef.multiSelect && options.length <= 8;
  const isColorStep = options.some((o) => o.colors);
  const isCompact = stepDef.multiSelect && options.length >= 6;

  // Determine fixed grid columns so cards never shift position
  const gridCols =
    options.length === 2
      ? "grid-cols-2"
      : isTwoCol || isColorStep
        ? "grid-cols-2 sm:grid-cols-3"
        : isCompact
          ? "grid-cols-2 sm:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2";

  return (
    <StepCard
      stepNumber={safeIndex + 1}
      totalSteps={totalSteps}
      phaseName={stepDef.phaseName}
      question={stepDef.question}
      hint={stepDef.hint}
      footer={stepDef.multiSelect ? footer : undefined}
    >
      {/* Fixed grid — cards maintain size/position as step content changes */}
      <div
        className={cn("grid gap-3", gridCols)}
        style={{ gridAutoRows: isCompact ? "auto" : "1fr" }}
        data-ocid={`design.step.${stepDef.id}.options`}
      >
        {options.map((option) => (
          <ChoiceCard
            key={option.id}
            option={option}
            selected={selectedIds.includes(option.id)}
            onSelect={() => selectOption(option.id)}
            compact={isCompact}
          />
        ))}
      </div>
    </StepCard>
  );
}
