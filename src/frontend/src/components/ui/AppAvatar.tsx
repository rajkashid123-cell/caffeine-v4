import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";

/**
 * AppAvatar — circular avatar with image or initials fallback.
 * No inline styles. All sizing via Tailwind tokens.
 */
const avatarVariants = cva(
  "relative shrink-0 overflow-hidden rounded-full flex items-center justify-center font-medium text-foreground select-none bg-muted",
  {
    variants: {
      size: {
        xs: "size-5 text-2xs",
        sm: "size-7 text-xs",
        md: "size-9 text-sm",
        lg: "size-12 text-base",
        xl: "size-16 text-xl",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface AppAvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  /** Image src — if absent or broken, initials are shown */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** Display name — first two chars used as initials fallback */
  name?: string;
  /** Optional explicit initials override */
  initials?: string;
  /** Optional accent color class for the fallback background */
  colorClass?: string;
}

export function AppAvatar({
  className,
  size,
  src,
  alt,
  name,
  initials,
  colorClass,
  ...props
}: AppAvatarProps) {
  const fallback =
    initials ??
    (name
      ? name
          .split(" ")
          .map((w) => w[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "?");

  return (
    <div
      className={cn(avatarVariants({ size }), colorClass, className)}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt ?? name ?? "avatar"}
          className="size-full object-cover"
          onError={(e) => {
            // On image load error, hide the img and show initials
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <span aria-hidden>{fallback}</span>
      )}
    </div>
  );
}
