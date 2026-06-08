import { HeroSection } from "@/components/layout/HeroSection";
import { useProjects } from "@/hooks/useProjects";
import { useAppStore } from "@/store/useAppStore";
import { useNavigate } from "@tanstack/react-router";
import { FileText, Layers, Users } from "lucide-react";
import { useEffect, useRef } from "react";

export function LandingPage() {
  const navigate = useNavigate();
  const { createProject } = useProjects();
  const setMode = useAppStore((s) => s.setMode);
  const setActiveProject = useAppStore((s) => s.setActiveProject);
  const setIsLauncherMode = useAppStore((s) => s.setIsLauncherMode);
  const setHasCompletedOnboarding = useAppStore(
    (s) => s.setHasCompletedOnboarding,
  );
  const setOnboardingComplete = useAppStore((s) => s.setOnboardingComplete);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  function handleStart() {
    setHasCompletedOnboarding(true);
    setOnboardingComplete(true);
    const project = createProject("New Project");
    setActiveProject(project.id);
    setMode("design");
    navigate({ to: "/design" });
  }

  function handleStartFromTemplate() {
    setHasCompletedOnboarding(true);
    setOnboardingComplete(true);
    setIsLauncherMode(true);
    setMode("market");
    navigate({ to: "/market" });
  }

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const elements =
      container.querySelectorAll<HTMLElement>(".animate-on-scroll");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, root: container },
    );

    for (const el of elements) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-background"
    >
      {/* ── HERO ── delegated entirely to HeroSection primitive */}
      <div className="snap-start">
        <HeroSection
          backgroundImage="/assets/images/hero-illustration.png"
          badgeText="Caffeine Designer v4"
          headlinePrefix="Your app, "
          headlineAccent="fully specified."
          subheadline="Describe what you're building through visual choices. A professional spec assembles itself."
          primaryCtaLabel="Start designing"
          onPrimaryClick={handleStart}
          secondaryCtaLabel="Start from a template"
          onSecondaryClick={handleStartFromTemplate}
          ocidPrefix="landing.hero"
        />
      </div>

      {/* ── FEATURES ── */}
      <section className="min-h-screen snap-start bg-muted/30 flex flex-col items-center justify-center py-20 px-12">
        <div className="animate-on-scroll text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
            What you get
          </p>
          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-tight text-foreground text-center mb-16">
            Everything you need to ship with clarity
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-6 w-full max-w-5xl">
          {(
            [
              {
                Icon: Layers,
                title: "Specify without writing",
                body: "Choose from visual options. A complete spec assembles itself from your selections.",
                delay: 0,
              },
              {
                Icon: Users,
                title: "Every role, considered",
                body: "Define who uses your app and preview exactly what they see.",
                delay: 80,
              },
              {
                Icon: FileText,
                title: "Blueprint in minutes",
                body: "Organised, exportable, ready to hand off. No blank page, no back-and-forth.",
                delay: 160,
              },
            ] as const
          ).map(({ Icon, title, body, delay }) => (
            <div
              key={title}
              className="animate-on-scroll flex flex-col gap-4 p-8 rounded-2xl bg-card border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow"
              style={{ transitionDelay: `${delay}ms` }}
            >
              <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-base font-bold text-foreground mb-2 tracking-tight">
                  {title}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="animate-on-scroll min-h-screen snap-start flex flex-col items-center justify-center text-center py-20 px-12 bg-background">
        <div aria-hidden className="w-16 h-0.5 bg-accent rounded-sm mb-10" />

        <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-extrabold tracking-tight text-foreground max-w-[640px] leading-[1.15] mb-5">
          Ready to turn your idea into a real spec?
        </h2>

        <p className="text-base leading-relaxed text-muted-foreground max-w-[440px] mb-12">
          No writing. No blank page. Just choices that become a blueprint.
        </p>

        <button
          type="button"
          onClick={handleStart}
          data-ocid="landing.cta.start_button"
          className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-semibold px-9 py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-[var(--shadow-sm)]"
        >
          Start designing
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            role="presentation"
          >
            <path
              d="M2 7h10M8 3l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <p className="mt-20 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground no-underline"
          >
            caffeine.ai
          </a>
        </p>
      </section>
    </div>
  );
}
