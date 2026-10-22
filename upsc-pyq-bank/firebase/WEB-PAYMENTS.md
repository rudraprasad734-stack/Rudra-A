# Web payments with Razorpay: setup

One payment on the website gives 12 months, saved against the person's Google account. The same account is unlocked in the Android app too (no second payment). Everything below can be done from a phone browser. Nothing here is live until you finish step 6, and the website stays free until the switch in step 7 is turned on.

How it fits together: the website asks our payment server for an order, the person pays in Razorpay's window, the server checks the payment is real, then writes a "paid until" date into the database (`entitlements/{uid}`). Only the server can write that date (database rules). The app reads it.

## 1. Razorpay account
1. Sign up at razorpay.com and finish KYC (PAN, bank account, business or personal details, website https://csecompanion.in). Razorpay checks the website for Terms, Privacy, Refund policy and a contact email: these exist at /terms.html, /privacy.html, /refund.html and support@csecompanion.in. They may also ask for a phone number or address; that is between you and Razorpay, it does not have to go on the site.
2. In the dashboard turn on **Test mode** (top of the page). Go to **Account & Settings > API keys > Generate test key**. Copy the **Key Id** and the **Key Secret** (the secret is shown once).
3. Pick any long random text as a **webhook secret** (for example 40 random letters and numbers). Keep it for step 5.

## 2. Firebase project: Blaze plan
Firebase console > project upsc-companion-3adb3 > the plan name at the bottom left > **Upgrade** to **Blaze (pay as you go)**. It needs a card. Usage at this scale is normally within the free amounts, so the bill is close to zero. Set a budget alert (Billing > Budgets) at ₹500 for peace of mind.

## 3. A key so GitHub can deploy for you
1. Firebase console > Project settings (gear) > **Service accounts** > **Generate new private key**. A file downloads; open it as text and copy everything.
2. Google Cloud console (console.cloud.google.com) > IAM & Admin > IAM. Find the `firebase-adminsdk-...` account and **Edit** it. Add these roles: *Cloud Functions Admin*, *Service Account User*, *Secret Manager Admin*, *Cloud Build Editor*, *Artifact Registry Administrator*, *Firebase Rules Admin*, *Cloud Datastore Index Admin* (if offered). If a deploy later complains about a missing permission, add the one it names.

## 4. Put the secrets in GitHub
GitHub > the repository > Settings > Secrets and variables > Actions > **New repository secret**. Add four:
| Name | Value |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | the whole text of the key file from step 3 |
| `RAZORPAY_KEY_ID` | the test Key Id (starts `rzp_test_`) |
| `RAZORPAY_KEY_SECRET` | the test Key Secret |
| `RAZORPAY_WEBHOOK_SECRET` | the random text from step 1.3 |

## 5. Deploy and connect Razorpay
1. GitHub > **Actions** > **Deploy payment server** > **Run workflow**. It runs the tests, stores the secrets safely in Google, deploys the server and the new database rules. It takes a few minutes. If it fails, open the run and send me the red lines.
2. Razorpay dashboard > Account & Settings > **Webhooks** > Add:
   - URL: `https://asia-south1-upsc-companion-3adb3.cloudfunctions.net/razorpayWebhook`
   - Secret: the same random text
   - Events: `payment.captured`, `order.paid`, `refund.processed`
   The webhook is the safety net: it adds the year even if the person closes the browser right after paying, and it takes the year back when you refund.

## 6. Test, then go live
1. Open https://csecompanion.in, sign in, use a phone or browser whose 14-day trial is over (or ask me to shorten it for a test account). Tap **Pay and continue** and pay with Razorpay's test card or test UPI (listed in their docs under "Test cards / UPI"). The app should unlock; check Firestore > `entitlements` for the new paid-until date.
2. Test a refund in the Razorpay dashboard: the year should disappear after a minute.
3. Go live: in Razorpay switch off Test mode, generate **live** keys, update the three Razorpay secrets in GitHub, re-run **Deploy payment server**, and add the same webhook under **Live mode**.

## Everyday jobs
- **Give someone a free year** (a friend, a prize): Firebase console > Firestore > `entitlements` > add a document whose id is their user id (shown under Authentication > Users) with a number field `paidUntil` = the end date in milliseconds (example for 1 Jan 2028: 1830297600000).
- **Refund:** Razorpay dashboard > Payments > the payment > Refund. The webhook removes the year.
- **Change the price:** edit `PRICE_PAISE` (29900 = ₹299) in `functions/lib.js` (default) and the fallback text in the app, then re-run the deploy. Old payments are unaffected.

## Rules to keep
- The website payment must never appear inside the Android app from Google Play (Google forbids steering to other payments). The app already hides it there.
- Keep the Key Secret and webhook secret only in GitHub secrets, never in code or chat.

## 7. The switch (website stays free until you flip it)
In `upsc-pyq-bank/page/index.html` the line `var WEB_PAY_ON = ... : false;` keeps the website free for everyone (nothing locked, no payment button). After steps 1 to 6 work in live mode, tell me "switch web payments on" and I will set it to `true`, bump the version and merge it. The Android app from Google Play is not affected by this switch.
