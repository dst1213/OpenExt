const defaultEngines = [
  { id: 'baidu', name: 'Baidu', url: 'https://www.baidu.com/s?wd=%s', enabled: true },
  { id: 'google', name: 'Google', url: 'https://www.google.com/search?q=%s', enabled: true },
  { id: 'bing', name: 'Bing', url: 'https://www.bing.com/search?q=%s', enabled: true },
  { id: 'metaso', name: 'Metaso', url: 'https://metaso.cn/?s=3mitab&referrer_s=3mitab&q=%s', enabled: true },
  { id: 'chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com/?q=%s', enabled: true, isAI: true },
  { id: 'gemini', name: 'Gemini', url: 'https://gemini.google.com/app', enabled: true, isAI: true }
];

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  renderVersion();
  
  document.getElementById('showToolbar').addEventListener('change', saveSettings);
  document.getElementById('toolbarAutoHideMs').addEventListener('change', saveSettings);
  document.getElementById('addEngineBtn').addEventListener('click', addEngine);
  
  // Search box event listeners
  document.getElementById('popupSearchBtn').addEventListener('click', () => performPopupSearch());
  document.getElementById('popupSearchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performPopupSearch();
    }
  });
  
  // History event listeners
  document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
});

function renderVersion() {
  const el = document.getElementById('versionInfo');
  if (!el) return;
  const manifest = chrome.runtime.getManifest();
  el.innerText = `Version ${manifest.version}`;
}

function performPopupSearch(queryOverride) {
  const query = queryOverride || document.getElementById('popupSearchInput').value.trim();
  if (!query) return;

  // Save to history
  saveHistory(query);

  chrome.storage.sync.get({
    engines: defaultEngines,
    popupEngineId: defaultEngines[0].id
  }, (items) => {
    let engine = null;
    // Find the selected default engine
    if (items.popupEngineId && items.engines) {
      engine = items.engines.find(e => e.id === items.popupEngineId && e.enabled);
    }
    
    // Fallback to first enabled one
    if (!engine && items.engines) {
       engine = items.engines.find(e => e.enabled);
    }

    if (engine) {
      if (engine.isAI) {
        chrome.storage.local.set({ 'pending_ai_query': query }, () => {
             // Check if URL has placeholder (like ChatGPT new format)
             if (engine.url.includes('%s')) {
                const url = engine.url.replace('%s', encodeURIComponent(query));
                chrome.tabs.create({ url: url });
             } else {
                chrome.tabs.create({ url: engine.url });
             }
        });
      } else {
        const url = engine.url.replace('%s', encodeURIComponent(query));
        chrome.tabs.create({ url: url });
      }
    } else {
      // Fallback if no engine is enabled or found
      const fallbackUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      chrome.tabs.create({ url: fallbackUrl });
    }
  });
}

function saveHistory(query) {
  chrome.storage.local.get({ searchHistory: [] }, (items) => {
    let history = items.searchHistory;
    // Remove if already exists (to move to front)
    history = history.filter(item => item !== query);
    // Add to front
    history.unshift(query);
    // Limit to 10 items
    if (history.length > 10) history = history.slice(0, 10);
    
    chrome.storage.local.set({ searchHistory: history }, () => {
        renderHistory();
    });
  });
}

function clearHistory() {
    chrome.storage.local.set({ searchHistory: [] }, () => {
        renderHistory();
    });
}

