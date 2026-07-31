# PROJECT_CAROUSEL.md

# Neon Portfolio

## 3D Circular Project Carousel

Version 1.0

---

# Overview

The Project Carousel is the primary showcase for my portfolio.

Instead of displaying projects in a traditional grid, projects are arranged around a floating circular ring in 3D space.

The visitor navigates around the carousel, discovers projects naturally, and opens immersive case studies.

The experience should feel like exploring an interactive exhibition rather than browsing a website.

---

# Design Vision

Imagine standing inside a futuristic digital gallery.

Projects float around you in a perfect circle.

Each project emits a soft neon glow.

The selected project always moves to the front while surrounding projects rotate smoothly around the center.

Everything feels weightless.

Everything feels alive.

---

# User Journey

```text
Enter Projects Section

↓

Camera slows

↓

Project Carousel appears

↓

Projects rotate slowly

↓

Mouse moves

↓

Nearest project reacts

↓

Hover project

↓

Card lifts

↓

Glow increases

↓

Click

↓

Camera zooms

↓

Project expands

↓

Case Study opens

↓

Return

↓

Carousel continues rotating
```

---

# Carousel Layout

Top View

```text
               Project 1

        Project 8      Project 2

    Project 7              Project 3

        Project 6      Project 4

               Project 5
```

The visitor always remains near the center.

Projects orbit around an invisible axis.

---

# Camera Position

The camera faces the selected project.

When another project is selected:

* Camera rotates smoothly
* Carousel rotates simultaneously
* Selected project moves naturally into focus

Never snap instantly.

Always interpolate.

---

# Project Card

Each project is displayed as a floating holographic glass panel.

Contains:

* Cover image
* Project title
* Short subtitle
* Technology icons
* Category badge
* Status indicator

Material

* Frosted glass
* Cyan emissive border
* Soft reflections
* Rounded corners
* Thin metallic frame

---

# Default State

Every project:

* Slowly rotates
* Gently floats
* Emits subtle glow
* Faces the center
* Slight depth variation

Nothing remains perfectly still.

---

# Hover Interaction

Hovering a project triggers:

* Scale increases
* Border glow brightens
* Card rises slightly
* Cover image sharpens
* Cursor changes
* Soft sound plays
* Nearby cards dim slightly

Duration

200–300 ms

---

# Selected State

Clicking a project:

Carousel rotation slows

↓

Selected project moves forward

↓

Camera eases closer

↓

Background darkens slightly

↓

Card expands

↓

Case Study overlay appears

---

# Carousel Rotation

Support:

* Mouse wheel
* Drag rotation
* Keyboard navigation
* Touch swipe
* Automatic idle rotation

Idle rotation pauses during interaction.

---

# Dynamic Scaling

Cards closer to the camera appear larger.

Cards farther away become smaller.

Scale changes smoothly.

This reinforces depth perception.

---

# Depth Layers

Projects are distributed on multiple depth levels.

Example

```text
Front

        [Project]

Middle

   [Project]     [Project]

Back

[Project]     [Project]
```

The layout should feel three-dimensional rather than perfectly flat.

---

# Information Overlay

Opening a project reveals:

* Hero image
* Gallery
* Problem statement
* Solution
* Architecture
* Technologies
* Features
* Challenges
* Lessons learned
* GitHub
* Live demo
* Development timeline

The overlay uses the global presentation system.

---

# Project Categories

Projects may include:

* Web Applications
* Mobile Apps
* Backend Systems
* Interactive 3D
* UI/UX Design
* AI Experiments
* Open Source
* Personal Projects

Category colors remain subtle.

---

# Lighting

Each card contributes a small amount of emissive light.

Selected cards receive:

* Increased bloom
* Reflection boost
* Stronger rim lighting
* Soft spotlight

Lighting naturally guides attention.

---

# Ambient Effects

Around the carousel:

* Floating particles
* Energy trails
* Soft volumetric fog
* Tiny digital sparks
* Reflection shimmer

Effects remain understated.

---

# Animation System

Idle

↓

Hover

↓

Focus

↓

Expand

↓

Case Study

↓

Close

↓

Return

↓

Idle

Every transition uses the same animation language.

---

# Audio

Hover

Soft holographic pulse

Rotate

Subtle mechanical glide

Select

Energy activation

Open

Cinematic transition

Close

Reverse transition

Ambient

Deep atmospheric synth

---

# Performance Strategy

Implementation guidelines:

* One shared card geometry
* Shared materials
* GPU instancing for decorative elements
* Lazy-load project media
* Frustum culling
* Efficient texture management
* Optimized animations

Target:

Stable 60 FPS on mid-range hardware.

---

# Responsive Behaviour

Desktop

Full 3D carousel.

Laptop

Reduced radius and particle density.

Tablet

Fewer visible cards.

Mobile

Replace with a horizontal swipe carousel while preserving the same visual identity.

---

# Accessibility

Support:

* Keyboard navigation
* Enter to open
* Escape to close
* Visible focus state
* Reduced motion mode
* Accessible HTML overlays

---

# Configuration

Expose configurable values:

* Carousel radius
* Card spacing
* Rotation speed
* Hover scale
* Focus distance
* Camera offset
* Glow intensity
* Float amplitude
* Animation duration

No hardcoded values.

---

# Acceptance Criteria

The Project Carousel is complete when:

* Projects are arranged in a circular 3D layout.
* Rotation feels smooth and natural.
* Hover interactions provide immediate visual feedback.
* Selecting a project brings it elegantly to the foreground.
* Camera transitions remain cinematic.
* Case studies open seamlessly.
* Performance stays smooth with all project assets loaded.
* New projects can be added through data without modifying the carousel logic.

---

# Definition of Success

A recruiter should feel like they are walking through a high-end digital exhibition.

Instead of asking:

> "Which project should I click?"

They should instinctively begin exploring because the interaction itself is enjoyable.

The Project Carousel should demonstrate not only the projects I have built, but also my ability to create immersive, performant, and memorable user experiences.
