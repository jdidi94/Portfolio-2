import type { JSX, ChangeEvent, ReactNode } from "react";
import {
  useCardFaceTypeStore,
  useCardFaceTypeParams,
} from "@store/cardFaceTypeStore";
import { useViewportStore } from "@store/viewportStore";
import type { CardFaceTypeParams } from "@config/cardFaceType";

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
  softMax = 200,
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

interface GroupProps {
  title: string;
  children: ReactNode;
}

function Group({ title, children }: GroupProps): JSX.Element {
  return (
    <section className="mb-3 space-y-2 border-b border-white/10 pb-3 last:mb-0 last:border-b-0 last:pb-0">
      <h3 className="text-[10px] tracking-[0.22em] text-cyan-200/70 uppercase">
        {title}
      </h3>
      <div className="flex flex-col gap-2.5">{children}</div>
    </section>
  );
}

/**
 * Dev panel — shared card-face typography for every section.
 * Dial while viewing About detail / Experience overview, then Log → bake defaults.
 */
export function CardFaceTypeTuningPanel(): JSX.Element {
  const params = useCardFaceTypeParams();
  const panelOpen = useCardFaceTypeStore((s) => s.panelOpen);
  const setParam = useCardFaceTypeStore((s) => s.setParam);
  const setPanelOpen = useCardFaceTypeStore((s) => s.setPanelOpen);
  const reset = useCardFaceTypeStore((s) => s.reset);
  const logMeasures = useCardFaceTypeStore((s) => s.logMeasures);
  const isCompact = useViewportStore((s) => s.tier) !== "desktop";

  const set =
    (key: keyof CardFaceTypeParams) =>
    (value: number): void => {
      setParam(key, value);
    };

  if (!panelOpen) {
    return (
      <button
        type="button"
        onClick={() => {
          setPanelOpen(true);
        }}
        className={`pointer-events-auto absolute z-30 rounded border border-cyan-400/40 bg-black/75 px-3 py-1.5 text-xs text-cyan-100 backdrop-blur-sm transition hover:border-cyan-300 ${
          isCompact
            ? "left-[max(0.75rem,env(safe-area-inset-left))] bottom-[max(4rem,calc(env(safe-area-inset-bottom)+3.5rem))]"
            : "top-20 right-4"
        }`}
      >
        Face type panel
      </button>
    );
  }

  return (
    <aside
      className={`pointer-events-auto absolute z-30 overflow-y-auto rounded-md border border-cyan-400/30 bg-black/85 p-3 text-white shadow-[0_0_24px_rgba(34,211,238,0.12)] backdrop-blur-md ${
        isCompact
          ? "left-[max(0.75rem,env(safe-area-inset-left))] right-[max(0.75rem,env(safe-area-inset-right))] bottom-[max(0.75rem,env(safe-area-inset-bottom))] max-h-[min(52dvh,420px)] w-auto"
          : "top-20 right-4 max-h-[min(78dvh,640px)] w-[min(100%,300px)]"
      }`}
      aria-label="Card face type tuning"
    >
      <header className="mb-3 flex items-start justify-between gap-2 border-b border-white/10 pb-2">
        <div>
          <p className="text-[10px] tracking-[0.25em] text-cyan-300/80 uppercase">
            All sections
          </p>
          <h2 className="mt-1 text-sm font-semibold text-white">
            Face type panel
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
        Shared typography for every glass face. Focus an About beat for detail
        body; stay on Experience/Projects for overview. Log → paste into
        CARD_FACE_TYPE_DEFAULTS.
      </p>

      <Group title="Overview">
        <NumberRow
          label="Title size"
          value={params.overviewTitleSize}
          step={1}
          softMin={40}
          softMax={140}
          onChange={set("overviewTitleSize")}
        />
        <NumberRow
          label="Title line height"
          value={params.overviewTitleLineHeight}
          step={1}
          softMin={40}
          softMax={160}
          onChange={set("overviewTitleLineHeight")}
        />
        <NumberRow
          label="Title max lines (hex)"
          value={params.overviewTitleMaxLinesHex}
          step={1}
          softMin={1}
          softMax={5}
          onChange={set("overviewTitleMaxLinesHex")}
        />
        <NumberRow
          label="Title max lines (rect)"
          value={params.overviewTitleMaxLinesRect}
          step={1}
          softMin={1}
          softMax={5}
          onChange={set("overviewTitleMaxLinesRect")}
        />
        <NumberRow
          label="Section label size"
          value={params.overviewSectionSize}
          step={1}
          softMin={20}
          softMax={80}
          onChange={set("overviewSectionSize")}
        />
        <NumberRow
          label="Body size"
          value={params.overviewBodySize}
          step={1}
          softMin={24}
          softMax={100}
          onChange={set("overviewBodySize")}
        />
        <NumberRow
          label="Body line height"
          value={params.overviewBodyLineHeight}
          step={1}
          softMin={28}
          softMax={120}
          onChange={set("overviewBodyLineHeight")}
        />
        <NumberRow
          label="Body max lines / block"
          value={params.overviewBodyMaxLinesPerBlock}
          step={1}
          softMin={1}
          softMax={6}
          onChange={set("overviewBodyMaxLinesPerBlock")}
        />
        <NumberRow
          label="Body max blocks"
          value={params.overviewBodyMaxBlocks}
          step={1}
          softMin={1}
          softMax={6}
          onChange={set("overviewBodyMaxBlocks")}
        />
        <NumberRow
          label="CTA size"
          value={params.overviewCtaSize}
          step={1}
          softMin={18}
          softMax={64}
          onChange={set("overviewCtaSize")}
        />
      </Group>

      <Group title="Detail (About focus)">
        <NumberRow
          label="Section label size"
          value={params.detailSectionSize}
          step={1}
          softMin={18}
          softMax={72}
          onChange={set("detailSectionSize")}
        />
        <NumberRow
          label="Title size"
          value={params.detailTitleSize}
          step={1}
          softMin={40}
          softMax={140}
          onChange={set("detailTitleSize")}
        />
        <NumberRow
          label="Title line height"
          value={params.detailTitleLineHeight}
          step={1}
          softMin={40}
          softMax={160}
          onChange={set("detailTitleLineHeight")}
        />
        <NumberRow
          label="Title max lines (hex)"
          value={params.detailTitleMaxLinesHex}
          step={1}
          softMin={1}
          softMax={5}
          onChange={set("detailTitleMaxLinesHex")}
        />
        <NumberRow
          label="Title max lines (rect)"
          value={params.detailTitleMaxLinesRect}
          step={1}
          softMin={1}
          softMax={6}
          onChange={set("detailTitleMaxLinesRect")}
        />
        <NumberRow
          label="Subtitle size"
          value={params.detailSubtitleSize}
          step={1}
          softMin={24}
          softMax={80}
          onChange={set("detailSubtitleSize")}
        />
        <NumberRow
          label="Subtitle line height"
          value={params.detailSubtitleLineHeight}
          step={1}
          softMin={28}
          softMax={100}
          onChange={set("detailSubtitleLineHeight")}
        />
        <NumberRow
          label="Subtitle max lines"
          value={params.detailSubtitleMaxLines}
          step={1}
          softMin={1}
          softMax={4}
          onChange={set("detailSubtitleMaxLines")}
        />
        <NumberRow
          label="Body size"
          value={params.detailBodySize}
          step={1}
          softMin={28}
          softMax={100}
          onChange={set("detailBodySize")}
        />
        <NumberRow
          label="Body line height"
          value={params.detailBodyLineHeight}
          step={1}
          softMin={32}
          softMax={140}
          onChange={set("detailBodyLineHeight")}
        />
        <NumberRow
          label="Body max lines / block"
          value={params.detailBodyMaxLinesPerBlock}
          step={1}
          softMin={1}
          softMax={8}
          onChange={set("detailBodyMaxLinesPerBlock")}
        />
        <NumberRow
          label="Body max blocks"
          value={params.detailBodyMaxBlocks}
          step={1}
          softMin={1}
          softMax={6}
          onChange={set("detailBodyMaxBlocks")}
        />
      </Group>

      <Group title="Fit">
        <NumberRow
          label="Body grow min"
          value={params.bodyGrowMin}
          step={0.01}
          softMin={0.5}
          softMax={1.2}
          onChange={set("bodyGrowMin")}
        />
        <NumberRow
          label="Body grow max"
          value={params.bodyGrowMax}
          step={0.01}
          softMin={0.8}
          softMax={1.5}
          onChange={set("bodyGrowMax")}
        />
      </Group>

      <div className="mt-1 flex flex-col gap-2">
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
