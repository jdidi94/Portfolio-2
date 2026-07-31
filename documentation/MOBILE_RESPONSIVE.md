# Mobile responsive section rails

Small-viewport journey (`tier === "small"`, width ≤767). Mid and desktop paths are unchanged.

## Goals

- Camera locks on **one 3D card** at a time, framed to fill the phone.
- Swipe / scroll walks **items**; past last/first advances the **section** (Contact loops to Hero).
- **Back / Skip** jump by section only.
- **Hamburger** opens a fullscreen purple-neon menu (resume, contact, social, audio on/off, instructions).
- HTML is only the large detail panels (project / experience / tech / milestone).

## Journey

| Section | Item unit | Edge |
|---------|-----------|------|
| Hero | section card | → About |
| About | each story beat (3D vertical carousel) | → Projects |
| Projects | each project (3D horizontal carousel) | → Experience |
| Experience | each role (3D horizontal carousel) | → Tech |
| Technologies | one-card pop / unpop carousel | → Timeline |
| Timeline | stairs focus carousel | → Contact |
| Contact | section card | → Hero (loop) |

## Chrome (small)

| Piece | Role |
|-------|------|
| [`MobileSectionRail`](../src/components/ui/MobileSectionRail.tsx) | Back / Skip + section progress |
| [`MobileMenuButton`](../src/components/ui/MobileMenuButton.tsx) / [`MobileMenuOverlay`](../src/components/ui/MobileMenuOverlay.tsx) | Fullscreen menu |
| [`mobileNavStore`](../src/store/mobileNavStore.ts) | Item / section director |
| [`mobileMenuStore`](../src/store/mobileMenuStore.ts) | Menu open flag (blocks wheel/swipe) |

## How to test

1. Resize to **≤767px**.
2. Open the hamburger — purple neon fullscreen with resume, contact, audio open/close, instructions; Escape closes.
3. Back / Skip move by section; swipe walks cards; past last advances section.
4. Tap a card → panel; Escape closes panel without leaving the section.
5. Mid/desktop HUD unchanged; no card face-type tuning panel.
