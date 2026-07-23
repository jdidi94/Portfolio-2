import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { FogExp2 } from "three";
import { FOG_CONFIG } from "@config/fog";

export function SceneFog(): null {
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    const previous = scene.fog;
    scene.fog = new FogExp2(FOG_CONFIG.color, FOG_CONFIG.density);

    return () => {
      scene.fog = previous;
    };
  }, [scene]);

  return null;
}
