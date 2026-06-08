import type { DesignFlowAnswers } from "@/types";
import {
  Activity,
  AlignCenter,
  AlignJustify,
  AlignLeft,
  BarChart3,
  BookOpen,
  Bookmark,
  Briefcase,
  Building2,
  Calendar,
  CalendarDays,
  Check,
  ChevronRight,
  Circle,
  Code2,
  CreditCard,
  Database,
  File,
  FileText,
  Filter,
  Globe,
  Heart,
  Image,
  Layers,
  LayoutDashboard,
  LogIn,
  Mail,
  Map as MapIcon,
  MessageSquare,
  Monitor,
  MousePointer2,
  MousePointerClick,
  Package,
  PanelLeft,
  PenLine,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Square,
  Star,
  Store,
  Trophy,
  Type,
  User,
  Users,
  Users2,
  Wifi,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ChoiceOption {
  id: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  /** For palette/color steps — array of hex colors to display as swatches */
  colors?: string[];
  /** For preview mockup steps — a render hint string */
  previewHint?: string;
  /** Whether this option should be pre-selected for a given seed */
  seedDefault?: boolean;
}

export interface FlowStep {
  id: string;
  phase: number;
  phaseName: string;
  stepNumber: number;
  question: string;
  hint?: string;
  multiSelect?: boolean;
  /** Which field in DesignFlowAnswers this step writes to */
  answerKey: string;
  options: ChoiceOption[];
  /** For steps whose options are filtered by a prior answer */
  dependsOn?: { key: string; values: Record<string, ChoiceOption[]> };
  /** If present, the step is only shown when this evaluates to true */
  showWhen?: (answers: Partial<DesignFlowAnswers>) => boolean;
}

// ─── Phase 1: What are you making? ───────────────────────────────────────────

const STEP_1: FlowStep = {
  id: "appType",
  phase: 1,
  phaseName: "What are you making?",
  stepNumber: 1,
  question: "What kind of app are you making?",
  hint: "Choose the category that best fits your idea — this shapes every step that follows.",
  answerKey: "appType",
  options: [
    {
      id: "dashboard",
      label: "Dashboard / Tool",
      description: "Data, metrics, and controls in one view",
      icon: LayoutDashboard,
    },
    {
      id: "marketplace",
      label: "Marketplace",
      description: "Buyers and sellers transacting on your platform",
      icon: Store,
    },
    {
      id: "social",
      label: "Social / Community",
      description: "People connecting, sharing, and interacting",
      icon: Users,
    },
    {
      id: "contentCms",
      label: "Content / CMS",
      description: "Publishing, managing, and distributing content",
      icon: FileText,
    },
    {
      id: "booking",
      label: "Booking / Scheduling",
      description: "Reservations, appointments, and calendars",
      icon: Calendar,
    },
    {
      id: "tracker",
      label: "Tracker / Logger",
      description: "Recording progress, habits, or metrics over time",
      icon: Activity,
    },
    {
      id: "clubManager",
      label: "Club / Team Manager",
      description: "Organising groups, fixtures, and memberships",
      icon: Trophy,
    },
    {
      id: "internalTool",
      label: "Internal Tool",
      description: "Tools for your team's internal workflows",
      icon: Building2,
    },
  ],
};

const STEP_2: FlowStep = {
  id: "audience",
  phase: 1,
  phaseName: "What are you making?",
  stepNumber: 2,
  question: "Who is this app for?",
  hint: "Who are the primary people using this app day-to-day?",
  multiSelect: true,
  answerKey: "audience",
  options: [
    {
      id: "consumers",
      label: "Consumers",
      description: "General public, everyday users",
      icon: Heart,
    },
    {
      id: "businesses",
      label: "Businesses",
      description: "Companies, teams, and B2B customers",
      icon: Briefcase,
    },
    {
      id: "internalTeam",
      label: "Internal Team",
      description: "People inside your own organisation",
      icon: Users2,
    },
    {
      id: "community",
      label: "A Community",
      description: "Interest groups, clubs, or online communities",
      icon: Globe,
    },
    {
      id: "myself",
      label: "Just Myself",
      description: "Personal productivity or solo use",
      icon: User,
    },
  ],
};

const STEP_3_OPTIONS_BY_TYPE: Record<string, ChoiceOption[]> = {
  dashboard: [
    {
      id: "analytics",
      label: "Analytics Dashboard",
      description: "Charts, KPIs, and data visualisation at a glance",
      icon: BarChart3,
    },
    {
      id: "adminPanel",
      label: "Admin Panel",
      description: "System management, user control, and configuration",
      icon: Settings,
    },
    {
      id: "dataExplorer",
      label: "Data Explorer",
      description: "Query, filter, and inspect raw data",
      icon: Database,
    },
    {
      id: "operationsTool",
      label: "Operations Tool",
      description: "Day-to-day workflow and task management",
      icon: RefreshCw,
    },
  ],
  marketplace: [
    {
      id: "productMarket",
      label: "Product Marketplace",
      description: "Physical or digital goods sold between users",
      icon: Package,
    },
    {
      id: "serviceMarket",
      label: "Service Marketplace",
      description: "Freelancers and service providers connecting with clients",
      icon: Star,
    },
    {
      id: "rentalMarket",
      label: "Rental / Sharing",
      description: "Items or spaces rented peer-to-peer",
      icon: Share2,
    },
    {
      id: "bidding",
      label: "Auction / Bidding",
      description: "Competitive bidding on items or contracts",
      icon: Zap,
    },
  ],
  social: [
    {
      id: "socialNetwork",
      label: "Social Network",
      description: "Profiles, followers, feeds and sharing",
      icon: Users,
    },
    {
      id: "forum",
      label: "Forum / Discussion",
      description: "Threaded discussions and community Q&A",
      icon: MessageSquare,
    },
    {
      id: "events",
      label: "Events Platform",
      description: "Event discovery, RSVP, and community gathering",
      icon: CalendarDays,
    },
    {
      id: "groups",
      label: "Groups & Clubs",
      description: "Private or public groups with membership",
      icon: Globe,
    },
  ],
  contentCms: [
    {
      id: "blog",
      label: "Blog / Publication",
      description: "Articles, posts, and editorial content",
      icon: PenLine,
    },
    {
      id: "knowledgeBase",
      label: "Knowledge Base",
      description: "Docs, how-tos, and reference material",
      icon: BookOpen,
    },
    {
      id: "mediaLibrary",
      label: "Media Library",
      description: "Photos, videos, and asset management",
      icon: Image,
    },
    {
      id: "newsletter",
      label: "Newsletter / Email",
      description: "Subscriber lists and sent email archives",
      icon: Mail,
    },
  ],
  booking: [
    {
      id: "appointments",
      label: "Appointment Booking",
      description: "1-on-1 scheduling with professionals",
      icon: Calendar,
    },
    {
      id: "classBooking",
      label: "Class / Event Booking",
      description: "Multi-person sessions and group reservations",
      icon: Users,
    },
    {
      id: "roomBooking",
      label: "Space / Resource Booking",
      description: "Rooms, equipment, or facilities",
      icon: MapIcon,
    },
    {
      id: "tableBooking",
      label: "Restaurant / Venue",
      description: "Table reservations and hospitality",
      icon: Star,
    },
  ],
  tracker: [
    {
      id: "habitTracker",
      label: "Habit Tracker",
      description: "Daily routines, streaks, and consistency",
      icon: Check,
    },
    {
      id: "fitnessTracker",
      label: "Fitness / Health Log",
      description: "Workouts, nutrition, and body metrics",
      icon: Activity,
    },
    {
      id: "projectTracker",
      label: "Project / Goal Tracker",
      description: "Milestones, tasks, and progress toward goals",
      icon: BarChart3,
    },
    {
      id: "expenseTracker",
      label: "Expense / Finance Log",
      description: "Spending, income, and budget tracking",
      icon: CreditCard,
    },
  ],
  clubManager: [
    {
      id: "sportsClub",
      label: "Sports Club",
      description: "Fixtures, squads, results, and training",
      icon: Trophy,
    },
    {
      id: "hobbyGroup",
      label: "Hobby / Interest Group",
      description: "Meet-ups, shared projects, and resources",
      icon: Globe,
    },
    {
      id: "professionalAssoc",
      label: "Professional Association",
      description: "Membership, events, and networking",
      icon: Briefcase,
    },
    {
      id: "schoolClub",
      label: "School / Youth Club",
      description: "Attendance, activities, and parent comms",
      icon: BookOpen,
    },
  ],
  internalTool: [
    {
      id: "hrTool",
      label: "HR / People Tool",
      description: "Onboarding, leave, and people data",
      icon: Users2,
    },
    {
      id: "crmTool",
      label: "CRM / Sales Tool",
      description: "Leads, contacts, and pipeline tracking",
      icon: Briefcase,
    },
    {
      id: "supportTool",
      label: "Support / Helpdesk",
      description: "Tickets, queues, and customer issues",
      icon: MessageSquare,
    },
    {
      id: "inventoryTool",
      label: "Inventory / Asset Tool",
      description: "Stock, equipment, and asset tracking",
      icon: Package,
    },
  ],
};

const STEP_3: FlowStep = {
  id: "closestExample",
  phase: 1,
  phaseName: "What are you making?",
  stepNumber: 3,
  question: "Which of these is most like what you have in mind?",
  hint: "Pick the closest match — this anchors the feature suggestions in later steps.",
  answerKey: "closestExample",
  dependsOn: { key: "appType", values: STEP_3_OPTIONS_BY_TYPE },
  options: STEP_3_OPTIONS_BY_TYPE.dashboard, // fallback; DesignFlow will override from context
};

// ─── Phase 2: The Feel ────────────────────────────────────────────────────────

// Vibe options by audience — consumers/community get friendly vibes first,
// professionals/enterprise get serious/calm vibes first.
// All options remain available; ordering/seedDefault is audience-aware.
const VIBE_OPTIONS_DEFAULT: ChoiceOption[] = [
  {
    id: "calm",
    label: "Calm / Minimal",
    description: "Clean white, generous space, quiet details",
    icon: Globe,
    previewHint: "calm",
  },
  {
    id: "bold",
    label: "Bold / Energetic",
    description: "Dark surfaces, vivid accents, strong contrast",
    icon: Zap,
    previewHint: "bold",
  },
  {
    id: "warm",
    label: "Warm / Friendly",
    description: "Amber and orange tones, inviting and approachable",
    icon: Heart,
    previewHint: "warm",
  },
  {
    id: "serious",
    label: "Serious / Professional",
    description: "Navy blues, formal hierarchy, zero decoration",
    icon: ShieldCheck,
    previewHint: "serious",
  },
  {
    id: "playful",
    label: "Playful",
    description: "Bright colours, rounded shapes, fun interactions",
    icon: Star,
    previewHint: "playful",
  },
  {
    id: "editorial",
    label: "Editorial",
    description: "Clean typographic hierarchy, magazine-like composition",
    icon: FileText,
    previewHint: "editorial",
  },
];

// Consumer/community audiences: warm and playful vibes seeded first
const VIBE_OPTIONS_CONSUMER: ChoiceOption[] = [
  { ...VIBE_OPTIONS_DEFAULT[2], seedDefault: true }, // warm
  { ...VIBE_OPTIONS_DEFAULT[4] }, // playful
  { ...VIBE_OPTIONS_DEFAULT[0] }, // calm
  { ...VIBE_OPTIONS_DEFAULT[1] }, // bold
  { ...VIBE_OPTIONS_DEFAULT[3] }, // serious
  { ...VIBE_OPTIONS_DEFAULT[5] }, // editorial
];

// Professional/enterprise/internal audiences: serious and calm vibes seeded first
const VIBE_OPTIONS_PROFESSIONAL: ChoiceOption[] = [
  { ...VIBE_OPTIONS_DEFAULT[3], seedDefault: true }, // serious
  { ...VIBE_OPTIONS_DEFAULT[0] }, // calm
  { ...VIBE_OPTIONS_DEFAULT[5] }, // editorial
  { ...VIBE_OPTIONS_DEFAULT[1] }, // bold
  { ...VIBE_OPTIONS_DEFAULT[2] }, // warm
  { ...VIBE_OPTIONS_DEFAULT[4] }, // playful
];

const VIBE_BY_AUDIENCE: Record<string, ChoiceOption[]> = {
  consumers: VIBE_OPTIONS_CONSUMER,
  community: VIBE_OPTIONS_CONSUMER,
  businesses: VIBE_OPTIONS_PROFESSIONAL,
  internalTeam: VIBE_OPTIONS_PROFESSIONAL,
  myself: VIBE_OPTIONS_DEFAULT,
};

const STEP_4: FlowStep = {
  id: "vibe",
  phase: 2,
  phaseName: "The feel",
  stepNumber: 4,
  question: "What's the overall aesthetic?",
  hint: "This sets the mood and visual register for the whole app.",
  answerKey: "vibe",
  dependsOn: { key: "audience", values: VIBE_BY_AUDIENCE },
  options: VIBE_OPTIONS_DEFAULT,
};

// Colour options contextually filtered by vibe
const COLOR_BY_VIBE: Record<string, ChoiceOption[]> = {
  calm: [
    {
      id: "indigo-white",
      label: "Indigo & White",
      description: "Clean white with deep indigo primary",
      colors: ["#ffffff", "#f0f0f8", "#4f46e5"],
      seedDefault: true,
    },
    {
      id: "mint-fresh",
      label: "Mint & Fresh",
      description: "Light background with mint and teal highlights",
      colors: ["#f0fdfb", "#e6fffa", "#0d9488"],
    },
    {
      id: "stone-neutral",
      label: "Stone / Neutral",
      description: "Warm off-white with subtle grey tones",
      colors: ["#fafaf9", "#f5f5f4", "#78716c"],
    },
    {
      id: "neon-dark",
      label: "Neon on Dark",
      description: "Dark background, bright lime accent",
      colors: ["#1a1a1a", "#2a2a2a", "#b9f03c"],
    },
  ],
  bold: [
    {
      id: "neon-dark",
      label: "Neon on Dark",
      description: "Dark background, bright lime accent",
      colors: ["#1a1a1a", "#2a2a2a", "#b9f03c"],
      seedDefault: true,
    },
    {
      id: "rose-bold",
      label: "Rose & Bold",
      description: "Deep charcoal with rose-pink energy",
      colors: ["#1c1c1c", "#2d1f2a", "#f43f5e"],
    },
    {
      id: "navy-professional",
      label: "Navy",
      description: "Dark navy with blue accents",
      colors: [
        "oklch(0.15 0.02 265)",
        "oklch(0.22 0.03 265)",
        "oklch(0.55 0.2 260)",
      ],
    },
    {
      id: "violet-dark",
      label: "Deep Violet",
      description: "Rich violet with glowing highlights",
      colors: ["#12052e", "#1e0a40", "#a78bfa"],
    },
  ],
  warm: [
    {
      id: "amber-warm",
      label: "Amber & Warm",
      description: "Warm off-white with amber accents",
      colors: [
        "oklch(0.98 0.01 90)",
        "oklch(0.97 0.02 80)",
        "oklch(0.75 0.18 65)",
      ],
      seedDefault: true,
    },
    {
      id: "terracotta",
      label: "Terracotta",
      description: "Warm clay and earthy burnt orange",
      colors: ["#fdf0e8", "#fde4cc", "#c2410c"],
    },
    {
      id: "peach-soft",
      label: "Peach & Soft",
      description: "Blush pink with soft peach warmth",
      colors: ["#fff5f5", "#ffeae0", "#fb7185"],
    },
  ],
  serious: [
    {
      id: "navy-professional",
      label: "Navy Professional",
      description: "Dark navy with crisp white and blue accents",
      colors: [
        "oklch(0.15 0.02 265)",
        "oklch(0.22 0.03 265)",
        "oklch(0.55 0.2 260)",
      ],
      seedDefault: true,
    },
    {
      id: "graphite",
      label: "Graphite",
      description: "Dark grey with steel blue accents",
      colors: ["#1c2127", "#2d3748", "#4299e1"],
    },
    {
      id: "forest-dark",
      label: "Forest",
      description: "Deep forest green and cream",
      colors: ["#0f2117", "#1a3a27", "#34d399"],
    },
  ],
  playful: [
    {
      id: "candy",
      label: "Candy",
      description: "Bright multicolour, soft white background",
      colors: ["#ffffff", "#f8f0ff", "#f472b6"],
      seedDefault: true,
    },
    {
      id: "sky-bright",
      label: "Sky & Bright",
      description: "Vivid sky blue with sunny accents",
      colors: ["#f0f9ff", "#e0f2fe", "#0ea5e9"],
    },
    {
      id: "neon-dark",
      label: "Neon on Dark",
      description: "Dark, bright lime accent",
      colors: ["#1a1a1a", "#2a2a2a", "#b9f03c"],
    },
  ],
  editorial: [
    {
      id: "indigo-white",
      label: "Indigo & White",
      description: "Clean white with deep indigo",
      colors: ["#ffffff", "#f0f0f8", "#4f46e5"],
      seedDefault: true,
    },
    {
      id: "stone-neutral",
      label: "Stone / Neutral",
      description: "Warm off-white, subtle grey",
      colors: ["#fafaf9", "#f5f5f4", "#78716c"],
    },
    {
      id: "neon-dark",
      label: "Neon on Dark",
      description: "Dark, bright lime accent",
      colors: ["#1a1a1a", "#2a2a2a", "#b9f03c"],
    },
  ],
};

// ─── Phase 3: The Shape ───────────────────────────────────────────────────────
// Colour direction step — filtered by vibe
const STEP_5: FlowStep = {
  id: "colorDirection",
  phase: 2,
  phaseName: "The feel",
  stepNumber: 5,
  question: "Which colour direction fits?",
  hint: "These palette options are curated to match the aesthetic you chose.",
  answerKey: "colorDirection",
  dependsOn: { key: "vibe", values: COLOR_BY_VIBE },
  options: COLOR_BY_VIBE.calm,
};

// Typography feel step — filtered by vibe
const TYPOGRAPHY_BY_VIBE: Record<string, ChoiceOption[]> = {
  calm: [
    {
      id: "geometric-sans",
      label: "Geometric Sans",
      description: "Clean, modern — Inter or DM Sans",
      icon: Type,
      seedDefault: true,
    },
    {
      id: "humanist-sans",
      label: "Humanist Sans",
      description: "Warm and readable — Source Sans, Nunito",
      icon: AlignLeft,
    },
    {
      id: "slab-serif",
      label: "Slab Serif",
      description: "Confident and structured — Bitter, Arvo",
      icon: AlignJustify,
    },
  ],
  bold: [
    {
      id: "display-sans",
      label: "Display Sans",
      description: "Strong headlines, tight tracking — Satoshi, Cabinet",
      icon: Type,
      seedDefault: true,
    },
    {
      id: "mono",
      label: "Monospace",
      description: "Technical and distinctive — JetBrains Mono",
      icon: Code2,
    },
    {
      id: "geometric-sans",
      label: "Geometric Sans",
      description: "Versatile and modern — Inter",
      icon: AlignCenter,
    },
  ],
  warm: [
    {
      id: "humanist-sans",
      label: "Humanist Sans",
      description: "Friendly and inviting — Nunito, Lato",
      icon: AlignLeft,
      seedDefault: true,
    },
    {
      id: "rounded-sans",
      label: "Rounded Sans",
      description: "Soft and approachable — Poppins, Quicksand",
      icon: Circle,
    },
    {
      id: "slab-serif",
      label: "Slab Serif",
      description: "Warm authority — Bitter, Arvo",
      icon: AlignJustify,
    },
  ],
  serious: [
    {
      id: "geometric-sans",
      label: "Geometric Sans",
      description: "Neutral and professional — Inter, DM Sans",
      icon: Type,
      seedDefault: true,
    },
    {
      id: "classical-serif",
      label: "Classical Serif",
      description: "Authority and tradition — Merriweather, Playfair",
      icon: AlignJustify,
    },
    {
      id: "humanist-sans",
      label: "Humanist Sans",
      description: "Accessible professionalism — Source Sans",
      icon: AlignLeft,
    },
  ],
  playful: [
    {
      id: "rounded-sans",
      label: "Rounded Sans",
      description: "Fun and friendly — Poppins, Quicksand",
      icon: Circle,
      seedDefault: true,
    },
    {
      id: "humanist-sans",
      label: "Humanist Sans",
      description: "Warm and readable — Nunito",
      icon: AlignLeft,
    },
    {
      id: "display-sans",
      label: "Display Sans",
      description: "Bold and characterful — Satoshi",
      icon: Type,
    },
  ],
  editorial: [
    {
      id: "classical-serif",
      label: "Classical Serif",
      description: "Elegant authority — Merriweather, Playfair Display",
      icon: AlignJustify,
      seedDefault: true,
    },
    {
      id: "geometric-sans",
      label: "Geometric Sans",
      description: "Clean contrast to serif headings — Inter",
      icon: Type,
    },
    {
      id: "humanist-sans",
      label: "Humanist Sans",
      description: "Balanced and readable — Source Serif",
      icon: AlignLeft,
    },
  ],
};

const STEP_6: FlowStep = {
  id: "typographyFeel",
  phase: 2,
  phaseName: "The feel",
  stepNumber: 6,
  question: "What type of typography fits?",
  hint: "Typography is tone. The right typeface makes the aesthetic feel intentional.",
  answerKey: "typographyFeel",
  dependsOn: { key: "vibe", values: TYPOGRAPHY_BY_VIBE },
  options: TYPOGRAPHY_BY_VIBE.calm,
};

const STEP_7: FlowStep = {
  id: "cornerDensity",
  phase: 2,
  phaseName: "The feel",
  stepNumber: 7,
  question: "How should corners and density feel?",
  hint: "Corners and spacing density shape how the interface feels before users read a word.",
  answerKey: "cornerDensity",
  options: [
    {
      id: "rounded-spacious",
      label: "Rounded & Spacious",
      description: "Generous padding, soft corners — approachable and open",
      icon: Square,
      seedDefault: true,
    },
    {
      id: "rounded-compact",
      label: "Rounded & Compact",
      description:
        "Moderate padding, slightly rounded corners — balanced and clean",
      icon: AlignCenter,
    },
    {
      id: "sharp-spacious",
      label: "Sharp & Spacious",
      description:
        "Generous spacing, crisp right-angle corners — editorial and precise",
      icon: Layers,
    },
    {
      id: "sharp-compact",
      label: "Sharp & Dense",
      description: "Tight padding, sharp corners — data-dense and technical",
      icon: Database,
    },
  ],
};

// ─── Landing screen design steps (inserted after cornerDensity, before shellLayout) ───

// Helper: landing screen steps only make sense for audience-facing apps
const isAudienceFacing = (a: Partial<DesignFlowAnswers>) => {
  const appType = a.appType;
  if (appType === "internalTool") return false;
  const audience = Array.isArray(a.audience)
    ? a.audience
    : a.audience
      ? [a.audience]
      : [];
  if (audience.length === 1 && audience[0] === "myself") return false;
  if (audience.length === 1 && audience[0] === "internalTeam") return false;
  return true;
};

const STEP_LANDING_LAYOUT: FlowStep = {
  id: "landingLayoutPattern",
  phase: 3,
  phaseName: "Landing screen",
  stepNumber: 8,
  question: "How should the landing screen be laid out?",
  hint: "The first screen someone sees sets expectations for the whole app.",
  answerKey: "landingLayoutPattern",
  showWhen: isAudienceFacing,
  options: [
    {
      id: "hero-center",
      label: "Centred Hero",
      description: "Large headline and CTA centred on a bold background",
      icon: AlignCenter,
      seedDefault: true,
    },
    {
      id: "hero-split",
      label: "Split Hero",
      description: "Copy on one side, visual on the other",
      icon: PanelLeft,
    },
    {
      id: "full-illustration",
      label: "Full Illustration",
      description: "Illustration fills the screen, copy overlaid on it",
      icon: Image,
    },
    {
      id: "dashboard-preview",
      label: "Dashboard Preview",
      description: "App UI screenshot or mockup as the hero visual",
      icon: Monitor,
    },
    {
      id: "minimal-text",
      label: "Minimal Text",
      description: "Clean headline only — no hero visual, just space and type",
      icon: Type,
    },
  ],
};

const STEP_LANDING_HERO_CONTENT: FlowStep = {
  id: "landingHeroContentType",
  phase: 3,
  phaseName: "Landing screen",
  stepNumber: 9,
  question: "What fills the hero visual area?",
  hint: "Choose the kind of visual that will communicate your app instantly.",
  answerKey: "landingHeroContentType",
  showWhen: (a) =>
    isAudienceFacing(a) && a.landingLayoutPattern !== "minimal-text",
  options: [
    {
      id: "illustration",
      label: "Custom Illustration",
      description: "A scene specific to what the app does",
      icon: Image,
      seedDefault: true,
    },
    {
      id: "product-screenshot",
      label: "Product Screenshot",
      description: "The actual app UI, showing the core feature",
      icon: Monitor,
    },
    {
      id: "abstract-pattern",
      label: "Abstract Pattern",
      description:
        "Geometric or decorative — adds visual interest without a scene",
      icon: Square,
    },
    {
      id: "photography",
      label: "Photography",
      description: "A real photo — people, product, or environment",
      icon: Image,
    },
    {
      id: "icon-composition",
      label: "Icon Composition",
      description: "Feature icons arranged as the hero visual",
      icon: Layers,
    },
  ],
};

const STEP_LANDING_HEADLINE_TONE: FlowStep = {
  id: "landingHeadlineTone",
  phase: 3,
  phaseName: "Landing screen",
  stepNumber: 10,
  question: "What tone should the headline carry?",
  hint: "The headline is the first sentence of your pitch. Choose the register that fits.",
  answerKey: "landingHeadlineTone",
  showWhen: isAudienceFacing,
  options: [
    {
      id: "direct-outcome",
      label: "Direct Outcome",
      description:
        "States the result plainly: 'Track every habit, hit every goal'",
      icon: ChevronRight,
      seedDefault: true,
    },
    {
      id: "empowering",
      label: "Empowering",
      description: "Speaks to the user's capability: 'Build without limits'",
      icon: Zap,
    },
    {
      id: "question",
      label: "Provocative Question",
      description: "Opens with curiosity: 'What if your spec wrote itself?'",
      icon: MessageSquare,
    },
    {
      id: "bold-claim",
      label: "Bold Claim",
      description: "Confident statement of superiority or uniqueness",
      icon: Star,
    },
    {
      id: "calm-description",
      label: "Calm Description",
      description: "Simple and honest: 'A better way to manage your projects'",
      icon: AlignLeft,
    },
  ],
};

const STEP_LANDING_CTA_STYLE: FlowStep = {
  id: "landingCTAStyle",
  phase: 3,
  phaseName: "Landing screen",
  stepNumber: 11,
  question: "What style should the primary CTA have?",
  hint: "The CTA is the one thing you want people to do. Make it clear and compelling.",
  answerKey: "landingCTAStyle",
  showWhen: isAudienceFacing,
  options: [
    {
      id: "action-verb",
      label: "Action Verb",
      description: "Short and direct: 'Get started', 'Try it free'",
      icon: MousePointerClick,
      seedDefault: true,
    },
    {
      id: "outcome",
      label: "Outcome-Led",
      description: "Names the result: 'Build my app', 'See my spec'",
      icon: ChevronRight,
    },
    {
      id: "low-friction",
      label: "Low Friction",
      description: "Reduces commitment: 'Explore for free', 'No signup needed'",
      icon: MousePointer2,
    },
    {
      id: "urgency",
      label: "Urgency",
      description: "Creates momentum: 'Start now', 'Launch today'",
      icon: Zap,
    },
  ],
};

const STEP_8: FlowStep = {
  id: "shellLayout",
  phase: 3,
  phaseName: "The shape",
  stepNumber: 12,
  question: "How should the main navigation be structured?",
  hint: "This is the skeleton of every screen — choose the layout that matches how users will move through the app.",
  answerKey: "shellLayout",
  options: [
    {
      id: "sidebar",
      label: "Sidebar Navigation",
      description:
        "Recommended — persistent left rail, content takes the rest. Works for complex apps with many sections.",
      icon: PanelLeft,
      seedDefault: true,
    },
    {
      id: "topnav",
      label: "Top Navigation",
      description:
        "Horizontal nav bar at the top. Clean and familiar for content-led apps.",
      icon: LayoutDashboard,
    },
    {
      id: "tabbar",
      label: "Tab Bar",
      description:
        "Tabs at the bottom — a mobile-style pattern for focused, distinct sections.",
      icon: Monitor,
    },
    {
      id: "minimal",
      label: "Minimal / No Nav",
      description: "No persistent navigation — single-focus apps or tools.",
      icon: Smartphone,
    },
  ],
};

const STEP_9: FlowStep = {
  id: "headerFooterPlacement",
  phase: 3,
  phaseName: "The shape",
  stepNumber: 13,
  question: "Where should header, profile, and key controls sit?",
  hint: "This defines the chrome — the persistent frame around your content.",
  answerKey: "headerFooterPlacement",
  options: [
    {
      id: "sidebar-footer-profile",
      label: "Sidebar + Footer Profile",
      description:
        "Sidebar nav with user profile pinned at the bottom — recommended for the sidebar layout.",
      previewHint: "sidebar-footer",
      seedDefault: true,
    },
    {
      id: "top-right-profile",
      label: "Top Header + Right Profile",
      description:
        "Classic SaaS layout — horizontal top bar with profile in the top-right.",
      previewHint: "top-right",
    },
    {
      id: "top-left-menu",
      label: "Top Header + Left Menu",
      description:
        "Hamburger or logo on the left, content centred, clean and neutral.",
      previewHint: "top-left",
    },
    {
      id: "single-bar",
      label: "Minimal Single Bar",
      description:
        "A single slim bar with logo and one action — for focused tools.",
      previewHint: "single",
    },
  ],
};

const STEP_10: FlowStep = {
  id: "lightDarkDefault",
  phase: 3,
  phaseName: "The shape",
  stepNumber: 14,
  question: "Light or dark by default?",
  hint: "Both modes are always supported — this is just the out-of-the-box experience.",
  answerKey: "lightDarkDefault",
  options: [
    {
      id: "light",
      label: "Light Mode",
      description:
        "Clean white surfaces, dark text — the default for most productivity apps.",
      previewHint: "light",
    },
    {
      id: "dark",
      label: "Dark Mode",
      description:
        "Dark surfaces, light text — preferred for focused or technical work.",
      previewHint: "dark",
    },
  ],
};

// ─── Phase 4: What it does ────────────────────────────────────────────────────

const FEATURES_BY_TYPE: Record<string, ChoiceOption[]> = {
  marketplace: [
    {
      id: "listings",
      label: "Listings",
      description: "Browse and search items",
      icon: Store,
    },
    {
      id: "checkout",
      label: "Checkout",
      description: "Cart and payment flow",
      icon: CreditCard,
    },
    {
      id: "reviews",
      label: "Reviews",
      description: "Ratings and user feedback",
      icon: Star,
    },
    {
      id: "search",
      label: "Search & Filters",
      description: "Find what you need fast",
      icon: Search,
    },
    {
      id: "profiles",
      label: "User Profiles",
      description: "Seller and buyer pages",
      icon: User,
    },
    {
      id: "messaging",
      label: "Messaging",
      description: "Buyer-seller chat",
      icon: MessageSquare,
    },
    {
      id: "wishlist",
      label: "Wishlist",
      description: "Save items for later",
      icon: Bookmark,
    },
    {
      id: "recommendations",
      label: "Recommendations",
      description: "Personalised suggestions",
      icon: Zap,
    },
    {
      id: "analytics",
      label: "Analytics",
      description: "Sales and traffic data",
      icon: BarChart3,
    },
    {
      id: "adminPanel",
      label: "Admin Panel",
      description: "Moderate and manage",
      icon: Settings,
    },
    {
      id: "notifications",
      label: "Notifications",
      description: "Alerts and updates",
      icon: Zap,
    },
    {
      id: "api",
      label: "API / Integrations",
      description: "Connect external tools",
      icon: Code2,
    },
  ],
  social: [
    {
      id: "feed",
      label: "Posts / Feed",
      description: "Main activity stream",
      icon: FileText,
    },
    {
      id: "profiles",
      label: "User Profiles",
      description: "Personal pages and bios",
      icon: User,
    },
    {
      id: "messaging",
      label: "Messaging",
      description: "Direct messages",
      icon: MessageSquare,
    },
    {
      id: "comments",
      label: "Comments",
      description: "Threaded replies",
      icon: MessageSquare,
    },
    {
      id: "follow",
      label: "Follow / Connect",
      description: "Social graph",
      icon: Users,
    },
    {
      id: "groups",
      label: "Groups",
      description: "Private and public groups",
      icon: Globe,
    },
    {
      id: "notifications",
      label: "Notifications",
      description: "Alerts and updates",
      icon: Zap,
    },
    {
      id: "search",
      label: "Search",
      description: "Find people and content",
      icon: Search,
    },
    {
      id: "media",
      label: "Media Upload",
      description: "Photos and video",
      icon: Image,
    },
    {
      id: "events",
      label: "Events",
      description: "Create and join events",
      icon: Calendar,
    },
    {
      id: "analytics",
      label: "Analytics",
      description: "Engagement metrics",
      icon: BarChart3,
    },
    {
      id: "moderation",
      label: "Moderation",
      description: "Flag and review content",
      icon: ShieldCheck,
    },
  ],
  dashboard: [
    {
      id: "charts",
      label: "Charts / Graphs",
      description: "Visual data display",
      icon: BarChart3,
    },
    {
      id: "tables",
      label: "Data Tables",
      description: "Tabular data and records",
      icon: Database,
    },
    {
      id: "filters",
      label: "Filters",
      description: "Slice and dice data",
      icon: Filter,
    },
    {
      id: "export",
      label: "Export",
      description: "Download data as CSV/PDF",
      icon: File,
    },
    {
      id: "userManagement",
      label: "User Management",
      description: "Manage accounts and roles",
      icon: Users,
    },
    {
      id: "notifications",
      label: "Notifications",
      description: "Alerts and updates",
      icon: Zap,
    },
    {
      id: "settings",
      label: "Settings",
      description: "Configuration options",
      icon: Settings,
    },
    {
      id: "api",
      label: "API Integration",
      description: "Pull from external sources",
      icon: Code2,
    },
    {
      id: "reports",
      label: "Reports",
      description: "Generated report documents",
      icon: FileText,
    },
    {
      id: "realtime",
      label: "Real-time Updates",
      description: "Live data refresh",
      icon: RefreshCw,
    },
    {
      id: "search",
      label: "Search",
      description: "Find records fast",
      icon: Search,
    },
    {
      id: "auditLog",
      label: "Audit Log",
      description: "Track who did what",
      icon: ShieldCheck,
    },
  ],
};

const DEFAULT_FEATURES: ChoiceOption[] = [
  {
    id: "auth",
    label: "Authentication",
    description: "Sign up and log in",
    icon: LogIn,
  },
  {
    id: "profiles",
    label: "User Profiles",
    description: "Personal information and settings",
    icon: User,
  },
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Overview and summary view",
    icon: LayoutDashboard,
  },
  {
    id: "search",
    label: "Search",
    description: "Find content fast",
    icon: Search,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Alerts and updates",
    icon: Zap,
  },
  {
    id: "settings",
    label: "Settings",
    description: "User preferences",
    icon: Settings,
  },
  {
    id: "messaging",
    label: "Messaging",
    description: "In-app communication",
    icon: MessageSquare,
  },
  {
    id: "analytics",
    label: "Analytics",
    description: "Usage and performance data",
    icon: BarChart3,
  },
  {
    id: "export",
    label: "Export / Reports",
    description: "Download your data",
    icon: File,
  },
  {
    id: "api",
    label: "API / Integrations",
    description: "Connect to other tools",
    icon: Code2,
  },
  {
    id: "adminPanel",
    label: "Admin Panel",
    description: "Manage the app",
    icon: ShieldCheck,
  },
  {
    id: "fileUpload",
    label: "File Upload",
    description: "Attach and store files",
    icon: Plus,
  },
];

