import type { CSSProperties, JSX } from "react";
import type { SocialLink } from "@shared-types/content";
import { getResumeDownloadName } from "@utils/resumeDownloadName";

type SocialIconTone = "cyan" | "purple";

interface SocialLinkIconsProps {
  links: readonly SocialLink[];
  tone?: SocialIconTone;
  size?: "sm" | "md" | "lg";
  /** Show text label under / beside the icon. */
  showLabels?: boolean;
  layout?: "row" | "grid";
  className?: string;
  style?: CSSProperties;
}

const TONE_CLASS: Record<SocialIconTone, string> = {
  cyan: "border-cyan-400/30 bg-cyan-500/10 text-cyan-100/90 hover:border-cyan-300/50 hover:bg-cyan-500/20 focus-visible:outline-cyan-300/70",
  purple:
    "border-purple-300/30 bg-purple-500/10 text-purple-50 hover:border-purple-200/50 hover:bg-purple-500/20 focus-visible:outline-purple-300/70",
};

const SIZE_CLASS = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-14 w-14",
} as const;

const ICON_SIZE = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

function SocialGlyph({
  icon,
  size,
}: {
  icon: SocialLink["icon"];
  size: number;
}): JSX.Element {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (icon) {
    case "github":
      return (
        <svg {...common}>
          <path d="M9 19c-4.3 1.4-4.3-2.1-6-2.5M15 22v-3.9a3.4 3.4 0 0 0-1-2.6c3.3-.4 6.8-1.6 6.8-7.3a5.6 5.6 0 0 0-1.5-3.9 5.2 5.2 0 0 0-.1-3.9S17.3 1.2 15 2.8a10.5 10.5 0 0 0-6 0C6.7 1.2 5.6.1 5.6.1a5.2 5.2 0 0 0-.1 3.9A5.6 5.6 0 0 0 4 9.2c0 5.7 3.5 6.9 6.8 7.3a3.4 3.4 0 0 0-1 2.6V22" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case "email":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );
    case "resume":
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M8 13h8M8 17h8M8 9h2" />
        </svg>
      );
    case "website":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}

/**
 * Clickable social / contact icons with accessible labels.
 */
export function SocialLinkIcons({
  links,
  tone = "cyan",
  size = "md",
  showLabels = false,
  layout = "row",
  className = "",
  style,
}: SocialLinkIconsProps): JSX.Element {
  const layoutClass =
    layout === "grid"
      ? "grid grid-cols-2 gap-3 sm:grid-cols-4"
      : "flex flex-wrap items-center gap-2";

  return (
    <nav
      aria-label="Contact links"
      className={`pointer-events-auto ${layoutClass} ${className}`}
      style={style}
    >
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target={link.icon === "email" ? undefined : "_blank"}
          rel={link.icon === "email" ? undefined : "noopener noreferrer"}
          download={
            link.icon === "resume" ? getResumeDownloadName() : undefined
          }
          title={link.label}
          aria-label={link.label}
          className={`inline-flex items-center justify-center rounded-sm border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${TONE_CLASS[tone]} ${
            showLabels
              ? "gap-2 px-3 py-2 text-xs tracking-wide"
              : SIZE_CLASS[size]
          }`}
        >
          <SocialGlyph icon={link.icon} size={ICON_SIZE[size]} />
          {showLabels ? <span>{link.label}</span> : null}
        </a>
      ))}
    </nav>
  );
}
