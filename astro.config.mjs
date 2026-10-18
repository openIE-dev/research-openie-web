import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkInclude from './src/plugins/remark-include.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { draftIds, draftOutputs } from './scripts/drafts.mjs';
import rehypeFigures from './src/plugins/rehype-figures.mjs';

// Draft studies are never emitted: after the build, their pages, PDFs and figures are removed from dist.
const stripDrafts = {
  name: 'strip-drafts',
  hooks: {
    'astro:build:done': ({ dir }) => {
      const out = fileURLToPath(dir);
      const langs = fs.readdirSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'src/content/translations'));
      for (const id of draftIds()) {
        for (const rel of draftOutputs(id, langs)) fs.rmSync(path.join(out, rel), { recursive: true, force: true });
        console.log(`[strip-drafts] ${id}: not published`);
      }
    },
  },
};

export default defineConfig({
  integrations: [stripDrafts],
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
