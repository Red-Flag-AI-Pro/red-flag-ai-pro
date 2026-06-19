# Product & Marketing Context — Red Flag AI Pro

This file gives any skill/agent working on this repo the standing business
context, so it doesn't need to re-ask. Skills should read this first and
only ask follow-up questions for things not covered here.

## What it is

Red Flag AI Pro (redflagaipro.com) — a compliance-scanning SaaS. Users paste
marketing copy, an ad, a landing page, or a URL and get a score (0-100) plus
flagged risks across **29 risk categories** and **9 jurisdictions** (US, UK,
EU, Australia, Canada, Brazil, India, Singapore, UAE), each with an
explanation and a suggested rewrite. Results in ~60 seconds, no signup
required for the free demo scan.

## Founder

James Stokes — solo, non-technical founder, UK-based, building the whole
product with Claude Code. No team, no funding. Be mindful of this when
scoping work: prefer no-code/low-effort options, flag ongoing maintenance
burden explicitly, and don't assume engineering bandwidth beyond what Claude
Code itself can do.

## Target audience (ICP)

Two segments:
1. **B2C / solo creators** — course sellers, coaches, info-product sellers,
   solo marketers running funnels and ads. Especially high-value if their
   copy has health, income, or AI-related claims (highest legal risk →
   highest motivation to fix).
2. **B2B / agencies** — marketing or compliance agencies managing multiple
   client ad accounts, who can use Growth/Sentinel tiers for multi-client
   audits.

Brand positioning is dual-sided: **"Are you a Builder? Are you a Buyer? Scan
it before it's too late."** — it's not just a B2B tool for people checking
their own marketing (Builders), it's also pitched at consumers (Buyers)
who want to check if an ad/offer looks like a scam or illegal claim before
buying. Keep both angles in mind for positioning/content/ads.

## Pricing

- **Free** — no signup, 1 demo scan (email-gated)
- **Starter** (free tier, signed up) — 1 scan/month
- **Pro** — £49/month — for individual creators
- **Growth** — £199/month — high-volume creators/marketers, multi-client
- **Sentinel** — £999/month — agencies/regulated businesses: human review
  logs, legal timestamps, signed certificates, FCA, EU AI Act, greenwashing

## Key positioning angles / hooks

- **29 risk categories, 9 jurisdictions, one paste box** — core scanner pitch
- **EU AI Act Article 50** (AI-generated content disclosure, enforcement from
  Aug 2026) — strong, timely angle, especially for AI tools/course creators
- **"I scanned my own site. 0/100. 10 violations."** — confession/self-scan
  angle, performs well in ads and posts
- DUAA/PECR cookie fine increases (UK, max fine now £17.5m / 4% global
  turnover, up from £500k) — relevant for UK-focused content
- ICO's Dec 2025 cookie compliance review of 1,000 UK sites: 979/1000
  compliant, 17 received preliminary enforcement notices (PENs) — useful
  proof point that enforcement is real, not hypothetical

## Brand voice / writing style

- Direct, confident, plain language — no corporate jargon ("utilize",
  "streamline", "leverage")
- Founder-voice on LinkedIn: build-in-public tone, honest about bugs/fixes,
  not overly polished
- Avoid fabricating quotes, stats, or phrases and attributing them to real
  people — always use their actual words when referencing someone's post
- Don't overclaim — "compliance scanner" not "compliance guarantee"; this
  product is itself subject to the kind of scrutiny it sells, so copy must
  stay defensible (no income claims, no fake urgency/scarcity)

## Stack (for anything touching code)

- Next.js (App Router), TypeScript, Tailwind
- Backend: Supabase (auth + DB), project ref `lmpyyghujsyuxzrybtcx`
- Payments: Stripe (GBP)
- Email: Resend (currently sandbox sender `onboarding@resend.dev` — domain
  not yet verified)
- Hosting: Vercel
- Repo: https://github.com/RedFlagProAI/redflagproai
- Core scanning logic: `src/lib/analyzer.ts`

## Current status (as of 15 Jun 2026)

- Live, Product Hunt launched (27 May 2026), zero real paying customers so
  far — focus is on getting first customers, not scaling
- Marketing channels: LinkedIn organic (primary), Google Ads (~£10/day,
  Search campaign "Search - Compliance Scanner - UK")
- Admin dashboard at /admin shows users/scans/signups

## Where to look for more detail

Day-to-day status, campaign performance, outreach threads, and to-do items
change quickly and are NOT duplicated here — check with James for current
state on anything time-sensitive (ad spend, lead status, etc.).
