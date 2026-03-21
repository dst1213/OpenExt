const DEFAULT_ENGINES = [
  { id: 'baidu', name: 'Baidu', url: 'https://www.baidu.com/s?wd=%s', enabled: true },
  { id: 'google', name: 'Google', url: 'https://www.google.com/search?q=%s', enabled: true },
  { id: 'bing', name: 'Bing', url: 'https://www.bing.com/search?q=%s', enabled: true },
  { id: 'metaso', name: 'Metaso', url: 'https://metaso.cn/?s=3mitab&referrer_s=3mitab&q=%s', enabled: true },
  { id: 'chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com/?q=%s', enabled: true, isAI: true },
  { id: 'gemini', name: 'Gemini', url: 'https://gemini.google.com/app', enabled: true, isAI: true }
];

const DEFAULT_SETTINGS = {
  showToolbar: true,
  toolbarAutoHideMs: 2500,
  toolbarEngineIds: [DEFAULT_ENGINES[0].id],
  engines: DEFAULT_ENGINES
};

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (items) => {
    // If popupEngineId is missing, set default (first engine id)
    if (!items.popupEngineId && items.engines && items.engines.length > 0) {
        items.popupEngineId = items.engines[0].id;
    }

    // Ensure new engines are in the list (for existing users)
    const newEngines = [
        { id: 'metaso', name: 'Metaso', url: 'https://metaso.cn/?s=3mitab&referrer_s=3mitab&q=%s', enabled: true },
        { id: 'chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com/?q=%s', enabled: true, isAI: true },
        { id: 'gemini', name: 'Gemini', url: 'https://gemini.google.com/app', enabled: true, isAI: true }
    ];

    let changed = false;
    if (items.engines) {
        // Fix existing ChatGPT URL if it's the old one without %s
        const chatgpt = items.engines.find(e => e.id === 'chatgpt');
        if (chatgpt && chatgpt.url === 'https://chatgpt.com/') {
            chatgpt.url = 'https://chatgpt.com/?q=%s';
            changed = true;
        }

        // Remove Kimi if present
        const kimiIndex = items.engines.findIndex(e => e.id === 'kimi');
        if (kimiIndex !== -1) {
            items.engines.splice(kimiIndex, 1);
            changed = true;
        }

        if (typeof items.toolbarAutoHideMs !== 'number') {
            items.toolbarAutoHideMs = DEFAULT_SETTINGS.toolbarAutoHideMs;
            changed = true;
        }

        if (!Array.isArray(items.toolbarEngineIds) || items.toolbarEngineIds.length === 0) {
            items.toolbarEngineIds = [items.popupEngineId || DEFAULT_SETTINGS.toolbarEngineIds[0]];
            changed = true;
        }

        const engineIds = new Set(items.engines.map(e => e.id));
        const cleanedToolbarIds = items.toolbarEngineIds.filter(id => engineIds.has(id));
        const limitedToolbarIds = cleanedToolbarIds.slice(0, 3);
        if (limitedToolbarIds.length === 0) {
            limitedToolbarIds.push(items.popupEngineId || DEFAULT_SETTINGS.toolbarEngineIds[0]);
        }
        if (JSON.stringify(limitedToolbarIds) !== JSON.stringify(items.toolbarEngineIds)) {
            items.toolbarEngineIds = limitedToolbarIds;
            changed = true;
        }

        newEngines.forEach(newEngine => {
            if (!items.engines.some(e => e.id === newEngine.id)) {
                items.engines.push(newEngine);
                changed = true;
            }
        });
    }

    if (changed) {
        chrome.storage.sync.set(items, () => {
          updateContextMenus(items.engines);
        });
    } else {
        // Just update menus to be safe
        updateContextMenus(items.engines);
    }
  });
});

// Update menus when settings change
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.engines) {
    updateContextMenus(changes.engines.newValue || DEFAULT_ENGINES);
  }
});

function performSearch(engine, text) {
    if (engine.isAI) {
        // Save query to local storage for content script to pick up (fallback/backup)
        chrome.storage.local.set({ 'pending_ai_query': text }, () => {
            // Check if the URL has a placeholder
            if (engine.url.includes('%s')) {
                const query = encodeURIComponent(text);
                const url = engine.url.replace('%s', query);
                chrome.tabs.create({ url: url });
            } else {
                chrome.tabs.create({ url: engine.url });
            }
        });
    } else {
        const query = encodeURIComponent(text);
        const url = engine.url.replace('%s', query);
        chrome.tabs.create({ url: url });
    }
}

// Handle menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId.startsWith('search-')) {
    const engineId = info.menuItemId.replace('search-', '');
    chrome.storage.sync.get({ engines: DEFAULT_ENGINES }, (data) => {
      const engines = Array.isArray(data.engines) ? data.engines : DEFAULT_ENGINES;
      const engine = engines.find(e => e.id === engineId);
      if (engine) {
        performSearch(engine, info.selectionText);
      }
    });
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'search' && request.text) {
    chrome.storage.sync.get({ engines: DEFAULT_ENGINES, popupEngineId: DEFAULT_ENGINES[0].id }, (data) => {
      const engines = Array.isArray(data.engines) ? data.engines : DEFAULT_ENGINES;
      let engine = null;

      if (request.engineId) {
        engine = engines.find(e => e.id === request.engineId && e.enabled);
      }

      if (!engine && data.popupEngineId && engines) {
        engine = engines.find(e => e.id === data.popupEngineId && e.enabled);
      }

      if (!engine && engines) {
        engine = engines.find(e => e.enabled);
      }

      if (engine) {
        performSearch(engine, request.text);
      }
    });
    return true;
  }

  if (request.action === 'openUrl' && request.url) {
    let url = null;
    try {
      const parsed = new URL(request.url);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        url = parsed.toString();
      }
    } catch (e) {
    }
    if (url) {
      chrome.tabs.create({ url });
    }
  }
});

function updateContextMenus(engines) {
  // Use a try-catch block inside removeAll callback to handle potential errors gracefully
  chrome.contextMenus.removeAll(() => {
    if (chrome.runtime.lastError) {
        console.error("Error removing menus:", chrome.runtime.lastError);
        // Continue anyway as we want to create new ones
    }
    
    const enabledEngines = engines.filter(e => e.enabled);
    if (enabledEngines.length > 0) {
        try {
            chrome.contextMenus.create({
                id: "search-root",
                title: "Search / Ask \"%s\"",
                contexts: ["selection"]
            }, () => {
                if (chrome.runtime.lastError) {
                     // Suppress duplicate id error if it happens due to race condition
                }
            });

            enabledEngines.forEach(engine => {
                const actionVerb = engine.isAI ? "Ask" : "Use";
                chrome.contextMenus.create({
                    id: `search-${engine.id}`,
                    parentId: "search-root",
                    title: `${actionVerb} ${engine.name}`,
                    contexts: ["selection"]
                }, () => {
                    // Suppress errors for individual items
                    if (chrome.runtime.lastError) {}
                });
            });
        } catch (e) {
            console.error("Context menu creation exception:", e);
        }
    }
  });
}
