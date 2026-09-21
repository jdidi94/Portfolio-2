import type { JSX } from "react";
import { useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { PERFORMANCE_CONFIG } from "@config/performance";
import { RENDERER_CONFIG } from "@config/renderer";
import { resolveEffectiveDprMax } from "@config/performance";
import { usePerformanceStore } from "@store/performanceStore";
import { useViewportStore } from "@store/viewportStore";

/**
 * Samples frame timing and scales DPR + quality profile under load.
 */
export function AdaptiveQuality(): JSX.Element {
  const setDpr = useThree((s) => s.setDpr);
  const tierDprMax = useViewportStore((s) => s.dprMax);
  const setFactor = usePerformanceStore((s) => s.setFactor);
  const markFallback = usePerformanceStore((s) => s.markFallback);
  const { monitor } = PERFORMANCE_CONFIG;

  return (
    <PerformanceMonitor
      factor={1}
      iterations={monitor.iterations}
      ms={monitor.ms}
      threshold={monitor.threshold}
      step={monitor.step}
      flipflops={monitor.flipflops}
      bounds={monitor.bounds}
      onChange={({ factor }) => {
        setFactor(factor);
        const quality = PERFORMANCE_CONFIG.qualityFromFactor(factor);
        const max = resolveEffectiveDprMax(tierDprMax, quality);
        setDpr([RENDERER_CONFIG.dprMin, max]);
      }}
      onFallback={() => {
        markFallback();
        setDpr(RENDERER_CONFIG.dprMin);
      }}
    />
  );
}
