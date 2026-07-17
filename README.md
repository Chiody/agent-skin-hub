# agent-skin-hub

开源的 **Agent / Codex Desktop 预制皮肤目录**（Dream Skin 兼容格式）。

> 本仓库**只存放皮肤包与目录配置**，不含 ProvDex 应用源码。

## 为什么单独建仓

预制皮肤（尤其是高清背景）体积大。把皮肤放在 GitHub 上，由官网与客户端按需读取 `catalog.json` 再下载单套，可避免把桌面应用撑得很胖。

## 命名

选用 **`agent-skin-hub`**：语义是「皮肤合集 / 市场索引」，方便检索与官网二级页「Skin Hub」对齐。  
未选用 `agenshow`（偏展示秀场，不像可下载预制库）。

## 兼容格式

每个预设目录：

```text
presets/preset-<slug>/
  theme.json          # schemaVersion: 1
  background.jpg      # 或 theme.image 指向的 png/webp；必须是无 UI 纯背景
  SOURCE.md           # 来源 URL、许可、验收备注
```

`theme.json` 最小字段：`schemaVersion`、`id`（= 目录名）、`name`、`image`，建议含 `colors` / `tagline`。

验收脚本：

```bash
node scripts/validate-preset.mjs presets/preset-cyber-neon
node scripts/build-catalog.mjs
```

## 目录入口

- **`catalog.json`**：官网与 ProvDex 读取的统一配置
- 单套下载示例（GitHub raw）：

```text
https://raw.githubusercontent.com/Chiody/agent-skin-hub/main/presets/<id>/theme.json
https://raw.githubusercontent.com/Chiody/agent-skin-hub/main/presets/<id>/background.jpg
```

## 收录原则

| 可收录 | 不收录 |
|--------|--------|
| 抽象 / 程序生成 / 作者明确可再分发 | 游戏 IP、未授权角色立绘 |
| 无 UI 纯背景 + 合法 theme.json | 带侧栏/输入框的截图当背景 |
| 包内无脚本/可执行文件 | asar 补丁、注入器、不明二进制 |

## 与 ProvDex / 官网

1. 官网 `/skinhub`（或 `skinhub.html`）拉取本仓 `catalog.json` 展示缩略图与下载。
2. ProvDex「外观」Tab 读取同一 `catalog.json`，按需下载到本机 themes，**不把大图打进 App 安装包**。
3. ProvDex 自身代码保持私有；本仓 MIT 开源。

## License

MIT。个别素材以 `presets/*/SOURCE.md` 为准。
