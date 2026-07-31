import type { JSX } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "@data/projects";
import { technologies } from "@data/technologies";
import { TECH_HIVE_CONFIG } from "@config/techHive";
import { resolveTechHiveVisual } from "@config/techHiveVisual";
import { useTechHiveStore } from "@store/techHiveStore";
import { useExperienceStore } from "@store/experienceStore";
import { useProjectCarouselStore } from "@store/projectCarouselStore";
import { useElevatorStore } from "@store/elevatorStore";
import { useExperiencePanelStore } from "@store/experiencePanelStore";
import { ExperienceManager } from "@experience/ExperienceManager";
import { HIVE_WAYPOINT_ID } from "@utils/techIds";
import { PROJECT_CAROUSEL_WAYPOINT_ID } from "@utils/projectIds";

/**
 * HTML information panel for a selected Technology Hive cell.
 * Animates independently from the 3D scene (Framer Motion).
 */
export function TechnologyPanel(): JSX.Element {
  const selectedTechId = useTechHiveStore((s) => s.selectedTechId);
  const closePanel = useTechHiveStore((s) => s.closePanel);
  const openProject = useProjectCarouselStore((s) => s.openProject);
  const tech = technologies.find((item) => item.id === selectedTechId) ?? null;
  const related = tech
    ? projects.filter((project) => tech.relatedProjectIds.includes(project.id))
    : [];
  const visual = tech ? resolveTechHiveVisual(tech) : null;
  const accent = visual?.color ?? "#22D3EE";
  const categoryLabel = visual?.label ?? "Technology";

  const onViewDetails = (): void => {
    if (!tech || related.length === 0) return;
    const first = related[0];
    closePanel();
    useElevatorStore.getState().closePanel();
    useExperiencePanelStore.getState().closePanel();
    openProject(first.id);
    ExperienceManager.focusObject(PROJECT_CAROUSEL_WAYPOINT_ID);
  };

  const onClose = (): void => {
    closePanel();
    // Stay on the hive overview — do not retarget if already there.
    const cameraDestinationId =
      useExperienceStore.getState().cameraDestinationId;
    if (cameraDestinationId !== HIVE_WAYPOINT_ID) {
      ExperienceManager.focusObject(HIVE_WAYPOINT_ID);
    }
  };

  return (
    <AnimatePresence>
      {tech ? (
        <motion.aside
          key={tech.id}
          role="dialog"
          aria-modal="true"
          aria-label={`${tech.name} technology details`}
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: TECH_HIVE_CONFIG.transitionSeconds, ease: "easeOut" }}
          className="pointer-events-auto absolute top-1/2 right-[max(1rem,env(safe-area-inset-right))] z-20 w-[min(22rem,calc(100vw-2rem))] -translate-y-1/2 rounded-sm border border-white/15 bg-black/75 p-5 text-white shadow-[0_0_40px_rgba(34,211,238,0.12)] backdrop-blur-md"
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-sm border text-sm font-semibold tracking-wide"
                style={{ borderColor: `${accent}66`, color: accent }}
                aria-hidden
              >
                {tech.icon}
              </div>
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-lg tracking-wide text-white">
                  {tech.name}
                </h2>
                <p className="text-xs tracking-[0.2em] text-white/50 uppercase">
                  {categoryLabel}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm border border-white/15 px-2 py-1 text-xs text-white/70 transition hover:border-cyan-300/40 hover:text-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300/70"
            >
              Close
            </button>
          </div>

          <p className="text-sm leading-relaxed text-white/75">{tech.description}</p>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-3 border-t border-white/10 pt-2">
              <dt className="text-white/45">Experience</dt>
              <dd className="text-cyan-100/90">{tech.yearsOfExperience}+ years</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-white/10 pt-2">
              <dt className="text-white/45">Used in</dt>
              <dd className="text-cyan-100/90">{related.length}+ projects</dd>
            </div>
            <div className="border-t border-white/10 pt-2">
              <dt className="mb-1 text-white/45">Related projects</dt>
              <dd className="text-white/80">
                {related.length > 0
                  ? related.map((project) => project.title).join(" · ")
                  : "—"}
              </dd>
            </div>
          </dl>

          {tech.docsUrl ? (
            <a
              href={tech.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex rounded-sm border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-xs tracking-wide text-cyan-100/90 transition hover:border-cyan-300/50 hover:bg-cyan-500/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300/70"
            >
              Documentation
            </a>
          ) : null}

          {related.length > 0 ? (
            <button
              type="button"
              onClick={onViewDetails}
              className="mt-4 inline-flex rounded-sm border border-white/15 px-3 py-1.5 text-xs tracking-wide text-white/75 transition hover:border-cyan-300/40 hover:text-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300/70"
            >
              View Details
            </button>
          ) : null}
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
