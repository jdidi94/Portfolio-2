import type { JSX } from "react";
import { CONTENT_CARD_PLACEMENTS } from "@config/sections";
import { scaleCorridorPosition } from "@config/cardLayout";
import { CARD_CONFIG } from "@config/cards";
import { IMAGE_ASSETS } from "@config/assets";
import type { TextureAssetKey } from "@config/assets";
import { profile } from "@data/profile";
import { projects } from "@data/projects";
import { skills } from "@data/skills";
import { experience } from "@data/experience";
import { socialLinks } from "@data/social";
import { FloatingCard } from "@components/cards/FloatingCard";
import { useHeroTuningParams } from "@store/heroFaceTuningStore";
import { useViewportStore } from "@store/viewportStore";

function formatDateRange(start: string, end: string | null): string {
  const startLabel = start.slice(0, 7);
  const endLabel = end ? end.slice(0, 7) : "Present";
  return `${startLabel} → ${endLabel}`;
}

function resolveCardCopy(placement: (typeof CONTENT_CARD_PLACEMENTS)[number]): {
  title: string;
  subtitle?: string;
  bodyLines?: readonly string[];
  coverUrl?: string;
  patternKey?: TextureAssetKey;
} {
  switch (placement.kind) {
    case "hero":
      return {
        title: profile.name,
        subtitle: profile.title,
        bodyLines: [profile.availability, profile.callToAction],
        coverUrl: profile.portraitUrl ?? IMAGE_ASSETS.heroCover,
        patternKey: CARD_CONFIG.facePattern.hero,
      };
    case "skill": {
      const skill = skills.find((item) => item.id === placement.contentId);
      const related = skill
        ? projects
            .filter((project) => skill.relatedProjectIds.includes(project.id))
            .map((project) => project.title)
            .join(" · ")
        : "";
      return {
        title: skill?.name ?? placement.label,
        subtitle: skill?.category,
        bodyLines: skill
          ? [
              skill.description,
              `${skill.yearsOfExperience}+ yrs · shown in projects`,
              related,
            ]
          : undefined,
        patternKey: CARD_CONFIG.facePattern.skill,
      };
    }
    case "experience": {
      const role = experience.find((item) => item.id === placement.contentId);
      return {
        title: role?.position ?? placement.label,
        subtitle: role?.company,
        bodyLines: role
          ? [
              `${role.employmentType} · ${role.location}`,
              formatDateRange(role.startDate, role.endDate),
              role.achievements[0] ?? role.responsibilities[0],
            ]
          : undefined,
        patternKey: CARD_CONFIG.facePattern.experience,
      };
    }
    case "contact":
      return {
        title: "Contact",
        subtitle: profile.availability,
        bodyLines: [
          profile.location,
          profile.email,
          socialLinks.map((link) => link.label).join(" · "),
        ],
        patternKey: CARD_CONFIG.facePattern.contact,
      };
    default:
      return { title: placement.label };
  }
}

/**
 * Places interactive content cards along the depth corridor.
 * Projects → ProjectCarousel · Experience → ExperienceRow · Technologies → TechHive · Timeline → Elevator.
 */
export function ContentSections(): JSX.Element {
  const heroTuning = useHeroTuningParams();
  const corridorScaleX = useViewportStore((s) => s.corridorScaleX);

  return (
    <group>
      {CONTENT_CARD_PLACEMENTS.map((placement, index) => {
        const copy = resolveCardCopy(placement);
        return (
          <FloatingCard
            key={placement.objectId}
            id={placement.objectId}
            variant={placement.variant}
            title={copy.title}
            sectionLabel={CARD_CONFIG.sectionLabel[placement.variant]}
            subtitle={copy.subtitle}
            bodyLines={copy.bodyLines}
            coverUrl={copy.coverUrl}
            patternKey={copy.patternKey}
            position={scaleCorridorPosition(placement.position, corridorScaleX)}
            phase={index * 0.85}
            heroTuning={
              placement.variant === "hero" ? heroTuning : undefined
            }
          />
        );
      })}
    </group>
  );
}
