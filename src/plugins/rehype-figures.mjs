// Turn a paragraph holding only a /figures/ image into a full-width figure:
// <picture> with the SVG first and the PNG copy as fallback, intrinsic size
// from the SVG viewBox (no layout shift), a zoom link the lightbox script
// picks up, an "Open full size" link, and the following italic
// "Figure N." paragraph moved into <figcaption>.
import fs from 'node:fs';
import path from 'node:path';

const PUBLIC = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../public');

function svgSize(src) {
  try {
    const head = fs.readFileSync(path.join(PUBLIC, src)).subarray(0, 4000).toString('utf8');
    const vb = head.match(/viewBox\s*=\s*"\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/);
    if (vb) return [Math.round(+vb[1]), Math.round(+vb[2])];
    const w = head.match(/<svg[^>]*\swidth="([\d.]+)/), h = head.match(/<svg[^>]*\sheight="([\d.]+)/);
    if (w && h) return [Math.round(+w[1]), Math.round(+h[1])];
  } catch {}
  return null;
}

const el = (tagName, properties, children = []) => ({ type: 'element', tagName, properties, children });
const txt = (value) => ({ type: 'text', value });
const isWs = (n) => n.type === 'text' && !n.value.trim();

export default function rehypeFigures() {
  return (tree) => {
    const walk = (parent) => {
      if (!parent.children) return;
      for (let i = 0; i < parent.children.length; i++) {
        const node = parent.children[i];
        if (node.type !== 'element') continue;
        if (node.tagName !== 'p') { walk(node); continue; }
        const kids = node.children.filter((k) => !isWs(k));
        if (kids.length !== 1 || kids[0].tagName !== 'img') continue;
        const img = kids[0];
        const src = String(img.properties.src || '');
        if (!src.startsWith('/figures/')) continue;
        const isSvg = src.endsWith('.svg');
        const png = isSvg ? src.replace(/\.svg$/, '.png') : null;
        const hasPng = png && fs.existsSync(path.join(PUBLIC, png));
        const size = isSvg ? svgSize(src) : null;
        const alt = String(img.properties.alt || '');
        const imgProps = { src: hasPng ? png : src, alt, loading: 'lazy', decoding: 'async', className: ['fig-img'] };
        if (size) { imgProps.width = size[0]; imgProps.height = size[1]; }
        const pic = el('picture', {}, [
          ...(isSvg && hasPng ? [el('source', { type: 'image/svg+xml', srcSet: src })] : []),
          el('img', imgProps),
        ]);
        const zoom = el('a', { href: src, className: ['fig-zoom'], 'aria-label': 'Enlarge figure' }, [pic]);
        // Absorb the following *Figure N. ...* paragraph as the caption.
        let j = i + 1;
        while (j < parent.children.length && isWs(parent.children[j])) j++;
        const next = parent.children[j];
        let capKids = null;
        if (next && next.tagName === 'p') {
          const nk = next.children.filter((k) => !isWs(k));
          if (nk.length === 1 && nk[0].tagName === 'em') capKids = nk[0].children;
        }
        const links = el('span', { className: ['fig-links'] }, [
          el('a', { href: src, target: '_blank', rel: 'noopener' }, [txt('Open full size')]),
          ...(hasPng ? [txt(' · '), el('a', { href: png }, [txt('PNG')])] : []),
        ]);
        const cap = el('figcaption', {}, [...(capKids ? capKids : []), txt(' '), links]);
        parent.children[i] = el('figure', { className: ['fig'] }, [zoom, cap]);
        if (capKids) parent.children.splice(i + 1, j - i);
      }
    };
    walk(tree);
  };
}
