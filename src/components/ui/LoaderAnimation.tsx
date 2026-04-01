import { personal } from '@/data/content'
import getNameInitials from '@/utility/GetNameInitials'

/**
 * Pure SVG loading animation — no external dependencies.
 *
 * Construction sequence (all timing via CSS keyframes in global.css):
 *  0.05s  Corner crosshair ticks draw in
 *  0.25s  X left arm draws
 *  0.45s  X right arm draws
 *  0.85s  Orange center pulse expands and fades
 *  0.90s  Monogram fades up beneath the X
 *  ∞      Ambient orange glow breathes slowly in background
 */
export default function LoaderAnimation() {
  const initials = getNameInitials(personal.name)

  return (
    <div className="flex flex-col items-center gap-5">
      <svg
        viewBox="0 0 100 100"
        width="96"
        height="96"
        aria-hidden="true"
        className="overflow-visible"
      >
        <defs>
          {/* Subtle warm glow behind the X */}
          <radialGradient id="loader-ambient-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#c8622a" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#c8622a" stopOpacity="0"    />
          </radialGradient>
        </defs>

        {/* Ambient breath — very faint orange radial, pulses slowly */}
        <rect
          x="0" y="0" width="100" height="100"
          fill="url(#loader-ambient-grad)"
          className="loader-glow-rect"
        />

        {/* ── Corner crosshair ticks ── drawn before the X */}
        <path d="M 20 28 L 20 20 L 28 20" className="loader-corner" />
        <path d="M 72 20 L 80 20 L 80 28" className="loader-corner" />
        <path d="M 80 72 L 80 80 L 72 80" className="loader-corner" />
        <path d="M 28 80 L 20 80 L 20 72" className="loader-corner" />

        {/* ── Orange center pulse — expands outward after X is drawn ── */}
        <circle
          cx="50"
          cy="50"
          r="1.5"
          className="loader-pulse-dot"
        />

        {/* ── X lines — right arm drawn after left for sequential feel ── */}
        {/* Line from top-left to bottom-right */}
        <line x1="24" y1="24" x2="76" y2="76" className="loader-x-line loader-x-line-1" />
        {/* Line from top-right to bottom-left */}
        <line x1="76" y1="24" x2="24" y2="76" className="loader-x-line loader-x-line-2" />
      </svg>

      {/* Monogram — fades in after X construction completes */}
      <span className="loader-label text-[10px] font-mono tracking-[0.4em] uppercase text-zinc-600 select-none">
        {initials}
      </span>
    </div>
  )
}
