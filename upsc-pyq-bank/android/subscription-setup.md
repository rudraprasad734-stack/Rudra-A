# Subscription setup (Google Play Console)

The app is already coded for this. These are the settings you create once in Play Console so it works.
Do them after the app is uploaded to a testing track (Play only lets you create subscriptions once an app with billing permission is uploaded).

## 1. Merchant account
Play Console > Setup > Payments profile. Add your bank account and tax details so Google can pay you.

## 2. Create the subscription
Play Console > Monetize with Play > Products > Subscriptions > Create subscription
- Product ID: `cse_companion_yearly`  (must be exactly this, the app looks for it)
- Name: CSE Companion yearly

### Base plan
- Base plan ID: `yearly`
- Billing period: Yearly, Auto-renewing
- Price: the normal yearly price from the second year (start with 399, change later)
- Grace period / account hold: leave the defaults (they keep people from losing access on a failed card)

### Offer (the first-year price)
Base plan > Add offer
- Offer ID: `first-year`
- Eligibility: **New customer acquisition** (never subscribed before)
- Phase: **Single payment** (or "Discounted recurring payment" for 1 cycle), price **199**, duration 1 year
- No free-trial phase here: the 14-day free trial is built into the app, so people do not need to enter a card for it.

Activate the base plan and the offer.

## 3. Price later
Raising the price for the second year onward: change the base plan price (Play asks how to treat existing subscribers; choose to apply to new subscribers and to existing ones at their next renewal with Google's notice).

## 4. Test it without paying
Play Console > Settings > License testing: add the Gmail addresses of your testers. They install from the internal-testing link and Google shows a test payment sheet that charges nothing, with renewals sped up (a yearly plan renews in about 30 minutes in tests, up to 6 times).
Check: trial banner in Settings, the paywall after 14 days (to test quickly: Settings > Apps > CSE Companion > Clear data does NOT reset the trial for a signed-in account, since it is stored with your data), subscribe, cancel, restore.

## 5. What the app does
- Day 0 = first time the app opens. Trial is the same on all of a person's phones when signed in.
- After 14 days the app shows a full-screen "Subscribe" page. Backup download, Terms, Privacy and Delete-my-data stay reachable.
- The app asks Google Play on every open (and every 6 hours) what the person owns, and remembers the answer for up to 14 days for offline use.
- Purchases are acknowledged by the app (Google refunds un-acknowledged purchases after 3 days).
- On the website and iPhone nothing is locked (billing exists only inside the Android app).

## 6. Known limits (honest list)
- Someone who never signs in and reinstalls the app gets a new 14 days. Signing in with Google (which the app encourages) prevents this.
- There is no server checking purchases, so a rooted phone could fake being subscribed. Fine for now; a server check can be added later with Google's Play Developer API.
- Play Data safety: add "Purchase history" is NOT collected by us (Google handles payments); see play-data-safety.md.
