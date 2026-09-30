import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  compressHTML: true,
  site: 'https://research.openie.dev',
  redirects: {
    '/papers/ni': '/living/ni/',
    '/papers/satiation': '/living/satiation/',
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
