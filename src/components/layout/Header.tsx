import { useState, useEffect } from 'react'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800/60' : ''
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          className="text-zinc-50 font-bold text-lg tracking-tight hover:text-accent transition-colors"
        >
          AM<span className="text-accent">.</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="text-zinc-400 text-sm hover:text-zinc-100 transition-colors"
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            className="text-sm px-4 py-1.5 border border-zinc-700 text-zinc-300 rounded-sm
                       hover:border-accent hover:text-accent transition-colors"
          >
            Hire me
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex flex-col gap-1.5 text-zinc-400 hover:text-zinc-100 transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className="block w-5 h-px bg-current" />
          <span className="block w-5 h-px bg-current" />
          <span className="block w-5 h-px bg-current" />
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="md:hidden bg-zinc-950 border-t border-zinc-800 px-6 py-4 flex flex-col gap-4">
          {navLinks.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="text-zinc-400 hover:text-zinc-100 transition-colors py-1"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
