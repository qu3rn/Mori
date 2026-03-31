export const personal = {
  name: 'Maciej Wlazlo',
  role: 'Senior Frontend Developer',
  tagline:
    'I craft polished, performant web applications with React, TypeScript, and a keen eye for detail.',
  email: 'hello@alexmorgan.dev',
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  location: 'Berlin, Germany',
  available: true,
}

export const about = {
  bio: [
    "I'm a senior frontend developer with 8+ years of experience building scalable web applications. I specialise in React ecosystems, TypeScript, and performance optimisation.",
    'My work spans everything from complex design systems to high-traffic production applications. I care deeply about code quality, user experience, and the craft of building software.',
    "When I'm not shipping features, I'm exploring creative coding, contributing to open source, and building things for the web.",
  ],
}

export const skills = [
  { category: 'Core', items: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS'] },
  {
    category: 'Ecosystem',
    items: ['Next.js', 'Vite', 'Redux', 'Zustand', 'React Query', 'Tailwind CSS'],
  },
  {
    category: 'Testing',
    items: ['Vitest', 'Jest', 'Testing Library', 'Playwright', 'Cypress'],
  },
  { category: 'Tools', items: ['Git', 'GitHub Actions', 'Docker', 'Figma', 'Storybook'] },
  { category: 'Creative', items: ['PixiJS', 'Three.js', 'WebGL', 'Canvas API'] },
]

export const experience = [
  {
    id: '1',
    company: 'Acme Corp',
    role: 'Senior Frontend Engineer',
    period: '2022 – Present',
    description:
      'Led frontend architecture for a platform serving 500k+ users. Migrated legacy codebase to React 18 + TypeScript, reducing bundle size by 40%.',
    tags: ['React', 'TypeScript', 'GraphQL', 'Design System'],
  },
  {
    id: '2',
    company: 'BuilderHub',
    role: 'Frontend Developer',
    period: '2019 – 2022',
    description:
      'Built and maintained a visual page builder used by 10k+ customers. Owned the drag-and-drop engine and collaborative editing features.',
    tags: ['React', 'Redux', 'WebSockets', 'Canvas'],
  },
  {
    id: '3',
    company: 'StartupLab',
    role: 'Frontend Developer',
    period: '2017 – 2019',
    description:
      'Joined as first frontend hire. Shipped the product from zero to launch, establishing frontend foundations, CI/CD, and design system.',
    tags: ['React', 'TypeScript', 'CSS Modules', 'Storybook'],
  },
]

export const projects = [
  {
    id: '1',
    title: 'Design System',
    description:
      'A comprehensive component library with 60+ components, full accessibility support, and dark/light theming.',
    tags: ['React', 'TypeScript', 'Storybook'],
    link: '#',
  },
  {
    id: '2',
    title: 'Dev Dashboard',
    description:
      'Real-time developer metrics dashboard with custom chart library and WebSocket live updates.',
    tags: ['React', 'D3', 'WebSockets'],
    link: '#',
  },
]
