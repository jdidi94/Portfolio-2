import type { JSX, ChangeEvent } from "react";
import {
  useCardEdgeFogTuningStore,
  useCardEdgeFogTuningParams,
} from "@store/cardEdgeFogTuningStore";
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
          className="w-[5.5rem] rounded border border-white/15 bg-black/60 px-1.5 py-0.5 text-right font-mono text-[11px] text-violet-100"
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
        className="w-full accent-violet-400"
      />
    </label>
  );
}

/**
 * Dev panel — hex card hover shadow / soft glow blur.
 * Sits beside the project face-fit panel (model rotation).
 */
export function CardEdgeFogTuningPanel(): JSX.Element {
  const params = useCardEdgeFogTuningParams();
  const panelOpen = useCardEdgeFogTuningStore((s) => s.panelOpen);
  const setParam = useCardEdgeFogTuningStore((s) => s.setParam);
  const setPanelOpen = useCardEdgeFogTuningStore((s) => s.setPanelOpen);
  const reset = useCardEdgeFogTuningStore((s) => s.reset);
  const logMeasures = useCardEdgeFogTuningStore((s) => s.logMeasures);
  const isCompact = useViewportStore((s) => s.tier) !== "desktop";

  if (!panelOpen) {
    return (
      <button
        type="button"
        onClick={() => {
          setPanelOpen(true);
        }}
        className={`pointer-events-auto absolute z-30 rounded border border-violet-400/40 bg-black/75 px-3 py-1.5 text-xs text-violet-100 backdrop-blur-sm transition hover:border-violet-300 ${
          isCompact
            ? "right-[max(0.75rem,env(safe-area-inset-right))] bottom-[max(4rem,calc(env(safe-area-inset-bottom)+3.5rem))]"
            : "top-20 right-4"
        }`}
      >
        Shadow blur panel
      </button>
    );
  }

  return (
    <aside
      className={`pointer-events-auto absolute z-30 overflow-y-auto rounded-md border border-violet-400/30 bg-black/85 p-3 text-white shadow-[0_0_24px_rgba(139,92,246,0.18)] backdrop-blur-md ${
        isCompact
          ? "left-[max(0.75rem,env(safe-area-inset-left))] right-[max(0.75rem,env(safe-area-inset-right))] bottom-[max(0.75rem,env(safe-area-inset-bottom))] max-h-[min(52dvh,420px)] w-auto"
          : "top-20 right-4 max-h-[min(78dvh,640px)] w-[min(100%,300px)]"
      }`}
      aria-label="Card edge shadow blur tuning"
    >
      <header className="mb-3 flex items-start justify-between gap-2 border-b border-white/10 pb-2">
        <div>
          <p className="text-[10px] tracking-[0.25em] text-violet-300/80 uppercase">
            Hex hover glow
          </p>
          <h2 className="mt-1 text-sm font-semibold text-white">
            Shadow blur panel
          </h2>
        </div>
        <button
          type="button"
          onClick={() => {
            setPanelOpen(false);
          }}
          className="rounded border border-white/15 px-2 py-0.5 text-[10px] text-white/60 hover:border-white/30"
        >
          Hide
        </button>
      </header>

      <p className="mb-3 text-[11px] leading-relaxed text-white/45">
        Soft outer glow on hex cards. Raise blur for less edgy light; hover a
        hex card to preview.
      </p>

      <div className="space-y-3">
        <p className="text-[10px] tracking-wide text-white/40 uppercase">
          Softness
        </p>
        <NumberRow
          label="Blur (px)"
          value={params.blurPx}
          step={1}
          softMin={0}
          softMax={40}
          onChange={(value) => setParam("blurPx", Math.round(value))}
        />
        <NumberRow
          label="Soft band"
          value={params.softBand}
          step={0.01}
          softMin={0.02}
          softMax={0.6}
          onChange={(value) => setParam("softBand", value)}
        />
        <NumberRow
          label="Opacity"
          value={params.opacity}
          step={0.05}
          softMin={0}
          softMax={1.5}
          onChange={(value) => setParam("opacity", value)}
        />

        <p className="pt-1 text-[10px] tracking-wide text-white/40 uppercase">
          Shape
        </p>
        <NumberRow
          label="Hex clear"
          value={params.hexClear}
          step={0.01}
          softMin={0.3}
          softMax={0.7}
          onChange={(value) => setParam("hexClear", value)}
        />
        <NumberRow
          label="Circle fade start"
          value={params.circleFadeStart}
          step={0.01}
          softMin={0.2}
          softMax={0.9}
          onChange={(value) => setParam("circleFadeStart", value)}
        />
        <NumberRow
          label="Circle fade end"
          value={params.circleFadeEnd}
          step={0.01}
          softMin={0.5}
          softMax={1.2}
          onChange={(value) => setParam("circleFadeEnd", value)}
        />
        <NumberRow
          label="Plane scale"
          value={params.planeScale}
          step={0.05}
          softMin={1.2}
          softMax={4}
          onChange={(value) => setParam("planeScale", value)}
        />
        <NumberRow
          label="Z offset"
          value={params.zOffset}
          step={0.002}
          softMin={0}
          softMax={0.08}
          onChange={(value) => setParam("zOffset", value)}
        />

        <p className="pt-1 text-[10px] tracking-wide text-white/40 uppercase">
          Frame emissive
        </p>
        <NumberRow
          label="Frame boost"
          value={params.frameEmissiveBoost}
          step={0.02}
          softMin={0}
          softMax={1}
          onChange={(value) => setParam("frameEmissiveBoost", value)}
        />
        <NumberRow
          label="Skill badge boost"
          value={params.skillBadgeFrameBoost}
          step={0.02}
          softMin={0}
          softMax={1}
          onChange={(value) => setParam("skillBadgeFrameBoost", value)}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={logMeasures}
          className="rounded border border-violet-400/35 bg-violet-500/15 px-2.5 py-1 text-[11px] text-violet-100 hover:border-violet-300/50"
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
        Log prints JSON for paste-back into CARD_EDGE_FOG_TUNING_DEFAULTS.
      </p>
    </aside>
  );
}
