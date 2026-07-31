import { useEffect, useMemo, useRef, type JSX } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import type { Group } from "three";
import { CARD_CONFIG } from "@config/cards";
import { MOBILE_NAV_CONFIG } from "@config/mobileNav";
import {
  PROJECT_CAROUSEL_CONFIG,
  normalizeAngle,
  resolveProjectCarouselLayout,
  scaleForAngleOffset,
  slotAngle,
} from "@config/projectCarousel";
import { projects } from "@data/projects";
import { FloatingCard } from "@components/cards/FloatingCard";
import { useExperienceStore } from "@store/experienceStore";
import { useMobileNavStore } from "@store/mobileNavStore";
import { useProjectCarouselStore } from "@store/projectCarouselStore";
import { useProjectTuningParams } from "@store/projectFaceTuningStore";
import { useViewportStore } from "@store/viewportStore";
import { projectObjectId } from "@utils/projectIds";

function ProjectMobileCarousel(): JSX.Element {
  const itemIndex = useMobileNavStore((s) => s.itemIndex);
  const prefersReducedMotion = useExperienceStore(
    (s) => s.prefersReducedMotion,
  );
  const projectTuning = useProjectTuningParams();
  const carouselRef = useRef<Group>(null);
  const snapTweenRef = useRef<gsap.core.Tween | null>(null);
  const [ox, oy, oz] = PROJECT_CAROUSEL_CONFIG.origin;
  const spacingX = MOBILE_NAV_CONFIG.projectCarouselSpacingX;

  // Keep the active project at camera center by translating the strip on X.
  useEffect(() => {
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
  }, [itemIndex, spacingX, prefersReducedMotion]);

  return (
    <group position={[ox, oy, oz]}>
      <group ref={carouselRef}>
        {projects.map((project, index) => {
          const focused = index === itemIndex;
          return (
            <FloatingCard
              key={project.id}
              id={projectObjectId(project.id)}
              variant="project"
              title={project.title}
              sectionLabel={CARD_CONFIG.sectionLabel.project}
              subtitle={project.subtitle}
              bodyLines={[
                project.category,
                project.status === "in-progress"
                  ? "In progress"
                  : project.status === "archived"
                    ? "Archived"
                    : "Completed",
                `${project.role} · ${project.duration}`,
              ]}
              coverUrl={project.images[0]}
              patternKey={CARD_CONFIG.facePattern.project}
              position={[index * spacingX, 0, MOBILE_NAV_CONFIG.stackPeekZ]}
              phase={index * 0.75}
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

/**
 * Circular 3D project ring at the projects corridor depth.
 * Idle spin + drag + snap-to-front; case study opens via InteractionManager.
 * Small: horizontal 3D strip driven by mobileNav scroll.
 */
export function ProjectCarousel(): JSX.Element | null {
  const tier = useViewportStore((s) => s.tier);
  const activeSection = useExperienceStore((s) => s.activeSection);
  const prefersReducedMotion = useExperienceStore(
    (s) => s.prefersReducedMotion,
  );
  const hoveredObjectId = useExperienceStore((s) => s.hoveredObjectId);
  const selectedProjectId = useProjectCarouselStore((s) => s.selectedProjectId);
  const targetRotationY = useProjectCarouselStore((s) => s.targetRotationY);
  const isDragging = useProjectCarouselStore((s) => s.isDragging);
  const interactionEpoch = useProjectCarouselStore((s) => s.interactionEpoch);
  const projectTuning = useProjectTuningParams();
  const gl = useThree((s) => s.gl);

  const ringRef = useRef<Group>(null);
  const scaleGroupRefs = useRef<(Group | null)[]>([]);
  const idlePausedUntil = useRef(0);
  const dragPointerId = useRef<number | null>(null);
  const lastPointerX = useRef(0);
  const liveRotation = useRef(0);
  const dragDistance = useRef(0);
  const snapTweenRef = useRef<gsap.core.Tween | null>(null);

  const count = projects.length;
  const layout = useMemo(
    () => resolveProjectCarouselLayout(count, tier),
    [count, tier],
  );

  useEffect(() => {
    idlePausedUntil.current =
      performance.now() / 1000 +
      PROJECT_CAROUSEL_CONFIG.idleResumeDelaySeconds;
  }, [interactionEpoch]);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring || isDragging) return;

    snapTweenRef.current?.kill();

    const from = ring.rotation.y;
    const dest = from + normalizeAngle(targetRotationY - from);

    if (prefersReducedMotion) {
      ring.rotation.y = dest;
      liveRotation.current = dest;
      return;
    }

    snapTweenRef.current = gsap.to(ring.rotation, {
      y: dest,
      duration: PROJECT_CAROUSEL_CONFIG.transitionSeconds,
      ease: PROJECT_CAROUSEL_CONFIG.focusEase,
      onUpdate: () => {
        liveRotation.current = ring.rotation.y;
      },
      onComplete: () => {
        liveRotation.current = dest;
      },
    });

    return () => {
      snapTweenRef.current?.kill();
    };
  }, [targetRotationY, prefersReducedMotion, isDragging]);

  useFrame((_, delta) => {
    const ring = ringRef.current;
    if (!ring) return;

    const now = performance.now() / 1000;
    const pauseIdle =
      prefersReducedMotion ||
      isDragging ||
      selectedProjectId !== null ||
      activeSection !== "projects" ||
      now < idlePausedUntil.current ||
      snapTweenRef.current?.isActive();

    if (!pauseIdle) {
      ring.rotation.y += PROJECT_CAROUSEL_CONFIG.idleRotationSpeed * delta;
      liveRotation.current = ring.rotation.y;
      if (count > 0) {
        const turns = -liveRotation.current / ((Math.PI * 2) / count);
        const nearest = ((Math.round(turns) % count) + count) % count;
        if (nearest !== useProjectCarouselStore.getState().frontIndex) {
          useProjectCarouselStore.setState({ frontIndex: nearest });
        }
      }
    }

    const rot = liveRotation.current;
    for (let i = 0; i < count; i += 1) {
      const group = scaleGroupRefs.current[i];
      if (!group) continue;
      const offset = normalizeAngle(slotAngle(i, count) + rot);
      const s = scaleForAngleOffset(offset);
      group.scale.setScalar(s);
    }
  });

  if (count === 0) {
    return null;
  }

  // Small: horizontal 3D project strip; scroll snaps via mobileNav itemIndex.
  if (tier === "small") {
    return <ProjectMobileCarousel />;
  }

  const anyHovered = hoveredObjectId?.startsWith("project-") ?? false;
  const [ox, oy, oz] = layout.origin;

  const endDrag = (pointerId: number): void => {
    if (dragPointerId.current !== pointerId) return;
    dragPointerId.current = null;
    try {
      gl.domElement.releasePointerCapture(pointerId);
    } catch {
      // Capture may already be released.
    }
    useProjectCarouselStore.getState().setDragging(false);

    if (dragDistance.current < 6 || count <= 0) {
      return;
    }

    // Snap nearest card to the front after a meaningful drag.
    const turns = -liveRotation.current / ((Math.PI * 2) / count);
    const nearest = ((Math.round(turns) % count) + count) % count;
    useProjectCarouselStore.getState().setFrontIndex(nearest);
  };

  return (
    <group position={[ox, oy, oz]}>
      <group
        ref={ringRef}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          event.stopPropagation();
          snapTweenRef.current?.kill();
          dragPointerId.current = event.pointerId;
          lastPointerX.current = event.clientX;
          dragDistance.current = 0;
          useProjectCarouselStore.getState().setDragging(true);
          gl.domElement.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (dragPointerId.current !== event.pointerId) return;
          const ring = ringRef.current;
          if (!ring) return;
          const dx = event.clientX - lastPointerX.current;
          lastPointerX.current = event.clientX;
          dragDistance.current += Math.abs(dx);
          const delta = dx * PROJECT_CAROUSEL_CONFIG.dragSensitivity;
          ring.rotation.y += delta;
          liveRotation.current = ring.rotation.y;
          useProjectCarouselStore.getState().touchInteraction();
        }}
        onPointerUp={(event) => {
          endDrag(event.pointerId);
        }}
        onPointerCancel={(event) => {
          endDrag(event.pointerId);
        }}
      >
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
          <circleGeometry args={[layout.radius + 1.2, 48]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {layout.slots.map((slot) => {
          const project = projects[slot.index];
          const objectId = projectObjectId(project.id);
          const dimmed = anyHovered && hoveredObjectId !== objectId;

          return (
            <group
              key={objectId}
              ref={(node) => {
                scaleGroupRefs.current[slot.index] = node;
              }}
              position={slot.position}
              rotation={[0, slot.yaw, 0]}
            >
              <FloatingCard
                id={objectId}
                variant="project"
                title={project.title}
                sectionLabel={CARD_CONFIG.sectionLabel.project}
                subtitle={project.subtitle}
                bodyLines={[
                  project.category,
                  project.status === "in-progress"
                    ? "In progress"
                    : project.status === "archived"
                      ? "Archived"
                      : "Completed",
                  `${project.role} · ${project.duration}`,
                ]}
                coverUrl={project.images[0]}
                patternKey={CARD_CONFIG.facePattern.project}
                position={[0, 0, 0]}
                phase={slot.phase}
                projectTuning={projectTuning}
                forceOverview
                dimmed={dimmed}
              />
            </group>
          );
        })}
      </group>
    </group>
  );
}
