# Participant Outcomes Web Application

React + TypeScript SPA for participant outcomes.

## Tech Stack

- React 18 + TypeScript, Vite (SWC), MUI v5, Redux Toolkit + RTK Query, React Router, Vitest
- ESLint + Prettier; path alias `@/` → `src/`; 2-space indent

## Always-On Conventions

- **Components**: functional + hooks, named exports, destructure props, `<200` lines per file
- **Hooks/utils**: arrow functions; export shared types, interfaces, enums, constants
- **State**: Redux Toolkit (global), RTK Query (API/cache), `useState` (local)
- **Styling**: MUI theming + `sx`; avoid hardcoded visual values
- **Imports**: absolute via `@/`; order: third-party → internal → types/assets
- **Naming**: PascalCase components/types, camelCase hooks (`use*`)/utils, UPPER_SNAKE_CASE constants; filename matches primary export
- **Errors**: try/catch on async; user-friendly UI messages; never empty catch blocks
- **No `any`**, no production `console`, no dead params/empty blocks

## Scope Discipline

- Only modify files directly required by the request.
- Do not refactor unrelated code, rename symbols, or "improve" adjacent files.
- Do not add/upgrade dependencies without asking.
- Do not introduce new architectural patterns when one already exists in the repo.
- If a fix requires touching >5 files or >1 module boundary, propose the plan first.

## When to Ask vs. Proceed

**Ask the user before:**

- Adding/upgrading a dependency
- Creating new top-level folders or architectural patterns
- Choosing between materially different approaches (>30 min rework if wrong)
- Modifying shared infrastructure (`store.ts`, `theme/`, `routes.tsx`, `vite.config.ts`)
- Deleting files or large blocks of code

**Proceed without asking for:**

- Localized edits within the file(s) named in the request
- Following an established pattern already present in the repo
- Bug fixes with an obvious root cause

If the request is ambiguous, ask **one** focused clarifying question before editing.

## Grounding Rules

- Before referencing any module, hook, type, or constant, confirm it exists in the workspace (search first).
- Never invent file paths, prop names, or library APIs. If unsure, read the source.
- When suggesting MUI / RTK Query / React Router APIs, prefer ones already used in this repo.
- Cite file paths you actually read; do not paraphrase from memory.

## Detailed Guidance (loaded on demand)

Auto-loaded when matching files are edited (see `.github/instructions/`):

- [components.instructions.md](instructions/components.instructions.md) — `**/*.tsx` (component structure, MUI styling, performance, error handling)
- [rtk-query.instructions.md](instructions/rtk-query.instructions.md) — `**/apis/**`, `**/slices/**`, `store.ts`
- [routing.instructions.md](instructions/routing.instructions.md) — `routes.tsx`, `**/containers/**`
- [testing.instructions.md](instructions/testing.instructions.md) — test files, `setupTests.ts`, `test-utils/**`
- [aem-injection.instructions.md](instructions/aem-injection.instructions.md) — `injection-component/**`, `containers/landing-page/**`, `utils/article-injection/**`, `utils/article-html-parser/**`, `apis/aemContentApi.ts`, `apis/contentFragmentApi.ts`

## Skills (invoke explicitly)

Repo-scoped skills under `.github/skills/`:

- **`code-cleanup`** — run after completing any code change
- **`pr-quality-gate`** — run before opening a PR (SonarQube, coverage, security, workflow)
- **`add-rtk-query-endpoint`** — recipe for adding a new API slice or endpoint
- **`add-route`** — recipe for adding a new route + container
- **`docker-local-build`** — build, run, and verify the Docker image locally with required env vars and health checks

## Resources

- [MUI](https://mui.com/) · [Redux Toolkit](https://redux-toolkit.js.org/) · [React TS Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
