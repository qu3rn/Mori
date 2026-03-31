import Header from '@/components/layout/Header'
import Hero from '@/sections/Hero'
import About from '@/sections/About'
import Skills from '@/sections/Skills'
import Experience from '@/sections/Experience'
import Contact from '@/sections/Contact'
import GamePlaceholder from '@/sections/GamePlaceholder'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Contact />
        <GamePlaceholder />
      </main>
      <footer className="py-8 px-6 border-t border-zinc-800">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-zinc-600 text-xs font-mono">© 2026 Alex Morgan</span>
          <span className="text-zinc-700 text-xs font-mono">Built with React + TypeScript + Vite</span>
        </div>
      </footer>
    </>
  )
}
