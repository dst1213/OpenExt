let toolbar = null;
let currentSelectionText = '';
let toolbarHideTimer = null;
let toolbarHideScheduleId = 0;
let forwardUrl = null;
let toolbarEnginesCache = [];
let toolbarEngineIdsCache = [];
const DEFAULT_ENGINES = [
  { id: 'baidu', name: 'Baidu', url: 'https://www.baidu.com/s?wd=%s', enabled: true },
  { id: 'google', name: 'Google', url: 'https://www.google.com/search?q=%s', enabled: true },
  { id: 'bing', name: 'Bing', url: 'https://www.bing.com/search?q=%s', enabled: true },
  { id: 'metaso', name: 'Metaso', url: 'https://metaso.cn/?s=3mitab&referrer_s=3mitab&q=%s', enabled: true },
  { id: 'chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com/?q=%s', enabled: true, isAI: true },
  { id: 'gemini', name: 'Gemini', url: 'https://gemini.google.com/app', enabled: true, isAI: true }
];

function isExtensionContextValid() {
  return typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
}

function clearToolbarHideTimer() {
  if (toolbarHideTimer) {
    clearTimeout(toolbarHideTimer);
    toolbarHideTimer = null;
  }
}

function scheduleToolbarAutoHide() {
  clearToolbarHideTimer();
  toolbarHideScheduleId += 1;
  const scheduleId = toolbarHideScheduleId;

  if (!isExtensionContextValid()) return;
  try {
    chrome.storage.sync.get({ toolbarAutoHideMs: 2500 }, (items) => {
      if (scheduleId !== toolbarHideScheduleId) return;
      if (chrome.runtime.lastError) return;
      const ms = typeof items.toolbarAutoHideMs === 'number' ? items.toolbarAutoHideMs : 2500;
      if (ms <= 0) return;
      toolbarHideTimer = setTimeout(() => {
        hideToolbar();
      }, ms);
    });
  } catch (err) {
  }
}

