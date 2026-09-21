import { useRef, type JSX, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { PERFORMANCE_CONFIG } from "@config/performance";
import { cameraMotion } from "@scene/camera/cameraMotion";

interface SectionDistanceGateProps {
  /** Section band Z (more negative = deeper). */
  centerZ: number;
  margin?: number;
  children: ReactNode;
}

/**
 * Skips draw calls for corridor bands far from the framed lookAt.
 * Groups stay mounted so boot / textures stay warm — only `visible` flips.
 */
export function SectionDistanceGate({
  centerZ,
  margin = PERFORMANCE_CONFIG.sectionVisibleMargin,
  children,
}: SectionDistanceGateProps): JSX.Element {
  const ref = useRef<Group>(null);
  const wasVisible = useRef(true);

  useFrame(() => {
    const group = ref.current;
    if (!group) {
      return;
    }
    const visible = Math.abs(cameraMotion.lookAt.z - centerZ) <= margin;
    if (wasVisible.current === visible) {
      return;
    }
    wasVisible.current = visible;
    group.visible = visible;
  });

  return <group ref={ref}>{children}</group>;
}
