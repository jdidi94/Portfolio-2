import type { JSX } from "react";
import { Suspense } from "react";
import {
  DECOR_MODEL_URL,
  ENVIRONMENT_CONFIG,
  type DecorItemConfig,
} from "@config/environment";
import { Float } from "@scene/objects/Float";
import { GlbProp, preloadModel } from "@scene/objects/GlbProp";

// Only warm decor GLBs — card / traveler models load with their sections.
const decorUrls = new Set(Object.values(DECOR_MODEL_URL));
decorUrls.forEach((url) => {
  preloadModel(url);
});

function DecorItem({ item }: { item: DecorItemConfig }): JSX.Element {
  return (
    <group position={item.position}>
      <Float phase={item.phase} amplitude={0.12} speed={0.35} rotationSpeed={0.08}>
        <GlbProp
          url={DECOR_MODEL_URL[item.kind]}
          color={item.color}
          scale={item.scale}
          rotation={item.rotation}
          preset={item.preset}
          mapKey={item.mapKey}
        />
      </Float>
    </group>
  );
}

export function DecorativeObjects(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <group>
        {ENVIRONMENT_CONFIG.decor.map((item) => (
          <DecorItem key={item.id} item={item} />
        ))}
      </group>
    </Suspense>
  );
}
