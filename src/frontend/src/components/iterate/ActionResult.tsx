import { Button } from "@/components/ui/AppButton";
import type { ActionResult } from "@/lib/iterateActions";
import { CheckCircle2, X } from "lucide-react";

interface ActionResultProps {
  result: ActionResult;
  onAccept: () => void;
  onTweak: () => void;
  onDiscard: () => void;
}

export function ActionResultPanel({
  result,
  onAccept,
  onTweak,
  onDiscard,
}: ActionResultProps) {
  const ts = new Date(result.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="border border-border rounded-lg bg-card overflow-hidden"
      data-ocid="iterate.result_panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={14} className="text-accent" />
          <span className="text-sm font-semibold text-foreground">
            {result.actionName}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs-plus text-muted-foreground">{ts}</span>
          <button
            type="button"
            onClick={onDiscard}
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="iterate.result.close_button"
            aria-label="Discard result"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <p className="text-xs text-muted-foreground">{result.body}</p>
        {result.items.length > 0 && (
          <ul className="space-y-2">
            {result.items.map((item) => (
              <li
                key={item.substring(0, 32)}
                className="flex items-start gap-2.5 text-xs text-foreground"
                data-ocid={`iterate.result.item.${result.items.indexOf(item) + 1}`}
              >
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-border">
        <button
          type="button"
          onClick={onAccept}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-accent text-accent-fg hover:opacity-90 transition-opacity"
          data-ocid="iterate.result.confirm_button"
        >
          Accept
        </button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onTweak}
          data-ocid="iterate.result.secondary_button"
        >
          Tweak
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDiscard}
          data-ocid="iterate.result.cancel_button"
        >
          Discard
        </Button>
      </div>
    </div>
  );
}
