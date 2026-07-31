# Neon Portfolio — Assets by Phase

Production inventory for every file asset the experience needs.

Companion to [ASSET_REQUIREMENTS.md](./ASSET_REQUIREMENTS.md) (category checklist).  
This document answers: **which phase**, **filename**, **type**, **dimensions / duration**, **size budget**, and **where it lives**.

Status legend: `☐` Not started · `🟡` In progress · `✅` Done · `🔄` Needs revision · `—` Procedural / no file

---

## Conventions

| Rule | Detail |
|------|--------|
| Naming | `lowercase_snake_case.ext` — no spaces |
| Images | Prefer **AVIF**, fallback **WebP**; PNG only when transparency must stay lossless |
| Textures | Power-of-two (`256` / `512` / `1024`); compressed; mipmaps when sampled in 3D |
| Models | **GLB** + Draco; reuse geometries/materials in code |
| Audio | Ambient **MP3**; short SFX **OGG** (or WAV while authoring) |
| Video | **MP4** (H.264) + optional **WebM** |
| Fonts | **WOFF2** only; subset glyphs when possible |
| Path root | `src/assets/` (see folder map below) |

### Global size budgets (shipped)

| Category | Soft max (each) | Hard max (each) |
|----------|-----------------|-----------------|
| UI / icon SVG | — | 20 KB |
| Icon raster | 10 KB | 30 KB |
| Hero / portrait | 200 KB | 400 KB |
| Project cover (1920×1080) | 150 KB | 300 KB |
| Project screenshot | 120 KB | 250 KB |
| Texture (512²) | 80 KB | 150 KB |
| Texture (1024²) | 150 KB | 300 KB |
| HDRI | 500 KB | 1.5 MB |
| GLB card / prop | 150 KB | 400 KB |
| Ambient loop | 800 KB | 2 MB |
| Interaction SFX | 20 KB | 80 KB |
| Video preview (≤15s) | 2 MB | 5 MB |
| Demo video (≤60s) | 8 MB | 15 MB |
| Font face (WOFF2) | 30 KB | 80 KB |
| Resume PDF | 200 KB | 500 KB |
| Favicon / OG image | 50 KB | 200 KB (OG) |

Keep the **initial load** (Phase 2 critical path) under ~3 MB compressed when possible. Stream project media on focus.

---

## Folder map

```text
src/assets/
├── audio/
│   ├── ambient/
│   ├── ui/
│   └── camera/
├── fonts/
├── icons/
│   ├── ui/
│   ├── social/
│   └── tech/
├── images/
│   ├── brand/
│   ├── hero/
│   ├── about/
│   ├── projects/
│   └── social/
├── models/
│   ├── cards/
│   ├── props/
│   └── environment/
├── textures/
│   ├── glass/
│   ├── metal/
│   ├── noise/
│   ├── gradients/
│   └── particles/
├── videos/
│   └── projects/
├── documents/
│   └── resume/
└── seo/
```

---

## Phase 1 — Foundation

**Goal:** App shell + black void. Almost no media.

| Status | Name | Filename | Type | Size / specs | Path | Notes |
|--------|------|----------|------|--------------|------|-------|
| ☐ | Favicon (dev) | `favicon.svg` | SVG | ≤5 KB | `seo/` | Enough for local/dev; full SEO set in Phase 6 |
| ☐ | Primary font | `space_grotesk-{regular,medium,semibold,bold}.woff2` | WOFF2 | ≤50 KB / face | `fonts/` | Or load via approved font pipeline; 4 weights |
| ☐ | Secondary font | `sora-{regular,medium,semibold,bold}.woff2` | WOFF2 | ≤50 KB / face | `fonts/` | Overlay / UI |
| ☐ | Code font | `jetbrains_mono-{regular,medium}.woff2` | WOFF2 | ≤60 KB / face | `fonts/` | Optional until content UI |

**Not required in Phase 1:** models, textures, audio, project images, HDRI, videos.

Placeholder mesh (if any) is **procedural** in R3F — no asset file.

