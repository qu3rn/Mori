import type { Graphics } from 'pixi.js'
import type { BurstParticle } from './types'

// ─── Constants ─────────────────────────────────────────────────────────────────

/** X cursor: two diagonal arms, 7 px from centre to tip. */
const CURSOR_ARM_RADIUS = 7
const CURSOR_COLOR = 0xffffff
const CURSOR_ALPHA = 0.62
const CURSOR_STROKE_WIDTH = 1.2

/** Click burst: 8 evenly-spaced radial shards in earthy orange. */
const BURST_SHARD_COUNT = 8
const BURST_COLOR = 0xc8622a

// ─── Burst lifecycle ───────────────────────────────────────────────────────────

/**
 * Spawn a set of angular shards radiating from the click point.
 * Shards decelerate and fade within roughly 1–1.4 seconds.
 */
export function spawnBurst(x: number, y: number): BurstParticle[] {
  return Array.from({ length: BURST_SHARD_COUNT }, (_, i) => {
    // Evenly distribute across full circle, then add a small random jitter
    const base = (i / BURST_SHARD_COUNT) * Math.PI * 2
    const angle = base + (Math.random() - 0.5) * 0.30  // ±~9°

    return {
      x,
      y,
      angle,
      speed: 1.8 + Math.random() * 2.4,
      // Shorter shards feel like splinters, longer ones like radial sparks
      length: 7 + Math.random() * 9,
      alpha: 0.88,
      // Vary lifetime slightly so shards disappear at different times
      fadeRate: 0.018 + Math.random() * 0.016,
    }
  })
}

/**
 * Advance all burst particles by one tick.
 * Mutates in place — caller should filter `alpha <= 0.01`.
 */
export function updateBurst(particles: BurstParticle[], dt: number): void {
  for (const p of particles) {
    p.x += Math.cos(p.angle) * p.speed * dt
    p.y += Math.sin(p.angle) * p.speed * dt
    // Decelerate: head slows; combined with alpha fade this creates a
    // "dissolving shard" feel rather than a hard stop.
    p.speed *= Math.pow(0.95, dt)
    p.alpha -= p.fadeRate * dt
  }
}

// ─── Draw ──────────────────────────────────────────────────────────────────────

/**
 * Draw the X-shaped cursor centred on (x, y).
 * This is a single batched stroke call — two arms, no fill.
 */
export function drawCursor(gfx: Graphics, x: number, y: number): void {
  const r = CURSOR_ARM_RADIUS
  // Arm 1: ↖ → ↘
  gfx.moveTo(x - r, y - r)
  gfx.lineTo(x + r, y + r)
  // Arm 2: ↗ → ↙
  gfx.moveTo(x + r, y - r)
  gfx.lineTo(x - r, y + r)
  gfx.stroke({ color: CURSOR_COLOR, alpha: CURSOR_ALPHA, width: CURSOR_STROKE_WIDTH })
}

/**
 * Draw the click burst shards.
 *
 * Each shard has a unique alpha so they cannot share a single stroke call.
 * Burst counts are small (≤ 8) and short-lived so individual calls are fine.
 *
 * Shard is rendered as a "comet": the head is the current position and the
 * tail stretches back along the travel direction by `length` pixels.
 */
export function drawBurst(gfx: Graphics, particles: BurstParticle[]): void {
  for (const p of particles) {
    const tailX = p.x - Math.cos(p.angle) * p.length
    const tailY = p.y - Math.sin(p.angle) * p.length
    gfx.moveTo(tailX, tailY)
    gfx.lineTo(p.x, p.y)
    gfx.stroke({ color: BURST_COLOR, alpha: p.alpha, width: 1.1 })
  }
}
