const shortsBtn = document.getElementById('toggleShorts');
const layoutBtn = document.getElementById('toggleLayout');

// ── Load saved states on popup open ──────────────

chrome.storage.sync.get(['blockingEnabled', 'oldLayoutEnabled'], function(data) {
  updateShortsButton(data.blockingEnabled !== false);
  updateLayoutButton(data.oldLayoutEnabled !== false);
});

// ── Shorts toggle ─────────────────────────────────

shortsBtn.addEventListener('click', function() {
  chrome.storage.sync.get('blockingEnabled', function(data) {
    const newValue = !(data.blockingEnabled !== false);
    chrome.storage.sync.set({ blockingEnabled: newValue });
    updateShortsButton(newValue);
  });
});

// ── Layout toggle ─────────────────────────────────

layoutBtn.addEventListener('click', function() {
  chrome.storage.sync.get('oldLayoutEnabled', function(data) {
    const newValue = !(data.oldLayoutEnabled !== false);
    chrome.storage.sync.set({ oldLayoutEnabled: newValue });
    updateLayoutButton(newValue);

    // Tell the active YouTube tab to update immediately
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.reload(tabs[0].id);
    });
  });
});

// ── Button update functions ───────────────────────

function updateShortsButton(isEnabled) {
  if (isEnabled) {
    shortsBtn.textContent = 'Blocking ON — Click to disable';
    shortsBtn.className = 'enabled';
  } else {
    shortsBtn.textContent = 'Blocking OFF — Click to enable';
    shortsBtn.className = 'disabled';
  }
}

function updateLayoutButton(isEnabled) {
  if (isEnabled) {
    layoutBtn.textContent = 'Compact Layout ON — Click to disable';
    layoutBtn.className = 'enabled';
  } else {
    layoutBtn.textContent = 'Compact Layout OFF — Click to enable';
    layoutBtn.className = 'disabled';
  }
}