# CSE Companion — Android (TWA) build

Trusted Web Activity wrapper for https://csecompanion.in (package `in.csecompanion.app`, v1.0.4, versionCode 5).

- `app-release-bundle.aab` — upload to Google Play Console.
- `cse-companion.apk` — signed APK for sideload testing.
- `twa-manifest.json` — Bubblewrap config (no secrets; keystore path/alias only).

The release keystore and its password are NOT in this repo. Keep a backup: losing it means the app can never be updated.
`page/.well-known/assetlinks.json` must be served at https://csecompanion.in/.well-known/assetlinks.json. After enabling Play App Signing, add Play's app-signing SHA-256 (Play Console → App integrity) to its fingerprint list.

## Launch screen
`patch-splash.py` makes the native Android launch screen identical to the first frame of the web opening animation (round icon, 148 dp, on #20262D). Run it after `bubblewrap update` and before `gradlew bundleRelease`.
