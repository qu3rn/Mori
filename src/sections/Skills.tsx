import { skills } from '@/data/content'
import SectionTitle from '@/components/ui/SectionTitle'

export default function Skills() {
  return (
    <section id="skills" className="section bg-zinc-900/30">
      <div className="container">
        <SectionTitle
          label="Expertise"
          title="Skills & Tools"
          subtitle="Technologies I work with on a daily basis."
        />
        <div className="space-y-10">
          {skills.map(({ category, items }) => (
            <div key={category}>
              <p className="text-zinc-600 text-xs font-mono uppercase tracking-[0.2em] mb-4">
                {category}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 text-sm text-zinc-300 border border-zinc-800 rounded-sm
                               hover:border-zinc-600 hover:text-zinc-100 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
