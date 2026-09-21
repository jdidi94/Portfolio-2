import type { TimelineEvent } from "@shared-types/content";
import { IMAGE_ASSETS } from "@config/assets";

/** Career milestones — continuous learning narrative. */
export const timeline: readonly TimelineEvent[] = [
  {
    id: "2016-chemistry",
    year: 2016,
    title: "Degree in Chemistry",
    description: "University of Science of Monastir (FSM), analytical foundation before software.",
    category: "education",
  },
  {
    id: "2021-rbk",
    year: 2021,
    title: "Fullstack JavaScript graduation",
    description: "RBK RebootKamp / Hack Reactor, shipped team products with modern JS stack.",
    category: "education",
    relatedCertificateIds: ["rbk-fullstack"],
  },
  {
    id: "2022-marketplace",
    year: 2022,
    title: "Marketplace & platform products",
    description: "Tunisian Fann auctions and ticketing microservices with realtime and cloud delivery.",
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
    id: "2024-fallah-smart",
    year: 2024,
    title: "Fallah Smart platform",
    description:
      "Arabic-first farm OS with Expo mobile, NestJS API, and Next.js admin for Tunisia and North Africa.",
    category: "project",
    media: IMAGE_ASSETS.fallahSmartCover,
    link: "https://github.com/jdidi94/Agro-smart-preview",
    relatedProjectIds: ["fallah-smart"],
  },
  {
    id: "2025-taskflow",
    year: 2025,
    title: "TaskFlow AI",
    description:
      "AI-assisted team task management with workspaces, realtime boards, and admin console.",
    category: "project",
    media: IMAGE_ASSETS.taskflowCover,
    link: "https://github.com/jdidi94/taskflow_preview-",
    relatedProjectIds: ["taskflow-ai"],
  },
  {
    id: "2025-immersive",
    year: 2025,
    title: "Interactive 3D portfolio",
    description: "Neon Portfolio, a cinematic R3F experience as a product-quality showcase.",
    category: "project",
    media: IMAGE_ASSETS.neonPortfolioCover,
    link: "https://github.com/jdidi94/Portfolio-2",
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
