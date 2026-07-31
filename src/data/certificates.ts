import type { Certificate } from "@shared-types/content";

export const certificates: readonly Certificate[] = [
  {
    id: "rbk-fullstack",
    title: "Full Stack JavaScript Developer",
    issuer: "RBK RebootKamp / Hack Reactor",
    year: 2021,
  },
] as const;
