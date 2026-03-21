# Chrome 扩展说明（中文）

首页：[README.md](README.md) | [English](README-en.md) | **中文**

开源 Chrome 扩展工具集仓库：[OpenExt（GitHub）](https://github.com/dst1213/OpenExt/tree/main)。

**推荐从 [Chrome 应用商店](https://chrome.google.com/webstore) 安装**（下表链接；界面语言可用 `?hl=zh-CN`）。本仓库中的**完整源码尚未全部上传**，商店版本为当前发布渠道；**后续将在此仓库陆续上传各扩展完整源码，并配套中英双语文档**（英文说明见根目录 [README.md](README.md)、[README-en.md](README-en.md)）。

下文分为两类：**中文站点/中文产品向扩展**，以及 **界面多为英文的扩展**。后者**同样适合中文用户日常使用**（划词、复制链接、时钟等与页面语言无关）。英文版索引见 [README-en.md](README-en.md)（仅含英文向扩展）。

| 扩展 | Chrome 应用商店 |
|------|----------------|
| 网页优化大师 \| 网页宽屏阅读 + 链接净化 (clean url) | [安装](https://chromewebstore.google.com/detail/kiaeeabgoemlkihaakobkfajclmkdpoh?hl=zh-CN) |
| 果仁网智能分析工具 | [安装](https://chromewebstore.google.com/detail/ggepjpjiladpkpcblojmkahfjdkndfnn?hl=zh-CN) |
| 飞叔转存大师 | [安装](https://chromewebstore.google.com/detail/gdnaedkbjklbnfnfbkolkbadgocboagl?hl=zh-CN) |
| PageMark Lite: Web Highlighter & Notes | [安装](https://chromewebstore.google.com/detail/dfjeanoagemfndijhmbmdpangappepab?hl=zh-CN) |
| Select and Search Pro | [安装](https://chromewebstore.google.com/detail/kpjcdfehhpnefmffeinehlladfnhfppn?hl=zh-CN) |
| Copy All Urls Pro | [安装](https://chromewebstore.google.com/detail/ikoblbopecolcmfodligfdpnjfdkpkkc?hl=zh-CN) |
| Clock Icon | [安装](https://chromewebstore.google.com/detail/poipihpglaaigjbjbclmajllhglbhind?hl=zh-CN) |

---

## 一、中文站点与中文产品向扩展

### 网页优化大师｜网页宽屏阅读 + 链接净化（clean url）

**[Chrome 应用商店 →](https://chromewebstore.google.com/detail/kiaeeabgoemlkihaakobkfajclmkdpoh?hl=zh-CN)**

| | |
|---|---|
| **版本** | 5.1.0 |
| **简介** | 全能网页优化：知乎等多站点宽屏阅读、一键净化各站链接、清理知乎标题通知、解除微信公众号图片懒加载等，提升浏览体验。 |

**要点**

- 针对知乎、头条、CSDN、B 站、简书、掘金、腾讯课堂等站点的宽屏或阅读优化（按站点注入脚本）。
- 全站 Shift 键检测等辅助逻辑（`shift-key-detector`）。
- 工具栏弹窗统一入口。

**权限（概要）** | `tabs`、`scripting`、`storage` 及对上述站点与 `<all_urls>` 的主机权限。

**相关** | 主页见 manifest 中的 [nz-tools](https://github.com/dst1213/nz-tools)。

---

### 果仁网智能分析工具

**[Chrome 应用商店 →](https://chromewebstore.google.com/detail/ggepjpjiladpkpcblojmkahfjdkndfnn?hl=zh-CN)**

| | |
|---|---|
| **版本** | 6.0.2 |
| **简介** | 果仁网（guorn.com）场景下的智能分析辅助，帮助快速评估与优化策略。 |

**要点**

- 在果仁站点注入内容脚本；另含 Kimi 相关页面的脚本。
- 侧边栏（Side Panel）与弹窗界面。
- 需较广的主机权限以配合分析与下载等能力（以扩展内说明为准）。

**权限（概要）** | `activeTab`、`tabs`、`scripting`、`storage`、`downloads`、`sidePanel` 及声明的主机权限。

---

### 飞叔转存大师

**[Chrome 应用商店 →](https://chromewebstore.google.com/detail/gdnaedkbjklbnfnfbkolkbadgocboagl?hl=zh-CN)**

| | |
|---|---|
| **版本** | 2.0.1 |
| **简介** | 将网页正文一键保存到云文档 / 知识库（飞书生态向转存工具）。 |

**要点**

- 默认语言 `zh_CN`；在网页上采集/转存内容。
- 提供右键菜单、Cookie、脚本注入等能力以完成保存流程（具体以扩展内说明为准）。

**权限（概要）** | `tabs`、`activeTab`、`contextMenus`、`cookies`、`storage`、`scripting` 及 `*://*/*` 主机权限。

---

## 二、英文界面扩展（中文说明｜中文用户也可使用）

以下扩展在商店或界面中多为 **英文**，但**不妨碍中文网页环境下的使用**（划词、复制链接、时钟等与页面语言无关）。详细英文版说明见仓库内 [README-en.md](README-en.md)。

### PageMark Lite：网页高亮与笔记（Web Highlighter & Notes）

**[Chrome 应用商店 →](https://chromewebstore.google.com/detail/dfjeanoagemfndijhmbmdpangappepab?hl=zh-CN)**

| | |
|---|---|
| **简称** | PageMark |
| **版本** | 5.0.0 |
| **简介** | 轻量网页高亮与笔记：划选文字、保存片段、提升阅读效率。 |

**要点**

- 在网页上做高亮与标注，流程简单。
- 弹窗 + 内容脚本，适配各类站点（`<all_urls>`）。

**权限（概要）** | `activeTab`、`storage`、`scripting`、`tabs`，以及页面注入所需主机权限。

---

### Select and Search Pro（划词搜索专业版）

**[Chrome 应用商店 →](https://chromewebstore.google.com/detail/kpjcdfehhpnefmffeinehlladfnhfppn?hl=zh-CN)**

| | |
|---|---|
| **版本** | 2.0.8 |
| **简介** | 划选文字后可复制、搜索、询问 AI 或转发链接；快捷工具栏 + 右键「搜索」。 |

**要点**

- 划词后出现工具栏，支持复制、搜索、与 AI 相关操作。
- 在 ChatGPT、Gemini 等域名下有额外脚本，集成更好。
- 选项页同时作为工具栏图标弹窗。

**权限（概要）** | `contextMenus`、`storage`。

---

### Copy All Urls Pro（批量复制链接专业版）

**[Chrome 应用商店 →](https://chromewebstore.google.com/detail/ikoblbopecolcmfodligfdpnjfdkpkkc?hl=zh-CN)**

| | |
|---|---|
| **版本** | 12.1.6 |
| **简介** | 以多种格式复制所有标签页 URL：悬浮球、链接净化、批量操作、可选云端同步。 |

**要点**

- 一键复制标题与链接，支持 Markdown 友好输出、JSON 等格式。
- 批量标签、智能过滤、去除 UTM 等跟踪参数。
- 快捷键：**复制当前窗口全部 URL**（`Ctrl+Shift+C` / `⌘+Shift+C`），**从剪贴板粘贴并打开**（`Ctrl+Shift+V` / `⌘+Shift+V`）。
- 书签、剪贴板、通知；可选 Gist / Memos 类同步（见扩展内选项）。

**权限（概要）** | `tabs`、`contextMenus`、`clipboardRead` / `clipboardWrite`、`activeTab`、`bookmarks`、`storage`、`notifications`、`offscreen`。

**相关** | [nz-tools](https://github.com/dst1213/nz-tools)（manifest 中的主页）。

---

### Clock Icon（工具栏世界时钟）

商店名 **Clock Icon**，在工具栏图标上显示所选时区时间。

**[Chrome 应用商店 →](https://chromewebstore.google.com/detail/poipihpglaaigjbjbclmajllhglbhind?hl=zh-CN)**

| | |
|---|---|
| **简称** | Clock |
| **版本** | 1.0.3 |
| **简介** | 在工具栏图标上显示所选时区（含 UTC）的当前时间。 |

**要点**

- 扩展图标上显示世界时钟，偏离线可用。
- 权限精简：仅 `storage` 与 `alarms`。

**权限（概要）** | `storage`、`alarms`。

---

## 参与贡献

欢迎贡献本仓库。**若你有愿意开源的 Chrome 扩展代码**，欢迎通过 **Issue**、**讨论区** 或 **Pull Request** 分享、合入或补充文档，我们很乐意一起完善目录与说明。

---

## 许可证

本仓库默认许可证见根目录 [LICENSE](LICENSE)。各子项目若有单独声明，以各扩展目录内文件为准。
