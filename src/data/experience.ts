import type { Experience } from "@shared-types/content";
import { IMAGE_ASSETS } from "@config/assets";

/**
 * Template experience — replace companies, dates, and copy with your own.
 */
export const experience: readonly Experience[] = [
  {
    id: "freelance-product-apps",
    company: "Independent / client product work",
    position: "Fullstack Product Engineer",
    employmentType: "freelance",
    location: "Remote",
    startDate: "2021-04",
    endDate: "2022-10",
    responsibilities: [
      "Designed and shipped fullstack client products end to end — UX flows, APIs, and production deploys",
      "Built ecommerce and marketplace features including realtime auctions and direct sales",
      "Owned delivery rhythm with SCRUM, GitHub workflow, and stakeholder backlog prioritization",
      "Integrated payments and role-based auth for multi-actor product surfaces",
    ],
    technologies: [
      "Vue",
      "Vuex",
      "Express",
      "Node.js",
      "React Native",
      "Socket.io",
      "MySQL",
      "DigitalOcean",
    ],
    achievements: [
      "Delivered production marketplaces and mobile purchase flows used by real customers",
      "Established clean modular patterns that kept client products maintainable after handoff",
    ],
  },
  {
    id: "freelance-platform-systems",
    company: "Independent / platform engagements",
    position: "Platform Engineer",
    employmentType: "freelance",
    location: "Remote",
    startDate: "2021-06",
    endDate: "2022-10",
    responsibilities: [
      "Architected scalable platform backends for ticketing, auth, and realtime access flows",
      "Built microservices-oriented stacks with Docker, Kubernetes, and CI/CD delivery",
      "Implemented secure purchase paths and QR-based event authentication",
      "Created reusable Node packages and testing practices to keep services reliable",
    ],
    technologies: [
      "Next.js",
      "Express",
      "MongoDB",
      "Docker",
      "Kubernetes",
      "CI/CD",
      "Socket.io",
    ],
    achievements: [
      "Shipped deployable microservices platforms with QR entry and automated delivery",
      "Raised maintainability across services through reusable packages and test coverage",
    ],
  },
  {
    id: "studio-fullstack-lead",
    company: "Example Product Studio",
    position: "Fullstack Software Engineer (Team Lead & Mentor)",
    employmentType: "full-time",
    location: "Remote",
    startDate: "2022-11",
    endDate: "2025-10",
    responsibilities: [
      "Designed and developed fullstack web and mobile apps with React, React Native, Node.js, and SQL/NoSQL databases",
      "Led architectural decisions for scalability and maintainability",
      "Implemented realtime systems (notifications, messaging) with Socket.io",
      "Conducted code reviews and enforced clean, modular, performance-aware practices",
      "Mentored developers on debugging and system design",
      "Collaborated in Agile/Scrum with cross-functional teams",
    ],
    technologies: [
      "React",
      "React Native",
      "Node.js",
      "Socket.io",
      "SQL",
      "NoSQL",
    ],
    achievements: [
      "Shipped production systems with strong performance and maintainability",
      "Grew team capability through mentoring and review culture",
    ],
  },
] as const;

/** Cover images for experience overview cards (reuse project stills as atmosphere). */
export const EXPERIENCE_COVER_BY_ID: Record<string, string> = {
  "freelance-product-apps": IMAGE_ASSETS.tunisianFannCover,
  "freelance-platform-systems": IMAGE_ASSETS.ticketingCover,
  "studio-fullstack-lead": IMAGE_ASSETS.neonPortfolioCover,
};
