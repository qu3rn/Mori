# Mapa Zamków — Copilot Instructions

## Project Overview

**Mapa Zamków** is a simple React web application that displays castles across Europe on an interactive map. The app helps users discover castles, plan a castle route, and export that route to Google Maps.

The character of the app is exploration / fantasy / Heroes-like — a light RPG feel applied to a practical mapping tool. It must stay simple, fast, and portable to Electron/Tauri in the future.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React + TypeScript | UI framework |
| Vite | Build tool |
| MapLibre GL JS / @vis.gl/react-maplibre | Map rendering (not Google Maps) |
| Zustand | Client state management |
| TanStack Query | Async data fetching / caching |
| Zod | Runtime schema validation |
| Tailwind CSS | Styling |
| Vitest | Testing |
| pnpm | Package manager |
| GitHub Actions | CI/CD |

---

## Domain Models

These are the core types in the project. Always use explicit TypeScript types for them:

- `Castle` — a single castle entity normalised from OSM data
- `CastleRoute` — an ordered list of castles selected by the user
- `MapBounds` — current visible map area (used for data fetching)
- `CastleDetails` — extended info for a selected castle
- `CastleSource` — origin metadata (OSM, wikidata, etc.)
- `RouteExport` — the data structure used when exporting to Google Maps URL

---

## Project Structure

```
src/
  app/           # App entry, providers, global setup
  map/           # MapLibre map container and map-level hooks
  castles/
    api/         # Overpass API calls and response parsing
    components/  # Castle markers, castle card UI
    model/       # Castle domain types and Zod schemas
    utils/       # Normalisation, filtering, pure helpers
  routes/
    components/  # Route panel UI
    model/       # CastleRoute and RouteExport types
    utils/       # Route building logic, Google Maps URL export
  shared/
    components/  # Generic reusable UI components
    lib/         # Generic utility functions
    types/       # Shared TypeScript types
  styles/        # Global CSS / Tailwind config
```

---

## Architecture Rules

1. **Separate concerns strictly**: map rendering, data fetching, UI, route logic, and export logic must not be mixed together.
2. **No Overpass API logic inside UI components.** All API calls live under `castles/api/`.
3. **No backend unless required.** The app is frontend-only for MVP.
4. **Design for replaceability**: the Overpass API layer should be swappable with a custom API without touching UI components.
5. **Pure functions for normalisation, filtering, and URL export** — these must be testable outside React.
6. **Small, readable files** — prefer many focused files over large ones.
7. **Components should not contain domain logic** — pass data in, emit events out.

---

## Data Source — OpenStreetMap / Overpass API

Castle data comes from OpenStreetMap via the Overpass API. Key tags to query:

- `historic=castle`
- `castle_type=*`
- `ruins=*`
- `wikidata`
- `wikipedia`
- `name`
- `tourism=attraction`

**Important caveats:**
- OSM data is imperfect. Not every `historic=castle` is a classic castle.
- The project has its own normalisation and filtering layer (`castles/utils/`) — always use it.
- Do not assume any OSM field is always present. All fields should be treated as optional and validated with Zod.
- Do not load all of Europe on startup. Fetch castles only for the current `MapBounds`.

---

## UI Guidelines

- The **map is the main screen** — it takes up the full viewport.
- Custom UI is overlaid on top of the map.
- **Castle markers** must be visually distinct from generic map points.
- **Castle card** should have a light fantasy RPG feel — subtle, not cartoonish.
- **Desktop is the primary target.** Do not break responsiveness, but mobile-first is not required.
- Avoid heavy third-party UI component libraries. Use Tailwind + custom components.

---

## MVP Features

1. Europe map as the base layer
2. Fetch castles for the currently visible map area
3. Display castle markers on the map
4. Show a castle card on marker click
5. Add/remove a castle from the active route
6. Route panel displaying the selected castles
7. Export route to Google Maps URL
8. Basic unit tests

---

## Code Style

- **TypeScript strict mode** — no `any`, no implicit types.
- **Explicit types** for all domain models.
- **Readable names** — prefer clarity over brevity.
- **Small files** — if a file is growing large, split it.
- **Tests are required** for:
  - Castle normalisation and filtering functions
  - Route store logic (Zustand)
  - Google Maps URL export function

---

## What to Avoid

- Overengineering — no unnecessary abstraction layers.
- Too many UI libraries — Tailwind + custom is enough.
- Business logic inside map components.
- Loading all of Europe from Overpass at startup.
- Assuming OSM data is always complete or correct.
- Making Google Maps the primary map renderer (use MapLibre).
- Adding a backend before it's actually needed.
