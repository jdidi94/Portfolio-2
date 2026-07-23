# TECHNICAL_SPEC.md

# Neon Portfolio

## Technical Specification v1.0

---

# Project Goal

Build an immersive 3D portfolio that demonstrates advanced frontend engineering, interaction design, animation, and user experience.

The portfolio itself is the showcase.

Every technical decision must reinforce the image of a senior-quality engineer capable of building premium web experiences.

---

# Design Philosophy

This is **not** a game.

This is **not** a traditional website.

This is an interactive digital experience.

Users do not scroll.

Users travel.

Navigation is performed through cinematic camera movement inside a minimal futuristic environment.

---

# Experience Principles

The experience must feel:

* Premium
* Smooth
* Calm
* Elegant
* Interactive
* Memorable

Avoid:

* Visual clutter
* Excessive effects
* Flashing lights
* Fast camera movement
* Unnecessary UI

Every animation should have purpose.

---

# Technical Stack

## Core

* React 19
* Vite
* TypeScript

## 3D

* Three.js
* React Three Fiber
* Drei

## Animation

* GSAP
* Framer Motion

## Styling

* Tailwind CSS

## State

* Zustand

## Audio

* Howler.js

## Post Processing

* @react-three/postprocessing

Effects

* Bloom
* Vignette
* Noise
* Depth of Field
* Tone Mapping

---

# Browser Target

Desktop first.

Chrome

Edge

Firefox

Safari

Responsive support comes after desktop is complete.

---

# Performance Requirements

Target FPS

60 FPS minimum.

Preferred

120 FPS on capable hardware.

Frame drops during transitions should be minimal.

The experience should remain fluid on mid-range laptops.

---

# Rendering Rules

Use physically based rendering.

Limit draw calls.

Reuse geometries.

Reuse materials.

Use instancing where appropriate.

Avoid unnecessary re-renders.

Dispose of GPU resources correctly.

---

# Camera System

Camera movement replaces scrolling.

Requirements

* Smooth interpolation
* Cinematic easing
* No instant jumps
* Configurable waypoints
* Focus transitions
* Mouse parallax
* Idle breathing motion

Camera transitions must never feel mechanical.

---

# Scene Rules

Environment

Infinite black space.

No terrain.

No floor.

No walls.

No skybox.

Floating objects only.

Objects must never appear randomly.

Every object must have a narrative purpose.

---

# Lighting

Use a minimal number of lights.

Preferred palette

Black

Dark Gray

White

Electric Blue

Purple

Cyan

Use emissive materials where possible.

Avoid over-lighting the scene.

Darkness is part of the design.

---

# Materials

Preferred

Glass

Transparent

Metallic

Reflective

Emissive

Avoid

Plastic

Cartoon

Flat colors

---

# Motion Guidelines

Everything moves.

Nothing is static.

Movement should be subtle.

Cards

Float

Rotate slowly

React to hover

Lights

Pulse slowly

Particles

Drift continuously

Camera

Breathes gently

---

# Audio Rules

Audio is minimal.

Never overwhelming.

Interaction sounds

Hover

Select

Open

Close

Background

Ambient synth

Soft drones

Low volume

Audio must reinforce immersion.

---

# UI Rules

No traditional navigation bar.

No sidebar.

No large menus.

UI appears only when necessary.

Interface should disappear whenever possible.

---

# Portfolio Sections

Hero

About

Projects

Skills

Experience

Timeline

Contact

Future sections must follow the same visual language.

---

# Project Cards

Each project card contains

Title

Subtitle

Technology stack

Problem

Solution

Images

Video

GitHub

Live Demo

Lessons Learned

Cards should expand smoothly without changing the user's orientation.

---

# Folder Structure

src/

core/

scene/

camera/

lighting/

audio/

renderer/

components/

cards/

effects/

ui/

hooks/

store/

data/

assets/

textures/

audio/

fonts/

images/

videos/

utils/

types/

styles/

---

# Component Rules

Every component

Single responsibility.

Typed.

Reusable.

Documented.

No duplicated logic.

No inline magic values.

Configurable through props.

---

# Naming Convention

PascalCase

Components

camelCase

Functions

UPPER_SNAKE_CASE

Constants

kebab-case

Files where appropriate

---

# Code Standards

Strict TypeScript.

No "any".

No unused code.

Small reusable hooks.

No deeply nested components.

Keep components under approximately 250 lines where practical.

Prefer composition over inheritance.

---

# Animation Standards

Use GSAP for

Camera

Complex timelines

Scene transitions

Use Framer Motion for

HTML overlays

UI animations

Use React Three Fiber animation loop only when continuous updates are required.

---

# State Management

Global

Zustand

Local

React state

Never store transient animation values in global state.

---

# Loading Experience

Loading screen

Logo

Progress

Fade transition

Assets preload before entering the scene.

---

# Accessibility

Respect reduced motion preferences where practical.

Maintain readable contrast.

Provide keyboard navigation for essential actions.

Provide descriptive labels for interactive HTML elements.

---

# Deployment

Platform

Vercel

Repository

GitHub

Automatic deployments

Enabled

---

# Git Strategy

main

Stable production

develop

Active development

Feature branches

feature/<feature-name>

Examples

feature/camera

feature/project-cards

feature/audio

---

# Success Metrics

The portfolio succeeds when:

A recruiter understands the developer's profile within five minutes.

The experience runs smoothly on common hardware.

Interactions feel intentional.

Projects are easy to explore.

The website demonstrates technical ability without sacrificing usability.

Visitors remember the experience after leaving the site.

---

# AI Development Rules (Cursor)

When generating code:

* Prioritize readability.
* Keep files focused on one responsibility.
* Prefer reusable abstractions over duplicated code.
* Explain non-obvious logic with concise comments.
* Favor composition over inheritance.
* Optimize for maintainability before micro-optimizations.
* Preserve type safety.
* Do not introduce new dependencies without justification.
* Match the existing project architecture and naming conventions.
* If multiple implementation options exist, choose the simplest one that satisfies the requirements.

---

# Final Principle

Every line of code, every animation, every sound, and every interaction must contribute to one objective:

**Create a portfolio that convinces someone to schedule an interview.**