// Extend FEATURES_BY_TYPE with the remaining app types that fall back to DEFAULT_FEATURES
// but with type-appropriate ordering (most relevant features first).
const FEATURES_BOOKING: ChoiceOption[] = [
  {
    id: "booking",
    label: "Booking / Calendar",
    description: "Reservations and scheduling",
    icon: Calendar,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Reminders and confirmations",
    icon: Zap,
  },
  {
    id: "payments",
    label: "Payments",
    description: "Take deposits or full payment",
    icon: CreditCard,
  },
  {
    id: "profiles",
    label: "User Profiles",
    description: "Customer and provider pages",
    icon: User,
  },
  {
    id: "availability",
    label: "Availability",
    description: "Manage slots and capacity",
    icon: CalendarDays,
  },
  {
    id: "reviews",
    label: "Reviews",
    description: "Ratings and feedback",
    icon: Star,
  },
  {
    id: "messaging",
    label: "Messaging",
    description: "Client–provider chat",
    icon: MessageSquare,
  },
  {
    id: "adminPanel",
    label: "Admin Panel",
    description: "Manage bookings and users",
    icon: Settings,
  },
  {
    id: "analytics",
    label: "Analytics",
    description: "Occupancy and revenue data",
    icon: BarChart3,
  },
  {
    id: "api",
    label: "API / Integrations",
    description: "Connect calendars and tools",
    icon: Code2,
  },
];

