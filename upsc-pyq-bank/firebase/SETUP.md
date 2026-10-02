# Turning on cloud sync (Firebase) – about 15 minutes, free

The app already contains the sign-in and sync code. It stays hidden until you paste your Firebase settings into it.

## 1. Create the Firebase project
1. Go to https://console.firebase.google.com and sign in with your Google account.
2. **Add project** → name it (for example `upsc-companion`) → **leave Google Analytics ON** → accept the default Analytics account → **Create**.

## 2. Turn on Google sign-in
1. **Build → Authentication → Get started → Sign-in method → Google → Enable**.
2. Choose a support email → **Save**.
3. **Authentication → Settings → Authorized domains → Add domain** and add the website the app is served from, for example `rudraprasad734-stack.github.io` (and your own domain later). `localhost` is already there.

## 3. Create the database
1. **Build → Firestore Database → Create database**.
2. Pick a location close to your students (for India: `asia-south1` Mumbai). Choose **production mode**.
3. Open the **Rules** tab, delete what is there, paste the contents of `firestore.rules` (in this folder) → **Publish**.

## 4. Register the web app and copy the settings
1. Project settings (gear icon) → **Your apps → </> (Web)** → name it → **Register app** (skip hosting).
2. Copy the `firebaseConfig` values: `apiKey`, `authDomain`, `projectId`, `appId`, `measurementId` (it starts with `G-`).
3. Open `upsc-pyq-bank/page/index.html`, find `var FIREBASE_CONFIG`, and fill in the five values between the quotes.
   (These values are public by design. The database rules above are what keep each student's data private.)

## 5. Check it
1. Open the app → Settings → **Cloud sync → Continue with Google**.
2. Sign in on a second phone with the same Google account: your plan and progress appear.

## Before real students use it
- Add a privacy policy page (what is stored: plan, progress, study logs, name and place; how to delete it).
- The Settings card already has **Delete my cloud copy and account**. Play Store requires this for apps with accounts.
- Free-tier limits are generous (about 1 GB of data and 50,000 reads / 20,000 writes a day). Watch **Usage** in the Firebase console.

## Analytics settings (must match the privacy policy)
The privacy policy says these Analytics data-sharing settings are **ON**: Benchmarking, Technical support, Account specialists. It says "share with Google to improve Google products and services" is **OFF**. If you change any of them later, update `privacy.html` section 4 too (Admin → Data collection and modification → Data sharing settings).
Do this once, in the Firebase console, so what you collect matches what the policy promises.
1. **Project settings → Integrations → Google Analytics → Manage** (or open analytics.google.com for the project).
2. **Admin → Data collection and modification → Data retention**: set **Event data retention = 2 months**.
3. **Admin → Data collection and modification → Data collection**: turn **Google signals data collection OFF**.
4. **Admin → Data collection and modification → Data collection**: make sure **Advertising features / ad personalisation are OFF**.
5. Do not add user IDs, names or emails as Analytics properties.
The app only sends analytics after a person taps "Yes, share", and only a short fixed list of events (see `trackEvent` in `index.html`).
