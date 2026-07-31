import { useEffect, useMemo } from "react";
import type { JSX } from "react";
import { useTexture } from "@react-three/drei";
import { CARD_CONFIG } from "@config/cards";
import {
  faceShapeForVariant,
  faceShapeForModel,
  faceSizeForModel,
  faceOffsetCenteredForModel,
  hexRadiusForVariant,
  hexRadiusForModel,
  ellipseRadiiForVariant,
  ellipseRadiiForModel,
  boundsForVariant,
  CARD_MODEL_BOUNDS,
  type CardFaceShape,
  type CardModelKey,
} from "@config/cardGeometry";
import {
  resolveHeroFaceLayout,
  type HeroFaceTuningParams,
} from "@config/heroFaceTuning";
import {
  resolveProjectFaceLayout,
  type ProjectFaceTuningParams,
} from "@config/projectFaceTuning";
import { TEXTURE_ASSETS, type TextureAssetKey } from "@config/assets";
import type { ContentCardVariant } from "@shared-types/content";
import { createCardFaceTexture } from "@utils/createCardFaceTexture";
import { useCardFaceTypeParams } from "@store/cardFaceTypeStore";
import {
  Shape,
  ShapeGeometry,
  type BufferAttribute,
  type Texture,
} from "three";

export interface CardFaceProps {
  variant: ContentCardVariant;
  title: string;
  sectionLabel?: string;
  subtitle?: string;
  bodyLines?: readonly string[];
  focused?: boolean;
  accent: string;
  patternKey?: TextureAssetKey;
  coverUrl?: string;
  /** Technology Hive — centered logo, no overview text. */
  logoOnly?: boolean;
  /** Technology Hive placeholders — draws a lock and shows "not ready yet". */
  locked?: boolean;
  /** Technology Hive — logo-only mode without drawing the icon. */
  hideLogo?: boolean;
  /** Overrides GLB-matched face silhouette (Tech Hive category model). */
  modelKeyOverride?: CardModelKey;
  heroTuning?: HeroFaceTuningParams;
  projectTuning?: ProjectFaceTuningParams;
  /**
   * When true, face is parented under the same group as the GLB
   * (model-local space with origin at mesh bottom / asset origin).
   */
  inModelSpace?: boolean;
}

interface FacePlaneProps {
  variant: ContentCardVariant;
  title: string;
  sectionLabel?: string;
  subtitle?: string;
  bodyLines?: readonly string[];
  focused?: boolean;
  accent: string;
  pattern: Texture;
  cover: Texture | null;
  logoOnly?: boolean;
  locked?: boolean;
  hideLogo?: boolean;
  modelKeyOverride?: CardModelKey;
  heroTuning?: HeroFaceTuningParams;
  projectTuning?: ProjectFaceTuningParams;
  inModelSpace?: boolean;
}

function createHexShape(radius: number): Shape {
  const shape = new Shape();
  for (let i = 0; i < 6; i += 1) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }
  shape.closePath();
  return shape;
}

function createEllipseShape(rx: number, ry: number): Shape {
  const shape = new Shape();
  shape.absellipse(0, 0, rx, ry, 0, Math.PI * 2, false, 0);
  return shape;
}

/** Pointy-top isosceles triangle filling width × height. */
function createTriangleShape(width: number, height: number): Shape {
  const w = width / 2;
  const h = height / 2;
  const shape = new Shape();
  shape.moveTo(0, h);
  shape.lineTo(w, -h);
  shape.lineTo(-w, -h);
  shape.closePath();
  return shape;
}

function createRoundedRectShape(
  width: number,
  height: number,
  radiusRatio: number,
): Shape {
  const w = width / 2;
  const h = height / 2;
  const r = Math.min(width, height) * radiusRatio;
  const shape = new Shape();
  shape.moveTo(-w + r, -h);
  shape.lineTo(w - r, -h);
  shape.quadraticCurveTo(w, -h, w, -h + r);
  shape.lineTo(w, h - r);
  shape.quadraticCurveTo(w, h, w - r, h);
  shape.lineTo(-w + r, h);
  shape.quadraticCurveTo(-w, h, -w, h - r);
  shape.lineTo(-w, -h + r);
  shape.quadraticCurveTo(-w, -h, -w + r, -h);
  return shape;
}

/**
 * ShapeGeometry UVs are raw shape XY (often -0.5…0.5), not 0–1.
 * Without this, the texture only paints a small off-center patch inside the mesh.
 */
function normalizeShapeGeometryUVs(geometry: ShapeGeometry): void {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  if (!box) {
    return;
  }

  const uv = geometry.attributes.uv as BufferAttribute | undefined;
  const position = geometry.attributes.position as BufferAttribute;
  if (!uv) {
    return;
  }

  const width = box.max.x - box.min.x || 1;
  const height = box.max.y - box.min.y || 1;

  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i);
    const y = position.getY(i);
    uv.setXY(i, (x - box.min.x) / width, (y - box.min.y) / height);
  }
  uv.needsUpdate = true;
}

