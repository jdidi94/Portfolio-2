import type { JSX } from "react";
import { useMobileMenuStore } from "@store/mobileMenuStore";
import { useViewportStore } from "@store/viewportStore";

/**
 * Top-right hamburger / close toggle for the small-viewport menu.
 */
export function MobileMenuButton(): JSX.Element | null {
  const tier = useViewportStore((s) => s.tier);
  const isOpen = useMobileMenuStore((s) => s.isOpen);
  const toggle = useMobileMenuStore((s) => s.toggle);

  if (tier !== "small") {
    return null;
  }

  return (
    <button
      type="button"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      onClick={toggle}
      className="pointer-events-auto absolute top-[max(0.75rem,env(safe-area-inset-top))] right-[max(0.75rem,env(safe-area-inset-right))] z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-sm border border-white/15 bg-black/70 backdrop-blur-sm transition hover:border-purple-300/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-300/70"
    >
      <span
        className={`block h-0.5 w-4 bg-white/85 transition ${
          isOpen ? "translate-y-[4px] rotate-45" : ""
        }`}
      />
      <span
        className={`block h-0.5 w-4 bg-white/85 transition ${
          isOpen ? "opacity-0" : ""
        }`}
      />
      <span
        className={`block h-0.5 w-4 bg-white/85 transition ${
          isOpen ? "-translate-y-[4px] -rotate-45" : ""
        }`}
      />
    </button>
  );
}
