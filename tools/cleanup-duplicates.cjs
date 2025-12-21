/**
 * LionGateOS — Duplicate JSX/JS Cleanup
 * Removes .js/.jsx files that have a .ts/.tsx sibling with the same basename.
 * This enforces: "TypeScript is the single source of truth".
 *
 * Safe-guards:
 * - Only deletes inside ./src
 * - Only deletes when a TS/TSX sibling exists
 */
const fs = require("fs");
const path = require("path");

const projectRoot = process.cwd();
const srcDir = path.join(projectRoot, "src");

function exists(p) {
  try { fs.accessSync(p); return true; } catch { return false; }
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function isJsLike(p) {
  return p.endsWith(".js") || p.endsWith(".jsx");
}

function tsSibling(jsPath) {
  const dir = path.dirname(jsPath);
  const base = path.basename(jsPath).replace(/\.jsx?$/, "");
  const ts = path.join(dir, base + ".ts");
  const tsx = path.join(dir, base + ".tsx");
  if (exists(tsx)) return tsx;
  if (exists(ts)) return ts;
  return null;
}

if (!exists(srcDir)) {
  console.error("ERROR: src/ not found at", srcDir);
  process.exit(1);
}

const files = walk(srcDir).filter(isJsLike);

let deleted = 0;
for (const f of files) {
  const sib = tsSibling(f);
  if (!sib) continue;

  // Do not delete view JSX (no TS equivalents) — this script only deletes when TS exists.
  try {
    fs.unlinkSync(f);
    deleted++;
    console.log("Deleted:", path.relative(projectRoot, f), " (TS sibling:", path.relative(projectRoot, sib) + ")");
  } catch (e) {
    console.warn("Could not delete:", f, e.message);
  }
}

console.log("Done. Deleted", deleted, "duplicate JS/JSX files.");
