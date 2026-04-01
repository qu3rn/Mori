import type { Snowflake, SnowConfig, SnowConnection, SnowPoint, TriangularParticle } from './types'

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

// ─── Lifecycle ─────────────────────────────────────────────────────────────────

/**
 * Spawn a single snowflake at the top edge, ready to drift downward.
 * Used both for initial population and for respawning after disintegration.
 */
export function spawnSnowflake(config: SnowConfig, width: number): Snowflake {
  const vy = lerp(config.minSpeed, config.maxSpeed, Math.random())
  return {
    x: Math.random() * width,
    y: -60 - Math.random() * 40,
    vx: (Math.random() - 0.5) * 0.3,
    vy,
    pvx: 0,
    pvy: 0,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.025,
    size: lerp(config.minSize, config.maxSize, Math.random()),
    phase: Math.random() * Math.PI * 2,
    tint: 0,
  }
}

/**
 * Spawn the initial snowflake field staggered vertically so the screen fills
 * immediately rather than draining in from the top on first load.
 */
export function createSnowflakes(
  config: SnowConfig,
  width: number,
  height: number,
): Snowflake[] {
  return Array.from({ length: config.count }, () => {
    const sf = spawnSnowflake(config, width)
    // Override y: spread across safe zone (above break threshold) so no flake
    // immediately auto-breaks on the very first frame after load.
    sf.y = Math.random() * (height * config.breakThresholdFraction) - 100
    return sf
  })
}

// ─── Update ────────────────────────────────────────────────────────────────────

/**
 * Advance all snowflakes by one tick.
 *
 * Returns the subset of flakes that crossed the auto-break threshold —
 * the caller is responsible for removing them from the live array and
 * spawning disintegration fragments.
 *
 * `time` is cumulative elapsed ms (from ticker.deltaMS) used to drive the sway.
 */
export function updateSnowflakes(
  flakes: Snowflake[],
  width: number,
  height: number,
  delta: number,
  time: number,
  config: SnowConfig,
): Snowflake[] {
  const dt = Math.min(delta, 2.5)
  const margin = 60
  const breakY = height * config.breakThresholdFraction
  const toBreak: Snowflake[] = []

  for (const sf of flakes) {
    // Decay mouse perturbation back towards zero
    sf.pvx *= 0.88
    sf.pvy *= 0.88

    // Sinusoidal horizontal sway — each flake has its own phase so they drift
    // independently rather than swinging in sync
    const sway = config.swayAmplitude * Math.sin(sf.phase + time * config.swayFrequency)

    sf.x += (sf.vx + sway + sf.pvx) * dt
    sf.y += (sf.vy + sf.pvy) * dt
    sf.rotation += sf.rotSpeed * dt

    // Horizontal wrap
    if (sf.x < -margin) sf.x = width + margin
    else if (sf.x > width + margin) sf.x = -margin

    // Auto-disintegrate at the break threshold
    if (sf.y > breakY) {
      toBreak.push(sf)
    } else if (sf.y > height + margin) {
      // Safety respawn for any flake that bypasses the threshold (e.g. after a resize)
      sf.x = Math.random() * width
      sf.y = -margin - Math.random() * 40
      sf.pvx = 0
      sf.pvy = 0
    }
  }

  return toBreak
}

// ─── Mouse interaction ─────────────────────────────────────────────────────────

/**
 * Push snowflakes away from the cursor.  Uses viewport coordinates — the host
 * component should track mouse position relative to the viewport since the
 * canvas is viewport-sized (`resizeTo: window`).
 */
export function applyMouseRepulsion(
  flakes: Snowflake[],
  mouseX: number,
  mouseY: number,
  config: SnowConfig,
): void {
  const { repulsionRadius: radius, repulsionStrength: strength } = config
  const radiusSq = radius * radius

  for (const sf of flakes) {
    const dx = sf.x - mouseX
    const dy = sf.y - mouseY
    const distSq = dx * dx + dy * dy

    if (distSq < radiusSq && distSq > 0.01) {
      const dist = Math.sqrt(distSq)
      // Force falls off linearly to zero at `radius`
      const force = (1 - dist / radius) * strength * 0.12
      sf.pvx += (dx / dist) * force
      sf.pvy += (dy / dist) * force
    }
  }
}

// ─── Hover tint ────────────────────────────────────────────────────────────────

/**
 * Find the snowflake closest to (x, y), within `maxDist` px.
 * Returns null when the cursor is far from all particles.
 */
export function findNearestSnowflake(
  flakes: Snowflake[],
  x: number,
  y: number,
  maxDist: number,
): Snowflake | null {
  let nearest: Snowflake | null = null
  let nearestDist = maxDist * maxDist

  for (const sf of flakes) {
    const dx = sf.x - x
    const dy = sf.y - y
    const d2 = dx * dx + dy * dy
    if (d2 < nearestDist) {
      nearestDist = d2
      nearest = sf
    }
  }

  return nearest
}

/**
 * Smoothly shift the tint of all snowflakes.
 * The nearest snowflake lerps toward full tint; all others decay toward zero.
 * `dt` is ticker.deltaTime (≈ 1 at 60 fps) for framerate-independent easing.
 */
export function lerpSnowflakeTints(
  flakes: Snowflake[],
  nearest: Snowflake | null,
  dt: number,
): void {
  for (const sf of flakes) {
    if (sf === nearest) {
      sf.tint += (1 - sf.tint) * 0.15 * dt
    } else {
      sf.tint *= Math.pow(0.88, dt)
    }
  }
}

// ─── Spatial queries ───────────────────────────────────────────────────────────

/** O(n²) — acceptable for the snowflake counts used (~25–55 flakes). */
export function buildSnowConnections(
  flakes: Snowflake[],
  threshold: number,
): SnowConnection[] {
  const result: SnowConnection[] = []
  const threshSq = threshold * threshold
  const n = flakes.length

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const dx = flakes[i].x - flakes[j].x
      const dy = flakes[i].y - flakes[j].y
      if (dx * dx + dy * dy < threshSq) {
        result.push({ a: flakes[i], b: flakes[j] })
      }
    }
  }

  return result
}

// ─── Geometry ──────────────────────────────────────────────────────────────────

/** Return the three vertices of an equilateral triangle (works for both Snowflake and Fragment). */
export function getTrianglePoints(p: TriangularParticle): [SnowPoint, SnowPoint, SnowPoint] {
  const step = (2 * Math.PI) / 3
  return [
    { x: p.x + p.size * Math.cos(p.rotation),            y: p.y + p.size * Math.sin(p.rotation) },
    { x: p.x + p.size * Math.cos(p.rotation + step),     y: p.y + p.size * Math.sin(p.rotation + step) },
    { x: p.x + p.size * Math.cos(p.rotation + 2 * step), y: p.y + p.size * Math.sin(p.rotation + 2 * step) },
  ]
}
