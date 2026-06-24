import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import tailwindcss from '@tailwindcss/vite'
import remarkDirective from 'remark-directive'
import { shikiConfig } from '@explainer/mdx/shiki'
import { remarkAutoImport } from '@explainer/mdx/remark-auto-import'
import { remarkDirectiveHandler } from '@explainer/mdx/remark-directive-handler'
import { remarkCodeBlocks } from '@explainer/mdx/remark-code-blocks'
import { thumbnailIntegration } from '@explainer/thumbnail/integration'

export default defineConfig({
  site: process.env.PUBLIC_DOCS_URL || undefined,
  devToolbar: { enabled: false },
  integrations: [
    react(),
    mdx({
      remarkPlugins: [remarkAutoImport, remarkCodeBlocks, remarkDirective, remarkDirectiveHandler],
    }),
    thumbnailIntegration({
      appName: 'Docs',
      content: { type: 'collection', dir: './src/content/docs' },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    envDir: '../../',
    // oidc-client-ts is imported from the linked @explainer/auth source package,
    // which Vite's dep scanner doesn't crawl; pre-bundle it to avoid on-demand
    // re-optimization invalidating the deps cache mid-session.
    optimizeDeps: {
      include: ['oidc-client-ts'],
    },
    // Astro serves on 4321 but Vite's HMR client defaults to its own 5173; pin it
    // so the websocket connects to the real dev port instead of looping on retries.
    server: {
      hmr: { clientPort: 4321 },
    },
  },
  markdown: {
    shikiConfig,
  },
})