---

## Phase 2 — Experience Engine

**Goal:** Atmosphere, interaction, audio. Still **no** real portfolio content.

### Audio

| Status | Name | Filename | Type | Size / specs | Path | Notes |
|--------|------|----------|------|--------------|------|-------|
| ☐ | Ambient loop | `ambient_space_loop.mp3` | MP3 | 30–90 s seamless loop · ≤2 MB | `audio/ambient/` | Low volume; Howler |
| ☐ | Hover | `sfx_hover.ogg` | OGG | ≤0.3 s · ≤40 KB | `audio/ui/` | Soft |
| ☐ | Focus | `sfx_focus.ogg` | OGG | ≤0.5 s · ≤50 KB | `audio/ui/` | |
| ☐ | Transition | `sfx_transition.ogg` | OGG | ≤1 s · ≤80 KB | `audio/camera/` | Camera travel |

### Textures (environment / particles)

| Status | Name | Filename | Type | Size / specs | Path | Notes |
|--------|------|----------|------|--------------|------|-------|
| ✅ | Soft noise | `texture_noise_soft.webp` | WebP | 512×512 · ≤100 KB | `textures/noise/` | Particles / grain |
| ✅ | Glow sprite | `texture_glow_soft.webp` | WebP | 256×256 · ≤40 KB | `textures/particles/` | Additive particle |
| ✅ | Soft gradient | `texture_gradient_radial.webp` | WebP | 512×512 · ≤80 KB | `textures/gradients/` | Background depth |
| ✅ | Grid (optional) | `texture_grid_subtle.webp` | WebP | 1024×1024 · ≤150 KB | `textures/gradients/` | Very low contrast |

### Models / props (decorative only)

Prefer procedural geometry when possible. Ship GLB only if authoring is faster than code.

| Status | Name | Filename | Type | Size / specs | Path | Notes |
|--------|------|----------|------|--------------|------|-------|
| ✅ | Floating ring | `model_floating_ring.glb` | GLB | ≤200 KB · Draco | `models/props/` | Wired in décor |
| ✅ | Floating sphere | `model_floating_sphere.glb` | GLB | ≤150 KB · Draco | `models/props/` | Wired in décor |
| ✅ | Wireframe prop | `model_wireframe_object.glb` | GLB | ≤250 KB · Draco | `models/props/` | Wired in décor |

### HDRI (optional Phase 2, recommended Phase 5)

| Status | Name | Filename | Type | Size / specs | Path | Notes |
|--------|------|----------|------|--------------|------|-------|
| ☐ | Dark studio | `hdri_dark_studio.hdr` or `.exr` | HDR/EXR | ≤1.5 MB | `textures/` | Soft reflections only |

**Not required in Phase 2:** project media, logos, resume, tech icons, card content textures.

---

## Phase 3 — Content System

**Goal:** Reusable cards, overlays, data shapes. Use **placeholders**, not final portfolio media.

### Card / UI models

| Status | Name | Filename | Type | Size / specs | Path | Notes |
|--------|------|----------|------|--------------|------|-------|
| ✅ | Glass card base | `glass_card_base.glb` | GLB | ≤300 KB · Draco | `models/cards/` | Décor placeholder |
| ✅ | Rounded card | `glass_card_rounded.glb` | GLB | ≤300 KB | `models/cards/` | Décor placeholder |
| ☐ | Timeline node | `timeline_node.glb` | GLB | ≤150 KB | `models/cards/` | |
| ✅ | Skill badge | `skill_badge.glb` | GLB | ≤120 KB | `models/cards/` | Décor placeholder |
| ✅ | Contact portal | `contact_portal.glb` | GLB | ≤250 KB | `models/cards/` | Décor placeholder |
| ☐ | Selection ring | `ui_selection_ring.glb` | GLB | ≤80 KB | `models/cards/` | Or procedural |

### Card materials / textures

