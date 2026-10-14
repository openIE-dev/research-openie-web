import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkInclude from './src/plugins/remark-include.mjs';
import rehypeFigures from './src/plugins/rehype-figures.mjs';

export default defineConfig({
  compressHTML: true,
  site: 'https://research.openie.dev',
  trailingSlash: 'ignore',
  markdown: {
    remarkPlugins: [remarkInclude, remarkMath],
    rehypePlugins: [[rehypeKatex, { output: 'html' }], rehypeFigures],
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
