const SEVERITY_COLOR = { critical: "#ff4d4f", high: "#ff9b9e", medium: "#fbbf24", low: "#eab308" };

function scoreColor(score) {
  if (score >= 70) return "#4ade80";
  if (score >= 40) return "#fbbf24";
  return "#ff4d4f";
}

function render(result) {
  const el = document.getElementById("content");
  if (!result) {
    el.innerHTML = '<p class="empty">Select text on any page, right-click, and choose "Scan selection with Red Flag AI Pro".</p>';
    return;
  }
  if (result.error) {
    el.innerHTML = `<p class="error">${result.error}</p>`;
    return;
  }

  const flagsHtml = (result.flags || [])
    .slice(0, 5)
    .map(
      (f) => `<div class="flag"><div class="flag-cat" style="color:${SEVERITY_COLOR[f.severity] || "#ff9b9e"}">${f.category}</div>${f.description || ""}</div>`
    )
    .join("");

  el.innerHTML = `
    <p class="score" style="color:${scoreColor(result.score)}">${result.score}</p>
    <p class="risk">${result.risk} risk · ${result.flag_count} flag${result.flag_count === 1 ? "" : "s"}</p>
    ${flagsHtml || '<p class="empty">No compliance flags found.</p>'}
  `;
}

chrome.storage.local.get("lastResult", ({ lastResult }) => render(lastResult));
chrome.storage.onChanged.addListener((changes) => {
  if (changes.lastResult) render(changes.lastResult.newValue);
});
