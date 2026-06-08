import type { MarketApp, Project, SpecSection } from "@/types";
import { AppCategory, BuilderMode, SortBy } from "@/types";

const now = BigInt(Date.now());
const day = BigInt(86400000);

function makeSection(heading: string, content: string): SpecSection {
  return { heading, content };
}

export const SAMPLE_PROJECTS: Project[] = [
  {
    id: "sample-1",
    name: "ClearPath Practice",
    icon: "Stethoscope",
    iconColor: "oklch(0.64 0.09 185)",
    category: AppCategory.dashboard,
    deploymentStatus: "live" as const,
    createdAt: now - day * BigInt(30),
    updatedAt: now - day * BigInt(2),
    answers: "{}",
    metadata: {
      maturity: "live" as const,
      tags: ["healthcare", "patients"],
      builderMode: BuilderMode.guided,
      priority: "high" as const,
      attentionFlag: false,
    },
    burnRate: 340,
    burnRateBaseline: 320,
    burnRateStatus: "normal" as const,
    specSections: [
      makeSection(
        "Overview",
        "ClearPath Practice is a patient management dashboard for independent clinics. It provides appointment scheduling, patient records, and billing management in a clean, focused interface designed for busy medical professionals.",
      ),
      makeSection(
        "Key Features",
        "Patient registry with history and notes, appointment calendar with conflict detection, automated billing and invoice generation, and a daily summary dashboard for practitioners.",
      ),
      makeSection(
        "Design System",
        "Calm and clinical aesthetic with a white background, teal accents, and dense information layouts. Inter font throughout. Clear hierarchy from appointment status badges to patient priority indicators.",
      ),
    ],
    versionHistory: [
      {
        version: "1.2",
        timestamp: now - day * BigInt(5),
        changeSummary: "Added billing module spec",
        specSnapshot: "",
      },
      {
        version: "1.0",
        timestamp: now - day * BigInt(20),
        changeSummary: "Initial specification",
        specSnapshot: "",
      },
    ],
    isSample: true,
  } as Project,
  {
    id: "sample-2",
    name: "Community Hub",
    icon: "Users",
    iconColor: "oklch(0.55 0.14 280)",
    category: AppCategory.social,
    deploymentStatus: "live" as const,
    createdAt: now - day * BigInt(45),
    updatedAt: now - day * BigInt(1),
    answers: "{}",
    metadata: {
      maturity: "live" as const,
      tags: ["community", "social", "cloned"],
      builderMode: BuilderMode.guided,
      priority: "medium" as const,
      attentionFlag: true,
    },
    burnRate: 520,
    burnRateBaseline: 480,
    burnRateStatus: "elevated" as const,
    specSections: [
      makeSection(
        "Overview",
        "Community Hub is a neighbourhood platform for local groups to organise events, share resources, and communicate. Built for city councils and community organisations who want to replace fragmented email chains.",
      ),
      makeSection(
        "Key Features",
        "Event calendar with RSVP, community message board, resource library with lending, member directory, and announcements from administrators.",
      ),
    ],
    versionHistory: [
      {
        version: "2.1",
        timestamp: now - day * BigInt(3),
        changeSummary: "Resource library section added",
        specSnapshot: "",
      },
    ],
    isSample: true,
    creatorUpdateAvailable: true,
    lastCreatorUpdate: Number(now - day * BigInt(30)),
    updateConflict: true,
    pendingUpdate: {
      version: "2.1.0",
      timestamp: Number(now - day * BigInt(2)),
      changeSummary:
        "- Added real-time notifications for new posts\n- Improved member directory search\n- Fixed RSVP duplication bug",
      newFeatures: ["Real-time notifications", "Member directory search"],
      changedSections: ["Event calendar", "Member directory"],
      fixes: ["RSVP duplication bug"],
    },
  } as Project,
  {
    id: "sample-3",
    name: "VaultEx Records",
    icon: "Lock",
    iconColor: "oklch(0.70 0.10 55)",
    category: AppCategory.contentCms,
    deploymentStatus: "notDeployed" as const,
    createdAt: now - day * BigInt(14),
    updatedAt: now - day * BigInt(3),
    answers: "{}",
    metadata: {
      maturity: "building" as const,
      tags: ["records", "compliance"],
      builderMode: BuilderMode.standard,
      priority: "high" as const,
      attentionFlag: false,
    },
    specSections: [
      makeSection(
        "Overview",
        "VaultEx Records is a secure document vault for regulated industries. It manages document lifecycle, access controls, audit trails, and retention policies for legal and financial records.",
      ),
      makeSection(
        "Compliance",
        "All document access is logged immutably. Retention policies are defined per document type. Role-based access with two-person integrity rules for critical records.",
      ),
    ],
    versionHistory: [],
    isSample: true,
  } as Project,
  {
    id: "sample-4",
    name: "TaskFlow Pro",
    icon: "CheckSquare",
    iconColor: "oklch(0.62 0.08 220)",
    category: AppCategory.tracker,
    deploymentStatus: "notDeployed" as const,
    createdAt: now - day * BigInt(7),
    updatedAt: now - day * BigInt(7),
    answers: "{}",
    metadata: {
      maturity: "defining" as const,
      tags: ["productivity", "tasks"],
      builderMode: BuilderMode.feel,
      attentionFlag: false,
    },
    specSections: [
      makeSection(
        "Overview",
        "TaskFlow Pro is a focused personal task manager for makers who want calm, distraction-free daily planning with minimal setup and no subscriptions.",
      ),
    ],
    versionHistory: [],
    isSample: true,
  } as Project,
  {
    id: "sample-5",
    name: "BookEase",
    icon: "CalendarCheck",
    iconColor: "oklch(0.70 0.10 55)",
    category: AppCategory.booking,
    deploymentStatus: "notDeployed" as const,
    createdAt: now - day * BigInt(10),
    updatedAt: now - day * BigInt(6),
    answers: "{}",
    metadata: {
      maturity: "exploring" as const,
      tags: ["booking", "appointments"],
      builderMode: BuilderMode.guided,
      attentionFlag: false,
    },
    specSections: [
      makeSection(
        "Overview",
        "BookEase is a straightforward appointment booking system for independent service providers — therapists, coaches, and consultants who need reliable scheduling without the bloat.",
      ),
    ],
    versionHistory: [],
    isSample: true,
  } as Project,
  {
    id: "sample-6",
    name: "LessonPad",
    icon: "BookOpen",
    iconColor: "oklch(0.68 0.13 150)",
    category: AppCategory.other,
    deploymentStatus: "notDeployed" as const,
    createdAt: now - day * BigInt(3),
    updatedAt: now - day * BigInt(3),
    answers: "{}",
    metadata: {
      maturity: "idea" as const,
      tags: ["education", "lessons"],
      builderMode: BuilderMode.guided,
      attentionFlag: false,
    },
    specSections: [
      makeSection(
        "Overview",
        "LessonPad is an adaptive learning platform for educators and adult learners. It offers personalised learning paths, progress tracking, and structured course content with spaced repetition reminders.",
      ),
    ],
    versionHistory: [],
    isSample: true,
  } as Project,
];

