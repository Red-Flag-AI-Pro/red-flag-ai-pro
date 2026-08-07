# Red Flag AI Pro — n8n scan triage workflow

An importable n8n workflow: receive content via webhook, scan it with your Red Flag AI Pro API key, and branch to an alert if it comes back high risk.

## Import it

1. In n8n: **Workflows → Import from File** → select `scan-triage.workflow.json`
2. Open the "Scan with Red Flag AI Pro" node → under Authentication, create a new **Header Auth** credential:
   - Name: `Authorization`
   - Value: `Bearer rfp_your_key_here` (create a key at [redflagaipro.com/settings](https://www.redflagaipro.com/settings) → API Keys)
3. Replace the "Wire your alert here" no-op node with a real Slack, Email, or Microsoft Teams node — the scan result (`score`, `risk`, `flag_count`, `flags[]`) is on the input item, same shape the API docs describe (`src/app/api/v1/scan/route.ts`)
4. Activate the workflow. It's now listening at `<your n8n URL>/webhook/red-flag-scan-triage`

## Trigger it

```bash
curl -X POST https://your-n8n-instance/webhook/red-flag-scan-triage \
  -H "Content-Type: application/json" \
  -d '{"content": "Lose 10lbs in 3 days, guaranteed!", "title": "Test ad copy"}'
```

## What's deliberately not built

- A "follow-up draft" variant (draft a reply email when a flagged scan needs a client response) — same shape, different second half of the pipeline. Worth building once the triage version is actually in use, not before.
- No n8n Cloud/self-hosted setup instructions — assumes you already have an n8n instance running, since that's a separate decision from this workflow.
