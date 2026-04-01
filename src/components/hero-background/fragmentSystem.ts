import type { Fragment, Snowflake, SnowConfig } from './types'

/**
 * Spawn disintegration shards from a snowflake at the moment of breakup.
 *
 * Fragments spread in random directions with gentle velocity, rotate slowly,
 * and carry a boosted alpha before fading to nothing.
 */
export function spawnFragments(sf: Snowflake, config: SnowConfig): Fragment[] {
  return Array.from({ length: config.fragmentCount }, () => {
    const angle = Math.random() * Math.PI * 2
    // Spread speed: slow enough to feel airy, not explosive
    const speed = 0.8 + Math.random() * 1.6

    return {
      x: sf.x,
      y: sf.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rotation: sf.rotation + (Math.random() - 0.5) * 0.8,
      rotSpeed: (Math.random() - 0.5) * 0.05,
      // Enforce a minimum visible size regardless of source circumradius.
      // Without the clamp, fragments from the smallest flakes are sub-pixel.
      size: Math.max(sf.size * (0.4 + Math.random() * 0.3), 3.5),
      // Visibly brighter than the source for a soft momentary glow
      alpha: Math.min(config.alpha * 1.7, 0.75),
      // Fade duration: 1.2–2.4 s at 60 fps — long enough to be seen clearly
      fadeRate: 0.007 + Math.random() * 0.007,
    }
  })
}

/**
 * Advance all fragments by one tick.
 * Applies velocity, rotation, gentle deceleration, and alpha decay.
 * Mutates in place — caller should filter out fragments where `alpha <= 0.01`.
 */
export function updateFragments(fragments: Fragment[], dt: number): void {
  for (const frag of fragments) {
    frag.x += frag.vx * dt
    frag.y += frag.vy * dt
    frag.rotation += frag.rotSpeed * dt
    frag.alpha -= frag.fadeRate * dt

    // Gentle drag — fragments slow to a near-drift rather than stopping abruptly
    frag.vx *= 0.97
    frag.vy *= 0.97
  }
}
