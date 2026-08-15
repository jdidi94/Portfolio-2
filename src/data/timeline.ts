import type { TimelineEvent } from "@shared-types/content";
import { IMAGE_ASSETS } from "@config/assets";

/** Template career milestones — replace with your own narrative. */
export const timeline: readonly TimelineEvent[] = [
  {
    id: "2016-degree",
    year: 2016,
    title: "Bachelor of Science",
    description: "Example University — analytical foundation before software.",
    category: "education",
  },
  {
    id: "2021-bootcamp",
    year: 2021,
    title: "Fullstack JavaScript graduation",
    description: "Example Bootcamp — shipped team products with modern JS stack.",
    category: "education",
    relatedCertificateIds: ["fullstack-cert"],
  },
  {
    id: "2022-marketplace",
    year: 2022,
    title: "Marketplace & platform products",
    description:
      "Artisan marketplace auctions and ticketing microservices — realtime and cloud delivery.",
    category: "project",
    media: IMAGE_ASSETS.tunisianFannCover,
    relatedProjectIds: ["tunisian-fann", "ticketing-platform"],
  },
  {
    id: "2023-mentoring",
    year: 2023,
    title: "Team lead & mentoring",
    description: "Led architecture, reviews, and mentoring while shipping React / Node systems.",
    category: "career",
  },
  {
    id: "2025-immersive",
    year: 2025,
    title: "Interactive 3D portfolio",
    description: "Neon Portfolio — cinematic R3F experience as a product-quality showcase.",
    category: "project",
    media: IMAGE_ASSETS.neonPortfolioCover,
    link: "https://github.com/example/neon-portfolio",
    relatedProjectIds: ["neon-portfolio"],
  },
  {
    id: "2026-goals",
    year: 2026,
    title: "Future goals",
    description:
      "Interactive experiences, creative product engineering, and AI-assisted 3D web systems.",
    category: "goal",
  },
] as const;
