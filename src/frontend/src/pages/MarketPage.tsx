import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppBadge } from "@/components/ui/AppBadge";
import { Chip } from "@/components/ui/Chip";
import { MARKET_APPS } from "@/lib/sampleProjects";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { MarketApp, MarketAppTag } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  ChevronDown,
  ChevronUp,
  GitFork,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BreadcrumbHeader } from "../components/layout/BreadcrumbHeader";
import { ModeHeader } from "../components/layout/ModeHeader";
import { PageWrapper } from "../components/layout/PageWrapper";

type SortOption = "popular" | "newest" | "az";

type GoalCategory = "all" | "bookings" | "sell" | "team" | "content" | "events";

const GOAL_CATEGORIES: { label: string; value: GoalCategory }[] = [
  { label: "All templates", value: "all" },
  { label: "Take bookings", value: "bookings" },
  { label: "Sell products or services", value: "sell" },
  { label: "Manage a team or community", value: "team" },
  { label: "Share knowledge or content", value: "content" },
  { label: "Run events", value: "events" },
];

function matchesGoalCategory(app: MarketApp, category: GoalCategory): boolean {
  if (category === "all") return true;
  const cat = (app.category ?? "").toLowerCase();
  const tags = (app.tags ?? []).map((t) => t.toLowerCase());
  const features = (app.features ?? []).map((f) => f.toLowerCase());
  const allText = `${cat} ${tags.join(" ")} ${features.join(" ")}`;
  switch (category) {
    case "bookings":
      return /booking|appointment|reservation|schedule|calendar/.test(allText);
    case "sell":
      return /ecommerce|shop|store|marketplace|saas|sell|product|checkout/.test(
        allText,
      );
    case "team":
      return /team|community|internal|management|member|staff/.test(allText);
    case "content":
      return /content|blog|knowledge|portfolio|article|publish|cms/.test(
        allText,
      );
    case "events":
      return /event|conference|meetup|rsvp|session/.test(allText);
    default:
      return true;
  }
}

// ──────────────────────────────
// Creator Update Feed Data
// ──────────────────────────────
interface CreatorUpdate {
  id: string;
  templateId: string;
  templateName: string;
  creatorName: string;
  version: string;
  releaseDate: number;
  changelogSnippet: string;
  iconColor: string;
  newFeatures: string[];
  fixes: string[];
}

const FOLLOWED_UPDATES: CreatorUpdate[] = [
  {
    id: "upd-1",
    templateId: "market-4",
    templateName: "MarketLaunch",
    creatorName: "Caffeine Templates",
    version: "2.3.0",
    releaseDate: Date.now() - 2 * 86400000,
    changelogSnippet:
      "Checkout flow redesigned for fewer drop-offs. Seller payouts now support multi-currency.",
    iconColor: "oklch(0.55 0.14 280)",
    newFeatures: ["Multi-currency payouts", "Guest checkout"],
    fixes: ["Cart persistence bug on mobile", "Seller dashboard filter reset"],
  },
  {
    id: "upd-2",
    templateId: "market-3",
    templateName: "ContentBase",
    creatorName: "Caffeine Templates",
    version: "1.8.0",
    releaseDate: Date.now() - 5 * 86400000,
    changelogSnippet:
      "Added collaborative draft editing and inline comment threads for editorial teams.",
    iconColor: "oklch(0.58 0.06 255)",
    newFeatures: ["Collaborative drafts", "Inline comment threads"],
    fixes: ["Scheduled publish timezone offset"],
  },
  {
    id: "upd-3",
    templateId: "market-7",
    templateName: "ClientPortal",
    creatorName: "Caffeine Templates",
    version: "3.1.0",
    releaseDate: Date.now() - 9 * 86400000,
    changelogSnippet:
      "Milestone tracker rebuilt with Gantt-style timeline view. Invoice status notifications added.",
    iconColor: "oklch(0.68 0.07 70)",
    newFeatures: ["Gantt timeline view", "Invoice status notifications"],
    fixes: ["File upload size limit", "Message read receipts"],
  },
];

