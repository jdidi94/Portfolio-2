import {
  CanvasTexture,
  LinearFilter,
  SRGBColorSpace,
  type Texture,
} from "three";
import type { CardFaceShape } from "@config/cardGeometry";
import type { ContentCardVariant } from "@shared-types/content";
import {
  CARD_FACE_TYPE_DEFAULTS,
  type CardFaceTypeParams,
} from "@config/cardFaceType";
import { CARD_CONFIG } from "@config/cards";
import { drawCardVariantIcon } from "@utils/drawCardVariantIcon";

export type CardFaceDisplayMode = "overview" | "detail";

export interface CardFaceTextureOptions {
  title: string;
  /** Section kind label shown in overview (e.g. Projects, Skills). */
  sectionLabel?: string;
  subtitle?: string;
  bodyLines?: readonly string[];
  /** overview = icon + label at distance; detail = full copy after focus. */
  mode?: CardFaceDisplayMode;
  /**
   * Overview shows a centered logo only (no title / section / CTA).
   * Used by the Technology Hive child cards.
   */
  logoOnly?: boolean;
  /** Technology Hive placeholders — show a lock on the logo-only face. */
  locked?: boolean;
  /** Technology Hive — logo-only mode without drawing the icon. */
  hideLogo?: boolean;
  variant?: ContentCardVariant;
  accent: string;
  width?: number;
  height?: number;
  cover?: Texture | HTMLImageElement | null;
  pattern?: Texture | HTMLImageElement | null;
  /** Must match the 3D placeholder opening. */
  shape?: CardFaceShape;
  cornerRadiusRatio?: number;
  /** Painted neon rim on the texture — off so content fills edge-to-edge. */
  drawRim?: boolean;
  /** Live typography overrides (defaults to CARD_FACE_TYPE_DEFAULTS). */
  faceType?: CardFaceTypeParams;
}

function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
): void {
  const r = Math.min(radius, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Pointy-top hexagon matching glass_card_rounded / skill_badge. */
function drawHexPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
): void {
  ctx.beginPath();
  for (let i = 0; i < 6; i += 1) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
}

function drawEllipsePath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
): void {
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.closePath();
}

/** Pointy-top isosceles triangle filling the canvas AABB. */
function drawTrianglePath(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  inset = 0,
): void {
  const cx = width / 2;
  ctx.beginPath();
  ctx.moveTo(cx, inset);
  ctx.lineTo(width - inset, height - inset);
  ctx.lineTo(inset, height - inset);
  ctx.closePath();
}

/** Pointy-top hex circumradius that fills a W×H AABB (same math as 3D face). */
function hexRadiusForCanvas(width: number, height: number): number {
  return Math.min(height / 2, width / Math.sqrt(3));
}

function clipToShape(
  ctx: CanvasRenderingContext2D,
  shape: CardFaceShape,
  width: number,
  height: number,
  cornerRadiusRatio: number,
): void {
  const cx = width / 2;
  const cy = height / 2;

  if (shape === "hexagon") {
    drawHexPath(ctx, cx, cy, hexRadiusForCanvas(width, height));
  } else if (shape === "ellipse") {
    drawEllipsePath(ctx, cx, cy, width / 2, height / 2);
  } else if (shape === "triangle") {
    drawTrianglePath(ctx, width, height);
  } else {
    const radius = Math.min(width, height) * cornerRadiusRatio;
    drawRoundedRectPath(ctx, 0, 0, width, height, radius);
  }
  ctx.clip();
}

