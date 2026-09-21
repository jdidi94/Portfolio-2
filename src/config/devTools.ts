/**
 * Dev / tuning UI toggles. Panels stay in the codebase for future face-fit work —
 * flip these to true and remount them in App when needed.
 */
export const DEV_TOOLS_CONFIG = {
  /** Hero card face-fit panel (first section). */
  heroFaceTuningPanel: false,
  /** Project card face-fit + model rotation. */
  projectFaceTuningPanel: false,
  /** Hex hover soft-glow / shadow blur panel. */
  cardEdgeFogTuningPanel: false,
  /** Shared card-face typography (all sections). */
  cardFaceTypeTuningPanel: false,
  /** Technology Hive parent/child spacing + camera knobs (desktop). */
  techHiveLayoutTuningPanel: false,
  /** Contact card face-link Html placement. */
  contactFaceLinksTuningPanel: false,
} as const;