interface FaceLayoutResolved {
  shape: CardFaceShape;
  faceW: number;
  faceH: number;
  hexRadius: number;
  ellipseRx: number;
  ellipseRy: number;
  widthScale: number;
  heightScale: number;
  offset: [number, number, number];
  rotationY: number;
  cornerRadius: number;
  showMeasureHelper: boolean;
}

function resolveFaceLayout(
  variant: ContentCardVariant,
  heroTuning?: HeroFaceTuningParams,
  projectTuning?: ProjectFaceTuningParams,
  inModelSpace = false,
  modelKeyOverride?: CardModelKey,
): FaceLayoutResolved {
  let resolved: FaceLayoutResolved;

  if (variant === "hero" && heroTuning) {
    const layout = resolveHeroFaceLayout(heroTuning);
    resolved = {
      shape: layout.shape,
      faceW: layout.faceWidth,
      faceH: layout.faceHeight,
      hexRadius: layout.hexRadius,
      ellipseRx: layout.ellipseRx,
      ellipseRy: layout.ellipseRy,
      widthScale: layout.widthScale,
      heightScale: layout.heightScale,
      offset: layout.offset,
      rotationY: 0,
      cornerRadius: layout.cornerRadius,
      showMeasureHelper: layout.showMeasureHelper,
    };
  } else if (
    (variant === "project" || variant === "experience") &&
    projectTuning
  ) {
    const layout = resolveProjectFaceLayout(projectTuning);
    resolved = {
      shape: layout.shape,
      faceW: layout.faceWidth,
      faceH: layout.faceHeight,
      hexRadius: layout.hexRadius,
      ellipseRx: layout.ellipseRx,
      ellipseRy: layout.ellipseRy,
      widthScale: layout.widthScale,
      heightScale: layout.heightScale,
      offset: layout.offset,
      rotationY: layout.rotationY,
      cornerRadius: layout.cornerRadius,
      showMeasureHelper: layout.showMeasureHelper,
    };
  } else if (modelKeyOverride) {
    const shape = faceShapeForModel(modelKeyOverride);
    const [faceW, faceH] = faceSizeForModel(modelKeyOverride);
    const offset = faceOffsetCenteredForModel(modelKeyOverride);
    const ellipse = ellipseRadiiForModel(modelKeyOverride);
    resolved = {
      shape,
      faceW,
      faceH,
      hexRadius: hexRadiusForModel(modelKeyOverride),
      ellipseRx: ellipse[0],
      ellipseRy: ellipse[1],
      widthScale: 1,
      heightScale: 1,
      offset,
      rotationY: 0,
      cornerRadius: 0.1,
      showMeasureHelper: false,
    };
  } else {
    const shape = faceShapeForVariant(variant);
    const [faceW, faceH] = CARD_CONFIG.faceSize[variant];
    const offset = CARD_CONFIG.faceOffset[variant];
    resolved = {
      shape,
      faceW,
      faceH,
      hexRadius: hexRadiusForVariant(variant),
      ellipseRx: ellipseRadiiForVariant(variant)[0],
      ellipseRy: ellipseRadiiForVariant(variant)[1],
      widthScale: 1,
      heightScale: 1,
      offset,
      rotationY: 0,
      cornerRadius: 0.1,
      showMeasureHelper: false,
    };
  }

  if (!inModelSpace) {
    return resolved;
  }

  // Convert centered-space offset → model-local (asset origin) offset.
  const center = modelKeyOverride
    ? CARD_MODEL_BOUNDS[modelKeyOverride].center
    : boundsForVariant(variant).center;
  return {
    ...resolved,
    offset: [
      resolved.offset[0] + center[0],
      resolved.offset[1] + center[1],
      resolved.offset[2] + center[2],
    ],
  };
}

