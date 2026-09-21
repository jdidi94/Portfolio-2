import { Suspense, useMemo, useRef, type ReactNode } from "react";
import type { JSX } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { CARD_CONFIG, CARD_VARIANT_VISUALS } from "@config/cards";
import { CARD_LAYOUT } from "@config/cardLayout";
import {
  CARD_MODEL_BOUNDS,
  faceShapeForModel,
  hitBoxForModel,
  modelCenterOffset,
  modelCenterOffsetForModel,
  modelScaleForVariant,
  modelUrlForModelKey,
  VARIANT_MODEL_KEY,
  type CardModelKey,
} from "@config/cardGeometry";
import { MODEL_ASSETS, type TextureAssetKey } from "@config/assets";
import { useCardEdgeFogTuningParams } from "@store/cardEdgeFogTuningStore";
import type { ContentCardVariant } from "@shared-types/content";
import type { HeroFaceTuningParams } from "@config/heroFaceTuning";
import {
  projectFaceRotationRadians,
  type ProjectFaceTuningParams,
} from "@config/projectFaceTuning";
import { InteractionManager } from "@interaction/InteractionManager";
import { CursorManager } from "@interaction/CursorManager";
import { Float } from "@scene/objects/Float";
import { GlbProp } from "@scene/objects/GlbProp";
import { CardFace } from "@components/cards/CardFace";
import { CardEdgeFog } from "@components/cards/CardEdgeFog";
import { useExperienceStore } from "@store/experienceStore";
import { useTechHiveStore } from "@store/techHiveStore";
import { useProjectCarouselStore } from "@store/projectCarouselStore";
import { useElevatorStore } from "@store/elevatorStore";
import { useExperiencePanelStore } from "@store/experiencePanelStore";
import { useViewportStore } from "@store/viewportStore";
import { useContactFaceLinksParams } from "@store/contactFaceLinksStore";
import { isTechObjectId, techIdFromObjectId } from "@utils/techIds";
import { isProjectObjectId, projectIdFromObjectId } from "@utils/projectIds";
import {
  isExperienceObjectId,
  experienceIdFromObjectId,
} from "@utils/experienceIds";
import {
  isTimelineObjectId,
  timelineIdFromObjectId,
} from "@utils/elevatorIds";
import { MathUtils, type Group } from "three";

function ContactFaceOverlayHost({
  modelKey,
  overlay,
}: {
  modelKey: CardModelKey;
  overlay: ReactNode;
}): JSX.Element {
  const params = useContactFaceLinksParams();
  const bounds = CARD_MODEL_BOUNDS[modelKey];

  return (
    <Html
      transform
      sprite={false}
      pointerEvents="auto"
      position={[
        params.offsetX,
        params.offsetY,
        bounds.frontZ + params.offsetZ,
      ]}
      distanceFactor={params.distanceFactor}
      style={{
        transform: "translate(-50%, -50%)",
        pointerEvents: "auto",
      }}
      zIndexRange={[20, 0]}
    >
      {overlay}
    </Html>
  );
}
export interface FloatingCardProps {
  id: string;
  variant: ContentCardVariant;
  title: string;
  sectionLabel?: string;
  subtitle?: string;
  bodyLines?: readonly string[];
  position: [number, number, number];
  phase?: number;
  coverUrl?: string;
  patternKey?: TextureAssetKey;
  /** Overrides GLB tint + card-face rim/glow color (e.g. Tech Hive category). */
  accentOverride?: string;
  /** Overrides card GLB + face silhouette (e.g. Tech Hive category model). */
  modelKeyOverride?: CardModelKey;
  /** First section only — live face fit overrides. */
  heroTuning?: HeroFaceTuningParams;
  /** Project / experience rect cards — live face rotation override. */
  projectTuning?: ProjectFaceTuningParams;
  /** Optional uniform model scale override (e.g. Technology Hive children). */
  modelScaleOverride?: number;
  /** Optional float amplitude override (world units). */
  floatAmplitudeOverride?: number;
  /** Technology Hive — logo-only face, panel select without camera focus. */
  logoOnly?: boolean;
  /** Keep overview face even when this card is the camera focus target. */
  forceOverview?: boolean;
  /** Hide the content face (glass GLB remains). Used when hive children take over. */
  hideFace?: boolean;
  /** Technology Hive placeholders — show lock + disable interaction. */
  locked?: boolean;
  /** Optional rotation Z override (radians) for tuning. */
  rotationZOverride?: number;
  /** Optional yaw override (radians) — replaces default presentation yaw. */
  rotationYOverride?: number;
  /** When logoOnly is enabled: hide the logo/icon but keep the face background. */
  hideLogo?: boolean;
  /** Soften emissive for non-hovered siblings in the project carousel. */
  dimmed?: boolean;
  /**
   * HTML overlay locked to the glass face (e.g. contact link icons).
   * Transformed with the card so it stays inside the silhouette.
   */
  faceOverlay?: ReactNode;
}

