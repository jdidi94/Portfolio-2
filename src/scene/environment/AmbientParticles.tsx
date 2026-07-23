import type { JSX } from "react";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { PARTICLES_CONFIG } from "@config/particles";
import { TEXTURE_ASSETS } from "@config/assets";
import { useExperienceStore } from "@store/experienceStore";
import type { Points } from "three";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  SRGBColorSpace,
} from "three";

function ParticleField(): JSX.Element {
  const pointsRef = useRef<Points>(null);
  const prefersReducedMotion = useExperienceStore(
    (s) => s.prefersReducedMotion,
  );
  const glowMap = useTexture(TEXTURE_ASSETS.glowSoft);
  glowMap.colorSpace = SRGBColorSpace;

  const count = prefersReducedMotion
    ? PARTICLES_CONFIG.reducedMotionCount
    : PARTICLES_CONFIG.count;

  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    const positions = new Float32Array(count * 3);
    const { spreadX, spreadY, spreadZ } = PARTICLES_CONFIG;

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * spreadX;
      positions[i3 + 1] = (Math.random() - 0.5) * spreadY;
      positions[i3 + 2] = (Math.random() - 0.5) * spreadZ;
    }

    geo.setAttribute("position", new BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame((_, delta) => {
    const points = pointsRef.current;
    if (!points || prefersReducedMotion) {
      return;
    }
    points.rotation.y += delta * PARTICLES_CONFIG.rotationYSpeed;
    points.rotation.x += delta * PARTICLES_CONFIG.rotationXSpeed;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        map={glowMap}
        color={PARTICLES_CONFIG.color}
        size={PARTICLES_CONFIG.size}
        sizeAttenuation
        transparent
        opacity={PARTICLES_CONFIG.opacity}
        depthWrite={false}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

export function AmbientParticles(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <ParticleField />
    </Suspense>
  );
}
