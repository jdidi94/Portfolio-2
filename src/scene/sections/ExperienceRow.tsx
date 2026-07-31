import { useEffect, useMemo, useRef, type JSX } from "react";
import gsap from "gsap";
import type { Group } from "three";
import { CARD_CONFIG } from "@config/cards";
import { MOBILE_NAV_CONFIG } from "@config/mobileNav";
import {
  EXPERIENCE_SECTION_CONFIG,
  experienceSlotPositions,
} from "@config/experienceSection";
import { experience, EXPERIENCE_COVER_BY_ID } from "@data/experience";
import { FloatingCard } from "@components/cards/FloatingCard";
import { useExperienceStore } from "@store/experienceStore";
import { useMobileNavStore } from "@store/mobileNavStore";
import { useProjectTuningParams } from "@store/projectFaceTuningStore";
import { useViewportStore } from "@store/viewportStore";
import { experienceObjectId } from "@utils/experienceIds";

function formatDateRange(start: string, end: string | null): string {
  const startLabel = start.slice(0, 7);
  const endLabel = end ? end.slice(0, 7) : "Present";
  return `${startLabel} → ${endLabel}`;
}

function employmentLabel(
  type: (typeof experience)[number]["employmentType"],
): string {
  if (type === "full-time") return "Full-time";
  if (type === "freelance") return "Freelance";
  if (type === "contract") return "Contract";
  if (type === "internship") return "Internship";
  return "Education";
}

/**
 * Horizontal row of experience role cards at the experience corridor depth.
 * Small: horizontal 3D carousel (camera fixed; strip snaps on X).
 */
export function ExperienceRow(): JSX.Element | null {
  const tier = useViewportStore((s) => s.tier);
  const hoveredObjectId = useExperienceStore((s) => s.hoveredObjectId);
  const prefersReducedMotion = useExperienceStore(
    (s) => s.prefersReducedMotion,
  );
  const itemIndex = useMobileNavStore((s) => s.itemIndex);
  const projectTuning = useProjectTuningParams();
  const carouselRef = useRef<Group>(null);
  const snapTweenRef = useRef<gsap.core.Tween | null>(null);

  const slots = useMemo(
    () => experienceSlotPositions(experience.length, tier),
    [tier],
  );

  const spacingX = MOBILE_NAV_CONFIG.experienceCarouselSpacingX;

  useEffect(() => {
    if (tier !== "small") return;
    const group = carouselRef.current;
    if (!group) return;

    const targetX = -itemIndex * spacingX;
    snapTweenRef.current?.kill();

    if (prefersReducedMotion) {
      group.position.x = targetX;
      return;
    }

    snapTweenRef.current = gsap.to(group.position, {
      x: targetX,
      duration: MOBILE_NAV_CONFIG.carouselSnapSeconds,
      ease: MOBILE_NAV_CONFIG.carouselSnapEase,
    });

    return () => {
      snapTweenRef.current?.kill();
    };
  }, [tier, itemIndex, spacingX, prefersReducedMotion]);

  if (experience.length === 0) {
    return null;
  }

  const [ox, oy, oz] = EXPERIENCE_SECTION_CONFIG.origin;

  if (tier === "small") {
    return (
      <group position={[ox, oy, oz]}>
        <group ref={carouselRef}>
          {experience.map((role, index) => {
            const focused = index === itemIndex;
            return (
              <FloatingCard
                key={role.id}
                id={experienceObjectId(role.id)}
                variant="experience"
                title={role.position}
                sectionLabel={CARD_CONFIG.sectionLabel.experience}
                subtitle={role.company}
                bodyLines={[
                  `${employmentLabel(role.employmentType)} · ${formatDateRange(role.startDate, role.endDate)}`,
                  role.location,
                ]}
                coverUrl={EXPERIENCE_COVER_BY_ID[role.id]}
                patternKey={CARD_CONFIG.facePattern.experience}
                position={[index * spacingX, 0, MOBILE_NAV_CONFIG.stackPeekZ]}
                phase={index * 0.85}
                projectTuning={projectTuning}
                forceOverview
                dimmed={!focused}
                floatAmplitudeOverride={0}
                modelScaleOverride={MOBILE_NAV_CONFIG.cardModelScale}
              />
            );
          })}
        </group>
      </group>
    );
  }

  const anyHovered = hoveredObjectId?.startsWith("experience-") ?? false;

  return (
    <group position={[ox, oy, oz]}>
      {experience.map((role, index) => {
        const objectId = experienceObjectId(role.id);
        const slot = slots[index] ?? ([0, 0, 0] as const);
        const dimmed = anyHovered && hoveredObjectId !== objectId;

        return (
          <group key={objectId} position={slot}>
            <FloatingCard
              id={objectId}
              variant="experience"
              title={role.position}
              sectionLabel={CARD_CONFIG.sectionLabel.experience}
              subtitle={role.company}
              bodyLines={[
                `${employmentLabel(role.employmentType)} · ${formatDateRange(role.startDate, role.endDate)}`,
                role.location,
              ]}
              coverUrl={EXPERIENCE_COVER_BY_ID[role.id]}
              patternKey={CARD_CONFIG.facePattern.experience}
              position={[0, 0, 0]}
              phase={index * 0.85}
              projectTuning={projectTuning}
              forceOverview
              dimmed={dimmed}
              floatAmplitudeOverride={EXPERIENCE_SECTION_CONFIG.floatAmplitude}
              modelScaleOverride={EXPERIENCE_SECTION_CONFIG.cardModelScale}
            />
          </group>
        );
      })}
    </group>
  );
}
