import { useConstellationBackground } from './useConstellationBackground'

/**
 * Full-viewport animated background: drifting points connected by lines,
 * with low-opacity geometric triangles forming and dissolving between clusters.
 *
 * Absolutely positioned, pointer-events disabled — never blocks page content.
 *
 * Usage (when ready to integrate):
 *   Replace <PixiBackground /> with <ConstellationBackground /> in Hero.tsx
 */
export default function ConstellationBackground() {
  const containerRef = useConstellationBackground()

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
      }}
    />
  )
}
