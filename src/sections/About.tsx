import { about, personal } from '@/data/content'
import SectionTitle from '@/components/ui/SectionTitle'

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="grid md:grid-cols-5 gap-16 items-start">
          {/* Bio */}
          <div className="md:col-span-3">
            <SectionTitle label="About" title="Who I am" />
            <div className="space-y-5">
              {about.bio.map((paragraph, i) => (
                <p key={i} className="text-zinc-400 text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-2">
            <div className="aspect-square bg-zinc-900 border border-zinc-800 rounded-sm mb-8 flex items-center justify-center">
              <span className="text-zinc-700 text-sm font-mono">Photo</span>
            </div>
            <div className="space-y-3">
              <DetailRow label="Location" value={personal.location} />
              <DetailRow label="Email" value={personal.email} />
              <DetailRow label="Status" value="Open to opportunities" accent />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function DetailRow({
  label,
  value,
  accent = false,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="flex items-baseline gap-4 border-b border-zinc-800/50 pb-3">
      <span className="text-zinc-600 text-xs font-mono uppercase tracking-wider w-20 shrink-0">
        {label}
      </span>
      <span className={`text-sm ${accent ? 'text-accent' : 'text-zinc-300'}`}>{value}</span>
    </div>
  )
}
