import type { JSX, ChangeEvent } from "react";
import {
  useHeroFaceTuningStore,
  useHeroTuningParams,
} from "@store/heroFaceTuningStore";
import { useViewportStore } from "@store/viewportStore";
import {
  HERO_PLACEHOLDER_BOUNDS,
  resolveHeroFaceLayout,
} from "@config/heroFaceTuning";
import type { CardFaceShape } from "@config/cardGeometry";

const SHAPES: readonly CardFaceShape[] = [
  "hexagon",
  "roundedRect",
  "ellipse",
];

interface NumberRowProps {
  label: string;
  value: number;
  step: number;
  onChange: (value: number) => void;
  /** Soft slider guide only — typed values may exceed this range. */
  softMin?: number;
  softMax?: number;
}

/**
 * Unbounded numeric control. Slider is a convenience guide; the number
 * field accepts any finite value (no hard max/min).
 */
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
  // Keep slider thumb usable even when the stored value is outside the soft range.
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
 * Dev panel — first section (hero) only.
 * Collapsed by default so the 3D scene stays usable.
 */
export function HeroFaceTuningPanel(): JSX.Element {
  const params = useHeroTuningParams();
  const panelOpen = useHeroFaceTuningStore((s) => s.panelOpen);
  const setParam = useHeroFaceTuningStore((s) => s.setParam);
  const setPanelOpen = useHeroFaceTuningStore((s) => s.setPanelOpen);
  const reset = useHeroFaceTuningStore((s) => s.reset);
  const fillPlaceholder = useHeroFaceTuningStore((s) => s.fillPlaceholder);
  const logMeasures = useHeroFaceTuningStore((s) => s.logMeasures);
  const layout = resolveHeroFaceLayout(params);
  const bounds = HERO_PLACEHOLDER_BOUNDS;
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
            ? "right-[max(0.75rem,env(safe-area-inset-right))] bottom-[max(4rem,calc(env(safe-area-inset-bottom)+3.5rem))]"
            : "top-20 right-4"
        }`}
      >
        Hero fit panel
      </button>
    );
  }

  return (
    <aside
      className={`pointer-events-auto absolute z-30 overflow-y-auto rounded-md border border-cyan-400/25 bg-black/80 p-3 text-white shadow-[0_0_24px_rgba(34,211,238,0.12)] backdrop-blur-md ${
        isCompact
          ? "left-[max(0.75rem,env(safe-area-inset-left))] right-[max(0.75rem,env(safe-area-inset-right))] bottom-[max(0.75rem,env(safe-area-inset-bottom))] max-h-[min(52dvh,420px)] w-auto"
          : "top-20 right-4 max-h-[min(78dvh,640px)] w-[min(100%,300px)]"
      }`}
      aria-label="Hero face tuning"
    >
      <header className="mb-3 flex items-start justify-between gap-2 border-b border-white/10 pb-2">
        <div>
          <p className="text-[10px] tracking-[0.25em] text-cyan-300/80 uppercase">
            Hero section only
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
        Number fields have no max. Type any value (e.g. inset 3, scale 4).
        Sliders are only a soft guide.
      </p>

      <div className="mb-3 space-y-1 rounded border border-white/10 bg-white/5 p-2 font-mono text-[10px] text-white/55">
        <p>placeholder W×H×D</p>
        <p className="text-cyan-100/80">
          {bounds.size[0].toFixed(3)} × {bounds.size[1].toFixed(3)} ×{" "}
          {bounds.size[2].toFixed(3)}
        </p>
        <p className="mt-1">face base (inset)</p>
        <p className="text-cyan-100/80">
          {layout.faceWidth.toFixed(3)} × {layout.faceHeight.toFixed(3)}
        </p>
        <p className="mt-1">visual W×H (after scale)</p>
        <p className="text-cyan-100/80">
          {layout.visualWidth.toFixed(3)} × {layout.visualHeight.toFixed(3)}
        </p>
      </div>

      <div className="mb-3 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => {
            fillPlaceholder();
          }}
          className="w-full rounded border border-cyan-400/50 bg-cyan-500/20 px-2 py-2 text-xs font-medium text-cyan-50 transition hover:bg-cyan-500/30"
        >
          Fill hex placeholder
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setParam("inset", params.inset * 2);
            }}
            className="flex-1 rounded border border-white/20 bg-white/5 px-2 py-1.5 text-xs text-white/80 transition hover:bg-white/10"
          >
            Inset ×2
          </button>
          <button
            type="button"
            onClick={() => {
              setParam("inset", params.inset * 0.5);
            }}
            className="flex-1 rounded border border-white/20 bg-white/5 px-2 py-1.5 text-xs text-white/80 transition hover:bg-white/10"
          >
            Inset ÷2
          </button>
        </div>
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
          className="accent-cyan-400"
        />
        Show measure helper outline
      </label>

      <div className="mt-3 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => {
            logMeasures();
          }}
          className="rounded border border-cyan-400/40 bg-cyan-500/15 px-2 py-1.5 text-xs text-cyan-100 transition hover:bg-cyan-500/25"
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
