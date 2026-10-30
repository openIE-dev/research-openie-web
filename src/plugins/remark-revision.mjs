// `{{revision}}` in paper Markdown becomes "Revision <hash>, <date>" for the
// last commit that changed the file, with the hash linked to the file's
// history. The version line is read from git, never typed.
import { revisionOf } from '../lib/revision.mjs';

const TOKEN = '{{revision}}';

export default function remarkRevision() {
  return (tree, file) => {
    const walk = (node) => {
      if (!node.children) return;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child.type === 'text' && child.value.includes(TOKEN)) {
          const r = revisionOf(file.path);
          const [before, after] = child.value.split(TOKEN, 2);
          const parts = [
            { type: 'text', value: `${before}${before.trim() ? 'revision' : 'Revision'} ` },
            { type: 'link', url: r.history, children: [{ type: 'inlineCode', value: r.hash }] },
            { type: 'text', value: `, ${r.date}${after}` },
          ];
          node.children.splice(i, 1, ...parts);
          i += parts.length - 1;
          continue;
        }
        walk(child);
      }
    };
    walk(tree);
  };
}
