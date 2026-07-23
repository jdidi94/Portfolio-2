export const MATERIAL_PRESETS = {
  neonGlass: {
    metalness: 0.85,
    roughness: 0.22,
    opacity: 0.62,
    emissiveIntensity: 1.35,
    wireframe: false,
  },
  neonWire: {
    metalness: 0.1,
    roughness: 0.4,
    opacity: 0.28,
    emissiveIntensity: 0.6,
    wireframe: true,
  },
  neonSolid: {
    metalness: 0.75,
    roughness: 0.28,
    opacity: 0.9,
    emissiveIntensity: 1.6,
    wireframe: false,
  },
  frostedCard: {
    metalness: 0.55,
    roughness: 0.18,
    opacity: 0.55,
    emissiveIntensity: 1.1,
    wireframe: false,
  },
  metalAccent: {
    metalness: 0.95,
    roughness: 0.35,
    opacity: 0.95,
    emissiveIntensity: 0.85,
    wireframe: false,
  },
} as const;

export type MaterialPresetKey = keyof typeof MATERIAL_PRESETS;
