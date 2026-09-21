import type { JSX } from "react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAVIGATION_GUIDE } from "@config/navigationGuide";
import { useViewportStore } from "@store/viewportStore";

function readDismissed(): boolean {
  try {
    return window.sessionStorage.getItem(NAVIGATION_GUIDE.storageKey) === "1";
  } catch {
    return false;
  }
}

function writeDismissed(): void {
  try {
    window.sessionStorage.setItem(NAVIGATION_GUIDE.storageKey, "1");
  } catch {
    // Ignore private-mode / blocked storage.
  }
}

/**
 * First-visit educative overlay — desktop and mobile tips.
 * Dismissed for the rest of the session.
 */
export function NavigationGuideOverlay(): JSX.Element | null {
  const tier = useViewportStore((s) => s.tier);
  const [open, setOpen] = useState(false);
  const isMobile = tier === "small";
  const copy = isMobile ? NAVIGATION_GUIDE.mobile : NAVIGATION_GUIDE.desktop;

  useEffect(() => {
    if (readDismissed()) return;
    const timer = window.setTimeout(() => setOpen(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  const dismiss = (): void => {
    writeDismissed();
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="nav-guide"
          role="dialog"
          aria-modal="true"
          aria-labelledby="nav-guide-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-auto absolute inset-0 z-[60] flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className={`w-full rounded-sm border border-cyan-400/30 bg-[#08060f]/95 p-5 text-white shadow-[0_0_48px_rgba(34,211,238,0.16)] ${
              isMobile ? "max-w-sm" : "max-w-md p-6"
            }`}
          >
            <p
              id="nav-guide-title"
              className="font-[family-name:var(--font-display)] text-sm tracking-[0.28em] text-cyan-200/90 uppercase"
            >
              {copy.title}
            </p>
            <p className="mt-2 text-sm text-white/60">{copy.subtitle}</p>
            <ol className="mt-5 space-y-2.5 text-sm leading-relaxed text-white/80">
              {copy.steps.map((step) => (
                <li key={step} className="flex gap-2.5">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400/80"
                    aria-hidden
                  />
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <button
              type="button"
              onClick={dismiss}
              className="mt-6 w-full rounded-sm border border-cyan-400/40 bg-cyan-500/15 px-4 py-2.5 text-sm tracking-wide text-cyan-50 transition hover:border-cyan-300/60 hover:bg-cyan-500/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300/70"
            >
              {copy.cta}
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
