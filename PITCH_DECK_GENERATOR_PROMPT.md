# Red Flag AI Pro — Master Pitch Deck Generator Prompt

**Use this prompt with Google Slides API, Python notebook, or any generative tool to auto-generate a polished investor pitch deck.**

---

## BRAND GUIDELINES

### Color Palette
- **Primary Dark Background:** #050505 (near black)
- **Secondary Dark:** #0F0505 (dark red tint)
- **Primary Brand Red:** #CC0000 (vibrant red, use for CTA buttons and accents)
- **Secondary Red:** #EF4444 (lighter red, for secondary accents)
- **Gold Highlight:** #FBBF24 (for badges like "Most Popular")
- **Text Primary:** #FFFFFF (white for headlines)
- **Text Secondary:** rgba(255,255,255,0.6) (muted white for body)
- **Text Tertiary:** rgba(255,255,255,0.4) (even more muted for subtle text)
- **Border Color:** rgba(255,255,255,0.1) (subtle borders)

### Typography
- **Headlines:** Syne Bold (weight 700) or Syne Heavy (weight 800), sizes 28–48px
- **Body Text:** Inter Regular (weight 400), sizes 14–18px
- **Accent/Taglines:** Syne Medium (weight 600), sizes 16–22px
- **Monospace (numbers/data):** DM Mono Regular, sizes 18–32px
- **Line Height:** 1.4 for headlines, 1.6 for body
- **Letter Spacing:** -0.02em for headlines (tight), 0.01em for uppercase labels

### Design System
- **Border Radius:** 8px for standard elements, 12px for cards
- **Box Shadows:** Minimal. Use only: `0 8px 32px rgba(204,0,0,0.35)` on hover/active red elements
- **Spacing:** 16px base unit. Use multiples: 16px, 24px, 32px, 48px
- **Aspect Ratio:** 16:9 (standard presentation)
- **Theme:** Dark mode only (dark background, light text)

### Logo & Imagery
- **Logo Location:** `/public/redflag-logo.png` (1254×1254 PNG, use 80–120px on slides)
- **Logo Placement:** Top-left corner on every slide, or centered on cover slide
- **Images:** Use simple geometric shapes, icons (no complex photography)
- **Diagrams:** Flowcharts, bar charts, simple infographics with red accents

---

## SLIDE DECK CONTENT (12 Slides)

### SLIDE 1: COVER
- **Layout:** Centered
- **Logo:** Large (200px), centered top
- **Headline:** "Red Flag AI Pro"
- **Subheadline:** "The world's only 9-jurisdiction AI compliance scanner"
- **Tagline:** "Spot illegal marketing. Scan your copy. 60 seconds. No account needed."
- **Background:** Solid #050505 with subtle radial gradient (rgba(204,0,0,0.08) at center, fading to transparent)
- **Footer:** "James Stokes, Founder | June 2026"

### SLIDE 2: THE PROBLEM
- **Headline:** "Why This Matters"
- **Left Column (Problem Statements):**
  - AI is moving faster than compliance
  - Marketing laws span 9 jurisdictions (FTC, GDPR, ASA, FCA, ACCC, CASL, LGPD, DPDP, PDPA)
  - Non-compliance costs: legal fees, FTC fines (£50k+), reputation damage
  - Solo creators and agencies have no compliance infrastructure
  - Existing tools: expensive (£5k+/mo), slow (2–5 days), generic
- **Right Column (Statistics):** Display as large bold numbers + description
  - "60%" of coaches/creators run ads without legal review
  - "600+" FTC warning letters in 2023
  - "1 in 3" agencies got compliance complaints last year
- **Founder Quote:** 
  - "I built courses. I bought courses. I got burned by both. No legal budget. No compliance infrastructure. This shouldn't be this hard."
  - Attribution: "— James, Founder"
- **Design:** Split screen layout, problem icons on left, statistics on right with red accent boxes