const FEATURES_TRACKER: ChoiceOption[] = [
  {
    id: "logging",
    label: "Log / Record",
    description: "Capture entries over time",
    icon: PenLine,
  },
  {
    id: "streaks",
    label: "Streaks & Goals",
    description: "Track consistency and targets",
    icon: Trophy,
  },
  {
    id: "charts",
    label: "Charts / Progress",
    description: "Visualise your data over time",
    icon: BarChart3,
  },
  {
    id: "notifications",
    label: "Reminders",
    description: "Prompts and habit reminders",
    icon: Zap,
  },
  {
    id: "profiles",
    label: "User Profiles",
    description: "Personal settings and history",
    icon: User,
  },
  {
    id: "categories",
    label: "Categories / Tags",
    description: "Organise entries by type",
    icon: Filter,
  },
  {
    id: "export",
    label: "Export",
    description: "Download your data",
    icon: File,
  },
  {
    id: "sharing",
    label: "Sharing",
    description: "Share progress with others",
    icon: Share2,
  },
  {
    id: "analytics",
    label: "Analytics",
    description: "Trends and insights",
    icon: BarChart3,
  },
];

const FEATURES_CLUB: ChoiceOption[] = [
  {
    id: "membership",
    label: "Membership",
    description: "Join, renew, and manage members",
    icon: Users2,
  },
  {
    id: "events",
    label: "Events / Fixtures",
    description: "Schedule and manage events",
    icon: Calendar,
  },
  {
    id: "messaging",
    label: "Announcements",
    description: "Broadcast messages to members",
    icon: MessageSquare,
  },
  {
    id: "profiles",
    label: "Member Profiles",
    description: "Personal pages for each member",
    icon: User,
  },
  {
    id: "payments",
    label: "Payments / Dues",
    description: "Collect membership fees",
    icon: CreditCard,
  },
  {
    id: "documents",
    label: "Documents",
    description: "Shared files and resources",
    icon: File,
  },
  {
    id: "results",
    label: "Results / Scores",
    description: "Log and publish results",
    icon: Trophy,
  },
  {
    id: "adminPanel",
    label: "Admin Panel",
    description: "Committee controls",
    icon: Settings,
  },
];

