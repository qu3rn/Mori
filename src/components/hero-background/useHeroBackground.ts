import { useEffect, useRef, type RefObject } from 'react'
import { Application, Graphics } from 'pixi.js'
import {
  createSnowflakes,
  spawnSnowflake,
  updateSnowflakes,
  applyMouseRepulsion,
  buildSnowConnections,
  findNearestSnowflake,
  lerpSnowflakeTints,
} from './snowflakeSystem'
import { spawnFragments, updateFragments } from './fragmentSystem'
import { drawHeroScene } from './heroScene'
import type { Fragment, SnowConfig } from './types'

// ─── Config ────────────────────────────────────────────────────────────────────

const BASE: SnowConfig = {
  count: 55,
  minSize: 4,
  maxSize: 11,
  minSpeed: 0.30,
  maxSpeed: 0.85,
  swayAmplitude: 0.45,
  swayFrequency: 0.0008,
  connectionDistance: 110,
  repulsionRadius: 130,
  repulsionStrength: 3.5,
  color: 0xffffff,
  alpha: 0.38,
  lineAlpha: 0.055,
  breakThresholdFraction: 0.67,
  fragmentCount: 6,
}

function resolveConfig(width: number): SnowConfig {
  if (width < 640) {
    return { ...BASE, count: 24, connectionDistance: 80, repulsionRadius: 90 }
  }
  if (width < 1024) {
    return { ...BASE, count: 38, connectionDistance: 95, repulsionRadius: 110 }
  }
  return BASE
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Manages a PixiJS Application that renders falling triangular snowflakes with
 * connecting lines, mouse repulsion, hover tint, click disintegration, and
 * auto-disintegration at the lower third of the hero section.
 *
 * Event handlers are set up AFTER the canvas is mounted so that
 * getBoundingClientRect correctly converts viewport → canvas coordinates.
 *
 * Returns a ref to attach to the container div.
 */
export function useHeroBackground(): RefObject<HTMLDivElement | null> {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const mountNode = containerRef.current
    if (!mountNode) return

    const app = new Application()
    let running = true
    let initialized = false
    let cleanupEvents: (() => void) | null = null
    let cleanupResize: (() => void) | null = null
    let fragments: Fragment[] = []

    ;(async () => {
      await app.init({
        resizeTo: window,
        backgroundAlpha: 0,
        antialias: true,
        autoDensity: true,
        resolution: window.devicePixelRatio ?? 1,
      })

      initialized = true

      if (!running) {
        app.destroy(true, true)
        return
      }

      app.canvas.style.position = 'absolute'
      app.canvas.style.inset = '0'
      app.canvas.style.pointerEvents = 'none'
      mountNode.appendChild(app.canvas)

      // ── Event setup (after canvas is mounted) ────────────────────────────────
      // getBoundingClientRect translates viewport coordinates to canvas-local
      // coordinates, keeping interactions correct regardless of scroll or header
      // height. Canvas rect is recomputed per event (cheap — browsers cache it).
      const toCanvas = (clientX: number, clientY: number) => {
        const rect = app.canvas.getBoundingClientRect()
        return { x: clientX - rect.left, y: clientY - rect.top }
      }

      const onMouseMove = (e: MouseEvent) => {
        mouseRef.current = toCanvas(e.clientX, e.clientY)
      }
      const onMouseLeave = () => {
        mouseRef.current = { x: -9999, y: -9999 }
      }

      const clickTarget = { x: 0, y: 0, pending: false }
      const onClick = (e: MouseEvent) => {
        const pos = toCanvas(e.clientX, e.clientY)
        // Only react to clicks that land within the hero canvas bounds
        if (pos.x >= 0 && pos.x <= app.screen.width && pos.y >= 0 && pos.y <= app.screen.height) {
          clickTarget.x = pos.x
          clickTarget.y = pos.y
          clickTarget.pending = true
        }
      }

      window.addEventListener('mousemove', onMouseMove, { passive: true })
      document.addEventListener('mouseleave', onMouseLeave, { passive: true })
      window.addEventListener('click', onClick, { passive: true })
      cleanupEvents = () => {
        window.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseleave', onMouseLeave)
        window.removeEventListener('click', onClick)
      }

      // ── Particle state ───────────────────────────────────────────────────────
      let config = resolveConfig(app.screen.width)
      let flakes = createSnowflakes(config, app.screen.width, app.screen.height)
      const gfx = new Graphics()
      app.stage.addChild(gfx)
      let time = 0

      const onResize = () => {
        config = resolveConfig(app.screen.width)
        flakes = createSnowflakes(config, app.screen.width, app.screen.height)
        fragments = []
      }
      window.addEventListener('resize', onResize, { passive: true })
      cleanupResize = () => window.removeEventListener('resize', onResize)

      // ── Ticker ───────────────────────────────────────────────────────────────
      app.ticker.add((ticker) => {
        time += ticker.deltaMS
        const dt = ticker.deltaTime

        // 1. Click: disintegrate nearest snowflake (no distance limit — any click
        //    within the canvas area always hits the closest flake)
        if (clickTarget.pending) {
          clickTarget.pending = false
          const hit = findNearestSnowflake(flakes, clickTarget.x, clickTarget.y, Infinity)
          if (hit !== null) {
            fragments.push(...spawnFragments(hit, config))
            flakes.splice(flakes.indexOf(hit), 1)
          }
        }

        // 2. Physics
        applyMouseRepulsion(flakes, mouseRef.current.x, mouseRef.current.y, config)
        const toBreak = updateSnowflakes(flakes, app.screen.width, app.screen.height, dt, time, config)

        // 3. Auto-disintegrate flakes that crossed the break threshold
        for (const sf of toBreak) {
          fragments.push(...spawnFragments(sf, config))
          flakes.splice(flakes.indexOf(sf), 1)
        }

        // 4. Respawn to maintain count (one per frame to avoid top-edge bursts)
        if (flakes.length < config.count) {
          flakes.push(spawnSnowflake(config, app.screen.width))
        }

        // 5. Hover tint — search within connectionDistance for a more generous hit area
        const nearest = findNearestSnowflake(flakes, mouseRef.current.x, mouseRef.current.y, config.connectionDistance)
        lerpSnowflakeTints(flakes, nearest, dt)

        // 6. Fragment lifecycle
        updateFragments(fragments, dt)
        fragments = fragments.filter(f => f.alpha > 0.01)

        // 7. Render
        const connections = buildSnowConnections(flakes, config.connectionDistance)
        drawHeroScene(gfx, flakes, fragments, connections, config)
      })
    })()

    return () => {
      running = false
      cleanupEvents?.()
      cleanupResize?.()
      if (initialized) {
        app.destroy(true, true)
      }
    }
  }, [])

  return containerRef
}
