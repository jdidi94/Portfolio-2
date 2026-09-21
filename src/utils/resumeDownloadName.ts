import { profile } from "@data/profile";

/** Safe download filename derived from profile name (e.g. Jdidi_Daoud_Resume.pdf). */
export function getResumeDownloadName(): string {
  const slug = profile.name.trim().replace(/\s+/g, "_").replace(/[^\w.-]/g, "");
  return `${slug || "Resume"}_Resume.pdf`;
}
