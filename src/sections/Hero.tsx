import { personal } from '@/data/content'
import PixiBackground from '@/components/PixiBackground'

export default function Hero() {
  const [firstName, lastName] = personal.name.split(' ')

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      <PixiBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-32">
        {personal.available && (
          <p className="inline-flex items-center gap-2 text-accent text-xs font-mono tracking-[0.2em] uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Available for hire
          </p>
        )}

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-zinc-50 leading-[0.95] tracking-tight mb-6">
          {firstName}
          <br />
          <span className="text-zinc-500">{lastName}</span>
        </h1>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-px bg-accent shrink-0" />
          <p className="text-zinc-400 font-mono text-sm tracking-wider uppercase">{personal.role}</p>
        </div>

        <p className="text-zinc-400 max-w-lg text-lg leading-relaxed mb-12">{personal.tagline}</p>

        <div className="flex flex-wrap gap-4">
          <a href="#experience" className="btn-primary">
            View Work
          </a>
          <a href="#contact" className="btn-outline">
            Get in Touch
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600">
        <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-zinc-600 to-transparent" />
      </div>
    </section>
  )
}
