import { useMemo, useRef } from "react";
import type { JSX, ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { FLOAT_CONFIG } from "@config/float";
import { CARD_CONFIG } from "@config/cards";
import { useExperienceStore } from "@store/experienceStore";
import { MathUtils, type Group } from "three";

interface FloatProps {
  children: ReactNode;
  amplitude?: number;
  speed?: number;
  rotationSpeed?: number;
  phase?: number;
}

export function Float({
  children,
  amplitude = FLOAT_CONFIG.amplitude,
  speed = FLOAT_CONFIG.speed,
  rotationSpeed = FLOAT_CONFIG.rotationSpeed,
  phase,
}: FloatProps): JSX.Element {
  const groupRef = useRef<Group>(null);
  const prefersReducedMotion = useExperienceStore(
    (s) => s.prefersReducedMotion,
  );
  const resolvedPhase = useMemo(
    () => phase ?? Math.random() * Math.PI * 2,
    [phase],
  );
  const baseY = useRef<number | null>(null);
  const amplitudeCurrent = useRef(amplitude);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    if (baseY.current === null) {
      baseY.current = group.position.y;
    }

    const lambda = 4 / Math.max(0.05, CARD_CONFIG.transitionDuration);
    amplitudeCurrent.current = MathUtils.damp(
      amplitudeCurrent.current,
      prefersReducedMotion ? 0 : amplitude,
      lambda,
      delta,
    );

    if (amplitudeCurrent.current <= 0.0005) {
      group.position.y = baseY.current;
      return;
    }

    const t = state.clock.elapsedTime * speed + resolvedPhase;
    group.position.y =
      baseY.current + Math.sin(t) * amplitudeCurrent.current;
    group.rotation.y += delta * rotationSpeed;
  });

  return <group ref={groupRef}>{children}</group>;
}
