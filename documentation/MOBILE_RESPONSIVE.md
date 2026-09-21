# Mobile responsive section rails

Small-viewport journey (`tier === "small"`, width ≤767). Mid and desktop paths are unchanged.

## Goals

- Camera locks on **one 3D card** at a time, framed to fill the phone.
- Swipe / scroll walks **items**; past last/first advances the **section** (Contact loops to Hero).
- **Back / Skip** jump by section only.
- **Hamburger** opens a fullscreen purple-neon menu (resume, contact, social, audio on/off, instructions) with safe-area padding so Close stays on-screen.
- HTML is only the large detail panels (project / experience / tech / milestone).
- Open panel + scroll / swipe / arrow keys → panel **shakes** and **Close** highlights; close the panel to keep navigating.
- About’s **first** beat and **Contact** use a slightly farther camera (`sectionCardFocusDistance`) so text cards aren’t clipped.
- Overview faces show **icon + section label + title** only; detail faces keep full copy.
- Tech pop: **category label at center**, up to 3 **logo-only** tech hexes around it (desktop-matching logos, no face text); whole cluster pops / unpops.
- About (`certificate`) and Technologies (`skill`) use distinct overview icons.

## Journey

| Section | Item unit | Edge |
|---------|-----------|------|
| Hero | section card | → About |
| About | each story beat (3D vertical carousel) | → Projects |
| Projects | each project (3D horizontal carousel) | → Experience |
| Experience | each role (3D horizontal carousel) | → Tech |
| Technologies | category cluster (label + logos) pop / unpop | → Timeline |
| Timeline | stairs focus carousel | → Contact |
| Contact | section card (zoomed out) | → Hero (loop) |

## Chrome (small)

| Piece | Role |
|-------|------|
| [`MobileSectionRail`](../src/components/ui/MobileSectionRail.tsx) | Back / Skip + section progress |
| [`MobileMenuButton`](../src/components/ui/MobileMenuButton.tsx) / [`MobileMenuOverlay`](../src/components/ui/MobileMenuOverlay.tsx) | Fullscreen menu |
| [`mobileNavStore`](../src/store/mobileNavStore.ts) | Item / section director |
| [`mobileMenuStore`](../src/store/mobileMenuStore.ts) | Menu open flag (blocks wheel/swipe) |

## How to test

1. Resize to **≤767px**.
2. Open the hamburger — purple neon fullscreen with resume, contact, audio open/close, instructions; Close fully visible; Escape closes.
3. Back / Skip move by section; swipe walks cards; past last advances section.
4. Tap a card → panel; Escape closes panel without leaving the section.
5. With a panel open, scroll/swipe shakes the panel and highlights Close (journey stays blocked until closed).
6. Tech section: Frontend (etc.) label centered with logo-only hexes around it; swipe advances category pages.
7. Overview cards show only icon / label / title; focused detail cards keep body copy.
8. About overview icon differs from Technologies hex+bolt.
9. About first card + Contact feel slightly more zoomed out than other cards.
10. Mid/desktop HUD unchanged; Tech cluster tuning panel available when the dev flag is on (Log measures → console JSON).
