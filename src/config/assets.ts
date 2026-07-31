import floatingRingUrl from "@assets/models/props/model_floating_ring.glb?url";
import floatingSphereUrl from "@assets/models/props/model_floating_sphere.glb?url";
import neonPillarUrl from "@assets/models/props/model_neon_pillar.glb?url";
import wireframeObjectUrl from "@assets/models/props/model_wireframe_object.glb?url";
import hologramPlatformUrl from "@assets/models/environment/model_hologram_platform.glb?url";
import glassCardBaseUrl from "@assets/models/cards/glass_card_base.glb?url";
import glassCardRoundedUrl from "@assets/models/cards/glass_card_rounded.glb?url";
import skillBadgeUrl from "@assets/models/cards/skill_badge.glb?url";
import contactPortalUrl from "@assets/models/cards/contact_portal.glb?url";
import travelerUrl from "@assets/models/player/traveler_rigged_01.glb?url";

import noiseSoftUrl from "@assets/textures/noise/texture_noise_soft.webp";
import glowSoftUrl from "@assets/textures/particles/texture_glow_soft.webp";
import particleGlowUrl from "@assets/textures/particles/texture_particle_glow.webp";
import particleCircleUrl from "@assets/textures/particles/texture_particle_circle.webp";
import particleStarUrl from "@assets/textures/particles/texture_particle_star.webp";
import particleSparkUrl from "@assets/textures/particles/texture_particle_spark.webp";
import particleFlareUrl from "@assets/textures/particles/texture_particle_flare.webp";
import gradientRadialUrl from "@assets/textures/gradients/texture_gradient_radial.webp";
import gridSubtleUrl from "@assets/textures/gradients/texture_grid_subtle.webp";
import glassCrystalUrl from "@assets/textures/glass/texture_glass_crystal.webp";
import glassNormalUrl from "@assets/textures/glass/texture_glass_normal.webp";
import glassImperfectionsUrl from "@assets/textures/glass/texture_glass_imperfections.webp";
import metalBrushedUrl from "@assets/textures/metal/texture_metal_brushed.webp";
import neonEmissionUrl from "@assets/textures/metal/texture_neon_emission.webp";
import hexPatternUrl from "@assets/textures/noise/texture_hex_pattern.webp";
import energyPatternUrl from "@assets/textures/noise/texture_energy_pattern.png";

import heroCoverUrl from "@assets/images/hero/hero_cover.webp";
import portraitUrl from "@assets/images/brand/portrait_placeholder.webp";
import aboutWorkingUrl from "@assets/images/about/about_working.webp";
import aboutCodingUrl from "@assets/images/about/about_coding.webp";

import neonPortfolioCoverUrl from "@assets/images/projects/neon-portfolio/project_neon_portfolio_cover.webp";
import neonPortfolioArchitectureUrl from "@assets/images/projects/neon-portfolio/project_neon_portfolio_architecture.webp";
import tunisianFannCoverUrl from "@assets/images/projects/tunisian-fann/project_tunisian_fann_cover.webp";
import tunisianFannGalleryUrl from "@assets/images/projects/tunisian-fann/project_tunisian_fann_gallery.webp";
import ticketingCoverUrl from "@assets/images/projects/ticketing-platform/project_ticketing_platform_cover.webp";
import ticketingArchitectureUrl from "@assets/images/projects/ticketing-platform/project_ticketing_platform_architecture.webp";
import medPurchaseCoverUrl from "@assets/images/projects/med-purchase/project_med_purchase_cover.webp";

import neonPortfolioVideoUrl from "@assets/videos/projects/neon-portfolio/project_neon_portfolio_preview.mp4?url";
import tunisianFannVideoUrl from "@assets/videos/projects/tunisian-fann/project_tunisian_fann_preview.mp4?url";
import ticketingVideoUrl from "@assets/videos/projects/ticketing-platform/project_ticketing_platform_preview.mp4?url";

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
  traveler: travelerUrl,
} as const;

export const IMAGE_ASSETS = {
  heroCover: heroCoverUrl,
  portrait: portraitUrl,
  aboutWorking: aboutWorkingUrl,
  aboutCoding: aboutCodingUrl,
  neonPortfolioCover: neonPortfolioCoverUrl,
  neonPortfolioArchitecture: neonPortfolioArchitectureUrl,
  tunisianFannCover: tunisianFannCoverUrl,
  tunisianFannGallery: tunisianFannGalleryUrl,
  ticketingCover: ticketingCoverUrl,
  ticketingArchitecture: ticketingArchitectureUrl,
  medPurchaseCover: medPurchaseCoverUrl,
} as const;

export const VIDEO_ASSETS = {
  neonPortfolioPreview: neonPortfolioVideoUrl,
  tunisianFannPreview: tunisianFannVideoUrl,
  ticketingPreview: ticketingVideoUrl,
} as const;

export const TEXTURE_ASSETS = {
  noiseSoft: noiseSoftUrl,
  glowSoft: glowSoftUrl,
  particleGlow: particleGlowUrl,
  particleCircle: particleCircleUrl,
  particleStar: particleStarUrl,
  particleSpark: particleSparkUrl,
  particleFlare: particleFlareUrl,
  gradientRadial: gradientRadialUrl,
  gridSubtle: gridSubtleUrl,
  glassCrystal: glassCrystalUrl,
  glassNormal: glassNormalUrl,
  glassImperfections: glassImperfectionsUrl,
  metalBrushed: metalBrushedUrl,
  neonEmission: neonEmissionUrl,
  hexPattern: hexPatternUrl,
  energyPattern: energyPatternUrl,
} as const;

export type ModelAssetKey = keyof typeof MODEL_ASSETS;
export type ImageAssetKey = keyof typeof IMAGE_ASSETS;
export type VideoAssetKey = keyof typeof VIDEO_ASSETS;
export type TextureAssetKey = keyof typeof TEXTURE_ASSETS;