const FEATURES_INTERNAL: ChoiceOption[] = [
  {
    id: "tasks",
    label: "Tasks / Workflows",
    description: "Assign and track work",
    icon: Check,
  },
  {
    id: "search",
    label: "Search",
    description: "Find records and documents fast",
    icon: Search,
  },
  {
    id: "permissions",
    label: "Permissions",
    description: "Role-based access control",
    icon: ShieldCheck,
  },
  {
    id: "adminPanel",
    label: "Admin Panel",
    description: "Manage users and config",
    icon: Settings,
  },
  {
    id: "tables",
    label: "Data Tables",
    description: "Tabular views of records",
    icon: Database,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Alerts and updates",
    icon: Zap,
  },
  {
    id: "export",
    label: "Export / Reports",
    description: "Download data as CSV/PDF",
    icon: File,
  },
  {
    id: "api",
    label: "API / Integrations",
    description: "Connect to other internal tools",
    icon: Code2,
  },
  {
    id: "auditLog",
    label: "Audit Log",
    description: "Track who did what",
    icon: ShieldCheck,
  },
  {
    id: "messaging",
    label: "Messaging",
    description: "Internal comms",
    icon: MessageSquare,
  },
];

// MVP/simple-scope feature sets — a shorter, curated list of the most essential features
const MVP_FEATURES_SOCIAL: ChoiceOption[] = FEATURES_BY_TYPE.social.slice(0, 6);
const MVP_FEATURES_MARKETPLACE: ChoiceOption[] =
  FEATURES_BY_TYPE.marketplace.slice(0, 6);
