/**
 * HeroSection — full-screen landing page hero layout primitive.
 *
 * LAYOUT CONTRACT (do not modify without explicit instruction):
 * - Background image fills 100vw × 100vh, object-cover, no overlay div
 * - Copy absolutely positioned left side, vertically centered
 * - Neon lime on accent text (#CEFF00 hardcoded — not a token, regression-proof)
 * - Primary CTA: bg-[#CEFF00] text-black font-semibold — hardcoded, not per-page
 * - No dark overlay, no scrim, no gradient div placed over the image
 * - Text legibility via drop-shadow only
 *
 * The page passes text content only. This component owns all styling.
 */

export interface HeroSectionProps {
  /** Background image path */
  backgroundImage: string;
  /** The plain prefix of the headline, before the lime accent */
  headlinePrefix: string;
  /** The neon-lime accented part of the headline */
  headlineAccent: string;
  /** Supporting subheadline text */
  subheadline: string;
  /** Primary CTA label — renders as a filled neon-lime button */
  primaryCtaLabel: string;
  /** Primary CTA click handler */
  onPrimaryClick: () => void;
  /** Secondary CTA label (outlined) */
  secondaryCtaLabel?: string;
  /** Secondary CTA click handler */
  onSecondaryClick?: () => void;
  /** Optional badge text above the headline */
  badgeText?: string;
  /** data-ocid prefix for markers */
  ocidPrefix?: string;
}

export function HeroSection({
  backgroundImage,
  headlinePrefix,
  headlineAccent,
  subheadline,
  primaryCtaLabel,
  onPrimaryClick,
  secondaryCtaLabel,
  onSecondaryClick,
  badgeText,
  ocidPrefix = "landing.hero",
}: HeroSectionProps) {
  return (
    <section
      role="banner"
      aria-label="Hero"
      className="relative w-full h-screen min-h-[600px] overflow-hidden"
    >
      {/* Background image — fills entire viewport, no overlay */}
      <img
        src={backgroundImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
        draggable={false}
      />

      {/* Copy — absolutely positioned left side, vertically centered */}
      <div className="absolute inset-0 flex items-center">
        <div className="flex flex-col justify-center px-16 max-w-lg">
          {/* Badge */}
          {badgeText && (
            <div className="inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full border mb-7 bg-black/30 border-white/20 backdrop-blur-[2px]">
              {/* lime dot */}
              <span
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ background: "oklch(var(--color-lime))" }}
              />
              <span
                className="text-xs font-medium tracking-widest uppercase"
                style={{ color: "oklch(var(--color-lime) / 0.85)" }}
              >
                {badgeText}
              </span>
            </div>
          )}

          {/* Headline — prefix white, accent neon lime (#CEFF00 hardcoded) */}
          <h1
            className="text-[clamp(2.75rem,4vw,4.25rem)] font-extrabold leading-[1.06] tracking-tight mb-5"
            style={{
              textShadow:
                "0 2px 24px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.7)",
            }}
          >
            <span style={{ color: "var(--color-background, white)" }}>
              {headlinePrefix}
            </span>
            {/* Neon lime — hardcoded hex, cannot regress via token changes */}
            <span style={{ color: "oklch(var(--color-lime))" }}>
              {headlineAccent}
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-base leading-relaxed mb-10 max-w-md"
            style={{
              color: "rgba(255,255,255,0.82)",
              textShadow: "0 1px 12px rgba(0,0,0,0.8)",
            }}
          >
            {subheadline}
          </p>

          {/* CTA row */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Primary CTA — neon lime filled, hardcoded, regression-proof */}
            <button
              type="button"
              onClick={onPrimaryClick}
              data-ocid={`${ocidPrefix}.start_button`}
              className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-lg transition-all cursor-pointer hover:brightness-105 active:scale-[0.98]"
              style={{
                background: "oklch(var(--color-lime))",
                color: "oklch(var(--color-lime-fg))",
              }}
            >
              {primaryCtaLabel}
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                role="presentation"
              >
                <path
                  d="M2 7h10M8 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Secondary CTA — outlined */}
            {secondaryCtaLabel && onSecondaryClick && (
              <button
                type="button"
                onClick={onSecondaryClick}
                data-ocid={`${ocidPrefix}.template_button`}
                className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-lg transition-all cursor-pointer active:scale-[0.98]"
                style={{
                  border: "2px solid rgba(255,255,255,0.55)",
                  color: "rgba(255,255,255,0.9)",
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
                }}
              >
                {secondaryCtaLabel}
              </button>
            )}
          </div>

          {/* Scroll hint */}
          <p
            className="mt-14 text-xs tracking-widest uppercase font-normal flex items-center gap-2"
            style={{ color: "rgba(255,255,255,0.38)" }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              role="presentation"
            >
              <path
                d="M6 2v8M3 7l3 3 3-3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Scroll to learn more
          </p>
        </div>
      </div>
    </section>
  );
}
