import type { Certificate } from "@shared-types/content";

/** Template certificates — replace with your own credentials. */
export const certificates: readonly Certificate[] = [
  {
    id: "fullstack-cert",
    title: "Full Stack JavaScript Developer",
    issuer: "Example Bootcamp",
    year: 2021,
  },
] as const;
