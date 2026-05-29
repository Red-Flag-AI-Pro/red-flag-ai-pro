const API_BASE = "https://redflagaipro.com/api";

const CATEGORY_LABELS = {
  income_claim: "Income Claim",
  urgency: "False Urgency",
  scarcity: "Artificial Scarcity",
  testimonial: "Unsubstantiated Testimonial",
  guarantee: "Misleading Guarantee",
  health_claim: "Health Claim",
  legal_disclaimer: "Missing Disclaimer",
  contract_contradiction: "Claim vs. Contract",
  data_privacy: "Data Privacy Violation",
  hidden_fees: "Hidden Fees",
  fake_reviews: "Fake Review Claim",
  comparative_advertising: "Unverified Comparison",
  email_compliance: "Email Marketing Consent",
  dark_patterns: "Dark Pattern",
  ai_disclosure: "AI Content — No Disclosure",
  ai_endorsement: "AI Endorsement Violation",
  automated_decisions: "Automated Decision Making",
  financial_promotion: "FCA Financial Promotion",
  greenwashing: "Greenwashing",
  subscription_trap: "Subscription Trap",
  influencer_disclosure: "Influencer Disclosure",
};

function scoreColor(score) {
  if (score >= 70) return "#22c55e";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

function riskLabel(score) {
  if (score >= 70) return "Low Risk";
  if (score >= 40) return "Medium Risk";
  return "High Risk";
}

function show(id) {
  ["setup", "scan", "loading", "results"].forEach((s) => {
    const el = document.getElementById(s);
    if (el) el.style.display = s === id ? "block" : "none";
  });
}

function renderResults(data, tabUrl) {
  const score = data.score;
  const color = scoreColor(score);

  document.getElementById("scoreNum").textContent = score;
  document.getElementById("scoreNum").style.color = color;
  document.getElementById("scoreLabel").textContent = riskLabel(score);
  document.getElementById("scoreLabel").style.color = color;
  document.getElementById("scoreSub").textContent = `${data.flag_count} flag${data.flag_count !== 1 ? "s" : ""} detected`;
  document.getElementById("ring").style.borderColor = color;
  document.getElementById("ringInner").textContent = score;
  document.getElementById("ringInner").style.color = color;

  const container = document.getElementById("flagsContainer");
  container.innerHTML = "";

  if (!data.flags || data.flags.length === 0) {
    container.innerHTML = `
      <div class="no-flags">
        <div class="no-flags-icon">✅</div>
        <div class="no-flags-text">No flags detected</div>
        <div class="no-flags-sub">This page passed all compliance checks</div>
      </div>`;
  } else {
    data.flags.slice(0, 4).forEach((flag) => {
      const label = CATEGORY_LABELS[flag.category] || flag.category;
      const badgeClass = `badge-${flag.severity}`;
      container.innerHTML += `
        <div class="flag">
          <div class="flag-header">
            <span class="flag-title">${label}</span>
            <span class="badge ${badgeClass}">${flag.severity}</span>
          </div>
          <div class="flag-desc">${(flag.description || "").slice(0, 120)}${(flag.description || "").length > 120 ? "…" : ""}</div>
          ${flag.suggestion ? `<div class="flag-fix"><div class="flag-fix-label">Fix</div>${flag.suggestion.slice(0, 100)}…</div>` : ""}
        </div>`;
    });
    if (data.flags.length > 4) {
      container.innerHTML += `<div style="font-size:11px;color:#6b7280;text-align:center;margin-top:4px;">+${data.flags.length - 4} more flags in full report</div>`;
    }
  }

  const viewLink = document.getElementById("viewFullLink");
  if (data.scan_id) {
    viewLink.href = `https://redflagaipro.com/scans/${data.scan_id}`;
    viewLink.style.display = "block";
  } else {
    viewLink.style.display = "none";
  }

  show("results");
}

async function runScan(apiKey, tabUrl) {
  show("loading");
  document.getElementById("errorMsg").style.display = "none";

  try {
    // Use the URL scan endpoint via the v1 API
    const res = await fetch(`${API_BASE}/scans/url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Extension-Key": apiKey,
      },
      body: JSON.stringify({ url: tabUrl }),
    });

    // If URL scan doesn't accept extension key, fall back to v1/scan with URL as content marker
    if (res.status === 401) {
      // Try v1 API
      const v1res = await fetch(`${API_BASE}/v1/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ title: tabUrl, content: `[URL] ${tabUrl}` }),
      });
      const v1data = await v1res.json();
      if (!v1res.ok) throw new Error(v1data.error || "Scan failed");
      renderResults(v1data, tabUrl);
      return;
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Scan failed");
    renderResults({ ...data, scan_id: data.id, flag_count: 0, flags: [] }, tabUrl);

  } catch (err) {
    show("results");
    const errEl = document.getElementById("errorMsg");
    errEl.textContent = err.message || "Something went wrong. Check your API key and try again.";
    errEl.style.display = "block";
    document.getElementById("flagsContainer").innerHTML = "";
    document.getElementById("viewFullLink").style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const result = await chrome.storage.local.get("rfpApiKey");
  const apiKey = result.rfpApiKey;

  // Get current tab URL
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const tabUrl = tab?.url || "";

  // Show setup if no key
  if (!apiKey) {
    show("setup");
  } else {
    document.getElementById("urlDisplay").textContent = tabUrl;
    show("scan");
  }

  // Save key
  document.getElementById("saveKeyBtn").addEventListener("click", async () => {
    const key = document.getElementById("apiKeyInput").value.trim();
    if (!key.startsWith("rfp_")) {
      alert("API key must start with rfp_");
      return;
    }
    await chrome.storage.local.set({ rfpApiKey: key });
    document.getElementById("urlDisplay").textContent = tabUrl;
    show("scan");
  });

  // Change key
  document.getElementById("changeKey").addEventListener("click", () => {
    chrome.storage.local.remove("rfpApiKey");
    show("setup");
  });

  // Scan
  document.getElementById("scanBtn").addEventListener("click", async () => {
    const stored = await chrome.storage.local.get("rfpApiKey");
    runScan(stored.rfpApiKey, tabUrl);
  });

  // Rescan
  document.getElementById("rescanBtn").addEventListener("click", async () => {
    const stored = await chrome.storage.local.get("rfpApiKey");
    runScan(stored.rfpApiKey, tabUrl);
  });

  // Open dashboard
  document.getElementById("openDashBtn").addEventListener("click", () => {
    chrome.tabs.create({ url: "https://redflagaipro.com/dashboard" });
  });
});
