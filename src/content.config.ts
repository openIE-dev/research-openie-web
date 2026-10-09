import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const papers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/papers' }),
  schema: z.object({
    title: z.string(),
    deck: z.string(),
    id: z.string(),
    status: z.string(),
    author: z.string(),
    figures: z.string(),
    pdf: z.string(),
    board_synth_claimed: z.boolean().default(false),
  }),
});

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    deck: z.string(),
    id: z.string(),
    status: z.string(),
    author: z.string(),
    figures: z.string(),
    pdf: z.string(),
    board_synth_claimed: z.boolean().default(false),
  }),
});

export const collections = { papers, products };
