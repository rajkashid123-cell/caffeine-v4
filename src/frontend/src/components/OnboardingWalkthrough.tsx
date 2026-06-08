import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { useNavigate } from "@tanstack/react-router";
import {
  LayoutGrid,
  PenLine,
  Pencil,
  Rocket,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

// Step 0: fork card selection
const FORK_OPTIONS = [
  {
    id: "builder",
    icon: Pencil,
    title: "I want to build something new",
    desc: "Design your app from scratch through visual choices.",
  },
  {
    id: "launcher",
    icon: ShoppingBag,
    title: "I want to launch from a template",
    desc: "Find a ready-made app, clone it, and make it yours.",
  },
] as const;

type ForkChoice = "builder" | "launcher" | null;

// Builder walkthrough steps (after fork)
const BUILDER_STEPS = [
  {
    icon: Sparkles,
    title: "Welcome to Caffeine Designer",
    desc: "Turn app ideas into clear, professional specs through visual selection — no writing required.",
  },
  {
    icon: PenLine,
    title: "Design your app",
    desc: "Click through choices for app type, audience, features, and look. Your spec assembles live as you choose.",
  },
  {
    icon: LayoutGrid,
    title: "Organise and iterate",
    desc: "Manage your portfolio, refine specs with one-tap actions, and preview how your app looks for each user role.",
  },
  {
    icon: Rocket,
    title: "You're ready",
    desc: "Your first project is waiting. Let's build your spec.",
  },
];

// Launcher walkthrough steps (after fork)
const LAUNCHER_STEPS = [
  {
    icon: ShoppingBag,
    title: "Browse by your business goal",
    desc: "Filter by what your business does — bookings, selling, managing a team. Find the template that fits, not the one with the best technical name.",
  },
  {
    icon: Rocket,
    title: "Clone and make it yours",
    desc: "Pick a template, give it your name, describe your business, and choose your colours. Done in under 2 minutes — then it's your app.",
  },
];

export function OnboardingWalkthrough() {
  const [fork, setFork] = useState<ForkChoice>(null);
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);
  const setHasCompletedOnboarding = useAppStore(
    (s) => s.setHasCompletedOnboarding,
  );
  const setIsLauncherMode = useAppStore((s) => s.setIsLauncherMode);
  const setMode = useAppStore((s) => s.setMode);
  const navigate = useNavigate();

  const steps = fork === "launcher" ? LAUNCHER_STEPS : BUILDER_STEPS;

  function dismiss(toLauncher = false) {
    setExiting(true);
    setTimeout(() => {
      setHasCompletedOnboarding(true);
      if (toLauncher) {
        setIsLauncherMode(true);
        setMode("market");
        navigate({ to: "/market" });
      } else {
        // Builders land on the dashboard — their workspace overview
        navigate({ to: "/dashboard" });
      }
    }, 300);
  }

  function next() {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      dismiss(fork === "launcher");
    }
  }

  function prev() {
    if (step > 0) setStep((s) => s - 1);
  }

  // Fork screen — step 0 before path is chosen
  if (fork === null) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm"
        style={{ opacity: exiting ? 0 : 1, transition: "opacity 300ms ease" }}
        data-ocid="onboarding.dialog"
      >
        <div className="flex flex-col items-center max-w-xl w-full px-6">
          <div className="mb-6 p-3 rounded-full bg-primary/10">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground text-center mb-2">
            Welcome to Caffeine Designer
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-sm">
            What brings you here today?
          </p>
          <div className="grid grid-cols-2 gap-4 w-full">
            {FORK_OPTIONS.map(({ id, icon: Icon, title, desc }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setFork(id);
                  setStep(0);
                }}
                className="flex flex-col items-start gap-3 p-6 rounded-xl border-2 border-border hover:border-primary/60 bg-card hover:bg-accent/5 text-left transition-all duration-150 focus-ring group"
                data-ocid={`onboarding.fork.${id}`}
              >
                <div className="p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    {title}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const current = steps[step];
  const Icon = current.icon;
  const isLast = step === steps.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm"
      style={{
        opacity: exiting ? 0 : 1,
        transition: "opacity 300ms ease",
      }}
      data-ocid="onboarding.dialog"
    >
      <div className="flex flex-col items-center max-w-md w-full px-6">
        {/* Icon */}
        <div className="mb-8">
          <Icon className="h-16 w-16 text-primary" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-foreground text-center mb-4">
          {current.title}
        </h2>

        {/* Description */}
        <p className="text-muted-foreground text-center leading-relaxed mb-10 max-w-sm">
          {current.desc}
        </p>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className={`h-2 rounded-full transition-all duration-200 ${
                i === step ? "w-5 bg-primary" : "w-2 bg-muted"
              }`}
              data-ocid={`onboarding.dot.${i + 1}`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between w-full">
          {step > 0 && !isLast ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={prev}
              data-ocid="onboarding.prev_button"
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            {!isLast && (
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => dismiss(fork === "launcher")}
                data-ocid="onboarding.skip_link"
              >
                Skip
              </button>
            )}

            <Button
              variant="default"
              size="sm"
              onClick={next}
              data-ocid={
                isLast ? "onboarding.start_button" : "onboarding.next_button"
              }
            >
              {isLast
                ? fork === "launcher"
                  ? "Browse templates"
                  : "Start designing"
                : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