function hoverDampLambda(): number {
  return 4 / Math.max(0.05, CARD_CONFIG.transitionDuration);
}

/**
 * Glass GLB (centered on placement) + content face fitted to measured bounds.
 * Overview shows icon + section label; focus reveals full copy.
 * Tech hive / project carousel use store selection without camera zoom.
 */
export function FloatingCard({
  id,
  variant,
  title,
  sectionLabel,
  subtitle,
  bodyLines,
  position,
  phase = 0,
  coverUrl,
  patternKey,
  accentOverride,
  modelKeyOverride,
  heroTuning,
  projectTuning,
  modelScaleOverride,
  floatAmplitudeOverride,
  logoOnly = false,
  forceOverview = false,
  hideFace = false,
  locked = false,
  rotationZOverride,
  rotationYOverride,
  hideLogo = false,
  dimmed = false,
  faceOverlay,
}: FloatingCardProps): JSX.Element {
  const hoveredObjectId = useExperienceStore((s) => s.hoveredObjectId);
  const focusObjectId = useExperienceStore((s) => s.focusObjectId);
  const selectedTechId = useTechHiveStore((s) => s.selectedTechId);
  const selectedProjectId = useProjectCarouselStore((s) => s.selectedProjectId);
  const selectedEventId = useElevatorStore((s) => s.selectedEventId);
  const selectedExperienceId = useExperiencePanelStore(
    (s) => s.selectedExperienceId,
  );
  const cardScaleMultiplier = useViewportStore((s) => s.cardScaleMultiplier);
  const hitScale = useViewportStore((s) => s.hitScale);
  const floatScale = useViewportStore((s) => s.floatScale);
  const edgeFogTuning = useCardEdgeFogTuningParams();
  const isHovered = hoveredObjectId === id;
  const isCameraFocused = focusObjectId === id;
  const isTechSelected =
    logoOnly &&
    isTechObjectId(id) &&
    techIdFromObjectId(id) === selectedTechId;
  const isProjectSelected =
    isProjectObjectId(id) &&
    projectIdFromObjectId(id) === selectedProjectId;
  const isExperienceSelected =
    isExperienceObjectId(id) &&
    experienceIdFromObjectId(id) === selectedExperienceId;
  const isTimelineSelected =
    isTimelineObjectId(id) &&
    timelineIdFromObjectId(id) === selectedEventId;
  const isHighlighted =
    isCameraFocused ||
    isTechSelected ||
    isProjectSelected ||
    isExperienceSelected ||
    isTimelineSelected;
  const showDetailFace = isCameraFocused && !logoOnly && !forceOverview;

  const visual = CARD_VARIANT_VISUALS[variant];
  // Category color tints the GLB frame only — face texture stays variant-neutral
  // so rim/glow is not duplicated on both layers.
  const modelColor = accentOverride ?? CARD_CONFIG.colors[variant];
  const faceAccent = CARD_CONFIG.colors[variant];
  const modelUrl = modelKeyOverride
    ? MODEL_ASSETS[modelUrlForModelKey(modelKeyOverride)]
    : visual.modelUrl;
  const defaultScale = modelScaleForVariant(variant, cardScaleMultiplier);
  const usesRectFaceTuning =
    (variant === "project" || variant === "experience") && projectTuning;
  const tunedModelScale =
    modelScaleOverride != null
      ? modelScaleOverride
      : variant === "hero"
        ? heroTuning?.modelScale
        : usesRectFaceTuning
          ? projectTuning?.modelScale
          : null;
  const modelScale =
    tunedModelScale != null
      ? tunedModelScale * cardScaleMultiplier
      : defaultScale;
  const hitBox = modelKeyOverride
    ? hitBoxForModel(modelKeyOverride)
    : CARD_CONFIG.hitBox[variant];
  const centerOffset = modelKeyOverride
    ? modelCenterOffsetForModel(modelKeyOverride)
    : modelCenterOffset(variant);

  const targetInteractiveScale = isHighlighted
    ? CARD_CONFIG.focusScale
    : isHovered
      ? CARD_CONFIG.hoverScale
      : 1;

  const resolvedModelKey: CardModelKey =
    modelKeyOverride ?? VARIANT_MODEL_KEY[variant];
  const faceShape = faceShapeForModel(resolvedModelKey);
  const supportsEdgeFog =
    faceShape === "hexagon" || faceShape === "roundedRect";
  // Soft vapor aura on hover and on focus / panel selection (all card faces).
  const edgeFogTarget =
    supportsEdgeFog && (isHovered || isHighlighted) ? 1 : 0;
  const frameEmissiveBoostTarget =
    edgeFogTarget > 0
      ? resolvedModelKey === "skillBadge"
        ? edgeFogTuning.skillBadgeFrameBoost
        : edgeFogTuning.frameEmissiveBoost
      : 0;

  const baseEmissive = isHighlighted
    ? CARD_CONFIG.emissive.focus
    : isHovered
      ? CARD_CONFIG.emissive.hover
      : CARD_CONFIG.emissive.idle;
  const targetEmissiveIntensity =
    (dimmed && !isHovered && !isHighlighted
      ? baseEmissive * 0.55
      : baseEmissive) + frameEmissiveBoostTarget;

  const interactiveScaleRef = useRef<Group>(null);
  const scaleCurrent = useRef(1);

  useFrame((_, delta) => {
    const group = interactiveScaleRef.current;
    if (!group) return;
    scaleCurrent.current = MathUtils.damp(
      scaleCurrent.current,
      targetInteractiveScale,
      hoverDampLambda(),
      delta,
    );
    group.scale.setScalar(scaleCurrent.current);
  });

  const ariaLabel = useMemo(
    () => (subtitle ? `${title}, ${subtitle}` : title),
    [title, subtitle],
  );

  const scaledHit: [number, number, number] = [
    hitBox[0] * modelScale * hitScale,
    hitBox[1] * modelScale * hitScale,
    hitBox[2] * modelScale,
  ];

  // glass_card_base has a baked front-plane tilt. The face keeps the local
  // +28° fit, while this parent correction presents the complete card
  // straight toward the navigation camera.
  const presentationYaw =
    rotationYOverride != null
      ? rotationYOverride
      : usesRectFaceTuning
        ? -projectFaceRotationRadians(projectTuning)
        : CARD_LAYOUT.cardRotation[1];

  const resolvedRotationZ =
    rotationZOverride ?? CARD_LAYOUT.cardRotation[2];

  const floatAmplitudeTarget =
    isHighlighted || showDetailFace || (isHovered && !logoOnly)
      ? 0
      : (floatAmplitudeOverride ?? CARD_CONFIG.floatAmplitude) * floatScale;

  return (
    <group
      position={position}
      rotation={[
        CARD_LAYOUT.cardRotation[0],
        presentationYaw,
        resolvedRotationZ,
      ]}
    >
      <Float
        phase={phase}
        amplitude={floatAmplitudeTarget}
        speed={CARD_CONFIG.floatSpeed}
        rotationSpeed={CARD_CONFIG.rotationSpeed}
      >
        <group ref={interactiveScaleRef}>
          <group scale={modelScale}>
            <Suspense fallback={null}>
              <group position={centerOffset}>
                <GlbProp
                  url={modelUrl}
                  color={modelColor}
                  preset={visual.preset}
                  mapKey={visual.mapKey}
                  scale={1}
                  emissiveIntensity={targetEmissiveIntensity}
                  skipRaycast
                />
                {supportsEdgeFog ? (
                  <CardEdgeFog
                    color={modelColor}
                    modelKey={resolvedModelKey}
                    intensity={edgeFogTarget}
                  />
                ) : null}
                {!hideFace ? (
                  <CardFace
                    variant={variant}
                    title={title}
                    sectionLabel={
                      sectionLabel ?? CARD_CONFIG.sectionLabel[variant]
                    }
                    subtitle={subtitle}
                    bodyLines={bodyLines}
                    focused={showDetailFace}
                    logoOnly={logoOnly}
                    hideLogo={hideLogo}
                    locked={locked}
                    accent={faceAccent}
                    coverUrl={coverUrl}
                    patternKey={patternKey}
                    modelKeyOverride={modelKeyOverride}
                    heroTuning={variant === "hero" ? heroTuning : undefined}
                    projectTuning={
                      variant === "project" || variant === "experience"
                        ? projectTuning
                        : undefined
                    }
                    inModelSpace
                  />
                ) : null}
                {faceOverlay ? (
                  <ContactFaceOverlayHost
                    modelKey={resolvedModelKey}
                    overlay={faceOverlay}
                  />
                ) : null}
              </group>
            </Suspense>
          </group>
          <mesh
            name={id}
            userData={{ contentTitle: ariaLabel }}
            onPointerOver={(event) => {
              event.stopPropagation();
              if (locked) return;
              InteractionManager.onHover(id);
              CursorManager.set("pointer");
            }}
            onPointerOut={(event) => {
              event.stopPropagation();
              if (locked) return;
              InteractionManager.onUnhover(id);
              CursorManager.reset();
            }}
            onClick={(event) => {
              event.stopPropagation();
              if (locked) return;
              InteractionManager.onSelect(id);
            }}
          >
            <boxGeometry args={scaledHit} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}
