import type { Profile } from "@shared-types/content";
import { IMAGE_ASSETS } from "@config/assets";

/**
 * Profile sourced from Jdidii_daoud_en.pdf + LinkedIn
 * (https://www.linkedin.com/in/jdidi-daoud-663584125).
 */
export const profile: Profile = {
  id: "profile",
  name: "Jdidi Daoud",
  title: "Fullstack Software Engineer",
  introduction:
    "Fullstack Software Engineer with 3+ years building scalable web and mobile apps — React, React Native, Node.js, and real-time systems. Product-minded, with a focus on architecture, mentoring, and shipping systems that create real business value.",
  about:
    "Based in Ariana, Tunisia. I design and deliver fullstack products end to end — from architecture and mentoring to production performance. Strong in React, React Native, Node.js, and Socket.io realtime systems.",
  philosophy:
    "Build for clarity and maintainability. Prefer simple systems that scale. Mentorship and code review are part of shipping — not extras.",
  education:
    "Full Stack JavaScript Developer — RBK RebootKamp / Hack Reactor (2020–2021). Degree in Chemistry — University of Science of Monastir (FSM).",
  goals:
    "Interactive product experiences, creative engineering, and AI-assisted 3D web systems that feel calm, premium, and useful.",
  callToAction: "Explore featured work · Download resume",
  location: "Ariana, Tunisia · Open to remote",
  availability: "Open to remote opportunities",
  email: "daoud.jdidi@rbk.tn",
  githubUrl: "https://github.com/jdidi94",
  linkedinUrl: "https://www.linkedin.com/in/jdidi-daoud-663584125",
  resumeUrl: "/documents/resume/resume.pdf",
  portraitUrl: IMAGE_ASSETS.portrait,
};
