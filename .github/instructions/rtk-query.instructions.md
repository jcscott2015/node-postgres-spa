---
applyTo: "**/apis/**,**/slices/**,**/store.ts"
---

# State Management & RTK Query

## State Management

- Use Redux Toolkit for global state.
- Use RTK Query for API calls and caching.
- Use local state (`useState`) for component-specific state.
- Keep action creators and reducers in slice files.

## RTK Query

- Define API endpoints in dedicated API slice files (e.g., `aemContentApi.ts`).
- Use generated hooks (`useFetchDataQuery`, `useUpdateDataMutation`).
- Handle errors with the `onQueryStarted` lifecycle.
- Provide appropriate cache tags for invalidation.
- API endpoints proxy through the Vite dev server to external services.
- Handle authentication tokens appropriately.
- Follow existing patterns in `aemContentApi.ts`.
