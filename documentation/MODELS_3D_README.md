# Neon Portfolio — 3D Models (Role & Placement)

Quick guide: **which GLB does what**, **where it belongs in the scene**, and **how to stay on-design**.

Source of truth for inventory / size / phase: [ASSETS_README.md](./ASSETS_README.md)  
Source of truth for prompts / look / export rules: [ASSET_REQUIREMENTS.md](./ASSET_REQUIREMENTS.md)

---

## Design rules (from instruction docs)

| Rule | Detail |
|------|--------|
| Look | Infinite black void · minimal product design · **not** a game · **not** cyberpunk clutter |
| Accents | Thin neon only — cyan `#22D3EE`, electric blue `#3B82F6`, purple `#8B5CF6` |
| Materials | Export GLB as **shape only** (gray / simple). Neon, glass, emissive, bloom come from `src/config/` in R3F |
| Format | **GLB** + Draco · centered · ~1 unit · apply transforms · prefer **&lt;15k** triangles |
| Budget | Soft ≤150 KB · hard ≤400 KB per card/prop ([ASSETS_README.md](./ASSETS_README.md)) |
| Prefer | Procedural geometry when cheaper than shipping a GLB |
| Wire | Register in `src/config/assets.ts` → use via config (`cards.ts`, `environment.ts`). Do not hardcode URLs in mesh components |

Shared prompt style to append when generating:

```text
Style: minimal premium product design, infinite black void background,
soft cyan and purple neon accents, frosted glass, thin edges, calm, elegant,
not a video game, not busy cyberpunk, not cluttered, high-end interactive
portfolio aesthetic, clean silhouette, web-ready
```

Avoid: busy / cluttered / cartoon / rainbow neon / UI chrome / text / watermarks.

---

## Folder roles

```text
src/assets/models/
├── cards/         # Content carriers — empty face for Canvas textures
├── props/         # Decorative accents in the void (atmosphere only)
├── environment/   # Larger scene anchors (platforms, light bars)
└── player/        # Rigged character for About storytelling
```

| Folder | Job | Never use for |
|--------|-----|---------------|
| `cards/` | Hold portfolio content (hero, projects, skills, …) | Random décor spam |
| `props/` | Depth / motion / neon accents behind content | Primary readable content |
| `environment/` | Ground / pedestal / spatial landmarks | Card faces |
| `player/` | About Me traveler (skinned + animations) | Décor spam / neon recolor via GlbProp |

---

## Card models — content roles

Cards are **frames with an empty opening**. Face content is drawn in code (`FloatingCard` + face textures), not baked into the GLB.

| File | Role | Face shape | Content variants (current) | Config |
|------|------|------------|----------------------------|--------|
| `glass_card_base.glb` | Project / experience frame — rounded rect glass panel | `roundedRect` | `project`, `experience` | `VARIANT_MODEL_KEY` → `glassCardBase` |
| `glass_card_rounded.glb` | Hero / certificate / contact — hexagonal holographic card | `hexagon` | `hero`, `contact`, `certificate` | `VARIANT_MODEL_KEY` → `glassCardRounded` |
| `skill_badge.glb` | Compact skill / timeline token — hex badge | `hexagon` | `timeline` (skills corridor replaced by Technology Hive) | `VARIANT_MODEL_KEY` → `skillBadge` |
| `contact_portal.glb` | Vertical elliptical portal (contact landmark) | `ellipse` | Décor only (`portal` near contact stop) — content contact uses `glass_card_rounded` | `MODEL_ASSETS.contactPortal` |
| `timeline_node.glb` | Timeline marker (planned) | — | ☐ Not shipped | Phase 3 inventory |
| `ui_selection_ring.glb` | Focus / selection accent (planned, or procedural) | — | ☐ Not shipped | Prefer procedural if possible |

**Where used in code**

- Content cards: `src/components/cards/FloatingCard.tsx` via `CARD_VARIANT_VISUALS` (`src/config/cards.ts`)
- Bounds / face inset / scale: `src/config/cardGeometry.ts`
- Registry: `MODEL_ASSETS` in `src/config/assets.ts`

**Design checks before swapping a card GLB**

1. Empty center (no baked text, logos, or UI).
2. Front face faces **+Z** (camera side); origin at bottom or documented in `CARD_MODEL_BOUNDS`.
3. Re-measure bounds and update `CARD_MODEL_BOUNDS` if the mesh size changes.
4. Face silhouette still matches `FACE_SHAPE_BY_MODEL` (hex / roundedRect / ellipse).
5. Recolor only through material presets — do not rely on baked neon materials.

---

## Prop models — décor roles

Atmosphere only. Placement lives in `ENVIRONMENT_CONFIG.decor` (`src/config/environment.ts`). Rendered by `DecorativeObjects` → `GlbProp`.

