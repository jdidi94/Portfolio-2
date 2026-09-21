/**
 * First-run navigation tips — desktop vs mobile copy.
 */
export const NAVIGATION_GUIDE = {
  storageKey: "neon-portfolio-nav-guide-v1",
  desktop: {
    title: "How to travel",
    subtitle: "This is a corridor. You move the camera, not a page scroll.",
    steps: [
      "Scroll or use ↑ ↓ to jump between sections",
      "Click a card to focus and read the details",
      "Click empty space or press Esc to return home",
      "← → cycle items in a section · M toggles audio",
    ],
    cta: "Start exploring",
  },
  mobile: {
    title: "How to travel",
    subtitle: "One card at a time. Swipe through the journey.",
    steps: [
      "Swipe to move between cards in a section",
      "Use Back / Skip to jump to another section",
      "Tap a card to open its detail panel",
      "Menu (☰) has resume, contact, and these tips again",
    ],
    cta: "Got it",
  },
} as const;

export type NavigationGuideCopy =
  (typeof NAVIGATION_GUIDE)["desktop" | "mobile"];
