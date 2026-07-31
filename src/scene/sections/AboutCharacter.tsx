import { Suspense, useEffect, useMemo, useRef, type JSX } from "react";
import gsap from "gsap";
import type { Group } from "three";
import {
  ABOUT_CHARACTER_CONFIG,
  type AboutBeatId,
} from "@config/aboutCharacter";
import { MOBILE_NAV_CONFIG } from "@config/mobileNav";
import { MODEL_ASSETS, IMAGE_ASSETS } from "@config/assets";
import { COLORS } from "@config/colors";
import { scaleCorridorPosition } from "@config/cardLayout";
import { FloatingCard } from "@components/cards/FloatingCard";
import { GlbProp } from "@scene/objects/GlbProp";
import { TravelerCharacter } from "@scene/sections/TravelerCharacter";
import { InteractionManager } from "@interaction/InteractionManager";
import { CursorManager } from "@interaction/CursorManager";
import { profile } from "@data/profile";
import { useExperienceStore } from "@store/experienceStore";
import { useMobileNavStore } from "@store/mobileNavStore";
import { useViewportStore } from "@store/viewportStore";
import {
  ABOUT_WAYPOINT_ID,
  aboutBeatObjectId,
} from "@utils/aboutIds";

function beatCopy(beatId: AboutBeatId): {
  title: string;
  subtitle?: string;
  bodyLines: readonly string[];
  coverUrl?: string;
} {
  switch (beatId) {
    case "summary":
      return {
        title: "Who I am",
        subtitle: profile.location,
        bodyLines: [profile.about],
        coverUrl: IMAGE_ASSETS.aboutWorking,
      };
    case "philosophy":
      return {
        title: "How I build",
        subtitle: "Engineering philosophy",
        bodyLines: [profile.philosophy],
      };
    case "education":
      return {
        title: "Background",
        subtitle: "Education",
        bodyLines: [profile.education],
        coverUrl: IMAGE_ASSETS.aboutCoding,
      };
    case "goals":
      return {
        title: "Where next",
        subtitle: "Current goals",
        bodyLines: [profile.goals],
      };
    default: {
      const _exhaustive: never = beatId;
      return { title: _exhaustive, bodyLines: [] };
    }
  }
}

/**
 * About Me — traveler + beats on mid/desktop;
 * small: vertical 3D carousel (camera fixed, stack scrolls on Y).
 */
