# Neon Portfolio (content template)

Immersive 3D portfolio experience (React · R3F · GSAP · Zustand).

This branch ships **dummy placeholder content** so you can fork and replace it with your own identity. Edit files under `src/data/` (start with `profile.ts`).

## Docs

See [documentation/README.md](documentation/README.md).

## Develop

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

Controls: click an orb to travel · click empty space or Esc to explore · ← → cycle · M toggles audio (no audio files yet — safe no-op).

## Customize content

1. Replace `src/data/profile.ts` with your name, links, and bio.
2. Update `experience.ts`, `projects.ts`, `timeline.ts`, `certificates.ts`, `skills.ts`, and `technologies.ts`.
3. Drop your real CV at `public/documents/resume/resume.pdf`.
4. Swap portrait / project media via `src/config/assets.ts`.

## Build

```bash
npm run build
npm run preview
```
