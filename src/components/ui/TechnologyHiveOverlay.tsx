import type { JSX } from "react";
import { useExperienceStore } from "@store/experienceStore";
import { useTechHiveStore } from "@store/techHiveStore";
import { useViewportStore } from "@store/viewportStore";
import { TECH_HIVE_LEGEND_ITEMS } from "@config/techHiveLegend";

/**
 * Screenshot-style UI chrome for the Technology Hive section.
 * Visual-only: does not block pointer events.
 */
export function TechnologyHiveOverlay(): JSX.Element | null {
  const activeSection = useExperienceStore((s) => s.activeSection);
  const selectedTechId = useTechHiveStore((s) => s.selectedTechId);
  const tier = useViewportStore((s) => s.tier);

  const show =
    tier !== "small" &&
    (activeSection === "skills" || selectedTechId !== null);

  if (!show) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between text-white/80">
      <header
        className={`px-[max(1rem,env(safe-area-inset-left))] pt-[max(1rem,env(safe-area-inset-top))]`}
      >
        <p className="font-[family-name:var(--font-display)] text-cyan-300/90 text-[11px] tracking-[0.35em] uppercase">
          TECHNOLOGY HIVE
        </p>
        <p className="mt-2 max-w-[18rem] text-sm text-white/55">
          Explore the technologies that power my work
        </p>
      </header>

      <footer className="relative pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-6">
          {TECH_HIVE_LEGEND_ITEMS.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 text-[10px] tracking-wide text-white/55"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.dotColor }}
                aria-hidden
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <div
          className={`absolute bottom-7 right-[max(1rem,env(safe-area-inset-right))] rounded-sm border border-white/10 bg-black/55 px-3 py-2 text-[11px] text-white/65 backdrop-blur-sm`}
        >
          <div className="flex items-center gap-2">
            <span
              className="inline-flex h-5 w-5 items-center justify-center rounded-sm border border-white/10"
              aria-hidden
            >
              <span className="text-cyan-200/90" style={{ fontSize: 10 }}>
                i
              </span>
            </span>
            Move cursor to explore
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span
              className="inline-flex h-5 w-5 items-center justify-center rounded-sm border border-white/10"
              aria-hidden
            >
              <span className="text-cyan-200/90" style={{ fontSize: 10 }}>
                C
              </span>
            </span>
            Click on a technology to view details
          </div>
        </div>
      </footer>
    </div>
  );
}

