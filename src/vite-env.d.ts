/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EMAIL?: string;
  readonly VITE_GITHUB_URL?: string;
  readonly VITE_LINKEDIN_URL?: string;
  readonly VITE_RESUME_URL?: string;
  readonly VITE_LIVE_DEMO_TASKFLOW?: string;
  readonly VITE_LIVE_DEMO_FALLAH?: string;
  readonly VITE_GITHUB_TASKFLOW?: string;
  readonly VITE_GITHUB_FALLAH?: string;
  readonly VITE_GITHUB_PORTFOLIO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.glb" {
  const src: string;
  export default src;
}

declare module "*.glb?url" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}
