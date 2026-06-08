import type { ChoiceOption } from "@/lib/designFlowData";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ChoiceCardProps {
  option: ChoiceOption;
  selected: boolean;
  onSelect: () => void;
  /** compact = smaller card for dense grids */
  compact?: boolean;
  /** wide = full-width horizontal card */
  wide?: boolean;
}

export function ChoiceCard({
  option,
  selected,
  onSelect,
  compact = false,
  wide = false,
}: ChoiceCardProps) {
  const Icon = option.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative flex flex-col items-start text-left rounded-xl border transition-all duration-150 cursor-pointer select-none",
        "hover:border-accent/60 hover:bg-accent/10",
        wide
          ? "flex-row items-center gap-4 p-4"
          : compact
            ? "p-3 gap-2 min-h-[72px]"
            : "p-4 gap-3 min-h-[100px]",
        selected
          ? "border-accent bg-accent/15 shadow-sm"
          : "border-border bg-card shadow-sm",
      )}
      data-ocid={`design.choice.${option.id}`}
    >
      {/* Selected checkmark */}
      {selected && (
        <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
          <Check
            size={11}
            className="text-accent-foreground"
            strokeWidth={2.5}
          />
        </span>
      )}

      {/* Icon */}
      {Icon && !option.previewHint && !option.colors && (
        <span
          className={cn(
            "flex items-center justify-center rounded-md flex-shrink-0",
            "bg-accent/10 text-accent",
            compact ? "w-7 h-7" : "w-9 h-9",
          )}
        >
          <Icon size={compact ? 14 : 18} />
        </span>
      )}

      {/* Color palette preview */}
      {option.colors && (
        <div className={cn("flex gap-1.5", wide ? "" : "mb-1")}>
          {option.colors.map((color) => (
            <span
              key={color}
              className="w-6 h-6 rounded-full border border-border/30 flex-shrink-0"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      )}

      {/* Vibe preview block */}
      {option.previewHint && (
        <VibePreview hint={option.previewHint} compact={compact} />
      )}

      {/* Text content */}
      <div className={cn("flex-1 min-w-0", wide && "flex flex-col")}>
        <p
          className={cn(
            "font-medium leading-tight",
            compact ? "text-xs" : "text-sm",
            selected ? "text-foreground" : "text-foreground/80",
          )}
        >
          {option.label}
        </p>
        {option.description && (
          <p
            className={cn(
              "text-muted-foreground leading-snug mt-0.5",
              compact ? "text-2xs" : "text-xs",
            )}
          >
            {option.description}
          </p>
        )}
      </div>
    </button>
  );
}

// Inline vibe preview — styled mini mockup
function VibePreview({ hint, compact }: { hint: string; compact: boolean }) {
  const h = compact ? "h-12" : "h-16";

  if (hint === "calm") {
    return (
      <div
        className={cn(
          "w-full rounded-md border border-border/40 bg-background overflow-hidden",
          h,
        )}
      >
        <div className="h-2 bg-muted border-b border-border/20" />
        <div className="p-2 space-y-1">
          <div className="w-1/2 h-1.5 rounded-sm bg-foreground/80" />
          <div className="w-3/4 h-1 rounded-sm bg-muted-foreground/30" />
        </div>
      </div>
    );
  }
  if (hint === "bold") {
    return (
      <div
        className={cn("w-full rounded-md overflow-hidden bg-foreground/90", h)}
      >
        <div className="h-2 border-b bg-foreground/80 border-background/20" />
        <div className="p-2 space-y-1">
          <div className="w-1/2 h-1.5 rounded-sm bg-accent" />
          <div className="w-3/4 h-1 rounded-sm bg-muted-foreground/40" />
        </div>
      </div>
    );
  }
  if (hint === "warm") {
    return (
      <div
        className={cn(
          "w-full rounded-md overflow-hidden bg-muted border border-border/30",
          h,
        )}
      >
        <div className="h-2 border-b bg-muted-foreground/10 border-border/40" />
        <div className="p-2 space-y-1">
          <div className="w-1/2 h-1.5 rounded-sm bg-[oklch(var(--color-status-warning))]" />
          <div className="w-3/4 h-1 rounded-sm bg-muted-foreground/30" />
        </div>
      </div>
    );
  }
  if (hint === "serious") {
    return (
      <div
        className={cn("w-full rounded-md overflow-hidden bg-foreground/90", h)}
      >
        <div className="h-2 border-b bg-foreground/80 border-background/20" />
        <div className="p-2 space-y-1">
          <div className="w-1/2 h-1.5 rounded-sm bg-secondary" />
          <div className="w-3/4 h-1 rounded-sm bg-muted-foreground/30" />
        </div>
      </div>
    );
  }
  if (hint === "playful") {
    return (
      <div
        className={cn(
          "w-full rounded-md overflow-hidden bg-card border border-border/40",
          h,
        )}
      >
        <div className="h-2 border-b bg-muted border-border/30" />
        <div className="p-2 space-y-1">
          <div className="w-1/2 h-1.5 rounded-full bg-[oklch(var(--color-status-error))]" />
          <div className="w-3/4 h-1 rounded-full bg-[oklch(var(--color-status-warning))]" />
        </div>
      </div>
    );
  }
  // Typography previews
  if (hint === "display") {
    return (
      <div
        className={cn(
          "w-full rounded-md border border-border/40 bg-card overflow-hidden flex flex-col justify-center px-2",
          h,
        )}
      >
        <p className="text-sm font-bold text-foreground leading-none">
          Display
        </p>
        <p className="text-2xs text-muted-foreground mt-1">
          Body text sits lightly below
        </p>
      </div>
    );
  }
  if (hint === "even") {
    return (
      <div
        className={cn(
          "w-full rounded-md border border-border/40 bg-card overflow-hidden flex flex-col justify-center px-2",
          h,
        )}
      >
        <p className="text-xs font-medium text-foreground">Heading level</p>
        <p className="text-xs font-medium text-muted-foreground mt-0.5">
          Body feels the same
        </p>
      </div>
    );
  }
  if (hint === "editorial") {
    return (
      <div
        className={cn(
          "w-full rounded-md border border-border/40 bg-card overflow-hidden flex flex-col justify-center px-2",
          h,
        )}
      >
        <p className="text-base font-bold text-foreground leading-tight">
          Title
        </p>
        <p className="text-2xs text-muted-foreground">
          Byline and date, spaced well
        </p>
      </div>
    );
  }
  if (hint === "minimal") {
    return (
      <div
        className={cn(
          "w-full rounded-md border border-border/40 bg-card overflow-hidden flex flex-col justify-center px-2",
          h,
        )}
      >
        <p className="text-2xs text-muted-foreground">small label</p>
        <p className="text-lg font-bold text-foreground leading-none">KEY</p>
      </div>
    );
  }
  // Corner/density previews
  if (hint === "sharp") {
    return (
      <div
        className={cn(
          "w-full overflow-hidden flex items-center justify-center gap-2",
          h,
        )}
      >
        <div className="w-14 h-8 border border-border bg-card" />
        <div className="w-6 h-6 border border-accent bg-accent/10" />
      </div>
    );
  }
  if (hint === "soft") {
    return (
      <div
        className={cn(
          "w-full overflow-hidden flex items-center justify-center gap-2",
          h,
        )}
      >
        <div className="w-14 h-8 rounded-xl border border-border bg-card" />
        <div className="w-6 h-6 rounded-full border border-accent bg-accent/10" />
      </div>
    );
  }
  // Light/dark previews
  if (hint === "light") {
    return (
      <div
        className={cn(
          "w-full rounded-md overflow-hidden bg-background border border-border/30",
          h,
        )}
      >
        <div className="h-2 bg-muted border-b border-border/40" />
        <div className="p-1.5 space-y-1">
          <div className="w-2/3 h-1.5 rounded-sm bg-foreground/80" />
          <div className="w-1/2 h-1 rounded-sm bg-muted-foreground/30" />
        </div>
      </div>
    );
  }
  if (hint === "dark") {
    return (
      <div
        className={cn("w-full rounded-md overflow-hidden bg-foreground/90", h)}
      >
        <div className="h-2 bg-foreground/80 border-b border-background/20" />
        <div className="p-1.5 space-y-1">
          <div className="w-2/3 h-1.5 rounded-sm bg-muted" />
          <div className="w-1/2 h-1 rounded-sm bg-muted-foreground/60" />
        </div>
      </div>
    );
  }
  if (hint === "calm") {
    return (
      <div
        className={cn(
          "w-full rounded-md border border-border/40 bg-card overflow-hidden flex items-center justify-center",
          h,
        )}
      >
        <p className="text-2xs text-muted-foreground">— subtle —</p>
      </div>
    );
  }
  if (hint === "lively") {
    return (
      <div
        className={cn(
          "w-full rounded-md border border-accent/40 bg-accent/5 overflow-hidden flex items-center justify-center gap-1",
          h,
        )}
      >
        <span className="w-1.5 h-3 rounded-full bg-accent animate-pulse" />
        <span
          className="w-1.5 h-5 rounded-full bg-accent animate-pulse"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-1.5 h-3 rounded-full bg-accent animate-pulse"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    );
  }
  return null;
}
