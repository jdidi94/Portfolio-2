# ASSET_REQUIREMENTS.md

# Neon Portfolio

## Asset Production Checklist

Version 1.0

---

# Overview

This document lists every asset required to complete the Neon Portfolio experience.

Assets are grouped by production category to simplify creation and integration.

For **phase timing**, **filenames**, **dimensions**, and **size budgets**, see [ASSETS_README.md](./ASSETS_README.md).

For **AI prompts** and **free download sources**, see [AI Prompts & Free Sources](#ai-prompts--free-sources) below.

---

# Brand Assets

## Logo

* SVG
* PNG (Transparent)
* White version
* Black version
* Neon version
* Animated logo (optional)

---

## Personal Avatar

Requirements

* High-quality portrait
* Transparent PNG
* Full body render
* Half body render
* Stylized holographic version
* Black & White version

---

## Resume

* PDF
* Web version
* Printable version

---

# Typography

Fonts

Primary

* Space Grotesk

Secondary

* Sora

Code

* JetBrains Mono

Required Files

* Regular
* Medium
* SemiBold
* Bold

---

# Images

## Hero Images

* Professional portrait
* Side profile
* Looking forward
* Looking at monitor

Transparent PNG versions preferred.

---

## Project Thumbnails

Each project requires

* Cover image
* Screenshot
* Dashboard screenshot
* Mobile screenshot
* Architecture diagram
* Technology badges

Resolution

1920×1080

---

## About Section

Images

* Working
* Coding
* Teaching
* Chemistry
* Software Engineering
* Vietnam Journey

---

# Videos

For every major project

Requirements

* Demo video
* Short preview
* Loading animation
* Feature highlights

Preferred Format

MP4

WebM

---

# 3D Models

## Floating Cards

Glass Card

Rounded Card

Hexagonal Card

Project Frame

Skill Badge

Timeline Node

Contact Portal

---

## Decorative Objects

Floating Cube

Floating Sphere

Floating Rings

Energy Crystal

Neon Pillar

Wireframe Object

Hologram Platform

---

## Scene Elements

Light Bars

Energy Lines

Floating Frames

Neon Circles

Digital Particles

Abstract Geometry

---

# Materials

Glass

Frosted Glass

Metal

Chrome

Black Metal

Carbon Fiber

Neon Emission

Transparent Plastic

---

# Textures

Noise

Normal Maps

Glass Imperfections

Metal Scratches

Soft Gradient

Glow Texture

Grid Texture

Hex Pattern

Energy Pattern

---

# HDRI

Minimal Studio

Dark Studio

Black Environment

Soft Reflection

---

# Audio

## Background

Ambient Synth

Space Drone

Digital Atmosphere

Low Frequency Hum

---

## Interaction

Hover

Click

Open

Close

Focus

Success

Notification

Transition

---

## Camera

Movement

Arrival

Zoom

Portal

---

# Icons

GitHub

LinkedIn

Email

Resume

Phone

Location

Website

Download

External Link

Arrow

Close

Play

Pause

---

# Technology Icons

React

TypeScript

JavaScript

Node.js

Express

MongoDB

MySQL

PostgreSQL

Firebase

Docker

AWS

Git

GitHub

Three.js

React Three Fiber

GSAP

Tailwind

Python

Java

C#

Unity

Blender

Figma

Photoshop

Illustrator

---

# Particles

Small Dust

Glowing Particles

Spark

Smoke

Energy Trails

Digital Pixels

Floating Dots

---

# UI Assets

Buttons

Glass Panels

Input Fields

Tooltips

Progress Bars

Loading Circle

Selection Ring

Focus Indicator

Cursor

---

# Loading Screen

Logo

Loading Bar

Animated Symbol

Background Gradient

Particles

---

# Contact Assets

GitHub QR

LinkedIn QR

Portfolio QR

Email QR

Resume QR

---

# Background Assets

Soft Fog

Noise Overlay

Gradient Texture

Star Dust

Glow Shapes

---

# Social Media

GitHub Banner

LinkedIn Banner

Portfolio Thumbnail

Open Graph Image

Twitter Preview

---

# SEO Assets

favicon.ico

favicon.svg

apple-touch-icon.png

android-chrome-512.png

android-chrome-192.png

site.webmanifest

---

# Documents

Resume.pdf

Resume.docx

Portfolio.pdf

Project Case Studies

---

# Animations

Logo Reveal

Card Hover

Card Open

Camera Transition

Loading Animation

Text Reveal

Glow Pulse

Floating Motion

Portal Opening

Contact Reveal

---

# Future Assets

Achievement Icons

Language Flags

Theme Icons

VR Icons

Certificates

Awards

Testimonials

Company Logos

---

# Folder Structure

assets/

audio/

ambient/

ui/

camera/

images/

hero/

projects/

about/

social/

textures/

glass/

metal/

noise/

gradients/

models/

cards/

props/

environment/

fonts/

videos/

icons/

svg/

png/

documents/

resume/

certificates/

animations/

lottie/

---

# Asset Naming Convention

Examples

hero_portrait_front.webp

project_wygo_cover.webp

project_wygo_dashboard.webp

glass_card_base.glb

ambient_space_loop.mp3

hover_soft.wav

camera_transition.wav

logo_neon.svg

texture_glass_normal.webp

model_floating_ring.glb

Use lowercase.

Use underscores.

Never use spaces.

Use descriptive names.

---

# Optimization Rules

Images

* WebP
* AVIF when possible

Models

* GLB
* Draco compressed

Textures

* Power-of-two dimensions

Audio

* MP3 for music
* OGG for effects when appropriate

Videos

* MP4 (H.264)
* WebM for transparency where needed

---

# AI Prompts & Free Sources

Use this section to generate or download assets that match the Neon Portfolio look:

* Infinite black void
* Minimal futuristic product design (not a game, not cyberpunk clutter)
* Thin neon accents (cyan `#22D3EE`, electric blue `#3B82F6`, purple `#8B5CF6`)
* Premium glass, soft glow, calm motion
* Clean topology suitable for the web (low poly, GLB)

**Rule:** Export GLB as **shape only** (gray / simple materials). Drive final neon colors, emissive, glass, and bloom in React Three Fiber from `src/config/`.

**After generation:** optimize (Draco GLB, WebP/AVIF, size budgets in [ASSETS_README.md](./ASSETS_README.md)), rename with snake_case, drop into `src/assets/`.

---

## Recommended tools

| Need | AI / app | Notes |
|------|----------|-------|
| 3D props / cards | [Meshy](https://www.meshy.ai/), [Luma Genie](https://lumalabs.ai/genie), [Spline AI](https://spline.design/), [CSM](https://www.csm.ai/), [Rodin](https://hyperhuman.deemos.com/rodin) | Prefer text-to-3D → export GLB |
| Retopo / cleanup | Blender (free) | Decimate, apply scale, export GLB + Draco |
| Images / textures | [Leonardo](https://leonardo.ai/), [Ideogram](https://ideogram.ai/), [Flux](https://fal.ai/) / local ComfyUI, [Recraft](https://www.recraft.ai/) | Transparent PNG or seamless textures |
| Icons | [Recraft](https://www.recraft.ai/), [Magician Figma](https://magician.design/) | Prefer SVG; or download free sets below |
| Audio | [ElevenLabs Sound Effects](https://elevenlabs.io/), [Stable Audio](https://www.stableaudio.com/) | Keep SFX short; normalize volume |
| Remove BG | [remove.bg](https://www.remove.bg/), Photoroom | Portraits / cutouts |

---

## Free sources (license-safe)

Always check the license (CC0, CC-BY, MIT). Prefer **CC0** for portfolio shipping. Credit when required.

### 3D models

| Source | URL | Best for |
|--------|-----|----------|
| Poly Pizza | https://poly.pizza/ | Low-poly props, CC0 |
| Kenney | https://kenney.nl/assets | Simple geometric packs (CC0) |
| Quaternius | https://quaternius.com/ | Low-poly packs |
| Sketchfab (filter: downloadable + CC) | https://sketchfab.com/ | Search “glass”, “ring”, “abstract”; download GLB |
| Google Poly archive mirrors / Poly Haven models | https://polyhaven.com/models | Clean CC0 models |
| cgtrader Free / Free3D | https://free3d.com/ | Spot-check license carefully |

**Search tips:** `thin torus`, `abstract ring`, `glass panel`, `simple frame`, `low poly crystal`, `hologram platform` + filter **triangles &lt; 5k–15k**.

### Textures & HDRI

| Source | URL | Best for |
|--------|-----|----------|
| Poly Haven | https://polyhaven.com/ | HDRI, CC0 textures (noise, metal, glass) |
| ambientCG | https://ambientcg.com/ | PBR maps, CC0 |
| Texture Can | https://www.texturecan.com/ | Free PBR |
| OpenGameArt | https://opengameart.org/ | Misc textures (check license) |

### Icons & UI

| Source | URL | Best for |
|--------|-----|----------|
| Lucide | https://lucide.dev/ | UI icons (MIT) — close, play, arrow, external |
| Phosphor | https://phosphoricons.com/ | UI + social-style icons |
| Heroicons | https://heroicons.com/ | Simple UI |
| Simple Icons | https://simpleicons.org/ | Tech brand SVGs (React, TS, Docker, …) |
| Tabler Icons | https://tabler.io/icons | Dense UI set |
| svgrepo | https://www.svgrepo.com/ | Misc SVG (verify license per icon) |
| Google Fonts Icons / Material Symbols | https://fonts.google.com/icons | Generic UI |

### Fonts

| Font | Source |
|------|--------|
| Space Grotesk | https://fonts.google.com/specimen/Space+Grotesk |
| Sora | https://fonts.google.com/specimen/Sora |
| JetBrains Mono | https://fonts.google.com/specimen/JetBrains+Mono |

Download **WOFF2** (or convert with [google-webfonts-helper](https://gwfh.mranftl.com/fonts)).

### Audio

| Source | URL | Best for |
|--------|-----|----------|
| Freesound | https://freesound.org/ | UI clicks, whooshes (filter CC0) |
| Pixabay Music / SFX | https://pixabay.com/sound-effects/ | Ambient drones, soft UI |
| OpenGameArt | https://opengameart.org/ | Loops / SFX |
| Mixkit | https://mixkit.co/free-sound-effects/ | Short UI / transitions |

Search: `soft click`, `ui hover`, `whoosh soft`, `space drone ambient`, `sci-fi hum low`.

### Images (stock / abstract)

| Source | URL | Best for |
|--------|-----|----------|
| Unsplash | https://unsplash.com/ | Atmosphere / coding photos (not final brand) |
| Pexels | https://pexels.com/ | Same |
| Coverr / Pexels Videos | https://www.pexels.com/videos/ | Optional B-roll only |

**Do not** use random stock faces as your hero portrait. Use your own photo (or a clearly licensed personal shoot). AI-stylized hologram variants of **your** portrait are fine.

### Particles / sprites

| Source | URL | Best for |
|--------|-----|----------|
| Kenney Particle Pack | https://kenney.nl/assets/particle-pack | Glow dots, soft circles |
| Poly Haven / ambientCG | (above) | Noise maps for particles |

---

## Shared prompt style (append to most prompts)

```text
Style: minimal premium product design, infinite black void background,
soft cyan and purple neon accents, frosted glass, thin edges, calm, elegant,
not a video game, not busy cyberpunk, not cluttered, high-end interactive
portfolio aesthetic, clean silhouette, web-ready
```

Negative / avoid (when the tool supports it):

```text
busy, cluttered, noisy textures, cartoon, anime, low quality, blurry,
text, watermark, UI chrome, excessive bloom, rainbow neon, hard surface sci-fi junk
```

---

## 3D AI prompts (props & cards)

Export: **GLB**, centered, scale ~1 unit, apply transforms, prefer under **15k triangles**. Materials can be gray — recolor in code.
### Wireframe-friendly abstract prop

```text
A simple abstract geometric wireframe-friendly object, open lattice cube or
frame, thin bars, centered, low poly, clean topology, no textures needed,
minimal digital sculpture for a neon black-void portfolio
```

**Filename:** `model_wireframe_object.glb` 

### Floating ring

```text
A single thin elegant torus ring floating alone, minimal geometric sculpture,
perfectly smooth, hollow ring, thin tube profile, centered origin,
low poly but clean, solid mesh, no ornaments, no text, black void background,
studio product turntable, GLB-ready game asset
```

**Filename:** `model_floating_ring.glb`

### Glass card / project frame

```text
A thin rounded rectangular glass panel frame only, beveled edge, empty center
(content plane separate), soft frosted glass look, slightly curved or flat,
centered, low poly, clean UVs, product UI hologram card for web Three.js,
no text, no logos, no buttons
```

**Filename:** `glass_card_base.glb`






### Rounded / hexagonal card

```text
A thin hexagonal holographic card frame, rounded corners, empty center,
glass edge lip, centered origin, low poly, clean silhouette, minimal,
premium portfolio prop, no text
```

**Filename:** `glass_card_rounded.glb` / hex variant as needed






### Neon pillar / light bar

```text
A tall thin rectangular light bar / neon pillar, simple box extruded tall,
centered base, very low poly, solid mesh, no details, environment accent prop
```

**Filename:** `model_neon_pillar.glb` / `model_light_bar.glb`

### Hologram platform

```text
A flat circular hologram platform disc with a thin raised rim, empty top surface,
centered, low poly, clean, floating pedestal for a 3D portfolio scene, no text
```

**Filename:** `model_hologram_platform.glb`

---

### Contact portal

```text
A vertical elliptical portal ring standing upright, thin luminous rim,
empty center, minimal teleport-gate sculpture, centered, low poly,
premium dark sci-fi product design, no ornaments, no text
```

**Filename:** `contact_portal.glb`


### Skill badge

```text
A small circular badge or hex token, thin, flat front face for an icon,
beveled rim, centered, low poly, empty face, no text, UI prop for Three.js
```

**Filename:** `skill_badge.glb`

### Floating sphere / crystal

```text
A small low-poly icosahedron or faceted crystal, sharp clean edges,
symmetric, centered, solid mesh, minimal sci-fi prop, no internal details,
no text, product-design abstract object for a dark 3D portfolio scene
```

**Filename:** `model_floating_sphere.glb` or `model_energy_crystal.glb`






### Timeline node

```text
A small glowing node: short vertical cylinder or soft sphere on a thin disc base,
minimal UI marker, centered, low poly, clean, no text, portfolio timeline prop
```

**Filename:** `timeline_node.glb`











## Image AI prompts

### Hero / holographic portrait (use your photo as reference when possible)

```text
Stylized holographic half-body portrait of a software engineer, frosted glass
and cyan-purple neon rim light, transparent cutout look, black void background,
premium tech portfolio, calm expression, high detail face, no text, no logos
```

**Filenames:** `hero_portrait_front.webp`, `hero_portrait_hologram.webp`

### Project cover (abstract — replace with real screenshots when ready)

```text
Abstract premium dashboard preview on a floating glass panel, dark UI,
cyan and purple accents, soft glow, black void, cinematic product shot,
16:9, no readable text, no watermarks, high-end SaaS aesthetic
```

**Filename:** `project_{slug}_cover.webp` (1920×1080)

### About / atmosphere

```text
Cinematic photo of a developer workspace at night, single monitor glow,
deep blacks, soft cyan light spill, shallow depth of field, calm, premium,
no faces required, no logos
```

### Soft noise texture (seamless)

```text
Seamless soft film grain noise texture, very subtle, nearly black,
power of two, tileable, flat lighting, no pattern, no color cast, 512x512
```

**Filename:** `texture_noise_soft.webp`

### Glow particle sprite

```text
Soft circular radial glow sprite, bright center fading to transparent edges,
cyan-white, black background, no hard circle edge, particle texture, 256x256
```

**Filename:** `texture_glow_soft.webp`

### Glass normal / imperfections

```text
Seamless glass imperfection normal map, subtle fingerprints and micro scratches,
flat gray-purple normal map style, tileable, 512x512, low contrast, PBR ready
```

**Filename:** `texture_glass_normal.webp`, `texture_glass_imperfections.webp`

### Soft radial gradient

```text
Soft radial gradient from dim cyan center to pure black edges, seamless usable
as vignette glow, flat 2D, 512x512, no noise, no shapes
```

**Filename:** `texture_gradient_radial.webp`

### Open Graph / social thumbnail

```text
Minimal dark portfolio open graph image, black background, thin cyan neon frame,
centered abstract glass panel silhouette, no readable text, 1200x630, clean brand feel
```

**Filename:** `og_image.webp`

---

## Icon prompts (if generating) + free defaults

Prefer **Lucide + Simple Icons** (free) over AI for UI/tech icons — sharper SVGs, consistent strokes.

### AI icon prompt (only if a free set is missing)

```text
Simple monochrome line icon of {github | external link | download | play},
24x24 style, 1.5px stroke, rounded joins, centered, transparent background,
flat SVG-ready, no fill clutter, no text, no gradients
```

### Free mapping (recommended)

| Need | Free source |
|------|-------------|
| close, play, pause, arrow, external, download | [Lucide](https://lucide.dev/) |
| GitHub, LinkedIn, email-style | Lucide or Phosphor |
| React, TypeScript, Node, Docker, Three.js, … | [Simple Icons](https://simpleicons.org/) |
| Favicon | Export logo SVG → [realfavicongenerator.net](https://realfavicongenerator.net/) |

Save as `icon_{name}.svg` or `tech_{name}.svg` under `src/assets/icons/`.

---

## Audio prompts (AI or search terms)

### Ambient loop

```text
Soft dark ambient space drone, low frequency hum, subtle synth pad,
seamless loop, calm, minimal, no melody, no percussion, quiet cinematic void
```

**Filename:** `ambient_space_loop.mp3` · target 30–90s loop · ≤2 MB

### UI SFX (generate short clips or search Freesound/Pixabay)

| Asset | Prompt / search |
|-------|-----------------|
| Hover | `soft ui hover tick, very short, muted high click, clean` |
| Focus | `soft digital focus chime, short, gentle, sci-fi UI` |
| Transition | `soft whoosh camera move, airy, short, no bass boom` |
| Open / close | `soft panel open whoosh` / `soft panel close` |

**Filenames:** `sfx_hover.ogg`, `sfx_focus.ogg`, `sfx_transition.ogg`, …

---

## Production recipe (quick)

1. Pick free source **or** paste the matching prompt into a 3D/image tool.
2. For 3D: open in Blender → scale to ~1m → origin center → Decimate if needed → **Export GLB** (Draco optional).
3. Strip fancy materials if they fight your neon palette; keep mesh.
4. Compress images to WebP/AVIF; keep power-of-two textures.
5. Name per [Asset Naming Convention](#asset-naming-convention); place per [ASSETS_README.md](./ASSETS_README.md).
6. Tint / emissive / glass in code from `COLORS` — do not bake final neon into the GLB.

---

# Production Status

Each asset should be marked as:

* ☐ Not Started
* 🟡 In Progress
* ✅ Complete
* 🔄 Needs Revision

This checklist should be updated throughout development to track production progress.
