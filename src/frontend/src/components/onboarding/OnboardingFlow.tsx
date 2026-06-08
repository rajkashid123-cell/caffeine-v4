import { Button } from "@/components/ui/AppButton";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { LayoutGrid, Pencil, Sparkles, Zap } from "lucide-react";
import { useState } from "react";

const STEPS = [
  {
    icon: Sparkles,
    title: "Design specs by choosing, not writing",
    body: "Caffeine turns vague app ideas into real, professional specifications. No blank pages. No long interviews. Just visual choices.",
  },
  {
    icon: Pencil,
    title: "Click through 18 visual steps",
    body: "Pick your app type, vibe, features, and layout by tapping cards. A complete spec assembles as you go.",
  },
  {
    icon: LayoutGrid,
    title: "Manage your portfolio",
    body: "Filter, tag, and track every spec. Set maturity and priority. Duplicate a spec to start something similar fast.",
  },
  {
    icon: Zap,
    title: "Refine with one-tap actions",
    body: "Run audits, simplify flows, generate screens. Accept or discard — changes never apply without your review.",
  },
];

export function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);
  const setOnboardingComplete = useAppStore((s) => s.setOnboardingComplete);

  function dismiss() {
    setExiting(true);
    setTimeout(() => {
      setOnboardingComplete(true);
    }, 300);
  }

  function next() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      dismiss();
    }
  }

  function prev() {
    if (step > 0) setStep((s) => s - 1);
  }

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "oklch(var(--color-overlay-bg))",
        opacity: exiting ? 0 : 1,
        transition: "opacity 300ms ease",
      }}
      data-ocid="onboarding.dialog"
    >
      <div
        className="flex flex-col bg-sidebar-bg border border-white/10 rounded-xl p-10 pb-8"
        style={{
          width: 560,
          height: 400,
        }}
      >
        {/* Icon + content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center mb-6 w-[52px] h-[52px] rounded-xl bg-accent/15">
            <Icon size={24} className="text-accent" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-3 max-w-[380px]">
            {current.title}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-[380px]">
            {current.body}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {STEPS.map((s, i) => (
            <div
              key={s.title ?? i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-200 ease",
                i === step ? "w-5 bg-accent" : "w-1.5 bg-sidebar-foreground/20",
              )}
              data-ocid={`onboarding.dot.${i + 1}`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            onClick={dismiss}
            data-ocid="onboarding.skip_link"
          >
            Skip
          </button>

          <div className="flex items-center gap-2">
            {step > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={prev}
                data-ocid="onboarding.prev_button"
              >
                Previous
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={next}
              data-ocid="onboarding.next_button"
            >
              {isLast ? "Get Started" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
