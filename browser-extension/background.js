// Service worker: registers the right-click "Scan with Red Flag AI Pro"
// context menu, runs the scan against the same /api/v1/scan endpoint the
// site's own API docs describe, and stores the last result for the popup
// to read. No content script is used, since the selected text is already
// available on the contextMenus.onClicked event, this stays intentionally
// minimal (no page injection, no page reading beyond what was selected).

const API_BASE = "https://www.redflagaipro.com";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "scan-selection",
    title: 'Scan selection with Red Flag AI Pro',
    contexts: ["selection"],
  });
});

async function getApiKey() {
  const { apiKey } = await chrome.storage.sync.get("apiKey");
  return apiKey || null;
}

async function runScan(content, title) {
  const apiKey = await getApiKey();
  if (!apiKey) {
    await chrome.storage.local.set({
      lastResult: { error: "No API key set. Open the extension options and add your Red Flag AI Pro API key (Settings → API Keys on the site)." },
    });
    chrome.action.openPopup?.();
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/v1/scan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ content, title: title || "Browser extension scan" }),
    });
    const data = await res.json();

    if (!res.ok) {
      await chrome.storage.local.set({ lastResult: { error: data.error || "Scan failed." } });
    } else {
      await chrome.storage.local.set({ lastResult: data });
      const flagCount = data.flag_count ?? 0;
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon128.png",
        title: `Score: ${data.score} (${data.risk} risk)`,
        message: flagCount === 0 ? "No compliance flags found." : `${flagCount} flag${flagCount === 1 ? "" : "s"} found. Click the extension icon for details.`,
      });
    }
  } catch {
    await chrome.storage.local.set({ lastResult: { error: "Could not reach Red Flag AI Pro. Check your connection and try again." } });
  }
}

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "scan-selection" && info.selectionText) {
    runScan(info.selectionText, info.selectionText.slice(0, 60));
  }
});