### SLIDE 3: THE SOLUTION
- **Headline:** "Red Flag AI Pro: Compliance in 60 Seconds"
- **Subheadline:** "Simple. Instant. Comprehensive."
- **3-Step Flowchart:**
  - Step 1: "Input" (paste copy, URL, VSL)
  - Step 2: "Scan" (AI checks 29 risk categories)
  - Step 3: "Output" (score + flags + rewrites)
  - Use arrow connectors between steps
- **Key Features (Bullet List):**
  - ✓ 9 jurisdictions (FTC, GDPR, ASA, FCA, ACCC, CASL, LGPD, DPDP, PDPA)
  - ✓ 29 risk categories (health claims, income claims, influencer disclosure, greenwashing, FCA financial promotions, etc.)
  - ✓ Plain English explanations (not legalese)
  - ✓ Instant rewrite suggestions
  - ✓ Compliance score (0–100)
- **Visual:** Include mockup of scanner result showing red/yellow/green flags, category names, suggested rewrites
- **Design:** Red checkmarks, clean layout, screenshot of actual product

### SLIDE 4: MARKET OPPORTUNITY
- **Headline:** "Who Needs This?"
- **Three-Column Layout:**

  **Column 1: Solopreneurs & Creators**
  - Course sellers, coaches, info-product creators
  - Run ads on Facebook, Google, TikTok
  - No legal background
  - Budget: £20–£100/mo
  - Market size: 2M+ in target markets

  **Column 2: Agencies**
  - Marketing, digital, performance agencies
  - Managing multiple client accounts
  - Need audit trail + white-label reports
  - Budget: £500–£5k/mo
  - Market size: 50k+ agencies globally

  **Column 3: Regulated Businesses**
  - Health, finance, e-commerce
  - Compliance-heavy industries
  - Need continuous monitoring
  - Budget: £1k+/mo
  - Market size: 100k+ enterprises

- **Bottom:** "TAM: $500M+ (compliance software space)"
- **Design:** Three equal cards, color-coded (green for Solopreneurs, amber for Agencies, red for Enterprises)

### SLIDE 5: BUSINESS MODEL
- **Headline:** "Tiered Pricing for Every Use Case"
- **Three Pricing Cards (side by side):**

  **Pro — £29/month**
  - 10 scans/month
  - 16 risk categories
  - Paste + .txt upload
  - Plain English flags + rewrites
  - Full scan history
  - CSV export
  - Email support
  - Badge: "Entry Level"

  **Growth — £99/month** 
  - "MOST POPULAR" (gold badge)
  - Everything in Pro +
  - Unlimited scans
  - 20 risk categories
  - VSL script scanning
  - Video scan summaries
  - Site audit (up to 10 pages)
  - Client workspaces
  - URL monitoring (5 URLs)
  - PDF reports
  - Priority support
  - Badge: "For Agencies"

  **Sentinel — £499/month**
  - Everything in Growth +
  - All 29 risk categories
  - FCA financial promotions
  - Greenwashing scanner
  - YouTube VSL transcript scanning
  - Audio transcription (Whisper)
  - Site audit (up to 50 pages)
  - Unlimited URL monitoring
  - Multi-user team seats
  - White-label PDF reports
  - REST API + API keys
  - Zapier / webhook integration
  - Chrome extension
  - Dedicated onboarding
  - Badge: "Enterprise"

- **Additional Info:** "Free: 1 scan/month (email-gated lead magnet)"
- **Footer:** "Low-cost infrastructure (AWS serverless, Vercel). Gross margins: 80%+"
- **Design:** Three card layout, Growth card highlighted with border/shadow, prices in large bold numbers

### SLIDE 6: TRACTION & VALIDATION
- **Headline:** "Early Validation"
- **Metrics Display (large bold numbers):**
  - [X] scans completed in [Y] months
  - [X%] month-over-month growth
  - [X] active customers
  - £[X] monthly recurring revenue (MRR)
  - [X%] free-to-paid conversion rate
- **Channels Working:**
  - Organic SEO (long-tail keywords: "compliance checker", "VSL scanner", "ad compliance")
  - Affiliate program (partnerships with course creators, agencies)
  - Product Hunt launch momentum
  - LinkedIn + founder brand
  - Google Ads (Search campaign, £5/day spend)