| Status | Name | Filename | Type | Size / specs | Path | Notes |
|--------|------|----------|------|--------------|------|-------|
| ☐ | Glass normal | `texture_glass_normal.webp` | WebP | 512×512 · ≤120 KB | `textures/glass/` | |
| ☐ | Glass imperfections | `texture_glass_imperfections.webp` | WebP | 512×512 · ≤100 KB | `textures/glass/` | |
| ☐ | Metal scratches | `texture_metal_scratches.webp` | WebP | 512×512 · ≤100 KB | `textures/metal/` | |
| ☐ | Neon emission mask | `texture_neon_emission.webp` | WebP | 512×512 · ≤80 KB | `textures/glass/` | Border / edge glow |
| ☐ | Hex pattern | `texture_hex_pattern.webp` | WebP | 512×512 · ≤80 KB | `textures/noise/` | Optional |

### Placeholder content images

| Status | Name | Filename | Type | Size / specs | Path | Notes |
|--------|------|----------|------|--------------|------|-------|
| ☐ | Placeholder cover | `placeholder_project_cover.webp` | WebP | 1920×1080 · ≤150 KB | `images/projects/` | Until Phase 4 |
| ☐ | Placeholder portrait | `placeholder_portrait.webp` | WebP | 1024×1024 · ≤150 KB | `images/hero/` | Transparent PNG only if needed |
| ☐ | Loading symbol | `loading_symbol.svg` | SVG | ≤10 KB | `images/brand/` | Overlay / loader |

### Icons (SVG preferred)

| Status | Name | Filename pattern | Type | Size / specs | Path | Notes |
|--------|------|------------------|------|--------------|------|-------|
| ☐ | UI set | `icon_{close,play,pause,arrow,external,download}.svg` | SVG | ≤8 KB each | `icons/ui/` | Overlay controls |
| ☐ | Social set | `icon_{github,linkedin,email,resume}.svg` | SVG | ≤8 KB each | `icons/social/` | Contact module |
| ☐ | Tech set (subset) | `tech_{react,typescript,threejs,...}.svg` | SVG | ≤10 KB each | `icons/tech/` | Start with stack you ship; expand in Phase 4 |

**Not required in Phase 3:** final project screenshots, demo videos, resume PDF, QR codes, OG images.

---

## Phase 4 — Content Integration

**Goal:** Wire **real** portfolio content into the Phase 3 systems.

> Phase doc: `phases/PHASE_04_CONTENT_INTEGRATION.md` (referenced in docs index).

### Brand

| Status | Name | Filename | Type | Size / specs | Path | Notes |
|--------|------|----------|------|--------------|------|-------|
| ☐ | Logo mark | `logo_neon.svg` | SVG | ≤15 KB | `images/brand/` | Primary |
| ☐ | Logo white | `logo_white.svg` | SVG | ≤15 KB | `images/brand/` | |
| ☐ | Logo black | `logo_black.svg` | SVG | ≤15 KB | `images/brand/` | Print / light surfaces |
| ☐ | Logo PNG | `logo_neon.png` | PNG | 512×512 · ≤80 KB | `images/brand/` | Fallback |

### Hero / about

| Status | Name | Filename | Type | Size / specs | Path | Notes |
|--------|------|----------|------|--------------|------|-------|
| ☐ | Portrait front | `hero_portrait_front.webp` | WebP/AVIF | 1200×1500 · ≤300 KB | `images/hero/` | Transparent if cutout |
| ☐ | Portrait side | `hero_portrait_side.webp` | WebP/AVIF | 1200×1500 · ≤300 KB | `images/hero/` | Optional |
| ☐ | Holographic avatar | `hero_portrait_hologram.webp` | WebP | 1024×1024 · ≤250 KB | `images/hero/` | Stylized |
| ☐ | About — working | `about_working.webp` | WebP | 1600×1000 · ≤250 KB | `images/about/` | |
| ☐ | About — coding | `about_coding.webp` | WebP | 1600×1000 · ≤250 KB | `images/about/` | |
| ☐ | About — teaching | `about_teaching.webp` | WebP | 1600×1000 · ≤250 KB | `images/about/` | Optional |
| ☐ | About — journey | `about_vietnam_journey.webp` | WebP | 1600×1000 · ≤250 KB | `images/about/` | Optional |

