import type { Graphics } from 'pixi.js'
import type { Snowflake, Fragment, BurstParticle, SnowConnection, SnowConfig } from './types'
import { getTrianglePoints } from './snowflakeSystem'
import { drawCursor, drawBurst } from './cursorSystem'

/** Matches the portfolio accent colour (#c8622a). */
const ACCENT = 0xc8622a

/**
 * Linear interpolation between two packed RGB hex colours.
 * Used to blend snowflake white toward earthy orange on hover.
 */
function lerpColor(a: number, b: number, t: number): number {
  const ar = (a >> 16) & 0xff, ag = (a >> 8) & 0xff, ab = a & 0xff
  const br = (b >> 16) & 0xff, bg = (b >> 8) & 0xff, bb = b & 0xff
  return (
    (Math.round(ar + (br - ar) * t) << 16) |
    (Math.round(ag + (bg - ag) * t) << 8) |
    Math.round(ab + (bb - ab) * t)
  )
}

/**
 * Redraw the hero scene for the current frame.
 *
 * Draw order (back to front):
 *   1. Connection lines       — faint static lines between nearby flakes
 *   2. Snowflake fragments    — triangle shards from disintegration
 *   3. Untinted snowflakes    — white, single batched stroke call
 *   4. Tinted snowflakes      — orange-blended, one stroke call each
 *   5. Click burst shards     — orange radial lines, one stroke call each
 *   6. X cursor               — white, on top of everything, single stroke call
 *
 * The cursor and burst are drawn only when `cursorVisible` is true
 * (i.e., not a touch device and mouse is within canvas bounds).
 */
export function drawHeroScene(
  gfx: Graphics,
  flakes: Snowflake[],
  fragments: Fragment[],
  burst: BurstParticle[],
  connections: SnowConnection[],
  config: SnowConfig,
  cursorX: number,
  cursorY: number,
  cursorVisible: boolean,
): void {
  gfx.clear()

  // ── 1. Connection lines ─────────────────────────────────────────────────────
  if (connections.length > 0) {
    for (const conn of connections) {
      gfx.moveTo(conn.a.x, conn.a.y)
      gfx.lineTo(conn.b.x, conn.b.y)
    }
    gfx.stroke({ color: config.color, alpha: config.lineAlpha, width: 1 })
  }

  // ── 2. Disintegration fragments ─────────────────────────────────────────────
  for (const frag of fragments) {
    const [p0, p1, p2] = getTrianglePoints(frag)
    gfx.moveTo(p0.x, p0.y)
    gfx.lineTo(p1.x, p1.y)
    gfx.lineTo(p2.x, p2.y)
    gfx.closePath()
    gfx.stroke({ color: config.color, alpha: frag.alpha, width: 0.8 })
  }

  // ── 3. Untinted snowflakes — all paths accumulated, single stroke call ──────
  for (const sf of flakes) {
    if (sf.tint > 0.01) continue
    const [p0, p1, p2] = getTrianglePoints(sf)
    gfx.moveTo(p0.x, p0.y)
    gfx.lineTo(p1.x, p1.y)
    gfx.lineTo(p2.x, p2.y)
    gfx.closePath()
  }
  gfx.stroke({ color: config.color, alpha: config.alpha, width: 1 })

  // ── 4. Tinted snowflakes — blended colour, separate stroke per flake ────────
  for (const sf of flakes) {
    if (sf.tint <= 0.01) continue
    const blendedColor = lerpColor(config.color, ACCENT, sf.tint * 0.85)
    const [p0, p1, p2] = getTrianglePoints(sf)
    gfx.moveTo(p0.x, p0.y)
    gfx.lineTo(p1.x, p1.y)
    gfx.lineTo(p2.x, p2.y)
    gfx.closePath()
    gfx.stroke({
      color: blendedColor,
      alpha: config.alpha + sf.tint * 0.22,
      width: 1.2,
    })
  }

  // ── 5. Click burst shards + 6. X cursor ────────────────────────────────────
  // Both are cursor-driven so skip on touch devices / out-of-canvas mouse.
  if (cursorVisible) {
    drawBurst(gfx, burst)
    drawCursor(gfx, cursorX, cursorY)
  }
}
