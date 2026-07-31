import { useEffect, useMemo, useRef, type JSX } from "react";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import type { Group } from "three";
import {
  defaultRideProgress,
  ELEVATOR_CONFIG,
  resolveElevatorLayout,
  rideOffsetY,
  type ElevatorPlatformSlot,
} from "@config/elevator";
import { MOBILE_NAV_CONFIG } from "@config/mobileNav";
import { COLORS } from "@config/colors";
import { ElevatorPlatform } from "@scene/sections/ElevatorPlatform";
import { useElevatorStore } from "@store/elevatorStore";
import { useExperienceStore } from "@store/experienceStore";
import { useMobileNavStore } from "@store/mobileNavStore";
import { useViewportStore } from "@store/viewportStore";
import {
  ELEVATOR_WAYPOINT_ID,
  ELEVATOR_DETAIL_WAYPOINT_ID,
  timelineIdFromObjectId,
} from "@utils/elevatorIds";

/**
 * Small: stairs focus carousel — focused milestone fills the frame;
 * neighbors step back on Y/Z like a staircase.
 */
function TimelineStairsCarousel({
  platforms,
  itemIndex,
  origin,
  prefersReducedMotion,
}: {
  platforms: readonly ElevatorPlatformSlot[];
  itemIndex: number;
  origin: readonly [number, number, number];
  prefersReducedMotion: boolean;
}): JSX.Element {
  const stackRef = useRef<Group>(null);
  const stairTweenRef = useRef<gsap.core.Tween | null>(null);
  const spacingY = MOBILE_NAV_CONFIG.timelineStairSpacingY;
  const spacingZ = MOBILE_NAV_CONFIG.timelineStairSpacingZ;
  const spacingX = MOBILE_NAV_CONFIG.timelineStairSpacingX;

  useEffect(() => {
    const group = stackRef.current;
    if (!group) return;

    // Bring the focused stair down to look-at (stack rises upstairs).
    const targetY = -itemIndex * spacingY;
    const targetZ = itemIndex * spacingZ;
    stairTweenRef.current?.kill();

    if (prefersReducedMotion) {
      group.position.y = targetY;
      group.position.z = targetZ;
      return;
    }

    stairTweenRef.current = gsap.to(group.position, {
      y: targetY,
      z: targetZ,
      duration: MOBILE_NAV_CONFIG.carouselSnapSeconds,
      ease: MOBILE_NAV_CONFIG.carouselSnapEase,
    });

    return () => {
      stairTweenRef.current?.kill();
    };
  }, [itemIndex, spacingY, spacingZ, prefersReducedMotion]);

  return (
    <group
      position={[
        origin[0],
        origin[1] + MOBILE_NAV_CONFIG.timelineClusterOffsetY,
        origin[2],
      ]}
    >
      <group ref={stackRef}>
        {platforms.map((platform, index) => {
          const delta = index - itemIndex;
          const focused = delta === 0;
          return (
            <group
              key={platform.id}
              position={[
                delta * spacingX,
                index * spacingY,
                -index * spacingZ,
              ]}
            >
              <ElevatorPlatform
                platform={{ ...platform, localY: 0 }}
                radius={ELEVATOR_CONFIG.platformRadius * 0.65}
                cardModelScale={MOBILE_NAV_CONFIG.timelineCardModelScale}
                dimmedOverride={!focused}
                hideFloor
              />
            </group>
          );
        })}
      </group>
    </group>
  );
}

/**
 * Vertical Infinite Elevator at the timeline corridor depth.
 * Small: stairs focus carousel driven by mobileNav itemIndex.
 */
