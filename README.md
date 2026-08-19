# Subscription Radar

A recurring-charge detector built *into* a banking app, answering a question your bank's own transaction feed never does — even though third-party apps already do it well: **"which of my subscriptions crept up in price, and which ones did I forget I'm paying for?"**

[Live demo →](#) <!-- TODO: replace with deployed URL -->

---

## The problem

A standard bank transaction feed shows you *that* Spotify charged you $12.99, not that it was $11.99 three months ago — or that HelloFresh bills weekly, not monthly, which makes the real spend more than 4x what it looks like at a glance. Subscription creep is a *pattern* problem hiding inside a feed designed to show single transactions. Spotting it means looking across a merchant's entire history, not any one line item.

This isn't just a hunch: a [2022 C+R Research survey of 1,000 consumers](https://www.cnbc.com/2022/06/02/consumers-spend-133-more-monthly-on-subscriptions-than-they-realize.html) found people underestimate their subscription spending by $133/month on average ($86 guessed vs. $219 actual), and 42% had forgotten they were still being charged for a subscription they no longer use.

**This isn't whitespace — it's a "who owns it" problem.** [Rocket Money](https://www.rocketmoney.com/feature/manage-subscriptions) and [Copilot Money](https://www.copilot.money/) already do automatic subscription detection well, including price-increase alerts and (for Rocket Money) cancellation on your behalf. Chase itself has a reactive layer too — [Stored Cards / recurring payment alerts](https://www.chase.com/personal/credit-cards/education/basics/subscription-fatigue) that can flag when a charge "differs from its usual amount," but it's opt-in, largely manual to review, and shows no evidence of cadence-aware detection (a biweekly charge isn't automatically reframed as its true monthly cost).

The gap isn't "nobody solves this," it's that solving it well currently means **leaving your bank app and linking your accounts into a third party**. That has a real trust cost, not just a friction cost: a [2022 CFPB complaint filed by EPIC and NYU's Tech Law & Policy Clinic](https://epic.org/documents/epic-cfpb-complaint-rocket-money/) alleges Rocket Money's own privacy policy admits it has "shared personal information with third parties or Affiliates, in exchange for valuable consideration" — despite marketing itself as a service that will "never sell your data." Whether or not the allegation holds up, it makes the point: linking your transaction history into a separate company means trusting that company's business model, not just its UI. A bank already has your data and a direct regulatory relationship with you — it doesn't need a side business built on monetizing it.

Subscription Radar is a demo of what that same detection intelligence looks like built natively into the bank's own app instead, where the transaction data already lives — no new account, no new data-sharing relationship, just a first-class destination inside the app you already use. The UI is modeled closely on Chase's actual mobile app (colors and layout sampled directly from real screenshots, not guessed) specifically to make that pitch concrete rather than hypothetical.

## What it does

- Detects recurring merchants from raw transaction history — no "is this a subscription" flag in the data, it's inferred from behavior
- Correctly identifies **non-monthly** cadences (weekly, biweekly, quarterly), not just "same day each month"
- Flags **any** price increase between billing cycles, no minimum threshold
- Walks the same information architecture a real bank app would: an accounts list → an account's transaction history → a transaction detail view → a dedicated "Plan & track" hub for recurring charges, reachable from anywhere via bottom nav, not buried behind one button

## Product decisions worth knowing about

The interesting part of this project isn't the CRUD — it's the judgment calls in an ambiguous problem space. A few worth calling out:

- **I explicitly cut a feature I had already built.** An early version flagged subscriptions under $15/mo as "easy to forget." I killed it: deciding *for* the user which of their own charges they're allowed to forget is paternalistic, and it's not a bank's job to make that call. The app now surfaces facts (amount, cadence, price changes) and leaves judgment to the user. That's a scope boundary, not a missing feature.
- **Frequency detection uses tolerance windows, not exact-date matching.** Billing dates drift ±1–4 days from weekends, processing delays, and month length (28–31 days). The detector buckets day-gaps into weekly/biweekly/monthly/quarterly ranges chosen so no single gap can satisfy two buckets — tight enough to reject noise, loose enough to survive real-world drift.
- **False-positive suppression was the hard part, not pattern matching.** Recurring-*looking* non-subscriptions exist — a Trader Joe's run every ~30 days is not a subscription, it's a habit, and its amount varies. The detector collapses each merchant's amount history into "runs" of equal value; if a merchant's price bounces around instead of holding flat (or making a single clean jump), it's rejected regardless of how regular the interval looks. This is the difference between a demo that looks smart on curated data and one that survives messy real data.
- **That said, a known gap I'm leaving for v2, not the MVP:** a biweekly haircut at the same barbershop, same price every time, would currently get flagged as a subscription — and there's no signal in the transaction data (id, date, merchant, amount, category) to tell it apart from a real one. Trader Joe's gets rejected because the *amount* varies; a recurring appointment with a flat price doesn't give the detector anything to reject it on. Fixing this needs a different kind of signal than pattern-matching can provide — which is exactly what the feedback loop in "What's next" is for.
- **Spend is normalized to a monthly-equivalent for the total.** A weekly $71.94 charge isn't "$71.94/mo" — it's closer to $308/mo. Getting this wrong would make the headline number actively misleading.
- **Navigation is deliberately gated, not flat.** Early drafts put everything on one page. I restructured it into the same click-through hierarchy a real bank app uses (dashboard → account → detail) because in fintech UX, how much you reveal at each step is itself a trust decision, not just an IA nicety.

## What I'd measure if this shipped

- **Detection precision/recall** against a labeled set — false positives (flagging a grocery run) erode trust fast; false negatives quietly defeat the point
- **Weekly active usage of the "Plan & track" hub** — is this a feature people check, or a one-time curiosity?
- **Action rate on price-increase flags** — does surfacing "Spotify went up $1" actually change behavior (cancel, downgrade, no action)? That's the real value metric, not detection accuracy alone
- **False-positive report rate** — a "this isn't a subscription" dismiss action would double as both a UX safety valve and a training signal

## What's next

- Handle cancellations, free-trial-to-paid conversions, and annual billing (currently: weekly/biweekly/monthly/quarterly only)
- Aggregate recurring charges across multiple accounts, not just one card
- A feedback loop ("not a subscription") that fixes cases like the biweekly-haircut problem above and improves detection over time instead of shipping static heuristics forever
- Real data via Plaid-style account linking instead of a static JSON fixture
- One-tap cancellation requests — Rocket Money charges a premium tier for this; a bank already has the merchant relationship and dispute infrastructure to plausibly offer it natively instead

## Tech stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS · zero backend — detection runs server-side, as part of rendering each page (no `"use client"` on any page component), against a static transaction fixture. No database or API needed for the demo to be fully functional.

## Running it locally

```bash
git clone https://github.com/hktran2004/subscription-radar.git
cd subscription-radar
npm install
npm run dev
```

Open `http://localhost:3000`.
