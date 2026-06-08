import type { DesignFlowAnswers } from "@/types";

// ─── Human-readable label maps ─────────────────────────────────────────────

const APP_TYPE_LABELS: Record<string, string> = {
  dashboard: "a dashboard and internal tool",
  marketplace: "a marketplace platform",
  social: "a social platform and community space",
  contentCms: "a content publishing and management system",
  booking: "a booking and scheduling application",
  tracker: "a tracker and personal logger",
  clubManager: "a club and team management tool",
  internalTool: "an internal business tool",
  other: "a web application",
};

const CLOSEST_EXAMPLE_LABELS: Record<string, string> = {
  // dashboard subtypes
  analytics: "an analytics dashboard",
  adminPanel: "an admin and management panel",
  dataExplorer: "a data explorer and query tool",
  operationsTool: "an operations and workflow tool",
  // marketplace subtypes
  productMarket: "a product marketplace",
  serviceMarket: "a service and freelancer marketplace",
  rentalMarket: "a rental and sharing platform",
  bidding: "an auction and bidding platform",
  // social subtypes
  socialNetwork: "a social network with profiles and feeds",
  forum: "a forum and discussion platform",
  events: "an events and gathering platform",
  groups: "a groups and clubs platform",
  // content subtypes
  blog: "a blog and editorial publication",
  knowledgeBase: "a knowledge base and documentation site",
  mediaLibrary: "a media library and asset manager",
  newsletter: "a newsletter and email archive",
  // booking subtypes
  appointments: "an appointment booking system",
  classBooking: "a class and group booking system",
  roomBooking: "a space and resource booking system",
  tableBooking: "a restaurant and venue reservation system",
  // tracker subtypes
  habitTracker: "a habit and routine tracker",
  fitnessTracker: "a fitness and health log",
  projectTracker: "a project and goal tracker",
  expenseTracker: "an expense and finance log",
  // club subtypes
  sportsClub: "a sports club manager",
  hobbyGroup: "a hobby and interest group tool",
  professionalAssoc: "a professional association manager",
  schoolClub: "a school and youth club tool",
  // internal subtypes
  hrTool: "an HR and people management tool",
  crmTool: "a CRM and sales pipeline tool",
  supportTool: "a support and helpdesk tool",
  inventoryTool: "an inventory and asset tracking tool",
};

const AUDIENCE_LABELS: Record<string, string> = {
  consumers: "general consumers",
  businesses: "businesses and professional teams",
  internalTeam: "your internal team",
  community: "members of a community or interest group",
  myself: "personal use",
};

const VIBE_LABELS: Record<string, string> = {
  calm: "calm and minimal — clean white surfaces, generous space, quiet details",
  bold: "bold and energetic — dark surfaces, vivid accents, strong contrast",
  warm: "warm and friendly — amber tones, inviting and approachable",
  serious:
    "serious and professional — formal hierarchy, precise and restrained",
  playful: "playful and colourful — rounded shapes, bright, fun interactions",
  editorial: "editorial — typographic hierarchy, magazine-like composition",
};

const COLOR_DIRECTION_LABELS: Record<string, string> = {
  "indigo-white": "Indigo & White — clean white with deep indigo primary",
  "mint-fresh": "Mint & Fresh — light background with mint and teal highlights",
  "stone-neutral": "Stone & Neutral — warm off-white with subtle grey tones",
  "neon-dark": "Neon on Dark — dark background with bright lime accent",
  "rose-bold": "Rose & Bold — deep charcoal with rose-pink energy",
  "navy-professional": "Navy Professional — dark navy with crisp blue accents",
  "violet-dark": "Deep Violet — rich violet with glowing highlights",
  "amber-warm": "Amber & Warm — warm off-white with amber accents",
  terracotta: "Terracotta — warm clay and earthy burnt orange",
  "peach-soft": "Peach & Soft — blush pink with soft peach warmth",
  graphite: "Graphite — dark grey with steel blue accents",
  "forest-dark": "Forest — deep forest green and cream",
  candy: "Candy — bright multicolour on a soft white background",
  "sky-bright": "Sky & Bright — vivid sky blue with sunny accents",
};

