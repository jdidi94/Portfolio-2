export const MATERIAL_PRESETS = {
  frostedCard: {
    metalness: 0.35,
    roughness: 0.32,
    opacity: 0.22,
    emissiveIntensity: 0.85,
    wireframe: false,
  },
  neonGlass: {
    metalness: 0.7,
    roughness: 0.3,
    opacity: 0.32,
    emissiveIntensity: 1.05,
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
  metalAccent: {
    metalness: 0.95,
    roughness: 0.35,
    opacity: 0.95,
    emissiveIntensity: 0.85,
    wireframe: false,
  },
} as const;

export type MaterialPresetKey = keyof typeof MATERIAL_PRESETS;
