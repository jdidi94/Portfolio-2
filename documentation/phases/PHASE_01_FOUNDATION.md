# PHASE_01_FOUNDATION.md

# Neon Portfolio

## Phase 1 — Foundation

Version 1.0

---

# Objective

Bootstrap a production-ready application shell with a black void scene.

No portfolio content. No cinematic navigation. No interaction engine.

Establish tooling, folder structure, config tokens, and a stable R3F Canvas so Phase 2 can build the Experience Engine on solid ground.

---

# Phase Goals

By the end of this phase:

* The app builds and runs locally with Vite
* TypeScript is strict
* Tailwind and path aliases work
* A full-viewport Canvas renders infinite black space with minimal lighting
* All tunable values live under `src/config/`
* Folder layout matches ARCHITECTURE.md

---

# Deliverables

## Tooling

* Vite + React 19 + TypeScript
* Tailwind CSS
* ESLint (project defaults)
* Path aliases for architecture domains
* Strict `tsconfig` (no `any`)

## Dependencies (locked stack)

Core: `react`, `react-dom`, `vite`, `typescript`

3D: `three`, `@react-three/fiber`, `@react-three/drei`

Animation: `gsap`, `framer-motion`

State: `zustand`

Styling: `tailwindcss` (+ Vite PostCSS setup)

Phase 1 may install but not fully wire: `howler`, `@react-three/postprocessing` (used in Phase 2)

## App Shell

* `index.html` + `src/main.tsx` + `src/app/App.tsx`
* Global styles entry
* Full-viewport layout (no scroll chrome)

## Scene Foundation

* R3F `<Canvas>` with sensible DPR / camera defaults from config
* Infinite black clear color / background
* Minimal ambient + directional light
* No terrain, floor, walls, or skybox
* Optional single non-interactive placeholder mesh for depth reference (removed or replaced in Phase 2)

## Configuration

Create config modules for:

* Colors (palette tokens)
* Camera defaults (position, fov, near, far)
* Lighting intensities
* Renderer (DPR clamp, antialias)
* Fog placeholders (values used when Phase 2 enables fog)

## Folder Skeleton

Create empty or stub modules matching ARCHITECTURE.md so Phase 2 files land in the correct domains:

`experience/`, `interaction/`, `scene/{camera,environment,lighting,objects}`, `audio/`, `renderer/`, `components/{cards,effects,ui}`, `hooks/`, `store/`, `config/`, `data/`, `utils/`, `types/`, `styles/`, `assets/`

---

# Out of Scope

* Experience Manager / navigation
* Raycasting / hover
* GSAP camera timelines
* Postprocessing stack
* Audio playback
* Portfolio sections or content
* Loading screen polish beyond a blank mount

---

# Acceptance Criteria

Phase 1 is complete when:

* `npm run dev` serves the experience without errors
* `npm run build` succeeds
* The viewport shows a calm black void with subtle lighting
* Imports use path aliases (e.g. `@config/...`, `@scene/...`)
* No magic numbers for camera/light/renderer values
* Architecture folders exist and match ARCHITECTURE.md

---

# Performance Baseline

* First paint of Canvas without console errors
* No unnecessary re-renders of the App shell
* Geometries/materials ready for reuse in later phases

---

# Handoff to Phase 2

Phase 2 consumes this foundation and adds:

* Experience Manager
* Cinematic camera
* Interaction Manager
* Floating motion
* Environment, lighting polish, postprocessing, audio

Do not implement those systems in Phase 1.
