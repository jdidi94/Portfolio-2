# PHASE_03_CONTENT_SYSTEM.md

# Neon Portfolio

## Phase 3 — Content System

Version 1.0

---

# Objective

Build the reusable systems that display portfolio content.

This phase introduces floating holographic cards, overlays, transitions, and reusable presentation components.

No final portfolio content should be hardcoded.

Everything must be driven by structured data.

---

# Mission

Transform the experience engine into a portfolio engine.

At the end of this phase, any portfolio section can be created simply by adding new data.

---

# Deliverables

## Data-Driven Architecture

Every section must be generated from structured data.

Examples:

Projects

Skills

Experience

Timeline

Certificates

Social Links

No information should exist directly inside React components.

---

## Floating Card System

Create a reusable 3D card component.

The component must support:

* Floating animation
* Glass material
* Glow effect
* Hover state
* Focus state
* Selection animation
* Expand animation
* Close animation
* Dynamic content

Every future card uses the same component.

---

## Card Variants

Support multiple visual variants.

Examples

Hero Card

Project Card

Skill Card

Experience Card

Timeline Node

Contact Card

Certificate Card

Each variant shares the same animation system.

---

## Overlay System

Create a reusable overlay.

Responsibilities:

* Open project details
* Display media
* Show descriptions
* Show technologies
* Show links
* Close smoothly

The overlay should never interrupt immersion.

---

## Section Manager

Create a section system.

Each section contains:

* Identifier
* Camera target
* Activation trigger
* Objects
* Overlay content

Supported sections:

Hero

About

Projects

Skills

Experience

Timeline

Contact

Future sections must plug into the same system.

---

## Data Models

Create strongly typed models.

Project

Skill

Experience

Timeline Event

Social Link

Certificate

Technology

Every object should have a dedicated interface.

No "any" types.

---

## Hero Module

Create the first section.

Contains:

Developer Name

Title

Short Introduction

Animated Text

Call to Action

Everything should be configurable.

---

## Project Module

Each project contains:

Title

Subtitle

Description

Problem

Solution

Technologies

Images

Video

GitHub

Live Demo

Lessons Learned

Duration

Role

Status

Future additions should require no component changes.

---

## Skills Module

Each skill includes:

Name

Category

Icon

Level

Years of Experience

Description

Related Projects

---

## Experience Module

Each experience includes:

Company

Position

Location

Dates

Responsibilities

Technologies

Achievements

---

## Timeline Module

Each event includes:

Year

Title

Description

Category

Media

Optional links

---

## Contact Module

Display:

Email

GitHub

LinkedIn

Resume

Location

Availability

All links configurable.

---

# Folder Structure

```text
presentation/

├── sections/
│   ├── Hero/
│   ├── Projects/
│   ├── Skills/
│   ├── Experience/
│   ├── Timeline/
│   └── Contact/
│
├── overlays/
│
├── cards/
│
└── shared/

data/

├── projects.ts
├── skills.ts
├── experience.ts
├── timeline.ts
├── social.ts
└── profile.ts

types/

├── Project.ts
├── Skill.ts
├── Experience.ts
├── Timeline.ts
├── Profile.ts
└── Social.ts
```

---

# Animation Requirements

Every card should support:

Idle

↓

Hover

↓

Focus

↓

Open

↓

Close

↓

Return

Animations must feel consistent across every section.

---

# Interaction Flow

Visitor

↓

Hover Card

↓

Glow Animation

↓

Click

↓

Camera Focus

↓

Card Expands

↓

Overlay Opens

↓

Content Displayed

↓

Close

↓

Camera Returns

No abrupt transitions.

---

# Visual Language

All content should share:

* Glass materials
* Rounded geometry
* Cyan/Purple glow
* Soft shadows
* Thin borders
* Consistent spacing
* Premium typography

Every section must feel like part of one product.

---

# Configuration

Move all content settings into configuration.

Examples:

Card Width

Card Height

Glow Intensity

Animation Speed

Spacing

Hover Scale

Camera Distance

Overlay Duration

---

# Accessibility

Support:

Keyboard navigation

Visible focus indicators

Reduced motion mode

Readable typography

High contrast text

---

# Acceptance Criteria

Phase 3 is complete when:

* All content is data-driven.
* Every section uses reusable components.
* Cards animate consistently.
* Overlays open and close smoothly.
* Camera integrates with every section.
* No duplicated presentation logic exists.
* New projects can be added without creating new components.
* The portfolio structure is ready for real content.

---

# Future Compatibility

The system should support:

* Blog articles
* Case studies
* Multiple languages
* CMS integration
* New portfolio categories
* Dynamic filtering
* Search functionality

without changing the architecture.

---

# Definition of Success

At the end of Phase 3, the portfolio should no longer feel like a technical demo.

It should feel like a professional product capable of presenting an entire career through one consistent interactive experience.

The engine is complete.

The presentation system is complete.

Only real content and final polish remain.
