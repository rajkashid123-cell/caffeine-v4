import type { Project } from "@/types";

export type ActionCategory = "Review" | "Generate" | "Improve";

export interface IterateAction {
  id: string;
  category: ActionCategory;
  icon: string;
  name: string;
  description: string;
}

export interface ActionResult {
  actionId: string;
  actionName: string;
  title: string;
  body: string;
  items: string[];
  timestamp: number;
}

export const ITERATE_ACTIONS: IterateAction[] = [
  // Review
  {
    id: "spec-audit",
    category: "Review",
    icon: "ClipboardCheck",
    name: "Spec Audit",
    description: "Check the spec for gaps, contradictions, and missing details",
  },
  {
    id: "visual-pass",
    category: "Review",
    icon: "Eye",
    name: "Visual Pass",
    description: "Review design consistency, spacing, and visual hierarchy",
  },
  {
    id: "feature-review",
    category: "Review",
    icon: "CheckSquare",
    name: "Feature Review",
    description: "Validate features against audience needs and app goals",
  },
  {
    id: "consistency-check",
    category: "Review",
    icon: "Layers",
    name: "Consistency Check",
    description: "Ensure tokens, patterns, and language are used throughout",
  },
  // Generate
  {
    id: "alternative-headline",
    category: "Generate",
    icon: "Type",
    name: "Alternative Headline",
    description: "Generate headline variations for the landing screen",
  },
  {
    id: "user-story",
    category: "Generate",
    icon: "User",
    name: "User Story",
    description: "Write user stories for a key feature or screen",
  },
  {
    id: "acceptance-criteria",
    category: "Generate",
    icon: "ListChecks",
    name: "Acceptance Criteria",
    description: "Generate acceptance criteria for a chosen feature",
  },
  {
    id: "spec-summary",
    category: "Generate",
    icon: "FileText",
    name: "Spec Summary",
    description: "Produce a plain-language summary of the full spec",
  },
  // Improve
  {
    id: "simplify-language",
    category: "Improve",
    icon: "Feather",
    name: "Simplify Language",
    description:
      "Make the spec clearer and more readable for non-technical people",
  },
  {
    id: "sharpen-scope",
    category: "Improve",
    icon: "Crosshair",
    name: "Sharpen Scope",
    description: "Remove vague or ambiguous statements from the spec",
  },
  {
    id: "add-examples",
    category: "Improve",
    icon: "Lightbulb",
    name: "Add Examples",
    description: "Add concrete examples to abstract spec sections",
  },
  {
    id: "navigation-review",
    category: "Improve",
    icon: "Map",
    name: "Navigation Review",
    description: "Check if the navigation structure is clear and logical",
  },
];

