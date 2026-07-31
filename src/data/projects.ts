import type { Project } from "@shared-types/content";
import { IMAGE_ASSETS, VIDEO_ASSETS } from "@config/assets";

/**
 * Featured projects from resume + this portfolio.
 * Image/video paths are Unsplash / sample placeholders — replace with real media.
 */
export const projects: readonly Project[] = [
  {
    id: "neon-portfolio",
    title: "Neon Portfolio",
    subtitle: "Immersive 3D product experience",
    category: "Interactive / Frontend",
    description:
      "A cinematic portfolio where visitors travel through a black-void scene instead of scrolling — built as the showcase itself.",
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
    github: "https://github.com/jdidi94/Portfolio-2",
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
      "E-commerce platform connecting art enthusiasts with artists — including realtime auctions and direct sales.",
    problem:
      "Artists lacked a focused digital marketplace that supported both fixed sales and live bidding.",
    solution:
      "Vue + Vuex storefront with Express/Node backend on DigitalOcean; realtime auction flows and SCRUM delivery.",
    outcome:
      "Shipped a production marketplace with auction and direct-sale paths, backlog prioritization, and GitHub workflow.",
    technologies: ["Vue", "Vuex", "Express", "Node.js", "DigitalOcean"],
    images: [IMAGE_ASSETS.tunisianFannCover, IMAGE_ASSETS.tunisianFannGallery],
    video: VIDEO_ASSETS.tunisianFannPreview,
    github: "https://github.com/jdidi94",
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
    github: "https://github.com/jdidi94",
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
    github: "https://github.com/jdidi94",
    lessonsLearned:
      "Payment and role boundaries must be explicit; realtime status improves trust in order flows.",
    duration: "Product engagement",
    role: "Fullstack / mobile engineer",
    status: "completed",
  },
] as const;
