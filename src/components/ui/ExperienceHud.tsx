import type { JSX } from "react";
import { motion } from "framer-motion";
import { useExperienceStore } from "@store/experienceStore";
import { WAYPOINTS } from "@config/waypoints";

export function ExperienceHud(): JSX.Element {
  const mode = useExperienceStore((s) => s.mode);
  const focusObjectId = useExperienceStore((s) => s.focusObjectId);
  const isAudioEnabled = useExperienceStore((s) => s.isAudioEnabled);
  const hoveredObjectId = useExperienceStore((s) => s.hoveredObjectId);

  const focusLabel = WAYPOINTS.find((wp) => wp.id === focusObjectId)?.label;
  const hoverLabel = WAYPOINTS.find((wp) => wp.id === hoveredObjectId)?.label;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6 text-white/80">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <p className="font-[family-name:var(--font-display)] text-sm tracking-[0.35em] text-cyan-300/90 uppercase">
            Neon Portfolio
          </p>
          <p className="mt-2 max-w-sm text-sm text-white/55">
            Experience engine — placeholder space. Content arrives later.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="rounded-sm border border-white/10 bg-black/40 px-3 py-1 text-xs tracking-wide text-white/50 backdrop-blur-sm">
            Mode · {mode}
            {isAudioEnabled ? " · audio on" : " · audio off"}
          </p>
          {!isAudioEnabled ? (
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
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div className="space-y-1 text-xs text-white/45">
          <p>
            Click an orb to travel · Esc returns · ← → cycle · M toggles audio
          </p>
          <p aria-live="polite">
            {focusLabel
              ? `Focused: ${focusLabel}`
              : hoverLabel
                ? `Hover: ${hoverLabel}`
                : "Exploring"}
          </p>
        </div>
      </motion.footer>
    </div>
  );
}
