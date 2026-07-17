#!/usr/bin/env node
/**
 * Validate one preset directory for agent-skin-hub.
 * Usage: node scripts/validate-preset.mjs <preset-dir>
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, basename } from "node:path";

const dir = process.argv[2];
if (!dir) {
  console.error("Usage: node scripts/validate-preset.mjs <preset-dir>");
  process.exit(2);
}

const errors = [];
const warnings = [];
const id = basename(dir);
if (!/^preset-[a-z0-9-]+$/.test(id)) {
  errors.push(`dir name must match preset-<slug>: ${id}`);
}

const themePath = join(dir, "theme.json");
if (!existsSync(themePath)) errors.push("missing theme.json");
else {
  let theme;
  try {
    theme = JSON.parse(readFileSync(themePath, "utf8"));
  } catch (e) {
    errors.push(`theme.json parse error: ${e.message}`);
  }
  if (theme) {
    if (theme.schemaVersion !== 1) errors.push("schemaVersion must be 1");
    if (!theme.id || theme.id !== id) errors.push(`theme.id must equal folder name (${id})`);
    if (!theme.name) errors.push("missing name");
    if (!theme.image) errors.push("missing image");
    else {
      const img = join(dir, theme.image);
      if (!existsSync(img)) errors.push(`image missing: ${theme.image}`);
      else {
        const st = statSync(img);
        if (st.size > 8 * 1024 * 1024) warnings.push(`image > 8MB (${st.size})`);
        if (st.size < 10_000) warnings.push(`image suspiciously small (${st.size})`);
      }
    }
    if (!theme.colors || typeof theme.colors !== "object") {
      warnings.push("missing colors object (hub prefers full palette)");
    }
  }
}

if (!existsSync(join(dir, "SOURCE.md"))) {
  warnings.push("missing SOURCE.md (source URL + rights)");
}

// reject executables / scripts in preset
for (const name of readdirSync(dir)) {
  if (/\.(sh|ps1|exe|dll|bat|command|mjs|js|py|asar)$/i.test(name)) {
    errors.push(`disallowed file in preset pack: ${name}`);
  }
}

const report = { id, dir, ok: errors.length === 0, errors, warnings };
console.log(JSON.stringify(report, null, 2));
process.exit(errors.length ? 1 : 0);
