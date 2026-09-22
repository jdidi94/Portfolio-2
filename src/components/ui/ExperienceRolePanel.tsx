import type { JSX } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { experience, EXPERIENCE_COVER_BY_ID } from "@data/experience";
import { EXPERIENCE_SECTION_CONFIG } from "@config/experienceSection";
import { useExperiencePanelStore } from "@store/experiencePanelStore";
import { usePanelNudgeFeedback } from "@hooks/usePanelNudgeFeedback";

function employmentLabel(
  type: (typeof experience)[number]["employmentType"],
): string {
  if (type === "full-time") return "Full-time";
  if (type === "freelance") return "Freelance";
  if (type === "contract") return "Contract";
  if (type === "internship") return "Internship";
  return "Education";
}

function formatDateRange(start: string, end: string | null): string {
  const startLabel = start.slice(0, 7);
  const endLabel = end ? end.slice(0, 7) : "Present";
  return `${startLabel} → ${endLabel}`;
}

/**
 * Immersive role overlay for a selected experience entry.
 * Motion stays in Framer Motion; selection lives in experiencePanelStore.
 */
export function ExperienceRolePanel(): JSX.Element {
  const selectedExperienceId = useExperiencePanelStore(
    (s) => s.selectedExperienceId,
  );
  const closePanel = useExperiencePanelStore((s) => s.closePanel);
  const { shellControls, closeHintClass } = usePanelNudgeFeedback("cyan");
  const role =
    experience.find((item) => item.id === selectedExperienceId) ?? null;
  const cover = role ? EXPERIENCE_COVER_BY_ID[role.id] : undefined;

  return (
    <AnimatePresence>
      {role ? (
        <motion.aside
          key={role.id}
          role="dialog"
          aria-modal="true"
          aria-label={`${role.position} at ${role.company}`}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 28 }}
          transition={{
            duration: EXPERIENCE_SECTION_CONFIG.transitionSeconds * 0.55,
            ease: "easeOut",
          }}
          className="pointer-events-auto absolute top-1/2 right-[max(1rem,env(safe-area-inset-right))] z-30 flex max-h-[min(88dvh,44rem)] w-[min(26rem,calc(100vw-2rem))] -translate-y-1/2 flex-col overflow-hidden rounded-sm border border-white/15 bg-black/80 text-white shadow-[0_0_48px_rgba(56,189,248,0.14)] backdrop-blur-md"
        >
          <motion.div
            animate={shellControls}
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
          >
            <div className="relative shrink-0">
              {cover ? (
                <img
                  src={cover}
                  alt=""
                  className="h-36 w-full object-cover"
                />
              ) : (
                <div className="h-24 w-full bg-gradient-to-br from-cyan-500/20 to-blue-900/40" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute right-3 bottom-3 left-3 flex flex-col gap-2">
                <p className="text-[10px] tracking-[0.28em] text-cyan-200/80 uppercase">
                  {employmentLabel(role.employmentType)}
                </p>
                <h2 className="font-[family-name:var(--font-display)] text-xl leading-[1.15] tracking-wide text-white">
                  {role.position}
                </h2>
                <p className="text-sm leading-normal text-white/65">
                  {role.company}
                </p>
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
              <div className="flex flex-wrap gap-2 text-[11px] text-white/60">
                <span className="rounded-sm border border-white/15 px-2 py-0.5">
                  {formatDateRange(role.startDate, role.endDate)}
                </span>
                <span className="rounded-sm border border-white/15 px-2 py-0.5">
                  {role.location}
                </span>
              </div>

              <section>
                <h3 className="mb-2 text-[10px] tracking-[0.22em] text-cyan-200/70 uppercase">
                  Responsibilities
                </h3>
                <ul className="space-y-1.5 text-sm text-white/70">
                  {role.responsibilities.map((item) => (
                    <li key={item} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {role.achievements.length > 0 ? (
                <section>
                  <h3 className="mb-2 text-[10px] tracking-[0.22em] text-cyan-200/70 uppercase">
                    Achievements
                  </h3>
                  <ul className="space-y-1.5 text-sm text-white/70">
                    {role.achievements.map((item) => (
                      <li key={item} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <section>
                <h3 className="mb-2 text-[10px] tracking-[0.22em] text-cyan-200/70 uppercase">
                  Technologies
                </h3>
                <ul className="flex flex-wrap gap-1.5">
                  {role.technologies.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-sm border border-cyan-400/25 bg-cyan-500/10 px-2 py-0.5 text-[11px] text-cyan-100/90"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="flex shrink-0 items-center border-t border-white/10 px-5 py-3">
              <button
                type="button"
                onClick={closePanel}
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