function formatUpdateDate(ts: number): string {
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// ──────────────────────────────
// Creator Updates Section
// ──────────────────────────────
function CreatorUpdatesSection({
  onApplyUpdate,
}: {
  onApplyUpdate: (update: CreatorUpdate) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  const visible = FOLLOWED_UPDATES.filter(
    (u) => !dismissed.has(u.id) && !appliedIds.has(u.id),
  );

  if (visible.length === 0) {
    return (
      <div
        className="mx-6 mb-4 flex items-center gap-2.5 px-5 py-3 rounded-xl border border-border/60 bg-muted/30"
        data-ocid="market.updates.empty_state"
      >
        <Bell size={14} className="text-muted-foreground flex-shrink-0" />
        <p className="text-xs text-muted-foreground">
          You're up to date. No new versions from templates you follow.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-6 mb-5" data-ocid="market.updates.section">
      {/* Section header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between gap-3 mb-3 group"
        data-ocid="market.updates.toggle"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2">
          <Sparkles
            size={14}
            className="text-accent flex-shrink-0"
            aria-hidden="true"
          />
          <span className="text-xs font-semibold text-foreground">
            Creator updates
          </span>
          <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold bg-accent text-accent-foreground">
            {visible.length}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
          <span className="sr-only">{expanded ? "Collapse" : "Expand"}</span>
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </div>
      </button>

      {/* Update cards */}
      {expanded && (
        <div className="flex flex-col gap-3">
          {visible.map((update) => (
            <CreatorUpdateCard
              key={update.id}
              update={update}
              onApply={() => {
                setAppliedIds((prev) => new Set([...prev, update.id]));
                onApplyUpdate(update);
              }}
              onDismiss={() =>
                setDismissed((prev) => new Set([...prev, update.id]))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CreatorUpdateCard({
  update,
  onApply,
  onDismiss,
}: {
  update: CreatorUpdate;
  onApply: () => void;
  onDismiss: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      className="rounded-xl border border-border bg-card px-4 py-3.5 flex flex-col gap-2.5"
      data-ocid={`market.update.item.${update.id}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: update.iconColor }}
            aria-hidden="true"
          >
            {update.templateName.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-foreground truncate">
                {update.templateName}
              </span>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">
                <RefreshCw size={8} aria-hidden="true" />v{update.version}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              by {update.creatorName} &middot;{" "}
              {formatUpdateDate(update.releaseDate)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="flex-shrink-0 p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          aria-label={`Dismiss update for ${update.templateName}`}
          data-ocid={`market.update.dismiss_button.${update.id}`}
        >
          <X size={12} />
        </button>
      </div>

      {/* Changelog snippet */}
      <p className="text-sm text-muted-foreground leading-relaxed">
        {update.changelogSnippet}
      </p>

      {/* Expandable detail */}
      {showDetails && (
        <div className="flex flex-col gap-2 pt-1 border-t border-border/60">
          {update.newFeatures.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                New
              </p>
              <ul className="flex flex-col gap-0.5">
                {update.newFeatures.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-1.5 text-xs text-foreground"
                  >
                    <span
                      className="w-1 h-1 rounded-full bg-accent flex-shrink-0"
                      aria-hidden="true"
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {update.fixes.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Fixed
              </p>
              <ul className="flex flex-col gap-0.5">
                {update.fixes.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground"
                  >
                    <span
                      className="w-1 h-1 rounded-full bg-muted-foreground/50 flex-shrink-0"
                      aria-hidden="true"
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Actions row */}
      <div className="flex items-center gap-2 pt-0.5">
        <button
          type="button"
          onClick={onApply}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
          data-ocid={`market.update.apply_button.${update.id}`}
        >
          <ArrowRight size={11} aria-hidden="true" />
          Apply update
        </button>
        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          data-ocid={`market.update.details_toggle.${update.id}`}
        >
          {showDetails ? (
            <>
              <ChevronUp size={11} aria-hidden="true" /> Less
            </>
          ) : (
            <>
              <ChevronDown size={11} aria-hidden="true" /> What's changed
            </>
          )}
        </button>
      </div>
    </div>
  );
}

const TAG_LABELS: Record<MarketAppTag, string> = {
  original: "Original",
  template: "Template",
  "white-label": "White-label",
  cloned: "Cloned",
};

// TagBadge now uses AppBadge for consistent token-based styling
function TagBadge({ tag }: { tag: MarketAppTag }) {
  const variantMap: Record<
    MarketAppTag,
    "original" | "template" | "white-label" | "cloned"
  > = {
    original: "original",
    template: "template",
    "white-label": "white-label",
    cloned: "cloned",
  };
  return (
    <AppBadge variant={variantMap[tag]} size="sm">
      {TAG_LABELS[tag]}
    </AppBadge>
  );
}

function sortApps(apps: MarketApp[], sort: SortOption): MarketApp[] {
  return [...apps].sort((a, b) => {
    if (sort === "popular") return b.cloneCount - a.cloneCount;
    if (sort === "newest")
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    return a.name.localeCompare(b.name);
  });
}

function _formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

// ──────────────────────────────
// Inline Preview Panel (below grid)
// ──────────────────────────────
function MarketPreviewPanel({
  app,
  onClose,
  onClone,
}: {
  app: MarketApp;
  onClose: () => void;
  onClone: () => void;
}) {
  return (
    <div
      className="mx-6 mb-4 rounded-xl border border-border bg-card p-5 flex gap-6 items-start"
      data-ocid="market.preview.panel"
    >
      {/* Wireframe mock */}
      <div
        className="flex-shrink-0 w-64 rounded-lg bg-muted/60 border border-border overflow-hidden"
        style={{ aspectRatio: "16/9" }}
        aria-hidden="true"
      >
        <div className="flex flex-col h-full p-3 gap-2">
          {/* Simulated header bar */}
          <div className="h-3 rounded bg-muted-foreground/20 w-1/2" />
          {/* Simulated rows */}
          {["3/4", "full", "2/3", "5/6"].map((w) => (
            <div
              key={w}
              className={`h-2 rounded bg-muted-foreground/15 w-${w}`}
            />
          ))}
          {/* Simulated card blocks */}
          <div className="flex gap-2 mt-1">
            <div className="flex-1 h-10 rounded-md bg-muted-foreground/10 border border-muted-foreground/10" />
            <div className="flex-1 h-10 rounded-md bg-muted-foreground/10 border border-muted-foreground/10" />
            <div className="flex-1 h-10 rounded-md bg-muted-foreground/10 border border-muted-foreground/10" />
          </div>
        </div>
      </div>

      {/* App info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="text-sm font-bold text-foreground">{app.name}</p>
            <p className="text-xs text-muted-foreground">by {app.author}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex-shrink-0"
            aria-label="Close preview"
            data-ocid="market.preview.close_button"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {app.tags.map((t) => (
            <TagBadge key={t} tag={t} />
          ))}
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
          {app.description}
        </p>

        {/* Signals */}
        <div className="flex items-center gap-4 mb-4">
          <span className="flex items-center gap-1 text-xs font-semibold text-foreground">
            <Star
              size={12}
              className="text-[color:oklch(var(--color-amber))]"
              fill="currentColor"
            />
            {app.rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users size={12} />
            Used by {app.usedByCount.toLocaleString()} teams
          </span>
        </div>

        <button
          type="button"
          onClick={onClone}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150 bg-accent text-accent-foreground hover:opacity-90"
          data-ocid="market.preview.clone_button"
        >
          <GitFork size={14} />
          Clone this app
        </button>
      </div>
    </div>
  );
}
// ──────────────────────────────
// Market App Detail Full-Screen View
// ──────────────────────────────
function MarketDetailScreen({
  app,
  onClose,
}: {
  app: MarketApp;
  onClose: () => void;
}) {
  const startSpecialization = useAppStore((s) => s.startSpecialization);
  const setMode = useAppStore((s) => s.setMode);
  const navigate = useNavigate();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleClone() {
    startSpecialization(app);
    setMode("market");
    navigate({ to: "/market/specialize" });
  }

  return (
    <div
      className="flex flex-col h-full min-h-0"
      data-mode="market"
      data-ocid="market.detail_page"
    >
      <BreadcrumbHeader
        onBack={onClose}
        backLabel="App Market"
        title={app.name}
        subtitle={`by ${app.author}`}
        data-ocid="market.detail.breadcrumb"
        action={
          <div className="flex flex-wrap gap-1">
            {app.tags.map((t) => (
              <TagBadge key={t} tag={t} />
            ))}
          </div>
        }
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="grid grid-cols-3 gap-8">
            {/* Left: app preview mock + signals */}
            <div className="col-span-1 flex flex-col gap-6">
              {/* Wireframe preview */}
              <div
                className="rounded-xl bg-muted/60 border border-border overflow-hidden"
                style={{ aspectRatio: "4/3" }}
                aria-hidden="true"
              >
                <div className="flex flex-col h-full p-4 gap-3">
                  <div className="h-3 rounded bg-muted-foreground/20 w-1/2" />
                  {["3/4", "full", "2/3", "5/6"].map((w) => (
                    <div
                      key={w}
                      className={`h-2 rounded bg-muted-foreground/15 w-${w}`}
                    />
                  ))}
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className="flex-1 h-12 rounded-lg bg-muted-foreground/10 border border-muted-foreground/10"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Signals */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Star
                    size={14}
                    className="text-[color:oklch(var(--color-amber))] flex-shrink-0"
                    fill="currentColor"
                  />
                  <span className="font-semibold text-foreground">
                    {app.rating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">rating</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users size={14} className="flex-shrink-0" />
                  Used by{" "}
                  <span className="font-medium text-foreground">
                    {app.usedByCount.toLocaleString()}
                  </span>{" "}
                  teams
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GitFork size={14} className="flex-shrink-0" />
                  <span className="font-medium text-foreground">
                    {app.cloneCount.toLocaleString()}
                  </span>{" "}
                  clones
                </div>
              </div>

              {/* CTA */}
              <button
                type="button"
                onClick={handleClone}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-150 bg-accent text-accent-foreground hover:opacity-90 shadow-sm"
                data-ocid="market.detail.clone_button"
              >
                <GitFork size={15} />
                Clone this app
              </button>
            </div>

            {/* Right: app info */}
            <div className="col-span-2 flex flex-col gap-6">
              <section>
                <p className="text-base text-foreground/80 leading-relaxed">
                  {app.description}
                </p>
              </section>

              <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Details
                </p>
                <div className="space-y-2">
                  <Row label="Category" value={app.category} />
                  <Row label="Audience" value={app.audience} />
                  <Row label="Vibe" value={app.vibe} />
                  <Row label="Colour direction" value={app.colorDirection} />
                </div>
              </section>

              <section>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Features
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {app.features.map((f) => (
                    <Chip key={f} label={f} />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-xs-plus text-muted-foreground shrink-0">
        {label}
      </span>
      <span className="text-sm-minus text-foreground text-right">{value}</span>
    </div>
  );
}

// ──────────────────────────────
// Market App Card
// ──────────────────────────────
function MarketCard({
  app,
  index,
  isSelected,
  onClick,
  onPreview,
}: {
  app: MarketApp;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onPreview: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const showActions = hovered || isSelected;

  return (
    <button
      type="button"
      className={cn(
        "relative flex flex-col rounded-xl cursor-pointer select-none text-left w-full focus-ring",
        "bg-card transition-all duration-200 group",
        "h-[220px]",
        isSelected
          ? "border-2 border-accent shadow-card bg-accent/5"
          : "border border-border hover:border-accent/50 hover:shadow-card",
        "shadow-card",
      )}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-ocid={`market.app.item.${index}`}
    >
      {/* Badge — top-left corner */}
      <div className="absolute top-3 left-3 z-10">
        {app.tags.map((t) => (
          <TagBadge key={t} tag={t} />
        ))}
      </div>

      {/* Card header: icon + name + author */}
      <div className="flex items-center gap-3 px-4 pt-10 pb-2">
        <div
          className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-accent-foreground text-base font-bold shadow-sm"
          style={{ backgroundColor: app.iconColor }}
          aria-hidden="true"
        >
          {app.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-foreground truncate leading-tight">
            {app.name}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            by {app.author}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground px-4 pb-2 line-clamp-2 leading-relaxed flex-1">
        {app.description}
      </p>

      {/* Divider */}
      <div className="mx-4 h-px bg-border/60" />

      {/* Stats row */}
      <div className="flex items-center gap-4 px-4 py-3">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Star
            size={12}
            className="text-[color:oklch(var(--color-amber))]"
            fill="currentColor"
          />
          {app.rating.toFixed(1)}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users size={12} />
          {app.usedByCount.toLocaleString()} teams
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <GitFork size={12} />
          {app.cloneCount.toLocaleString()}
        </span>
      </div>

      {/* Hover-reveal CTA strip */}
      <div
        className={cn(
          "border-t border-border/60 flex gap-2 px-4 py-3 transition-all duration-200",
          showActions
            ? "opacity-100"
            : "opacity-0 h-0 overflow-hidden border-transparent py-0",
        )}
        aria-hidden={!showActions}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPreview();
          }}
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-muted/60 border border-border text-foreground text-xs font-semibold px-3 py-2 rounded-lg hover:bg-muted transition-colors"
          data-ocid={`market.app.preview_button.${index}`}
        >
          Preview
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-accent text-accent-foreground text-xs font-semibold px-3 py-2 rounded-lg hover:opacity-90 transition-all duration-150"
          data-ocid={`market.app.clone_button.${index}`}
        >
          <GitFork size={11} />
          Clone
        </button>
      </div>
    </button>
  );
}

// ──────────────────────────────
// MarketPage
// ──────────────────────────────
export function MarketPage() {
  const [search, setSearch] = useState("");
  const [activeGoal, setActiveGoal] = useState<GoalCategory>("all");
  const [sort, setSort] = useState<SortOption>("popular");
  const [selectedApp, setSelectedApp] = useState<MarketApp | null>(null);
  const [previewApp, setPreviewApp] = useState<MarketApp | null>(null);
  const startSpecialization = useAppStore((s) => s.startSpecialization);
  const setMode = useAppStore((s) => s.setMode);
  const navigate = useNavigate();

  function handleApplyUpdate(update: CreatorUpdate) {
    // Mark the cloned project as up to date (simulated)
    console.info("Applied update", update.id, update.version);
  }

  function handleClone(app: MarketApp) {
    startSpecialization(app);
    setMode("market");
    navigate({ to: "/market/specialize" });
  }

  const filtered = MARKET_APPS.filter((app) => {
    const matchGoal = matchesGoalCategory(app, activeGoal);
    const q = search.toLowerCase();
    const matchSearch =
      q === "" ||
      app.name.toLowerCase().includes(q) ||
      app.description.toLowerCase().includes(q) ||
      app.author.toLowerCase().includes(q);
    return matchGoal && matchSearch;
  });

  const sorted = sortApps(filtered, sort);

  // ── When an app is selected, show the full-screen detail view ──
  if (selectedApp) {
    return (
      <ErrorBoundary fallbackLabel="Market">
        <PageWrapper noPadding scrollable={false}>
          <MarketDetailScreen
            app={selectedApp}
            onClose={() => setSelectedApp(null)}
          />
        </PageWrapper>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary fallbackLabel="Market">
      <PageWrapper
        noPadding
        scrollable={false}
        header={
          <ModeHeader
            title="Market"
            subtitle="Discover and clone app templates"
            data-ocid="market.header"
          />
        }
      >
        {/* Secondary filter bar */}
        <div
          className="flex-shrink-0 border-b border-border bg-card px-6 py-4"
          data-ocid="market.filter_bar"
        >
          <div className="relative mb-3">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search apps…"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all"
              data-ocid="market.search_input"
            />
          </div>
          <div className="flex items-center justify-between gap-3 min-h-9">
            <div className="flex flex-wrap items-center gap-2">
              {GOAL_CATEGORIES.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setActiveGoal(f.value)}
                  className={cn(
                    "text-sm px-3 py-1.5 rounded-full border font-medium transition-all duration-150 focus-ring whitespace-nowrap",
                    activeGoal === f.value
                      ? "border-accent/60 text-accent bg-accent/12 shadow-sm"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-accent/40 hover:bg-accent/8",
                  )}
                  data-ocid={`market.filter.${f.value}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <SlidersHorizontal size={14} className="text-muted-foreground" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="text-sm bg-background border border-border rounded-lg px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 cursor-pointer"
                data-ocid="market.sort_select"
              >
                <option value="popular">Popular</option>
                <option value="newest">Newest</option>
                <option value="az">A – Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Scrollable grid area */}
        <div className="flex-1 overflow-y-auto bg-background">
          <div className="pt-6 pb-0">
            <CreatorUpdatesSection onApplyUpdate={handleApplyUpdate} />
          </div>
          <div className="px-6 pb-6">
            {sorted.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-24 text-center"
                data-ocid="market.empty_state"
              >
                <Search size={40} className="text-muted-foreground/30 mb-4" />
                <p className="text-base font-semibold text-foreground mb-1">
                  No apps match your filters
                </p>
                <p className="text-sm text-muted-foreground">
                  Try a different search or clear the filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-6">
                {sorted.map((app, i) => (
                  <MarketCard
                    key={app.id}
                    app={app}
                    index={i + 1}
                    isSelected={false}
                    onClick={() => setSelectedApp(app)}
                    onPreview={() =>
                      setPreviewApp((prev) =>
                        prev?.id === app.id ? null : app,
                      )
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Inline preview panel */}
          {previewApp && (
            <MarketPreviewPanel
              app={previewApp}
              onClose={() => setPreviewApp(null)}
              onClone={() => handleClone(previewApp)}
            />
          )}
        </div>
      </PageWrapper>
    </ErrorBoundary>
  );
}
