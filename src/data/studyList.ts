// The one source for every listing of studies. Add an entry to studies.json and the footer, the
// catalog, the about index, llms.txt and the WebMCP tools all pick it up at build time.
import data from './studies.json';

const pathOf = (u: string) => new URL(u).pathname;

export const studies = data.studies.map((s) => ({
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
