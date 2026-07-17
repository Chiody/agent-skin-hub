# ProvDex 整窗概念广告图（20）

> 画廊级**宣传概念图**，含完整 UI 示意。  
> **不能**当作换肤 `background.jpg` 导入。

机器可读索引（含底图 / 实拍配对 URL）：仓库根目录 [`gallery.json`](../../gallery.json)

| # | 概念图 | 主题 | 可导入底图 | 真机实拍 |
|---|--------|------|------------|----------|
| 01 | [`01-rose-soft.jpg`](./01-rose-soft.jpg) | 柔光玫瑰 | [`preset-trial-rose-soft`](../../presets/preset-trial-rose-soft) | [preview](../previews/preset-trial-rose-soft.jpg) |
| 02 | [`02-caishen.jpg`](./02-caishen.jpg) | 财神打工 | [`preset-trial-caishen`](../../presets/preset-trial-caishen) | [preview](../previews/preset-trial-caishen.jpg) |
| 03 | [`03-scifi-redwhite.jpg`](./03-scifi-redwhite.jpg) | 红白科幻 | — | — |
| 04 | [`04-sage-clear.jpg`](./04-sage-clear.jpg) | 清透鼠尾草 | — | — |
| 05 | [`05-enfp-cosmos.jpg`](./05-enfp-cosmos.jpg) | ENFP 小宇宙 | — | — |
| 06 | [`06-purple-night.jpg`](./06-purple-night.jpg) | 紫夜星河 | — | — |
| 07 | [`07-cyan-idol.jpg`](./07-cyan-idol.jpg) | 青蓝虚拟偶像 | — | — |
| 08 | [`08-black-gold.jpg`](./08-black-gold.jpg) | 舞台黑金 | — | — |
| 09 | [`09-synthwave.jpg`](./09-synthwave.jpg) | Synthwave 80s | — | — |
| 10 | [`10-nordic-minimal.jpg`](./10-nordic-minimal.jpg) | 北欧极简 | — | — |
| 11 | [`11-cyber-rain.jpg`](./11-cyber-rain.jpg) | 赛博雨夜 | [`preset-trial-neon-rain`](../../presets/preset-trial-neon-rain) | [preview](../previews/preset-trial-neon-rain.jpg) |
| 12 | [`12-ocean-coast.jpg`](./12-ocean-coast.jpg) | 海边编程 | — | — |
| 13 | [`13-coffee-cozy.jpg`](./13-coffee-cozy.jpg) | 咖啡窝 | — | — |
| 14 | [`14-matrix-terminal.jpg`](./14-matrix-terminal.jpg) | 黑客终端 | — | — |
| 15 | [`15-sakura-night.jpg`](./15-sakura-night.jpg) | 樱花夜 | [`preset-sakura-dawn`](../../presets/preset-sakura-dawn)（近色） | [preview](../previews/preset-sakura-dawn.jpg) |
| 16 | [`16-steampunk.jpg`](./16-steampunk.jpg) | 蒸汽朋克 | — | — |
| 17 | [`17-desert-sunset.jpg`](./17-desert-sunset.jpg) | 沙漠落日 | — | — |
| 18 | [`18-snow-cabin.jpg`](./18-snow-cabin.jpg) | 雪屋静写 | [`preset-snow-scape`](../../presets/preset-snow-scape)（近色） | [preview](../previews/preset-snow-scape.jpg) |
| 19 | [`19-space-nasa.jpg`](./19-space-nasa.jpg) | 太空站 | — | — |
| 20 | [`20-saas-teal.jpg`](./20-saas-teal.jpg) | Teal SaaS | — | — |

## 分组

- **对照仓 8 向**：01–08  
- **海外向**：09 synthwave · 10 nordic · 12 ocean · 17 desert · 19 space · 20 saas  
- **其他**：11 cyber · 13 coffee · 14 matrix · 15 sakura · 16 steampunk · 18 snow  

## 调用示例

```js
const g = await fetch(
  "https://raw.githubusercontent.com/Chiody/agent-skin-hub/main/gallery.json"
).then((r) => r.json());

for (const c of g.concepts) {
  console.log(c.name, c.concept.url, c.wallpaper?.url, c.livePreview?.url);
}
```