- **Recent Launches:**
  - ✓ 29-category compliance framework (June 2026)
  - ✓ Audio transcription via Whisper API
  - ✓ Free demo scanner (no signup required) — 10k+ monthly users
- **Design:** Large metric cards with icons, channel list with badges, timeline showing recent milestones

### SLIDE 7: AFFILIATE & PARTNERSHIP REVENUE
- **Headline:** "Multiple Revenue Streams"
- **Three Revenue Sources (bar chart or stacked bar):**
  - **Direct Subscription** (% of revenue): Pro + Growth + Sentinel tiers
  - **Affiliate Program** (% of revenue): 20% recurring commission, partners earn from referrals
  - **Enterprise/Custom** (% of revenue): White-label, API, Chrome extension, Zapier
- **Affiliate Program Details:**
  - 20% lifetime recurring commission per customer
  - Partners: course creators, agencies, compliance consultants
  - Current affiliates: [X] partners → £[X]/mo affiliate revenue
  - Scalable: each partner brings 10–50 customers
- **Projected ARR at Scale:** £1–5M (with 500–2k customers)
- **Design:** Bar chart showing revenue breakdown, growth trajectory curve, partner logos (placeholder)

### SLIDE 8: ROADMAP (12 Months)
- **Headline:** "What's Next — Building Compliance Infrastructure"
- **Timeline (Horizontal or Vertical):**

  **Q3 2026 (Now)**
  - Expand to 30+ risk categories
  - Age verification & Under-16 Safety module
  - Chrome extension launch
  - Build affiliate network (20+ partners)

  **Q4 2026**
  - AI Visibility Checker (free tool)
  - Contract Red Flags scanner
  - Influencer/Creator Disclosure Checker
  - Improved UX for bulk scanning

  **Q1 2027**
  - AI Policy Generator (auto-write compliant policies)
  - Zapier + API availability (all plans)
  - Email digest notifications
  - Mobile app (web-first)

  **Q2 2027**
  - Expand to 5 new jurisdictions
  - Mobile app (iOS/Android)
  - Custom rule builder (enterprise)
  - Marketplace for compliance plugins

- **Vision Statement:** "The compliance infrastructure layer for the AI-powered internet"
- **Design:** Timeline with icons per milestone, color-coded by quarter

### SLIDE 9: WHY NOW (Market Timing)
- **Headline:** "Perfect Timing — Three Converging Waves"
- **Three Columns:**

  **Regulatory Wave**
  - EU AI Act (mandatory Aug 2026)
  - FTC crackdowns on AI-generated claims
  - TikTok & Google tightening ad policies
  - "More laws, faster than creators expect"

  **AI Explosion**
  - 10x more creators using AI to write copy
  - Tools like ChatGPT enable non-technical people to build funnels
  - Compliance gap widening (speed of code > speed of law)
  - "Faster tools = bigger compliance risks"

  **Market Demand**
  - Affiliate marketing forums: compliance questions spiking
  - Creator communities: "Is this legal?" in every thread
  - Agencies: looking for tools to scale compliance reviews
  - "Demand is here. Supply is missing."

- **Founder Advantage:**
  - Built from real pain (not assumed problem)
  - Deep understanding of target customer
  - Solo operation = lean, fast-moving
  - "Speed + founder-product fit"
- **Design:** Three converging arrows or trend lines, quote callouts, urgency tone

### SLIDE 10: THE ASK
- **Headline:** "Our Ask"
- **Main Ask (Large, Bold):** "£50,000 for 10% equity"
- **Use of Funds (Pie or Stacked Bar Chart):**
  - 40% Engineering (build roadmap features: AI tools, more jurisdictions, mobile)
  - 30% Marketing (SEO content, paid acquisition, affiliate program growth)
  - 20% Operations (legal/compliance, payment processing, customer support)
  - 10% Runway buffer
- **Timeline:** "18 months to £100k+ ARR"
- **Valuation Context:** "At £100k ARR, founders typically raise at 5–8x revenue valuation"
- **Alternative:** "Open to partnerships (integrations with legal/accounting tools, agency networks, course platforms)"
- **Design:** Pie chart with segments colored (red, gold, teal, gray), clear percentage labels

