import { useEffect, type JSX } from "react";
import { useSceneReadyStore } from "@store/sceneReadyStore";

/**
 * Fires after the full SceneRoot tree has committed —
 * used to dismiss the HTML boot overlay.
 */
export function SceneReadySignal(): JSX.Element | null {
  const markSceneMounted = useSceneReadyStore((s) => s.markSceneMounted);

  useEffect(() => {
    markSceneMounted();
  }, [markSceneMounted]);

  return null;
}
