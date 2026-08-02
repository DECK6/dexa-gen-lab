# DEXA GEN LAB

**500 deterministic generative-art sketches** in a live creative-coding catalog.

**Live:** https://dexa.art/gen/

<p align="center">
  <img src="https://dexa.art/gen/thumbs/FD03.jpg" alt="Magnet Lines" width="32%">
  <img src="https://dexa.art/gen/thumbs/SH04.jpg" alt="FBM Nebula" width="32%">
  <img src="https://dexa.art/gen/thumbs/TD08.jpg" alt="Point Galaxy" width="32%">
</p>

## What it is

DEXA GEN LAB is a browser-based catalog for exploring, regenerating, and learning from generative art. Every sketch is animated, seed-driven, and presented with its source code.

- **500 sketches** — 400 p5.js works and 100 Three.js works, including 25 GLSL shaders
- **Live gallery** — filter by category or engine, search by title or tag, and preview on hover or keyboard focus
- **Detail view** — regenerate with a new seed, copy the source, and move through related works
- **VFX LAB-aligned shell** — shared light header, filter rail, instrument-panel cards, workbench detail layout, and bilingual ABOUT page
- **Deterministic renders** — the same seed produces the same work; fixed-frame thumbnail mode keeps visual checks reproducible
- **Drop-in registry** — add a metadata/sketch file pair and Vite discovers it automatically

## Sketch contracts

| engine | entry point | deterministic input |
|---|---|---|
| p5.js | `sketch(p, ctx): void` | runner-injected `randomSeed` / `noiseSeed` |
| Three.js | `sketch(ctx): ThreeSketch` | `ctx.random()` and elapsed animation time |

Every sketch receives a shared `SketchCtx` with canvas dimensions, seed, seeded random function, and the central DEXA palette. Registry lint blocks nondeterministic clocks/randomness, inline hex colors, mismatched file pairs, and static `noLoop()` sketches.

## Categories

FIELD · PARTICLE · GEOMETRY · FRACTAL · AUTOMATA · ORGANIC · GLYPH · SPACE · SHADER · CHAOS · WAVE · OPTICS · DATA · SYSTEM · KINETIC · TEXTILE · FLUID · MINIMAL · TOPOLOGY · COSMIC

Each category contains 25 works. The complete catalog is documented in [`docs/CATALOG.md`](docs/CATALOG.md).

## Develop

```bash
bun install
bun run dev             # gallery at http://localhost:5173/gen/
bun run lint:registry   # registry, determinism, and palette rules
bun run audit:catalog   # catalog contract + W6 nearest-neighbor clone gate
bun run typecheck
bun run build
bun run thumbs          # render all 500 thumbnails
bun run test:e2e        # product-shell + non-blank + frame-change checks
```

## Add a sketch

Create one matching pair:

```text
sketches/<category>/<ID>_<slug>.meta.ts
sketches/<category>/<ID>_<slug>.sketch.ts
```

Metadata is loaded eagerly for the gallery; sketch modules and raw source are loaded lazily only when needed. No central manifest edit is required.

## Architecture

- Vanilla TypeScript + Vite
- p5.js and Three.js render runners
- Hash routing for gallery, detail, ABOUT, and preview harnesses
- Shared Ink + Cyan + Orange DEXA palette
- Playwright thumbnail and alive-render gates
- Static deployment at the `/gen/` base path

## Docs

- [`docs/SPEC.md`](docs/SPEC.md) — architecture, contracts, design rules, and verification gates
- [`docs/CATALOG.md`](docs/CATALOG.md) — all 500 sketches
- [`docs/PROGRESS.md`](docs/PROGRESS.md) — implementation ledger

Accepted through registry/catalog audit, TypeScript, production build, two byte-identical 500-thumbnail renders, and 503 Playwright checks.