function FacePlane({
  variant,
  title,
  sectionLabel,
  subtitle,
  bodyLines,
  focused = false,
  accent,
  pattern,
  cover,
  logoOnly = false,
  locked = false,
  hideLogo = false,
  modelKeyOverride,
  heroTuning,
  projectTuning,
  inModelSpace = false,
}: FacePlaneProps): JSX.Element {
  const faceType = useCardFaceTypeParams();
  const layout = resolveFaceLayout(
    variant,
    heroTuning,
    projectTuning,
    inModelSpace,
    modelKeyOverride,
  );

  const geometry = useMemo(() => {
    let path: Shape;
    if (layout.shape === "hexagon") {
      path = createHexShape(layout.hexRadius);
    } else if (layout.shape === "ellipse") {
      path = createEllipseShape(layout.ellipseRx, layout.ellipseRy);
    } else if (layout.shape === "triangle") {
      path = createTriangleShape(layout.faceW, layout.faceH);
    } else {
      path = createRoundedRectShape(
        layout.faceW,
        layout.faceH,
        layout.cornerRadius,
      );
    }
    const geo = new ShapeGeometry(path);
    normalizeShapeGeometryUVs(geo);
    return geo;
  }, [
    layout.shape,
    layout.hexRadius,
    layout.ellipseRx,
    layout.ellipseRy,
    layout.faceW,
    layout.faceH,
    layout.cornerRadius,
  ]);

  const textureHeight = 2048;
  const textureWidth = Math.max(
    1024,
    Math.round(textureHeight * (layout.faceW / Math.max(layout.faceH, 0.01))),
  );

  const bodyKey = bodyLines?.join("\n") ?? "";
  const faceTypeKey = Object.values(faceType).join("|");
  const resolvedSection =
    sectionLabel ?? CARD_CONFIG.sectionLabel[variant];
  const faceMode = logoOnly ? "overview" : focused ? "detail" : "overview";
  const faceTexture = useMemo(
    () =>
      createCardFaceTexture({
        title,
        sectionLabel: resolvedSection,
        subtitle,
        bodyLines,
        mode: faceMode,
        logoOnly,
        locked,
        hideLogo,
        variant,
        accent,
        cover,
        pattern: cover && focused ? null : pattern,
        width: textureWidth,
        height: textureHeight,
        shape: layout.shape,
        cornerRadiusRatio: layout.cornerRadius,
        // Hive logo faces: colored border lives on the GLB, not a painted rim.
        drawRim: !logoOnly && resolvedSection === "Technology Hive",
        faceType,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- bodyLines via bodyKey; faceType via faceTypeKey
    [
      title,
      resolvedSection,
      subtitle,
      bodyKey,
      faceMode,
      logoOnly,
      locked,
      hideLogo,
      variant,
      accent,
      cover,
      pattern,
      textureWidth,
      textureHeight,
      layout.shape,
      layout.cornerRadius,
      faceTypeKey,
      faceType,
    ],
  );

  useEffect(() => {
    return () => {
      faceTexture.dispose();
    };
  }, [faceTexture]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  return (
    <group
      position={layout.offset}
      rotation={[0, layout.rotationY, 0]}
      scale={[layout.widthScale, layout.heightScale, 1]}
    >
      <mesh geometry={geometry} renderOrder={2}>
        <meshBasicMaterial
          map={faceTexture}
          transparent
          opacity={CARD_CONFIG.faceOpacity}
          toneMapped={false}
          depthWrite={focused}
          depthTest
          polygonOffset
          polygonOffsetFactor={-2}
          polygonOffsetUnits={-2}
        />
      </mesh>
      {layout.showMeasureHelper ? (
        <lineSegments renderOrder={3}>
          <edgesGeometry args={[geometry]} />
          <lineBasicMaterial
            color={accent}
            transparent
            opacity={0.7}
            toneMapped={false}
            depthWrite={false}
          />
        </lineSegments>
      ) : null}
    </group>
  );
}

function CardFaceWithCover({
  variant,
  title,
  sectionLabel,
  subtitle,
  bodyLines,
  focused,
  accent,
  patternKey,
  coverUrl,
  logoOnly,
  hideLogo,
  locked,
  modelKeyOverride,
  heroTuning,
  projectTuning,
  inModelSpace,
}: CardFaceProps & { patternKey: TextureAssetKey; coverUrl: string }): JSX.Element {
  const [pattern, cover] = useTexture([
    TEXTURE_ASSETS[patternKey],
    coverUrl,
  ]) as [Texture, Texture];

  return (
    <FacePlane
      variant={variant}
      title={title}
      sectionLabel={sectionLabel}
      subtitle={subtitle}
      bodyLines={bodyLines}
      focused={focused}
      accent={accent}
      pattern={pattern}
      cover={cover}
      logoOnly={logoOnly}
      hideLogo={hideLogo}
      locked={locked}
      modelKeyOverride={modelKeyOverride}
      heroTuning={heroTuning}
      projectTuning={projectTuning}
      inModelSpace={inModelSpace}
    />
  );
}

function CardFacePatternOnly({
  variant,
  title,
  sectionLabel,
  subtitle,
  bodyLines,
  focused,
  accent,
  patternKey,
  logoOnly,
  hideLogo,
  locked,
  modelKeyOverride,
  heroTuning,
  projectTuning,
  inModelSpace,
}: CardFaceProps & { patternKey: TextureAssetKey }): JSX.Element {
  const pattern = useTexture(TEXTURE_ASSETS[patternKey]) as Texture;

  return (
    <FacePlane
      variant={variant}
      title={title}
      sectionLabel={sectionLabel}
      subtitle={subtitle}
      bodyLines={bodyLines}
      focused={focused}
      accent={accent}
      pattern={pattern}
      cover={null}
      logoOnly={logoOnly}
      hideLogo={hideLogo}
      locked={locked}
      modelKeyOverride={modelKeyOverride}
      heroTuning={heroTuning}
      projectTuning={projectTuning}
      inModelSpace={inModelSpace}
    />
  );
}

export function CardFace({
  patternKey,
  coverUrl,
  ...rest
}: CardFaceProps): JSX.Element {
  const resolvedPattern =
    patternKey ?? CARD_CONFIG.facePattern[rest.variant];

  if (coverUrl) {
    return (
      <CardFaceWithCover
        {...rest}
        patternKey={resolvedPattern}
        coverUrl={coverUrl}
      />
    );
  }

  return (
    <CardFacePatternOnly {...rest} patternKey={resolvedPattern} />
  );
}
