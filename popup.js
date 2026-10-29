document.getElementById('picker').addEventListener('click', async () => {
  if (!window.EyeDropper) return alert("Your browser doesn't support EyeDropper API");
  const eyeDropper = new EyeDropper();
  try {
    const { sRGBHex } = await eyeDropper.open();
    saveColor(sRGBHex);
  } catch (e) { }
});

document.getElementById('manual-picker').addEventListener('change', (e) => {
  saveColor(e.target.value);
});

async function saveColor(hex) {
  const name = await fetchColorName(hex);
  chrome.storage.local.get({ colors: [] }, (data) => {
    // colors is now specific to objects { hex, name }
    const newColor = { hex, name };
    // Filter out existing by hex to avoid duplicates
    const existing = data.colors.filter(c => c.hex !== hex);
    const colors = [newColor, ...existing].slice(0, 10);
    chrome.storage.local.set({ colors }, renderHistory);
  });
}

async function fetchColorName(hex) {
  try {
    const cleanHex = hex.replace('#', '');
    const res = await fetch(`https://www.thecolorapi.com/id?hex=${cleanHex}`);
    const data = await res.json();
    return data.name.value;
  } catch (e) {
    return 'Unknown';
  }
}

function renderHistory() {
  chrome.storage.local.get({ colors: [] }, ({ colors }) => {
    const container = document.getElementById('history');
    container.innerHTML = '<h3>Recent Colors</h3>';

    if (colors.length === 0) {
      container.innerHTML += '<div style="color:#999; font-size:12px; text-align:center;">No colors picked yet.</div>';
      return;
    }

    colors.forEach(item => {
      const hex = typeof item === 'string' ? item : item.hex;
      const name = typeof item === 'string' ? '' : item.name;

      const el = document.createElement('div');
      el.className = 'history-item';

      el.innerHTML = `
        <div class="swatch-group">
          <div class="swatch" style="background: ${hex}"></div>
          <div class="color-info">
            <span class="color-hex">${hex}</span>
            <span class="color-name">${name}</span>
          </div>
        </div>
        <div class="actions">
            <button class="icon-btn copy" title="Copy Hex">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
            <button class="icon-btn delete" title="Remove">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
        </div>
      `;

      el.querySelector('.copy').addEventListener('click', () => {
        navigator.clipboard.writeText(hex);
        // Visual feedback (optional)
        const btn = el.querySelector('.copy');
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#28a745" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
        setTimeout(() => btn.innerHTML = originalHtml, 1500);
      });

      el.querySelector('.delete').addEventListener('click', () => {
        deleteColor(hex);
      });

      container.appendChild(el);
    });
  });
}

function deleteColor(hexToDelete) {
  chrome.storage.local.get({ colors: [] }, (data) => {
    // Filter out the specific color item
    const colors = data.colors.filter(c => {
      const cHex = typeof c === 'string' ? c : c.hex;
      return cHex !== hexToDelete;
    });
    chrome.storage.local.set({ colors }, renderHistory);
  });
}

renderHistory();
