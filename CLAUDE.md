# Project Overview

This project is a personal landing page / portfolio for a Senior React Software Developer.

The primary goal is to create a polished, modern, responsive personal website that presents:
- professional profile
- experience
- skills
- selected projects
- contact information

A future feature of this project will be an interactive game section, but for now it should be represented as a placeholder only.

# Tech Stack

- React
- TypeScript
- Vite
- PixiJS

# Main Product Priorities

1. The website is primarily a CV / portfolio landing page.
2. It must feel premium, clean, modern, and intentional.
3. It must be fully responsive from mobile to desktop.
4. It should use a minimal black and white visual style with subtle earthy orange accents.
5. It should include a dynamic animated geometric background inspired by abstract connected-line systems:
   - looping animated lines
   - points searching for and connecting to each other
   - evolving irregular geometric shapes
   - elegant and subtle motion, not visually noisy
6. The game section should exist only as a placeholder for now.

# Design Direction

- Use a minimal, high-end, developer portfolio aesthetic.
- Base the UI on black, white, grayscale, and restrained earthy orange highlights.
- Prefer strong typography, spacing, contrast, and clarity over decorative clutter.
- Animations should feel smooth, subtle, and premium.
- The animated background should enhance the page, not overpower the content.
- The final result should look professional enough for recruitment and portfolio presentation.

# Architecture Rules

- Separate UI from logic.
- Keep components small, focused, and reusable.
- Use custom hooks for reusable logic, animation orchestration, and side effects.
- Keep rendering logic and animation logic cleanly separated.
- Prefer modular and maintainable code.
- Avoid large monolithic components.
- Avoid tightly coupling content sections with visual effects.
- Create isolated layers for:
  - page content
  - layout
  - background animation
  - future game module

# PixiJS Guidance

- Use PixiJS only where it adds value, primarily for the animated geometric background.
- Keep Pixi-related code isolated from standard React UI components.
- Wrap Pixi logic in dedicated modules, hooks, or components.
- Make sure the animation performs well on both mobile and desktop.
- Prefer efficient rendering and avoid unnecessarily complex visual effects.
- The background should degrade gracefully if needed on smaller or lower-powered devices.

# Content and UX Guidance

- The landing page should clearly communicate senior-level frontend expertise.
- Prioritize readability, hierarchy, and strong first impression.
- Sections should be easy to scan and visually balanced.
- CTAs and important information should be immediately discoverable.
- The layout should feel deliberate and professional, not generic.

# Current Scope

Build the portfolio / CV landing page first.

Include:
- hero section
- about / profile section
- skills / tech section
- experience or selected work section
- contact section
- placeholder section for the future game

Do not build the actual game yet unless explicitly requested.

# Working Style

- Always analyze the current project structure before making changes.
- Suggest minimal, safe, maintainable changes.
- Avoid breaking existing functionality.
- Prefer incremental improvements over unnecessary rewrites.
- When implementing a feature, preserve responsiveness and visual consistency.
- When suggesting changes, align them with the portfolio-first goal of the project.
