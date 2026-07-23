import type { JSX } from "react";
import { COLORS } from "@config/colors";
import { WAYPOINTS } from "@config/waypoints";
import { PlaceholderOrb } from "@scene/objects/PlaceholderOrb";

const ORB_COLORS = [
  COLORS.electricBlue,
  COLORS.cyan,
  COLORS.purple,
] as const;

export function PlaceholderObjects(): JSX.Element {
  const focusable = WAYPOINTS.filter((wp) => wp.id !== "origin");

  return (
    <group>
      {focusable.map((waypoint, index) => (
        <PlaceholderOrb
          key={waypoint.id}
          waypoint={waypoint}
          color={ORB_COLORS[index % ORB_COLORS.length]}
          phase={index * 1.7}
        />
      ))}
    </group>
  );
}
