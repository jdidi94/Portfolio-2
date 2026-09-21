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
import { SceneReadySignal } from "@scene/SceneReadySignal";
import { SectionDistanceGate } from "@scene/SectionDistanceGate";
import { CORRIDOR_LAYOUT } from "@config/corridor";

/**
 * Full experience scene — sections mount together so the visitor never
 * sees an empty corridor while lazy chunks stream in.
 * Distance gates skip draw calls for far bands (still mounted).
 */
export function SceneRoot(): JSX.Element {
  const { sectionZ } = CORRIDOR_LAYOUT;

  return (
    <>
      <Background />
      <SceneFog />
      <MainCamera />
      <Lighting />
      <AmbientParticles />
      <DecorativeObjects />
      <ContentSections />
      <SectionDistanceGate centerZ={sectionZ.about}>
        <AboutCharacter />
      </SectionDistanceGate>
      <SectionDistanceGate centerZ={sectionZ.projects}>
        <ProjectCarousel />
      </SectionDistanceGate>
      <SectionDistanceGate centerZ={sectionZ.experience}>
        <ExperienceRow />
      </SectionDistanceGate>
      <SectionDistanceGate centerZ={sectionZ.skills}>
        <TechHive />
      </SectionDistanceGate>
      <SectionDistanceGate centerZ={sectionZ.timeline}>
        <Elevator />
      </SectionDistanceGate>
      <PostProcessing />
      <SceneReadySignal />
    </>
  );
}
