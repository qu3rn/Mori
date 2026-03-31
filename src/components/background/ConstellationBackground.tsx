import { useConstellationBackground } from './useConstellationBackground'

/**
 * Full-viewport animated background: drifting points connected by lines,
 * with low-opacity geometric triangles forming and dissolving between clusters.
 *
 * Fixed-positioned so it spans the entire viewport across all page sections.
 * pointer-events: none ensures it never intercepts any UI interaction.
 */
export default function ConstellationBackground() {
  const containerRef = useConstellationBackground()

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
