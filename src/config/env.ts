/**
 * Changeable public URLs — override via Vite env (`VITE_*` in `.env`).
 * Defaults keep local/dev usable without a local env file.
 */
function readEnv(key: string, fallback: string): string {
  const value = import.meta.env[key];
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : fallback;
}

export const ENV = {
  email: readEnv("VITE_EMAIL", "daoud.jdidi@rbk.tn"),
  githubUrl: readEnv("VITE_GITHUB_URL", "https://github.com/jdidi94"),
  linkedinUrl: readEnv(
    "VITE_LINKEDIN_URL",
    "https://www.linkedin.com/in/jdidi-daoud-663584125",
  ),
  resumeUrl: readEnv("VITE_RESUME_URL", "/documents/resume/resume.pdf"),
  liveDemoTaskflow: readEnv(
    "VITE_LIVE_DEMO_TASKFLOW",
    "https://task-flow-main-three.vercel.app/",
  ),
  liveDemoFallah: readEnv(
    "VITE_LIVE_DEMO_FALLAH",
    "https://expo.dev/accounts/jdidi94/projects/fallahsmart/builds/2dd458de-4579-4a63-a5b2-e738fb1bc00e",
  ),
  githubTaskflow: readEnv(
    "VITE_GITHUB_TASKFLOW",
    "https://github.com/jdidi94/taskflow_preview-",
  ),
  githubFallah: readEnv(
    "VITE_GITHUB_FALLAH",
    "https://github.com/jdidi94/Agro-smart-preview",
  ),
  githubPortfolio: readEnv(
    "VITE_GITHUB_PORTFOLIO",
    "https://github.com/jdidi94/Portfolio-2",
  ),
  /** Public origin for Open Graph / share links (no trailing slash). */
  siteUrl: readEnv(
    "VITE_SITE_URL",
    "https://portfolio-2-chi-beige.vercel.app",
  ),
  /** Optional @handle for Twitter cards. */
  twitterHandle: readEnv("VITE_TWITTER_HANDLE", ""),
} as const;

export type EnvConfig = typeof ENV;
