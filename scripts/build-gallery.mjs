#!/usr/bin/env node
/**
 * Build gallery.json — concept ads + optional wallpaper/live-preview pairs.
 */
import { existsSync, readdirSync, writeFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const RAW = "https://raw.githubusercontent.com/Chiody/agent-skin-hub/main";
const now = new Date().toISOString();

/** Glass Codex mockups (v2). ProvDex slogans live in sidebar 项目 list. */
const CONCEPTS = [
  { id: "01-sakura-glass", file: "01-sakura-glass.jpg", name: "夜樱玻璃", group: "cn-v2", presetId: "preset-trial-rose-soft" },
  { id: "02-caishen-glass", file: "02-caishen-glass.jpg", name: "财神打工", group: "cn-v2", presetId: "preset-trial-caishen" },
  { id: "03-guochao-glass", file: "03-guochao-glass.jpg", name: "国潮赛博", group: "cn-v2", presetId: "preset-trial-neon-rain" },
  { id: "04-rooftop-glass", file: "04-rooftop-glass.jpg", name: "放学屋顶", group: "cn-v2" },
  { id: "05-xianxia-glass", file: "05-xianxia-glass.jpg", name: "修仙国漫", group: "cn-v2" },
  { id: "06-kpop-glass", file: "06-kpop-glass.jpg", name: "韩偶女", group: "cn-v2" },
  { id: "07-kpop-boy-glass", file: "07-kpop-boy-glass.jpg", name: "韩偶男", group: "cn-v2" },
  { id: "08-overtime-meme", file: "08-overtime-meme.jpg", name: "加班梗图", group: "cn-v2" },
  { id: "09-hanfu-glass", file: "09-hanfu-glass.jpg", name: "汉服园林", group: "cn-v2" },
  { id: "10-vtuber-glass", file: "10-vtuber-glass.jpg", name: "虚拟偶像", group: "cn-v2" },
  { id: "11-koi-glass", file: "11-koi-glass.jpg", name: "锦鲤好运", group: "cn-v2" },
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
    wallpaper = fileMeta(`presets/${c.presetId}/background.jpg`);
    livePreview = fileMeta(`docs/previews/${c.presetId}.jpg`);
    if (wallpaper) downloadBase = abs(`presets/${c.presetId}`);
  }

  concepts.push({
    id: c.id,
    name: c.name,
    group: c.group,
    kind: "concept-ad",
    note: "整窗概念宣传图（玻璃侧栏 + Codex 壳），勿当作换肤 background 导入",
    concept,
    wallpaper,
    livePreview,
    presetId: c.presetId || null,
    downloadBase,
  });
}

const presetsDir = join(root, "presets");
const installables = [];
for (const name of readdirSync(presetsDir).sort()) {
  const dir = join(presetsDir, name);
  if (!statSync(dir).isDirectory()) continue;
  const wallpaper = fileMeta(`presets/${name}/background.jpg`);
  if (!wallpaper) continue;
  installables.push({
    id: name,
    wallpaper,
    livePreview: fileMeta(`docs/previews/${name}.jpg`),
    downloadBase: abs(`presets/${name}`),
  });
}

const gallery = {
  schemaVersion: 2,
  name: "agent-skin-hub-gallery",
  updatedAt: now,
  homepage: "https://github.com/Chiody/agent-skin-hub",
  rawBase: RAW,
  catalogUrl: `${RAW}/catalog.json`,
  usage: {
    concept: "营销/画廊展示用整窗效果图（v2 玻璃风）",
    wallpaper: "可导入的纯背景底图（16:9）",
    livePreview: "真机 Codex 实拍（原生控件换色）",
  },
  concepts,
  installables,
};

writeFileSync(join(root, "gallery.json"), JSON.stringify(gallery, null, 2) + "\n");
console.log(`Wrote gallery.json: ${concepts.length} concepts, ${installables.length} installables`);
