import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface StepCardProps {
  stepNumber: number;
  totalSteps: number;
  phaseName: string;
  question: string;
  hint?: string;
  children: ReactNode;
  /** Footer area — Back/Continue buttons */
  footer?: ReactNode;
}

export function StepCard({
  stepNumber,
  totalSteps,
  phaseName,
  question,
  hint,
  children,
  footer,
}: StepCardProps) {
  const progress = (stepNumber / totalSteps) * 100;

  return (
    <div className="flex flex-col h-full">
      {/* Progress bar — slim strip at top */}
      <div className="h-0.5 bg-border flex-shrink-0 rounded-full">
        <div
          className="h-full bg-accent transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step header */}
      <div className="flex items-center justify-between px-8 pt-6 pb-0 flex-shrink-0">
        <span className="text-2xs uppercase tracking-widest font-medium text-muted-foreground">
          {phaseName}
        </span>
        <span className="text-2xs text-muted-foreground tabular-nums">
          {stepNumber} / {totalSteps}
        </span>
      </div>

      {/* Question */}
      <div className="px-8 pt-4 pb-5 flex-shrink-0 min-h-[120px]">
        <h2 className="text-xl font-semibold text-foreground leading-snug">
          {question}
        </h2>
        {hint ? (
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            {hint}
          </p>
        ) : (
          <div className="mt-1.5 h-5" />
        )}
      </div>

      {/* Choices — fixed height area so short and long steps feel identical */}
      <div className="flex-1 overflow-y-auto px-8 pb-4 min-h-[240px]">
        {children}
      </div>

      {/* Footer — back/continue */}
      {footer && (
        <div className="px-8 py-5 border-t border-border flex-shrink-0">
          {footer}
        </div>
      )}
    </div>
  );
}

/** Multi-select counter badge */
export function SelectionCounter({ count }: { count: number }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full text-2xs font-medium px-2 py-0.5",
        count > 0
          ? "bg-accent text-accent-foreground"
          : "bg-muted text-muted-foreground",
      )}
    >
      {count} selected
    </span>
  );
}
