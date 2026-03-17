// ── Shorts blocking ──────────────────────────────

function blockShorts() {
  document.querySelectorAll('ytd-rich-shelf-renderer[is-shorts]').forEach(el => {
  let parent = el;
  // Walk up the tree until we find the row-level container
  while (parent && parent.tagName !== 'YTD-RICH-ITEM-RENDERER' && parent.tagName !== 'YTD-RICH-SECTION-RENDERER') {
    parent = parent.parentElement;
  }
  if (parent) {
    parent.style.display = 'none';
  } else {
    el.style.display = 'none';
  }
});

  document.querySelectorAll('a[href^="/shorts"]').forEach(el => {
    el.closest('ytd-guide-entry-renderer')?.style.setProperty('display', 'none');
  });

  if (window.location.pathname.startsWith('/shorts/')) {
    const videoId = window.location.pathname.split('/shorts/')[1];
    window.location.replace(`https://www.youtube.com/watch?v=${videoId}`);
  }
}

// ── Old layout ───────────────────────────────────

function applyOldLayout() {
  if (!document.getElementById('yt-old-layout-style')) {
    const link = document.createElement('link');
    link.id = 'yt-old-layout-style';
    link.rel = 'stylesheet';
    link.href = chrome.runtime.getURL('content.css');
    document.head.appendChild(link);
  }
}

function removeOldLayout() {
  const existing = document.getElementById('yt-old-layout-style');
  if (existing) existing.remove();
}

// ── Read settings and apply ──────────────────────

chrome.storage.sync.get(['blockingEnabled', 'oldLayoutEnabled'], function(data) {
  const shortsOn = data.blockingEnabled !== false;
  const layoutOn = data.oldLayoutEnabled !== false;

  if (shortsOn) {
    blockShorts();
    const observer = new MutationObserver(blockShorts);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (layoutOn) {
    applyOldLayout();
  } else {
    removeOldLayout();
  }
});