### Projects (repeat per project)

Replace `{slug}` with project id (e.g. `wygo`).

| Status | Name | Filename | Type | Size / specs | Path | Notes |
|--------|------|----------|------|--------------|------|-------|
| ☐ | Cover | `project_{slug}_cover.webp` | WebP/AVIF | 1920×1080 · ≤300 KB | `images/projects/{slug}/` | Card face |
| ☐ | Dashboard | `project_{slug}_dashboard.webp` | WebP/AVIF | 1920×1080 · ≤250 KB | `images/projects/{slug}/` | Overlay gallery |
| ☐ | Mobile | `project_{slug}_mobile.webp` | WebP/AVIF | 1080×1920 · ≤200 KB | `images/projects/{slug}/` | |
| ☐ | Architecture | `project_{slug}_architecture.webp` | WebP/AVIF | 1920×1080 · ≤250 KB | `images/projects/{slug}/` | Diagram |
| ☐ | Preview video | `project_{slug}_preview.mp4` | MP4 | ≤15 s · ≤5 MB | `videos/projects/{slug}/` | Autoplay muted |
| ☐ | Preview WebM | `project_{slug}_preview.webm` | WebM | ≤15 s · ≤5 MB | `videos/projects/{slug}/` | Optional |
| ☐ | Full demo | `project_{slug}_demo.mp4` | MP4 | ≤60 s · ≤15 MB | `videos/projects/{slug}/` | Lazy / on demand |

### Experience / timeline / certificates

| Status | Name | Filename | Type | Size / specs | Path | Notes |
|--------|------|----------|------|--------------|------|-------|
| ☐ | Company logos | `company_{slug}.svg` or `.webp` | SVG/WebP | ≤40 KB | `images/brand/` or `images/about/` | Prefer SVG |
| ☐ | Timeline media | `timeline_{year}_{slug}.webp` | WebP | 1280×720 · ≤200 KB | `images/about/` | Optional per event |
| ☐ | Certificates | `certificate_{slug}.webp` | WebP | 1600×1200 · ≤250 KB | `documents/` or `images/` | |

### Documents & contact

| Status | Name | Filename | Type | Size / specs | Path | Notes |
|--------|------|----------|------|--------------|------|-------|
| ☐ | Resume PDF | `resume.pdf` | PDF | ≤500 KB | `documents/resume/` | Primary download |
| ☐ | Resume print | `resume_print.pdf` | PDF | ≤500 KB | `documents/resume/` | Optional |
| ☐ | GitHub QR | `qr_github.svg` | SVG | ≤20 KB | `images/social/` | |
| ☐ | LinkedIn QR | `qr_linkedin.svg` | SVG | ≤20 KB | `images/social/` | |
| ☐ | Email QR | `qr_email.svg` | SVG | ≤20 KB | `images/social/` | Optional |

### Tech icons (full set)

Ship only technologies listed in `src/data/`. Suggested set:

`react`, `typescript`, `javascript`, `nodejs`, `express`, `mongodb`, `mysql`, `postgresql`, `firebase`, `docker`, `aws`, `git`, `github`, `threejs`, `r3f`, `gsap`, `tailwind`, `python`, `java`, `csharp`, `unity`, `blender`, `figma`

| Status | Name | Filename | Type | Size | Path |
|--------|------|----------|------|------|------|
| ☐ | Tech icon | `tech_{name}.svg` | SVG | ≤10 KB | `icons/tech/` |

---

## Phase 5 — Visual Polish

**Goal:** Replace placeholders with premium materials, motion, loading, cursor, audio depth.

### Materials / textures (upgrade)

