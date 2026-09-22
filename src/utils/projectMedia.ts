import { IMAGE_ASSETS } from "@config/assets";
import type { Project } from "@shared-types/content";

/** Mobile UI stills read better on portrait glass cards than wide covers. */
const PROJECT_FACE_IMAGE_BY_ID: Readonly<Record<string, string>> = {
  "taskflow-ai": IMAGE_ASSETS.taskflowMobile,
  "fallah-smart": IMAGE_ASSETS.fallahSmartMobile,
};

/** Cover / hero still for case-study headers (images[0]). */
export function projectCoverImage(project: Project): string | undefined {
  return project.images[0];
}

/** 3D card face background — prefers `_mobile` when authored. */
export function projectFaceImage(project: Project): string | undefined {
  return PROJECT_FACE_IMAGE_BY_ID[project.id] ?? project.images[0];
}
