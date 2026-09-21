import type { JSX } from "react";
import { profile } from "@data/profile";
import {
  SEO_CONFIG,
  linkedInShareUrl,
  twitterShareUrl,
} from "@config/seo";

type ShareTone = "cyan" | "purple";

interface SocialShareButtonsProps {
  tone?: ShareTone;
  size?: "sm" | "md";
  className?: string;
}

const TONE_CLASS: Record<ShareTone, string> = {
  cyan: "border-cyan-400/30 bg-cyan-500/10 text-cyan-100/90 hover:border-cyan-300/50 hover:bg-cyan-500/20 focus-visible:outline-cyan-300/70",
  purple:
    "border-purple-300/30 bg-purple-500/10 text-purple-50 hover:border-purple-200/50 hover:bg-purple-500/20 focus-visible:outline-purple-300/70",
};

const SIZE_CLASS = {
  sm: "h-9 px-2.5 text-[10px]",
  md: "h-11 px-3 text-xs",
} as const;

/**
 * LinkedIn + X share actions for the portfolio page (uses SEO / OG portrait).
 */
export function SocialShareButtons({
  tone = "cyan",
  size = "md",
  className = "",
}: SocialShareButtonsProps): JSX.Element {
  const pageUrl =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : SEO_CONFIG.siteUrl;
  const shareText = `${profile.name} · ${profile.title}`;

  return (
    <div
      role="group"
      aria-label="Share portfolio"
      className={`pointer-events-auto flex flex-wrap items-center gap-2 ${className}`}
    >
      <a
        href={linkedInShareUrl(pageUrl)}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on LinkedIn"
        aria-label="Share on LinkedIn"
        className={`inline-flex items-center justify-center gap-1.5 rounded-sm border tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${TONE_CLASS[tone]} ${SIZE_CLASS[size]}`}
      >
        <svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
        Share
      </a>
      <a
        href={twitterShareUrl(pageUrl, shareText)}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on X"
        aria-label="Share on X"
        className={`inline-flex items-center justify-center gap-1.5 rounded-sm border tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${TONE_CLASS[tone]} ${SIZE_CLASS[size]}`}
      >
        <svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
        </svg>
        Post
      </a>
    </div>
  );
}
