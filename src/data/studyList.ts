// The one source for every listing of studies. Add an entry to studies.json and the footer, the
// catalog, the about index, llms.txt and the WebMCP tools all pick it up at build time.
import data from './studies.json';
import { draftIds } from '../../scripts/drafts.mjs';

const pathOf = (u: string) => new URL(u).pathname;

// Drafts (status "In preparation") are excluded from every listing and never published.
export const drafts: string[] = draftIds(process.cwd());
export const isDraft = (id: string) => drafts.includes(id);
const drafts_ = new Set(drafts);

export const studies = data.studies.filter((s) => !drafts_.has(s.id)).map((s) => ({
  ...s,
  path: pathOf(s.url),
  pdfPath: pathOf(s.pdf),
  aboutPath: pathOf(s.about),
}));

const GROUP_LABELS: Record<string, string> = {
  research: 'Research papers',
  essay: 'Economics papers and essays',
  product: 'White papers',
};
export const groupLabel = (g: string) => GROUP_LABELS[g] ?? g.charAt(0).toUpperCase() + g.slice(1);
export const groupOrder = [...new Set(studies.map((s) => s.group))];
