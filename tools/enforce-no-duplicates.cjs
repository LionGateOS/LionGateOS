/**
 * LionGateOS — Enforce "TypeScript is the single source of truth"
 * Deletes .js/.jsx files in ./src only when a .ts/.tsx sibling exists.
 *
 * Usage:
 *   node tools/enforce-no-duplicates.cjs
 */
const fs = require("fs");
const path = require("path");

const projectRoot = process.cwd();
const srcDir = path.join(projectRoot, "src");

function exists(p) { try { fs.accessSync(p); return true; } catch { return false; } }
function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}
function isJsLike(p) { return p.endsWith(".js") || p.endsWith(".jsx"); }
function getSiblingTs(jsPath) {
  const dir = path.dirname(jsPath);
  const base = path.basename(jsPath).replace(/\.jsx?$/, "");
  const ts = path.join(dir, base + ".ts");
  const tsx = path.join(dir, base + ".tsx");
  if (exists(tsx)) return tsx;
  if (exists(ts)) return ts;
  return null;
}

if (!exists(srcDir)) {
  console.error("ERROR: src/ not found. Run this from the LionGateOS project root.");
  process.exit(1);
}

const files = walk(srcDir).filter(isJsLike);

let deleted = 0;
let kept = 0;

for (const f of files) {
  const sib = getSiblingTs(f);
  if (!sib) { kept++; continue; }

  try {
    fs.unlinkSync(f);
    deleted++;
    console.log("Deleted duplicate:", path.relative(projectRoot, f), "(TS sibling:", path.relative(projectRoot, sib) + ")");
  } catch (e) {
    console.warn("Could not delete:", path.relative(projectRoot, f), "-", e.message);
  }
}

console.log("Done.");
console.log("Deleted:", deleted);
console.log("Kept (no TS sibling):", kept);
