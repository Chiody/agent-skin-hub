const LINES = [
  "★ ProvDex",
  "多智能体管理中心",
  "一键更换皮肤",
  "一键切换模型",
  "Claude · Codex · Desktop",
  "→ provdex.com",
  "外观 Skin Hub 免费",
  "API 本地写入 · 安全",
];
const list = await (await fetch("http://127.0.0.1:9341/json/list")).json();
const page = list.find((p) => p.type === "page" && String(p.url || "").startsWith("app://"));
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r, j) => { ws.addEventListener("open", r, { once: true }); ws.addEventListener("error", j, { once: true }); });
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
await send("Runtime.enable");
const r = await send("Runtime.evaluate", {
  returnByValue: true,
  expression: `(() => {
    const LINES = ${JSON.stringify(LINES)};
    const KEY = "__provdexSidebarAds";
    if (window[KEY]?.obs) try { window[KEY].obs.disconnect(); } catch {}
    const NAV = /^(新建任务|拉取请求|已安排|插件|搜索|设置|账户|Codex|置顶|项目|Pinned|Projects|帮助)$/;
    const apply = () => {
      const aside = document.querySelector("aside.app-shell-left-panel");
      if (!aside) return { ok:false };
      // Prefer flex-1 truncate (project/thread titles)
      let nodes = [...aside.querySelectorAll("span.min-w-0.truncate.select-none.flex-1")];
      if (nodes.length < 4) nodes = [...aside.querySelectorAll("span.min-w-0.truncate")];
      nodes = nodes.filter(el => {
        const t = (el.textContent||"").trim();
        return t && !NAV.test(t);
      });
      const out = [];
      for (let i = 0; i < nodes.length && i < LINES.length; i++) {
        nodes[i].textContent = LINES[i];
        out.push(LINES[i]);
      }
      // Also rewrite top brand if present
      const brand = [...aside.querySelectorAll("button, span")].find(el => /^(Codex|ProvDex)/.test((el.textContent||"").trim()) && (el.textContent||"").trim().length < 24);
      if (brand && brand.childElementCount === 0) brand.textContent = "ProvDex";
      return { ok:true, count: out.length, labels: out, totalNodes: nodes.length };
    };
    const first = apply();
    const obs = new MutationObserver(() => {
      if (window[KEY].raf) return;
      window[KEY].raf = requestAnimationFrame(() => { window[KEY].raf = 0; apply(); });
    });
    const aside = document.querySelector("aside.app-shell-left-panel");
    if (aside) obs.observe(aside, { childList:true, subtree:true, characterData:true });
    window[KEY] = { obs, apply };
    return first;
  })()`
});
console.log(JSON.stringify(r.result?.value, null, 2));
ws.close();
