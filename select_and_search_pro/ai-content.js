// ai-content.js
// Handles auto-filling prompts for Kimi and ChatGPT based on pending query in storage

console.log('[Search Extension] AI Content Script Loaded');

chrome.storage.local.get(['pending_ai_query', 'pending_ai_query_ts', 'pending_ai_query_attempts'], async (data) => {
  const query = (data && data.pending_ai_query) ? String(data.pending_ai_query) : '';
  if (!query) return;

  const now = Date.now();
  const attempts = Number.isFinite(data.pending_ai_query_attempts) ? data.pending_ai_query_attempts : 0;
  const ts = Number.isFinite(data.pending_ai_query_ts) ? data.pending_ai_query_ts : now;

  if (attempts >= 5 && now - ts < 2 * 60 * 1000) return;
  if (now - ts >= 2 * 60 * 1000) {
    chrome.storage.local.set({ pending_ai_query_ts: now, pending_ai_query_attempts: 0 });
  }

  try {
    if (window.location.hostname.includes('chatgpt.com')) {
      if (window.location.search.includes('q=')) {
        chrome.storage.local.remove(['pending_ai_query', 'pending_ai_query_ts', 'pending_ai_query_attempts']);
        return;
      }
      await handleChatGPT(query);
      chrome.storage.local.remove(['pending_ai_query', 'pending_ai_query_ts', 'pending_ai_query_attempts']);
      return;
    }

    if (window.location.hostname.includes('gemini.google.com')) {
      if (!window.location.pathname.startsWith('/app')) {
        chrome.storage.local.set({
          pending_ai_query_ts: ts,
          pending_ai_query_attempts: attempts + 1
        }, () => {
          window.location.assign('https://gemini.google.com/app');
        });
        return;
      }

      await handleGemini(query);
      chrome.storage.local.remove(['pending_ai_query', 'pending_ai_query_ts', 'pending_ai_query_attempts']);
      return;
    }
  } catch (e) {
    chrome.storage.local.set({
      pending_ai_query_ts: ts,
      pending_ai_query_attempts: attempts + 1
    });
  }
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForElement(selectors, timeout = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el) return el;
    }
    await sleep(500);
  }
  return null;
}


// --- ChatGPT Logic ---
async function handleChatGPT(prompt) {
  const editor = await waitForElement([
    '#prompt-textarea',
    'div[contenteditable="true"]'
  ]);

  if (!editor) throw new Error('ChatGPT input box not found');

  editor.focus();
  document.execCommand('insertText', false, prompt);
  editor.dispatchEvent(new Event('input', { bubbles: true }));

  await sleep(800);

  const sendBtn = document.querySelector('button[data-testid="send-button"]');
  if (sendBtn) {
    sendBtn.click();
  } else {
     // Try Enter
     const enterEvent = new KeyboardEvent('keydown', {
        bubbles: true, cancelable: true, keyCode: 13
      });
      editor.dispatchEvent(enterEvent);
  }
}

// --- Gemini Logic ---
async function handleGemini(prompt) {
  // Wait for the content editable area
  const editor = await waitForElement([
    'rich-textarea textarea',
    'textarea[aria-label*="prompt" i]',
    'textarea[aria-label*="message" i]',
    'textarea[placeholder]',
    'div[role="textbox"][contenteditable="true"]',
    'div[contenteditable="true"][role="textbox"]',
    'div[contenteditable="true"]'
  ], 15000);

  if (!editor) return;
  
  // Gemini's editor might be inside a paragraph inside a contenteditable div
  // Focus the editor
  editor.focus();
  
  // Insert text
  document.execCommand('insertText', false, prompt);
  
  // Trigger input events
  editor.dispatchEvent(new Event('input', { bubbles: true }));
  
  await sleep(800);

  // Find send button
  const sendBtn = await waitForElement([
    'button[aria-label*="Send"]',
    'button[aria-label*="发送"]',
    'button[type="submit"]',
    '.send-button'
  ], 4000);

  if (sendBtn) {
    sendBtn.click();
  } else {
    // Try Enter
    const enterEvent = new KeyboardEvent('keydown', {
       bubbles: true, cancelable: true, keyCode: 13
     });
     editor.dispatchEvent(enterEvent);
  }
}
