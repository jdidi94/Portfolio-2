import type { JSX } from "react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { audioManager } from "@audio/AudioManager";
import { profile } from "@data/profile";
import { socialLinks } from "@data/social";
import { useExperienceStore } from "@store/experienceStore";
import { useMobileMenuStore } from "@store/mobileMenuStore";
import { useViewportStore } from "@store/viewportStore";
import { getResumeDownloadName } from "@utils/resumeDownloadName";

/**
 * Fullscreen purple-neon menu — resume, contact, social, audio, journey instructions.
 */
export function MobileMenuOverlay(): JSX.Element | null {
  const tier = useViewportStore((s) => s.tier);
  const isOpen = useMobileMenuStore((s) => s.isOpen);
  const close = useMobileMenuStore((s) => s.close);
  const isAudioEnabled = useExperienceStore((s) => s.isAudioEnabled);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  if (tier !== "small") {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center overflow-y-auto px-5 py-16"
          data-allow-scroll
        >
          {/* Dark base + centered purple neon glow */}
          <div className="absolute inset-0 bg-[#07050f]" />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 55% 45% at 50% 42%, rgba(168,85,247,0.35) 0%, rgba(88,28,135,0.18) 42%, transparent 70%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(192,132,252,0.2) 0%, transparent 55%)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative z-10 flex w-full max-w-sm flex-col items-center gap-8 text-center"
          >
            <header className="space-y-2">
              <p className="font-[family-name:var(--font-display)] text-xs tracking-[0.35em] text-purple-200/90 uppercase">
                {profile.name}
              </p>
              <p className="text-sm text-white/55">{profile.title}</p>
              <p className="text-[11px] text-white/40">{profile.location}</p>
            </header>

            <section aria-labelledby="mobile-how-to" className="w-full space-y-3">
              <h2
                id="mobile-how-to"
                className="text-[10px] tracking-[0.28em] text-purple-200/75 uppercase"
              >
                How to explore
              </h2>
              <ul className="space-y-2 text-left text-[12px] leading-relaxed text-white/70">
                <li>Swipe or scroll to move through cards in a section.</li>
                <li>Use Back / Skip to jump between sections.</li>
                <li>Tap a card to open its detail panel.</li>
                <li>Press Escape to close panels or this menu.</li>
              </ul>
            </section>

            <section
              aria-labelledby="mobile-links"
              className="w-full space-y-3"
            >
              <h2
                id="mobile-links"
                className="text-[10px] tracking-[0.28em] text-purple-200/75 uppercase"
              >
                Resume &amp; contact
              </h2>
              <nav className="flex flex-col gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target={link.icon === "email" ? undefined : "_blank"}
                    rel={
                      link.icon === "email" ? undefined : "noopener noreferrer"
                    }
                    download={
                      link.icon === "resume"
                        ? getResumeDownloadName()
                        : undefined
                    }
                    className="rounded-sm border border-purple-300/30 bg-purple-500/10 px-4 py-3 text-sm tracking-wide text-purple-50 transition hover:border-purple-200/50 hover:bg-purple-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-300/70"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </section>

            <section
              aria-labelledby="mobile-audio"
              className="w-full space-y-3"
            >
              <h2
                id="mobile-audio"
                className="text-[10px] tracking-[0.28em] text-purple-200/75 uppercase"
              >
                Audio
              </h2>
              <button
                type="button"
                aria-pressed={isAudioEnabled}
                onClick={() => {
                  audioManager.toggle();
                }}
                className={`w-full rounded-sm border px-4 py-3 text-sm tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-300/70 ${
                  isAudioEnabled
                    ? "border-purple-200/55 bg-purple-500/25 text-purple-50 hover:border-purple-100/70 hover:bg-purple-500/35"
                    : "border-purple-300/30 bg-purple-500/10 text-purple-50/80 hover:border-purple-200/50 hover:bg-purple-500/20"
                }`}
              >
                {isAudioEnabled ? "Audio on — tap to close" : "Audio off — tap to open"}
              </button>
            </section>

            <button
              type="button"
              onClick={close}
              className="rounded-sm border border-white/20 bg-black/40 px-5 py-2.5 text-xs tracking-wide text-white/70 transition hover:border-white/35 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-300/70"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