const MVP_FEATURES_DASHBOARD: ChoiceOption[] = FEATURES_BY_TYPE.dashboard.slice(
  0,
  6,
);
const MVP_FEATURES_DEFAULT: ChoiceOption[] = DEFAULT_FEATURES.slice(0, 6);

const FEATURES_BY_TYPE_EXTENDED: Record<string, ChoiceOption[]> = {
  ...FEATURES_BY_TYPE,
  booking: FEATURES_BOOKING,
  tracker: FEATURES_TRACKER,
  clubManager: FEATURES_CLUB,
  internalTool: FEATURES_INTERNAL,
  // MVP variants (used when scope is 'mvp' or 'simple')
  "social-mvp": MVP_FEATURES_SOCIAL,
  "marketplace-mvp": MVP_FEATURES_MARKETPLACE,
  "dashboard-mvp": MVP_FEATURES_DASHBOARD,
  "default-mvp": MVP_FEATURES_DEFAULT,
};

const STEP_11: FlowStep = {
  id: "coreFeatures",
  phase: 4,
  phaseName: "What it does",
  stepNumber: 15,
  question: "Which features does your app need?",
  hint: "Select all that apply — you can always add more later in the spec.",
  multiSelect: true,
  answerKey: "coreFeatures",
  dependsOn: { key: "appType", values: FEATURES_BY_TYPE_EXTENDED },
  options: DEFAULT_FEATURES,
};