function strokeShapeRim(
  ctx: CanvasRenderingContext2D,
  shape: CardFaceShape,
  width: number,
  height: number,
  accent: string,
  cornerRadiusRatio: number,
): void {
  const cx = width / 2;
  const cy = height / 2;
  const margin = Math.min(width, height) * 0.035;
  const lineWidthCore = Math.max(2, width * 0.004);
  const lineWidthGlow = Math.max(4, width * 0.008);

  const rim = (): void => {
    if (shape === "hexagon") {
      drawHexPath(
        ctx,
        cx,
        cy,
        Math.max(1, hexRadiusForCanvas(width, height) - margin),
      );
    } else if (shape === "ellipse") {
      drawEllipsePath(ctx, cx, cy, width / 2 - margin, height / 2 - margin);
    } else if (shape === "triangle") {
      drawTrianglePath(ctx, width, height, margin);
    } else {
      const radius = Math.min(width, height) * cornerRadiusRatio * 0.85;
      drawRoundedRectPath(
        ctx,
        margin,
        margin,
        width - margin * 2,
        height - margin * 2,
        radius,
      );
    }
  };

  // Outer glow — soft fog emission along the border.
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.shadowBlur = Math.max(8, width * 0.02);
  ctx.shadowColor = `${accent}CC`;
  ctx.strokeStyle = `${accent}88`;
  ctx.lineWidth = lineWidthGlow;
  rim();
  ctx.stroke();

  // Crisp inner rim.
  ctx.shadowBlur = 0;
  ctx.globalCompositeOperation = "source-over";
  ctx.strokeStyle = `${accent}AA`;
  ctx.lineWidth = lineWidthCore;
  rim();
  ctx.stroke();

  // Dust / fog specks along the rim (hex faces read best).
  if (shape === "hexagon") {
    const radius = Math.max(1, hexRadiusForCanvas(width, height) - margin);
    const speckCount = Math.round(18 + width * 0.008);
    for (let i = 0; i < speckCount; i += 1) {
      const angle = (i / speckCount) * Math.PI * 2 + i * 0.37;
      const jitter = ((i * 17) % 7) * 0.004 - 0.012;
      const x = cx + Math.cos(angle) * radius * (1 + jitter);
      const y = cy + Math.sin(angle) * radius * (1 + jitter);
      const size = Math.max(1, width * 0.0012 * (1 + (i % 3) * 0.35));
      ctx.fillStyle = `${accent}${i % 2 === 0 ? "66" : "44"}`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function sourceImage(
  source: Texture | HTMLImageElement,
): CanvasImageSource | null {
  if (source instanceof HTMLImageElement) {
    return source;
  }
  const image = source.image as CanvasImageSource | undefined;
  return image ?? null;
}

/** Object-fit: cover into the face rectangle. */
function drawCoverCover(
  ctx: CanvasRenderingContext2D,
  cover: CanvasImageSource,
  width: number,
  height: number,
): void {
  const iw =
    "naturalWidth" in cover && cover.naturalWidth
      ? cover.naturalWidth
      : (cover as CanvasImageSource & { width?: number }).width || width;
  const ih =
    "naturalHeight" in cover && cover.naturalHeight
      ? cover.naturalHeight
      : (cover as CanvasImageSource & { height?: number }).height || height;
  const scale = Math.max(width / Math.max(1, iw), height / Math.max(1, ih));
  const drawW = iw * scale;
  const drawH = ih * scale;
  ctx.drawImage(cover, (width - drawW) / 2, (height - drawH) / 2, drawW, drawH);
}

/**
 * Word-wrap into lines (no draw). Truncates with an ellipsis when content exceeds `maxLines`.
 */
function breakWrappedLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0 || maxLines <= 0) {
    return [];
  }

  const fitEllipsis = (base: string): string => {
    let last = base.replace(/…$/u, "");
    while (last.length > 0 && ctx.measureText(`${last}…`).width > maxWidth) {
      last = last.slice(0, -1);
    }
    return last.length > 0 ? `${last}…` : "…";
  };

  const lines: string[] = [];
  let line = "";
  let truncated = false;

  for (let i = 0; i < words.length; i += 1) {
    const word = words[i] ?? "";
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
      if (lines.length >= maxLines) {
        truncated = true;
        line = "";
        break;
      }
    } else if (ctx.measureText(test).width > maxWidth && !line) {
      let clipped = word;
      while (
        clipped.length > 1 &&
        ctx.measureText(`${clipped}…`).width > maxWidth
      ) {
        clipped = clipped.slice(0, -1);
      }
      lines.push(`${clipped}…`);
      truncated = true;
      line = "";
      if (lines.length >= maxLines) {
        break;
      }
    } else {
      line = test;
    }
  }

  if (line) {
    if (lines.length < maxLines) {
      lines.push(line);
    } else {
      truncated = true;
    }
  }

  if (truncated && lines.length > 0) {
    const lastIndex = lines.length - 1;
    lines[lastIndex] = fitEllipsis(lines[lastIndex] ?? "");
  }

  return lines;
}

