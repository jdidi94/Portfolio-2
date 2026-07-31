import type { Vector3Tuple } from "three";
import { COLORS } from "@config/colors";
import { sectionPosition } from "@config/corridor";
import { IMAGE_ASSETS } from "@config/assets";
import { ABOUT_WAYPOINT_ID, aboutBeatObjectId } from "@utils/aboutIds";

/**
 * About Me — traveler character + story-beat cards.
 * Clip names match the exported `traveler_rigged_01.glb` NLA tracks.
 */
export type AboutBeatId =
  | "summary"
  | "philosophy"
  | "education"
  | "goals";

export interface AboutBeatConfig {
  id: AboutBeatId;
  label: string;
  /** Local offset from about origin (character stands at 0,0,0). */
  position: Vector3Tuple;
  /** Optional still for the beat card face. */
  coverKey?: keyof typeof IMAGE_ASSETS;
}

export const ABOUT_CHARACTER_CONFIG = {
  origin: sectionPosition("about") as Vector3Tuple,
  cameraDistance: 7.4,
  cameraEyeHeight: 1.05,
  character: {
    /** Uniform scale — traveler is roughly ~1 unit tall in Blender space. */
    scale: 1.15,
    position: [0, 0, 0] as Vector3Tuple,
    /** Face +Z (camera stand-off along the corridor). */
    rotation: [0, 0, 0] as Vector3Tuple,
    hitBox: [0.7, 1.85, 0.55] as Vector3Tuple,
    hitOffsetY: 0.95,
    /**
     * Clips from `traveler_rigged_01.glb` (Blender NLA names).
     * Only greeting + clubbing + dancing are used.
     * First About visit plays greet once; then random clubbing / dancing.
     */
    greetClip: "NlaTrack.002",
    clubbingClip: "NlaTrack.001",
    dancingClip: "NlaTrack.013",
    /** Random pool after the greeting. */
    clips: ["NlaTrack.001", "NlaTrack.013"] as const,
    crossFadeSeconds: 0.4,
  },
  platform: {
    color: COLORS.cyan,
    scale: [1.35, 0.55, 1.35] as Vector3Tuple,
    ringInner: 0.95,
    ringOuter: 1.55,
  },
  beatCard: {
    modelScale: 1.55,
    floatAmplitude: 0.02,
    cameraDistance: 4.8,
    cameraEyeHeight: 0.25,
  },
  /** Small viewport — vertical Y stack, no traveler. */
  small: {
    cameraDistance: 6.2,
    cameraEyeHeight: 1.15,
    /** Matches aboutCharacterWaypoint lookAt Y offset. */
    lookAtY: 0.85,
  },
  beats: [
    {
      id: "summary",
      label: "Summary",
      position: [-2.85, 1.15, 0.35],
      coverKey: "aboutWorking",
    },
    {
      id: "philosophy",
      label: "Philosophy",
      position: [2.85, 1.15, 0.35],
    },
    {
      id: "education",
      label: "Education",
      position: [-2.35, 0.15, 0.55],
      coverKey: "aboutCoding",
    },
    {
      id: "goals",
      label: "Goals",
      position: [2.35, 0.15, 0.55],
    },
  ] as const satisfies readonly AboutBeatConfig[],
} as const;

export type AboutCharacterConfig = typeof ABOUT_CHARACTER_CONFIG;

export function aboutCharacterWaypoint(): {
  id: string;
  label: string;
  position: Vector3Tuple;
  cameraPosition: Vector3Tuple;
  lookAt: Vector3Tuple;
} {
  const [x, y, z] = ABOUT_CHARACTER_CONFIG.origin;
  const distance = ABOUT_CHARACTER_CONFIG.cameraDistance;
  const eye = ABOUT_CHARACTER_CONFIG.cameraEyeHeight;
  return {
    id: ABOUT_WAYPOINT_ID,
    label: "About",
    position: ABOUT_CHARACTER_CONFIG.origin,
    cameraPosition: [x, y + eye, z + distance],
    lookAt: [x, y + 0.85, z],
  };
}

/** Overview framing for the small vertical beat stack. */
export function aboutCharacterSmallWaypoint(): {
  id: string;
  label: string;
  position: Vector3Tuple;
  cameraPosition: Vector3Tuple;
  lookAt: Vector3Tuple;
} {
  const [x, y, z] = ABOUT_CHARACTER_CONFIG.origin;
  const { cameraDistance, cameraEyeHeight, lookAtY } =
    ABOUT_CHARACTER_CONFIG.small;
  return {
    id: ABOUT_WAYPOINT_ID,
    label: "About",
    position: ABOUT_CHARACTER_CONFIG.origin,
    cameraPosition: [x, y + cameraEyeHeight, z + cameraDistance],
    lookAt: [x, y + lookAtY, z],
  };
}

export function aboutBeatWorldPosition(
  beat: AboutBeatConfig,
): Vector3Tuple {
  const [ox, oy, oz] = ABOUT_CHARACTER_CONFIG.origin;
  const [bx, by, bz] = beat.position;
  return [ox + bx, oy + by, oz + bz];
}

export function aboutBeatWaypoint(beat: AboutBeatConfig): {
  id: string;
  label: string;
  position: Vector3Tuple;
  cameraPosition: Vector3Tuple;
  lookAt: Vector3Tuple;
  navigable: false;
} {
  const position = aboutBeatWorldPosition(beat);
  const [x, y, z] = position;
  const { cameraDistance, cameraEyeHeight } = ABOUT_CHARACTER_CONFIG.beatCard;
  return {
    id: aboutBeatObjectId(beat.id),
    label: beat.label,
    position,
    cameraPosition: [x, y + cameraEyeHeight, z + cameraDistance],
    lookAt: position,
    navigable: false,
  };
}