const STEP_12: FlowStep = {
  id: "rolesAccess",
  phase: 4,
  phaseName: "What it does",
  stepNumber: 16,
  question: "Who can access the app, and in what roles?",
  hint: "Select all roles that exist — access and permissions will be described in the spec.",
  multiSelect: true,
  answerKey: "rolesAccess",
  options: [
    {
      id: "admin",
      label: "Admin",
      description: "Full access — manage everything",
      icon: ShieldCheck,
    },
    {
      id: "member",
      label: "User / Member",
      description: "Standard authenticated user",
      icon: User,
    },
    {
      id: "viewer",
      label: "Viewer",
      description: "Read-only access",
      icon: BookOpen,
    },
    {
      id: "editor",
      label: "Editor",
      description: "Can create and modify content",
      icon: PenLine,
    },
    {
      id: "manager",
      label: "Manager",
      description: "Elevated access to manage others",
      icon: Users2,
    },
    {
      id: "guest",
      label: "Guest / Public",
      description: "Unauthenticated browsing",
      icon: Globe,
    },
  ],
};

const STEP_13: FlowStep = {
  id: "keyScreens",
  phase: 4,
  phaseName: "What it does",
  stepNumber: 17,
  question: "Which screens does the app need?",
  hint: "Pick the views your users will spend time in — each will be spec'd with its states.",
  multiSelect: true,
  answerKey: "keyScreens",
  options: [
    {
      id: "home",
      label: "Dashboard / Home",
      description: "Main landing after sign-in",
      icon: LayoutDashboard,
    },
    {
      id: "profile",
      label: "Profile / Settings",
      description: "User account and preferences",
      icon: User,
    },
    {
      id: "list",
      label: "List / Browse",
      description: "A browsable, filterable list of items",
      icon: Filter,
    },
    {
      id: "detail",
      label: "Detail / View",
      description: "Deep-dive view of a single item",
      icon: FileText,
    },
    {
      id: "create",
      label: "Create / Form",
      description: "Form to create or edit something",
      icon: PenLine,
    },
    {
      id: "search",
      label: "Search / Filter",
      description: "Dedicated search experience",
      icon: Search,
    },
    {
      id: "analytics",
      label: "Analytics / Reports",
      description: "Charts and metrics screen",
      icon: BarChart3,
    },
    {
      id: "admin",
      label: "Admin Panel",
      description: "Management and moderation",
      icon: Settings,
    },
    {
      id: "login",
      label: "Login / Auth",
      description: "Sign in, sign up, forgot password",
      icon: LogIn,
    },
    {
      id: "onboarding",
      label: "Onboarding",
      description: "First-run flow for new users",
      icon: ChevronRight,
    },
  ],
};

