/**
 * Game component — placeholder until the actual game is implemented.
 * Rendered inside GameModal when the user clicks Play.
 */
export default function Game() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 select-none">
      {/* Geometric icon matching the preview window */}
      <svg
        width="72"
        height="72"
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
      >
        <polygon
          points="32,4 56,18 56,46 32,60 8,46 8,18"
          stroke="#3f3f46"
          strokeWidth="1"
          fill="none"
        />
        <polygon
          points="32,16 44,32 32,48 20,32"
          stroke="#c8622a"
          strokeWidth="1"
          strokeOpacity="0.5"
          fill="none"
        />
        <circle cx="32" cy="32" r="2" fill="#c8622a" fillOpacity="0.6" />
        <line x1="32" y1="32" x2="32" y2="4"  stroke="#3f3f46" strokeWidth="0.5" />
        <line x1="32" y1="32" x2="56" y2="46" stroke="#3f3f46" strokeWidth="0.5" />
        <line x1="32" y1="32" x2="8"  y2="46" stroke="#3f3f46" strokeWidth="0.5" />
      </svg>

      <div className="text-center space-y-2">
        <p className="text-zinc-300 font-mono text-sm tracking-[0.2em] uppercase">
          Void Protocol
        </p>
        <p className="text-zinc-600 font-mono text-xs tracking-widest">
          In development
        </p>
      </div>
    </div>
  )
}
