import type { JSX } from "react";
import { MainCamera } from "@scene/camera/MainCamera";
import { Background } from "@scene/environment/Background";
import { SceneFog } from "@scene/environment/Fog";
import { AmbientParticles } from "@scene/environment/AmbientParticles";
import { Lighting } from "@scene/lighting/Lighting";
import { DecorativeObjects } from "@scene/objects/DecorativeObjects";
import { ContentSections } from "@scene/sections/ContentSections";
import { AboutCharacter } from "@scene/sections/AboutCharacter";
import { ProjectCarousel } from "@scene/sections/ProjectCarousel";
import { ExperienceRow } from "@scene/sections/ExperienceRow";
import { TechHive } from "@scene/sections/TechHive";
import { Elevator } from "@scene/sections/Elevator";
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
      <ContentSections />
      <AboutCharacter />
      <ProjectCarousel />
      <ExperienceRow />
      <TechHive />
      <Elevator />
      <PostProcessing />
    </>
  );
}
