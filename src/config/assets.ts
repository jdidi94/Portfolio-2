import floatingRingUrl from "@assets/models/props/model_floating_ring.glb?url";
import floatingSphereUrl from "@assets/models/props/model_floating_sphere.glb?url";
import neonPillarUrl from "@assets/models/props/model_neon_pillar.glb?url";
import wireframeObjectUrl from "@assets/models/props/model_wireframe_object.glb?url";
import hologramPlatformUrl from "@assets/models/environment/model_hologram_platform.glb?url";
import glassCardBaseUrl from "@assets/models/cards/glass_card_base.glb?url";
import glassCardRoundedUrl from "@assets/models/cards/glass_card_rounded.glb?url";
import skillBadgeUrl from "@assets/models/cards/skill_badge.glb?url";
import contactPortalUrl from "@assets/models/cards/contact_portal.glb?url";

import noiseSoftUrl from "@assets/textures/noise/texture_noise_soft.webp";
import glowSoftUrl from "@assets/textures/particles/texture_glow_soft.webp";
import gradientRadialUrl from "@assets/textures/gradients/texture_gradient_radial.webp";
import gridSubtleUrl from "@assets/textures/gradients/texture_grid_subtle.webp";
import glassCrystalUrl from "@assets/textures/glass/texture_glass_crystal.webp";
import metalBrushedUrl from "@assets/textures/metal/texture_metal_brushed.webp";

export const MODEL_ASSETS = {
  floatingRing: floatingRingUrl,
  floatingSphere: floatingSphereUrl,
  neonPillar: neonPillarUrl,
  wireframeObject: wireframeObjectUrl,
  hologramPlatform: hologramPlatformUrl,
  glassCardBase: glassCardBaseUrl,
  glassCardRounded: glassCardRoundedUrl,
  skillBadge: skillBadgeUrl,
  contactPortal: contactPortalUrl,
} as const;

export const TEXTURE_ASSETS = {
  noiseSoft: noiseSoftUrl,
  glowSoft: glowSoftUrl,
  gradientRadial: gradientRadialUrl,
  gridSubtle: gridSubtleUrl,
  glassCrystal: glassCrystalUrl,
  metalBrushed: metalBrushedUrl,
} as const;

export type ModelAssetKey = keyof typeof MODEL_ASSETS;
export type TextureAssetKey = keyof typeof TEXTURE_ASSETS;
