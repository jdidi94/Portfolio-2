/** Aligns with Technology Hive legend (shape / model / color). */
export type TechnologyCategory =
  | "frontend"
  | "backend"
  | "database"
  | "devops"
  | "design"
  | "ai_ml";

export interface Technology {
  id: string;
  name: string;
  category: TechnologyCategory;
  description: string;
  yearsOfExperience: number;
  relatedProjectIds: readonly string[];
  /** Official or reference docs. */
  docsUrl?: string;
  /** Short mark drawn on hover / panel (SVG key or glyph). */
  icon: string;
}

export interface Profile {
  id: string;
  name: string;
  title: string;
  introduction: string;
  /** Concise about / background for storytelling cards. */
  about: string;
  philosophy: string;
  education: string;
  goals: string;
  callToAction: string;
  location: string;
  availability: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  resumeUrl: string;
  portraitUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  problem: string;
  solution: string;
  outcome: string;
  technologies: readonly string[];
  /** Cover first; gallery / architecture follow. */
  images: readonly string[];
  architectureImage?: string;
  video?: string;
  github?: string;
  liveDemo?: string;
  lessonsLearned: string;
  duration: string;
  role: string;
  status: "completed" | "in-progress" | "archived";
}

export type SkillCategory =
  | "frontend"
  | "backend"
  | "3d"
  | "databases"
  | "cloud"
  | "devops"
  | "design"
  | "tools"
  | "other";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  icon: string;
  yearsOfExperience: number;
  description: string;
  relatedProjectIds: readonly string[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  employmentType: "full-time" | "contract" | "freelance" | "internship" | "education";
  location: string;
  startDate: string;
  endDate: string | null;
  responsibilities: readonly string[];
  technologies: readonly string[];
  achievements: readonly string[];
}

export interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  description: string;
  category: "career" | "education" | "project" | "life" | "goal";
  media?: string;
  link?: string;
  relatedProjectIds?: readonly string[];
  relatedCertificateIds?: readonly string[];
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon: "github" | "linkedin" | "email" | "resume" | "website";
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  year: number;
  credentialUrl?: string;
  image?: string;
}

export type ContentCardVariant =
  | "hero"
  | "project"
  | "skill"
  | "experience"
  | "timeline"
  | "contact"
  | "certificate";

export type ContentCardKind = ContentCardVariant;

/** Focus registry kinds — includes section-only entries like About. */
export type ContentFocusKind = ContentCardKind | "about";

export interface ContentFocusTarget {
  objectId: string;
  section: import("@experience/ExperienceState").ExperienceSection;
  label: string;
  kind: ContentFocusKind;
  contentId: string;
}
