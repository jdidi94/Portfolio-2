# FRONTEND_TECHNOLOGY_HIVE.md

# Frontend Specification

## Technology Hive

Version 1.0

---

# Objective

Build an immersive 3D Technology section where visitors discover technologies through interaction instead of scrolling through a traditional skills list.

The section should feel futuristic, smooth, responsive, and premium.

---

# User Flow

```text
Enter Technology Section

↓

Camera arrives

↓

Technology Hive fades in

↓

Mouse moves

↓

Nearby hexagons illuminate

↓

Hover a technology

↓

Cell glows and lifts

↓

Technology name appears

↓

Click

↓

Camera focuses

↓

Information panel opens

↓

Close

↓

Camera returns to Hive
```

---

# Scene Layout

The Technology Hive is positioned in front of the camera.

The background contains:

* Infinite black space
* Ambient fog
* Floating particles
* Subtle bloom
* No floor
* No walls
* No skybox

Everything appears suspended in empty space.

---

# Honeycomb Grid

Render technologies using a hexagonal honeycomb layout.

```text
      ⬢ ⬢ ⬢ ⬢ ⬢

    ⬢ ⬢ ⬢ ⬢ ⬢ ⬢

      ⬢ ⬢ ⬢ ⬢ ⬢

    ⬢ ⬢ ⬢ ⬢ ⬢ ⬢

      ⬢ ⬢ ⬢ ⬢ ⬢
```

Requirements:

* Infinite expansion support
* Configurable spacing
* Center aligned
* Responsive scaling
* Smooth appearance animation

---

# Technology Cell

Each technology is represented by one reusable hexagonal component.

Structure:

```text
Hexagon

├── Glass Material
├── Neon Border
├── Logo
├── Name
├── Glow Layer
└── Interaction Collider
```

---

# Default State

Each hexagon should have:

* Frosted glass appearance
* Very low glow
* Gentle floating animation
* Slight rotation
* Idle opacity around 70%

---

# Floating Animation

Every cell continuously performs:

* Vertical floating
* Slow rotation
* Tiny depth movement

Each animation uses a random phase offset.

No synchronized movement.

---

# Mouse Light System

The mouse generates an invisible radial influence.

Nearby hexagons react based on distance.

Effects include:

* Glow intensity
* Border brightness
* Reflection intensity
* Slight elevation
* Bloom contribution

Reaction strength decreases smoothly with distance.

---

# Hover State

Hovering a technology should:

* Increase glow
* Raise the hexagon slightly
* Scale to 1.05–1.08
* Increase border brightness
* Fade in the technology name
* Display category
* Change cursor
* Play hover animation

Transition duration:

200–300 ms

---

# Selected State

Clicking a technology should:

* Lock hover
* Focus the camera
* Increase glow
* Expand the selected card
* Dim surrounding cells slightly
* Open the information panel

---

# Camera Behaviour

Camera supports:

* Smooth interpolation
* Ease in/out
* Return animation
* Idle breathing
* Slight mouse parallax

Never teleport.

---

# Information Panel

Display:

* Technology logo
* Name
* Category
* Description
* Experience
* Related projects
* Documentation link

The panel should animate independently from the 3D scene.

---

# Visual Effects

Enable:

* Bloom
* Soft vignette
* Ambient particles
* Glass reflections
* Emissive borders
* Smooth opacity transitions

Keep effects subtle.

---

# Materials

Primary Material

* Frosted glass

Border

* Emissive cyan

Selected

* Cyan + purple glow

Background

* Pure black

Accent

* White highlights

---

# Icons

Every technology displays:

* SVG logo
* High-quality vector
* Center aligned
* Responsive scaling

---

# Animation System

Idle

↓

Mouse Influence

↓

Hover

↓

Selected

↓

Panel Open

↓

Panel Close

↓

Return to Idle

Every animation should use consistent timing.

---

# Responsive Behaviour

Desktop

Full honeycomb layout.

Laptop

Reduce spacing slightly.

Tablet

Reduce the number of visible cells.

Mobile

Replace the 3D hive with a simplified responsive technology grid while preserving branding and navigation.

---

# Accessibility

Support:

* Keyboard focus
* Enter to open
* Escape to close
* Visible focus ring
* Reduced motion mode
* Readable text contrast

---

# Performance

Requirements:

* Use `THREE.InstancedMesh` for all hexagons.
* Share geometry and materials.
* Avoid creating objects inside animation loops.
* Minimize React state updates.
* Animate only active or nearby cells.
* Lazy-load technology icons if necessary.

Target:

* Stable 60 FPS
* Fast initial render
* Smooth hover interactions

---

# Configuration

Expose configurable values:

* Cell size
* Cell spacing
* Hover radius
* Hover lift
* Glow intensity
* Animation speed
* Camera distance
* Bloom strength
* Particle density

No hardcoded values.

---

# Acceptance Criteria

The feature is complete when:

* Technologies render in a scalable honeycomb layout.
* Mouse movement creates a smooth light-following effect.
* Hover interactions feel polished.
* Clicking focuses the selected technology.
* Information panels display dynamic data.
* The layout scales cleanly across screen sizes.
* Performance remains smooth with many technology cells.
* The experience matches the overall Neon Portfolio visual language.
