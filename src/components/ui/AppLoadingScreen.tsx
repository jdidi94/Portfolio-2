import type { JSX } from "react";
import { motion } from "framer-motion";
import { useProgress } from "@react-three/drei";

interface AppLoadingScreenProps {
  /** When true, this is the React.lazy chunk fallback (no scene progress yet). */
  bootOnly?: boolean;
}

/**
 * Full-viewport boot screen while the canvas chunk and 3D assets load.
 */
export function AppLoadingScreen({
  bootOnly = false,
}: AppLoadingScreenProps): JSX.Element {
  const { progress, active } = useProgress();
  const showProgress = !bootOnly && active;
  const label = bootOnly
    ? "Preparing experience"
    : showProgress
      ? "Loading scene"
      : "Almost ready";
  const percent = bootOnly ? null : Math.min(100, Math.round(progress));

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-[#050508]"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      <div className="flex flex-col items-center gap-5 px-6">
        <p className="font-[family-name:var(--font-display)] text-sm tracking-[0.35em] text-cyan-300/90 uppercase">
          Neon Portfolio
        </p>
        <motion.div
          className="h-10 w-10 rounded-full border-2 border-cyan-400/25 border-t-cyan-300/90"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, ease: "linear", repeat: Infinity }}
          aria-hidden
        />
        <div className="text-center">
          <p className="text-xs tracking-wide text-white/60">{label}</p>
          {percent !== null ? (
            <p className="mt-1 text-sm tabular-nums text-cyan-100/85">
              {percent}%
            </p>
          ) : null}
        </div>
        {!bootOnly ? (
          <div className="h-1 w-44 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-cyan-400/80"
              initial={{ width: 0 }}
              animate={{ width: `${percent ?? 8}%` }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
