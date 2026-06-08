import { Button } from "@/components/ui/AppButton";
import { useAppStore } from "@/store/useAppStore";
import type { Project } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { FileText, Layers } from "lucide-react";

interface SpecPanelProps {
  project: Project | null;
  highlightSection?: string | null;
}

export function SpecPanel({ project, highlightSection }: SpecPanelProps) {
  const navigate = useNavigate();
  const setMode = useAppStore((s) => s.setMode);
  // Guard against stale/partial store state — specSections may be undefined
  // on projects deserialized from an older localStorage schema
  const safeSections = project?.specSections ?? [];

  if (!project) {
    return (
      <div
        className="flex flex-col h-full items-center justify-center gap-3 p-6 text-center"
        data-ocid="develop.spec_panel.empty_state"
      >
        <div className="w-10 h-10 rounded-full bg-muted/60 flex items-center justify-center">
          <FileText size={18} className="text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">
          Select a project to see its spec
        </p>
      </div>
    );
  }

  const hasSections = safeSections.length > 0;

  return (
    <div
      className="flex flex-col h-full min-h-0"
      data-ocid="develop.spec_panel"
    >
      {/* Panel header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-border/60 flex items-center gap-2.5">
        <FileText
          size={13}
          className="text-[var(--develop-accent)] flex-shrink-0"
        />
        <span className="text-xs-plus uppercase tracking-widest font-semibold text-[var(--develop-accent)]/70">
          Current Spec
        </span>
        <span className="ml-auto text-2xs text-muted-foreground/50">
          {safeSections.length}{" "}
          {safeSections.length === 1 ? "section" : "sections"}
        </span>
      </div>
      {/* Spec content */}
      <div className="flex-1 overflow-y-auto">
        {hasSections ? (
          <div className="p-4 space-y-5">
            {safeSections.map((section, i) => (
              <div
                key={section.heading + String(i)}
                className={[
                  "space-y-1.5 transition-all duration-300",
                  highlightSection === section.heading
                    ? "ring-1 ring-[var(--develop-accent)]/40 rounded-lg p-3 -mx-3 bg-[var(--develop-accent)]/5"
                    : "",
                ].join(" ")}
                data-ocid={`develop.spec_panel.section.${i + 1}`}
              >
                <h3 className="text-xs-plus font-semibold uppercase tracking-wider text-[var(--develop-accent)]/80">
                  {section.heading}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center gap-3 p-6 h-full text-center"
            data-ocid="develop.spec_panel.no_spec"
          >
            <div className="w-10 h-10 rounded-full bg-muted/60 flex items-center justify-center">
              <Layers size={18} className="text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">No spec yet</p>
              <p className="text-xs-plus text-muted-foreground leading-relaxed max-w-[180px]">
                Complete the Design flow first to build a spec, then iterate
                here.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setMode("design");
                navigate({ to: "/design" });
              }}
              data-ocid="develop.spec_panel.go_design_button"
            >
              Open Design
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
