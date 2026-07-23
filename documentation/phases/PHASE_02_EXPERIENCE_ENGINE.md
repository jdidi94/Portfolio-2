# PHASE_02_EXPERIENCE_ENGINE.md

# Neon Portfolio

## Phase 2 — Experience Engine

Version 1.0

---

# Objective

Transform the static 3D scene into an interactive cinematic experience.

This phase introduces the systems that make the portfolio feel alive before any real content is added.

No portfolio information should be implemented yet.

The focus is entirely on movement, interaction, atmosphere, and immersion.

---

# Phase Goals

By the end of this phase, the visitor should be able to enter the experience and naturally move through a beautiful, responsive environment.

The scene should feel premium even without portfolio content.

---

# Deliverables

## Experience Manager

Create the central controller responsible for:

* Experience state
* Navigation flow
* Scene progression
* Active focus object
* Camera destinations
* Section activation
* Future expansion

The Experience Manager becomes the "director" of the application.

---

## Camera System

Implement a cinematic camera.

Requirements:

* Smooth interpolation
* Configurable waypoints
* Focus targets
* Mouse parallax
* Idle breathing animation
* Configurable transition speed
* Soft easing
* Frame-rate independent movement

The camera should never teleport.

Every movement must feel intentional.

---

## Navigation

Replace traditional scrolling with movement.

Navigation is achieved through camera travel.

Requirements:

* Focus on objects
* Return to exploration
* Sequential navigation
* Keyboard support (development)
* Mouse interaction

Future support for gamepads and touch devices should remain possible.

---

## Interaction Manager

Build a centralized interaction system.

Responsibilities:

* Hover detection
* Click detection
* Raycasting
* Selection
* Focus events
* Cursor state

Objects should never directly manage interaction logic.

---

## Floating Motion System

Every object in the scene should feel alive.

Implement reusable floating behaviors.

Supported animations:

* Vertical floating
* Gentle rotation
* Random phase offset
* Adjustable amplitude
* Adjustable speed

The motion should be subtle and calming.

---

## Environment

Expand the empty scene.

Add:

* Volumetric fog
* Particle field
* Ambient glow
* Soft gradients
* Background depth
* Floating decorative geometry

The environment should communicate scale without becoming visually busy.

---

## Lighting

Implement production-ready lighting.

Include:

* Ambient Light
* Directional Light
* Accent Lights
* Emissive objects
* Bloom tuning

Lighting should guide attention rather than illuminate everything equally.

Darkness remains a key design element.

---

## Post Processing

Configure:

* Bloom
* Tone Mapping
* Noise
* Vignette
* Depth of Field

Effects must remain subtle.

Avoid exaggerated visual styles.

---

## Audio System

Introduce the Audio Manager.

Implement:

* Ambient loop
* Hover sound
* Focus sound
* Transition sound

Audio should be event-driven and easy to expand.

No object should play sounds directly.

---

## Configuration System

Move all tunable values into configuration files.

Examples:

* Camera speed
* Float amplitude
* Light intensity
* Fog density
* Bloom strength
* Transition duration
* Audio volume

Avoid hardcoded values.

---

# Folder Additions

```text
experience/
│
├── ExperienceManager.ts
├── NavigationManager.ts
├── SectionManager.ts
└── ExperienceState.ts

interaction/
│
├── InteractionManager.ts
├── Raycaster.ts
├── CursorManager.ts
└── Events.ts

scene/
│
├── camera/
│   ├── MainCamera.tsx
│   ├── CameraController.ts
│   └── CameraRig.ts
│
├── environment/
│   ├── Fog.tsx
│   ├── Background.tsx
│   └── AmbientParticles.tsx
│
├── lighting/
│   ├── Lighting.tsx
│   ├── AccentLights.tsx
│   └── EmissiveLights.tsx

audio/
│
├── AudioManager.ts
├── AmbientAudio.ts
└── SoundEffects.ts
```

---

# Development Rules

No portfolio content.

No project cards.

No About section.

No Skills.

No Timeline.

No Contact.

The engine comes before the content.

---

# Acceptance Criteria

Phase 2 is complete when:

* The camera moves smoothly between targets.
* Mouse movement subtly influences the camera.
* Objects float naturally.
* Hover interactions work.
* Raycasting is stable.
* Ambient particles animate continuously.
* Lighting feels cinematic.
* Bloom is tuned.
* Audio responds to interaction.
* The environment feels alive despite containing placeholder objects.

---

# Performance Goals

Maintain:

* 60 FPS minimum
* Stable memory usage
* Minimal garbage collection
* Efficient render loop
* No unnecessary React re-renders

---

# Testing Checklist

* Camera interpolation is smooth.
* No visible animation stutter.
* Interaction remains responsive.
* Scene loads without visual artifacts.
* Hover detection is accurate.
* Floating animation remains synchronized.
* Lighting performs consistently across devices.

---

# End Result

At the end of Phase 2, the visitor should enter an empty but breathtaking digital space.

Even without portfolio content, the experience should already communicate craftsmanship, attention to detail, and technical quality.

If someone explored only this version, they should already believe the final portfolio will be exceptional.
