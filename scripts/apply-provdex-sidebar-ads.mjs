const ADS = [
  "★ ProvDex",
  "多智能体管理中心",
  "一键更换皮肤",
  "一键切换模型",
  "Claude · Codex · Desktop",
  "→ provdex.com",
];
const PINNED = "ProvDex · 外观 Skin Hub";

const list = await (await fetch("http://127.0.0.1:9341/json/list")).json();
const page = list.find((p) => p.type === "page" && String(p.url || "").startsWith("app://"));
if (!page) throw new Error("no page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r, j) => {
  ws.addEventListener("open", r, { once: true });
  ws.addEventListener("error", j, { once: true });
});
let id = 1;
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
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
  awaitPromise: true,
  returnByValue: true,
  expression: `(() => {
    const ADS = ${JSON.stringify(ADS)};
    const PINNED = ${JSON.stringify(PINNED)};
    const KEY = "__provdexSidebarAds";
    if (window[KEY]?.obs) { try { window[KEY].obs.disconnect(); } catch {} }

    const apply = () => {
      const aside = document.querySelector("aside.app-shell-left-panel");
      if (!aside) return { ok: false, reason: "no aside" };
      // Prefer project-row truncate labels
      let sels = [...aside.querySelectorAll("span.min-w-0.truncate.select-none.flex-1")];
      if (sels.length < 3) sels = [...aside.querySelectorAll("span.min-w-0.truncate")];
      // Skip pure nav if needed: rewrite from first project-like cluster
      const out = [];
      if (sels[0]) { sels[0].textContent = PINNED; out.push(PINNED); }
      let ai = 0;
      for (const el of sels.slice(1)) {
        if (ai >= ADS.length) break;
        const t = (el.textContent || "").trim();
        // skip empty
        if (!t) continue;
        el.textContent = ADS[ai++];
        out.push(el.textContent);
      }
      return { ok: true, count: out.length, labels: out };
    };

    const first = apply();
    const obs = new MutationObserver(() => {
      // debounce via rAF
      if (window[KEY].raf) return;
      window[KEY].raf = requestAnimationFrame(() => {
        window[KEY].raf = 0;
        apply();
      });
    });
    const aside = document.querySelector("aside.app-shell-left-panel");
    if (aside) obs.observe(aside, { childList: true, subtree: true, characterData: true });
    window[KEY] = { obs, apply, ads: ADS };
    return first;
  })()`,
});
console.log(JSON.stringify(r.result?.value, null, 2));
ws.close();
