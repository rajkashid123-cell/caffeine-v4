import { Variant_idea_defining_live_building_exploring } from "@/backend";
import { useProjects } from "@/hooks/useProjects";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import {
  AppCategory,
  BuilderMode,
  type CustomizationConfig,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Edit2, Loader2, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { ModeHeader } from "../components/layout/ModeHeader";
import { PageWrapper } from "../components/layout/PageWrapper";

const TOTAL_STEPS = 6;

const AUDIENCE_OPTIONS = [
  {
    id: "consumers",
    label: "Consumers",
    icon: "👥",
    desc: "General public end-users",
  },
  {
    id: "businesses",
    label: "Businesses",
    icon: "🏢",
    desc: "B2B, companies as clients",
  },
  {
    id: "internal",
    label: "My team or staff",
    icon: "🏗️",
    desc: "Employees & internal ops",
  },
  {
    id: "community",
    label: "A Community",
    icon: "🌐",
    desc: "Groups, clubs, networks",
  },
  {
    id: "yourself",
    label: "Just me",
    icon: "🧑‍💻",
    desc: "Personal or solo use",
  },
  { id: "other", label: "Other", icon: "✦", desc: "Specialised or custom" },
];

const FEATURE_LABELS: Record<string, string> = {
  "Daily focus view": "Stay focused on what matters today",
  "Recurring tasks": "Repeat tasks automatically",
  "Priority labels": "Mark what's urgent and important",
  "Quick-capture inbox": "Capture ideas instantly",
  "Weekly review": "Review progress every week",
  "Calendar availability": "Show when you're free",
  "Client self-booking": "Let customers book themselves",
  "Automated reminders": "Send reminders automatically",
  "Buffer time rules": "Add breaks between bookings",
  "Service types & durations": "Offer different services",
  "No-show tracking": "Track missed appointments",
  "Content pipeline & drafts": "Write and manage content",
  "Asset library": "Store images and files",
  "Scheduled publishing": "Publish content automatically",
  "Category taxonomy": "Organise content by topic",
  "Author management": "Manage who can write",
  "Buyer & seller roles": "Separate buyer and seller accounts",
  "Listing management": "Create and edit listings",
  "Search & filters": "Help people find what they need",
  "Checkout flow": "Take payments smoothly",
  "Seller dashboard & payouts": "Pay sellers automatically",
  "Review & rating system": "Collect customer reviews",
  "Event calendar & RSVP": "Plan events and track attendance",
  "Discussion boards": "Let people start conversations",
  "Member directory": "List all members",
  Announcements: "Broadcast news to everyone",
  "Moderation tools": "Keep discussions safe",
  "Multi-tenant org model": "Separate data for each organisation",
  "Role-based access": "Control who sees what",
  "Billing & plan management": "Manage subscriptions",
  "Settings & profile": "Let users customise their account",
  "Notification centre": "Alert users to updates",
  "Usage metrics dashboard": "See how people use your app",
  "Project status board": "Track project progress",
  "File sharing & approvals": "Share files and get sign-off",
  "Invoice & payment tracking": "Track what's been paid",
  "Client messaging thread": "Chat with clients in one place",
  "Milestone tracker": "Mark key project stages",
  "Study session scheduling": "Plan study sessions",
  "Resource library": "Store and share learning materials",
  "Peer accountability pairs": "Match people for mutual support",
  "Progress check-ins": "Track learning progress",
};

const COLOR_OPTIONS = [
  { id: "calm-blue", label: "Calm Blue", swatch: "oklch(0.55 0.10 235)" },
  { id: "warm-sunset", label: "Warm Sunset", swatch: "oklch(0.65 0.14 40)" },
  { id: "forest-green", label: "Forest Green", swatch: "oklch(0.52 0.13 150)" },
  { id: "deep-purple", label: "Deep Purple", swatch: "oklch(0.48 0.15 290)" },
  {
    id: "slate-neutral",
    label: "Slate / Neutral",
    swatch: "oklch(0.50 0.04 255)",
  },
  { id: "bold-red", label: "Bold Red", swatch: "oklch(0.55 0.18 15)" },
];

const STEP_LABELS = [
  "Name",
  "About",
  "Customers",
  "Colours",
  "Features",
  "Customize",
];

function audienceLabelFor(id: string): string {
  return AUDIENCE_OPTIONS.find((a) => a.id === id)?.label ?? id;
}

function colorLabelFor(id: string): string {
  return COLOR_OPTIONS.find((c) => c.id === id)?.label ?? id;
}

function colorSwatchFor(id: string): string {
  return (
    COLOR_OPTIONS.find((c) => c.id === id)?.swatch ?? "oklch(0.55 0.10 235)"
  );
}

/** Step indicator row — 5 circles + connectors */
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 mb-8" aria-label="Progress">
      {STEP_LABELS.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                  !done && !active ? "bg-muted text-muted-foreground" : "",
                  done && "bg-accent text-accent-foreground",
                  active &&
                    "bg-accent text-accent-foreground ring-[3px] ring-accent/35",
                )}
              >
                {done ? <Check size={12} /> : n}
              </div>
              <span
                className={cn(
                  "text-2xs font-medium whitespace-nowrap",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </div>
            {i < TOTAL_STEPS - 1 && (
              <div
                className={cn(
                  "w-10 h-px mb-4 transition-colors",
                  done ? "bg-accent" : "bg-muted-foreground/20",
                )}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Persistent source-app context strip */
function SourceStrip({
  name,
  iconColor,
  tags,
  author,
  rating,
  usedByCount,
}: {
  name: string;
  iconColor: string;
  tags: string[];
  author: string;
  rating: number;
  usedByCount: number;
}) {
  return (
    <div className="flex items-center gap-2.5 bg-muted/40 rounded-xl px-4 py-2.5 mb-6 border border-border">
      <div
        className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-foreground text-xs font-bold"
        style={{ backgroundColor: iconColor }}
        aria-hidden="true"
      >
        {name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm-minus text-muted-foreground">
          Customise this template for your business:{" "}
        </span>
        <span className="text-sm-minus font-semibold text-foreground">
          {name}
        </span>
        <span className="text-sm-minus text-muted-foreground">
          {" "}
          by {author}
        </span>
      </div>
      {tags.map((t) => (
        <span
          key={t}
          className="text-2xs px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground capitalize"
        >
          {t}
        </span>
      ))}
      <div className="flex items-center gap-3 text-xs text-muted-foreground ml-auto">
        <span className="flex items-center gap-1">
          <Star size={12} style={{ color: "oklch(var(--color-amber))" }} />
          {rating} rating
        </span>
        <span className="flex items-center gap-1">
          <Users size={12} />
          {usedByCount.toLocaleString()} teams using this
        </span>
      </div>
    </div>
  );
}

function ReviewRow({
  label,
  value,
  onEdit,
  editOcid,
}: {
  label: string;
  value: string;
  onEdit: () => void;
  editOcid: string;
}) {
  return (
    <div className="px-4 py-3 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-xs-plus uppercase tracking-wider text-muted-foreground font-medium mb-0.5">
          {label}
        </p>
        <p className="text-sm-plus font-semibold text-foreground truncate">
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="flex-shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        aria-label={`Edit ${label.toLowerCase()}`}
        data-ocid={editOcid}
      >
        <Edit2 size={13} />
      </button>
    </div>
  );
}

export function SpecializePage() {
  const specializationState = useAppStore((s) => s.specializationState);
  const setSpecializationState = useAppStore((s) => s.setSpecializationState);
  const setMode = useAppStore((s) => s.setMode);
  const setIsLauncherMode = useAppStore((s) => s.setIsLauncherMode);
  const navigate = useNavigate();
  const { createProject, updateSpec, updateMetadata } = useProjects();

  // Guard — redirect if arrived without state
  useEffect(() => {
    if (!specializationState) {
      navigate({ to: "/market" });
    }
  }, [specializationState, navigate]);

  const [step, setStep] = useState(1);
  const [name, setName] = useState(
    specializationState ? specializationState.name : "",
  );
  const [businessDescription, setBusinessDescription] = useState("");
  const [audience, setAudience] = useState(
    specializationState ? specializationState.audience : "",
  );
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    specializationState ? specializationState.selectedFeatures : [],
  );
  const [colorDirection, setColorDirection] = useState(
    specializationState ? specializationState.colorDirection : "",
  );
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState<SupportedLocale>("en");
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark">("light");

  if (!specializationState) return null;

  const { sourceApp } = specializationState;

  function toggleFeature(f: string) {
    setSelectedFeatures((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
    );
  }

  // Step advance handlers
  function advanceStep1() {
    const finalName = name.trim() || `${sourceApp.name} (My Version)`;
    if (!name.trim()) setName(finalName);
    setSpecializationState({ ...specializationState!, name: finalName });
    setStep(2);
  }

  function advanceStep2() {
    setSpecializationState({
      ...specializationState!,
    });
    setStep(3);
  }

  function selectAudience(id: string) {
    setAudience(id);
    setSpecializationState({ ...specializationState!, audience: id });
    setTimeout(() => setStep(4), 300);
  }

  function advanceStep5() {
    setStep(6);
  }

  function selectColor(id: string) {
    setColorDirection(id);
    setSpecializationState({ ...specializationState!, colorDirection: id });
    setTimeout(() => setStep(5), 300);
  }

  async function handleConfirm() {
    setConfirmError(null);
    setIsConfirming(true);
    try {
      const finalName = name.trim() || `${sourceApp.name} (My Version)`;
      const audienceLabel = audienceLabelFor(audience || sourceApp.audience);

      const customizationConfig: CustomizationConfig = {
        appName: finalName,
        brandColor: colorDirection || sourceApp.colorDirection,
        theme: selectedTheme,
        locale: selectedLocale,
      };

      const project = createProject(
        finalName,
        sourceApp.icon,
        sourceApp.iconColor,
        AppCategory.other,
      );

      updateSpec(project.id, [
        {
          heading: "Origin",
          content: `Cloned from ${sourceApp.name} — specialised for ${audienceLabel}`,
        },
      ]);

      updateMetadata(project.id, {
        maturity: Variant_idea_defining_live_building_exploring.idea,
        tags: ["cloned", sourceApp.tags[0] ?? ""].filter(Boolean),
        builderMode: BuilderMode.standard,
        attentionFlag: false,
      });

      // Attach customization config to the project
      project.customizationConfig = customizationConfig;

      setSuccess(true);
      setTimeout(() => {
        setSpecializationState(null);
        setIsLauncherMode(true);
        setMode("organize");
        navigate({ to: "/organize" });
      }, 1600);
    } catch {
      setConfirmError(
        "Something went wrong adding your app. Please try again.",
      );
      setIsConfirming(false);
    }
  }

  return (
    <PageWrapper
      header={<ModeHeader title="Specialize" subtitle="Make this app yours" />}
    >
      <div className="flex flex-col gap-6">
        {/* Progress indicator */}
        <StepIndicator current={step} />

        {/* Step container */}
        <div className="flex flex-col">
          {/* Source strip — persists across all steps */}
          <SourceStrip
            name={sourceApp.name}
            iconColor={sourceApp.iconColor}
            tags={sourceApp.tags}
            author={sourceApp.author}
            rating={sourceApp.rating}
            usedByCount={sourceApp.usedByCount}
          />

          {/* ── STEP 1 — Name ── */}
          {step === 1 && !success && (
            <div
              className="flex flex-col gap-6"
              data-ocid="specialize.rename_step"
            >
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-1">
                  What would you like to call your app?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Give it a name that's yours. You can always rename it later.
                </p>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && name.trim() && advanceStep1()
                }
                placeholder={`e.g. My ${sourceApp.name}`}
                className="w-full text-base bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 shadow-sm"
                data-ocid="specialize.name_input"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={advanceStep1}
                  disabled={!name.trim()}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors",
                    !name.trim()
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-accent text-accent-fg",
                  )}
                  data-ocid="specialize.name_continue_button"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2 — About your business ── */}
          {step === 2 && !success && (
            <div
              className="flex flex-col gap-6"
              data-ocid="specialize.about_step"
            >
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-1">
                  What does your business do?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Tell us a little about what you do so we can tailor the app
                  for you.
                </p>
              </div>
              <textarea
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                placeholder="e.g. We run a yoga studio in London and want to take class bookings online"
                rows={4}
                className="w-full text-base bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none shadow-sm"
                data-ocid="specialize.about_textarea"
              />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-ocid="specialize.about_back_button"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="button"
                  onClick={advanceStep2}
                  className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors bg-accent text-accent-fg"
                  data-ocid="specialize.about_continue_button"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3 — Customers ── */}
          {step === 3 && !success && (
            <div
              className="flex flex-col gap-6"
              data-ocid="specialize.audience_step"
            >
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-1">
                  Who are your customers?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Tap the option that best describes who will use your app.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {AUDIENCE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => selectAudience(opt.id)}
                    className={cn(
                      "flex items-start gap-3 p-3.5 rounded-lg border text-left transition-all bg-card border-border hover:bg-muted/30",
                      audience === opt.id &&
                        "bg-accent/12 border-accent/35 ring-[1.5px] ring-accent/35",
                    )}
                    data-ocid={`specialize.audience.${opt.id}`}
                  >
                    <span className="text-xl leading-none mt-0.5">
                      {opt.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm-plus font-semibold text-foreground">
                        {opt.label}
                      </p>
                      <p className="text-xs-plus text-muted-foreground mt-0.5">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="self-start flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-ocid="specialize.audience_back_button"
              >
                <ArrowLeft size={14} /> Back
              </button>
            </div>
          )}

          {/* ── STEP 4 — Colours ── */}
          {step === 4 && !success && (
            <div
              className="flex flex-col gap-6"
              data-ocid="specialize.branding_step"
            >
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-1">
                  Pick your brand colour
                </h2>
                <p className="text-sm text-muted-foreground">
                  This sets the visual mood for your app's design.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {COLOR_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => selectColor(opt.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-lg border bg-card border-border transition-all hover:bg-muted/30",
                      colorDirection === opt.id &&
                        "bg-accent/12 border-accent/35 ring-[1.5px] ring-accent/35",
                    )}
                    data-ocid={`specialize.color.${opt.id}`}
                  >
                    <div
                      className="w-10 h-10 rounded-full shadow-sm"
                      style={{ backgroundColor: opt.swatch }}
                    />
                    <span className="text-xs-plus font-medium text-foreground text-center leading-tight">
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="self-start flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-ocid="specialize.branding_back_button"
              >
                <ArrowLeft size={14} /> Back
              </button>
            </div>
          )}

          {/* ── STEP 5 — Features ── */}
          {step === 5 && !success && (
            <div
              className="flex flex-col gap-6"
              data-ocid="specialize.features_step"
            >
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-1">
                  What features do you need?
                </h2>
                <p className="text-sm text-muted-foreground">
                  All are pre-selected — tap to remove any you don't need.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {sourceApp.features.map((f) => {
                  const active = selectedFeatures.includes(f);
                  const label = FEATURE_LABELS[f] ?? f;
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => toggleFeature(f)}
                      className={cn(
                        "inline-flex items-center gap-1.5 text-sm-minus px-3 py-1.5 rounded-full border transition-all",
                        active
                          ? "font-medium bg-accent/12 text-accent border-accent/35"
                          : "bg-muted text-muted-foreground border-border line-through opacity-50",
                      )}
                      data-ocid={`specialize.feature.${f.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {active && <Check size={11} />}
                      {label}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-ocid="specialize.features_back_button"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="button"
                  onClick={advanceStep5}
                  className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors bg-accent text-accent-fg"
                  data-ocid="specialize.features_continue_button"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 6 — Customization ── */}
          {step === 6 && !success && (
            <div
              className="flex flex-col gap-6"
              data-ocid="specialize.customize_step"
            >
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-1">
                  Make it yours
                </h2>
                <p className="text-sm text-muted-foreground">
                  These settings are yours — they travel with your app and never
                  affect updates from the creator.
                </p>
              </div>

              {/* Language selector */}
              <div className="flex flex-col gap-3">
                <p className="text-sm-plus font-semibold text-foreground">
                  Language
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUPPORTED_LOCALES.map((loc) => {
                    const active = selectedLocale === loc.id;
                    return (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => setSelectedLocale(loc.id)}
                        className={cn(
                          "text-sm-minus px-3 py-1.5 rounded-full border transition-all",
                          active
                            ? "bg-accent text-accent-foreground border-accent font-medium"
                            : "border-border text-foreground hover:border-accent",
                        )}
                        data-ocid={`specialize.locale.${loc.id}`}
                      >
                        {loc.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Theme selector */}
              <div className="flex flex-col gap-3">
                <p className="text-sm-plus font-semibold text-foreground">
                  Theme
                </p>
                <div className="flex gap-2">
                  {(["light", "dark"] as const).map((t) => {
                    const active = selectedTheme === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTheme(t)}
                        className={cn(
                          "text-sm-minus px-4 py-1.5 rounded-full border transition-all capitalize",
                          active
                            ? "bg-accent text-accent-foreground border-accent font-medium"
                            : "border-border text-foreground hover:border-accent",
                        )}
                        data-ocid={`specialize.theme.${t}`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-ocid="specialize.customize_back_button"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="button"
                  onClick={advanceStep5}
                  className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors bg-accent text-accent-fg"
                  data-ocid="specialize.customize_continue_button"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 6 — Review & Confirm ── */}
          {step === 6 && !success && (
            <div
              className="flex flex-col gap-6"
              data-ocid="specialize.review_step"
            >
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-1">
                  Review your choices
                </h2>
                <p className="text-sm text-muted-foreground">
                  Everything looks good? Confirm to add it to your portfolio.
                </p>
              </div>

              {/* Summary card */}
              <div className="rounded-xl border border-border bg-card divide-y divide-border">
                <ReviewRow
                  label="App name"
                  value={name.trim() || `${sourceApp.name} (My Version)`}
                  onEdit={() => setStep(1)}
                  editOcid="specialize.review.edit_name_button"
                />
                <ReviewRow
                  label="Your customers"
                  value={audienceLabelFor(audience || sourceApp.audience)}
                  onEdit={() => setStep(3)}
                  editOcid="specialize.review.edit_audience_button"
                />
                {/* Features */}
                <div className="px-4 py-3 flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs-plus uppercase tracking-wider text-muted-foreground font-medium mb-2">
                      Features
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(selectedFeatures.length > 0
                        ? selectedFeatures
                        : sourceApp.features
                      ).map((f) => (
                        <span
                          key={f}
                          className="text-xs-plus px-2.5 py-1 rounded-full border font-medium bg-accent/12 text-accent border-accent/35"
                        >
                          {FEATURE_LABELS[f] ?? f}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(5)}
                    className="flex-shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors mt-0.5"
                    aria-label="Edit features"
                    data-ocid="specialize.review.edit_features_button"
                  >
                    <Edit2 size={13} />
                  </button>
                </div>
                {/* Brand colour */}
                <div className="px-4 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs-plus uppercase tracking-wider text-muted-foreground font-medium mb-1.5">
                      Brand colour
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full shadow-sm flex-shrink-0"
                        style={{
                          backgroundColor: colorSwatchFor(
                            colorDirection || sourceApp.colorDirection,
                          ),
                        }}
                      />
                      <span className="text-sm-plus text-foreground">
                        {colorLabelFor(
                          colorDirection || sourceApp.colorDirection,
                        )}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="flex-shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    aria-label="Edit brand colour"
                    data-ocid="specialize.review.edit_color_button"
                  >
                    <Edit2 size={13} />
                  </button>
                </div>
                {/* Language */}
                <ReviewRow
                  label="Language"
                  value={
                    SUPPORTED_LOCALES.find((l) => l.id === selectedLocale)
                      ?.label ?? selectedLocale
                  }
                  onEdit={() => setStep(6)}
                  editOcid="specialize.review.edit_locale_button"
                />
                {/* Theme */}
                <ReviewRow
                  label="Theme"
                  value={selectedTheme === "light" ? "Light" : "Dark"}
                  onEdit={() => setStep(6)}
                  editOcid="specialize.review.edit_theme_button"
                />
              </div>

              {/* Note */}
              <p className="text-sm-minus text-muted-foreground leading-relaxed bg-muted/30 rounded-lg px-4 py-3 border border-border">
                This app will be added to your portfolio as a new project. You
                can continue designing it from there.
              </p>

              {/* Inline error */}
              {confirmError && (
                <p
                  className="text-sm-plus text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3"
                  data-ocid="specialize.review.error_state"
                >
                  {confirmError}
                </p>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-ocid="specialize.review_back_button"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isConfirming}
                  className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors bg-accent text-accent-fg"
                  data-ocid="specialize.confirm_button"
                >
                  {isConfirming ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Adding…
                    </>
                  ) : (
                    "Confirm & Add to Portfolio"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── Success state ── */}
          {success && (
            <div
              className="flex flex-col items-center justify-center gap-4 py-14 text-center"
              data-ocid="specialize.success_state"
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-accent/15">
                <Check size={26} className="text-accent" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">
                  Your app has been added to your portfolio
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Taking you to Organize…
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
