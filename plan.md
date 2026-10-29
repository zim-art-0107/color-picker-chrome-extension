create a chrome extention
    {
      "manifest_version": 3,
      "name": "My Extension",
      "version": "1.0",
      "description": "A basic Chrome extension template.",
      "permissions": ["storage", "activeTab"],
      "action": {
        "default_popup": "popup.html",
        "default_icon": "icon.png"
      },
      "background": {
        "service_worker": "background.js"
      }
    }
    
### popup.html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { width: 200px; padding: 10px; font-family: sans-serif; }
    #picker { width: 100%; padding: 8px; cursor: pointer; background: #007bff; color: white; border: none; border-radius: 4px; }
    .history-item { display: flex; align-items: center; margin-top: 8px; font-size: 12px; }
    .swatch { width: 20px; height: 20px; border-radius: 3px; margin-right: 8px; border: 1px solid #ccc; }
    #history { margin-top: 10px; border-top: 1px solid #eee; padding-top: 5px; }
  </style>
</head>
<body>
  <button id="picker">Pick a Color</button>
  <div id="history"></div>
  <script src="popup.js"></script>
</body>
</html>

### popup.js
document.getElementById('picker').addEventListener('click', async () => {
  if (!window.EyeDropper) return alert("Your browser doesn't support EyeDropper API");
  const eyeDropper = new EyeDropper();
  try {
    const { sRGBHex } = await eyeDropper.open();
    saveColor(sRGBHex);
  } catch (e) {}
});

function saveColor(hex) {
  chrome.storage.local.get({ colors: [] }, (data) => {
    const colors = [hex, ...data.colors.filter(c => c !== hex)].slice(0, 10);
    chrome.storage.local.set({ colors }, renderHistory);
  });
}

function renderHistory() {
  chrome.storage.local.get({ colors: [] }, ({ colors }) => {
    const container = document.getElementById('history');
    container.innerHTML = '<strong>History:</strong>';
    colors.forEach(hex => {
      const item = document.createElement('div');
      item.className = 'history-item';
      item.innerHTML = `
        <div class="swatch" style="background: ${hex}"></div>
        <span>${hex}</span>
      `;
      container.appendChild(item);
    });
  });
}

renderHistory();

### background.js
// Empty service worker to satisfy manifest requirements
chrome.runtime.onInstalled.addListener(() => {
  console.log("Color Picker Extension Installed");
});
