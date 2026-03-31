import { experience, projects } from '@/data/content'
import SectionTitle from '@/components/ui/SectionTitle'

export default function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container">
        {/* Work History */}
        <SectionTitle label="Experience" title="Work History" />
        <div className="space-y-0 mb-24">
          {experience.map((job) => (
            <div
              key={job.id}
              className="group grid md:grid-cols-4 gap-4 py-8 border-t border-zinc-800
                         hover:border-zinc-700 transition-colors"
            >
              <div className="md:col-span-1">
                <p className="text-zinc-600 text-xs font-mono mb-1">{job.period}</p>
                <p className="text-zinc-500 text-sm">{job.company}</p>
              </div>
              <div className="md:col-span-3">
                <h3 className="text-zinc-100 font-semibold mb-3 group-hover:text-accent transition-colors">
                  {job.role}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">{job.description}</p>
                <div className="flex flex-wrap gap-3">
                  {job.tags.map((tag) => (
                    <span key={tag} className="text-xs text-zinc-600 font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <div className="border-t border-zinc-800" />
        </div>

        {/* Selected Projects */}
        <SectionTitle label="Work" title="Selected Projects" />
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <a
              key={project.id}
              href={project.link}
              className="group relative p-8 bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden
                         hover:border-zinc-600 transition-all duration-200"
            >
              {/* Top accent reveal */}
              <div className="absolute inset-x-0 top-0 h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              <h3 className="text-zinc-100 font-semibold text-lg mb-3 group-hover:text-accent transition-colors">
                {project.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-zinc-800 text-zinc-500 rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
