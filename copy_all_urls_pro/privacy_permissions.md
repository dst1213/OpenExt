Title: Privacy Policy — Copy All Urls Pro

Last updated: 2026-03-22

Overview
Copy All Urls Pro (the “Extension”) helps you copy page titles/URLs, batch copy tab URLs in multiple formats, clean tracking parameters, manage bookmarks, and optionally sync bookmarks to services you configure (GitHub Gist, Gitee Gist, Memos).

Data We Collect
The Extension does not collect, transmit, sell, or share personal data to the developer. The Extension does not run a developer-controlled backend service.

Data Processed on Your Device
To provide its features, the Extension may access and process:
- Tab information (tab title and URL) when you use copy/batch features
- Current page information (title and URL) when you use one-click copy or floating ball actions
- Bookmarks data (titles, URLs, folder structure) when you use bookmark features or bookmark sync
- Clipboard content when you use paste/open features (e.g., paste URLs from clipboard)

Data Stored on Your Device
The Extension stores data in Chrome storage to remember your preferences, such as:
- Copy format settings (text/Markdown/HTML/JSON/custom templates)
- URL cleaning settings
- Floating ball and UI settings
- Context menu configuration
- Bookmark sync configuration (e.g., selected sync sources, Gist IDs, server URL)
- Tokens you provide for third-party sync services (GitHub/Gitee/Memos)

Cloud Sync and Third Parties
Cloud sync is optional and only occurs when you enable/configure it.
If you choose to sync, the Extension will transmit bookmark data (titles, URLs, and folder structure) and your requests to the provider(s) you selected:
- GitHub Gist: https://api.github.com/gists
- Gitee Gist: https://gitee.com/api/v5/gists
- Memos: your configured server URL (for example: https://your-memos-domain.com/api/v1/memos)

Your token is used only to authenticate requests to the selected provider and is sent to that provider over HTTPS as required by their API. Those providers’ own privacy policies apply to your account and any data stored with them.

Data Sharing
The Extension does not share your data with third parties on behalf of the developer. Any data sent to GitHub/Gitee/Memos is sent directly from your browser to those providers based on your configuration and actions.

Permissions Explanation
- tabs / activeTab: Read tab title and URL for copy and batch operations.
- contextMenus: Provide right-click menu actions for copying.
- clipboardWrite: Copy formatted content to your clipboard.
- clipboardRead: Read clipboard content for paste/open URL features.
- bookmarks: Read and manage bookmarks and bookmark folders when you use bookmark features.
- storage: Save your preferences and optional sync configuration.
- notifications: Show success/failure status for actions such as copy and sync.
- offscreen: Support clipboard/formatting workflows that require an offscreen document in MV3.

Content Script Access
The Extension runs a content script on pages to support features like the floating ball and one-click actions. It does not transmit page content to the developer.

User Controls
You can disable features, clear stored settings, and remove configured tokens at any time from the Extension’s settings/options pages.
If you enable cloud sync, you can also delete synced data from your GitHub/Gitee/Memos account at the provider side.

Contact
If you have questions about this policy, contact: anyask.service@gmail.com

