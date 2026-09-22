import { ENV } from "@config/env";
import { profile } from "@data/profile";

/**
 * Search / social preview metadata.
 * `ogImagePath` is served from `public/` so crawlers resolve it without JS.
 */
export const SEO_CONFIG = {
  siteName: `${profile.name} · Neon Portfolio`,
  title: `${profile.name} | ${profile.title}`,
  description: profile.introduction,
  /** Absolute site origin (no trailing slash). Override via VITE_SITE_URL. */
  siteUrl: ENV.siteUrl,
  /**
   * Public OG image (JPEG 1200×630). WhatsApp / Facebook / LinkedIn
   * prefer JPEG over WebP for link previews.
   */
  ogImagePath: "/og/portrait.jpg",
  ogImageType: "image/jpeg",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: `${profile.name}, ${profile.title}`,
  twitterHandle: ENV.twitterHandle,
  locale: "en_US",
  keywords: [
    profile.name,
    profile.title,
    "React",
    "React Native",
    "Node.js",
    "Three.js",
    "portfolio",
    "fullstack",
    "Tunisia",
  ],
} as const;

export function absoluteSeoUrl(path: string): string {
  const base = SEO_CONFIG.siteUrl.replace(/\/$/, "");
  if (!path) return base;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function linkedInShareUrl(pageUrl: string = SEO_CONFIG.siteUrl): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
}

export function twitterShareUrl(
  pageUrl: string = SEO_CONFIG.siteUrl,
  text: string = `${profile.name} · ${profile.title}`,
): string {
  return `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(text)}`;
}
