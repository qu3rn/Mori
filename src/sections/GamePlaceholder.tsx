import { useState } from 'react'
import SectionTitle from '@/components/ui/SectionTitle'
import GameModal from '@/components/game/GameModal'

const features = [
  'Procedurally generated geometric levels',
  'Spatial navigation and pattern recognition',
  'Ambient, meditative pacing',
  'Persistent progression across sessions',
]

const stack = ['PixiJS', 'WebGL', 'React', 'TypeScript']

export default function GamePlaceholder() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <section id="game" className="section">
      <div className="container">
        <SectionTitle
          label="Side Project"
          title="Void Protocol"
          subtitle="A browser-based WebGL puzzle game. Navigate geometric fragments through procedurally generated fields to reconstruct broken constellations."
        />

        <div className="grid md:grid-cols-5 gap-12 items-start">
          {/* ── Left column: concept + features ─────────────────────────── */}
          <div className="md:col-span-2 space-y-10">
            <div>
              <p className="text-zinc-600 text-xs font-mono uppercase tracking-[0.2em] mb-4">
                Features
              </p>
              <ul className="space-y-3">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-zinc-500 text-sm leading-relaxed">
                    <span className="w-1 h-1 rounded-full bg-accent shrink-0 mt-2" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-zinc-600 text-xs font-mono uppercase tracking-[0.2em] mb-3">
                Tech
              </p>
              <div className="flex flex-wrap gap-2">
                {stack.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-1 border border-zinc-800 text-zinc-600 rounded-sm font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <p className="text-zinc-700 text-xs font-mono mb-1">Status</p>
              <p className="text-zinc-500 text-sm">Early design phase · Expected 2026</p>
            </div>
          </div>

          {/* ── Right column: preview window ─────────────────────────────── */}
          <div className="md:col-span-3">
            <div
              className="relative aspect-video border border-zinc-800 rounded-sm
                         bg-zinc-900/30 overflow-hidden"
            >
              {/* Subtle dot-grid background */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: 'radial-gradient(circle, #3f3f46 1px, transparent 1px)',
                  backgroundSize: '28px 28px',
                  opacity: 0.35,
                }}
              />

              {/* Accent corner lines — suggest a "frame" / UI chrome */}
              <CornerMarks />

              {/* Status badge */}
              <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-zinc-950/70 border border-zinc-800 rounded-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-mono text-zinc-500 tracking-wider">In development</span>
              </div>

              {/* Centre: geometric icon + Play button */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                <GeometricIcon />
                <button
                  onClick={() => setModalOpen(true)}
                  aria-label="Play Void Protocol"
                  className="group flex items-center gap-3 px-5 py-2.5
                             border border-zinc-700 hover:border-accent/60
                             text-zinc-500 hover:text-zinc-200
                             font-mono text-xs tracking-[0.2em] uppercase
                             transition-all duration-300"
                >
                  {/* Geometric play triangle */}
                  <svg width="8" height="10" viewBox="0 0 8 10" aria-hidden="true" className="fill-current">
                    <polygon points="0,0 8,5 0,10" />
                  </svg>
                  Play
                </button>
              </div>
            </div>

            <p className="mt-3 text-zinc-700 text-xs font-mono text-right">
              Powered by PixiJS · WebGL
            </p>
          </div>
        </div>
      </div>

      {modalOpen && <GameModal onClose={() => setModalOpen(false)} />}
    </section>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

/** Accent corner marks on three corners of the preview window (top-right reserved for the status badge). */
function CornerMarks() {
  return (
    <>
      {/* top-left */}
      <span className="absolute top-4 left-4 w-5 h-px bg-accent/40" />
      <span className="absolute top-4 left-4 w-px h-5 bg-accent/40" />
      {/* bottom-left */}
      <span className="absolute bottom-4 left-4 w-5 h-px bg-accent/40" />
      <span className="absolute bottom-4 left-4 w-px h-5 bg-accent/40" />
      {/* bottom-right */}
      <span className="absolute bottom-4 right-4 w-5 h-px bg-accent/40" />
      <span className="absolute bottom-4 right-4 w-px h-5 bg-accent/40" />
    </>
  )
}

/** Minimal geometric shape suggesting a puzzle/game element. */
function GeometricIcon() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer hexagon outline */}
      <polygon
        points="32,4 56,18 56,46 32,60 8,46 8,18"
        stroke="#3f3f46"
        strokeWidth="1"
        fill="none"
      />
      {/* Inner diamond */}
      <polygon
        points="32,16 44,32 32,48 20,32"
        stroke="#c8622a"
        strokeWidth="1"
        strokeOpacity="0.5"
        fill="none"
      />
      {/* Centre dot */}
      <circle cx="32" cy="32" r="2" fill="#c8622a" fillOpacity="0.6" />
      {/* Connector lines from centre to outer vertices */}
      <line x1="32" y1="32" x2="32" y2="4"  stroke="#3f3f46" strokeWidth="0.5" />
      <line x1="32" y1="32" x2="56" y2="46" stroke="#3f3f46" strokeWidth="0.5" />
      <line x1="32" y1="32" x2="8"  y2="46" stroke="#3f3f46" strokeWidth="0.5" />
    </svg>
  )
}
