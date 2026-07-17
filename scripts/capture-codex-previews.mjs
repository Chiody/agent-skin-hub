#!/usr/bin/env node
/**
 * Switch hub presets into live Codex Dream Skin and capture real window shots.
 */
import { spawn } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const hub = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(hub, "docs", "previews");
const themesRoot = join(
  homedir(),
  "Library",
  "Application Support",
  "CodexDreamSkinStudio",
  "themes"
);
const switchScript = join(
  homedir(),
  ".codex",
  "codex-dream-skin-studio",
  "scripts",
  "switch-theme-macos.sh"
);

const FEATURED = [
  "preset-cyber-neon",
  "preset-azure-matrix",
  "preset-strawberry-starlight",
  "preset-snow-scape",
  "preset-midnight-aurora",
  "preset-aurora-veil",
];

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    p.stdout.on("data", (d) => (stdout += d));
    p.stderr.on("data", (d) => (stderr += d));
    p.on("close", (code) => {
      if (code !== 0) reject(new Error(stderr || stdout || `exit ${code}`));
      else resolve(stdout);
    });
  });
}

function seedPreset(id) {
  const src = join(hub, "presets", id);
  const dest = join(themesRoot, id);
  mkdirSync(dest, { recursive: true });
  const theme = JSON.parse(readFileSync(join(src, "theme.json"), "utf8"));
  const image = theme.image || "background.jpg";
  copyFileSync(join(src, "theme.json"), join(dest, "theme.json"));
  copyFileSync(join(src, image), join(dest, image));
}

async function cdpScreenshot(path) {
  const list = await fetch("http://127.0.0.1:9341/json/list").then((r) =>
    r.json()
  );
  const page = list.find(
    (p) => p.type === "page" && String(p.url || "").startsWith("app://")
  );
  if (!page?.webSocketDebuggerUrl) {
    throw new Error("No Codex app:// page on CDP 9341");
  }
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve);
    ws.addEventListener("error", reject);
  });

  let nextId = 1;
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = nextId++;
      const onMessage = (ev) => {
        const msg = JSON.parse(ev.data);
        if (msg.id !== id) return;
        ws.removeEventListener("message", onMessage);
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result);
      };
      ws.addEventListener("message", onMessage);
      ws.send(JSON.stringify({ id, method, params }));
    });

  await send("Page.enable");
  // wait a beat for skin paint
  await new Promise((r) => setTimeout(r, 1200));
  const shot = await send("Page.captureScreenshot", {
    format: "jpeg",
    quality: 88,
    fromSurface: true,
  });
  ws.close();
  writeFileSync(path, Buffer.from(shot.data, "base64"));
}

mkdirSync(outDir, { recursive: true });

const available = FEATURED.filter((id) =>
  existsSync(join(hub, "presets", id, "theme.json"))
);

for (const id of available) {
  console.log("seed", id);
  seedPreset(id);
  console.log("switch", id);
  await run(switchScript, ["--id", id]);
  await new Promise((r) => setTimeout(r, 1800));
  const out = join(outDir, `${id}.jpg`);
  console.log("shot", out);
  await cdpScreenshot(out);
}

// also write a simple gallery strip index
writeFileSync(
  join(outDir, "README.md"),
  `# Live Codex previews\n\nCaptured from a running Codex Desktop + Dream Skin session.\n\n${available
    .map((id) => `- ![${id}](./${id}.jpg)`)
    .join("\n")}\n`
);
console.log("done", available.length);