const TYPOGRAPHY_LABELS: Record<string, string> = {
  "geometric-sans": "Geometric sans-serif (Inter, DM Sans)",
  "humanist-sans": "Humanist sans-serif (Nunito, Lato)",
  "slab-serif": "Slab serif (Bitter, Arvo)",
  "display-sans": "Display sans-serif (Satoshi, Cabinet)",
  mono: "Monospace (JetBrains Mono)",
  "rounded-sans": "Rounded sans-serif (Poppins, Quicksand)",
  "classical-serif": "Classical serif (Merriweather, Playfair Display)",
};

const CORNER_DENSITY_LABELS: Record<string, string> = {
  "rounded-spacious":
    "Rounded corners with generous spacing — open and approachable",
  "rounded-compact":
    "Rounded corners with moderate spacing — balanced and clean",
  "sharp-spacious":
    "Sharp corners with generous spacing — precise and editorial",
  "sharp-compact":
    "Sharp corners with tight spacing — data-dense and technical",
};

const LAYOUT_LABELS: Record<string, string> = {
  sidebar: "a persistent sidebar navigation rail",
  topnav: "a top navigation bar",
  tabbar: "a tab bar at the bottom of the screen",
  minimal: "minimal chrome with no persistent navigation",
};

const HEADER_PLACEMENT_LABELS: Record<string, string> = {
  "sidebar-footer-profile":
    "sidebar navigation with user profile pinned at the bottom",
  "top-right-profile": "top header bar with profile in the top-right corner",
  "top-left-menu": "top header with logo on the left and centred content",
  "single-bar": "a minimal single bar with logo and one primary action",
};

const PLATFORM_LABELS: Record<string, string> = {
  desktop: "desktop only (optimised for large screens and mouse/keyboard)",
  "desktop-mobile": "desktop and mobile (fully responsive)",
  "mobile-first": "mobile first, with desktop support",
  pwa: "a Progressive Web App (installable, offline-capable)",
};

const MOTION_LABELS: Record<string, string> = {
  calm: "subtle transitions only — elements appear and disappear cleanly, without spectacle",
  lively:
    "smooth micro-interactions and fluid transitions — every action feels polished and responsive",
};

const LANDING_LAYOUT_LABELS: Record<string, string> = {
  "hero-center":
    "centred hero — large headline and CTA centred on a bold background",
  "hero-split": "split hero — copy on one side, visual on the other",
  "full-illustration":
    "full illustration — illustration fills the screen, copy overlaid",
  "dashboard-preview": "dashboard preview — the app UI as the hero visual",
  "minimal-text": "minimal text — clean headline only, no hero visual",
};

const LANDING_HERO_LABELS: Record<string, string> = {
  illustration: "a custom illustration specific to what the app does",
  "product-screenshot": "a product screenshot showing the core feature",
  "abstract-pattern": "an abstract geometric pattern",
  photography: "photography — real people, product, or environment",
  "icon-composition": "an icon composition built from feature icons",
};

const LANDING_TONE_LABELS: Record<string, string> = {
  "direct-outcome":
    "direct outcome — states the result plainly (e.g. 'Track every habit, hit every goal')",
  empowering:
    "empowering — speaks to the user's capability (e.g. 'Build without limits')",
  question:
    "provocative question — opens with curiosity (e.g. 'What if your spec wrote itself?')",
  "bold-claim": "bold claim — a confident statement of uniqueness",
  "calm-description":
    "calm description — simple and honest (e.g. 'A better way to manage your projects')",
};

const LANDING_CTA_LABELS: Record<string, string> = {
  "action-verb":
    "action verb — short and direct (e.g. 'Get started', 'Try it free')",
  outcome: "outcome-led — names the result (e.g. 'Build my app')",
  "low-friction":
    "low friction — reduces commitment (e.g. 'Explore for free', 'No signup needed')",
  urgency: "urgency — creates momentum (e.g. 'Start now', 'Launch today')",
};

