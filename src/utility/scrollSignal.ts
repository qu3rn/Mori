/**
 * Shared scroll velocity signal consumed by the PixiJS animation loop each frame.
 *
 * Using a module-level singleton avoids the need for React context or state in
 * the animation path — the Pixi ticker reads this every frame with zero overhead.
 *
 * Updated by useScrollState; decayed inside the Pixi ticker for natural falloff.
 */
export const scrollSignal = {
  /** Normalised scroll speed 0–1. Set on scroll events, decayed per-frame in the Pixi ticker. */
  velocity: 0,
  /** Scroll progress through the page as a 0–1 fraction. */
  progress: 0,
}
