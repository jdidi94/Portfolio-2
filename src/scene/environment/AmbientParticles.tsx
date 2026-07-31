import type { JSX } from "react";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import {
  PARTICLES_CONFIG,
  type ParticleLayerConfig,
} from "@config/particles";
import { TEXTURE_ASSETS } from "@config/assets";
import { useExperienceStore } from "@store/experienceStore";
import type { Points, Texture } from "three";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  SRGBColorSpace,
} from "three";

interface ParticleLayerProps {
  map: Texture;
  config: ParticleLayerConfig;
  count: number;
}

function ParticleLayer({
  map,
  config,
  count,
}: ParticleLayerProps): JSX.Element {
  const pointsRef = useRef<Points>(null);
  const prefersReducedMotion = useExperienceStore(
    (s) => s.prefersReducedMotion,
  );

  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    const positions = new Float32Array(count * 3);
    const { spreadX, spreadY, spreadZ } = PARTICLES_CONFIG;

    // Deterministic scatter so layers don't reshuffle every remount.
    let state = config.seed >>> 0;
    const next = (): number => {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 0xffffffff;
    };

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      positions[i3] = (next() - 0.5) * spreadX;
      positions[i3 + 1] = (next() - 0.5) * spreadY;
      positions[i3 + 2] = (next() - 0.5) * spreadZ;
    }

    geo.setAttribute("position", new BufferAttribute(positions, 3));
    return geo;
  }, [count, config.seed]);

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
    points.rotation.y +=
      delta * PARTICLES_CONFIG.rotationYSpeed * (0.75 + config.seed * 0.04);
    points.rotation.x += delta * PARTICLES_CONFIG.rotationXSpeed;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        map={map}
        color={config.color}
        size={config.size}
        sizeAttenuation
        transparent
        opacity={config.opacity}
        depthWrite={false}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

function ParticleField(): JSX.Element {
  const prefersReducedMotion = useExperienceStore(
    (s) => s.prefersReducedMotion,
  );
  const layerConfigs = PARTICLES_CONFIG.layers;
  const urls = layerConfigs.map(
    (layer) => TEXTURE_ASSETS[layer.textureKey],
  );
  const maps = useTexture(urls) as Texture[];

  maps.forEach((map) => {
    map.colorSpace = SRGBColorSpace;
  });

  return (
    <group position={PARTICLES_CONFIG.origin}>
      {layerConfigs.map((config, index) => {
        const count = prefersReducedMotion
          ? config.reducedMotionCount
          : config.count;
        return (
          <ParticleLayer
            key={config.textureKey}
            map={maps[index]}
            config={config}
            count={count}
          />
        );
      })}
    </group>
  );
}

/**
 * Full Kenney particle set as layered ambient dust through the corridor.
 */
export function AmbientParticles(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <ParticleField />
    </Suspense>
  );
}
