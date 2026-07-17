const list = await (await fetch("http://127.0.0.1:9341/json/list")).json();
const page = list.find((p) => p.type === "page" && String(p.url || "").startsWith("app://"));
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r, j) => { ws.addEventListener("open", r, { once: true }); ws.addEventListener("error", j, { once: true }); });
let id = 1;
const send = (m, p = {}) => new Promise((res, rej) => {
  const i = id++;
  const h = (ev) => { const msg = JSON.parse(ev.data); if (msg.id !== i) return; ws.removeEventListener("message", h); msg.error ? rej(Error(JSON.stringify(msg.error))) : res(msg.result); };
  ws.addEventListener("message", h);
  ws.send(JSON.stringify({ id: i, method: m, params: p }));
});
await send("Runtime.evaluate", { expression: `(() => {
  const ID = "provdex-contrast-boost";
  document.getElementById(ID)?.remove();
  const s = document.createElement("style");
  s.id = ID;
  s.textContent = \`
    html.codex-dream-skin[data-dream-shell="light"] .group\\\\/home-suggestions button {
      background: rgba(255,248,240,0.94) !important;
      color: #1C1210 !important;
      border-color: rgba(185,28,28,0.28) !important;
    }
    html.codex-dream-skin[data-dream-shell="light"] .group\\\\/home-suggestions button * {
      color: inherit !important;
      opacity: 1 !important;
    }
    html.codex-dream-skin[data-dream-shell="light"] .group\\\\/home-suggestions button > span:last-child,
    html.codex-dream-skin[data-dream-shell="light"] .group\\\\/home-suggestions button span {
      color: #1C1210 !important;
      opacity: 1 !important;
    }
    html.codex-dream-skin[data-dream-shell="light"] [data-feature="game-source"] {
      color: #1C1210 !important;
    }
    html.codex-dream-skin[data-dream-shell="light"] [data-feature="game-source"]::after {
      color: rgba(28,18,16,0.82) !important;
    }
    html.codex-dream-skin[data-dream-shell="light"] aside.app-shell-left-panel,
    html.codex-dream-skin[data-dream-shell="light"] aside.app-shell-left-panel button,
    html.codex-dream-skin[data-dream-shell="light"] aside.app-shell-left-panel a,
    html.codex-dream-skin[data-dream-shell="light"] aside.app-shell-left-panel span {
      color: #1C1210 !important;
    }
  \`;
  document.documentElement.appendChild(s);
  return true;
})()` });
console.log("contrast ok");
ws.close();
