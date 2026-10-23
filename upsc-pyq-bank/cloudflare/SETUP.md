# Payment server on Cloudflare (free, no card)

This replaces the Firebase Cloud Functions server, which needs the Blaze plan and a card. Same logic (`../firebase/functions/lib.js`), same database (Firestore stays on the free Spark plan), same Razorpay flow. One payment = 365 days, one account unlocks web and app.

## 1. Cloudflare account (2 minutes)
1. dash.cloudflare.com > Sign up with your email. No card is asked on the free plan.
2. Left menu > **Workers & Pages**. The first time it asks you to pick a free **workers.dev subdomain** (a name like `rudra-pay`). Pick one.
3. Account ID: Workers & Pages page, right side, **Account ID** > copy.
4. API token: top right profile > **My Profile > API Tokens > Create Token > "Edit Cloudflare Workers" template > Continue > Create**. Copy the token (shown once).

## 2. Firebase key (no Blaze needed)
Firebase console > Project settings (gear) > **Service accounts > Generate new private key**. A file downloads. Open it as text and copy everything.

## 3. GitHub secrets
Repository > Settings > Secrets and variables > Actions > New repository secret. Six in all:
| Name | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | token from 1.4 |
| `CLOUDFLARE_ACCOUNT_ID` | id from 1.3 |
| `FIREBASE_SERVICE_ACCOUNT` | whole text of the key file from step 2 |
| `RAZORPAY_KEY_ID` | `rzp_test_...` Key Id |
| `RAZORPAY_KEY_SECRET` | the test Key Secret |
| `RAZORPAY_WEBHOOK_SECRET` | any long random text you make up (also used in step 5) |

## 4. Deploy
Actions > **Deploy payment server** > Run workflow. At the end the log prints `Server address: https://cse-companion-pay.<yourname>.workers.dev`. Send me that address (it is public, not a secret) and I put it into the website.

## 5. Razorpay webhook
Razorpay dashboard > Account & Settings > Webhooks > Add:
- URL: `<server address>/razorpayWebhook`
- Secret: the same random text as `RAZORPAY_WEBHOOK_SECRET`
- Events: `payment.captured`, `order.paid`, `refund.processed`

Then continue with steps 6 and 7 of `../firebase/WEB-PAYMENTS.md` (test payment, go live, the on/off switch).

## Free-plan limits
Workers free plan allows 100,000 requests a day. A payment is about 3 requests, so this is far more than needed.
