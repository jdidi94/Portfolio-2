import type { JSX, ChangeEvent } from "react";
import {
  useTechHiveLayoutStore,
  useTechHiveLayoutParams,
} from "@store/techHiveLayoutStore";
import { useViewportStore } from "@store/viewportStore";

interface NumberRowProps {
  label: string;
  value: number;
  step: number;
  onChange: (value: number) => void;
  softMin?: number;
  softMax?: number;
}

function NumberRow({
  label,
  value,
  step,
  onChange,
  softMin = 0,
  softMax = 5,
}: NumberRowProps): JSX.Element {
  const sliderMin = softMin;
  const sliderMax = Math.max(softMax, softMin + step);
  const sliderValue = Math.min(sliderMax, Math.max(sliderMin, value));

  return (
    <label className="flex flex-col gap-1 text-[11px] text-white/70">
      <span className="flex items-center justify-between gap-2">
        <span>{label}</span>
        <input
          type="number"
          step={step}
          value={Number.isFinite(value) ? value : 0}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const next = Number(event.target.value);
            if (Number.isFinite(next)) {
              onChange(next);
            }
          }}
          className="w-[5.5rem] rounded border border-white/15 bg-black/60 px-1.5 py-0.5 text-right font-mono text-[11px] text-cyan-100"
        />
      </span>
      <input
        type="range"
        min={sliderMin}
        max={sliderMax}
        step={step}
        value={sliderValue}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange(Number(event.target.value));
        }}
        className="w-full accent-cyan-400"
      />
    </label>
  );
}

/**
 * Dev panel — Technology Hive spacing, scale, and camera knobs.
 * Children orbit the parent; only relevant params are shown.
 */
export function TechHiveLayoutTuningPanel(): JSX.Element {
  const params = useTechHiveLayoutParams();
  const panelOpen = useTechHiveLayoutStore((s) => s.panelOpen);
  const setParam = useTechHiveLayoutStore((s) => s.setParam);
  const setPanelOpen = useTechHiveLayoutStore((s) => s.setPanelOpen);
  const reset = useTechHiveLayoutStore((s) => s.reset);
  const logMeasures = useTechHiveLayoutStore((s) => s.logMeasures);
  const tier = useViewportStore((s) => s.tier);
  const isCompact = tier !== "desktop";

  if (!panelOpen) {
    return (
      <button
        type="button"
        onClick={() => {
          setPanelOpen(true);
        }}
        className={`pointer-events-auto absolute z-30 rounded border border-cyan-400/30 bg-black/70 px-3 py-1.5 text-xs text-cyan-100 backdrop-blur-sm transition hover:border-cyan-400/50 ${
          isCompact
            ? "left-[max(0.75rem,env(safe-area-inset-left))] bottom-[max(4rem,calc(env(safe-area-inset-bottom)+3.5rem))]"
            : "top-20 left-4"
        }`}
      >
        Tech hive layout
      </button>
    );
  }

  return (
    <aside
      className={`pointer-events-auto absolute z-30 overflow-y-auto rounded-md border border-cyan-400/25 bg-black/80 p-3 text-white shadow-[0_0_24px_rgba(34,211,238,0.12)] backdrop-blur-md ${
        isCompact
          ? "left-[max(0.75rem,env(safe-area-inset-left))] right-[max(0.75rem,env(safe-area-inset-right))] bottom-[max(0.75rem,env(safe-area-inset-bottom))] max-h-[min(52dvh,420px)] w-auto"
          : "top-20 left-4 max-h-[min(78dvh,640px)] w-[min(100%,300px)]"
      }`}
      aria-label="Technology hive layout tuning"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs tracking-wide text-cyan-100/90 uppercase">
          Tech hive layout
        </p>
        <button
          type="button"
          onClick={() => {
            setPanelOpen(false);
          }}
          className="rounded border border-white/15 px-2 py-0.5 text-[10px] text-white/60 hover:border-white/30"
        >
          Hide
        </button>
      </div>

      <div className="space-y-3">
        <p className="text-[10px] text-white/40 uppercase tracking-wide">
          Parent
        </p>
        <NumberRow
          label="Parent scale"
          value={params.parentScale}
          step={0.1}
          softMin={0.5}
          softMax={8}
          onChange={(value) => setParam("parentScale", value)}
        />

        <p className="text-[10px] text-white/40 uppercase tracking-wide pt-1">
          Children
        </p>
        <NumberRow
          label="Child spacing"
          value={params.childSpacing}
          step={0.05}
          softMin={-1}
          softMax={4}
          onChange={(value) => setParam("childSpacing", value)}
        />
        <NumberRow
          label="Child margin"
          value={params.childMargin}
          step={0.02}
          softMin={-0.5}
          softMax={1.5}
          onChange={(value) => setParam("childMargin", value)}
        />
        <NumberRow
          label="Child model scale"
          value={params.childModelScale}
          step={0.05}
          softMin={0.4}
          softMax={3}
          onChange={(value) => setParam("childModelScale", value)}
        />
        <NumberRow
          label="Cluster rotation Z (rad)"
          value={params.clusterRotationZ}
          step={0.05}
          softMin={-3.14}
          softMax={3.14}
          onChange={(value) => setParam("clusterRotationZ", value)}
        />

        <p className="text-[10px] text-white/40 uppercase tracking-wide pt-1">
          Camera
        </p>
        <NumberRow
          label="Camera distance"
          value={params.cameraDistance}
          step={0.1}
          softMin={4}
          softMax={20}
          onChange={(value) => setParam("cameraDistance", value)}
        />
        <NumberRow
          label="Camera eye height"
          value={params.cameraEyeHeight}
          step={0.05}
          softMin={-2}
          softMax={3}
          onChange={(value) => setParam("cameraEyeHeight", value)}
        />
        <NumberRow
          label="Cell camera distance"
          value={params.cellCameraDistance}
          step={0.1}
          softMin={2}
          softMax={10}
          onChange={(value) => setParam("cellCameraDistance", value)}
        />

        <p className="text-[10px] text-white/40 uppercase tracking-wide pt-1">
          Count
        </p>
        <NumberRow
          label="Visible desktop"
          value={params.visibleCountDesktop}
          step={1}
          softMin={1}
          softMax={37}
          onChange={(value) =>
            setParam("visibleCountDesktop", Math.round(value))
          }
        />
        <NumberRow
          label="Visible mid"
          value={params.visibleCountMid}
          step={1}
          softMin={1}
          softMax={19}
          onChange={(value) => setParam("visibleCountMid", Math.round(value))}
        />

        <p className="text-[10px] text-white/40 uppercase tracking-wide pt-1">
          Motion
        </p>
        <NumberRow
          label="Float amplitude"
          value={params.floatAmplitude}
          step={0.005}
          softMin={0}
          softMax={0.2}
          onChange={(value) => setParam("floatAmplitude", value)}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={logMeasures}
          className="rounded border border-cyan-400/35 bg-cyan-500/15 px-2.5 py-1 text-[11px] text-cyan-100 hover:border-cyan-300/50"
        >
          Log measures
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded border border-white/15 px-2.5 py-1 text-[11px] text-white/70 hover:border-white/30"
        >
          Reset
        </button>
      </div>
      <p className="mt-2 text-[10px] leading-relaxed text-white/40">
        Log measures prints JSON to the console for paste-back into defaults.
      </p>
    </aside>
  );
}
