import type { Graphics } from 'pixi.js'
import type { Point, Connection, Triangle, SceneConfig } from './types'

/**
 * Redraw the entire constellation scene into `gfx` for the current frame.
 *
 * Draw order: filled triangles → connection lines → points.
 * Each layer is batched into a single fill/stroke call so the GPU sees as few
 * state changes as possible.
 */
export function drawScene(
  gfx: Graphics,
  points: Point[],
  connections: Connection[],
  triangles: Triangle[],
  config: SceneConfig,
): void {
  gfx.clear()

  // ── 1. Filled geometric shapes ─────────────────────────────────────────────
  // Drawn first so they sit under the lines and points.
  // Using a single fill() call batches all triangle paths together.
  if (triangles.length > 0) {
    for (const tri of triangles) {
      gfx.moveTo(tri.a.x, tri.a.y)
      gfx.lineTo(tri.b.x, tri.b.y)
      gfx.lineTo(tri.c.x, tri.c.y)
      gfx.closePath()
    }
    gfx.fill({ color: config.shapeColor, alpha: config.shapeAlpha })
  }

  // ── 2. Connection lines ────────────────────────────────────────────────────
  // All lines share the same style, so they can be submitted as one batch.
  if (connections.length > 0) {
    for (const conn of connections) {
      gfx.moveTo(conn.a.x, conn.a.y)
      gfx.lineTo(conn.b.x, conn.b.y)
    }
    gfx.stroke({ color: config.lineColor, alpha: config.lineAlpha, width: 1 })
  }

  // ── 3. Points ──────────────────────────────────────────────────────────────
  for (const p of points) {
    gfx.circle(p.x, p.y, 1.5)
  }
  gfx.fill({ color: config.pointColor, alpha: config.pointAlpha })
}
