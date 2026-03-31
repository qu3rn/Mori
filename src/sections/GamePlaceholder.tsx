import SectionTitle from '@/components/ui/SectionTitle'

export default function GamePlaceholder() {
  return (
    <section id="game" className="section">
      <div className="container">
        <SectionTitle
          label="Coming soon"
          title="Interactive Experience"
          subtitle="A WebGL-powered interactive game is in development. Powered by PixiJS."
        />

        <div
          className="relative border border-zinc-800 border-dashed rounded-sm
                     aspect-video flex items-center justify-center
                     bg-zinc-900/20 overflow-hidden"
        >
          {/* Decorative grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 text-center">
            <div className="w-16 h-16 rounded-sm border border-zinc-800 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-7 h-7 text-zinc-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase mb-2">
              Under Construction
            </p>
            <p className="text-zinc-700 text-xs font-mono">PixiJS · WebGL · React</p>
          </div>
        </div>
      </div>
    </section>
  )
}
