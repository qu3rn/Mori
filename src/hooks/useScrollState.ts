import { useState, useEffect } from 'react'
import { scrollSignal } from '@/utility/scrollSignal'

// ─── Section registry ──────────────────────────────────────────────────────────

export const SECTION_IDS = ['hero', 'about', 'skills', 'experience', 'contact', 'game'] as const
export type SectionId = (typeof SECTION_IDS)[number]

/** px from the viewport top at which a section is considered "active" */
const ACTIVE_OFFSET = 140

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Walk sections from bottom to top, return the last one whose top edge is above
 * ACTIVE_OFFSET. Falls back to the first section at the top of the page.
 */
function resolveActiveSection(): SectionId {
  for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
    const el = document.getElementById(SECTION_IDS[i])
    if (el && el.getBoundingClientRect().top <= ACTIVE_OFFSET) {
      return SECTION_IDS[i]
    }
  }
  return SECTION_IDS[0]
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Tracks the currently visible page section and the instantaneous scroll
 * velocity, writing the latter into the shared scrollSignal module so the
 * PixiJS animation loop can react without any React overhead.
 *
 * Returns only the active section ID — that is the only value that drives
 * React re-renders (the SectionIndicator and the section glow treatment).
 */
export function useScrollState() {
  const [activeSection, setActiveSection] = useState<SectionId>('hero')

  useEffect(() => {
    let lastScrollY = window.scrollY
    let lastTime = performance.now()

    const onScroll = () => {
      const now = performance.now()
      const dt = Math.max(now - lastTime, 1) // guard against division by zero

      // Scale raw px/ms into a 0–1 "per-frame" velocity (assuming 60 fps = 16.7 ms)
      const raw = (Math.abs(window.scrollY - lastScrollY) / dt) * 16.7
      scrollSignal.velocity = Math.min(raw * 0.12, 1)

      const maxScroll = document.body.scrollHeight - window.innerHeight
      scrollSignal.progress = maxScroll > 0 ? window.scrollY / maxScroll : 0

      lastScrollY = window.scrollY
      lastTime = now

      setActiveSection(resolveActiveSection())
    }

    // Kick off with correct initial state
    setActiveSection(resolveActiveSection())

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return { activeSection }
}
