import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  compressHTML: true,
  site: 'https://research.openie.dev',
  trailingSlash: 'ignore',
  vite: {
    plugins: [tailwindcss()]
  }
});