// ─── Phase 5: The Specifics ───────────────────────────────────────────────────

// Scope / complexity step — drives feature list depth and data model step visibility
const STEP_SCOPE: FlowStep = {
  id: "appScope",
  phase: 4,
  phaseName: "What it does",
  stepNumber: 14, // scope step (inserted before features at position 14 in the full 22-step sequence)
  question: "How much should the initial version do?",
  hint: "This shapes the depth of features and whether the data model step appears.",
  answerKey: "appScope",
  options: [
    {
      id: "mvp",
      label: "Start small (MVP)",
      description: "Core features only — build quickly and validate the idea",
      icon: Zap,
      seedDefault: true,
    },
    {
      id: "full",
      label: "Full feature set",
      description:
        "All planned features — for a complete, production-ready launch",
      icon: Layers,
    },
  ],
};

const STEP_14: FlowStep = {
  id: "dataContent",
  phase: 5,
  phaseName: "The specifics",
  stepNumber: 18,
  question: "What kind of data does your app store?",
  hint: "Select everything that your app needs to persist.",
  // Only show data model step for full-scope apps
  showWhen: (a) => !a.appScope || a.appScope === "full",
  multiSelect: true,
  answerKey: "dataContent",
  options: [
    {
      id: "userProfiles",
      label: "User Profiles",
      description: "Accounts, bios, and preferences",
      icon: User,
    },
    {
      id: "text",
      label: "Text / Articles",
      description: "Written content and documents",
      icon: FileText,
    },
    {
      id: "images",
      label: "Images / Media",
      description: "Photos, videos, and attachments",
      icon: Image,
    },
    {
      id: "files",
      label: "Files / Documents",
      description: "Uploaded files and PDFs",
      icon: File,
    },
    {
      id: "events",
      label: "Events / Calendar",
      description: "Dated and timed events",
      icon: Calendar,
    },
    {
      id: "transactions",
      label: "Transactions / Payments",
      description: "Financial records and history",
      icon: CreditCard,
    },
    {
      id: "messages",
      label: "Messages / Comments",
      description: "Conversations and replies",
      icon: MessageSquare,
    },
    {
      id: "analytics",
      label: "Analytics / Metrics",
      description: "Usage data and measurements",
      icon: BarChart3,
    },
    {
      id: "listings",
      label: "Product Listings",
      description: "Items with prices and details",
      icon: Store,
    },
    {
      id: "forms",
      label: "Forms / Submissions",
      description: "User-submitted structured data",
      icon: PenLine,
    },
  ],
};

const STEP_15: FlowStep = {
  id: "motionRegister",
  phase: 5,
  phaseName: "The specifics",
  stepNumber: 19,
  question: "How much animation and motion?",
  hint: "The motion register is part of the personality — calm apps feel very different to lively ones.",
  answerKey: "motionRegister",
  options: [
    {
      id: "calm",
      label: "Calm",
      description:
        "Subtle transitions only — elements appear and disappear cleanly without spectacle.",
      previewHint: "calm",
      seedDefault: true,
    },
    {
      id: "lively",
      label: "Lively",
      description:
        "Smooth micro-interactions and fluid transitions — everything feels polished and responsive.",
      previewHint: "lively",
    },
  ],
};

const STEP_16: FlowStep = {
  id: "platformScope",
  phase: 5,
  phaseName: "The specifics",
  stepNumber: 20,
  question: "What's the target platform?",
  hint: "This shapes layout decisions, touch targets, and interaction patterns throughout.",
  answerKey: "platformScope",
  options: [
    {
      id: "desktop",
      label: "Desktop Only",
      description: "Optimised for large screens and mouse/keyboard interaction",
      icon: Monitor,
    },
    {
      id: "desktop-mobile",
      label: "Desktop + Mobile",
      description: "Responsive — works well on both",
      icon: Smartphone,
    },
    {
      id: "mobile-first",
      label: "Mobile First",
      description: "Designed primarily for phones, with desktop support",
      icon: Smartphone,
    },
    {
      id: "pwa",
      label: "Progressive Web App",
      description: "Installable, offline-capable, app-like experience",
      icon: Wifi,
    },
  ],
};

// ─── Phase 6: Review ─────────────────────────────────────────────────────────

