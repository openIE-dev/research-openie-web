import type { APIRoute, GetStaticPaths } from 'astro';
import { getExportedStudies } from '../../lib/markdownExport';

export const getStaticPaths: GetStaticPaths = async () => {
  const all = await getExportedStudies();
  return all
    .filter((s) => s.collectionDir === 'products')
    .map((s) => ({ params: { id: s.id }, props: { doc: s.markdownDocument } }));
};

export const GET: APIRoute = ({ props }) => {
  return new Response((props as { doc: string }).doc, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