export function Elevator(): JSX.Element | null {
  const tier = useViewportStore((s) => s.tier);
  const activeSection = useExperienceStore((s) => s.activeSection);
  const focusObjectId = useExperienceStore((s) => s.focusObjectId);
  const cameraDestinationId = useExperienceStore((s) => s.cameraDestinationId);
  const hoveredObjectId = useExperienceStore((s) => s.hoveredObjectId);
  const prefersReducedMotion = useExperienceStore(
    (s) => s.prefersReducedMotion,
  );
  const selectedEventId = useElevatorStore((s) => s.selectedEventId);
  const pendingSnapIndex = useElevatorStore((s) => s.pendingSnapIndex);
  const isPaused = useElevatorStore((s) => s.isPaused);
  const interactionEpoch = useElevatorStore((s) => s.interactionEpoch);
  const itemIndex = useMobileNavStore((s) => s.itemIndex);

  const rideGroupRef = useRef<Group>(null);
  const rideProgress = useRef(0);
  const idlePausedUntil = useRef(0);
  const snapTweenRef = useRef<gsap.core.Tween | null>(null);
  const initialized = useRef(false);

  const layout = useMemo(
    () => resolveElevatorLayout(tier === "small" ? "desktop" : tier),
    [tier],
  );

  const inElevator =
    activeSection === "timeline" ||
    focusObjectId === ELEVATOR_WAYPOINT_ID ||
    focusObjectId === ELEVATOR_DETAIL_WAYPOINT_ID ||
    cameraDestinationId === ELEVATOR_WAYPOINT_ID ||
    cameraDestinationId === ELEVATOR_DETAIL_WAYPOINT_ID ||
    selectedEventId !== null;

  useEffect(() => {
    if (!initialized.current) {
      rideProgress.current = defaultRideProgress(layout);
      initialized.current = true;
    }
  }, [layout]);

  useEffect(() => {
    idlePausedUntil.current =
      performance.now() / 1000 + ELEVATOR_CONFIG.resumeDelaySeconds;
  }, [interactionEpoch]);

  useEffect(() => {
    const group = rideGroupRef.current;
    if (!group || pendingSnapIndex === null || tier === "small") return;

    const dest = pendingSnapIndex;
    snapTweenRef.current?.kill();

    if (prefersReducedMotion) {
      rideProgress.current = dest;
      group.position.y = rideOffsetY(dest, layout.spacing);
      useElevatorStore.getState().clearPendingSnap();
      return;
    }

    const proxy = { value: rideProgress.current };
    snapTweenRef.current = gsap.to(proxy, {
      value: dest,
      duration: ELEVATOR_CONFIG.snapSeconds,
      ease: ELEVATOR_CONFIG.snapEase,
      onUpdate: () => {
        rideProgress.current = proxy.value;
        group.position.y = rideOffsetY(proxy.value, layout.spacing);
      },
      onComplete: () => {
        rideProgress.current = dest;
        group.position.y = rideOffsetY(dest, layout.spacing);
        useElevatorStore.getState().clearPendingSnap();
      },
    });

    return () => {
      snapTweenRef.current?.kill();
    };
  }, [pendingSnapIndex, prefersReducedMotion, layout.spacing, tier]);

  useFrame((_, delta) => {
    if (tier === "small") return;
    const group = rideGroupRef.current;
    if (!group || !inElevator) return;

    const now = performance.now() / 1000;
    const panelOpen = selectedEventId !== null;
    const snapping = pendingSnapIndex !== null;
    const paused =
      prefersReducedMotion ||
      isPaused ||
      panelOpen ||
      snapping ||
      now < idlePausedUntil.current;

    let speed = ELEVATOR_CONFIG.riseSpeed;
    const hoverId = timelineIdFromObjectId(hoveredObjectId ?? "");
    if (hoverId) {
      const hoverIndex = layout.platforms.findIndex((p) => p.id === hoverId);
      if (hoverIndex >= 0) {
        const dist = Math.abs(rideProgress.current - hoverIndex);
        if (dist < ELEVATOR_CONFIG.hoverSlowRadius) {
          speed *= ELEVATOR_CONFIG.hoverSlowdown;
        }
      }
    }

    if (!paused) {
      const max = Math.max(0, layout.platforms.length - 1);
      let next = rideProgress.current + speed * delta;
      if (next > max) {
        next = 0;
      }
      rideProgress.current = next;
      group.position.y = rideOffsetY(next, layout.spacing);
      useElevatorStore.getState().syncRideIndex(Math.round(next));
    } else {
      group.position.y = rideOffsetY(rideProgress.current, layout.spacing);
    }
  });

  useEffect(() => {
    if (tier !== "small") return;
    useElevatorStore.getState().syncRideIndex(itemIndex);
  }, [tier, itemIndex]);

  const [ox, oy, oz] = layout.origin;

  if (tier === "small") {
    return (
      <TimelineStairsCarousel
        platforms={layout.platforms}
        itemIndex={itemIndex}
        origin={[ox, oy, oz]}
        prefersReducedMotion={prefersReducedMotion}
      />
    );
  }

  const shaftHalf = layout.shaftHeight / 2;

  return (
    <group position={[ox, oy, oz]}>
      <mesh position={[0, layout.shaftCenterY, 0]} raycast={() => {}}>
        <cylinderGeometry args={[0.08, 0.08, layout.shaftHeight, 12]} />
        <meshBasicMaterial
          color={COLORS.cyan}
          transparent
          opacity={0.22}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, layout.shaftCenterY, 0]} raycast={() => {}}>
        <cylinderGeometry args={[0.55, 0.55, layout.shaftHeight, 24]} />
        <meshBasicMaterial
          color={COLORS.purple}
          transparent
          opacity={0.05}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh
        position={[0, layout.shaftCenterY + shaftHalf, 0]}
        raycast={() => {}}
      >
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshBasicMaterial
          color={COLORS.white}
          transparent
          opacity={0.35}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh
        position={[0, layout.shaftCenterY - shaftHalf, 0]}
        raycast={() => {}}
      >
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshBasicMaterial
          color={COLORS.cyan}
          transparent
          opacity={0.25}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <group
        ref={rideGroupRef}
        position={[
          0,
          rideOffsetY(defaultRideProgress(layout), layout.spacing),
          0,
        ]}
      >
        {layout.platforms.map((platform) => (
          <ElevatorPlatform
            key={platform.id}
            platform={platform}
            radius={layout.platformRadius}
            cardModelScale={layout.cardModelScale}
          />
        ))}
      </group>
    </group>
  );
}