| Status | Name | Filename | Type | Size / specs | Path | Notes |
|--------|------|----------|------|--------------|------|-------|
| ☐ | Frosted glass | `texture_glass_frosted.webp` | WebP | 1024×1024 · ≤200 KB | `textures/glass/` | |
| ✅ | Crystal / clear | `texture_glass_crystal.webp` | WebP | 1024×1024 · ≤200 KB | `textures/glass/` | |
| ✅ | Brushed metal | `texture_metal_brushed.webp` | WebP | 1024×1024 · ≤200 KB | `textures/metal/` | |
| ☐ | Chrome roughness | `texture_metal_chrome_roughness.webp` | WebP | 512×512 · ≤100 KB | `textures/metal/` | |
| ☐ | Carbon fiber | `texture_carbon_fiber.webp` | WebP | 512×512 · ≤120 KB | `textures/metal/` | Optional |
| ☐ | Energy pattern | `texture_energy_pattern.webp` | WebP | 512×512 · ≤100 KB | `textures/noise/` | |
| ☐ | Soft fog overlay | `texture_fog_soft.webp` | WebP | 1024×1024 · ≤150 KB | `textures/gradients/` | 2D assist only |

### Environment models (optional polish)

| Status | Name | Filename | Type | Size / specs | Path | Notes |
|--------|------|----------|------|--------------|------|-------|
| ✅ | Neon pillar | `model_neon_pillar.glb` | GLB | ≤250 KB | `models/props/` | Wired in décor |
| ✅ | Hologram platform | `model_hologram_platform.glb` | GLB | ≤300 KB | `models/environment/` | Wired in décor |
| ☐ | Energy crystal | `model_energy_crystal.glb` | GLB | ≤200 KB | `models/props/` | |
| ☐ | Light bar | `model_light_bar.glb` | GLB | ≤100 KB | `models/environment/` | Or emissive mesh in code |

### Audio polish

| Status | Name | Filename | Type | Size / specs | Path | Notes |
|--------|------|----------|------|--------------|------|-------|
| ☐ | Alt ambient | `ambient_digital_atmosphere.mp3` | MP3 | ≤2 MB | `audio/ambient/` | Swap / crossfade |
| ☐ | Open | `sfx_open.ogg` | OGG | ≤60 KB | `audio/ui/` | Overlay / card |
| ☐ | Close | `sfx_close.ogg` | OGG | ≤60 KB | `audio/ui/` | |
| ☐ | Success | `sfx_success.ogg` | OGG | ≤60 KB | `audio/ui/` | Contact / copy |
| ☐ | Arrival | `sfx_camera_arrival.ogg` | OGG | ≤80 KB | `audio/camera/` | |
| ☐ | Portal | `sfx_portal.ogg` | OGG | ≤80 KB | `audio/camera/` | Contact section |

### Loading & cursor

| Status | Name | Filename | Type | Size / specs | Path | Notes |
|--------|------|----------|------|--------------|------|-------|
| ☐ | Loader logo | `logo_loading.svg` | SVG | ≤15 KB | `images/brand/` | Animated via GSAP/FM |
| ☐ | Loader Lottie (opt.) | `loading_orbit.json` | Lottie JSON | ≤80 KB | `animations/lottie/` | Only if used |
| ☐ | Cursor default | `cursor_default.svg` | SVG | ≤5 KB | `icons/ui/` | Or CSS-only |
| ☐ | Cursor hover | `cursor_hover.svg` | SVG | ≤5 KB | `icons/ui/` | |
| ☐ | Cursor focus | `cursor_focus.svg` | SVG | ≤5 KB | `icons/ui/` | |
| ☐ | Cursor loading | `cursor_loading.svg` | SVG | ≤5 KB | `icons/ui/` | |

### HDRI (finalize)

| Status | Name | Filename | Type | Size / specs | Path | Notes |
|--------|------|----------|------|--------------|------|-------|
| ☐ | Minimal dark | `hdri_black_studio.hdr` | HDR | ≤1.5 MB | `textures/` | Final env map |

---

## Phase 6 — Performance & Accessibility

**Goal:** Compress, responsive variants, SEO/social, graceful fallbacks. No new creative assets unless missing.

