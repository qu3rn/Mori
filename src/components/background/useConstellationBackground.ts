import { useEffect, useRef, type RefObject } from 'react'
import { Application, Graphics } from 'pixi.js'
import { createPoints, updatePoints, buildConnections, buildTriangles } from './particleSystem'
import { drawScene } from './constellationScene'
import type { SceneConfig } from './types'

// ─── Config presets ────────────────────────────────────────────────────────────

const BASE: SceneConfig = {
  pointCount: 65,
  connectionDistance: 155,
  shapeDistance: 92,
  speed: 0.35,
  // White points and lines blend with the dark background
  pointColor: 0xffffff,
  lineColor: 0xffffff,
  // Earthy orange for the filled triangles — very faint
  shapeColor: 0xc8622a,
  pointAlpha: 0.40,
  lineAlpha: 0.08,
  shapeAlpha: 0.045,
}

function resolveConfig(width: number): SceneConfig {
  if (width < 640) {
    return { ...BASE, pointCount: 28, connectionDistance: 115, shapeDistance: 70 }
  }
  if (width < 1024) {
    return { ...BASE, pointCount: 44, connectionDistance: 135, shapeDistance: 82 }
  }
  return BASE
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Initialises a PixiJS Application, runs the constellation animation loop,
 * and tears everything down on unmount.
 *
 * Returns a ref that must be attached to the container element.
 * All Pixi-specific logic is contained in this hook and its module dependencies.
 */
export function useConstellationBackground(): RefObject<HTMLDivElement | null> {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mountNode = containerRef.current
    if (!mountNode) return

    const app = new Application()
    let running = true
    let initialized = false
    let cleanupResize: (() => void) | null = null

    ;(async () => {
      await app.init({
        resizeTo: window,
        backgroundAlpha: 0,
        antialias: true,
        autoDensity: true,
        resolution: window.devicePixelRatio ?? 1,
      })

      initialized = true

      // Guard: component may have unmounted while init was awaiting
      if (!running) {
        app.destroy(true, true)
        return
      }

      // Mount canvas behind all page content
      app.canvas.style.position = 'absolute'
      app.canvas.style.inset = '0'
      app.canvas.style.pointerEvents = 'none'
      mountNode.appendChild(app.canvas)

      // Build initial scene state based on the current viewport
      let config = resolveConfig(app.screen.width)
      let points = createPoints(config, app.screen.width, app.screen.height)
      const gfx = new Graphics()
      app.stage.addChild(gfx)

      // Rebuild the point field when the viewport resizes meaningfully
      const onResize = () => {
        config = resolveConfig(app.screen.width)
        points = createPoints(config, app.screen.width, app.screen.height)
      }
      window.addEventListener('resize', onResize, { passive: true })
      cleanupResize = () => window.removeEventListener('resize', onResize)

      // Main animation loop
      app.ticker.add((ticker) => {
        updatePoints(points, app.screen.width, app.screen.height, ticker.deltaTime)
        const connections = buildConnections(points, config.connectionDistance)
        const triangles = buildTriangles(points, config.shapeDistance)
        drawScene(gfx, points, connections, triangles, config)
      })
    })()

    return () => {
      running = false
      cleanupResize?.()
      if (initialized) {
        app.destroy(true, true)
      }
    }
  }, [])

  return containerRef
}
