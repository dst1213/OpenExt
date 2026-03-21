# English Chrome Extensions

Home: [中文](README.md) | **English** | [中文扩展列表](README-zh.md)

Open-source Chrome extension toolkit: [OpenExt on GitHub](https://github.com/dst1213/OpenExt/tree/main).

This document lists extensions aimed at **English (international) UI and workflows**. **Install from the [Chrome Web Store](https://chrome.google.com/webstore)** using the links below. (Full source trees are not all published in this repo yet; store builds are always up to date.)

Chinese readers: the same extensions are summarized in Chinese in [README-zh.md](README-zh.md) (section “英文界面扩展”) — the UI may be English, but the tools work fine on Chinese pages and for Chinese users.

| Extension | Chrome Web Store |
|-----------|------------------|
| PageMark Lite: Web Highlighter & Notes | [Install](https://chromewebstore.google.com/detail/dfjeanoagemfndijhmbmdpangappepab?hl=en) |
| Select and Search Pro | [Install](https://chromewebstore.google.com/detail/kpjcdfehhpnefmffeinehlladfnhfppn?hl=en) |
| Copy All Urls Pro | [Install](https://chromewebstore.google.com/detail/ikoblbopecolcmfodligfdpnjfdkpkkc?hl=en) |
| Clock Icon | [Install](https://chromewebstore.google.com/detail/poipihpglaaigjbjbclmajllhglbhind?hl=en) |

---

## PageMark Lite: Web Highlighter & Notes

**[Chrome Web Store →](https://chromewebstore.google.com/detail/dfjeanoagemfndijhmbmdpangappepab?hl=en)**

| | |
|---|---|
| **Short name** | PageMark |
| **Version** | 5.0.0 |
| **Summary** | Simple web highlighter and note-taking: mark text, save snippets, and boost reading productivity. |

**Highlights**

- Highlight and annotate on pages; lightweight reading workflow.
- Popup + content scripts; works across sites (`<all_urls>`).

**Permissions (typical)** | `activeTab`, `storage`, `scripting`, `tabs`, host access for page injection.

---

## Select and Search Pro

**[Chrome Web Store →](https://chromewebstore.google.com/detail/kpjcdfehhpnefmffeinehlladfnhfppn?hl=en)**

| | |
|---|---|
| **Version** | 2.0.8 |
| **Summary** | Select text to copy, search, ask AI, or forward links. Quick toolbar plus right-click **Search**. |

**Highlights**

- Selection toolbar for copy / search / AI-related actions.
- Extra scripts on ChatGPT and Gemini domains for tighter integration.
- Options page (also used as the toolbar popup).

**Permissions (typical)** | `contextMenus`, `storage`.

---

## Copy All Urls Pro

**[Chrome Web Store →](https://chromewebstore.google.com/detail/ikoblbopecolcmfodligfdpnjfdkpkkc?hl=en)**

| | |
|---|---|
| **Version** | 12.1.6 |
| **Summary** | Copy all tab URLs in multiple formats: floating ball, URL cleaning, batch actions, optional cloud sync. |

**Highlights**

- One-click copy of titles/URLs, Markdown-friendly output, JSON and other formats.
- Tab batching, smart filtering, UTM/tracking cleanup.
- Shortcuts: **Copy all URLs** (`Ctrl+Shift+C` / `⌘+Shift+C`), **Paste and open** (`Ctrl+Shift+V` / `⌘+Shift+V`).
- Bookmarks, clipboard, notifications, optional Gist/Memos-style sync (see in-extension options).

**Permissions (typical)** | `tabs`, `contextMenus`, `clipboardRead` / `clipboardWrite`, `activeTab`, `bookmarks`, `storage`, `notifications`, `offscreen`.

**Related** | [nz-tools](https://github.com/dst1213/nz-tools) (homepage in manifest).

---

## Clock Icon (Toolbar World Clock)

Listed on the store as **Clock Icon** — world clock on the toolbar.

**[Chrome Web Store →](https://chromewebstore.google.com/detail/poipihpglaaigjbjbclmajllhglbhind?hl=en)**

| | |
|---|---|
| **Short name** | Clock |
| **Version** | 1.0.3 |
| **Summary** | Shows the current time for your selected time zone (UTC included) on the toolbar icon. |

**Highlights**

- Offline-friendly world clock on the extension icon.
- Minimal permissions: storage + alarms.

**Permissions (typical)** | `storage`, `alarms`.

---

## Contributing

Contributions are welcome. If you maintain **open-source Chrome extension** code and want it listed or merged here, open an **issue**, start a **discussion**, or send a **pull request**—we are happy to collaborate on docs and structure.

---

## License

Repository default: see [LICENSE](LICENSE) in this repo. Individual extensions may ship their own notices; check each project folder.
