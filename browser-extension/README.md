# Red Flag AI Pro browser extension (MVP)

Right-click any selected text on the web and scan it for compliance risk against your Red Flag AI Pro account, no copy and paste into the site needed.

## What it is

A Chrome Manifest V3 extension. No content script, no page injection — it only acts on text you've explicitly selected and right-clicked. It calls the same `/api/v1/scan` endpoint the site's public API already exposes (see `src/app/api/v1/scan/route.ts`), authenticated with a personal API key.

## Try it locally (load unpacked)

1. Go to `chrome://extensions`
2. Turn on "Developer mode" (top right)
3. Click "Load unpacked", select this `browser-extension/` folder
4. Click the extension's icon → "Set API key" → paste a key from [redflagaipro.com/settings](https://www.redflagaipro.com/settings) → API Keys
5. Select some text on any page, right-click, choose "Scan selection with Red Flag AI Pro"

## What's needed to publish this to the Chrome Web Store

This is the part only you can do — I can't create developer accounts or submit anything on your behalf:

1. A one-time $5 Chrome Web Store developer registration fee, at https://chrome.google.com/webstore/devconsole
2. A privacy policy URL (the site's existing `/privacy` page covers this)
3. At least one 1280x800 or 640x400 promotional screenshot
4. Submit for review — typically a few days to a couple of weeks for a first submission

## What's deliberately not built yet

- Firefox/Edge manifest variants (Edge should work as-is via the Chrome Web Store or a separate Edge Add-ons submission, since Edge supports MV3 extensions largely unchanged; Firefox needs its own manifest and hasn't been tested)
- "Scan this page" (whole page, not just a selection) — would need a content script to read page text, a bigger permission ask users may hesitate on, deliberately left out of the MVP
- No usage of the free demo-scan endpoint as a fallback for users without an API key — could be added if a no-account version turns out to matter more than expected
