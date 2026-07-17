<p align="center">
  <img src="docs/previews/preset-strawberry-starlight.jpg" width="920" alt="星莓绮梦 · Codex 首页实机" />
</p>

<h1 align="center">agent-skin-hub</h1>

<p align="center">
  <strong>给 Codex 桌面端换一张会呼吸的脸。</strong><br/>
  截的是首页 · 壁纸铺满 · 控件还能点 · 不是对话页糊一层灰
</p>

<p align="center">
  <a href="https://github.com/Chiody/agent-skin-hub/stargazers"><img alt="stars" src="https://img.shields.io/github/stars/Chiody/agent-skin-hub?style=for-the-badge&color=ff4d8d" /></a>
  <a href="./catalog.json"><img alt="skins" src="https://img.shields.io/badge/skins-12+-ready-34d399?style=for-the-badge" /></a>
  <a href="./LICENSE"><img alt="license" src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" /></a>
</p>

<p align="center">
  <a href="#-首页实机效果"><b>真机截图</b></a> ·
  <a href="#-30-秒用上"><b>怎么用</b></a> ·
  <a href="#-皮肤库"><b>皮肤库</b></a> ·
  <a href="#-投稿你的皮肤"><b>投稿</b></a>
</p>

---

写代码已经够累了。**工作台，至少可以好看一点。**

`agent-skin-hub` 是 Codex Desktop 的开源皮肤合集。  
和 [Codex Dream Skin](https://github.com/Fei-Away/Codex-Dream-Skin) 一样：**截首页**——大标题、建议卡、输入框都在，背景整窗铺满，不是聊天线程里那层发灰的任务页。

> 非 OpenAI 官方。不改 `.app` / `app.asar`。  
> 皮肤在 GitHub，ProvDex / 官网按需下载，**安装包不会被皮肤撑爆。**

---

## ✨ 首页实机效果

下面全部是 **Codex 首页**实拍（Dream Skin 注入后）。侧栏项目名排成 ProvDex 一句话广告。

<p align="center">
  <img src="docs/previews/preset-azure-matrix.jpg" width="900" alt="苍蓝矩阵 · 首页" /><br/>
  <sub>苍蓝矩阵 · 首页 · BUILD BEYOND THE HORIZON</sub>
</p>

<p align="center">
  <img src="docs/previews/preset-snow-scape.jpg" width="900" alt="雪景 · 首页" /><br/>
  <sub>雪景 · 首页 · CODE IN THE QUIET</sub>
</p>

<p align="center">
  <img src="docs/previews/preset-ember-bloom.jpg" width="440" alt="Ember Bloom" />
  &nbsp;
  <img src="docs/previews/preset-cyber-neon.jpg" width="440" alt="赛博霓虹" /><br/>
  <sub>Ember Bloom · 赛博霓虹</sub>
</p>

<p align="center">
  <img src="docs/previews/preset-midnight-aurora.jpg" width="440" alt="午夜极光" />
  &nbsp;
  <img src="docs/previews/preset-strawberry-starlight.jpg" width="440" alt="星莓绮梦" /><br/>
  <sub>午夜极光 · 星莓绮梦</sub>
</p>

喜欢就 **Star**——合集越大，皮肤越多。

---

## 🚀 30 秒用上

### 方式 A · ProvDex（推荐）

1. 打开 [ProvDex](https://provdex.com) → Codex → **外观**
2. 从 Skin Hub 选一套（自动拉远程）
3. 点 **应用并打开 Codex**

合集页：[Skin Hub](https://provdex.com/skinhub.html)

### 方式 B · Codex Dream Skin

```bash
git clone --depth 1 https://github.com/Chiody/agent-skin-hub.git
cp -R agent-skin-hub/presets/preset-strawberry-starlight \
  "$HOME/Library/Application Support/CodexDreamSkinStudio/themes/"

~/.codex/codex-dream-skin-studio/scripts/switch-theme-macos.sh \
  --id preset-strawberry-starlight
```

切完请回到 **首页 / 新对话** 看氛围（任务页会自动压暗背景，这是引擎设计，不是皮肤坏了）。

---

## 🎨 皮肤库

| 皮肤 | 气质 | 首页实机 |
|------|------|----------|
| 星莓绮梦 | 粉色星河 | [截图](docs/previews/preset-strawberry-starlight.jpg) |
| 苍蓝矩阵 | 深空门户 | [截图](docs/previews/preset-azure-matrix.jpg) |
| 雪景 | 冰蓝雪线 | [截图](docs/previews/preset-snow-scape.jpg) |
| Ember Bloom | 暖光花瓣 | [截图](docs/previews/preset-ember-bloom.jpg) |
| 赛博霓虹 | 品红 × 电青 | [截图](docs/previews/preset-cyber-neon.jpg) |
| 午夜极光 | 深蓝极光 | [截图](docs/previews/preset-midnight-aurora.jpg) |
| 樱粉晨曦 / 森野薄雾 / 琥珀黄昏 / … | 更多抽象预设 | 见 `presets/` |

机器可读目录：[`catalog.json`](./catalog.json)

---

## 💌 投稿你的皮肤

```text
presets/preset-your-slug/
  theme.json       # schemaVersion: 1
  background.jpg   # 无 UI 纯背景，主视觉偏右，左侧留白
  SOURCE.md
```

```bash
node scripts/validate-preset.mjs presets/preset-your-slug
node scripts/build-catalog.mjs
```

**别投：** 游戏 IP / 真人肖像 / 带侧栏输入框的假截图当背景 / 可执行脚本。

截图请像 Dream Skin 一样拍 **首页**，不要拍聊天线程。

---

## 🛡️ 安全

- 只分发主题素材（图 + `theme.json`）
- 换肤走本机 CDP，不改官方安装包
- 与 API / 中转无关，不碰你的 Key

---

<p align="center">
  <sub>Make something wonderful — and make it look wonderful too.</sub>
</p>

## License

MIT。素材以 `presets/*/SOURCE.md` 为准。
