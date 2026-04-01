import { useHeroBackground } from './useHeroBackground'

/**
 * Hero section animated background: triangular snowflakes drifting downward
 * with connecting lines and mouse-driven repulsion.
 *
 * Absolutely positioned — must be placed inside a `position: relative` container.
 * `pointer-events: none` ensures it never blocks any UI interaction.
 *
 * ── How to integrate ────────────────────────────────────────────────────────
 * In Hero.tsx, add as the first child of the section:
 *
 *   import HeroBackground from '@/components/hero-background/HeroBackground'
 *
 *   <section id="hero" className="relative min-h-screen ...">
 *     <HeroBackground />
 *     <div className="relative z-10 ..."> {content} </div>
 *   </section>
 */
export default function HeroBackground() {
  const containerRef = useHeroBackground()

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
