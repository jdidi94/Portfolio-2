import type { Vector3Tuple } from "three";

export interface WaypointConfig {
  id: string;
  label: string;
  position: Vector3Tuple;
  cameraPosition: Vector3Tuple;
  lookAt: Vector3Tuple;
}

export const WAYPOINTS: readonly WaypointConfig[] = [
  {
    id: "origin",
    label: "Origin",
    position: [0, 0, 0],
    cameraPosition: [0, 1.2, 8],
    lookAt: [0, 0, 0],
  },
  {
    id: "alpha",
    label: "Alpha",
    position: [-4.5, 0.4, -2],
    cameraPosition: [-3.2, 1.4, 3.5],
    lookAt: [-4.5, 0.4, -2],
  },
  {
    id: "beta",
    label: "Beta",
    position: [4.2, -0.2, -1.5],
    cameraPosition: [3.0, 1.1, 3.8],
    lookAt: [4.2, -0.2, -1.5],
  },
  {
    id: "gamma",
    label: "Gamma",
    position: [0.5, 1.2, -5.5],
    cameraPosition: [0.2, 1.8, -1.2],
    lookAt: [0.5, 1.2, -5.5],
  },
] as const;

export const EXPLORE_WAYPOINT_ID = "origin";