/**
 * Word-wrap centered text. Returns the Y of the baseline after the last drawn line
 * (or `y - lineHeight` when nothing was drawn) so callers can stack blocks.
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
): number {
  const lines = breakWrappedLines(ctx, text, maxWidth, maxLines);
  if (lines.length === 0) {
    return y - lineHeight;
  }

  let cursorY = y;
  for (const drawn of lines) {
    ctx.fillText(drawn, x, cursorY);
    cursorY += lineHeight;
  }
  return cursorY - lineHeight;
}

function measureWrappedHeight(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
): number {
  const lines = breakWrappedLines(ctx, text, maxWidth, maxLines);
  if (lines.length === 0) return 0;
  return lines.length * lineHeight;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function contentBounds(
  width: number,
  height: number,
  shape: CardFaceShape,
): { padX: number; padTop: number; padBottom: number; maxTextWidth: number } {
  const pointed = shape === "hexagon" || shape === "triangle";
  const padX = Math.round(width * (pointed ? 0.2 : 0.12));
  const padTop = Math.round(
    height * (shape === "triangle" ? 0.2 : pointed ? 0.14 : 0.08),
  );
  const padBottom = Math.round(
    height * (shape === "triangle" ? 0.1 : pointed ? 0.12 : 0.08),
  );
  return {
    padX,
    padTop,
    padBottom,
    maxTextWidth: width - padX * 2,
  };
}

/** Resolve body grow so the stack fills leftover space without overflowing. */
function resolveBodyGrow(
  fixedHeight: number,
  bodyBaseHeight: number,
  availableHeight: number,
  growMin: number,
  growMax: number,
): number {
  if (bodyBaseHeight <= 0) {
    return 1;
  }
  const remaining = availableHeight - fixedHeight;
  if (remaining <= 0) {
    return growMin;
  }
  return clamp(remaining / bodyBaseHeight, growMin, growMax);
}

/**
 * Cap body type so it cannot outrank the title after auto-grow.
 * Hierarchy: title > subtitle ≥ body.
 */
function capBodyGrowForHierarchy(
  bodyGrow: number,
  bodySizeBase: number,
  titleSize: number,
): number {
  // Body stays ≤ ~70% of title size even after grow.
  const maxBody = titleSize * 0.7;
  if (bodySizeBase <= 0) return bodyGrow;
  return Math.min(bodyGrow, maxBody / bodySizeBase);
}

function paintBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: CardFaceTextureOptions,
  dimCover: boolean,
): void {
  // Near-opaque plate — translucent glass behind the face must not wash copy.
  ctx.fillStyle = "rgba(5, 6, 12, 0.97)";
  ctx.fillRect(0, 0, width, height);

  // Logo-only faces keep a clean plate; the logo is drawn in paintOverview.
  if (options.logoOnly) {
    const glow = ctx.createRadialGradient(
      width / 2,
      height * 0.5,
      height * 0.05,
      width / 2,
      height * 0.5,
      height * 0.5,
    );
    glow.addColorStop(0, `${options.accent}28`);
    glow.addColorStop(1, "rgba(5, 5, 8, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
    return;
  }

  if (options.cover) {
    const cover = sourceImage(options.cover);
    if (cover) {
      const isHero = options.variant === "hero";
      const photoCard =
        options.variant === "project" || options.variant === "experience";
      const heroCover = CARD_CONFIG.heroCover;
      ctx.globalAlpha = isHero
        ? heroCover.imageAlpha
        : photoCard
          ? dimCover
            ? 0.72
            : 0.55
          : dimCover
            ? 0.22
            : 0.32;
      drawCoverCover(ctx, cover, width, height);
      ctx.globalAlpha = 1;
      if (isHero) {
        ctx.fillStyle = `rgba(5, 5, 8, ${heroCover.darkFilter})`;
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.fillStyle = photoCard
          ? dimCover
            ? "rgba(5, 5, 8, 0.42)"
            : "rgba(5, 5, 8, 0.55)"
          : dimCover
            ? "rgba(5, 5, 8, 0.78)"
            : "rgba(5, 5, 8, 0.7)";
        ctx.fillRect(0, 0, width, height);
      }
    }
  } else if (options.pattern) {
    const pattern = sourceImage(options.pattern);
    if (pattern) {
      ctx.globalAlpha = dimCover ? 0.1 : 0.14;
      ctx.drawImage(pattern, 0, 0, width, height);
      ctx.globalAlpha = 1;
    }
  }

  if (dimCover) {
    const isHero = options.variant === "hero";
    const photoCard =
      Boolean(options.cover) &&
      (options.variant === "project" || options.variant === "experience");
    if (isHero && options.cover) {
      const heroCover = CARD_CONFIG.heroCover;
      const bottom = ctx.createLinearGradient(
        0,
        height * heroCover.bottomVeilStart,
        0,
        height,
      );
      bottom.addColorStop(0, "rgba(5, 5, 8, 0)");
      bottom.addColorStop(
        0.55,
        `rgba(5, 5, 8, ${heroCover.bottomVeilMid})`,
      );
      bottom.addColorStop(1, `rgba(5, 5, 8, ${heroCover.bottomVeilEnd})`);
      ctx.fillStyle = bottom;
      ctx.fillRect(0, 0, width, height);
    } else if (photoCard) {
      const bottom = ctx.createLinearGradient(0, height * 0.45, 0, height);
      bottom.addColorStop(0, "rgba(5, 5, 8, 0)");
      bottom.addColorStop(0.45, "rgba(5, 5, 8, 0.35)");
      bottom.addColorStop(1, "rgba(5, 5, 8, 0.88)");
      ctx.fillStyle = bottom;
      ctx.fillRect(0, 0, width, height);
    } else {
      const glow = ctx.createRadialGradient(
        width / 2,
        height * 0.42,
        height * 0.05,
        width / 2,
        height * 0.42,
        height * 0.55,
      );
      glow.addColorStop(0, `${options.accent}22`);
      glow.addColorStop(1, "rgba(5, 5, 8, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);
    }
  } else {
    if (options.variant === "hero" && options.cover) {
      const heroCover = CARD_CONFIG.heroCover;
      const bottom = ctx.createLinearGradient(
        0,
        height * heroCover.bottomVeilStart,
        0,
        height,
      );
      bottom.addColorStop(0, "rgba(5, 5, 8, 0)");
      bottom.addColorStop(1, `rgba(5, 5, 8, ${heroCover.bottomVeilEnd})`);
      ctx.fillStyle = bottom;
      ctx.fillRect(0, 0, width, height);
    } else {
      const gradient = ctx.createLinearGradient(0, height * 0.28, 0, height);
      gradient.addColorStop(0, "rgba(5, 5, 8, 0.15)");
      gradient.addColorStop(1, "rgba(5, 5, 8, 0.92)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }
  }
}

/** Hard-edged fill — soft shadows read as blur under bloom. */
function fillSharpText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fill: string,
): void {
  ctx.fillStyle = fill;
  ctx.fillText(text, x, y);
}

/**
 * Advance from one alphabetic baseline to the next so descenders / ascenders
 * never collide (same rhythm About detail faces use).
 */
function nextBaseline(
  lastBaseline: number,
  currentSize: number,
  nextSize: number,
  extraGap: number,
): number {
  // Descender pad + explicit gap + ascender pad — keeps Syne from colliding.
  return (
    lastBaseline +
    Math.round(currentSize * 0.38) +
    extraGap +
    Math.round(nextSize * 0.9)
  );
}

function paintOverview(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: CardFaceTextureOptions,
): void {
  const unit = height / 2048;
  const cx = width / 2;
  const shape = options.shape ?? "roundedRect";
  const pointed = shape === "hexagon" || shape === "triangle";
  const fontStack = '"Syne", "Segoe UI", system-ui, sans-serif';

  if (options.logoOnly) {
    const iconSize = Math.round(height * (pointed ? 0.44 : 0.48));
    const iconY = height * 0.5;
    const cover = options.cover ? sourceImage(options.cover) : null;
    if (!options.hideLogo) {
      if (cover) {
        const iw =
          "naturalWidth" in cover && cover.naturalWidth
            ? cover.naturalWidth
            : (cover as CanvasImageSource & { width?: number }).width ||
              iconSize;
        const ih =
          "naturalHeight" in cover && cover.naturalHeight
            ? cover.naturalHeight
            : (cover as CanvasImageSource & { height?: number }).height ||
              iconSize;
        const aspect = iw / Math.max(1, ih);
        const drawW = iconSize * Math.min(1, aspect);
        const drawH = iconSize / Math.max(0.0001, Math.min(1, aspect));
        ctx.drawImage(
          cover,
          cx - drawW / 2,
          iconY - drawH / 2,
          drawW,
          drawH,
        );
      } else {
        drawCardVariantIcon(
          ctx,
          options.variant ?? "skill",
          cx,
          iconY,
          iconSize,
          options.accent,
        );
      }
    }

    if (options.locked) {
      ctx.save();
      ctx.strokeStyle = options.accent;
      ctx.fillStyle = `${options.accent}33`;
      ctx.lineWidth = Math.max(3, iconSize * 0.06);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const lockW = iconSize * 0.36;
      const lockH = iconSize * 0.48;
      const bodyX = cx - lockW / 2;
      const bodyY = iconY - lockH * 0.02;

      const shackleR = lockW * 0.46;
      const shackleY = bodyY - lockH * 0.14;
      ctx.beginPath();
      ctx.arc(cx, shackleY, shackleR, Math.PI, 0, false);
      ctx.stroke();

      ctx.fillRect(bodyX, bodyY, lockW, lockH * 0.56);
      ctx.strokeRect(bodyX, bodyY, lockW, lockH * 0.56);

      ctx.beginPath();
      ctx.arc(cx, bodyY + lockH * 0.28, lockW * 0.07, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
    return;
  }

  const type = options.faceType ?? CARD_FACE_TYPE_DEFAULTS;
  const bounds = contentBounds(width, height, shape);
  const { maxTextWidth, padTop, padBottom } = bounds;
  const availableH = height - padTop - padBottom;

  const hasPhotoCover =
    Boolean(options.cover && sourceImage(options.cover)) &&
    (options.variant === "project" ||
      options.variant === "experience" ||
      options.variant === "hero");

  // Photo cards: bottom stack — section → title → subtitle (About gaps).
  if (hasPhotoCover) {
    const titleSize = Math.round(type.overviewTitleSize * unit);
    const titleLineHeight = Math.round(type.overviewTitleLineHeight * unit);
    const titleMaxLines = pointed
      ? type.overviewTitleMaxLinesHex
      : type.overviewTitleMaxLinesRect;
    const sectionLabel = (options.sectionLabel ?? "Section").toUpperCase();
    const sectionSize = Math.round(type.overviewSectionSize * unit);
    const sectionToTitleGap = Math.round(56 * unit);
    const titleToSubGap = Math.round(
      Math.max(type.detailTitleToSubtitleGap, 64) * unit,
    );
    const subSize = Math.round(type.detailSubtitleSize * unit);
    const subLineHeight = Math.round(type.detailSubtitleLineHeight * unit);
    const hasSubtitle = Boolean(options.subtitle);

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    ctx.font = `700 ${titleSize}px ${fontStack}`;
    const titleLines = breakWrappedLines(
      ctx,
      options.title,
      maxTextWidth,
      titleMaxLines,
    );
    const titleH =
      titleLines.length > 0 ? titleLines.length * titleLineHeight : 0;

    let subtitleLines: string[] = [];
    let subtitleH = 0;
    if (hasSubtitle && options.subtitle) {
      ctx.font = `500 ${subSize}px ${fontStack}`;
      subtitleLines = breakWrappedLines(
        ctx,
        options.subtitle,
        maxTextWidth,
        type.detailSubtitleMaxLines,
      );
      subtitleH =
        subtitleLines.length > 0
          ? subtitleLines.length * subLineHeight
          : 0;
    }

    const sectionToTitleAdvance =
      Math.round(sectionSize * 0.35) +
      sectionToTitleGap +
      Math.round(titleSize * 0.85);
    const titleToSubAdvance =
      subtitleH > 0
        ? Math.round(titleSize * 0.35) +
          titleToSubGap +
          Math.round(subSize * 0.85)
        : 0;
    const stackH =
      sectionSize +
      sectionToTitleAdvance +
      titleH +
      (subtitleH > 0 ? titleToSubAdvance + subtitleH : 0) +
      Math.round(subSize * 0.35);

    const bottomY = height - padBottom - Math.round(32 * unit);
    const cursorY = bottomY - stackH;

    ctx.font = `600 ${sectionSize}px ${fontStack}`;
    const sectionBaseline = cursorY + Math.round(sectionSize * 0.85);
    fillSharpText(ctx, sectionLabel, cx, sectionBaseline, options.accent);

    if (titleLines.length === 0) {
      return;
    }

    const titleFirstBaseline = nextBaseline(
      sectionBaseline,
      sectionSize,
      titleSize,
      sectionToTitleGap,
    );
    ctx.font = `700 ${titleSize}px ${fontStack}`;
    ctx.fillStyle = "#E8EEF6";
    const lastTitleBaseline = wrapText(
      ctx,
      options.title,
      cx,
      titleFirstBaseline,
      maxTextWidth,
      titleLineHeight,
      titleMaxLines,
    );

    if (subtitleLines.length > 0 && options.subtitle) {
      const subFirstBaseline = nextBaseline(
        lastTitleBaseline,
        titleSize,
        subSize,
        titleToSubGap,
      );
      ctx.font = `500 ${subSize}px ${fontStack}`;
      ctx.fillStyle = "rgba(220, 228, 240, 0.92)";
      wrapText(
        ctx,
        options.subtitle,
        cx,
        subFirstBaseline,
        maxTextWidth,
        subLineHeight,
        type.detailSubtitleMaxLines,
      );
    }
    return;
  }

  const iconSize = Math.round(height * (pointed ? 0.28 : 0.3));
  const afterIconGap = Math.round(iconSize * 0.72);
  const titleSize = Math.round(type.overviewTitleSize * unit);
  const titleLineHeight = Math.round(type.overviewTitleLineHeight * unit);
  const titleMaxLines = pointed
    ? type.overviewTitleMaxLinesHex
    : type.overviewTitleMaxLinesRect;
  const sectionLabel = (options.sectionLabel ?? "Section").toUpperCase();
  const sectionSize = Math.round(type.overviewSectionSize * unit);
  const sectionToTitleGap = Math.round(48 * unit);

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  const sectionH = sectionSize;
  ctx.font = `700 ${titleSize}px ${fontStack}`;
  const titleH = measureWrappedHeight(
    ctx,
    options.title,
    maxTextWidth,
    titleLineHeight,
    titleMaxLines,
  );

  const sectionToTitleAdvance =
    Math.round(sectionSize * 0.35) +
    sectionToTitleGap +
    Math.round(titleSize * 0.85);
  const totalH =
    iconSize + afterIconGap + sectionH + sectionToTitleAdvance + titleH;
  let cursorY = padTop + (availableH - totalH) / 2;

  const iconCenterY = cursorY + iconSize / 2;
  drawCardVariantIcon(
    ctx,
    options.variant ?? "hero",
    cx,
    iconCenterY,
    iconSize,
    options.accent,
  );
  cursorY += iconSize + afterIconGap;

  ctx.font = `600 ${sectionSize}px ${fontStack}`;
  const sectionBaseline = cursorY + Math.round(sectionSize * 0.85);
  fillSharpText(ctx, sectionLabel, cx, sectionBaseline, options.accent);

  const titleFirstBaseline = nextBaseline(
    sectionBaseline,
    sectionSize,
    titleSize,
    sectionToTitleGap,
  );
  ctx.font = `700 ${titleSize}px ${fontStack}`;
  ctx.fillStyle = "#E8EEF6";
  wrapText(
    ctx,
    options.title,
    cx,
    titleFirstBaseline,
    maxTextWidth,
    titleLineHeight,
    titleMaxLines,
  );
}

function paintDetail(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: CardFaceTextureOptions,
): void {
  const shape = options.shape ?? "roundedRect";
  const pointed = shape === "hexagon" || shape === "triangle";
  const bounds = contentBounds(width, height, shape);
  const { maxTextWidth, padTop, padBottom } = bounds;
  const availableH = height - padTop - padBottom;
  const unit = height / 2048;
  const cx = width / 2;
  const fontStack = '"Syne", "Segoe UI", system-ui, sans-serif';
  const type = options.faceType ?? CARD_FACE_TYPE_DEFAULTS;

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "center";

  const sectionLabel = (options.sectionLabel ?? "").toUpperCase();
  const sectionSize = Math.round(type.detailSectionSize * unit);
  const sectionGap = Math.round(40 * unit);

  const titleSize = Math.round(type.detailTitleSize * unit);
  const titleLineHeight = Math.round(type.detailTitleLineHeight * unit);
  const titleMaxLines = pointed
    ? type.detailTitleMaxLinesHex
    : type.detailTitleMaxLinesRect;
  ctx.font = `700 ${titleSize}px ${fontStack}`;
  const titleLines = breakWrappedLines(
    ctx,
    options.title,
    maxTextWidth,
    titleMaxLines,
  );
  const titleH =
    titleLines.length > 0 ? titleLines.length * titleLineHeight : 0;

  const subSize = Math.round(type.detailSubtitleSize * unit);
  const subLineHeight = Math.round(type.detailSubtitleLineHeight * unit);
  const titleToSubGap = Math.round(type.detailTitleToSubtitleGap * unit);
  const subToBodyGap = Math.round(type.detailSubtitleToBodyGap * unit);
  let subtitleH = 0;
  let subtitleLines: string[] = [];
  if (options.subtitle) {
    ctx.font = `500 ${subSize}px ${fontStack}`;
    subtitleLines = breakWrappedLines(
      ctx,
      options.subtitle,
      maxTextWidth,
      type.detailSubtitleMaxLines,
    );
    subtitleH =
      subtitleLines.length > 0
        ? subtitleLines.length * subLineHeight
        : 0;
  }

  const sectionBlock = sectionLabel ? sectionSize + sectionGap : 0;
  const titleToSubAdvance =
    titleH > 0 && subtitleH > 0
      ? Math.round(titleSize * 0.38) + titleToSubGap + Math.round(subSize * 0.9)
      : titleH > 0
        ? Math.round(titleSize * 0.38) + titleToSubGap
        : 0;
  const subToBodyAdvance =
    subtitleH > 0
      ? Math.round(subSize * 0.38) + subToBodyGap
      : titleH > 0
        ? Math.round(titleSize * 0.38) + subToBodyGap
        : subToBodyGap;

  const fixedH =
    sectionBlock +
    titleH +
    (subtitleH > 0 ? titleToSubAdvance + subtitleH : 0) +
    subToBodyAdvance;

  const bodySizeBase = Math.round(type.detailBodySize * unit);
  const bodyLineBase = Math.round(type.detailBodyLineHeight * unit);
  const bodyBlocks = (options.bodyLines ?? []).slice(
    0,
    type.detailBodyMaxBlocks,
  );

  ctx.font = `500 ${bodySizeBase}px ${fontStack}`;
  let bodyBaseH = 0;
  for (const line of bodyBlocks) {
    const blockH = measureWrappedHeight(
      ctx,
      line,
      maxTextWidth,
      bodyLineBase,
      type.detailBodyMaxLinesPerBlock,
    );
    if (blockH > 0) {
      bodyBaseH +=
        (bodyBaseH > 0 ? Math.round(bodyLineBase * 0.55) : 0) + blockH;
    }
  }

  const bodyGrow = capBodyGrowForHierarchy(
    resolveBodyGrow(
      fixedH,
      bodyBaseH,
      availableH,
      type.bodyGrowMin,
      type.bodyGrowMax,
    ),
    bodySizeBase,
    titleSize,
  );
  const bodySize = Math.round(bodySizeBase * bodyGrow);
  const bodyLineHeight = Math.round(bodyLineBase * bodyGrow);
  const bodyH = bodyBaseH * bodyGrow;
  const totalH = fixedH + bodyH;

  let cursorY = padTop + Math.max(0, (availableH - totalH) / 2);

  if (sectionLabel) {
    ctx.font = `600 ${sectionSize}px ${fontStack}`;
    fillSharpText(ctx, sectionLabel, cx, cursorY + sectionSize, options.accent);
    cursorY += sectionBlock;
  }

  let lastBaseline = cursorY;
  if (titleLines.length > 0) {
    const titleFirstBaseline = cursorY + Math.round(titleSize * 0.9);
    ctx.font = `700 ${titleSize}px ${fontStack}`;
    ctx.fillStyle = "#E8EEF6";
    lastBaseline = wrapText(
      ctx,
      options.title,
      cx,
      titleFirstBaseline,
      maxTextWidth,
      titleLineHeight,
      titleMaxLines,
    );
    cursorY = lastBaseline;
  }

  if (options.subtitle && subtitleLines.length > 0) {
    const subFirstBaseline = nextBaseline(
      lastBaseline,
      titleSize,
      subSize,
      titleToSubGap,
    );
    ctx.font = `500 ${subSize}px ${fontStack}`;
    ctx.fillStyle = "rgba(220, 228, 240, 0.92)";
    lastBaseline = wrapText(
      ctx,
      options.subtitle,
      cx,
      subFirstBaseline,
      maxTextWidth,
      subLineHeight,
      type.detailSubtitleMaxLines,
    );
    cursorY = lastBaseline;
  }

  if (bodyBlocks.length > 0) {
    const prevSize = options.subtitle && subtitleH > 0 ? subSize : titleSize;
    const bodyFirstBaseline = nextBaseline(
      lastBaseline,
      prevSize,
      bodySize,
      subToBodyGap,
    );
    ctx.fillStyle = "rgba(226, 232, 242, 0.95)";
    ctx.font = `500 ${bodySize}px ${fontStack}`;
    cursorY = bodyFirstBaseline;
    for (let i = 0; i < bodyBlocks.length; i += 1) {
      const line = bodyBlocks[i] ?? "";
      lastBaseline = wrapText(
        ctx,
        line,
        cx,
        cursorY,
        maxTextWidth,
        bodyLineHeight,
        type.detailBodyMaxLinesPerBlock,
      );
      cursorY =
        lastBaseline +
        Math.round(bodySize * 0.28) +
        Math.round(bodyLineHeight * 0.35) +
        Math.round(bodySize * 0.82);
    }
  }
}

/**
 * Content texture clipped to the placeholder silhouette (hex / rect / ellipse).
 * Overview keeps icons + labels readable from the corridor; detail fills after focus.
 */
export function createCardFaceTexture(
  options: CardFaceTextureOptions,
): CanvasTexture {
  const width = options.width ?? 1536;
  const height = options.height ?? 2048;
  const shape = options.shape ?? "roundedRect";
  const cornerRadiusRatio = options.cornerRadiusRatio ?? 0.1;
  const drawRim = options.drawRim ?? false;
  const mode = options.mode ?? "overview";

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    const empty = new CanvasTexture(canvas);
    empty.colorSpace = SRGBColorSpace;
    return empty;
  }

  ctx.clearRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  clipToShape(ctx, shape, width, height, cornerRadiusRatio);
  paintBackground(ctx, width, height, options, mode === "overview");

  if (drawRim) {
    strokeShapeRim(ctx, shape, width, height, options.accent, cornerRadiusRatio);
  }

  if (mode === "detail") {
    paintDetail(ctx, width, height, options);
  } else {
    paintOverview(ctx, width, height, options);
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}
