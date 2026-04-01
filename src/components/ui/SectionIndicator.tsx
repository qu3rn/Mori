import type { SectionId } from '@/hooks/useScrollState'

// ─── Section registry ──────────────────────────────────────────────────────────

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'hero',       label: 'Home'     },
  { id: 'about',      label: 'About'    },
  { id: 'skills',     label: 'Skills'   },
  { id: 'experience', label: 'Work'     },
  { id: 'contact',    label: 'Contact'  },
  { id: 'game',       label: 'Game'     },
]

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  active: SectionId
}

/**
 * Fixed right-side geometric section navigator.
 *
 * Renders a vertical list of diamond-shaped markers connected by hairline
 * lines. The active section is highlighted with a restrained orange fill and
 * a subtle glow. Clicking any marker smoothly scrolls to that section.
 *
 * Hidden on mobile — appears only from the md breakpoint upward.
 */
export default function SectionIndicator({ active }: Props) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      aria-label="Page sections"
      className="fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center"
    >
      {SECTIONS.map((section, i) => (
        <div key={section.id} className="flex flex-col items-center">
          {/* Hairline connector — skipped before the first item */}
          {i > 0 && (
            <div className="w-px h-4 bg-zinc-800/70" />
          )}

          {/* Marker button */}
          <button
            onClick={() => scrollTo(section.id)}
            aria-label={`Go to ${section.label}`}
            className="group relative flex items-center justify-center w-7 h-7"
          >
            {/* Diamond shape */}
            <span
              className={[
                'block w-[7px] h-[7px] rotate-45 transition-all duration-500',
                active === section.id
                  ? 'bg-accent scale-[1.3] shadow-[0_0_8px_2px_rgba(200,98,42,0.4)]'
                  : 'border border-zinc-700 bg-transparent group-hover:border-zinc-500 group-hover:scale-110',
              ].join(' ')}
            />

            {/* Label — always visible for the active section, hover-only for others */}
            <span
              className={[
                'absolute right-full mr-3',
                'px-2 py-0.5',
                'text-[10px] font-mono tracking-wider whitespace-nowrap',
                'pointer-events-none select-none',
                'transition-all duration-300',
                active === section.id
                  ? 'text-accent opacity-100 translate-x-0'
                  : 'text-zinc-500 bg-zinc-950/90 border border-zinc-800 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0',
              ].join(' ')}
            >
              {section.label}
            </span>
          </button>
        </div>
      ))}
    </nav>
  )
}
