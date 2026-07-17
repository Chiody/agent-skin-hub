#!/usr/bin/env node
import { spawn } from "node:child_process";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const hub = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(hub, "docs", "previews");
const themesRoot = join(homedir(), "Library/Application Support/CodexDreamSkinStudio/themes");
const switchScript = join(homedir(), ".codex/codex-dream-skin-studio/scripts/switch-theme-macos.sh");
const FEATURED = process.argv.slice(2).length ? process.argv.slice(2) : [
  "preset-strawberry-starlight",
  "preset-azure-matrix",
  "preset-snow-scape",
  "preset-ember-bloom",
  "preset-cyber-neon",
  "preset-midnight-aurora",
];
const PROJECT_ADS = ["★ ProvDex","多智能体管理中心","一键更换皮肤","一键切换模型","Claude · Codex · Desktop","→ provdex.com"];
const THREAD_ADS = ["外观 Skin Hub 一键应用","中转 / API Key 本地写入","不改官方安装包"];
const PINNED = "ProvDex · 把 API 接到 Claude / Codex";

const run = (cmd, args) => new Promise((res, rej) => {
  const p = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
  let e = ""; p.stderr.on("data", d => e += d);
  p.on("close", c => c ? rej(new Error(e || `exit ${c}`)) : res());
});

async function withPage(fn) {
  const list = await fetch("http://127.0.0.1:9341/json/list").then(r => r.json());
  const page = list.find(p => p.type === "page" && String(p.url || "").startsWith("app://"));
  if (!page) throw new Error("no page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.addEventListener("open", r); ws.addEventListener("error", j); });
  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const i = id++;
    const h = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id !== i) return;
      ws.removeEventListener("message", h);
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
    };
    ws.addEventListener("message", h);
    ws.send(JSON.stringify({ id: i, method, params }));
  });
  await send("Page.enable");
  await send("Runtime.enable");
  try { return await fn(send); }
  finally { try { ws.close(); } catch {} }
}

async function isHome(send) {
  const r = await send("Runtime.evaluate", { returnByValue: true, expression: `(() => {
    const t = document.body.innerText || "";
    return /做些什么|What should we build/i.test(t) && !!document.querySelector(".dream-skin-quote");
  })()` });
  return !!r.result?.value;
}

async function goHome(send) {
  await send("Runtime.evaluate", { expression: `([...document.querySelectorAll("button")].find(b=>(b.textContent||"").includes("取消"))||{}).click?.()` });
  await send("Runtime.evaluate", { expression: `([...document.querySelectorAll("button")].find(b=>(b.textContent||"").includes("新对话"))||{}).click?.()` });
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 250));
    if (await isHome(send)) return true;
  }
  return false;
}

async function stage(send) {
  await send("Runtime.evaluate", { expression: `(() => {
    const PROJECT_ADS = ${JSON.stringify(PROJECT_ADS)};
    const THREAD_ADS = ${JSON.stringify(THREAD_ADS)};
    const PINNED = ${JSON.stringify(PINNED)};
    const aside = document.querySelector("aside.app-shell-left-panel");
    if (!aside) return;
    const sels = [...aside.querySelectorAll("span.min-w-0.truncate.select-none.flex-1")];
    if (sels[0]) sels[0].textContent = PINNED;
    [...aside.querySelectorAll("span.min-w-0.truncate.pr-1")].forEach((el,i) => {
      if (i < PROJECT_ADS.length) el.textContent = PROJECT_ADS[i];
      else { const row = el.closest("li,div.group,button"); if (row) row.style.display="none"; }
    });
    let t=0; sels.slice(1).forEach(el => {
      if (t < THREAD_ADS.length) el.textContent = THREAD_ADS[t++];
      else { const row = el.closest("li,div.group,button,a"); if (row) row.style.display="none"; }
    });
    [...aside.querySelectorAll("button")].forEach(b => { if ((b.textContent||"").includes("展开")) b.style.display="none"; });
    [...aside.querySelectorAll("span.min-w-0.truncate")].forEach(el => {
      if ((el.textContent||"").trim()==="项目") el.textContent="ProvDex";
      if ((el.textContent||"").trim()==="置顶") el.textContent="推荐";
    });
    const tips = ["用 ProvDex 一键换 Codex 皮肤","一键把 API 接到 Claude / Codex","多智能体管理，模型随手切换"];
    [...document.querySelectorAll("main button")].filter(el => {
      const tx=(el.textContent||"").trim();
      return tx.length>18 && !tx.includes("完全访问") && !tx.includes("连接");
    }).slice(0,3).forEach((el,i) => {
      const deep=[...el.querySelectorAll("*")].reverse().find(n=>n.childElementCount===0 && (n.textContent||"").trim().length>8);
      if (deep) deep.textContent = tips[i];
    });
    [...document.querySelectorAll("main *")].forEach(el => {
      if (el.childElementCount) return;
      const tx=(el.textContent||"").trim();
      if (/我们应该在.+中做些什么/.test(tx) || /What should we build/i.test(tx))
        el.textContent = "我们今天用 ProvDex 做点什么？";
      if (tx === "shangji") el.textContent = "ProvDex";
    });
  })()` });
}

mkdirSync(outDir, { recursive: true });
for (const id of FEATURED) {
  const src = join(hub, "presets", id);
  if (!existsSync(join(src, "theme.json"))) { console.warn("skip", id); continue; }
  const dest = join(themesRoot, id);
  mkdirSync(dest, { recursive: true });
  const theme = JSON.parse(readFileSync(join(src, "theme.json"), "utf8"));
  const image = theme.image || "background.jpg";
  copyFileSync(join(src, "theme.json"), join(dest, "theme.json"));
  copyFileSync(join(src, image), join(dest, image));
  console.log("switch", id);
  await run(switchScript, ["--id", id]);
  await new Promise(r => setTimeout(r, 1800));
  await withPage(async (send) => {
    if (!(await goHome(send))) throw new Error("not home: " + id);
    await stage(send);
    await new Promise(r => setTimeout(r, 400));
    await stage(send);
    if (!(await isHome(send))) throw new Error("lost home: " + id);
    await new Promise(r => setTimeout(r, 600));
    const s = await send("Page.captureScreenshot", { format: "jpeg", quality: 93, fromSurface: true });
    writeFileSync(join(outDir, id + ".jpg"), Buffer.from(s.data, "base64"));
  });
  console.log("ok", id);
}
console.log("DONE");
