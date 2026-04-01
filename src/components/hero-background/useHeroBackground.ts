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
import { spawnBurst, updateBurst } from './cursorSystem'
import { drawHeroScene } from './heroScene'
import type { Fragment, BurstParticle, SnowConfig } from './types'

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

// ─── Touch detection ───────────────────────────────────────────────────────────
// Cursor features (X shape, click burst, body cursor override) are disabled on
// touch devices — there is no persistent pointer position to track.
const IS_TOUCH = typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0)

// ─── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Manages the PixiJS hero background: drifting snowflakes, connections,
 * hover tint, click/auto disintegration, and (on non-touch devices) a custom
 * X cursor with an orange click burst.
 *
 * Event handlers are registered AFTER the canvas is mounted so that
 * getBoundingClientRect() provides correct viewport → canvas translation.
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
    let cleanupCursor: (() => void) | null = null

    let fragments: Fragment[] = []
    let burst: BurstParticle[] = []

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

      // ── Cursor: hide OS pointer while inside the hero canvas ─────────────────
      // body cursor is toggled per-mousemove so it restores automatically if the
      // user moves to another section. Interactive children (links, buttons) keep
      // their UA-defined cursor via element-level CSS, which takes precedence over
      // the inherited body value.
      if (!IS_TOUCH) {
        cleanupCursor = () => { document.body.style.cursor = '' }
      }

      // ── Coordinate translation ────────────────────────────────────────────────
      // getBoundingClientRect converts viewport clientX/Y to canvas-local pixels.
      // Recomputed per event (cheap) so scroll and layout shifts are handled too.
      const toCanvas = (clientX: number, clientY: number) => {
        const rect = app.canvas.getBoundingClientRect()
        return { x: clientX - rect.left, y: clientY - rect.top }
      }

      const isInCanvas = (x: number, y: number) =>
        x >= 0 && x <= app.screen.width && y >= 0 && y <= app.screen.height

      // ── Events ───────────────────────────────────────────────────────────────
      const onMouseMove = (e: MouseEvent) => {
        const pos = toCanvas(e.clientX, e.clientY)
        mouseRef.current = pos
        if (!IS_TOUCH) {
          document.body.style.cursor = isInCanvas(pos.x, pos.y) ? 'none' : ''
        }
      }

      const onMouseLeave = () => {
        mouseRef.current = { x: -9999, y: -9999 }
        if (!IS_TOUCH) document.body.style.cursor = ''
      }

      const clickTarget = { x: 0, y: 0, pending: false }
      const onClick = (e: MouseEvent) => {
        const pos = toCanvas(e.clientX, e.clientY)
        if (isInCanvas(pos.x, pos.y)) {
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
        burst = []
      }
      window.addEventListener('resize', onResize, { passive: true })
      cleanupResize = () => window.removeEventListener('resize', onResize)

      // ── Ticker ───────────────────────────────────────────────────────────────
      app.ticker.add((ticker) => {
        time += ticker.deltaMS
        const dt = ticker.deltaTime
        const { x: mx, y: my } = mouseRef.current
        const cursorVisible = !IS_TOUCH && isInCanvas(mx, my)

        // 1. Click: spawn burst at click point + disintegrate nearest snowflake
        if (clickTarget.pending) {
          clickTarget.pending = false
          // Burst always fires at click point regardless of snowflake proximity
          if (!IS_TOUCH) {
            burst.push(...spawnBurst(clickTarget.x, clickTarget.y))
          }
          // Snowflake disintegration: no distance limit — any in-canvas click hits closest
          const hit = findNearestSnowflake(flakes, clickTarget.x, clickTarget.y, Infinity)
          if (hit !== null) {
            fragments.push(...spawnFragments(hit, config))
            flakes.splice(flakes.indexOf(hit), 1)
          }
        }

        // 2. Physics
        applyMouseRepulsion(flakes, mx, my, config)
        const toBreak = updateSnowflakes(flakes, app.screen.width, app.screen.height, dt, time, config)

        // 3. Auto-disintegrate flakes at break threshold
        for (const sf of toBreak) {
          fragments.push(...spawnFragments(sf, config))
          flakes.splice(flakes.indexOf(sf), 1)
        }

        // 4. Respawn (one per frame to avoid top-edge bursts)
        if (flakes.length < config.count) {
          flakes.push(spawnSnowflake(config, app.screen.width))
        }

        // 5. Hover tint
        const nearest = findNearestSnowflake(flakes, mx, my, config.connectionDistance)
        lerpSnowflakeTints(flakes, nearest, dt)

        // 6. Fragment + burst lifecycle
        updateFragments(fragments, dt)
        fragments = fragments.filter(f => f.alpha > 0.01)

        updateBurst(burst, dt)
        burst = burst.filter(p => p.alpha > 0.01)

        // 7. Render
        const connections = buildSnowConnections(flakes, config.connectionDistance)
        drawHeroScene(gfx, flakes, fragments, burst, connections, config, mx, my, cursorVisible)
      })
    })()

    return () => {
      running = false
      cleanupEvents?.()
      cleanupResize?.()
      cleanupCursor?.()
      if (initialized) {
        app.destroy(true, true)
      }
    }
  }, [])

  return containerRef
}
