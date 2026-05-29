# Red Flag AI Pro — Chrome Extension

Scan any page for compliance risks directly from your browser. Requires a Sentinel plan API key.

## Installation (Developer mode — until published to Chrome Web Store)

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select this `chrome-extension` folder
5. The Red Flag AI Pro icon will appear in your toolbar

## Usage

1. Click the extension icon on any page
2. On first use, enter your API key from redflagaipro.com/settings
3. Click **Scan this page**
4. See compliance score and flags in 10-15 seconds

## Getting your API key

- Log in at redflagaipro.com
- Go to Settings
- Under API Keys, click Create Key
- Copy the key (starts with `rfp_`) — shown once only
- Paste it into the extension

## Publishing to Chrome Web Store

To publish for distribution:
1. Zip the `chrome-extension` folder
2. Go to chrome.google.com/webstore/devconsole
3. Pay the one-time $5 developer fee
4. Upload the zip
5. Fill in the store listing
6. Submit for review (usually 1-3 days)
