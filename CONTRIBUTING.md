# Contributing to simpleParallax.js

Thanks for your interest in contributing! 🙌

## Prerequisites

This project uses [Bun](https://bun.sh). Install it, then:

```bash
bun install
```

Git hooks (lint & format on commit) are installed automatically via the `prepare` script.

## Development

| Task | Command |
| --- | --- |
| React playground | `bun run dev:react` |
| Vanilla playground | `bun run dev:vanilla` |
| Type-check | `bun run typecheck` |
| Tests | `bun test` |
| Lint & format | `bun run check` (or `bun run fix` to auto-fix) |
| Build both libraries | `bun run build` |
| Validate the npm package | `bun run lint:pkg` |

Before opening a PR, make sure `bun run check`, `bun run typecheck`, `bun test` and `bun run build` all pass — the CI runs the same checks.

## Pull requests

- Branch from `master`.
- Keep changes focused: one logical change per PR.
- Add or update tests for the shared `src/core` logic when relevant.
- The CI must be green before a PR can be merged.

## Project layout

- `src/core` — framework-agnostic pure math (shared, fully tested)
- `src/shared` — framework-agnostic browser helpers (reduced-motion, image-loaded)
- `src/react` — the React component and its engine
- `src/vanilla` — the vanilla JS engine

## Note

A React rendering test matrix (React 17/18/19) will be added once React rendering tests exist; today the suite covers the pure `core` logic.
