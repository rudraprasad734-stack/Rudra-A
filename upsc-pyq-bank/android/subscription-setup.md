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
- Price: **₹299** (India). This is the only price people see, now and at renewal, so there is nothing to hide. Google converts it for other countries if you let it.
- Grace period / account hold: leave the defaults (they keep people from losing access on a failed card)
- **Do not add any offer.** The 14-day free trial is built into the app (no card needed), so Play does not need a free-trial or discount offer.

Activate the base plan.

## 3. Changing the price later
Plan: stay at ₹299 until the app has answer explanations or mock tests and some reviews, then move new subscribers to ₹399 to ₹499.
- Play Console > Subscriptions > cse_companion_yearly > Base plan > Edit price.
- Raising the price for existing subscribers: Google tells them and they must accept; those who do not accept stop at the end of the period they paid for. You can keep existing subscribers on ₹299 ("legacy price") and charge new ones the new price.
- The app needs no change: it reads the price from Google Play and shows "₹X a year (about ₹Y a month)".

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
