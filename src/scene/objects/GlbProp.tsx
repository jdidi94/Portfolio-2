import { useLayoutEffect, useMemo, useRef } from "react";
import type { JSX } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import { CARD_CONFIG } from "@config/cards";
import {
  MATERIAL_PRESETS,
  type MaterialPresetKey,
} from "@config/materials";
import { TEXTURE_ASSETS, type TextureAssetKey } from "@config/assets";
import {
  Color,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  RepeatWrapping,
  SRGBColorSpace,
  type Object3D,
  type Texture,
} from "three";

export interface GlbPropProps {
  url: string;
  color: string;
  preset?: MaterialPresetKey;
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
  mapKey?: TextureAssetKey;
  skipRaycast?: boolean;
  /** Overrides preset emissive intensity (hover / focus). */
  emissiveIntensity?: number;
}

function disablePointerHits(): void {
  // Decorative props must not steal pointer hits from focus targets.
}

function hoverDampLambda(): number {
  // ~95% settled within transitionDuration.
  return 4 / Math.max(0.05, CARD_CONFIG.transitionDuration);
}

function applyNeonMaterials(
  root: Object3D,
  color: string,
  preset: MaterialPresetKey,
  map: Texture | null,
  disableRaycast: boolean,
  emissiveIntensityOverride?: number,
): MeshStandardMaterial[] {
  const settings = MATERIAL_PRESETS[preset];
  const tint = new Color(color);
  const created: MeshStandardMaterial[] = [];
  const emissiveIntensity =
    emissiveIntensityOverride ?? settings.emissiveIntensity;

  root.traverse((child) => {
    if (!(child instanceof Mesh)) {
      return;
    }

    if (disableRaycast) {
      child.raycast = disablePointerHits;
    }

    const material = new MeshStandardMaterial({
      color: tint.clone(),
      emissive: tint.clone(),
      emissiveIntensity,
      metalness: settings.metalness,
      roughness: settings.roughness,
      transparent: settings.opacity < 1,
      opacity: settings.opacity,
      wireframe: settings.wireframe,
      toneMapped: false,
    });

    if (map) {
      material.map = map;
      material.roughnessMap = map;
      material.needsUpdate = true;
    }

    const previous = child.material;
    child.material = material;
    child.castShadow = false;
    child.receiveShadow = false;
    created.push(material);

    if (Array.isArray(previous)) {
      previous.forEach((entry) => entry.dispose());
    } else if (previous) {
      previous.dispose();
    }
  });

  return created;
}

interface GlbPropMeshProps extends Omit<GlbPropProps, "mapKey"> {
  map: Texture | null;
}

function GlbPropMesh({
  url,
  color,
  preset = "neonGlass",
  scale = 1,
  rotation = [0, 0, 0],
  map,
  skipRaycast = true,
  emissiveIntensity,
}: GlbPropMeshProps): JSX.Element {
  const { scene } = useGLTF(url);
  const clone = useMemo(() => scene.clone(true), [scene]);
  const materialsRef = useRef<MeshStandardMaterial[]>([]);
  const currentEmissive = useRef(
    emissiveIntensity ?? MATERIAL_PRESETS[preset].emissiveIntensity,
  );

  useLayoutEffect(() => {
    if (map) {
      map.colorSpace = SRGBColorSpace;
      map.wrapS = RepeatWrapping;
      map.wrapT = RepeatWrapping;
    }

    const created = applyNeonMaterials(
      clone,
      color,
      preset,
      map,
      skipRaycast,
      currentEmissive.current,
    );
    materialsRef.current = created;

    return () => {
      created.forEach((material) => material.dispose());
      materialsRef.current = [];
    };
  }, [clone, color, preset, map, skipRaycast]);

  useFrame((_, delta) => {
    const target =
      emissiveIntensity ?? MATERIAL_PRESETS[preset].emissiveIntensity;
    currentEmissive.current = MathUtils.damp(
      currentEmissive.current,
      target,
      hoverDampLambda(),
      delta,
    );
    for (const material of materialsRef.current) {
      material.emissiveIntensity = currentEmissive.current;
    }
  });

  return <primitive object={clone} scale={scale} rotation={rotation} />;
}

function GlbPropWithMap({
  mapKey,
  ...rest
}: GlbPropProps & { mapKey: TextureAssetKey }): JSX.Element {
  const map = useTexture(TEXTURE_ASSETS[mapKey]);
  return <GlbPropMesh {...rest} map={map} />;
}

/**
 * Loads a GLB, clones it, and recolors with shared neon material presets.
 * Geometry comes from the asset; palette stays in config / code.
 */
export function GlbProp({ mapKey, ...rest }: GlbPropProps): JSX.Element {
  if (mapKey) {
    return <GlbPropWithMap {...rest} mapKey={mapKey} />;
  }
  return <GlbPropMesh {...rest} map={null} />;
}

export function preloadModel(url: string): void {
  useGLTF.preload(url);
}
