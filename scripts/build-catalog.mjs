#!/usr/bin/env node
/**
 * Build catalog.json from presets/<id>/theme.json + SOURCE.md
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const presetsDir = join(root, "presets");
const now = new Date().toISOString();

const presets = [];
for (const name of readdirSync(presetsDir).sort()) {
  const dir = join(presetsDir, name);
  if (!statSync(dir).isDirectory()) continue;
  const themePath = join(dir, "theme.json");
  if (!existsSync(themePath)) continue;
  const theme = JSON.parse(readFileSync(themePath, "utf8"));
  const image = theme.image || "background.jpg";
  const imagePath = join(dir, image);
  const bytes = existsSync(imagePath) ? statSync(imagePath).size : 0;
  let sourceUrl = "";
  const sourceMd = join(dir, "SOURCE.md");
  if (existsSync(sourceMd)) {
    const m = readFileSync(sourceMd, "utf8").match(/https?:\/\/[^\s)]+/);
    if (m) sourceUrl = m[0];
  }
  presets.push({
    id: theme.id || name,
    name: theme.name || name,
    tagline: theme.tagline || "",
    image,
    bytes,
    path: `presets/${name}`,
    downloadBase: `https://raw.githubusercontent.com/Chiody/agent-skin-hub/main/presets/${name}`,
    sourceUrl,
    risk: "low",
    tags: ["abstract"],
  });
}

const catalog = {
  schemaVersion: 1,
  name: "agent-skin-hub",
  description:
    "Open catalog of Codex Desktop Dream Skin compatible presets. ProvDex / website fetch this file; skins download on demand.",
  updatedAt: now,
  homepage: "https://github.com/Chiody/agent-skin-hub",
  compatibleWith: ["codex-dream-skin", "provdex-codex-appearance"],
  presets,
};

writeFileSync(join(root, "catalog.json"), JSON.stringify(catalog, null, 2) + "\n");
console.log(`Wrote catalog.json with ${presets.length} presets`);