const FEATURE_LABELS: Record<string, string> = {
  listings: "Product listings — browse and search items",
  checkout: "Checkout — cart and payment flow",
  reviews: "Reviews — ratings and user feedback",
  search: "Search and filters",
  profiles: "User profiles",
  messaging: "Messaging — direct communication between users",
  wishlist: "Wishlist — save items for later",
  recommendations: "Personalised recommendations",
  analytics: "Analytics — usage data and reporting",
  adminPanel: "Admin panel — moderation and management",
  notifications: "Notifications — alerts and updates",
  api: "API and integrations — connect external tools",
  feed: "Posts and activity feed",
  comments: "Comments and threaded replies",
  follow: "Follow and connect — social graph",
  groups: "Groups — private and public spaces",
  media: "Media upload — photos and video",
  events: "Events — create and join gatherings",
  articles: "Articles and editorial content",
  categories: "Categories and content taxonomy",
  rss: "RSS feed and syndication",
  seo: "SEO — search engine optimisation",
  calendar: "Calendar view",
  booking: "Booking and reservation flow",
  reminders: "Automated reminders and alerts",
  payments: "Payments and billing",
  logs: "Activity logs and history",
  progress: "Progress tracking and streaks",
  goals: "Goals and milestones",
  insights: "Insights and trends",
  export: "Data export",
  fixtures: "Fixtures and match schedule",
  members: "Member management",
  attendance: "Attendance tracking",
  documents: "Document storage and sharing",
  hr: "HR and people management",
  crm: "CRM and contact management",
  tickets: "Support tickets and helpdesk",
  inventory: "Inventory and asset tracking",
};

const SCREEN_LABELS: Record<string, string> = {
  home: "Dashboard / Home — the main view after sign-in",
  profile: "Profile & Settings — user account and preferences",
  list: "Browse / List — a filterable list of items",
  detail: "Detail view — deep-dive into a single item",
  create: "Create / Edit form",
  search: "Search and filter screen",
  analytics: "Analytics and reports",
  admin: "Admin panel",
  login: "Login and authentication",
  onboarding: "Onboarding flow for new users",
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin — full access, can manage everything",
  member: "User / Member — standard authenticated access",
  viewer: "Viewer — read-only access",
  editor: "Editor — can create and modify content",
  manager: "Manager — elevated access to manage others",
  guest: "Guest / Public — unauthenticated browsing",
};

const DATA_LABELS: Record<string, string> = {
  userProfiles: "User profiles — accounts, bios, and preferences",
  text: "Text content — written articles and documents",
  images: "Images and media",
  files: "Files and uploaded documents",
  events: "Events and calendar entries",
  transactions: "Transactions and payment records",
  messages: "Messages and conversation threads",
  analytics: "Usage analytics and metrics",
  listings: "Product listings with prices and details",
  forms: "Form submissions and structured data",
};

// ─── Public types ─────────────────────────────────────────────────────────────

export interface SpecBlueprint {
  sections: SpecBlueprintSection[];
}

export interface SpecBlueprintSection {
  id: string;
  heading: string;
  content: string;
  /** step number(s) this section corresponds to, for jump-back links */
  stepNumbers: number[];
}

/** Returns a label from a map, falling back gracefully to the raw key with spaces */
function label(map: Record<string, string>, key: string | undefined): string {
  if (!key) return "";
  return (
    map[key] ??
    key
      .replace(/-/g, " ")
      .replace(/([A-Z])/g, " $1")
      .trim()
  );
}