function normalizeHttpUrl(text) {
  const raw = (text || '').trim();
  if (!raw) return null;
  const candidates = [];
  candidates.push(raw);
  if (/^www\./i.test(raw)) {
    candidates.push(`https://${raw}`);
  }
  if (/^(localhost|\d{1,3}(?:\.\d{1,3}){3})(?::\d{1,5})?(?:[/?#]|$)/i.test(raw)) {
    candidates.push(`http://${raw}`);
  }
  for (const candidate of candidates) {
    try {
      const url = new URL(candidate);
      if (url.protocol === 'http:' || url.protocol === 'https:') return url.toString();
    } catch (e) {
    }
  }
  return null;
}

function writeToClipboardUsingExecCommand(text) {
  const value = (text || '').toString();
  if (!value) return false;

  const selection = document.getSelection ? document.getSelection() : null;
  const ranges = [];
  if (selection && selection.rangeCount) {
    for (let i = 0; i < selection.rangeCount; i += 1) {
      ranges.push(selection.getRangeAt(i));
    }
  }

  const active = document.activeElement;
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', 'true');
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  textarea.style.left = '-9999px';

  document.body.appendChild(textarea);
  textarea.focus({ preventScroll: true });
  textarea.select();

  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch (err) {
    ok = false;
  }

  textarea.remove();

  try {
    if (active && typeof active.focus === 'function') active.focus({ preventScroll: true });
  } catch (err) {
  }

  try {
    if (selection && ranges.length) {
      selection.removeAllRanges();
      ranges.forEach((r) => selection.addRange(r));
    }
  } catch (err) {
  }

  return ok;
}

async function writeToClipboard(text) {
  const value = (text || '').toString();
  if (!value) return false;

  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch (err) {
  }

  return writeToClipboardUsingExecCommand(value);
}

function refreshForwardButton(textCandidate) {
  const btn = document.getElementById('my-extension-forward-btn');
  if (!btn) return;
  const url = normalizeHttpUrl(textCandidate);
  if (url) {
    forwardUrl = url;
    btn.style.display = '';
  } else {
    forwardUrl = null;
    btn.style.display = 'none';
  }
}

function createToolbar() {
  if (toolbar) return toolbar;

  toolbar = document.createElement('div');
  toolbar.id = 'my-extension-toolbar';
  toolbar.style.display = 'none'; // Hidden initially

  // Copy button
  const copyBtn = document.createElement('button');
  copyBtn.innerText = 'Copy';
  copyBtn.onclick = (e) => {
    e.stopPropagation(); // Prevent hiding toolbar immediately
    const text = currentSelectionText;
    if (!text) return;

    copyBtn.disabled = true;
    Promise.resolve(writeToClipboard(text)).then((ok) => {
      copyBtn.innerText = ok ? 'Copied!' : 'Copy failed';
      if (ok) refreshForwardButton(text);
      scheduleToolbarAutoHide();
      setTimeout(() => {
        copyBtn.innerText = 'Copy';
        copyBtn.disabled = false;
      }, 1000);
    }).catch(() => {
      copyBtn.innerText = 'Copy failed';
      scheduleToolbarAutoHide();
      setTimeout(() => {
        copyBtn.innerText = 'Copy';
        copyBtn.disabled = false;
      }, 1000);
    });
  };
  toolbar.appendChild(copyBtn);

  const forwardBtn = document.createElement('button');
  forwardBtn.id = 'my-extension-forward-btn';
  forwardBtn.innerText = 'Forward';
  forwardBtn.style.display = 'none';
  forwardBtn.onclick = (e) => {
    e.stopPropagation();
    const open = (url) => {
      if (!url) return;
      try {
        if (!isExtensionContextValid()) return;
        chrome.runtime.sendMessage({ action: 'openUrl', url });
      } catch (err) {
      }
      hideToolbar();
    };

    if (forwardUrl) {
      open(forwardUrl);
      return;
    }

    try {
      navigator.clipboard.readText().then((text) => {
        const url = normalizeHttpUrl(text);
        open(url);
      });
    } catch (err) {
    }
  };
  toolbar.appendChild(forwardBtn);

  // Separator
  const sep = document.createElement('div');
  sep.className = 'separator';
  toolbar.appendChild(sep);

  const searchButtons = document.createElement('div');
  searchButtons.id = 'my-extension-search-buttons';
  searchButtons.style.display = 'flex';
  searchButtons.style.gap = '4px';
  toolbar.appendChild(searchButtons);

  toolbar.addEventListener('mouseenter', () => {
    clearToolbarHideTimer();
  });
  toolbar.addEventListener('mouseleave', () => {
    scheduleToolbarAutoHide();
  });

  document.body.appendChild(toolbar);
  return toolbar;
}

function renderToolbarSearchButtons(engines, toolbarEngineIds, popupEngineId) {
  const container = document.getElementById('my-extension-search-buttons');
  if (!container) return;
  container.innerHTML = '';

  const availableEngines = Array.isArray(engines) ? engines : [];
  let ids = Array.isArray(toolbarEngineIds) ? toolbarEngineIds : [];
  ids = ids.filter(id => availableEngines.some(e => e.id === id && e.enabled)).slice(0, 3);
  if (ids.length === 0) {
    const fallback = (popupEngineId ? availableEngines.find(e => e.id === popupEngineId && e.enabled) : null) || availableEngines.find(e => e.enabled);
    if (fallback) ids = [fallback.id];
  }

  ids.forEach((engineId) => {
    const engine = availableEngines.find(e => e.id === engineId && e.enabled);
    if (!engine) return;
    const btn = document.createElement('button');
    btn.innerText = engine.name;
    btn.onclick = (e) => {
      e.stopPropagation();
      try {
        if (!isExtensionContextValid()) return;
        chrome.runtime.sendMessage({ action: 'search', text: currentSelectionText, engineId: engine.id });
      } catch (err) {
      }
      hideToolbar();
    };
    container.appendChild(btn);
  });
}

function showToolbar(x, y) {
  if (!toolbar) createToolbar();

  refreshForwardButton(currentSelectionText);

  if (toolbarEnginesCache.length > 0) {
    renderToolbarSearchButtons(toolbarEnginesCache, toolbarEngineIdsCache, null);
  } else {
    renderToolbarSearchButtons(DEFAULT_ENGINES, [DEFAULT_ENGINES[0].id], DEFAULT_ENGINES[0].id);
  }
  
  try {
    if (isExtensionContextValid()) {
      chrome.storage.sync.get({ engines: DEFAULT_ENGINES, popupEngineId: DEFAULT_ENGINES[0].id, toolbarEngineIds: [DEFAULT_ENGINES[0].id] }, (data) => {
        if (chrome.runtime.lastError) return;
        toolbarEnginesCache = Array.isArray(data.engines) ? data.engines : [];
        toolbarEngineIdsCache = Array.isArray(data.toolbarEngineIds) ? data.toolbarEngineIds : [];
        renderToolbarSearchButtons(toolbarEnginesCache, toolbarEngineIdsCache, data.popupEngineId);
      });
    }
  } catch (err) {
  }

  toolbar.style.left = `${x}px`;
  toolbar.style.top = `${y + 10}px`;
  toolbar.style.display = 'flex';

  const rect = toolbar.getBoundingClientRect();
  let left = x;
  let top = y + 10;

  if (left + rect.width > window.innerWidth + window.scrollX) {
    left = window.innerWidth + window.scrollX - rect.width - 10;
  }
  if (top + rect.height > window.innerHeight + window.scrollY) {
    top = y - rect.height - 10;
  }

  toolbar.style.left = `${left}px`;
  toolbar.style.top = `${top}px`;

  scheduleToolbarAutoHide();
}

function hideToolbar() {
  if (toolbar) {
    toolbar.style.display = 'none';
  }
  clearToolbarHideTimer();
}

document.addEventListener('mouseup', (e) => {
  // If clicking inside toolbar, ignore
  if (toolbar && toolbar.contains(e.target)) return;

  setTimeout(() => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text.length > 0) {
      currentSelectionText = text;
      
      // Check if toolbar is enabled
      try {
        if (!isExtensionContextValid()) return;
        chrome.storage.sync.get({ showToolbar: true }, (items) => {
          if (chrome.runtime.lastError) return;
          if (items.showToolbar) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            
            const x = rect.left + (rect.width / 2) + window.scrollX;
            const y = rect.bottom + window.scrollY;
            
            showToolbar(x, y);
          }
        });
      } catch (err) {
      }
    } else {
      hideToolbar();
    }
  }, 10);
});

// Hide on mousedown if not clicking toolbar
document.addEventListener('mousedown', (e) => {
  if (toolbar && !toolbar.contains(e.target)) {
    hideToolbar();
  }
});
