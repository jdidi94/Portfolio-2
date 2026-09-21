import type { JSX } from "react";
import { motion } from "framer-motion";
import { useExperienceStore } from "@store/experienceStore";
import { HIVE_WAYPOINT_ID } from "@utils/techIds";

/**
 * HTML loading cue while Technology Hive icon textures suspend / stream in.
 */
export function TechHiveLoadingOverlay(): JSX.Element | null {
  const activeSection = useExperienceStore((s) => s.activeSection);
  const focusObjectId = useExperienceStore((s) => s.focusObjectId);
  const cameraDestinationId = useExperienceStore((s) => s.cameraDestinationId);
  const visible =
    activeSection === "skills" ||
    focusObjectId === HIVE_WAYPOINT_ID ||
    cameraDestinationId === HIVE_WAYPOINT_ID;

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-15 flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="Loading technologies"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-3 rounded-sm border border-cyan-400/25 bg-black/70 px-5 py-4 backdrop-blur-md"
      >
        <motion.div
          className="h-8 w-8 rounded-full border-2 border-cyan-400/25 border-t-cyan-300/90"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.85, ease: "linear", repeat: Infinity }}
          aria-hidden
        />
        <p className="text-[10px] tracking-[0.28em] text-cyan-200/80 uppercase">
          Loading technologies
        </p>
      </motion.div>
    </div>
  );
}