export function generateActionResult(
  action: IterateAction,
  project: Project,
): ActionResult {
  const name = project.name ?? "Untitled";
  const hasSpec = (project.specSections?.length ?? 0) > 0;
  const sectionCount = project.specSections?.length ?? 0;

  let title = "";
  let body = "";
  let items: string[] = [];

  switch (action.id) {
    case "spec-audit":
      title = `Spec audit for ${name}`;
      body = `Reviewed ${hasSpec ? sectionCount : 0} spec sections. The spec is ${hasSpec ? "taking shape" : "still early — focus on defining the core idea first"}.`;
      items = hasSpec
        ? [
            "Audience definition is specific enough to guide feature decisions",
            "Core features are listed but some lack acceptance criteria",
            "Data model is referenced but not fully specified",
            "Role definitions exist — consider adding permission matrices",
          ]
        : [
            "No spec sections found — start with the Design flow",
            "Define your audience before adding features",
            "Pick an app type to unlock contextual suggestions",
          ];
      break;

    case "visual-pass":
      title = `Visual pass for ${name}`;
      body = `Checked visual consistency across the spec. ${hasSpec ? "The design direction is set — here are refinements to consider." : "No design choices recorded yet."}`;
      items = hasSpec
        ? [
            "Color direction is defined — verify contrast ratios meet WCAG AA",
            "Typography feel is set — ensure heading hierarchy is explicit",
            "Corner density chosen — apply consistently to all components",
            "Motion register specified — respect prefers-reduced-motion",
          ]
        : [
            "Choose a color direction in the Design flow",
            "Set a typography feel (modern, classic, playful)",
            "Pick a corner density for the UI",
          ];
      break;

    case "feature-review":
      title = `Feature review for ${name}`;
      body = `Evaluated features against the target audience. ${hasSpec ? "The core loop is identifiable — here is how to strengthen it." : "Add features in the Design flow to get a review."}`;
      items = hasSpec
        ? [
            "Primary feature is clear and well-scoped for an MVP",
            "Secondary features add value without bloating the core loop",
            "Consider deferring advanced features to a later phase",
            "One feature lacks a defined error state — add it before building",
          ]
        : [
            "Define your core features in the Design flow",
            "Start with one primary feature that solves the main problem",
            "Add secondary features only after the core loop works",
          ];
      break;

    case "consistency-check":
      title = `Consistency check for ${name}`;
      body = `Scanned the spec for token usage, naming, and pattern consistency. ${hasSpec ? "Most patterns are aligned — a few spots need attention." : "No spec to check yet."}`;
      items = hasSpec
        ? [
            "Design tokens are referenced consistently across sections",
            "Screen names use the same convention throughout",
            "Role labels match the navigation items they correspond to",
            "One section uses different terminology for the same concept",
          ]
        : [
            "Build your spec in the Design flow first",
            "Use consistent naming for screens, roles, and features",
            "Refer to design tokens by name rather than raw values",
          ];
      break;

    case "alternative-headline":
      title = `Headline options for ${name}`;
      body =
        "Generated headline variations based on the app type and audience. Pick one that best captures the value proposition.";
      items = [
        `"${name} — everything you need, nothing you don't"`,
        `"The simplest way to run ${name.toLowerCase()}"`,
        `"${name} built for how you actually work"`,
        `"Finally, a ${name.toLowerCase()} that makes sense"`,
      ];
      break;

    case "user-story":
      title = `User stories for ${name}`;
      body =
        "Wrote user stories for the primary feature. Use these to validate scope and guide implementation.";
      items = [
        `As a user, I want to open ${name} and see my dashboard immediately so I know where to start.`,
        "As a user, I want to complete the core action in under three taps so the app feels fast.",
        "As a user, I want to see clear feedback after every action so I know it worked.",
        "As a user, I want to recover easily from mistakes so I feel safe exploring.",
      ];
      break;

    case "acceptance-criteria":
      title = `Acceptance criteria for ${name}`;
      body = `Defined what "done" looks like for the primary feature. Share these with anyone building the app.`;
      items = [
        "Given the user is on the home screen, when they tap the primary CTA, then the core flow starts within 200ms.",
        "Given the user completes the core action, when they finish, then a success state appears immediately.",
        "Given the user encounters an error, when it happens, then a clear recovery path is shown with a retry option.",
        "Given the user returns after 7 days, when they open the app, then their previous state is restored.",
      ];
      break;

    case "spec-summary":
      title = `Summary of ${name}`;
      body =
        "A plain-language overview of what this app is, who it is for, and what it does. Use this to align stakeholders or onboard collaborators.";
      items = [
        `${name} is a ${hasSpec ? "specified" : "draft"} app designed for a target audience.`,
        "The core value is solving a specific problem through a focused feature set.",
        "It uses a standard layout with system theme support.",
        `Next step: ${hasSpec ? "review the spec with stakeholders before building" : "complete the Design flow to generate the full spec"}.`,
      ];
      break;

    case "simplify-language":
      title = `Simplified language for ${name}`;
      body =
        "Scanned the spec for technical jargon and complex phrasing. Here's what to simplify so anyone can read it.";
      items = hasSpec
        ? [
            "Replace 'authentication flow' with 'how users log in' throughout the spec",
            "'Data persistence layer' can become 'where your app saves information'",
            "Avoid acronyms without explanation — write them out in full on first use",
            "Short sentences work better than long compound ones — split anything over 25 words",
          ]
        : [
            "Complete the Design flow first to generate spec content",
            "Plain language starts with clear audience definition",
            "Use everyday words for features instead of technical terms",
          ];
      break;

    case "sharpen-scope":
      title = `Sharpened scope for ${name}`;
      body =
        "Identified vague or open-ended statements that could cause confusion during a build.";
      items = hasSpec
        ? [
            "'Users can manage their content' — too broad. Specify what actions: create, edit, archive, delete?",
            "'Fast performance' needs a number — target under 200ms for page loads",
            "'Admin controls' should list exactly which settings admins can change",
            "Remove 'and more' at the end of any feature list — list everything or cut it",
          ]
        : [
            "Build your spec first — scope sharpening works on real content",
            "Define what the app does AND what it doesn't do",
            "Every feature should have a clear boundary",
          ];
      break;

    case "add-examples":
      title = `Examples added to ${name}`;
      body =
        "Generated concrete examples for abstract sections to make the spec easier to understand and implement.";
      items = hasSpec
        ? [
            `"A user browses ${name} on their phone and taps 'Create' — they see a clean form with three fields"
`,
            "Error state example: 'If the form is submitted with a missing field, a red inline message appears under that field'",
            "Success state example: 'After saving, a green toast notification appears for 3 seconds'",
            "Edge case example: 'If two users edit the same item simultaneously, the most recent save wins'",
          ]
        : [
            "Start the Design flow to define features that can be given examples",
            "Concrete examples make specs 3x easier to build from",
            "Think about happy path, error state, and empty state for each feature",
          ];
      break;

    case "navigation-review":
      title = `Navigation review for ${name}`;
      body =
        "Reviewed the navigation structure for clarity, logical flow, and discoverability.";
      items = hasSpec
        ? [
            "Primary navigation is well-structured — users can reach any section in 2 taps",
            "Consider adding a breadcrumb or back button to nested views",
            "The main CTA is clearly placed — ensure it's consistent across all screens",
            "Footer navigation should only contain secondary actions, not core features",
          ]
        : [
            "Define your key screens in the Design flow first",
            "Good navigation starts with knowing your 3-5 most important screens",
            "Users should always be able to get home in one tap",
          ];
      break;

    default:
      title = `Result for ${name}`;
      body = "Action completed. Review the output below.";
      items = ["No specific output for this action."];
  }

  return {
    actionId: action.id,
    actionName: action.name,
    title,
    body,
    items,
    timestamp: Date.now(),
  };
}
