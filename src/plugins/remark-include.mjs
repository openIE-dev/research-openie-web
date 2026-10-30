// Single-source includes for paper Markdown.
// A paragraph-level HTML comment `<!-- include: name -->` is replaced by the
// parsed contents of src/includes/name.md, using the same Markdown parser
// (so math and tables in the include render exactly as in a paper).
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.resolve('src/includes');
const RE = /^<!--\s*include:\s*([a-z0-9-]+)\s*-->$/;

export default function remarkInclude() {
  const processor = this;
  return (tree) => {
    const walk = (node) => {
      if (!node.children) return;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child.type === 'html') {
          const m = child.value.trim().match(RE);
          if (m) {
            const file = path.join(DIR, `${m[1]}.md`);
            if (!fs.existsSync(file)) throw new Error(`remark-include: missing ${file}`);
            const sub = processor.parse(fs.readFileSync(file, 'utf8'));
            node.children.splice(i, 1, ...sub.children);
            i += sub.children.length - 1;
            continue;
          }
        }
        walk(child);
      }
    };
    walk(tree);
  };
}
