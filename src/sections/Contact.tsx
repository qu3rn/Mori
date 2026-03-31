import { personal } from '@/data/content'
import SectionTitle from '@/components/ui/SectionTitle'

export default function Contact() {
  return (
    <section id="contact" className="section bg-zinc-900/30">
      <div className="container">
        <div className="max-w-2xl">
          <SectionTitle
            label="Contact"
            title="Let's work together"
            subtitle="I'm open to senior and lead frontend roles. If you have an interesting project or opportunity, I'd love to hear about it."
          />

          <div className="flex flex-wrap gap-4">
            <a href={`mailto:${personal.email}`} className="btn-primary">
              Send an email
            </a>
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              LinkedIn
            </a>
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              GitHub
            </a>
          </div>

          <p className="mt-10 text-zinc-600 text-sm font-mono">{personal.email}</p>
        </div>
      </div>
    </section>
  )
}
