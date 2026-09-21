import type { Project } from "@shared-types/content";
import { IMAGE_ASSETS, VIDEO_ASSETS } from "@config/assets";
import { ENV } from "@config/env";

/**
 * Featured projects — Neon Portfolio plus shipped product work.
 * Live demo / GitHub URLs come from `ENV` so they stay easy to change.
 */
export const projects: readonly Project[] = [
  {
    id: "taskflow-ai",
    title: "TaskFlow AI",
    subtitle: "AI-assisted team task management",
    category: "SaaS / Fullstack / AI",
    description:
      "AI-assisted team task management with workspaces, boards, realtime collaboration, and an admin console. AI helps draft boards and summarize context without replacing human judgment.",
    problem:
      "Product and engineering teams need planning, realtime collaboration, and AI assistance in one system, with a calm fallback when the API or database is unavailable.",
    solution:
      "npm workspaces monorepo: React 19 + Vite apps (main + admin), Express/Mongoose/Socket.IO API, Redux Toolkit / RTK Query, shared UI/theme packages, and provider-resolved AI clients with quotas. en / fr / ar with RTL.",
    outcome:
      "Presentation-ready preview with kanban/list/calendar/timeline boards, chat, notifications, templates, GitHub-aware workspace views, and an admin panel for users, AI quotas, analytics, and audit.",
    technologies: [
      "React",
      "Vite",
      "Redux Toolkit",
      "Express",
      "MongoDB",
      "Socket.IO",
      "TypeScript",
      "Tailwind CSS",
    ],
    images: [
      IMAGE_ASSETS.taskflowCover,
      IMAGE_ASSETS.taskflowDashboard,
      IMAGE_ASSETS.taskflowMobile,
      IMAGE_ASSETS.taskflowArchitecture,
    ],
    architectureImage: IMAGE_ASSETS.taskflowArchitecture,
    video: VIDEO_ASSETS.taskflowPreview,
    github: ENV.githubTaskflow,
    liveDemo: ENV.liveDemoTaskflow,
    lessonsLearned:
      "Maintenance screens beat broken UIs when infra is down; seed templates and typed realtime events make demos recruiter-ready without production secrets.",
    duration: "Portfolio preview snapshot",
    role: "Sole engineer / product designer",
    status: "completed",
  },
  {
    id: "fallah-smart",
    title: "Fallah Smart",
    subtitle: "Arabic-first farm operating system",
    category: "Mobile / Fullstack / AgTech",
    description:
      "An Arabic-first digital operating system for farmers in Tunisia and North Africa: mobile farm operations, agricultural guidance, commerce, and administration in one multilingual platform.",
    problem:
      "Small and medium farmers manage inventory, expenses, crop health, market access, and technical knowledge through disconnected tools or paper records, often over unreliable connectivity.",
    solution:
      "Expo React Native mobile + NestJS API + Next.js admin dashboard on PostgreSQL/Prisma, with Socket.IO realtime, RTL Arabic, French/English LTR, and soft-failure behavior for weak rural networks.",
    outcome:
      "A three-app TypeScript platform covering farm stock, wallet (TND), marketplace, crop intelligence, weather, education, community, advisors, and administration, designed for local language and regional agriculture.",
    technologies: [
      "Expo",
      "React Native",
      "NestJS",
      "Next.js",
      "PostgreSQL",
      "Prisma",
      "Socket.IO",
      "TypeScript",
    ],
    images: [
      IMAGE_ASSETS.fallahSmartCover,
      IMAGE_ASSETS.fallahSmartDashboard,
      IMAGE_ASSETS.fallahSmartMobile,
      IMAGE_ASSETS.fallahSmartArchitecture,
    ],
    architectureImage: IMAGE_ASSETS.fallahSmartArchitecture,
    video: VIDEO_ASSETS.fallahSmartPreview,
    github: ENV.githubFallah,
    liveDemo: ENV.liveDemoFallah,
    lessonsLearned:
      "Shared UI kits and unified API contracts keep mobile and admin aligned; soft failure and last-good-data matter more than perfect sync on rural networks.",
    duration: "Product platform",
    role: "Fullstack / product engineer",
    status: "completed",
  },
  {
    id: "neon-portfolio",
    title: "Neon Portfolio",
    subtitle: "Immersive 3D product experience",
    category: "Interactive / Frontend",
    description:
      "A cinematic portfolio where visitors travel through a black-void scene instead of scrolling, built as the showcase itself.",
    problem:
      "Traditional portfolios look interchangeable and rarely prove interaction or systems craft.",
    solution:
      "Camera-driven navigation, holographic cards, and a data-driven content layer that scales without new components.",
    outcome:
      "A recruiter-ready immersive product that demonstrates R3F, GSAP camera work, and typed content architecture.",
    technologies: ["React", "TypeScript", "Three.js", "R3F", "GSAP", "Zustand"],
    images: [
      IMAGE_ASSETS.neonPortfolioCover,
      IMAGE_ASSETS.neonPortfolioArchitecture,
    ],
    architectureImage: IMAGE_ASSETS.neonPortfolioArchitecture,
    video: VIDEO_ASSETS.neonPortfolioPreview,
    github: ENV.githubPortfolio,
    lessonsLearned:
      "Keep animation state out of Zustand; drive content from typed data; treat performance as a feature.",
    duration: "Ongoing",
    role: "Sole engineer / designer",
    status: "in-progress",
  },
  {
    id: "tunisian-fann",
    title: "Tunisian Fann",
    subtitle: "Art marketplace with realtime auctions",
    category: "E-commerce / Fullstack",
    description:
      "E-commerce platform connecting art enthusiasts with artists, including realtime auctions and direct sales.",
    problem:
      "Artists lacked a focused digital marketplace that supported both fixed sales and live bidding.",
    solution:
      "Vue + Vuex storefront with Express/Node backend on DigitalOcean; realtime auction flows and SCRUM delivery.",
    outcome:
      "Shipped a production marketplace with auction and direct-sale paths, backlog prioritization, and GitHub workflow.",
    technologies: ["Vue", "Vuex", "Express", "Node.js", "DigitalOcean"],
    images: [IMAGE_ASSETS.tunisianFannCover, IMAGE_ASSETS.tunisianFannGallery],
    video: VIDEO_ASSETS.tunisianFannPreview,
    github: ENV.githubUrl,
    lessonsLearned:
      "Realtime bidding needs clear state ownership; SCRUM backlog discipline keeps stakeholder goals aligned.",
    duration: "Team project",
    role: "Fullstack engineer",
    status: "completed",
  },
  {
    id: "ticketing-platform",
    title: "Online Ticketing Platform",
    subtitle: "Secure tickets + QR access",
    category: "Platform / DevOps",
    description:
      "Online ticketing with secure purchases and QR authentication for event access.",
    problem:
      "Event access needed a scalable, testable stack for purchase, auth, and entry validation.",
    solution:
      "Next.js + Express + MongoDB microservices with Docker/Kubernetes CI/CD, reusable NPM packages, and cloud deploys.",
    outcome:
      "Architected a deployable microservices ticketing system with QR entry and automated delivery pipelines.",
    technologies: [
      "Next.js",
      "Express",
      "MongoDB",
      "Docker",
      "Kubernetes",
      "CI/CD",
    ],
    images: [
      IMAGE_ASSETS.ticketingCover,
      IMAGE_ASSETS.ticketingArchitecture,
    ],
    architectureImage: IMAGE_ASSETS.ticketingArchitecture,
    video: VIDEO_ASSETS.ticketingPreview,
    github: ENV.githubUrl,
    lessonsLearned:
      "Reusable packages and CI/CD reduce drift across services; test early across purchase and entry flows.",
    duration: "Team project",
    role: "Architect / fullstack engineer",
    status: "completed",
  },
  {
    id: "med-purchase",
    title: "Medication Purchase Interface",
    subtitle: "Mobile ordering + payments",
    category: "Mobile / Fullstack",
    description:
      "Web and mobile interfaces for purchasing medication with order tracking and secure payments.",
    problem:
      "Medication ordering needed role-aware auth, tracking, and a reliable payment path.",
    solution:
      "React Native + Express + MySQL with Socket.io, Sequelize, Flouci payments, and multi-role authentication.",
    outcome:
      "Delivered order tracking, secure payments, and role migration for safer access control.",
    technologies: [
      "React Native",
      "Socket.io",
      "Sequelize",
      "Express",
      "MySQL",
      "Flouci",
    ],
    images: [IMAGE_ASSETS.medPurchaseCover],
    github: ENV.githubUrl,
    lessonsLearned:
      "Payment and role boundaries must be explicit; realtime status improves trust in order flows.",
    duration: "Product engagement",
    role: "Fullstack / mobile engineer",
    status: "completed",
  },
] as const;
