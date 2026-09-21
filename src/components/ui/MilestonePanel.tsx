import type { JSX } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ELEVATOR_CONFIG, resolveElevatorLayout } from "@config/elevator";
import { certificates } from "@data/certificates";
import { projects } from "@data/projects";
import { useElevatorStore, isFutureMilestone } from "@store/elevatorStore";
import { ExperienceManager } from "@experience/ExperienceManager";
import { usePanelNudgeFeedback } from "@hooks/usePanelNudgeFeedback";
import { ELEVATOR_WAYPOINT_ID } from "@utils/elevatorIds";

/**
 * Memory-panel overlay for a selected elevator milestone.
 * Certificate + related projects surface here (not as corridor cards).
 */
export function MilestonePanel(): JSX.Element {
  const selectedEventId = useElevatorStore((s) => s.selectedEventId);
  const closePanel = useElevatorStore((s) => s.closePanel);
  const { shellControls, closeHintClass } = usePanelNudgeFeedback("white");
  const layout = resolveElevatorLayout("desktop");
  const platform =
    layout.platforms.find((item) => item.id === selectedEventId) ?? null;
  const isFuture = isFutureMilestone(selectedEventId);

  const relatedProjects = platform
    ? projects.filter((project) =>
        platform.relatedProjectIds.includes(project.id),
      )
    : [];
  const relatedCerts = platform
    ? certificates.filter((cert) =>
        platform.relatedCertificateIds.includes(cert.id),
      )
    : [];

  const returnToOverview = (): void => {
    closePanel();
    ExperienceManager.focusObject(ELEVATOR_WAYPOINT_ID);
  };
  return (
    <AnimatePresence>
      {platform ? (
        <motion.aside
          key={platform.id}
          role="dialog"
          aria-modal="true"
          aria-label={`${platform.yearLabel}, ${platform.title}`}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 28 }}
          transition={{
            duration: ELEVATOR_CONFIG.snapSeconds * 0.5,
            ease: "easeOut",
          }}
          className="pointer-events-auto absolute top-1/2 right-[max(1rem,env(safe-area-inset-right))] z-30 flex max-h-[min(88dvh,42rem)] w-[min(26rem,calc(100vw-2rem))] -translate-y-1/2 flex-col overflow-hidden rounded-sm border border-white/15 bg-black/80 text-white shadow-[0_0_48px_rgba(139,92,246,0.16)] backdrop-blur-md"
        >
          <motion.div
            animate={shellControls}
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
          >
            <div className="relative shrink-0">
              {platform.media ? (
                <img
                  src={platform.media}
                  alt=""
                  className="h-36 w-full object-cover"
                />
              ) : (
                <div className="h-24 w-full bg-gradient-to-br from-purple-500/25 to-cyan-900/40" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute right-3 bottom-3 left-3">
                <p className="text-[10px] tracking-[0.28em] text-cyan-200/80 uppercase">
                  {platform.isFuture ? "Next Chapter" : platform.category}
                </p>
                <h2 className="font-[family-name:var(--font-display)] text-xl tracking-wide text-white">
                  {platform.yearLabel}
                </h2>
                <p className="text-sm text-white/65">{platform.title}</p>
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
              <p className="text-sm leading-relaxed text-white/75">
                {platform.description}
              </p>

              {relatedCerts.length > 0 ? (
                <section>
                  <h3 className="mb-2 text-[10px] tracking-[0.22em] text-cyan-200/70 uppercase">
                    Certificate
                  </h3>
                  <ul className="space-y-2">
                    {relatedCerts.map((cert) => (
                      <li
                        key={cert.id}
                        className="rounded-sm border border-blue-400/25 bg-blue-500/10 px-3 py-2"
                      >
                        <p className="text-sm text-white/90">{cert.title}</p>
                        <p className="text-[11px] text-white/55">
                          {cert.issuer} · {cert.year}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {relatedProjects.length > 0 ? (
                <section>
                  <h3 className="mb-2 text-[10px] tracking-[0.22em] text-cyan-200/70 uppercase">
                    Related projects
                  </h3>
                  <ul className="space-y-2">
                    {relatedProjects.map((project) => (
                      <li
                        key={project.id}
                        className="rounded-sm border border-cyan-400/20 bg-cyan-500/10 px-3 py-2"
                      >
                        <p className="text-sm text-white/90">{project.title}</p>
                        <p className="text-[11px] text-white/55">
                          {project.subtitle}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {platform.link ? (
                <a
                  href={platform.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex text-sm text-cyan-200/90 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300/70"
                >
                  View related work
                </a>
              ) : null}

              {isFuture ? (
                <button
                  type="button"
                  onClick={() => {
                    closePanel();
                    ExperienceManager.focusObject("contact");
                  }}
                  className="w-full rounded-sm border border-white/20 bg-white/10 px-3 py-2.5 text-sm tracking-wide text-white transition hover:border-cyan-300/40 hover:bg-cyan-500/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300/70"
                >
                  {ELEVATOR_CONFIG.future.ctaLabel}
                </button>
              ) : null}
            </div>

            <div className="flex shrink-0 justify-end border-t border-white/10 px-4 py-3">
              <button
                type="button"
                onClick={returnToOverview}
                className={`rounded-sm border border-white/15 bg-black/40 px-3 py-1.5 text-xs tracking-wide text-white/80 transition hover:border-white/30 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300/70 ${closeHintClass}`}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
