export type InteractionEventType = "hover" | "unhover" | "select";

export interface InteractionEvent {
  type: InteractionEventType;
  objectId: string;
}

export type InteractionListener = (event: InteractionEvent) => void;
