import type { JSX, ChangeEvent } from "react";
import {
  useProjectFaceTuningStore,
  useProjectTuningParams,
} from "@store/projectFaceTuningStore";
import { useViewportStore } from "@store/viewportStore";
import {
  PROJECT_PLACEHOLDER_BOUNDS,
  resolveProjectFaceLayout,
} from "@config/projectFaceTuning";
import type { CardFaceShape } from "@config/cardGeometry";

const SHAPES: readonly CardFaceShape[] = [
  "roundedRect",
  "hexagon",
  "ellipse",
];

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
          className="w-[5.5rem] rounded border border-white/15 bg-black/60 px-1.5 py-0.5 text-right font-mono text-[11px] text-blue-100"
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
        className="w-full accent-blue-400"
      />
    </label>
  );
}

/**
 * Dev panel — project cards only (`glass_card_base`).
 * Full fit params + log dump so values can be baked into config.
 */
export function ProjectFaceTuningPanel(): JSX.Element {
  const params = useProjectTuningParams();
  const panelOpen = useProjectFaceTuningStore((s) => s.panelOpen);
  const setParam = useProjectFaceTuningStore((s) => s.setParam);
  const setPanelOpen = useProjectFaceTuningStore((s) => s.setPanelOpen);
  const reset = useProjectFaceTuningStore((s) => s.reset);
  const logMeasures = useProjectFaceTuningStore((s) => s.logMeasures);
  const layout = resolveProjectFaceLayout(params);
  const bounds = PROJECT_PLACEHOLDER_BOUNDS;
  const isCompact = useViewportStore((s) => s.tier) !== "desktop";

  if (!panelOpen) {
    return (
      <button
        type="button"
        onClick={() => {
          setPanelOpen(true);
        }}
        className={`pointer-events-auto absolute z-30 rounded border border-blue-400/40 bg-black/75 px-3 py-1.5 text-xs text-blue-100 backdrop-blur-sm transition hover:border-blue-300 ${
          isCompact
            ? "left-[max(0.75rem,env(safe-area-inset-left))] bottom-[max(4rem,calc(env(safe-area-inset-bottom)+3.5rem))]"
            : "top-20 right-[19.5rem]"
        }`}
      >
        Project fit panel
      </button>
    );
  }

  return (
    <aside
      className={`pointer-events-auto absolute z-30 overflow-y-auto rounded-md border border-blue-400/30 bg-black/85 p-3 text-white shadow-[0_0_24px_rgba(59,130,246,0.15)] backdrop-blur-md ${
        isCompact
          ? "left-[max(0.75rem,env(safe-area-inset-left))] right-[max(0.75rem,env(safe-area-inset-right))] bottom-[max(0.75rem,env(safe-area-inset-bottom))] max-h-[min(52dvh,420px)] w-auto"
          : "top-20 right-[19.5rem] max-h-[min(78dvh,640px)] w-[min(100%,300px)]"
      }`}
      aria-label="Project face tuning"
    >
      <header className="mb-3 flex items-start justify-between gap-2 border-b border-white/10 pb-2">
        <div>
          <p className="text-[10px] tracking-[0.25em] text-blue-300/80 uppercase">
            Project section only
          </p>
          <h2 className="mt-1 text-sm font-semibold text-white">
            Face fit panel
          </h2>
        </div>
        <button
          type="button"
          onClick={() => {
            setPanelOpen(false);
          }}
          className="rounded border border-white/15 px-2 py-0.5 text-[10px] text-white/60 hover:text-white"
        >
          Hide
        </button>
      </header>

      <p className="mb-3 text-[10px] leading-relaxed text-white/45">
        Dial rotation + fit until the face sits flush with the glass. Use Log
        measures, then paste into PROJECT_FACE_TUNING_DEFAULTS.
      </p>

      <div className="mb-3 space-y-1 rounded border border-white/10 bg-white/5 p-2 font-mono text-[10px] text-white/55">
        <p>placeholder W×H×D</p>
        <p className="text-blue-100/80">
          {bounds.size[0].toFixed(3)} × {bounds.size[1].toFixed(3)} ×{" "}
          {bounds.size[2].toFixed(3)}
        </p>
        <p className="mt-1">face base (inset)</p>
        <p className="text-blue-100/80">
          {layout.faceWidth.toFixed(3)} × {layout.faceHeight.toFixed(3)}
        </p>
        <p className="mt-1">visual W×H (after scale)</p>
        <p className="text-blue-100/80">
          {layout.visualWidth.toFixed(3)} × {layout.visualHeight.toFixed(3)}
        </p>
        <p className="mt-1">rotation Y</p>
        <p className="text-blue-100/80">{params.rotationY.toFixed(2)}°</p>
      </div>

      <label className="mb-3 flex flex-col gap-1 text-[11px] text-white/70">
        <span>Shape (content silhouette)</span>
        <select
          value={params.shape}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            setParam("shape", event.target.value as CardFaceShape);
          }}
          className="rounded border border-white/15 bg-black/60 px-2 py-1.5 text-xs text-white"
        >
          {SHAPES.map((shape) => (
            <option key={shape} value={shape}>
              {shape}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-col gap-3">
        <NumberRow
          label="Rotation Y (degrees)"
          value={params.rotationY}
          step={0.25}
          softMin={-60}
          softMax={60}
          onChange={(value) => {
            setParam("rotationY", value);
          }}
        />
        <NumberRow
          label="Inset (1 = AABB fill)"
          value={params.inset}
          step={0.01}
          softMin={0}
          softMax={5}
          onChange={(value) => {
            setParam("inset", value);
          }}
        />
        <NumberRow
          label="Width scale"
          value={params.widthScale}
          step={0.01}
          softMin={0}
          softMax={5}
          onChange={(value) => {
            setParam("widthScale", value);
          }}
        />
        <NumberRow
          label="Height scale"
          value={params.heightScale}
          step={0.01}
          softMin={0}
          softMax={5}
          onChange={(value) => {
            setParam("heightScale", value);
          }}
        />
        <NumberRow
          label="Recess (into glass)"
          value={params.recess}
          step={0.001}
          softMin={-1}
          softMax={1}
          onChange={(value) => {
            setParam("recess", value);
          }}
        />
        <NumberRow
          label="Offset X"
          value={params.offsetX}
          step={0.001}
          softMin={-2}
          softMax={2}
          onChange={(value) => {
            setParam("offsetX", value);
          }}
        />
        <NumberRow
          label="Offset Y"
          value={params.offsetY}
          step={0.001}
          softMin={-2}
          softMax={2}
          onChange={(value) => {
            setParam("offsetY", value);
          }}
        />
        <NumberRow
          label="Offset Z"
          value={params.offsetZ}
          step={0.001}
          softMin={-2}
          softMax={2}
          onChange={(value) => {
            setParam("offsetZ", value);
          }}
        />
        <NumberRow
          label="Corner radius (rect)"
          value={params.cornerRadius}
          step={0.01}
          softMin={0}
          softMax={0.5}
          onChange={(value) => {
            setParam("cornerRadius", value);
          }}
        />
        <NumberRow
          label="Model scale (0 = default)"
          value={params.modelScale ?? 0}
          step={0.01}
          softMin={0}
          softMax={8}
          onChange={(value) => {
            setParam("modelScale", value <= 0 ? null : value);
          }}
        />
      </div>

      <label className="mt-3 flex items-center gap-2 text-[11px] text-white/70">
        <input
          type="checkbox"
          checked={params.showMeasureHelper}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setParam("showMeasureHelper", event.target.checked);
          }}
          className="accent-blue-400"
        />
        Show measure helper outline
      </label>

      <div className="mt-3 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => {
            logMeasures();
          }}
          className="rounded border border-blue-400/40 bg-blue-500/15 px-2 py-1.5 text-xs text-blue-100 transition hover:bg-blue-500/25"
        >
          Log measures
        </button>
        <button
          type="button"
          onClick={() => {
            reset();
          }}
          className="rounded border border-white/15 bg-white/5 px-2 py-1.5 text-xs text-white/70 transition hover:bg-white/10"
        >
          Reset defaults
        </button>
      </div>
    </aside>
  );
}
