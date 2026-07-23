# ARCHITECTURE.md

# Neon Portfolio

## Architecture v1.0

---

# Purpose

This document defines system boundaries, folder ownership, state rules, and data flow.

All implementation must respect this architecture. Prefer the simplest structure that satisfies PRODUCT_VISION.md and TECHNICAL_SPEC.md.

---

# High-Level Model

```text
┌─────────────────────────────────────────────────────────┐
│                     HTML Overlays (UI)                   │
│              Framer Motion · semantic HTML               │
└──────────────────────────┬──────────────────────────────┘
                           │ reads / dispatches
┌──────────────────────────▼──────────────────────────────┐
│                 Experience Manager (director)            │
│     section · focus · camera destination · progression   │
└───────┬──────────────────────┬───────────────────┬──────┘
        │                      │                   │
        ▼                      ▼                   ▼
┌───────────────┐    ┌─────────────────┐   ┌──────────────┐
│ Camera System │    │ Interaction Mgr │   │ Audio Manager│
│ GSAP · waypoints│   │ raycast · hover │   │ Howler events│
└───────┬───────┘    └────────┬────────┘   └──────────────┘
        │                     │
        ▼                     ▼
┌─────────────────────────────────────────────────────────┐
│              React Three Fiber Scene Graph               │
│   environment · lighting · placeholders · postprocessing │
└─────────────────────────────────────────────────────────┘
```

The Experience Manager is the director. Scene objects never own navigation, raycasting, or sound playback.

---

# Folder Map

```text
src/
├── app/                    # App shell, providers, root composition
├── core/                   # Bootstrapping helpers shared across domains
├── experience/             # Experience / navigation / section directors
├── interaction/            # Raycast, hover, selection, cursor
├── scene/
│   ├── camera/             # Main camera, controller, rig
│   ├── environment/        # Fog, background, particles
│   ├── lighting/           # Ambient, directional, accents
│   └── objects/            # Placeholder / decorative 3D objects
├── audio/                  # AudioManager, ambient, SFX
├── renderer/               # Canvas setup, postprocessing pipeline
├── components/
│   ├── cards/              # Project / content cards (later phases)
│   ├── effects/            # Reusable visual effects
│   └── ui/                 # HTML overlays, loading, hints
├── hooks/                  # Shared React hooks
├── store/                  # Zustand stores (global experience state only)
├── config/                 # All tunable values (no magic numbers)
├── data/                   # Typed content models (later phases)
├── assets/                 # textures, audio, fonts, images, videos
├── utils/                  # Pure helpers
├── types/                  # Shared TypeScript types
└── styles/                 # Global CSS / Tailwind entry
```

Path aliases map domains (example: `@experience`, `@scene`, `@config`, `@components`, `@store`, `@hooks`, `@utils`, `@types`, `@audio`, `@interaction`).

Do not invent new top-level folders unless a domain cannot fit the map above.

---

# Domain Ownership

## Experience (`experience/`)

Owns:

* Experience lifecycle (boot → explore → focus → transition)
* Active section and focus target ids
* Camera destination requests
* Navigation flow (sequential / return to explore)

Does not own:

* Raycast math
* Sound playback
* Mesh materials or GPU disposal

## Interaction (`interaction/`)

Owns:

* Pointer raycasting
* Hover / click / selection events
* Cursor state derived from hit results

Does not own:

* Camera timelines
* Section content
* Direct audio calls from meshes

Meshes expose interactive ids/refs; Interaction Manager decides hit outcomes and notifies Experience.

## Camera (`scene/camera/`)

Owns:

* Camera position / look-at interpolation
* Waypoints and focus targets
* Mouse parallax and idle breathing
* GSAP-driven transitions (frame-rate independent)

Does not store transient tween values in Zustand. Animation lives in GSAP / R3F.

## Environment & Lighting

* `scene/environment/` — fog, background depth, particle field
* `scene/lighting/` — ambient, directional, accent, emissive guides

Lighting guides attention; darkness remains a design element.

## Audio (`audio/`)

Owns:

* Ambient loop
* Interaction SFX (hover, focus, transition)
* Volume and mute policy

Event-driven only. No object plays sounds directly.

## Renderer (`renderer/`)

Owns:

* R3F Canvas defaults
* Postprocessing stack (bloom, vignette, noise, DoF, tone mapping)
* Shared renderer quality settings from `config/`

## UI (`components/ui/`)

Owns:

* Loading screen, reduced-motion messaging, keyboard hints
* Framer Motion HTML overlays

UI must remain minimal and dismissible.

---

# State Boundaries

| Kind | Tool | Examples |
|------|------|----------|
| Global experience | Zustand | active section, focus id, navigation mode, audio muted, reduced motion flag |
| Local UI | React state | panel open, hover label visibility |
| Animation | GSAP / R3F `useFrame` | camera tween progress, float phase, particle drift |

Never store continuous animation values in Zustand.

Prefer selectors that subscribe to narrow slices to avoid unnecessary React re-renders.

---

# Configuration

All tunables live under `src/config/`:

* Camera speed, easing, parallax, breathing
* Float amplitude / speed
* Light intensities and colors
* Fog density / color
* Bloom strength and thresholds
* Transition durations
* Audio volumes

Components read config; they do not hardcode magic numbers.

---

# Animation Ownership

| Concern | Tool |
|---------|------|
| Camera, scene transitions, complex timelines | GSAP |
| HTML overlays, UI enter/exit | Framer Motion |
| Continuous float, idle, particles | R3F `useFrame` |

Use `useFrame` only for continuous updates. Do not put business logic in the render loop.

---

# Rendering Rules

* Physically based materials where appropriate
* Reuse geometries and materials
* Instance similar objects
* Dispose GPU resources on unmount
* Keep draw calls and shader cost intentional
* Fail gracefully if assets are missing

---

# Content Boundary (Phases)

| Phase | Allowed |
|-------|---------|
| 1 Foundation | Empty void, base Canvas, lights, tokens |
| 2 Experience Engine | Placeholder interactive objects, no portfolio copy |
| 3+ Content | Typed data in `data/`, cards, sections |

Do not leak portfolio content into the engine layer.

---

# Component Standards

* One responsibility per component
* Strict TypeScript — no `any`, no `@ts-ignore`
* Target 100–200 lines; avoid >300 unless justified
* Props fully typed
* Composition over inheritance
* Path aliases — no deep relative imports

---

# Data Flow (typical focus)

1. Pointer moves → Interaction Manager raycasts
2. Hit → hover event + cursor update + Audio Manager (hover)
3. Click → Experience Manager sets focus target + section
4. Experience Manager requests camera destination
5. Camera System GSAP-tweens to waypoint
6. UI overlay may reveal contextual chrome (later phases)

---

# Deployment Topology

* App: Vite SPA
* Host: Vercel
* Source: GitHub (`main` production, `develop` active, `feature/*` branches)

---

# Non-Goals

* Mixing UI, rendering, and business logic in one file
* Object-local sound or interaction ownership
* Global stores for animation clocks
* New libraries without documented necessity

---

# Principle

Architecture exists to keep the experience calm, maintainable, and interview-worthy.

When unsure, choose the smallest change that preserves these boundaries.