export const MARKET_APPS: MarketApp[] = [
  // --- Original apps (built from scratch by real users) ---
  {
    id: "market-1",
    name: "Taskflow",
    author: "Mia Thornton",
    description:
      "A focused personal task manager for makers who want calm, distraction-free daily planning with minimal setup and no subscriptions.",
    tags: ["original"],
    category: "Tracker",
    features: [
      "Daily focus view",
      "Recurring tasks",
      "Priority labels",
      "Quick capture",
      "Weekly review",
    ],
    colorDirection: "Calm Blue",
    vibe: "Calm / Minimal",
    audience: "Solo makers & indie workers",
    icon: "CheckSquare",
    iconColor: "oklch(0.62 0.08 220)",
    cloneCount: 148,
    publishedAt: "2024-09-12",
    rating: 4.6,
    usedByCount: 142,
    lastUpdated: Date.now() - 7 * 86400000,
    updateFrequency: "Weekly",
  },
  {
    id: "market-2",
    name: "BookEase",
    author: "James Okafor",
    description:
      "A straightforward appointment booking system for independent service providers — therapists, coaches, and consultants who need reliable scheduling without the bloat.",
    tags: ["original"],
    category: "Booking",
    features: [
      "Calendar availability",
      "Client self-booking",
      "Automated reminders",
      "Buffer time rules",
      "Service types & durations",
      "Missed appointment tracking",
    ],
    colorDirection: "Warm Amber",
    vibe: "Warm / Friendly",
    audience: "Independent service professionals",
    icon: "CalendarCheck",
    iconColor: "oklch(0.70 0.10 55)",
    cloneCount: 312,
    publishedAt: "2024-11-03",
    rating: 4.8,
    usedByCount: 298,
    lastUpdated: Date.now() - 14 * 86400000,
    updateFrequency: "Monthly",
  },
  // --- Template apps (starting points that need specialization) ---
  {
    id: "market-3",
    name: "ContentBase",
    author: "Caffeine Templates",
    description:
      "A clean CMS template for editorial teams and independent publishers. Covers content pipeline, asset management, and scheduled publishing — ready to specialise for your niche.",
    tags: ["template"],
    category: "Content / CMS",
    features: [
      "Content pipeline & drafts",
      "Asset library",
      "Scheduled publishing",
      "Category organisation",
      "Author management",
    ],
    colorDirection: "Soft Slate",
    vibe: "Serious / Professional",
    audience: "Editorial teams & independent publishers",
    icon: "FileText",
    iconColor: "oklch(0.58 0.06 255)",
    cloneCount: 521,
    publishedAt: "2024-07-18",
    rating: 4.5,
    usedByCount: 487,
    lastUpdated: Date.now() - 30 * 86400000,
    updateFrequency: "Monthly",
  },
  {
    id: "market-4",
    name: "MarketLaunch",
    author: "Caffeine Templates",
    description:
      "A two-sided marketplace template covering listings, search, checkout, and seller dashboards. Specialise the category — physical goods, services, digital products — and it's ready to spec.",
    tags: ["template"],
    category: "Marketplace",
    features: [
      "Buyer & seller accounts",
      "Listing management",
      "Search & filters",
      "Checkout flow",
      "Seller dashboard & payouts",
      "Review & rating system",
    ],
    colorDirection: "Bold Indigo",
    vibe: "Bold / Energetic",
    audience: "Platform builders",
    icon: "ShoppingBag",
    iconColor: "oklch(0.55 0.14 280)",
    cloneCount: 874,
    publishedAt: "2024-06-01",
    rating: 4.9,
    usedByCount: 821,
    lastUpdated: Date.now() - 3 * 86400000,
    updateFrequency: "Weekly",
  },
  {
    id: "market-5",
    name: "CircleSpace",
    author: "Caffeine Templates",
    description:
      "A community platform template for clubs, neighbourhoods, and interest groups. Covers events, forums, member directory, and moderation — specialise the name, audience, and features.",
    tags: ["template"],
    category: "Community",
    features: [
      "Event calendar & RSVP",
      "Discussion boards",
      "Member directory",
      "Announcements",
      "Community management",
    ],
    colorDirection: "Muted Teal",
    vibe: "Warm / Friendly",
    audience: "Community organisers",
    icon: "Users",
    iconColor: "oklch(0.64 0.09 185)",
    cloneCount: 396,
    publishedAt: "2024-08-22",
    rating: 4.4,
    usedByCount: 361,
    lastUpdated: Date.now() - 60 * 86400000,
    updateFrequency: "Quarterly",
  },
  // --- White-label apps (fully specced shells for resellers and agencies) ---
  {
    id: "market-6",
    name: "SaaS Shell",
    author: "Caffeine Templates",
    description:
      "A fully specced multi-tenant SaaS dashboard shell — auth, org management, billing, and settings already defined. Drop in your core feature and the scaffolding is done.",
    tags: ["white-label"],
    category: "Dashboard",
    features: [
      "Multiple organisations",
      "Different access levels",
      "Billing & plan management",
      "Settings & profile",
      "Notification centre",
      "Usage insights",
    ],
    colorDirection: "Deep Charcoal",
    vibe: "Serious / Professional",
    audience: "SaaS builders & agencies",
    icon: "LayoutDashboard",
    iconColor: "oklch(0.45 0.04 270)",
    cloneCount: 1203,
    publishedAt: "2024-05-14",
    rating: 4.9,
    usedByCount: 1087,
    lastUpdated: Date.now() - 90 * 86400000,
    updateFrequency: "Quarterly",
  },
  {
    id: "market-7",
    name: "ClientPortal",
    author: "Caffeine Templates",
    description:
      "A white-label client portal for agencies and consultancies. Covers project status, file sharing, invoices, and messaging — brand it as your own and hand it to your clients.",
    tags: ["white-label"],
    category: "Internal Tool",
    features: [
      "Project status board",
      "File sharing & approvals",
      "Invoice & payment tracking",
      "Client messaging",
      "Milestone tracker",
    ],
    colorDirection: "Warm Sand",
    vibe: "Calm / Minimal",
    audience: "Agencies & consultancies",
    icon: "Briefcase",
    iconColor: "oklch(0.68 0.07 70)",
    cloneCount: 689,
    publishedAt: "2024-10-05",
    rating: 4.7,
    usedByCount: 634,
    lastUpdated: Date.now() - 21 * 86400000,
    updateFrequency: "Monthly",
  },
  // --- Cloned app (derived from a template, republished by another user) ---
  {
    id: "market-8",
    name: "StudyCircle",
    author: "priya.dev",
    description:
      "A study-group community platform cloned from CircleSpace and specialised for student cohorts — forums, study sessions, resource library, and peer accountability tracking.",
    tags: ["cloned"],
    category: "Community",
    features: [
      "Study session scheduling",
      "Discussion boards",
      "Resource library",
      "Study partner matching",
      "Progress check-ins",
    ],
    colorDirection: "Muted Teal",
    vibe: "Warm / Friendly",
    audience: "Student cohorts & study groups",
    icon: "GraduationCap",
    iconColor: "oklch(0.60 0.10 175)",
    cloneCount: 44,
    publishedAt: "2025-01-08",
    rating: 3.9,
    usedByCount: 37,
    lastUpdated: Date.now() - 45 * 86400000,
    updateFrequency: "Monthly",
  },
];

export function getSortedProjects(
  projects: Project[],
  sortBy: SortBy | "burn-rate",
): Project[] {
  return [...projects].sort((a, b) => {
    switch (sortBy) {
      case SortBy.name:
        return a.name.localeCompare(b.name);
      case SortBy.createdAt:
        return Number(b.createdAt - a.createdAt);
      case SortBy.priority: {
        const order = { high: 0, medium: 1, low: 2, undefined: 3 };
        return (
          (order[a.metadata.priority ?? "undefined"] ?? 3) -
          (order[b.metadata.priority ?? "undefined"] ?? 3)
        );
      }
      case "burn-rate": {
        const aLive =
          a.metadata.maturity === "live" || a.deploymentStatus === "live";
        const bLive =
          b.metadata.maturity === "live" || b.deploymentStatus === "live";
        if (aLive && bLive) return (b.burnRate ?? 0) - (a.burnRate ?? 0);
        if (aLive) return -1;
        if (bLive) return 1;
        return 0;
      }
      default:
        return Number(b.updatedAt - a.updatedAt);
    }
  });
}
