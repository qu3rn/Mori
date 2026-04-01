import Header from '@/components/layout/Header';
import Hero from '@/sections/Hero';
import About from '@/sections/About';
import Skills from '@/sections/Skills';
import Experience from '@/sections/Experience';
import Contact from '@/sections/Contact';
import GamePlaceholder from '@/sections/GamePlaceholder';
import ConstellationBackground from '@/components/background/ConstellationBackground';
import SectionIndicator from '@/components/ui/SectionIndicator';
import { useScrollState } from '@/hooks/useScrollState';
import { personal } from './data/content';

export default function App()
{
  const { activeSection } = useScrollState();

  return (
    <>
      <div className="relative z-10" >
        <ConstellationBackground />
        <SectionIndicator active={activeSection} />
        <Header />
        <main data-active-section={activeSection}>
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Contact />
          <GamePlaceholder />
        </main>
        <footer className="py-8 px-6 border-t border-zinc-800">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-zinc-600 text-xs font-mono">© 2026 {personal.name}</span>
            <span className="text-zinc-700 text-xs font-mono">Built with React + TypeScript + Vite</span>
          </div>
        </footer>
      </div>
    </>
  );
}
