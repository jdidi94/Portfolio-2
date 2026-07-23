import { ExperienceManager } from "@experience/ExperienceManager";
import type {
  InteractionEvent,
  InteractionListener,
} from "@interaction/Events";

const listeners = new Set<InteractionListener>();

export const InteractionManager = {
  subscribe(listener: InteractionListener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  emit(event: InteractionEvent): void {
    listeners.forEach((listener) => {
      listener(event);
    });
  },

  onHover(objectId: string): void {
    ExperienceManager.setHover(objectId);
    InteractionManager.emit({ type: "hover", objectId });
  },

  onUnhover(objectId: string): void {
    ExperienceManager.setHover(null);
    InteractionManager.emit({ type: "unhover", objectId });
  },

  onSelect(objectId: string): void {
    ExperienceManager.focusObject(objectId);
    InteractionManager.emit({ type: "select", objectId });
  },
} as const;
