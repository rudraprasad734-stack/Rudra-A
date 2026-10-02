# Turning on cloud sync (Firebase) – about 15 minutes, free

The app already contains the sign-in and sync code. It stays hidden until you paste your Firebase settings into it.

## 1. Create the Firebase project
1. Go to https://console.firebase.google.com and sign in with your Google account.
2. **Add project** → name it (for example `upsc-companion`) → you can turn Google Analytics off → **Create**.

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
2. Copy the `firebaseConfig` values: `apiKey`, `authDomain`, `projectId`, `appId`.
3. Open `upsc-pyq-bank/page/index.html`, find `var FIREBASE_CONFIG`, and fill in the four values between the quotes.
   (These values are public by design. The database rules above are what keep each student's data private.)

## 5. Check it
1. Open the app → Settings → **Cloud sync → Continue with Google**.
2. Sign in on a second phone with the same Google account: your plan and progress appear.

## Before real students use it
- Add a privacy policy page (what is stored: plan, progress, study logs, name and place; how to delete it).
- The Settings card already has **Delete my cloud copy and account**. Play Store requires this for apps with accounts.
- Free-tier limits are generous (about 1 GB of data and 50,000 reads / 20,000 writes a day). Watch **Usage** in the Firebase console.
