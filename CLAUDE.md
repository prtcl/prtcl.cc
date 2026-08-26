# prtcl.cc

Personal site for Cory O'Brien. Currently in active redesign.

## Stack

- **React 19** + **Vite 8** — standard frontend setup
- **Panda CSS** — styling and layout via styled-system JSX primitives
- **Three.js** + **@react-three/fiber** — WebGL rendering for the homepage visualization
- **@react-three/postprocessing** — depth-of-field effect on the visualization
- **@prtcl/plonk** — Cory's own signal-processing library, used extensively in the visualization (Lorenz attractor, Slew, Drunk, Integrator, Sine, etc.)
- **Convex** — backend (projects, features); currently mid-migration, treat as provisional
- **oxlint** + **tsgo** — linting and typechecking

## Dev

```sh
npm run dev       # runs Convex + Vite concurrently
npm run lint
npm run typecheck
```

Deploy is via GitHub Actions on push to main — builds, runs Convex deploy, then SCPs the dist to the server.

## Visualization

The homepage animation lives in `src/feat/Visualization.tsx`. It's a composition of several generator classes built on plonk:

- **Dyn** — slow warm background tint driven by a coupled Integrator
- **Point** — a single rendered particle (two concentric Three.js circles)
- **Wobbler** — sine oscillator through an Integrator for a lagging y-wobble
- **Wiggler** — Lorenz strange attractor driving depth, radius, and opacity simultaneously
- **Position** — Slew interpolation toward random targets with Drunk micro-drift
- **Bug** — composes the above into one animated particle with a short trail

The overall design intent is a higher-dimensional stochastic system — each generator operates independently at its own timescale, and Bug.tick() is the integration point that projects them all into 3D world space.

## Notes

**Don't break the mix-blend-mode.** The text overlay (`Center` in `App.tsx`) uses `mixBlendMode="difference"` with white text to invert through the dark circles. This is intentional. Adding `backdropFilter` to anything in the overlay, or making the R3F canvas transparent, will break it silently.

**plonk generators are stateful.** Calling `.next()` advances internal state — calling it twice in a tick produces two different values. Order of calls within a frame matters.

## Convex backend

Handles projects data and feature flags. Mid-migration as part of the current redesign — schema and queries are provisional. Don't over-index on the current data model.
