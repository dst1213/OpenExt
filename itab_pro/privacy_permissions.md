# 隐私政策 — 飞叔起始页 (iTab Pro)

**最后更新日期：2026-05-05**

## 1. 概述

飞叔起始页（以下简称"本扩展"）是一款浏览器新标签页扩展，提供个性化起始页、自定义布局、高清壁纸、智能搜索等功能。

## 2. 数据收集

**本扩展不收集、传输或出售任何个人敏感数据。**

本扩展需要连接以下服务以提供核心功能：
- `https://base.itab.link/*` — iTab 基础服务
- `https://api.itab.link/*` — iTab API 服务

## 3. 本地数据存储

本扩展使用 Chrome 浏览器的本地存储功能（`chrome.storage.local`）保存以下设置：

- 用户自定义布局和组件配置
- 壁纸偏好设置
- 搜索引擎选择
- 书签和快捷方式数据
- 用户账户登录状态（如使用同步功能）
- 主题和外观设置

**所有本地数据仅保存在您的设备上。**

## 4. 网络访问

本扩展需要访问以下外部服务：
- **iTab 服务** (`base.itab.link`, `api.itab.link`) — 获取壁纸、组件数据、用户同步数据
- **可选搜索引擎** — 仅在您使用搜索功能时访问所选搜索引擎

本扩展**不使用任何分析、追踪或广告 SDK**。

## 5. 数据共享

**我们不会向第三方出售或共享您的个人数据。**

仅在以下情况下会传输数据：
- 同步功能：如您登录 iTab 账户，配置数据会同步到 iTab 服务器
- 壁纸服务：从 iTab CDN 加载壁纸资源

## 6. 权限说明

| 权限 | 用途说明 |
|------|----------|
| `bookmarks` | 读取书签数据以在起始页显示书签组件 |
| `activeTab` | 获取当前标签页信息以提供相关功能 |
| `contextMenus` | 添加右键菜单选项 |
| `scripting` | 在页面中执行脚本以提供交互功能 |
| `favicon`（可选） | 获取网站图标以显示在书签和快捷方式中 |
| `notifications`（可选） | 发送提醒和通知 |
| `offscreen`（可选） | 在后台处理特定任务 |
| `desktopCapture`（可选） | 屏幕捕获功能 |
| `tabs`（可选） | 管理浏览器标签页 |

## 7. 主机权限

| 权限 | 用途说明 |
|------|----------|
| `https://base.itab.link/*` | iTab 基础服务，提供核心功能和数据 |
| `https://api.itab.link/*` | iTab API 服务，用于数据同步和交互 |
| `https://www.baidu.com/`（可选） | 百度搜索集成 |
| `<all_urls>`（可选） | 获取任意网站图标和提供全局功能 |

## 8. 联系方式

如有隐私相关问题，请联系：anyask.service@gmail.com

---

**English Version:**

# Privacy Policy — Feishu New Tab (iTab Pro)

**Last updated: 2026-05-05**

## 1. Overview

Feishu New Tab ("the Extension") is a browser new tab extension that provides personalized start pages, custom layouts, HD wallpapers, and smart search functionality.

## 2. Data Collection

**The Extension does not collect, transmit, or sell any personal sensitive data.**

The Extension connects to the following services to provide core functionality:
- `https://base.itab.link/*` — iTab base services
- `https://api.itab.link/*` — iTab API services

## 3. Local Data Storage

The Extension uses Chrome's local storage (`chrome.storage.local`) to save the following settings:

- User custom layout and widget configurations
- Wallpaper preferences
- Search engine selection
- Bookmark and shortcut data
- User account login status (if using sync)
- Theme and appearance settings

**All local data is stored only on your device.**

## 4. Network Access

The Extension requires access to the following external services:
- **iTab Services** (`base.itab.link`, `api.itab.link`) — For wallpapers, widget data, and user sync
- **Optional Search Engines** — Only accessed when you use the search feature

The Extension **does not use any analytics, tracking, or advertising SDKs**.

## 5. Data Sharing

**We do not sell or share your personal data with third parties.**

Data is transmitted only in the following cases:
- **Sync Feature**: If you log in to an iTab account, configuration data is synced to iTab servers
- **Wallpaper Service**: Loading wallpaper resources from iTab CDN

## 6. Permissions Explanation

| Permission | Purpose |
|------------|---------|
| `bookmarks` | Read bookmark data to display in the bookmarks widget |
| `activeTab` | Get current tab information for related features |
| `contextMenus` | Add right-click menu options |
| `scripting` | Execute scripts in pages for interactive features |
| `favicon` (optional) | Get website icons for bookmarks and shortcuts |
| `notifications` (optional) | Send reminders and notifications |
| `offscreen` (optional) | Process specific tasks in the background |
| `desktopCapture` (optional) | Screen capture functionality |
| `tabs` (optional) | Manage browser tabs |

## 7. Host Permissions

| Permission | Purpose |
|------------|---------|
| `https://base.itab.link/*` | iTab base services for core functionality and data |
| `https://api.itab.link/*` | iTab API services for data sync and interaction |
| `https://www.baidu.com/` (optional) | Baidu search integration |
| `<all_urls>` (optional) | Get favicons from any website and provide global features |

## 8. Contact

For privacy-related questions, contact: anyask.service@gmail.com
