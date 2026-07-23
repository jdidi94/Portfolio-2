export type NavigationMode = "explore" | "focus" | "transition";

export type ExperienceSection =
  | "hero"
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "timeline"
  | "contact"
  | "none";

export interface ExperienceState {
  mode: NavigationMode;
  activeSection: ExperienceSection;
  focusObjectId: string | null;
  cameraDestinationId: string;
  hoveredObjectId: string | null;
  isAudioEnabled: boolean;
  prefersReducedMotion: boolean;
}