const STEP_17: FlowStep = {
  id: "review",
  phase: 6,
  phaseName: "Review",
  stepNumber: 21,
  question: "Review your spec",
  hint: "Everything looks good? Continue to finalise, or tap any section to go back and change it.",
  answerKey: "",
  options: [],
};

const STEP_18: FlowStep = {
  id: "complete",
  phase: 6,
  phaseName: "Review",
  stepNumber: 22,
  question: "Your spec is ready",
  hint: "You've designed a complete, professional specification. Export it or open it in Organize.",
  answerKey: "",
  options: [],
};

export const DESIGN_FLOW_STEPS: FlowStep[] = [
  STEP_1,
  STEP_2,
  STEP_3,
  STEP_4,
  STEP_5,
  STEP_6,
  STEP_7,
  STEP_LANDING_LAYOUT,
  STEP_LANDING_HERO_CONTENT,
  STEP_LANDING_HEADLINE_TONE,
  STEP_LANDING_CTA_STYLE,
  STEP_8,
  STEP_9,
  STEP_10,
  STEP_SCOPE,
  STEP_11,
  STEP_12,
  STEP_13,
  STEP_14,
  STEP_15,
  STEP_16,
  STEP_17,
  STEP_18,
];

export const PHASE_NAMES: Record<number, string> = {
  1: "What are you making?",
  2: "The feel",
  3: "The shape",
  4: "What it does",
  5: "The specifics",
  6: "Review",
};

export interface FlowStepWithOptions extends FlowStep {
  filteredOptions: ChoiceOption[];
}

/**
 * Returns the visible, contextual steps for the current set of answers.
 * Each returned step has a `filteredOptions` field with options filtered
 * by the step's `dependsOn` evaluation for the current answers.
 * Steps with a `showWhen` that returns false are excluded.
 *
 * Contextual branching rules:
 * a) App type shapes feature options via FEATURES_BY_TYPE_EXTENDED
 * b) Audience shapes vibe options via VIBE_BY_AUDIENCE (first audience value used)
 * c) Vibe shapes landing layout seeded selection (handled in getSeedSelections)
 * d) Single-role or 'myself' audience hides the permissions step
 * e) 'mvp' scope hides the data model step and narrows feature options
 */
export function getContextualSteps(
  answers: Partial<DesignFlowAnswers>,
): FlowStepWithOptions[] {
  const answersAsRecord = answers as Record<string, string | string[]>;

  // Rule d: hide rolesAccess step if audience is 'myself' (single user)
  const audienceArr = Array.isArray(answers.audience)
    ? answers.audience
    : answers.audience
      ? [answers.audience as string]
      : [];
  const isSingleUser = audienceArr.length === 1 && audienceArr[0] === "myself";

  const steps = DESIGN_FLOW_STEPS.reduce<FlowStepWithOptions[]>((acc, step) => {
    // Rule d: skip roles/permissions step for single-user apps
    if (step.id === "rolesAccess" && isSingleUser) return acc;

    if (step.showWhen && !step.showWhen(answers)) return acc;

    let opts: ChoiceOption[];
    if (step.dependsOn) {
      const depKey = step.dependsOn.key;
      const depVal = answersAsRecord[depKey];

      if (step.id === "vibe") {
        // Rule b: audience (multi-select) shapes vibe options — use first audience value
        const firstAudience = Array.isArray(depVal)
          ? (depVal as string[])[0]
          : typeof depVal === "string"
            ? depVal
            : undefined;
        opts =
          firstAudience && step.dependsOn.values[firstAudience]
            ? (step.dependsOn.values[firstAudience] as ChoiceOption[])
            : step.options;
      } else if (step.id === "coreFeatures") {
        // Rule a+e: appType shapes feature list; mvp scope narrows it
        const appType = typeof depVal === "string" ? depVal : "";
        const isMvp = answers.appScope === "mvp";
        const mvpKey = `${appType}-mvp`;
        if (isMvp && step.dependsOn.values[mvpKey]) {
          opts = step.dependsOn.values[mvpKey] as ChoiceOption[];
        } else if (appType && step.dependsOn.values[appType]) {
          opts = step.dependsOn.values[appType] as ChoiceOption[];
        } else if (isMvp && step.dependsOn.values["default-mvp"]) {
          opts = step.dependsOn.values["default-mvp"] as ChoiceOption[];
        } else {
          opts = step.options;
        }
      } else {
        opts =
          typeof depVal === "string" && step.dependsOn.values[depVal]
            ? (step.dependsOn.values[depVal] as ChoiceOption[])
            : step.options;
      }
    } else {
      opts = step.options;
    }
    acc.push({ ...step, filteredOptions: opts });
    return acc;
  }, []);

  // Re-number visible steps sequentially so stepNumber reflects actual position
  // (avoids duplicates when STEP_SCOPE and STEP_11 both declare stepNumber 15)
  return steps.map((step, i) => ({ ...step, stepNumber: i + 1 }));
}

/**
 * Get the options for a step, taking into account any seeded context
 * (e.g. step 3 options depend on step 1 answer)
 */
export function getStepOptions(
  step: FlowStep,
  answers: Record<string, string | string[]>,
): ChoiceOption[] {
  if (!step.dependsOn) return step.options;
  const depValue = answers[step.dependsOn.key];
  if (typeof depValue === "string" && step.dependsOn.values[depValue]) {
    return step.dependsOn.values[depValue] as ChoiceOption[];
  }
  return step.options;
}

/**
 * Returns IDs that should be pre-selected for a step given prior answers.
 *
 * Seeds:
 * - Single-select steps: pre-selects the seedDefault option from the filtered options
 * - Landing layout step (landingLayoutPattern): seeded from vibe choice
 *   - 'calm' or 'editorial' vibe → 'minimal-text'
 *   - 'bold' or 'playful' vibe → 'hero-center'
 *   - 'warm' vibe → 'hero-split'
 *   - others → 'hero-center'
 * - Vibe step: seeded from audience via VIBE_BY_AUDIENCE ordering (first seedDefault in filtered list)
 */
export function getSeedSelections(
  step: FlowStep,
  answers: Record<string, string | string[]>,
): string[] {
  // Rule c: landing layout seeded from vibe
  if (step.id === "landingLayoutPattern") {
    const vibe = typeof answers.vibe === "string" ? answers.vibe : "";
    if (vibe === "calm" || vibe === "editorial") return ["minimal-text"];
    if (vibe === "bold" || vibe === "playful") return ["hero-center"];
    if (vibe === "warm") return ["hero-split"];
    return ["hero-center"];
  }

  // For vibe step: use audience-aware filtered options to find seedDefault
  if (step.id === "vibe") {
    const audienceVal = answers.audience;
    const firstAudience = Array.isArray(audienceVal)
      ? (audienceVal as string[])[0]
      : typeof audienceVal === "string"
        ? audienceVal
        : undefined;
    const audienceOpts =
      firstAudience && VIBE_BY_AUDIENCE[firstAudience]
        ? VIBE_BY_AUDIENCE[firstAudience]
        : VIBE_OPTIONS_DEFAULT;
    const seed = audienceOpts.find((o) => o.seedDefault);
    return seed ? [seed.id] : [];
  }

  // Default: seedDefault from the step's base options
  return step.options.filter((o) => o.seedDefault).map((o) => o.id);
}
