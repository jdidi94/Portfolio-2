import type { JSX, ChangeEvent } from "react";
import {
  useContactFaceLinksStore,
  useContactFaceLinksParams,
} from "@store/contactFaceLinksStore";
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
 * Dev panel — contact face link Html placement + size.
 * Focus the Contact card, tweak, then Log and bake into config.
 */
export function ContactFaceLinksTuningPanel(): JSX.Element {
  const params = useContactFaceLinksParams();
  const panelOpen = useContactFaceLinksStore((s) => s.panelOpen);
  const setParam = useContactFaceLinksStore((s) => s.setParam);
  const setPanelOpen = useContactFaceLinksStore((s) => s.setPanelOpen);
  const reset = useContactFaceLinksStore((s) => s.reset);
  const logMeasures = useContactFaceLinksStore((s) => s.logMeasures);
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
        Contact links
      </button>
    );
  }

  return (
    <aside
      className={`pointer-events-auto absolute z-30 overflow-y-auto rounded-md border border-cyan-400/25 bg-black/80 p-3 text-white shadow-[0_0_24px_rgba(34,211,238,0.12)] backdrop-blur-md ${
        isCompact
          ? "left-[max(0.75rem,env(safe-area-inset-left))] right-[max(0.75rem,env(safe-area-inset-right))] bottom-[max(0.75rem,env(safe-area-inset-bottom))] max-h-[min(52dvh,420px)] w-auto"
          : "top-20 left-4 max-h-[min(78dvh,560px)] w-[min(100%,300px)]"
      }`}
      aria-label="Contact face links tuning"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs tracking-wide text-cyan-100/90 uppercase">
          Contact links
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

      <p className="mb-3 text-[10px] leading-relaxed text-white/45">
        Focus the Contact card, adjust placement, then Log and paste into{" "}
        <span className="font-mono text-cyan-200/70">
          CONTACT_FACE_LINKS_DEFAULTS
        </span>
        .
      </p>

      <div className="space-y-3">
        <p className="text-[10px] tracking-wide text-white/40 uppercase">
          Position (model space)
        </p>
        <NumberRow
          label="Offset X"
          value={params.offsetX}
          step={0.01}
          softMin={-0.5}
          softMax={0.5}
          onChange={(value) => setParam("offsetX", value)}
        />
        <NumberRow
          label="Offset Y"
          value={params.offsetY}
          step={0.01}
          softMin={-0.3}
          softMax={1}
          onChange={(value) => setParam("offsetY", value)}
        />
        <NumberRow
          label="Offset Z (past face)"
          value={params.offsetZ}
          step={0.005}
          softMin={-0.1}
          softMax={0.25}
          onChange={(value) => setParam("offsetZ", value)}
        />

        <p className="pt-1 text-[10px] tracking-wide text-white/40 uppercase">
          Scale
        </p>
        <NumberRow
          label="Distance factor"
          value={params.distanceFactor}
          step={0.05}
          softMin={0.8}
          softMax={6}
          onChange={(value) => setParam("distanceFactor", value)}
        />
        <NumberRow
          label="Width (rem)"
          value={params.widthRem}
          step={0.25}
          softMin={6}
          softMax={20}
          onChange={(value) => setParam("widthRem", value)}
        />
        <NumberRow
          label="Icon gap (px)"
          value={params.iconGapPx}
          step={1}
          softMin={0}
          softMax={24}
          onChange={(value) => setParam("iconGapPx", value)}
        />
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={logMeasures}
          className="flex-1 rounded border border-cyan-400/40 bg-cyan-500/15 px-2 py-1.5 text-xs text-cyan-100 transition hover:border-cyan-300/60 hover:bg-cyan-500/25"
        >
          Log
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded border border-white/15 px-2 py-1.5 text-xs text-white/65 transition hover:border-white/30"
        >
          Reset
        </button>
      </div>
    </aside>
  );
}