export function assembleSpec(answers: DesignFlowAnswers): SpecBlueprint {
  const sections: SpecBlueprintSection[] = [];

  const appTypeKey = answers.appType ?? "other";
  const audienceKeys = answers.audience ?? [];
  const audienceList =
    audienceKeys.length > 0
      ? audienceKeys.map((k) => AUDIENCE_LABELS[k] ?? k)
      : [];

  // ── 1. App overview ────────────────────────────────────────────────────────
  const appTypeLabel = APP_TYPE_LABELS[appTypeKey] ?? "a web application";
  const closestLabel = CLOSEST_EXAMPLE_LABELS[answers.closestExample ?? ""];
  let overview = `This app is ${appTypeLabel}`;
  if (closestLabel) overview += `, most closely matching ${closestLabel}`;
  overview += ".";
  if (audienceList.length > 0)
    overview += `\nDesigned for ${audienceList.join(" and ")}.`;
  if (answers.appScope === "mvp")
    overview +=
      "\nThe initial version is scoped as an MVP — core features only, built to validate the idea quickly.";
  else if (answers.appScope === "full")
    overview +=
      "\nThe spec covers the full planned feature set for a production-ready launch.";
  sections.push({
    id: "what",
    heading: "App overview",
    content: overview,
    stepNumbers: [1, 2, 3],
  });

  // ── 2. Audience ────────────────────────────────────────────────────────────
  if (audienceList.length > 0) {
    let audience = `The primary users are ${audienceList.join(" and ")}.\n`;
    if (
      audienceKeys.includes("consumers") ||
      audienceKeys.includes("community")
    ) {
      audience +=
        "The experience should feel approachable, trustworthy, and low-friction. Onboarding must be simple and self-serve.";
    } else if (audienceKeys.includes("businesses")) {
      audience +=
        "The experience should feel professional and efficient. Workflows matter more than aesthetics.";
    } else if (audienceKeys.includes("internalTeam")) {
      audience +=
        "The experience is optimised for daily use by team members. Speed and clarity take priority.";
    } else if (audienceKeys.includes("myself")) {
      audience +=
        "The app is for personal use — opinionated defaults and tight focus over flexibility.";
    }
    sections.push({
      id: "audience",
      heading: "Audience",
      content: audience,
      stepNumbers: [2],
    });
  }

  // ── 3. Visual style ────────────────────────────────────────────────────────
  const hasDesignAnswers =
    answers.vibe ||
    answers.colorDirection ||
    answers.typographyFeel ||
    answers.cornerDensity;
  if (hasDesignAnswers) {
    const parts: string[] = [];
    if (answers.vibe)
      parts.push(`Aesthetic: ${label(VIBE_LABELS, answers.vibe)}`);
    if (answers.colorDirection)
      parts.push(
        `Palette: ${label(COLOR_DIRECTION_LABELS, answers.colorDirection)}`,
      );
    if (answers.typographyFeel)
      parts.push(
        `Typography: ${label(TYPOGRAPHY_LABELS, answers.typographyFeel)}`,
      );
    if (answers.cornerDensity)
      parts.push(
        `Layout feel: ${label(CORNER_DENSITY_LABELS, answers.cornerDensity)}`,
      );
    if (answers.lightDarkDefault)
      parts.push(
        `Default mode: ${answers.lightDarkDefault === "dark" ? "dark mode" : "light mode"} (the other is always available)`,
      );
    if (answers.motionRegister)
      parts.push(`Motion: ${label(MOTION_LABELS, answers.motionRegister)}`);
    sections.push({
      id: "design",
      heading: "Visual style",
      content: parts.join("\n"),
      stepNumbers: [4, 5, 6, 7],
    });
  }

  // ── 4. Navigation ──────────────────────────────────────────────────────────
  if (answers.shellLayout) {
    const nav = label(LAYOUT_LABELS, answers.shellLayout);
    const chrome = answers.headerFooterPlacement
      ? `\nChrome: ${label(HEADER_PLACEMENT_LABELS, answers.headerFooterPlacement)}.`
      : "";
    sections.push({
      id: "shell",
      heading: "Navigation",
      content: `The app uses ${nav}.${chrome}`,
      stepNumbers: [12, 13, 14],
    });
  }

  // ── 5. Landing screen ──────────────────────────────────────────────────────
  const hasLanding =
    answers.landingLayoutPattern ||
    answers.landingHeroContentType ||
    answers.landingHeadlineTone ||
    answers.landingCTAStyle;
  if (hasLanding) {
    const parts: string[] = [];
    if (answers.landingLayoutPattern)
      parts.push(
        `Layout: ${label(LANDING_LAYOUT_LABELS, answers.landingLayoutPattern)}`,
      );
    if (answers.landingHeroContentType)
      parts.push(
        `Hero visual: ${label(LANDING_HERO_LABELS, answers.landingHeroContentType)}`,
      );
    if (answers.landingHeadlineTone)
      parts.push(
        `Headline tone: ${label(LANDING_TONE_LABELS, answers.landingHeadlineTone)}`,
      );
    if (answers.landingCTAStyle)
      parts.push(
        `Primary CTA: ${label(LANDING_CTA_LABELS, answers.landingCTAStyle)}`,
      );
    sections.push({
      id: "landing-screen",
      heading: "Landing screen",
      content: parts.join("\n"),
      stepNumbers: [8, 9, 10, 11],
    });
  }

  // ── 6. Features ────────────────────────────────────────────────────────────
  const features = answers.coreFeatures ?? [];
  if (features.length > 0) {
    const lines = features.map((f) => `• ${FEATURE_LABELS[f] ?? f}`);
    sections.push({
      id: "features",
      heading: "Features",
      content: lines.join("\n"),
      stepNumbers: [15],
    });
  } else {
    sections.push({
      id: "features",
      heading: "Features",
      content: "Features have not been selected yet.",
      stepNumbers: [15],
    });
  }

  // ── 7. Roles & permissions ─────────────────────────────────────────────────
  const roles = answers.rolesAccess ?? [];
  if (roles.length > 0) {
    let rolesText = `The app defines ${roles.length} role${roles.length > 1 ? "s" : ""}:\n`;
    rolesText += roles.map((r) => `• ${ROLE_LABELS[r] ?? r}`).join("\n");
    rolesText +=
      "\n\nEach role will have an appropriate set of permissions and a navigation view showing only what that role needs.";
    sections.push({
      id: "access",
      heading: "Roles & permissions",
      content: rolesText,
      stepNumbers: [16],
    });
  }

  // ── 8. Key screens ─────────────────────────────────────────────────────────
  const screens = answers.keyScreens ?? [];
  if (screens.length > 0) {
    let screensText = "The following screens have been identified:\n";
    screensText += screens.map((s) => `• ${SCREEN_LABELS[s] ?? s}`).join("\n");
    screensText +=
      "\n\nEach screen will be designed with appropriate empty, loading, and error states.";
    sections.push({
      id: "screens",
      heading: "Key screens",
      content: screensText,
      stepNumbers: [17],
    });
  }

  // ── 9. Data ────────────────────────────────────────────────────────────────
  const data = answers.dataContent ?? [];
  if (data.length > 0) {
    let dataText = "The app stores and manages the following types of data:\n";
    dataText += data.map((d) => `• ${DATA_LABELS[d] ?? d}`).join("\n");
    dataText +=
      "\n\nEach data type will need appropriate schema design, access controls, and UI representations.";
    sections.push({
      id: "data",
      heading: "Data",
      content: dataText,
      stepNumbers: [18],
    });
  }

  // ── 10. Platform ───────────────────────────────────────────────────────────
  if (answers.platformScope) {
    const platform = label(PLATFORM_LABELS, answers.platformScope);
    const mobile =
      answers.platformScope === "desktop"
        ? "No mobile adaptation is required."
        : "Responsive layouts and appropriate touch targets are required throughout.";
    sections.push({
      id: "platform",
      heading: "Platform",
      content: `Target: ${platform}.\n${mobile}`,
      stepNumbers: [20],
    });
  }

  // ── 11. Next steps ─────────────────────────────────────────────────────────
  sections.push({
    id: "next",
    heading: "Next steps",
    content:
      "This spec is ready to hand to a builder. Open it in Iterate to run audits, add depth, or generate a phased build plan. Export as Markdown to share or use directly with a build tool.",
    stepNumbers: [],
  });

  return { sections };
}

export function specToMarkdown(
  answers: DesignFlowAnswers,
  projectName: string,
): string {
  const blueprint = assembleSpec(answers);
  const lines: string[] = [
    `# ${projectName} — App Specification`,
    "",
    `_Generated by Caffeine · ${new Date().toLocaleDateString()}_`,
    "",
  ];
  for (const section of blueprint.sections) {
    lines.push(`## ${section.heading}`, "", section.content, "");
  }
  return lines.join("\n");
}
