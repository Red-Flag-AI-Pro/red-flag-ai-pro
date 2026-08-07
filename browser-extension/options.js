const input = document.getElementById("apiKey");
const status = document.getElementById("status");

chrome.storage.sync.get("apiKey", ({ apiKey }) => {
  if (apiKey) input.value = apiKey;
});

document.getElementById("save").addEventListener("click", async () => {
  await chrome.storage.sync.set({ apiKey: input.value.trim() });
  status.style.display = "block";
  setTimeout(() => (status.style.display = "none"), 2000);
});
