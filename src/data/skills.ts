import type { Skill } from "@shared-types/content";

/** Skills demonstrated through projects — no star/percentage ratings. */
export const skills: readonly Skill[] = [
  {
    id: "react",
    name: "React",
    category: "frontend",
    icon: "react",
    yearsOfExperience: 4,
    description: "Component systems, hooks, and performance-aware UI for web products.",
    relatedProjectIds: ["neon-portfolio", "med-purchase"],
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "frontend",
    icon: "typescript",
    yearsOfExperience: 4,
    description: "Strict typing across apps, APIs, and shared domain models.",
    relatedProjectIds: ["neon-portfolio", "ticketing-platform"],
  },
  {
    id: "threejs",
    name: "Three.js / R3F",
    category: "3d",
    icon: "threejs",
    yearsOfExperience: 2,
    description: "Interactive 3D scenes, materials, and cinematic camera work.",
    relatedProjectIds: ["neon-portfolio"],
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "backend",
    icon: "nodejs",
    yearsOfExperience: 3,
    description: "APIs, gateways, realtime services, and production backends.",
    relatedProjectIds: ["tunisian-fann", "ticketing-platform", "med-purchase"],
  },
  {
    id: "react-native",
    name: "React Native",
    category: "frontend",
    icon: "react",
    yearsOfExperience: 3,
    description: "Cross-platform mobile apps with shared product logic.",
    relatedProjectIds: ["med-purchase"],
  },
  {
    id: "devops",
    name: "Docker / Kubernetes",
    category: "devops",
    icon: "docker",
    yearsOfExperience: 2,
    description: "Containerized services, CI/CD, and cloud-ready deploys.",
    relatedProjectIds: ["ticketing-platform"],
  },
] as const;
