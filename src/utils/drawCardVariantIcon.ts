import type { ContentCardVariant } from "@shared-types/content";

/**
 * Stroke icons drawn onto card-face canvases.
 * Keeps overview faces readable at distance without shipping icon assets.
 */
export function drawCardVariantIcon(
  ctx: CanvasRenderingContext2D,
  variant: ContentCardVariant,
  cx: number,
  cy: number,
  size: number,
  accent: string,
): void {
  ctx.save();
  ctx.strokeStyle = accent;
  ctx.fillStyle = accent;
  ctx.lineWidth = Math.max(3, size * 0.06);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  switch (variant) {
    case "hero":
      drawHeroIcon(ctx, cx, cy, size);
      break;
    case "project":
      drawProjectIcon(ctx, cx, cy, size);
      break;
    case "skill":
      drawSkillIcon(ctx, cx, cy, size);
      break;
    case "contact":
      drawContactIcon(ctx, cx, cy, size);
      break;
    case "experience":
      drawProjectIcon(ctx, cx, cy, size);
      break;
    case "timeline":
      drawTimelineIcon(ctx, cx, cy, size);
      break;
    case "certificate":
      drawSkillIcon(ctx, cx, cy, size);
      break;
    default:
      drawHeroIcon(ctx, cx, cy, size);
  }

  ctx.restore();
}

function drawHeroIcon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
): void {
  const r = size * 0.18;
  ctx.beginPath();
  ctx.arc(cx, cy - size * 0.18, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy + size * 0.42, size * 0.38, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
}

function drawProjectIcon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
): void {
  const w = size * 0.7;
  const h = size * 0.55;
  const x = cx - w / 2;
  const y = cy - h / 2;
  const r = size * 0.06;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w * 0.38, y);
  ctx.lineTo(x + w * 0.48, y + h * 0.18);
  ctx.lineTo(x + w - r, y + h * 0.18);
  ctx.quadraticCurveTo(x + w, y + h * 0.18, x + w, y + h * 0.18 + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.stroke();
}

function drawSkillIcon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
): void {
  const r = size * 0.36;
  ctx.beginPath();
  for (let i = 0; i < 6; i += 1) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, cy - r * 0.45);
  ctx.lineTo(cx + r * 0.22, cy + r * 0.1);
  ctx.lineTo(cx - r * 0.08, cy + r * 0.1);
  ctx.lineTo(cx, cy + r * 0.45);
  ctx.lineTo(cx - r * 0.22, cy - r * 0.05);
  ctx.lineTo(cx + r * 0.08, cy - r * 0.05);
  ctx.closePath();
  ctx.globalAlpha = 0.85;
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawContactIcon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
): void {
  const w = size * 0.72;
  const h = size * 0.48;
  const x = cx - w / 2;
  const y = cy - h / 2;
  ctx.strokeRect(x, y, w, h);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(cx, cy + h * 0.12);
  ctx.lineTo(x + w, y);
  ctx.stroke();
}

function drawTimelineIcon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
): void {
  ctx.beginPath();
  ctx.moveTo(cx, cy - size * 0.4);
  ctx.lineTo(cx, cy + size * 0.4);
  ctx.stroke();
  for (const t of [-0.28, 0, 0.28]) {
    ctx.beginPath();
    ctx.arc(cx, cy + size * t, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
  }
}