function renderHistory() {
    chrome.storage.local.get({ searchHistory: [] }, (items) => {
        const history = items.searchHistory;
        const container = document.getElementById('historyContainer');
        const chipsContainer = document.getElementById('historyChips');
        
        if (history.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        container.style.display = 'block';
        chipsContainer.innerHTML = '';
        
        history.forEach(text => {
            const chip = document.createElement('div');
            chip.className = 'history-chip';
            chip.title = text; // Full text on hover
            
            // Truncate logic handled by CSS (max-width + text-overflow: ellipsis)
            // But we can also truncate text content for safety
            chip.innerText = text;
            
            chip.onclick = () => {
                document.getElementById('popupSearchInput').value = text;
                performPopupSearch(text);
            };
            
            chipsContainer.appendChild(chip);
        });
    });
}

function loadSettings() {
  renderHistory();
  chrome.storage.sync.get({
    showToolbar: true,
    toolbarAutoHideMs: 2500,
    toolbarEngineIds: [defaultEngines[0].id],
    engines: defaultEngines,
    popupEngineId: defaultEngines[0].id
  }, (items) => {
    document.getElementById('showToolbar').checked = items.showToolbar;
    const autoHideInput = document.getElementById('toolbarAutoHideMs');
    if (autoHideInput) autoHideInput.value = typeof items.toolbarAutoHideMs === 'number' ? items.toolbarAutoHideMs : 2500;
    let toolbarEngineIds = Array.isArray(items.toolbarEngineIds) ? items.toolbarEngineIds : [];
    if (toolbarEngineIds.length === 0) {
      toolbarEngineIds = [items.popupEngineId || defaultEngines[0].id];
    }
    renderEngines(items.engines, items.popupEngineId, toolbarEngineIds);
    updatePopupSearchButton(items.engines, items.popupEngineId);
  });
}

function updatePopupSearchButton(engines, currentId) {
    const btn = document.getElementById('popupSearchBtn');
    let isAI = false;
    if (currentId) {
        const engine = engines.find(e => e.id === currentId);
        if (engine && engine.isAI) {
            isAI = true;
        }
    }
    btn.innerText = isAI ? "Ask" : "Search";
}

function renderEngines(engines, currentPopupEngineId, toolbarEngineIds) {
  const container = document.getElementById('engineList');
  container.innerHTML = '';
  let currentToolbarIds = Array.isArray(toolbarEngineIds) ? [...toolbarEngineIds] : [];
  
  // Header row
  const header = document.createElement('div');
  header.className = 'engine-header';
  header.innerHTML = '<span style="width: 30px;">Use</span><span style="width: 30px; margin-left: 10px;">On</span><span style="width: 40px; margin-left: 10px;">Bar</span><span style="flex:1; margin-left: 10px;">Name</span><span style="width: 60px;">Action</span>';
  container.appendChild(header);

  engines.forEach((engine, index) => {
    const div = document.createElement('div');
    div.className = 'engine-item';
    
    // Default radio
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'defaultEngine';
    radio.style.width = '30px';
    radio.style.margin = '0';
    if (currentPopupEngineId) {
        radio.checked = engine.id === currentPopupEngineId;
    } else {
        radio.checked = index === 0;
    }
    radio.onchange = () => {
        if (radio.checked) {
            savePopupEngineId(engine.id);
            updatePopupSearchButton(engines, engine.id);
        }
    };
    div.appendChild(radio);


    // Enabled checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.style.width = '30px';
    checkbox.style.marginLeft = '10px';
    checkbox.style.marginRight = '0';
    checkbox.checked = engine.enabled;
    checkbox.onchange = () => {
      engine.enabled = checkbox.checked;
      saveEngines(engines);
      if (!engine.enabled && currentToolbarIds.includes(engine.id)) {
        currentToolbarIds = currentToolbarIds.filter(id => id !== engine.id);
        if (currentToolbarIds.length === 0) {
          const fallback = engines.find(e => e.enabled);
          if (fallback) currentToolbarIds.push(fallback.id);
        }
        saveToolbarEngineIds(currentToolbarIds);
        loadSettings();
      }
    };
    div.appendChild(checkbox);

    const toolbarCheckbox = document.createElement('input');
    toolbarCheckbox.type = 'checkbox';
    toolbarCheckbox.style.width = '40px';
    toolbarCheckbox.style.marginLeft = '10px';
    toolbarCheckbox.style.marginRight = '0';
    toolbarCheckbox.checked = currentToolbarIds.includes(engine.id);
    toolbarCheckbox.onchange = () => {
      const exists = currentToolbarIds.includes(engine.id);
      if (toolbarCheckbox.checked && !exists) {
        if (currentToolbarIds.length >= 3) {
          toolbarCheckbox.checked = false;
          showStatus('Toolbar supports up to 3 engines');
          return;
        }
        currentToolbarIds.push(engine.id);
      }
      if (!toolbarCheckbox.checked && exists) {
        if (currentToolbarIds.length <= 1) {
          toolbarCheckbox.checked = true;
          showStatus('Toolbar needs at least 1 engine');
          return;
        }
        currentToolbarIds = currentToolbarIds.filter(id => id !== engine.id);
      }
      saveToolbarEngineIds(currentToolbarIds);
    };
    div.appendChild(toolbarCheckbox);
    
    const nameSpan = document.createElement('span');
    nameSpan.innerText = engine.name;
    nameSpan.style.marginLeft = '10px';
    nameSpan.style.flex = '1';
    div.appendChild(nameSpan);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.className = 'danger';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.style.width = '60px';
    
    deleteBtn.onclick = () => {
      engines.splice(index, 1);
      saveEngines(engines);
      // If we deleted the default engine, reset default
      if (engine.id === currentPopupEngineId && engines.length > 0) {
          savePopupEngineId(engines[0].id);
      }
      loadSettings(); // Reload to refresh UI correctly
    };
    div.appendChild(deleteBtn);
    
    container.appendChild(div);
  });
}

function savePopupEngineId(id) {
    chrome.storage.sync.set({ popupEngineId: id }, () => {
        showStatus('Default search engine updated');
    });
}

function saveToolbarEngineIds(toolbarEngineIds) {
  chrome.storage.sync.set({ toolbarEngineIds }, () => {
    showStatus('Toolbar engines updated');
  });
}

function addEngine() {
  const nameInput = document.getElementById('newEngineName');
  const urlInput = document.getElementById('newEngineUrl');
  
  const name = nameInput.value.trim();
  const url = urlInput.value.trim();
  
  if (name && url) {
    chrome.storage.sync.get({ engines: defaultEngines }, (items) => {
      const engines = items.engines;
      engines.push({
        id: 'custom-' + Date.now(),
        name: name,
        url: url,
        enabled: true
      });
      saveEngines(engines);
      loadSettings();
      
      nameInput.value = '';
      urlInput.value = '';
    });
  }
}

function saveSettings() {
  const showToolbar = document.getElementById('showToolbar').checked;
  const raw = (document.getElementById('toolbarAutoHideMs').value || '').toString().trim();
  let toolbarAutoHideMs = parseInt(raw, 10);
  if (!Number.isFinite(toolbarAutoHideMs) || toolbarAutoHideMs < 0) {
    toolbarAutoHideMs = 2500;
  }
  chrome.storage.sync.set({ showToolbar, toolbarAutoHideMs }, () => {
    showStatus('Settings saved');
  });
}

function saveEngines(engines) {
  chrome.storage.sync.set({ engines }, () => {
    // Background script will detect change and update context menus
    showStatus('Engines updated');
  });
}

function showStatus(msg) {
  const status = document.getElementById('status');
  status.innerText = msg;
  status.style.display = 'block';
  setTimeout(() => {
    status.style.display = 'none';
  }, 2000);
}
