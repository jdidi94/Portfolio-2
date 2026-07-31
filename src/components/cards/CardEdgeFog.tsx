import { useMemo, useEffect, useRef, type JSX } from "react";
import { useFrame } from "@react-three/fiber";
import { CARD_CONFIG } from "@config/cards";
import { CARD_EDGE_FOG } from "@config/cardEdgeFog";
import {
  CARD_MODEL_BOUNDS,
  faceOffsetCenteredForModel,
  faceShapeForModel,
  faceSizeForModel,
  hexRadiusForModel,
  type CardModelKey,
} from "@config/cardGeometry";
import { useCardEdgeFogTuningParams } from "@store/cardEdgeFogTuningStore";
import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  DoubleSide,
  LinearFilter,
  MathUtils,
  MeshBasicMaterial,
  SRGBColorSpace,
} from "three";

export interface CardEdgeFogProps {
  color: string;
  modelKey: CardModelKey;
  /** 0–1 strength multiplier (hover/focus can raise it). */
  intensity?: number;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function hoverDampLambda(): number {
  return 4 / Math.max(0.05, CARD_CONFIG.transitionDuration);
}

/** Pointy-top hex signed distance (negative inside). */
function hexSignedDistance(px: number, py: number, radius: number): number {
  const x = Math.abs(px);
  const y = Math.abs(py);
  const d1 = y - radius;
  const d2 = Math.sqrt(3) * 0.5 * x + 0.5 * y - radius;
  return Math.max(d1, d2);
}

/** Rounded-rect signed distance (negative inside). */
function roundedRectSignedDistance(
  px: number,
  py: number,
  halfW: number,
  halfH: number,
  corner: number,
): number {
  const radius = Math.min(corner, halfW, halfH);
  const ax = Math.abs(px) - (halfW - radius);
  const ay = Math.abs(py) - (halfH - radius);
  const ox = Math.max(ax, 0);
  const oy = Math.max(ay, 0);
  return Math.hypot(ox, oy) + Math.min(Math.max(ax, ay), 0) - radius;
}

type AuraShape =
  | { kind: "hexagon"; clear: number }
  | {
      kind: "roundedRect";
      halfW: number;
      halfH: number;
      corner: number;
    };

/**
 * Soft aura: transparent inside the silhouette, glow just outside,
 * outer falloff is circular/blurry so corners are not edgy.
 */
function createSoftBlurAuraTexture(
  size: number,
  shape: AuraShape,
  softBand: number,
  circleFadeStart: number,
  circleFadeEnd: number,
  blurPx: number,
): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new CanvasTexture(canvas);
  }

  const image = ctx.createImageData(size, size);
  const data = image.data;
  const cx = (size - 1) * 0.5;
  const cy = (size - 1) * 0.5;
  const half = size * 0.5;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const px = x - cx;
      const py = y - cy;
      const sd =
        shape.kind === "hexagon"
          ? hexSignedDistance(px, py, half * shape.clear)
          : roundedRectSignedDistance(
              px,
              py,
              half * shape.halfW,
              half * shape.halfH,
              half * shape.corner,
            );
      const radial = Math.hypot(px, py) / half;

      let edgeGlow = 0;
      if (sd > 0) {
        const band = half * softBand;
        const n = sd / Math.max(1e-4, band);
        edgeGlow = Math.exp(-n * n * 2.2);
      }

      const circle = 1 - smoothstep(circleFadeStart, circleFadeEnd, radial);
      const alpha = edgeGlow * circle;

      const i = (y * size + x) * 4;
      const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255);
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = a;
    }
  }

  ctx.putImageData(image, 0, 0);

  const blurCanvas = document.createElement("canvas");
  blurCanvas.width = size;
  blurCanvas.height = size;
  const blurCtx = blurCanvas.getContext("2d");
  if (blurCtx && blurPx > 0) {
    blurCtx.filter = `blur(${blurPx}px)`;
    blurCtx.drawImage(canvas, 0, 0);
    const texture = new CanvasTexture(blurCanvas);
    texture.colorSpace = SRGBColorSpace;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Soft blurry neon outer glow for hex + rounded-rect frames.
 * Face stays clear; halo is diffuse (not a hard stroke).
 */
export function CardEdgeFog({
  color,
  modelKey,
  intensity = 1,
}: CardEdgeFogProps): JSX.Element | null {
  const shape = faceShapeForModel(modelKey);
  if (shape !== "hexagon" && shape !== "roundedRect") {
    return null;
  }

  return (
    <CardEdgeFogAura
      color={color}
      modelKey={modelKey}
      intensity={intensity}
      faceShape={shape}
    />
  );
}

function CardEdgeFogAura({
  color,
  modelKey,
  intensity = 1,
  faceShape,
}: CardEdgeFogProps & {
  faceShape: "hexagon" | "roundedRect";
}): JSX.Element {
  const tuning = useCardEdgeFogTuningParams();
  const tint = useMemo(() => new Color(color), [color]);
  const [faceW, faceH] = faceSizeForModel(modelKey);
  const materialRef = useRef<MeshBasicMaterial>(null);
  const strengthCurrent = useRef(0);

  const auraShape = useMemo<AuraShape>(() => {
    if (faceShape === "hexagon") {
      return { kind: "hexagon", clear: tuning.hexClear };
    }
    // Normalized to half-texture; clear region tracks card aspect.
    const maxDim = Math.max(faceW, faceH);
    const clearScale = tuning.hexClear / 0.5;
    return {
      kind: "roundedRect",
      halfW: (faceW / maxDim) * 0.5 * clearScale,
      halfH: (faceH / maxDim) * 0.5 * clearScale,
      corner: 0.08 * clearScale,
    };
  }, [faceShape, faceW, faceH, tuning.hexClear]);

  const auraMap = useMemo(
    () =>
      createSoftBlurAuraTexture(
        CARD_EDGE_FOG.textureSize,
        auraShape,
        tuning.softBand,
        tuning.circleFadeStart,
        tuning.circleFadeEnd,
        tuning.blurPx,
      ),
    [
      auraShape,
      tuning.softBand,
      tuning.circleFadeStart,
      tuning.circleFadeEnd,
      tuning.blurPx,
    ],
  );

  useEffect(() => {
    return () => {
      auraMap.dispose();
    };
  }, [auraMap]);

  useFrame((_, delta) => {
    const material = materialRef.current;
    if (!material) return;
    strengthCurrent.current = MathUtils.damp(
      strengthCurrent.current,
      Math.max(0, intensity),
      hoverDampLambda(),
      delta,
    );
    material.opacity = tuning.opacity * strengthCurrent.current;
    material.visible = strengthCurrent.current > 0.01;
  });

  const center = CARD_MODEL_BOUNDS[modelKey].center;
  const centered = faceOffsetCenteredForModel(modelKey);
  const position: [number, number, number] = [
    centered[0] + center[0],
    centered[1] + center[1],
    centered[2] + center[2] - tuning.zOffset,
  ];

  const planeSize =
    faceShape === "hexagon"
      ? hexRadiusForModel(modelKey) * 2 * tuning.planeScale
      : Math.max(faceW, faceH) * tuning.planeScale;

  return (
    <group position={position} renderOrder={0}>
      <mesh scale={[planeSize, planeSize, 1]} renderOrder={1}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={materialRef}
          map={auraMap}
          color={tint}
          transparent
          opacity={0}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          side={DoubleSide}
          visible={false}
        />
      </mesh>
    </group>
  );
}