### SLIDE 11: THE FOUNDER
- **Headline:** "Built by Someone Who Lived the Problem"
- **Content:**
  - **Name & Title:** James Stokes, Founder
  - **Photo:** Professional headshot (placeholder: circle, initials "JS" in red)
  - **Background:**
    - Non-technical founder who built redflagaipro.com with Claude Code (AI-first approach)
    - Burned by misleading courses + compliance issues in own funnels
    - 18+ months bootstrapping (product-market fit validated)
    - Running lean (solo operation, low monthly burn)
    - Expertise: marketing, compliance risk, funnel psychology
  - **Why This Matters:** 
    - "I'm not selling compliance software to lawyers. I'm solving the exact problem I faced."
    - "That's why we charge £29, not £299. That's why we move fast."
- **Design:** Founder photo (left), bio text (right), personal tone, red accent line

### SLIDE 12: CLOSE
- **Headline:** "The World's First 9-Jurisdiction Compliance Scanner"
- **Subheadline:** "Help creators and agencies stay compliant as AI accelerates."
- **Call-to-Action:**
  - Schedule a demo: [link to calendly or typeform]
  - Try free scan: www.redflagaipro.com
  - Email: james@redflagaipro.com
  - LinkedIn: @redflagaipro
- **Closing Quote:** 
  - "Compliance isn't boring. It's the layer that lets innovation happen safely. That's the business we're building."
- **Design:** Bold headline, large CTA buttons in red, minimalist background, contact info clearly visible

---

## DESIGN SPECIFICATIONS

### Layout & Structure
- **Slide Dimensions:** 1920 × 1080 (16:9, standard presentation)
- **Margins:** 48px padding on all sides
- **Spacing:** Use 16px base unit (16px, 24px, 32px, 48px, 64px for vertical rhythm)
- **Content Width:** Max 1824px (leaving 48px margins)

### Typography Rules
- **Headline (Syne):** 40–48px, weight 700 (bold) or 800 (heavy), letter-spacing -0.02em
- **Subheadline (Syne):** 24–28px, weight 600, letter-spacing -0.01em
- **Body Text (Inter):** 16px, weight 400, line-height 1.6, color rgba(255,255,255,0.6)
- **Data/Numbers (DM Mono):** 20–32px, weight 700, letter-spacing -0.02em
- **Labels (Syne):** 11–12px, weight 700, letter-spacing 0.15em, text-transform uppercase, color #CC0000

