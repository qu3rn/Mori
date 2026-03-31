import type { Point, Connection, Triangle, SceneConfig } from './types'

// ─── Point lifecycle ───────────────────────────────────────────────────────────

export function createPoints(config: SceneConfig, width: number, height: number): Point[] {
  return Array.from({ length: config.pointCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    // Spread velocity symmetrically around zero so the field has no net drift
    vx: (Math.random() - 0.5) * config.speed * 2,
    vy: (Math.random() - 0.5) * config.speed * 2,
  }))
}

/**
 * Advance all points by `delta` (PixiJS ticker.deltaTime — 1 at 60 fps).
 * Points wrap around a margin beyond the visible area so they fade back in
 * smoothly rather than jumping.
 */
export function updatePoints(
  points: Point[],
  width: number,
  height: number,
  delta: number,
): void {
  const dt = Math.min(delta, 2.5) // clamp large spikes (e.g. tab backgrounded)
  const margin = 100

  for (const p of points) {
    p.x += p.vx * dt
    p.y += p.vy * dt

    if (p.x < -margin) p.x = width + margin
    else if (p.x > width + margin) p.x = -margin

    if (p.y < -margin) p.y = height + margin
    else if (p.y > height + margin) p.y = -margin
  }
}

// ─── Spatial queries ───────────────────────────────────────────────────────────

/**
 * Return every pair of points whose Euclidean distance is below `threshold`.
 * O(n²) — acceptable for the point counts used here (~30–65 points).
 */
export function buildConnections(points: Point[], threshold: number): Connection[] {
  const result: Connection[] = []
  const threshSq = threshold * threshold
  const n = points.length

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const dx = points[i].x - points[j].x
      const dy = points[i].y - points[j].y
      if (dx * dx + dy * dy < threshSq) {
        result.push({ a: points[i], b: points[j] })
      }
    }
  }

  return result
}

/**
 * Return triplets of points where all three pairwise distances are below
 * `threshold`.  A hard cap prevents the O(n³) inner loop from ever blowing
 * the frame budget — in practice the cap is rarely hit given the density used.
 */
export function buildTriangles(points: Point[], threshold: number): Triangle[] {
  const result: Triangle[] = []
  const threshSq = threshold * threshold
  const n = points.length
  const cap = 28

  outer: for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const dxAB = points[i].x - points[j].x
      const dyAB = points[i].y - points[j].y
      if (dxAB * dxAB + dyAB * dyAB > threshSq) continue

      for (let k = j + 1; k < n; k++) {
        const dxAC = points[i].x - points[k].x
        const dyAC = points[i].y - points[k].y
        if (dxAC * dxAC + dyAC * dyAC > threshSq) continue

        const dxBC = points[j].x - points[k].x
        const dyBC = points[j].y - points[k].y
        if (dxBC * dxBC + dyBC * dyBC > threshSq) continue

        result.push({ a: points[i], b: points[j], c: points[k] })
        if (result.length >= cap) break outer
      }
    }
  }

  return result
}
