import type { Profile } from "@shared-types/content";
import { IMAGE_ASSETS } from "@config/assets";

/**
 * Template profile — replace with your own details before shipping.
 * No real personal identity is stored here.
 */
export const profile: Profile = {
  id: "profile",
  name: "Alex Morgan",
  title: "Fullstack Software Engineer",
  introduction:
    "Fullstack Software Engineer with several years building scalable web and mobile products — React, Node.js, and realtime systems. Product-minded, focused on architecture, mentoring, and shipping systems that create real business value.",
  about:
    "Based remotely. I design and deliver fullstack products end to end — from architecture and mentoring to production performance. Strong in React, React Native, Node.js, and Socket.io realtime systems.",
  philosophy:
    "Build for clarity and maintainability. Prefer simple systems that scale. Mentorship and code review are part of shipping — not extras.",
  education:
    "Full Stack JavaScript Immersive — Example Bootcamp (2020–2021). Bachelor of Science — Example University.",
  goals:
    "Interactive product experiences, creative engineering, and AI-assisted 3D web systems that feel calm, premium, and useful.",
  callToAction: "Explore featured work · Download resume",
  location: "Remote · Open worldwide",
  availability: "Open to remote opportunities",
  email: "hello@example.com",
  githubUrl: "https://github.com/example",
  linkedinUrl: "https://www.linkedin.com/in/example",
  resumeUrl: "/documents/resume/resume.pdf",
  portraitUrl: IMAGE_ASSETS.portrait,
};
