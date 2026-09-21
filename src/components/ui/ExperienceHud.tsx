import type { JSX } from "react";
import { motion } from "framer-motion";
import { useExperienceStore } from "@store/experienceStore";
import { useViewportStore } from "@store/viewportStore";
import { WAYPOINTS } from "@config/waypoints";
import { profile } from "@data/profile";
import { socialLinks } from "@data/social";
import { SocialLinkIcons } from "@components/ui/SocialLinkIcons";
import { getResumeDownloadName } from "@utils/resumeDownloadName";

/** Thin chrome — content lives on glass card faces; CTAs stay reachable. */
export function ExperienceHud(): JSX.Element {
  const mode = useExperienceStore((s) => s.mode);
  const focusObjectId = useExperienceStore((s) => s.focusObjectId);
  const activeSection = useExperienceStore((s) => s.activeSection);
  const isAudioEnabled = useExperienceStore((s) => s.isAudioEnabled);
  const hoveredObjectId = useExperienceStore((s) => s.hoveredObjectId);
  const tier = useViewportStore((s) => s.tier);

  const focusLabel = WAYPOINTS.find((wp) => wp.id === focusObjectId)?.label;
  const hoverLabel = WAYPOINTS.find((wp) => wp.id === hoveredObjectId)?.label;
  const isCompact = tier !== "desktop";
  const isSmall = tier === "small";

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-10 flex flex-col justify-between text-white/80 ${
        isCompact
          ? "px-[max(0.75rem,env(safe-area-inset-left))] pt-[max(0.75rem,env(safe-area-inset-top))] pr-[max(0.75rem,env(safe-area-inset-right))] pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4"
          : "p-6"
      }`}
    >
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex items-start justify-between gap-3"
      >
        <div className="min-w-0">
          <p
            className={`font-[family-name:var(--font-display)] tracking-[0.35em] text-cyan-300/90 uppercase ${
              isSmall ? "text-[10px]" : isCompact ? "text-[11px]" : "text-sm"
            }`}
          >
            {profile.name}
          </p>
          {isCompact ? (
            <p
              className={`mt-1 text-white/50 ${
                isSmall ? "max-w-[11rem] text-[10px]" : "max-w-[14rem] text-[11px]"
              }`}
            >
              {profile.title}
            </p>
          ) : (
            <p className="mt-2 max-w-sm text-sm text-white/55">
              {profile.title} · {profile.availability}
            </p>
          )}
          <SocialLinkIcons
            links={socialLinks}
            tone="cyan"
            size={isSmall ? "sm" : "md"}
            className="mt-3"
          />
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <p
            className={`rounded-sm border border-white/10 bg-black/40 tracking-wide text-white/50 backdrop-blur-sm ${
              isSmall
                ? "max-w-[9.5rem] truncate px-2 py-0.5 text-[9px]"
                : isCompact
                  ? "px-2 py-0.5 text-[10px]"
                  : "px-3 py-1 text-xs"
            }`}
          >
            {mode}
            {activeSection !== "none" ? ` · ${activeSection}` : ""}
            {isCompact
              ? ""
              : isAudioEnabled
                ? " · audio on"
                : " · audio off"}
          </p>
          {!isAudioEnabled && !isCompact ? (
            <p className="rounded-sm border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs tracking-wide text-cyan-200/80 backdrop-blur-sm">
              Press M to enable audio
            </p>
          ) : null}
        </div>
      </motion.header>

      <motion.footer
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        className="flex flex-wrap items-end justify-between gap-3"
      >
        {!isSmall ? (
          <div
            className={`space-y-1 text-white/45 ${
              isCompact ? "text-[10px]" : "text-xs"
            }`}
          >
            <p>
              {isCompact
                ? "Scroll or ↑↓ for sections · click a card to focus · empty / Esc = home"
                : "Scroll or ↑↓ jump sections · click a card to focus · click empty or Esc to go home · ←→ cycle · M audio"}
            </p>
            <p aria-live="polite">
              {focusLabel
                ? `Focused: ${focusLabel}`
                : hoverLabel
                  ? `Hover: ${hoverLabel}`
                  : "Exploring the corridor"}
            </p>
          </div>
        ) : (
          <div />
        )}
        {!isSmall ? (
          <a
            href={profile.resumeUrl}
            download={getResumeDownloadName()}
            className="pointer-events-auto rounded-sm border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-xs tracking-wide text-cyan-100/90 backdrop-blur-sm transition hover:border-cyan-300/50 hover:bg-cyan-500/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300/70"
          >
            Download resume
          </a>
        ) : null}
      </motion.footer>
    </div>
  );
}
