interface Props {
  label: string
  title: string
  subtitle?: string
}

export default function SectionTitle({ label, title, subtitle }: Props) {
  return (
    <div className="mb-16">
      <p className="inline-flex items-center gap-3 text-accent text-xs font-mono tracking-[0.2em] uppercase mb-3">
        <span className="w-4 h-px bg-accent" />
        {label}
      </p>
      <h2 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-4">{title}</h2>
      {subtitle && <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">{subtitle}</p>}
    </div>
  )
}
