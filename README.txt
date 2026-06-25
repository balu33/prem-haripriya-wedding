# Prem Kumar & Haripriya — Wedding Invitation Website

A single-page, cinematic Telugu wedding invitation site. Everything lives in
three files:

- `index.html` — structure & content
- `style.css` — royal maroon/gold/ivory styling & animations
- `script.js` — temple-door intro, countdown, fireworks, gallery, RSVP, petals/sparkles

No build step. Just open `index.html` in a browser, or host the folder as-is
on GitHub Pages / Netlify / Vercel (drag-and-drop works on Netlify).

---

## 0. Hosting on GitHub Pages (so the link "just works")

1. Create a new GitHub repository (e.g. `prem-haripriya-wedding`).
2. Upload these 4 files to the repo root: `index.html`, `style.css`,
   `script.js`, plus your own `music.mp3` (see section 1 below) and a
   `photos/` folder if you have images ready. **Don't put them inside a
   subfolder** — `index.html` needs to sit at the root, or in `/docs`, for
   the simplest setup.
3. Go to **Settings → Pages** in the repo.
4. Under "Build and deployment", set **Source: Deploy from a branch**,
   branch **main**, folder **/ (root)** → Save.
5. GitHub gives you a link like `https://yourusername.github.io/prem-haripriya-wedding/`
   — it takes a minute or two to go live the first time.
6. Share that exact link on WhatsApp. That's it — no servers, no build step.

**About the music playing automatically:** every modern browser blocks audio
with sound from starting completely on its own — that protection can't be
turned off site-side, by design, on every platform. What this site does
instead: the moment a guest taps **"Open the Invitation"** on the temple
doors, that tap itself starts the music (the code calls `play()` directly
inside that same click). This satisfies every major browser's rule and is
the standard, reliable way invitation sites get music to start "automatically"
in practice. If a guest's browser still blocks it for any reason, the
mute/unmute button in the top-right will gently pulse gold as a cue to tap
it once — after that it plays normally.

One more thing worth knowing: **mobile data/silent mode** — if a guest's
phone is on silent/vibrate mode (common on iPhones), the browser will
respect that and stay silent regardless of what the site does. That's an
OS-level setting, not something any website can override.

## 1. Adding background music

The site looks for a file named **`music.mp3`** in this same folder. Drop in
any classical Telugu instrumental (nadaswaram, veena, or shehnai works well)
and it will play automatically once the temple doors open, with the
mute/unmute button in the top-right corner.

**Where to get music you can legally use:**
- Your own recording or a track you've licensed.
- YouTube Audio Library (filter for "no attribution required") — download as MP3.
- Pixabay Music or Free Music Archive — check each track's specific license
  before using it on a public site, especially for an event invitation that
  will be shared widely.

Until you add `music.mp3`, the toggle button simply won't play — no errors,
no broken layout.

## 2. Adding real photos

Right now, the **Bride**, **Groom**, and **Gallery** sections use illustrated
SVG art and labeled placeholder tiles (so nothing looks broken while you
gather real photos).

To swap in real images later:
- **Gallery**: open `script.js`, find the `galleryData` array near the top
  of the gallery section, and replace each placeholder `label` entry with
  an `<img>` tag pointing to your photo (e.g. `photos/engagement-1.jpg`).
  Create a `photos/` folder next to `index.html` for your image files.
- **Bride/Groom illustrations**: in `index.html`, search for
  `bride-svg` and `groom-svg` — you can replace the whole `<svg>...</svg>`
  block with an `<img src="photos/haripriya.jpg">` or similar.
- **Venue photos**: search for `venue-photo-placeholder` in `index.html` and
  replace with real `<img>` tags.

## 3. RSVP responses

The RSVP form currently saves each response into the visitor's own browser
storage (`localStorage`) and shows a thank-you message — **no data is sent
anywhere**, since no backend was requested. This is fine for a small,
WhatsApp-shared invitation where you're tracking RSVPs by phone/WhatsApp
replies anyway.

**If you'd like responses to land in a Google Sheet later**, the cleanest
free approach is:
1. Create a Google Sheet with columns: Name, Mobile, Guests, Attending, Time.
2. In the Sheet, go to **Extensions → Apps Script**, paste a small script
   that accepts POST requests and appends a row (Google has a documented
   pattern for this called a "Sheet as a database" web app).
3. Deploy it as a Web App and copy the URL it gives you.
4. In `script.js`, inside the `rsvpForm.addEventListener('submit', ...)`
   handler, replace the `localStorage` block with a `fetch(YOUR_APPS_SCRIPT_URL, { method: 'POST', body: JSON.stringify(response) })` call.

Happy to write that integration for you once you have the Sheet and Apps
Script URL ready — just share them.

## 4. Editing the wedding date/time

In `script.js`, right at the top:

```js
const WEDDING_DATE = new Date('2026-07-04T22:34:00+05:30').getTime();
```

This drives both the small hero countdown and the big countdown section,
and triggers the fireworks animation automatically when it reaches zero.

## 5. Map links

Two "Navigate" buttons currently point to Google Maps search queries built
from the venue names/addresses you provided (since I don't have exact
lat/long pin drops). Once you have the precise Google Maps pin for the
temple, replace the `href` values in the `venue-section` in `index.html`
with the exact share link from Google Maps for a more precise pin.

## 6. Performance & compatibility notes

- Fonts and the GSAP/AOS libraries load from public CDNs — make sure your
  hosting allows outbound requests to `fonts.googleapis.com` and
  `cdnjs.cloudflare.com` (GitHub Pages and Netlify both do, by default).
- Reduced-motion is respected: visitors with "reduce motion" enabled in
  their OS settings will see a calmer, animation-light version automatically.
- Tested layout breakpoints: desktop, tablet (~800px), and mobile (~480px).
