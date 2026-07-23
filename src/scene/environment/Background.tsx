import type { JSX } from "react";
import { Suspense, useMemo } from "react";
import { useTexture } from "@react-three/drei";
import { BackSide, Color, SRGBColorSpace } from "three";
import { COLORS } from "@config/colors";
import { TEXTURE_ASSETS } from "@config/assets";
import { ENVIRONMENT_CONFIG } from "@config/environment";

function BackgroundTextures(): JSX.Element {
  const { glow } = ENVIRONMENT_CONFIG;
  const [gradientMap, gridMap] = useTexture([
    TEXTURE_ASSETS.gradientRadial,
    TEXTURE_ASSETS.gridSubtle,
  ]);

  gradientMap.colorSpace = SRGBColorSpace;
  gridMap.colorSpace = SRGBColorSpace;

  const innerColor = useMemo(
    () => new Color(glow.innerColor),
    [glow.innerColor],
  );
  const outerColor = useMemo(
    () => new Color(glow.outerColor),
    [glow.outerColor],
  );

  return (
    <>
      <mesh scale={glow.outerScale} renderOrder={-3}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={outerColor}
          transparent
          opacity={glow.outerOpacity}
          side={BackSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh scale={glow.innerScale} renderOrder={-2}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          map={gradientMap}
          color={innerColor}
          transparent
          opacity={glow.gradientOpacity}
          side={BackSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh scale={glow.gridScale} renderOrder={-1}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial
          map={gridMap}
          color={COLORS.cyan}
          transparent
          opacity={glow.gridOpacity}
          side={BackSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </>
  );
}

/**
 * Void clear color plus soft radial glow / grid depth from texture assets.
 */
export function Background(): JSX.Element {
  return (
    <>
      <color attach="background" args={[COLORS.black]} />
      <Suspense fallback={null}>
        <BackgroundTextures />
      </Suspense>
    </>
  );
}