### Responsive image variants

For each hero / project cover / about image, ship:

| Variant | Suffix | Typical size | Budget |
|---------|--------|--------------|--------|
| Full | (none) or `_1920` | 1920w | See Phase 4 |
| Medium | `_1280` | 1280w | ≤60% of full |
| Small | `_640` | 640w | ≤30% of full |
| Thumb | `_320` | 320w | ≤40 KB |

Prefer AVIF primary + WebP fallback in the loader.

### SEO & social

| Status | Name | Filename | Type | Size / specs | Path | Notes |
|--------|------|----------|------|--------------|------|-------|
| ☐ | Favicon ICO | `favicon.ico` | ICO | 16/32/48 · ≤50 KB | `seo/` or `public/` | |
| ☐ | Favicon SVG | `favicon.svg` | SVG | ≤5 KB | `seo/` or `public/` | |
| ☐ | Apple touch | `apple-touch-icon.png` | PNG | 180×180 · ≤30 KB | `seo/` or `public/` | |
| ☐ | Android 192 | `android-chrome-192.png` | PNG | 192×192 · ≤40 KB | `seo/` or `public/` | |
| ☐ | Android 512 | `android-chrome-512.png` | PNG | 512×512 · ≤100 KB | `seo/` or `public/` | |
| ☐ | Web manifest | `site.webmanifest` | JSON | — | `public/` | References icons |
| ☐ | Open Graph | `og_image.png` or `.webp` | PNG/WebP | 1200×630 · ≤200 KB | `images/social/` | |
| ☐ | Twitter card | `twitter_preview.webp` | WebP | 1200×600 · ≤180 KB | `images/social/` | |
| ☐ | GitHub banner | `github_banner.webp` | WebP | 1280×640 · ≤200 KB | `images/social/` | Off-site |
| ☐ | LinkedIn banner | `linkedin_banner.webp` | WebP | 1584×396 · ≤200 KB | `images/social/` | Off-site |

### Optimization checklist

- [ ] All textures power-of-two
- [ ] All GLB Draco-compressed
- [ ] Ambient audio normalized; SFX peak-limited
- [ ] Videos: H.264, muted preview, poster frame = cover image
- [ ] No unused assets in the production bundle
- [ ] Missing-asset fallbacks verified (placeholders / graceful skip)
- [ ] Reduced-motion path does not require motion-only media

---

## Quick count (planning)

| Phase | Must-have files (approx.) | Optional |
|-------|---------------------------|----------|
| 1 | Fonts (6–10) + favicon | — |
| 2 | 4 audio + 3–4 textures | 1–3 props, HDRI |
| 3 | 1–5 card GLBs + 4–5 textures + UI/social icons + placeholders | Extra card variants |
| 4 | Brand + hero + N× project packs + resume + tech icons | QR, certificates, about set |
| 5 | Material upgrades + polish SFX + cursor/loader | Extra env models, Lottie |
| 6 | SEO set + responsive variants | Social banners |

N = number of featured projects in `src/data/projects.ts`.

---

## Production workflow

1. Author at full quality offline.
2. Export to target format (WebP/AVIF, GLB+Draco, MP3/OGG, WOFF2).
3. Name with the table filenames above.
4. Drop into the listed path under `src/assets/`.
5. Mark status in this file (`☐` → `✅`).
6. Wire via data modules / config — never hardcode paths inside mesh components when a data field exists.

For category-oriented brainstorming (what *kinds* of assets exist), use [ASSET_REQUIREMENTS.md](./ASSET_REQUIREMENTS.md).  
For **AI prompts** and **free download sources**, see [ASSET_REQUIREMENTS.md — AI Prompts & Free Sources](./ASSET_REQUIREMENTS.md#ai-prompts--free-sources).  
For **3D model roles and where each GLB is used**, see [MODELS_3D_README.md](./MODELS_3D_README.md).  
For architecture placement rules, use [ARCHITECTURE.md](./ARCHITECTURE.md).
