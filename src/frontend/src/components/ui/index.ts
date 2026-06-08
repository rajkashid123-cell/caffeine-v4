/**
 * App UI primitive barrel export.
 *
 * Import from this file to get all app-specific primitives:
 *   import { AppCard, AppButton, AppBadge, AppInput, AppAvatar } from "@/components/ui";
 *
 * shadcn/ui primitives (Button, Card, Badge, Input, etc.) are also importable
 * from their individual files:  @/components/ui/button, etc.
 *
 * Rule: use App* prefixed primitives for app-specific content;
 * they enforce the design system and token rules.
 */

// ── App-specific design system primitives ───────────────────────────
export {
  AppButton,
  appButtonVariants,
  type AppButtonProps,
} from "./AppButton";

export {
  AppBadge,
  type AppBadgeProps,
} from "./AppBadge";

export {
  AppCard,
  AppCardTitle,
  AppCardBody,
  AppCardFooter,
  AppCardDivider,
  AppCardLabel,
  appCardVariants,
  type AppCardProps,
} from "./AppCard";

export { AppInput, type AppInputProps } from "./AppInput";

export { AppAvatar, type AppAvatarProps } from "./AppAvatar";

// ── shadcn re-exports (convenience) ──────────────────────────────
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./tooltip";

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "./avatar";

export { Input } from "./input";
