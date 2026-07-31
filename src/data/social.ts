import type { SocialLink } from "@shared-types/content";
import { profile } from "@data/profile";

export const socialLinks: readonly SocialLink[] = [
  {
    id: "github",
    label: "GitHub",
    url: profile.githubUrl,
    icon: "github",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    url: profile.linkedinUrl,
    icon: "linkedin",
  },
  {
    id: "email",
    label: "Email",
    url: `mailto:${profile.email}`,
    icon: "email",
  },
  {
    id: "resume",
    label: "Resume",
    url: profile.resumeUrl,
    icon: "resume",
  },
] as const;
