/** Minimal geometry needed to draw an equilateral triangle (used by both Snowflake and Fragment). */
export interface TriangularParticle {
  x: number
  y: number
  size: number
  rotation: number
}

/** A single triangular snowflake particle. */
export interface Snowflake extends TriangularParticle {
  /** Base horizontal drift (natural state). */
  vx: number
  /** Base fall speed (natural state). */
  vy: number
  /** Temporary horizontal perturbation from mouse repulsion — decays each frame. */
  pvx: number
  /** Temporary vertical perturbation from mouse repulsion — decays each frame. */
  pvy: number
  rotSpeed: number
  /** Phase offset for sinusoidal horizontal sway (radians). */
  phase: number
  /**
   * Hover tint blend factor: 0 = white, 1 = earthy orange.
   * Lerped toward a target value each frame — never jumps abruptly.
   */
  tint: number
}

export interface SnowPoint {
  x: number
  y: number
}

export interface SnowConnection {
  a: Snowflake
  b: Snowflake
}

/** A disintegration shard — spawned when a snowflake breaks apart. */
export interface Fragment extends TriangularParticle {
  vx: number
  vy: number
  rotSpeed: number
  /** Current opacity; decays toward 0 each frame. */
  alpha: number
  /** Alpha lost per normalised tick (deltaTime ≈ 1 at 60 fps). */
  fadeRate: number
}

/**
 * A single shard of the orange click-burst.
 * Travels outward from the click point and fades within ~1 second.
 */
export interface BurstParticle {
  x: number
  y: number
  /** Direction of travel (radians). */
  angle: number
  /** Current speed (px/tick at 60 fps). */
  speed: number
  /** Visible shard length in px (comet-style: tail trails behind the head). */
  length: number
  alpha: number
  fadeRate: number
}

export interface SnowConfig {
  count: number
  minSize: number
  maxSize: number
  /** Minimum fall speed in px per frame (at 60 fps). */
  minSpeed: number
  /** Maximum fall speed in px per frame (at 60 fps). */
  maxSpeed: number
  /** Peak amplitude of sinusoidal horizontal sway (px/frame). */
  swayAmplitude: number
  /** Sway oscillation rate (radians / ms). */
  swayFrequency: number
  connectionDistance: number
  repulsionRadius: number
  repulsionStrength: number
  color: number
  /** Stroke alpha for triangle outlines. */
  alpha: number
  /** Alpha for connection lines. */
  lineAlpha: number
  /**
   * Normalised y threshold (0–1) below which a flake auto-disintegrates.
   * 0.67 means the bottom third of the hero section.
   */
  breakThresholdFraction: number
  /** Triangle shards spawned per disintegration. */
  fragmentCount: number
}