| File | Role | Decor `kind` | Where to place |
|------|------|--------------|----------------|
| `model_floating_ring.glb` | Thin torus — calm orbital accent | `ring` | Mid/far void, flanking camera path |
| `model_floating_sphere.glb` | Faceted sphere / crystal — small spark | `sphere` | Sparse accents; keep scale modest |
| `model_wireframe_object.glb` | Open lattice / frame — tech silhouette | `wire` | Background depth, never in front of readable cards |
| `model_neon_pillar.glb` | Tall thin light bar — vertical neon | `pillar` | Scene edges; marks depth / section energy |
| `model_energy_crystal.glb` | Optional polish crystal | — | ☐ Not shipped (Phase 5 optional) |

**Design checks**

- Sparse: few instances, large negative space (PRODUCT_VISION).
- Colors from `COLORS` / decor config, not mesh paint.
- Must not compete with focused card readability.

---

## Environment models — scene anchors

| File | Role | Decor `kind` | Where to place |
|------|------|--------------|----------------|
| `model_hologram_platform.glb` | Flat disc pedestal with rim | `platform` | Under or near hero / landmark props |
| `model_light_bar.glb` | Optional thin light bar | — | ☐ Not shipped — or emissive mesh in code |

---

## Player models — About character

| File | Role | Config | Notes |
|------|------|--------|-------|
| `traveler_rigged_01.glb` | About Me traveler (skinned) | `MODEL_ASSETS.traveler` → `AboutCharacter` / `TravelerCharacter` | Preserve materials; use `useAnimations`. Idle clip mapped in `aboutCharacter.ts` |

**Design checks**

- Do **not** load through `GlbProp` (neon recolor destroys character look).
- Respect `prefersReducedMotion` (freeze idle on first frame).
- Prefer one overview waypoint (`about`) plus optional story-beat cards.

---

## Wiring map (code)

```text
src/assets/models/**/*.glb
        │
        ▼
src/config/assets.ts          → MODEL_ASSETS
        │
        ├──► src/config/cards.ts + cardGeometry.ts
        │         → FloatingCard (content)
        │
        ├──► src/config/environment.ts  → DECOR_MODEL_URL
        │         → DecorativeObjects (atmosphere)
        │
        └──► src/config/aboutCharacter.ts
                  → AboutCharacter / TravelerCharacter (About Me)
```

| Need | Touch these files |
|------|-------------------|
| Add / replace a GLB file | Drop file under correct folder → import in `assets.ts` |
| Change which card uses which mesh | `VARIANT_MODEL_KEY` in `cardGeometry.ts` (+ bounds if needed) |
| Move décor in the void | `ENVIRONMENT_CONFIG.decor` in `environment.ts` |
| About traveler pose / clips / beats | `aboutCharacter.ts` + `AboutCharacter.tsx` |
| Materials / glow | `src/config/materials.ts`, `CARD_VARIANT_VISUALS` presets |

---

## Current inventory status

| Status | File | Path | Approx. size | Wired |
|--------|------|------|--------------|-------|
| ✅ | `glass_card_base.glb` | `models/cards/` | ~204 KB | Content + décor `card` |
| ✅ | `glass_card_rounded.glb` | `models/cards/` | ~240 KB | Content + décor `cardRounded` |
| ✅ | `skill_badge.glb` | `models/cards/` | ~240 KB | Content + décor `badge` |
| ✅ | `contact_portal.glb` | `models/cards/` | ~172 KB | Décor `portal-contact` at contact depth |
| ✅ | `model_floating_ring.glb` | `models/props/` | ~356 KB | Décor `ring` |
| ✅ | `model_floating_sphere.glb` | `models/props/` | ~228 KB | Décor `sphere` |
| ✅ | `model_wireframe_object.glb` | `models/props/` | ~212 KB | Décor `wire` |
| ✅ | `model_neon_pillar.glb` | `models/props/` | ~204 KB | Décor `pillar` |
| ✅ | `model_hologram_platform.glb` | `models/environment/` | ~224 KB | Décor `platform` |
| ✅ | `traveler_rigged_01.glb` | `models/player/` | ~1.2 MB | About character |
| ☐ | `timeline_node.glb` | `models/cards/` | — | — |
| ☐ | `ui_selection_ring.glb` | `models/cards/` | — | Or procedural |
| ☐ | `model_energy_crystal.glb` | `models/props/` | — | Phase 5 optional |
| ☐ | `model_light_bar.glb` | `models/environment/` | — | Or code mesh |

Update checkboxes in [ASSETS_README.md](./ASSETS_README.md) when status changes.

---

## Production checklist (per new / revised GLB)

- [ ] Filename matches inventory (`lowercase_snake_case.glb`)
- [ ] Correct folder (`cards` / `props` / `environment`)
- [ ] Role matches this doc (content frame vs décor vs anchor)
- [ ] Shape-only materials; neon driven in config
- [ ] Draco-compressed; under hard size budget
- [ ] Centered, transforms applied, web-friendly polycount
- [ ] Registered in `MODEL_ASSETS`
- [ ] Card meshes: bounds + face shape updated in `cardGeometry.ts`
- [ ] Décor: entry in `ENVIRONMENT_CONFIG.decor` (or intentionally unused)
- [ ] Still reads as premium void product — not game clutter

AI prompts per model: [ASSET_REQUIREMENTS.md — 3D AI prompts](./ASSET_REQUIREMENTS.md#3d-ai-prompts-props--cards).
