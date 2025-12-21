/**
 * LionGateOS — Report duplicates (no deletion)
 * Lists any .js/.jsx file in ./src that has a .ts/.tsx sibling with the same basename.
 *
 * Usage:
 *   node tools/report-duplicates.cjs
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
const matches = [];
for (const f of files) {
  const sib = getSiblingTs(f);
  if (sib) matches.push([f, sib]);
}

if (matches.length === 0) {
  console.log("No duplicates found (no .js/.jsx files with TS/TSX siblings).");
  process.exit(0);
}

console.log("Duplicates found (JS/JSX has TS/TSX sibling):");
for (const [js, ts] of matches) {
  console.log("-", path.relative(projectRoot, js), "<->", path.relative(projectRoot, ts));
}
console.log("Total duplicates:", matches.length);
