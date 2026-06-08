import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ChipProps {
  label: string;
  onRemove?: () => void;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Chip({
  label,
  onRemove,
  active,
  onClick,
  className,
}: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs-plus font-medium transition-colors",
        active
          ? "bg-accent text-accent-foreground"
          : "bg-muted text-muted-foreground hover:bg-muted/80",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => (e.key === "Enter" || e.key === " ") && onClick()
          : undefined
      }
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:text-destructive transition-colors"
          aria-label={`Remove ${label}`}
        >
          <X size={9} />
        </button>
      )}
    </span>
  );
}