export function AboutCharacter(): JSX.Element {
  const corridorScaleX = useViewportStore((s) => s.corridorScaleX);
  const hitScale = useViewportStore((s) => s.hitScale);
  const tier = useViewportStore((s) => s.tier);
  const hoveredObjectId = useExperienceStore((s) => s.hoveredObjectId);
  const focusObjectId = useExperienceStore((s) => s.focusObjectId);
  const prefersReducedMotion = useExperienceStore(
    (s) => s.prefersReducedMotion,
  );
  const itemIndex = useMobileNavStore((s) => s.itemIndex);
  const isSmall = tier === "small";
  const carouselRef = useRef<Group>(null);
  const snapTweenRef = useRef<gsap.core.Tween | null>(null);

  const origin = useMemo(
    () => scaleCorridorPosition(ABOUT_CHARACTER_CONFIG.origin, corridorScaleX),
    [corridorScaleX],
  );

  const { platform, character, beatCard, beats } = ABOUT_CHARACTER_CONFIG;
  const isOverviewFocused = focusObjectId === ABOUT_WAYPOINT_ID;
  const isHovered = hoveredObjectId === ABOUT_WAYPOINT_ID;
  const emissive = isOverviewFocused ? 1.15 : isHovered ? 0.95 : 0.5;

  const hit: [number, number, number] = [
    character.hitBox[0] * character.scale * hitScale,
    character.hitBox[1] * character.scale * hitScale,
    character.hitBox[2] * character.scale,
  ];

  const aboutFocusY = ABOUT_CHARACTER_CONFIG.small.lookAtY;
  const spacingY = MOBILE_NAV_CONFIG.aboutCarouselSpacingY;

  // Keep the active beat at the camera look-at by translating the stack.
  useEffect(() => {
    if (!isSmall) return;
    const group = carouselRef.current;
    if (!group) return;

    const targetY = itemIndex * spacingY;
    snapTweenRef.current?.kill();

    if (prefersReducedMotion) {
      group.position.y = targetY;
      return;
    }

    snapTweenRef.current = gsap.to(group.position, {
      y: targetY,
      duration: MOBILE_NAV_CONFIG.carouselSnapSeconds,
      ease: MOBILE_NAV_CONFIG.carouselSnapEase,
    });

    return () => {
      snapTweenRef.current?.kill();
    };
  }, [isSmall, itemIndex, spacingY, prefersReducedMotion]);

  return (
    <group position={origin}>
      {!isSmall ? (
        <>
          <GlbProp
            url={MODEL_ASSETS.hologramPlatform}
            color={platform.color}
            preset="neonGlass"
            scale={platform.scale}
            emissiveIntensity={emissive}
            skipRaycast
          />

          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.02, 0]}
            raycast={() => {}}
          >
            <ringGeometry
              args={[platform.ringInner, platform.ringOuter, 48]}
            />
            <meshBasicMaterial
              color={COLORS.cyan}
              transparent
              opacity={isOverviewFocused || isHovered ? 0.32 : 0.12}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>

          <Suspense fallback={null}>
            <TravelerCharacter />
          </Suspense>

          <mesh
            name={ABOUT_WAYPOINT_ID}
            position={[0, character.hitOffsetY, 0]}
            userData={{ contentTitle: "About Me" }}
            onPointerOver={(event) => {
              event.stopPropagation();
              InteractionManager.onHover(ABOUT_WAYPOINT_ID);
              CursorManager.set("pointer");
            }}
            onPointerOut={(event) => {
              event.stopPropagation();
              InteractionManager.onUnhover(ABOUT_WAYPOINT_ID);
              CursorManager.reset();
            }}
            onClick={(event) => {
              event.stopPropagation();
              InteractionManager.onSelect(ABOUT_WAYPOINT_ID);
            }}
          >
            <boxGeometry args={hit} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </>
      ) : null}

      {isSmall ? (
        <group ref={carouselRef}>
          {beats.map((beat, index) => {
            const copy = beatCopy(beat.id);
            const focused = index === itemIndex;
            const localY = aboutFocusY - index * spacingY;
            return (
              <FloatingCard
                key={beat.id}
                id={aboutBeatObjectId(beat.id)}
                variant="certificate"
                title={copy.title}
                sectionLabel={beat.label}
                subtitle={copy.subtitle}
                bodyLines={copy.bodyLines}
                coverUrl={copy.coverUrl}
                position={[0, localY, MOBILE_NAV_CONFIG.stackPeekZ]}
                phase={index * 0.9}
                accentOverride={COLORS.purple}
                modelScaleOverride={MOBILE_NAV_CONFIG.cardModelScale}
                floatAmplitudeOverride={0}
                forceOverview
                dimmed={!focused}
              />
            );
          })}
        </group>
      ) : (
        beats.map((beat, index) => {
          const copy = beatCopy(beat.id);
          const localPos: [number, number, number] = [
            beat.position[0] * corridorScaleX,
            beat.position[1],
            beat.position[2],
          ];
          return (
            <FloatingCard
              key={beat.id}
              id={aboutBeatObjectId(beat.id)}
              variant="certificate"
              title={copy.title}
              sectionLabel={beat.label}
              subtitle={copy.subtitle}
              bodyLines={copy.bodyLines}
              coverUrl={copy.coverUrl}
              position={localPos}
              phase={index * 0.9}
              accentOverride={COLORS.purple}
              modelScaleOverride={beatCard.modelScale}
              floatAmplitudeOverride={beatCard.floatAmplitude}
            />
          );
        })
      )}
    </group>
  );
}
