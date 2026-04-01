# Project Scope

This task is limited to the hero background only.

Build a subtle interactive background in PixiJS for the hero section of a portfolio landing page.
The effect should feel elegant, lightweight, abstract, and premium.

# Core Visual Concept

The background consists of animated snowflake-like particles made from triangles.

Each snowflake should:
- visually feel geometric and minimal
- be composed of triangle-based forms or triangle clusters
- fall or drift gently in the hero area
- remain subtle and not distract from the foreground content

The overall aesthetic should feel:
- clean
- modern
- monochrome-first
- restrained
- atmospheric
- delicate rather than flashy

# Color Direction

Base palette:
- black / near-black background
- white / off-white particles and lines
- grayscale support tones

Interaction accent:
- subtle earthy orange highlight on hover
- orange must be soft, restrained, and minimal
- never let the orange dominate the composition

# Behavior Rules

## Particle movement

- Snowflakes should drift smoothly and slowly
- Motion should feel soft and natural, not chaotic
- Avoid aggressive speed, sharp direction changes, or noisy movement
- Use slight variation between particles so the background feels alive

## Connections

- Snowflakes can connect to nearby snowflakes with faint lines
- Lines should only appear when particles are close enough
- Lines must be thin, subtle, and low-contrast
- Connections should feel temporary and elegant
- The line system should create strange but tasteful geometric relationships

## Hover interaction

- On mouse hover near a snowflake, it should react gently
- The hovered snowflake can tint slightly toward a soft earthy orange
- The response should be subtle and premium
- Hover should never feel like a bright UI state or game effect
- Optional: nearby connected lines can also react very slightly

## Click interaction

- On click, a snowflake should break apart
- The breakup should feel like a soft geometric disintegration
- The pieces should disperse lightly and then fade out
- The effect should remain elegant and not explosive or cartoonish

## Auto-break rule

- If a snowflake falls below one-third of the hero section height threshold, it should break apart automatically
- This automatic breakup should trigger the same family of disintegration effect as click
- After breakup, new particles can be respawned in a controlled way to maintain density

# Disintegration Effect

The disintegration effect is important.

Requirements:
- breakup should be made of smaller triangle fragments or minimal geometric shards
- fragments should spread with light velocity
- fragments should fade out smoothly
- the effect must be soft, airy, and brief
- avoid explosive, aggressive, or visually loud breakup behavior

# UX Constraints

- The background must never overpower hero content
- Text and CTA elements must remain clearly readable
- Motion should support the page atmosphere, not become the main attraction
- Interactions should feel rewarding but restrained
- The effect should remain visually balanced on both desktop and mobile

# Responsiveness

- Must work from mobile to desktop
- Adapt particle count and line density based on screen size and performance needs
- Use fewer particles and simpler effects on smaller or weaker devices if necessary
- The background should degrade gracefully
- Preserve the same design feeling across screen sizes

# Performance Guidance

- Prioritize smooth rendering and low visual noise
- Keep the system efficient
- Avoid excessive particle counts
- Avoid expensive recalculations when unnecessary
- Use optimized update loops and spatial checks where appropriate
- Responsiveness and performance are more important than effect complexity

# Architecture Rules

- Keep PixiJS logic isolated from standard React UI
- Create a dedicated hero background module/component for Pixi
- Separate responsibilities clearly:
  - rendering setup
  - particle system logic
  - connection logic
  - hover interaction
  - click disintegration
  - respawn behavior
- Avoid mixing animation system logic directly into page layout components
- Keep code modular, readable, and easy to tweak

# Implementation Guidance

Prefer a structure where:
- React owns mounting/unmounting and container lifecycle
- PixiJS owns rendering and animation
- particle behavior is configurable through centralized constants or config objects
- visual tuning values are easy to adjust

Suggested areas of configurability:
- particle count
- drift speed
- connection distance
- line opacity
- hover tint intensity
- disintegration fragment count
- respawn timing

# Design Intent

This is not a game effect.
This is not a flashy particle demo.
This is not a loud interactive background.

This should feel like:
- a refined geometric winter atmosphere
- subtle intelligence in motion
- premium abstract visual design
- restrained interactivity behind a senior developer portfolio hero section

# Delivery Expectations

When implementing:
- first analyze the current project structure
- suggest a minimal integration path
- keep the system isolated and maintainable
- explain architectural decisions briefly
- prefer incremental implementation over unnecessary rewrites
