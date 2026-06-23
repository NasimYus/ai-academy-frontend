import path from 'node:path'

import { defineConfig } from 'vitest/config'

// Standalone vitest config (avoids the TanStack Start / nitro vite plugins).
export default defineConfig({
  resolve: {
    alias: [{ find: /^#\//, replacement: `${path.resolve(__dirname, 'src')}/` }],
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    server: { deps: { inline: ['zod'] } },
  },
})
