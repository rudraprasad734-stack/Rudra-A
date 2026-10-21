# Google Play: Data safety answers for CSE Companion

Prepared from Google's Data safety help, Firebase's Play data-disclosure page and the Google Analytics data-collection page,
plus an audit of what the app actually sends off the phone (index.html: cloud sync `localDocs()`, sign-in, optional analytics).
Google reviews the form and you are responsible for its accuracy: re-check it whenever you add a feature that sends data
(payments, ads, crash reports, new sign-in methods, new analytics events).

## Page 1: Data collection and security
| Question | Answer |
|---|---|
| Does your app collect or share any of the required user data types? | **Yes** |
| Is all of the user data collected by your app encrypted in transit? | **Yes** (HTTPS/TLS everywhere; http redirects to https) |
| Do you provide a way for users to request that their data is deleted? | **Yes**: in the app (Settings > Cloud sync > Delete my cloud copy and account), the web page https://csecompanion.in/delete-account.html and email support@csecompanion.in |
| Deletion URL field | `https://csecompanion.in/delete-account.html` |
| Independent security review / Families / UPI badges | No / No / No |

## Page 2: Data types (tick only these)
All are **collected**, **not shared**, **not processed ephemerally**, and **optional** (the app works fully without signing in or turning on statistics).

| Category > type | Why it is collected (purposes) | What it is in this app |
|---|---|---|
| Personal info > **Name** | App functionality, Account management | Google account name and the profile name, only if the user signs in |
| Personal info > **Email address** | Account management | Google account email, only if the user signs in |
| Personal info > **User IDs** | Account management | The account ID created at sign-in |
| Personal info > **Address** | App functionality | District and state typed in the profile, kept in the synced copy |
| Photos and videos > **Photos** | Account management | Profile picture link that comes with Google sign-in (the app does not use it). Declared to be safe: over-declaring is harmless, under-declaring is not |
| App activity > **App interactions** | App functionality; Analytics | Study plan, chapters done, sessions and timer history in the synced copy; and, only if the user turns statistics on, which screens and features are used |
| App activity > **Other user-generated content** | App functionality | Notes and mock-test scores in the synced copy |
| Device or other IDs > **Device or other IDs** | Analytics | Random installation ID, only if statistics are on |
| Location > **Approximate location** | Analytics | Coarse location the analytics service works out from the internet address, only if statistics are on |

**Do not tick** (not collected): precise location, financial info, health and fitness, messages, contacts, calendar, audio, files and docs,
web browsing, crash logs, diagnostics, advertising ID. (Ad personalisation and Google Signals are switched off in the code.)

**Shared: none.** Hosting, sign-in and analytics providers process data only on our behalf and under our instructions, which Google does not
count as "sharing". This stays true only if the Analytics data-sharing settings below are switched off.

## Do these before you submit (outside the code)
1. **Google Analytics data-sharing settings: switch OFF** all four (Google products and services, Benchmarking, Technical support, Account specialists).
   analytics.google.com > Admin > Account settings > Data sharing settings. Otherwise Google may use the data for its own purposes and you would have to declare it as shared.
2. **Analytics data retention: set event data retention to 2 months** (Admin > Data collection and modification > Data retention). The policy says "up to 2 months".
3. **Sign-in consent screen** (Google Cloud console for the same project > Google Auth Platform / OAuth consent screen): app name `CSE Companion`,
   user support email `support@csecompanion.in`, app home page `https://csecompanion.in`, privacy policy `https://csecompanion.in/privacy.html`,
   authorised domain `csecompanion.in`, developer contact `support@csecompanion.in`, and set the publishing status to **In production**
   (in "Testing" only the listed test users can sign in).
4. **Play Console > App content:** privacy policy URL `https://csecompanion.in/privacy.html`; target audience 18+; ads: No; data deletion URL as above.
5. **Store listing:** say plainly that the app is independent and not affiliated with UPSC or any government body.
6. Keep the form, the policy and the app in step. If you later add ads, payments, crash reports or new data, update all three.