### Color Application
- **Backgrounds:** Always #050505 (dark)
- **Accent Elements (buttons, highlights):** #CC0000 (red)
- **Secondary Accents (badges, highlights):** #EF4444 (lighter red) or #FBBF24 (gold)
- **Text on Dark:** #FFFFFF (headlines), rgba(255,255,255,0.6) (body)
- **Text on Red:** White (#FFFFFF)
- **Borders:** rgba(255,255,255,0.1)

### Visual Elements
- **Icons:** Simple geometric shapes or Tabler icons (outline style, 24–32px)
- **Flowcharts:** 3-step horizontal layout with arrow connectors, each step in rounded box
- **Charts:** Bar charts, pie charts (use red, gold, teal, gray). No gradients — solid fills only
- **Cards:** 8px or 12px border radius, 0.5px border in rgba(255,255,255,0.1), padding 24px
- **Buttons:** CTA buttons in #CC0000 red, white text, 8px border-radius, 12px padding horizontal
- **Dividers:** 0.5px solid rgba(255,255,255,0.1)

### Images & Assets
- **Logo:** /public/redflag-logo.png, 80–120px, placed top-left or centered
- **Product Screenshot:** From www.redflagaipro.com dashboard (if available)
- **Founder Photo:** Placeholder circle with initials "JS" in red (200×200px) or actual headshot
- **Icons:** Simple silhouettes (chart, lock, shield, flag, checkmark)

### Dark Mode (Primary)
- All slides use dark theme (#050505 background)
- No light mode version needed
- Ensure all text has sufficient contrast (WCAG AA minimum 4.5:1)

---

## GENERATION INSTRUCTIONS

### For Google Slides API / Python Notebook
1. **Create a new presentation** with dimensions 1920 × 1080
2. **Set default theme colors:**
   - Background: #050505
   - Text: #FFFFFF
   - Accent: #CC0000
3. **For each slide:**
   - Add background fill: solid #050505 (or #0F0505 for subtle variation)
   - Add logo: 100px width, positioned top-left (except cover slide: centered, 200px)
   - Apply typography per slide type
   - Add content: text, shapes, charts, images per specifications above
4. **Add animations (optional):**
   - Slide transitions: Fade (0.3s)
   - Text entrance: Appear on click (for bullets)
5. **Export as:** PDF (high quality, 300dpi) and PowerPoint (.pptx)

### For Figma / Design Tools
1. **Create frame:** 1920 × 1080, name "Red Flag AI Pro Pitch Deck"
2. **Set up design system:**
   - Create color styles: Dark Background, Text Primary, Text Secondary, Accent Red, etc.
   - Create text styles: Headline (Syne 48px), Body (Inter 16px), Data (DM Mono 24px), Label (Syne 12px)
3. **Build each slide** as a separate frame
4. **Use components** for: Card, Button, Metric Box, Chart, Timeline Step
5. **Create prototype:** Link frames with Fade transition (0.3s)
6. **Export pages as:** PNG (for sharing), PDF (for printing)

### Metrics Placeholders
Replace these with actual data before presentation:
- [X] scans completed → actual number
- [Y] months → timeframe
- [X%] growth rate → actual percentage
- [X] customers → actual count
- £[X] MRR → actual revenue
- [X%] conversion rate → actual percentage
- [X] affiliates → current count
- £[X] affiliate revenue → current monthly

---

## TONE & DELIVERY NOTES

### Tone
- **Professional but accessible** — not corporate jargon, not overly casual
- **Problem-first** — lead with founder's pain, not features
- **Data-backed** — use real numbers (or clear placeholders)
- **Urgency without pressure** — market timing is compelling, ask is specific
- **Founder-centric** — James's story is the credibility anchor

### Pitch Delivery (10 Minutes)
1. **Opening (1 min):** Cover slide + founder intro. "I built courses. I got burned. This is why."
2. **Problem (1.5 min):** Problem slide. Founder story + statistics. Make it personal.
3. **Solution (2 min):** Solution slide. Demo walkthrough (live or video). Features + differentiation.
4. **Market (1 min):** Who, how big, why now. Three segments, $500M TAM.
5. **Traction (1 min):** Metrics, channels, early validation. Numbers credibility.
6. **Ask (1.5 min):** £50k for 10%, use of funds, 18-month timeline. Clear and specific.
7. **Founder (1 min):** "Why me? Why now?" Founder advantage.
8. **Close (0.5 min):** Vision + CTA. "Compliance infrastructure for AI."
9. **Q&A:** Open floor.

### What Works
- Start with the problem (not the solution)
- Use founder story as credibility anchor
- Show one real screenshot/demo
- Be specific about the ask
- End with vision (not product features)

---

## FILES & REFERENCES

### Brand Assets in Repo
- Logo: `/public/redflag-logo.png` (1254×1254 PNG)
- Colors: `src/app/globals.css` (see color definitions)
- Typography: Syne (headings), Inter (body), DM Mono (data)

### Website References
- Homepage: https://www.redflagaipro.com
- Pricing: https://www.redflagaipro.com/pricing
- Product (demo): https://www.redflagaipro.com/#demo

### Founder Contact
- Email: james@redflagaipro.com
- LinkedIn: James Stokes, Red Flag AI Pro
- Website: https://www.redflagaipro.com

---

## END OF PROMPT

**To use this prompt:**
1. Copy entire document
2. Paste into Google Notebook (Colab), ChatGPT with plugins, or design generation tool
3. Follow instructions for your chosen platform
4. Fill in actual metrics
5. Export and share

**Good luck with your pitch! 🚀**
