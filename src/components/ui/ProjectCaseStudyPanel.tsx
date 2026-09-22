import type { JSX } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "@data/projects";
import { PROJECT_CAROUSEL_CONFIG } from "@config/projectCarousel";
import { useProjectCarouselStore } from "@store/projectCarouselStore";
import { usePanelNudgeFeedback } from "@hooks/usePanelNudgeFeedback";

function statusLabel(status: (typeof projects)[number]["status"]): string {
  if (status === "in-progress") return "In progress";
  if (status === "archived") return "Archived";
  return "Completed";
}

/**
 * Immersive case-study overlay for a selected project.
 * Motion stays in Framer Motion; selection lives in projectCarouselStore.
 */
export function ProjectCaseStudyPanel(): JSX.Element {
  const selectedProjectId = useProjectCarouselStore((s) => s.selectedProjectId);
  const closeCaseStudy = useProjectCarouselStore((s) => s.closeCaseStudy);
  const { shellControls, closeHintClass } = usePanelNudgeFeedback("cyan");
  const project =
    projects.find((item) => item.id === selectedProjectId) ?? null;

  return (
    <AnimatePresence>
      {project ? (
        <motion.aside
          key={project.id}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} case study`}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 28 }}
          transition={{
            duration: PROJECT_CAROUSEL_CONFIG.transitionSeconds * 0.55,
            ease: "easeOut",
          }}
          className="pointer-events-auto absolute top-1/2 right-[max(1rem,env(safe-area-inset-right))] z-30 flex max-h-[min(88dvh,44rem)] w-[min(26rem,calc(100vw-2rem))] -translate-y-1/2 flex-col overflow-hidden rounded-sm border border-white/15 bg-black/80 text-white shadow-[0_0_48px_rgba(56,189,248,0.14)] backdrop-blur-md"
        >
          <motion.div
            animate={shellControls}
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
          >
            <div className="relative shrink-0">
              {project.images[0] ? (
                <img
                  src={project.images[0]}
                  alt=""
                  className="h-36 w-full object-cover"
                />
              ) : (
                <div className="h-24 w-full bg-gradient-to-br from-cyan-500/20 to-blue-900/40" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute right-3 bottom-3 left-3 flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[10px] tracking-[0.28em] text-cyan-200/80 uppercase">
                    {project.category}
                  </p>
                  {project.liveDemo ? (
                    <span
                      role="status"
                      aria-label="Live demo available"
                      className="inline-flex items-center gap-1.5 rounded-sm border border-red-400/55 bg-red-500/20 px-2 py-0.5 text-[10px] font-bold tracking-[0.22em] text-red-300 uppercase live-badge-blink"
                    >
                      <span
                        className="size-1.5 shrink-0 rounded-full bg-red-500 live-dot-blink"
                        aria-hidden
                      />
                      Live
                    </span>
                  ) : null}
                </div>
                <h2 className="font-[family-name:var(--font-display)] text-xl leading-[1.15] tracking-wide text-white">
                  {project.title}
                </h2>
                <p className="text-sm leading-normal text-white/65">
                  {project.subtitle}
                </p>
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
              <div className="flex flex-wrap gap-2 text-[11px] text-white/60">
                <span className="rounded-sm border border-white/15 px-2 py-0.5">
                  {statusLabel(project.status)}
                </span>
                <span className="rounded-sm border border-white/15 px-2 py-0.5">
                  {project.role}
                </span>
                <span className="rounded-sm border border-white/15 px-2 py-0.5">
                  {project.duration}
                </span>
              </div>

              <p className="text-sm leading-relaxed text-white/75">
                {project.description}
              </p>

              <section>
                <h3 className="mb-1 text-[10px] tracking-[0.22em] text-cyan-200/70 uppercase">
                  Problem
                </h3>
                <p className="text-sm text-white/70">{project.problem}</p>
              </section>

              <section>
                <h3 className="mb-1 text-[10px] tracking-[0.22em] text-cyan-200/70 uppercase">
                  Solution
                </h3>
                <p className="text-sm text-white/70">{project.solution}</p>
              </section>

              <section>
                <h3 className="mb-1 text-[10px] tracking-[0.22em] text-cyan-200/70 uppercase">
                  Outcome
                </h3>
                <p className="text-sm text-white/70">{project.outcome}</p>
              </section>

              <section>
                <h3 className="mb-2 text-[10px] tracking-[0.22em] text-cyan-200/70 uppercase">
                  Technologies
                </h3>
                <ul className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-sm border border-cyan-400/25 bg-cyan-500/10 px-2 py-0.5 text-[11px] text-cyan-100/90"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </section>

              {project.architectureImage ? (
                <section>
                  <h3 className="mb-2 text-[10px] tracking-[0.22em] text-cyan-200/70 uppercase">
                    Architecture
                  </h3>
                  <img
                    src={project.architectureImage}
                    alt={`${project.title} architecture`}
                    className="w-full rounded-sm border border-white/10"
                  />
                </section>
              ) : null}

              {project.images.length > 1 ? (
                <section>
                  <h3 className="mb-2 text-[10px] tracking-[0.22em] text-cyan-200/70 uppercase">
                    Gallery
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {project.images.slice(1).map((src) => (
                      <img
                        key={src}
                        src={src}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="aspect-video w-full rounded-sm border border-white/10 object-cover"
                      />
                    ))}
                  </div>
                </section>
              ) : null}

              {project.video ? (
                <section>
                  <h3 className="mb-2 text-[10px] tracking-[0.22em] text-cyan-200/70 uppercase">
                    Preview
                  </h3>
                  <video
                    key={project.video}
                    src={project.video}
                    controls
                    playsInline
                    preload="none"
                    className="w-full rounded-sm border border-white/10"
                  />
                </section>
              ) : null}

              <section>
                <h3 className="mb-1 text-[10px] tracking-[0.22em] text-cyan-200/70 uppercase">
                  Lessons learned
                </h3>
                <p className="text-sm text-white/70">{project.lessonsLearned}</p>
              </section>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-white/10 px-5 py-3">
              {project.liveDemo ? (
                <a
                  href={project.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm border border-cyan-400/40 bg-cyan-500/20 px-3 py-1.5 text-xs tracking-wide text-cyan-50 transition hover:border-cyan-300/60 hover:bg-cyan-500/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300/70"
                >
                  Try it live
                </a>
              ) : null}
              {project.github ? (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm border border-white/15 px-3 py-1.5 text-xs tracking-wide text-white/80 transition hover:border-cyan-300/40 hover:text-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300/70"
                >
                  GitHub
                </a>
              ) : null}
              <button
                type="button"
                onClick={closeCaseStudy}
                className={`ml-auto rounded-sm border border-white/15 px-3 py-1.5 text-xs text-white/70 transition hover:border-cyan-300/40 hover:text-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300/70 ${closeHintClass}`}
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
