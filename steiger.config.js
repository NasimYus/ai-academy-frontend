import { defineConfig } from 'steiger'
import fsd from '@feature-sliced/steiger-plugin'

// Official Feature-Sliced Design linter. Enforces layer boundaries, public
// API usage, and slice cohesion so the FSD structure doesn't drift over time.
export default defineConfig([
  ...fsd.configs.recommended,
  {
    // Framework-pinned files: TanStack Start/Router own these paths and the
    // generated route tree, so they don't follow FSD slice conventions.
    ignores: [
      'src/routeTree.gen.ts',
      'src/router.tsx',
      'src/routes/**',
    ],
  },
  {
    rules: {
      // Advisory heuristic that flags slices referenced ≤1 time and suggests
      // merging them. Counterproductive early: structure is intentionally
      // seeded ahead of reuse, and `routes/**` (the real consumer of widgets/
      // pages) is excluded above, so its references aren't counted. We keep
      // the meaningful guardrails (layer boundaries, public API, cross-imports)
      // enabled and disable only this one.
      'fsd/insignificant-slice': 'off',
      // Advisory heuristic that caps slices per layer (default 20). The app
      // legitimately has one page slice per screen; grouping unrelated pages
      // purely to satisfy a count would hurt clarity. Keep the real guardrails
      // (boundaries, public API, cross-imports) and disable this ceiling.
      'fsd/excessive-slicing': 'off',
    },
  },
])
