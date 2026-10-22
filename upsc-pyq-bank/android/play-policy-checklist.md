# Google Play policy check for CSE Companion

Checked against Google's Play policies (Payments, Subscriptions, Metadata, Deceptive Behavior/Impersonation, Account deletion, new-account testing). Status as of build 180.

| Policy requirement | What the app does | Status |
|---|---|---|
| Subscriptions must use Google Play Billing | Digital Goods API + Play Billing in the Android app; no other payment links or webview checkout | Done |
| Don't mislead about subscriptions; disclose cost, billing frequency, auto-renewal and that a subscription is required | Settings card, paywall, Terms and the store description all say: 14 days free, yearly subscription, auto-renews until cancelled, required after the trial | Done (build 180) |
| Free trial: say how and when it converts, and how to cancel | Trial card: "nothing is charged for the trial. After that a yearly subscription is needed...". Cancel steps on paywall, Terms and the delete page | Done |
| Easy online way to cancel | "Manage subscription" opens Google Play's subscription page | Done |
| In-app price must match the Play billing screen | Price text is read from Google Play itself (intro price, then the regular price Google reports) | Done |
| Account deletion: in-app path + web page | Settings > Cloud sync > Delete my cloud copy and account; web page https://csecompanion.in/delete-account.html (names the app, email option, subscription note) | Done. Enter that URL in Data safety |
| Privacy policy + Data safety form match the app | privacy.html, play-data-safety.md | Done; you fill the form |
| Metadata: title <= 30 chars, no emoji, no ranking/price claims in title, icon or graphics; accurate description; screenshots show the real app | Title "CSE Companion" (13); graphic and icon carry no price or ranking; screenshots are real | Done |
| Impersonation: no false claim of government affiliation | Name has no "UPSC"/"official"; disclaimer in app, Terms, Privacy, listing | Done |
| Intellectual property | Questions are shown for study with a source note; see risk below | Your call |
| Target API level | Targets Android 16 (API 36) | Done |
| New personal accounts: closed test, 12+ testers opted in for 14 days, then "Apply for production" | Internal test first, then a closed test | You do this |
| Declarations: ads No, target audience 18+, government app No, news/health/finance No, content rating questionnaire | Answers in store/listing.md | You fill |

## Risks to watch
- **Past exam questions** belong to UPSC. Keep the source line, never imply endorsement, and be ready to remove an item if asked.
- **Renewal price in the app.** Google requires the renewal cost to be disclosed without extra steps, so the app shows "then <regular price> a year" (taken from Google Play, not typed in the app).
- **Notification permission.** Billing in a Trusted Web Activity needs notification delegation, which adds the notification permission. Answer the permissions/Data safety questions to match.

## Web payments and Play policy (build 185)
- Google forbids steering Play users to other payment methods from inside the app (Payments policy, section 4). The Android app from Google Play therefore shows only the Google Play subscribe flow. The Razorpay button exists only in a browser. The app counts a web-paid account as subscribed (letting people use what they bought elsewhere is allowed) but never tells Play users how or where to pay on the web. The sign-in button on the Play paywall says only "Already subscribed? Sign in with Google".
- The Play store listing must not mention website payments.
