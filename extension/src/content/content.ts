// Content script: injects floating widget into blooket.com pages
import "./widget.css";

function init() {
  if (document.getElementById("blooket-calc-widget")) return;

  const container = document.createElement("div");
  container.id = "blooket-calc-widget";
  container.style.cssText = "position:fixed;bottom:20px;right:20px;z-index:999999;pointer-events:auto;font-family:Inter,system-ui,sans-serif;";
  document.body.appendChild(container);

  // Minimal inline widget — no Preact to keep content script small
  container.innerHTML = `
    <div id="bcw-panel" style="width:280px;border-radius:16px;border:1px solid rgba(255,255,255,0.1);background:rgba(10,14,26,0.95);backdrop-filter:blur(20px);box-shadow:0 25px 50px rgba(0,0,0,0.5);overflow:hidden;">
      <div id="bcw-header" style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.06);cursor:move;">
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="width:24px;height:24px;border-radius:6px;background:linear-gradient(135deg,#8b5cf6,#7c3aed);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;color:white;">B</div>
          <span style="font-size:12px;font-weight:600;color:white;">Blooket Calculator</span>
        </div>
        <div style="display:flex;gap:4px;">
          <button id="bcw-min" style="background:none;border:none;color:rgba(255,255,255,0.6);cursor:pointer;padding:2px;font-size:14px;">−</button>
          <button id="bcw-close" style="background:none;border:none;color:rgba(255,255,255,0.6);cursor:pointer;padding:2px;font-size:14px;">×</button>
        </div>
      </div>
      <div id="bcw-body" style="padding:12px;">
        <div style="margin-bottom:8px;">
          <label style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;color:#8b5cf6;display:block;margin-bottom:4px;">Tokens</label>
          <input id="bcw-tokens" type="number" value="500" min="0" style="width:100%;border-radius:10px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.02);padding:8px 12px;font-size:14px;font-weight:700;color:white;outline:none;font-family:inherit;" />
        </div>
        <div style="margin-bottom:8px;">
          <label style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;color:#8b5cf6;display:block;margin-bottom:4px;">Pack</label>
          <select id="bcw-pack" style="width:100%;border-radius:10px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.02);padding:8px 12px;font-size:12px;color:white;outline:none;font-family:inherit;">
            <option value="space">Space (20 tkn)</option>
            <option value="medieval">Medieval (20 tkn)</option>
            <option value="aquatic">Aquatic (20 tkn)</option>
            <option value="lunch">Lunch (25 tkn)</option>
            <option value="bug">Bug (25 tkn)</option>
            <option value="pirate">Pirate (25 tkn)</option>
            <option value="breakfast">Breakfast (20 tkn)</option>
            <option value="bot">Bot (20 tkn)</option>
            <option value="safari">Safari (20 tkn)</option>
            <option value="dino">Dino (25 tkn)</option>
            <option value="wonderland">Wonderland (20 tkn)</option>
            <option value="outback">Outback (25 tkn)</option>
            <option value="ice-monster">Ice Monster (25 tkn)</option>
          </select>
        </div>
        <div style="display:flex;gap:4px;margin-bottom:10px;">
          <button class="bcw-metric" data-m="epicPlus" style="flex:1;border-radius:8px;padding:6px;font-size:10px;font-weight:600;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);color:rgba(255,255,255,0.6);cursor:pointer;">Epic+</button>
          <button class="bcw-metric" data-m="legendary" style="flex:1;border-radius:8px;padding:6px;font-size:10px;font-weight:600;border:1px solid rgba(99,102,241,0.4);background:rgba(99,102,241,0.1);color:#a5b4fc;cursor:pointer;">Legendary</button>
          <button class="bcw-metric" data-m="chroma" style="flex:1;border-radius:8px;padding:6px;font-size:10px;font-weight:600;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);color:rgba(255,255,255,0.6);cursor:pointer;">Chroma</button>
        </div>
        <div id="bcw-result" style="text-align:center;padding:8px 0;border-top:1px solid rgba(255,255,255,0.06);">
          <div id="bcw-pct" style="font-size:28px;font-weight:900;color:#5eead4;">—</div>
          <div id="bcw-label" style="font-size:10px;color:rgba(255,255,255,0.5);margin-top:2px;">chance in 0 pulls</div>
        </div>
        <a id="bcw-full" href="https://www.calculatorblooket.com/?utm_source=extension&utm_medium=widget&utm_campaign=v1" target="_blank" style="display:block;width:100%;border-radius:10px;background:linear-gradient(135deg,#8b5cf6,#7c3aed);padding:8px;text-align:center;font-size:11px;font-weight:600;color:white;text-decoration:none;margin-top:8px;">Open Full Calculator →</a>
      </div>
    </div>
  `;

  // Drag logic
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let panelStartX = 0;
  let panelStartY = 0;

  const header = document.getElementById("bcw-header")!;
  const panel = document.getElementById("bcw-panel")!;
  const body = document.getElementById("bcw-body")!;

  header.addEventListener("mousedown", (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    const rect = container.getBoundingClientRect();
    panelStartX = rect.left;
    panelStartY = rect.top;
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    container.style.left = `${panelStartX + dx}px`;
    container.style.top = `${panelStartY + dy}px`;
    container.style.right = "auto";
    container.style.bottom = "auto";
  });

  document.addEventListener("mouseup", () => { isDragging = false; });

  // Minimize/close
  let minimized = false;
  document.getElementById("bcw-min")!.addEventListener("click", () => {
    minimized = !minimized;
    body.style.display = minimized ? "none" : "block";
    panel.style.width = minimized ? "auto" : "280px";
  });

  document.getElementById("bcw-close")!.addEventListener("click", () => {
    container.style.display = "none";
    // Show reopen button
    const reopen = document.createElement("button");
    reopen.style.cssText = "position:fixed;bottom:20px;right:20px;z-index:999999;border-radius:50%;background:linear-gradient(135deg,#8b5cf6,#7c3aed);border:none;padding:12px;cursor:pointer;box-shadow:0 4px 20px rgba(139,92,246,0.4);";
    reopen.innerHTML = '<span style="font-size:18px;color:white;font-weight:900;">B</span>';
    reopen.addEventListener("click", () => {
      container.style.display = "block";
      reopen.remove();
    });
    document.body.appendChild(reopen);
  });

  // Metric buttons
  let currentMetric = "legendary";
  document.querySelectorAll(".bcw-metric").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentMetric = (btn as HTMLElement).dataset.m ?? "legendary";
      document.querySelectorAll(".bcw-metric").forEach((b) => {
        const el = b as HTMLElement;
        if (el.dataset.m === currentMetric) {
          el.style.borderColor = "rgba(99,102,241,0.4)";
          el.style.background = "rgba(99,102,241,0.1)";
          el.style.color = "#a5b4fc";
        } else {
          el.style.borderColor = "rgba(255,255,255,0.06)";
          el.style.background = "rgba(255,255,255,0.02)";
          el.style.color = "rgba(255,255,255,0.6)";
        }
      });
      recalc();
    });
  });

  // Live calculation
  const tokensInput = document.getElementById("bcw-tokens") as HTMLInputElement;
  const packSelect = document.getElementById("bcw-pack") as HTMLSelectElement;

  function recalc() {
    const tokens = Number(tokensInput.value) || 0;
    const packId = packSelect.value;
    // Send message to background for calculation
    chrome.runtime.sendMessage(
      { type: "calc", tokens, packId, metric: currentMetric },
      (response) => {
        if (response) {
          document.getElementById("bcw-pct")!.textContent = response.pct;
          document.getElementById("bcw-label")!.textContent = `chance in ${response.pulls} pulls`;
        }
      },
    );
  }

  tokensInput.addEventListener("input", recalc);
  packSelect.addEventListener("change", recalc);

  // Auto-detect pack from URL
  const match = window.location.pathname.match(/\/market\/(\w[\w-]*)/);
  if (match) {
    const detected = match[1];
    const opt = packSelect.querySelector(`option[value="${detected}"]`);
    if (opt) packSelect.value = detected;
  }

  recalc();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
