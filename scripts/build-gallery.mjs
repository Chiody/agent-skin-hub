#!/usr/bin/env node
/**
 * Build gallery.json — concept ads + optional wallpaper/live-preview pairs.
 * Consumed by GitHub README tooling, ProvDex website, and future clients.
 */
import { existsSync, readdirSync, writeFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const RAW = "https://raw.githubusercontent.com/Chiody/agent-skin-hub/main";
const now = new Date().toISOString();

/** Concept ad metadata + optional preset/live bindings */
const CONCEPTS = [
  { id: "01-rose-soft", file: "01-rose-soft.jpg", name: "柔光玫瑰", group: "reference-8", presetId: "preset-trial-rose-soft" },
  { id: "02-caishen", file: "02-caishen.jpg", name: "财神打工", group: "reference-8", presetId: "preset-trial-caishen" },
  { id: "03-scifi-redwhite", file: "03-scifi-redwhite.jpg", name: "红白科幻", group: "reference-8" },
  { id: "04-sage-clear", file: "04-sage-clear.jpg", name: "清透鼠尾草", group: "reference-8" },
  { id: "05-enfp-cosmos", file: "05-enfp-cosmos.jpg", name: "ENFP 小宇宙", group: "reference-8" },
  { id: "06-purple-night", file: "06-purple-night.jpg", name: "紫夜星河", group: "reference-8" },
  { id: "07-cyan-idol", file: "07-cyan-idol.jpg", name: "青蓝虚拟偶像", group: "reference-8" },
  { id: "08-black-gold", file: "08-black-gold.jpg", name: "舞台黑金", group: "reference-8" },
  { id: "09-synthwave", file: "09-synthwave.jpg", name: "Synthwave 80s", group: "intl" },
  { id: "10-nordic-minimal", file: "10-nordic-minimal.jpg", name: "北欧极简", group: "intl" },
  { id: "11-cyber-rain", file: "11-cyber-rain.jpg", name: "赛博雨夜", group: "other", presetId: "preset-trial-neon-rain" },
  { id: "12-ocean-coast", file: "12-ocean-coast.jpg", name: "海边编程", group: "intl" },
  { id: "13-coffee-cozy", file: "13-coffee-cozy.jpg", name: "咖啡窝", group: "other" },
  { id: "14-matrix-terminal", file: "14-matrix-terminal.jpg", name: "黑客终端", group: "other" },
  { id: "15-sakura-night", file: "15-sakura-night.jpg", name: "樱花夜", group: "other", presetId: "preset-sakura-dawn" },
  { id: "16-steampunk", file: "16-steampunk.jpg", name: "蒸汽朋克", group: "other" },
  { id: "17-desert-sunset", file: "17-desert-sunset.jpg", name: "沙漠落日", group: "intl" },
  { id: "18-snow-cabin", file: "18-snow-cabin.jpg", name: "雪屋静写", group: "other", presetId: "preset-snow-scape" },
  { id: "19-space-nasa", file: "19-space-nasa.jpg", name: "太空站", group: "intl" },
  { id: "20-saas-teal", file: "20-saas-teal.jpg", name: "Teal SaaS", group: "intl" },
];

function abs(rel) {
  return rel ? `${RAW}/${rel.replace(/^\//, "")}` : null;
}

function fileMeta(rel) {
  const p = join(root, rel);
  if (!existsSync(p)) return null;
  return { path: rel, url: abs(rel), bytes: statSync(p).size };
}

const concepts = [];
for (const c of CONCEPTS) {
  const conceptRel = `docs/ads/${c.file}`;
  const concept = fileMeta(conceptRel);
  if (!concept) {
    console.warn(`skip missing ad: ${conceptRel}`);
    continue;
  }

  let wallpaper = null;
  let livePreview = null;
  let downloadBase = null;
  if (c.presetId) {
    const bg = `presets/${c.presetId}/background.jpg`;
    wallpaper = fileMeta(bg);
    livePreview = fileMeta(`docs/previews/${c.presetId}.jpg`);
    if (wallpaper) {
      downloadBase = abs(`presets/${c.presetId}`);
    }
  }

  concepts.push({
    id: c.id,
    name: c.name,
    group: c.group,
    kind: "concept-ad",
    note: "整窗概念宣传图，勿当作换肤 background 导入",
    concept,
    wallpaper,
    livePreview,
    presetId: c.presetId || null,
    downloadBase,
  });
}

/** All installable presets with wallpaper + optional live preview */
const presetsDir = join(root, "presets");
const installables = [];
for (const name of readdirSync(presetsDir).sort()) {
  const dir = join(presetsDir, name);
  if (!statSync(dir).isDirectory()) continue;
  const wallpaper = fileMeta(`presets/${name}/background.jpg`);
  if (!wallpaper) continue;
  const livePreview = fileMeta(`docs/previews/${name}.jpg`);
  installables.push({
    id: name,
    wallpaper,
    livePreview,
    downloadBase: abs(`presets/${name}`),
  });
}

const gallery = {
  schemaVersion: 1,
  name: "agent-skin-hub-gallery",
  updatedAt: now,
  homepage: "https://github.com/Chiody/agent-skin-hub",
  rawBase: RAW,
  catalogUrl: `${RAW}/catalog.json`,
  usage: {
    concept: "营销/画廊展示用整窗效果图",
    wallpaper: "可导入的纯背景底图（16:9）",
    livePreview: "真机 Codex 实拍（原生控件换色）",
  },
  concepts,
  installables,
};

writeFileSync(join(root, "gallery.json"), JSON.stringify(gallery, null, 2) + "\n");
console.log(
  `Wrote gallery.json: ${concepts.length} concepts, ${installables.length} installables`,
);
