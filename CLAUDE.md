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

# Cursor Interaction

The hero background should use a custom cursor styled as a subtle "X".

Cursor requirements:
- Replace or visually augment the default cursor in the hero section
- The cursor should appear as a minimal geometric "X"
- It should fit the same premium monochrome aesthetic as the rest of the background
- Default cursor color should be white or off-white with subtle opacity
- Movement should feel smooth and lightweight

# Cursor Hover Behavior

- The custom X cursor should remain subtle during normal movement
- It must not distract from the page content
- It should feel precise, clean, and slightly futuristic

# Cursor Click Behavior

- On click, the X cursor should produce a soft orange burst
- The burst should use the same restrained earthy orange accent as the hover interactions
- The burst should feel like a quick geometric pulse or small explosion
- The effect must be elegant, not arcade-like or cartoonish
- The orange burst should expand briefly and fade quickly
- Optional: use tiny geometric shards, radial lines, or angular fragments
- The click effect should be visually satisfying but short-lived

# Cursor UX Constraints

- The custom cursor must work only where appropriate, preferably in the hero interactive background area
- It must not harm usability
- It must not make links or CTA interactions confusing
- On touch/mobile devices, cursor-specific behavior should be disabled or gracefully ignored
- Performance and clarity are more important than decorative complexity

# Design Intent

The X cursor should feel:
- sharp
- premium
- minimal
- controlled

The orange click burst should feel:
- subtle
- geometric
- refined
- energetic but restrained

# Scrollbar Design

Use a custom premium scrollbar that matches the portfolio aesthetic.

Requirements:
- thin and subtle
- geometric and minimal
- monochrome-first
- visually consistent with the hero background and overall design
- elegant rather than decorative

Style:
- dark low-contrast track
- slim thumb in soft white or light gray
- very subtle hover feedback
- restrained earthy orange accent only during hover or active interaction
- avoid thick rounded playful styles
- avoid flashy glow or aggressive color usage

Design intent:
- the scrollbar should feel refined, modern, technical, and premium
- it should be visible enough to feel intentional, but subtle enough not to draw attention

# Weather Chip

Add a premium minimal weather chip in the bottom-right corner of the page.

## Timing

- The chip should appear with a small delay after the loader closes
- Delay should be between 300ms and 600ms
- The delay should be configurable
- The chip should not appear before the loader fully finishes

## Content

The chip should display one of three short English messages:

1. "Today feels almost Californian — enjoy the visit."
2. "Maybe it’s not perfect, but at least it’s not raining."
3. "Well, at least the website is pretty."

## Data Source

Use Open-Meteo weather data.

Important:
- If the API request only includes hourly temperature, then the system cannot reliably infer sunshine or rain
- If rain/sun-based messaging is required, extend the request with precipitation and weather condition fields
- Keep weather interpretation logic simple, explicit, and isolated

## Interaction

- The chip must include a small close "X" button
- The chip can be dismissed manually
- If not dismissed, it should automatically disintegrate after 3 seconds
- The disintegration should break the chip into small subtle geometric fragments
- The effect must feel elegant, restrained, and premium

## Design

- premium minimalism
- monochrome base
- restrained earthy orange accents
- clean spacing
- subtle contrast
- refined, quiet motion
- bottom-right placement
- never distracting

## Architecture

Separate:
- API fetching
- weather interpretation
- message selection
- post-loader delayed appearance
- manual dismiss
- timed auto-disintegration
- chip animation rendering

Keep timing values configurable and easy to tune.
