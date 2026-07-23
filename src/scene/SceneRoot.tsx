import type { JSX } from "react";
import { MainCamera } from "@scene/camera/MainCamera";
import { Background } from "@scene/environment/Background";
import { SceneFog } from "@scene/environment/Fog";
import { AmbientParticles } from "@scene/environment/AmbientParticles";
import { Lighting } from "@scene/lighting/Lighting";
import { DecorativeObjects } from "@scene/objects/DecorativeObjects";
import { PlaceholderObjects } from "@scene/objects/PlaceholderObjects";
import { PostProcessing } from "@renderer/PostProcessing";

export function SceneRoot(): JSX.Element {
  return (
    <>
      <Background />
      <SceneFog />
      <MainCamera />
      <Lighting />
      <AmbientParticles />
      <DecorativeObjects />
      <PlaceholderObjects />
      <PostProcessing />
    </>
  );
}
