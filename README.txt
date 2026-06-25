# Prem Kumar & Haripriya — Wedding Invitation Website

A single-page, cinematic Telugu wedding invitation site. Everything lives in:

- `index.html` — structure & content
- `style.css` — royal maroon/gold/ivory styling & animations
- `script.js` — temple-door intro, countdown, fireworks, gallery, RSVP, petals/sparkles
- `images/` — the real artwork you supplied (temple, Ganesha, family scroll,
  bride/groom, muhurtham, reception) — see section 2 below

No build step. Just open `index.html` in a browser, or host the folder as-is
on GitHub Pages / Netlify / Vercel (drag-and-drop works on Netlify).

---

## 1. Hosting on GitHub Pages (so the link "just works")

1. Create a new GitHub repository (e.g. `prem-haripriya-wedding`).
2. Upload everything to the repo root: `index.html`, `style.css`,
   `script.js`, the whole `images/` folder, plus your own `music.mp3`
   (see section 4 below). **Don't put `index.html` inside a subfolder** —
   it needs to sit at the root, or in `/docs`, for the simplest setup.
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

One more thing worth knowing: **mobile silent mode** — if a guest's phone is
on silent/vibrate (common on iPhones), the browser respects that and stays
silent regardless of what the site does. That's an OS-level setting, not
something any website can override.

## 2. Photos — already integrated

Real artwork is already built into the site, in the `images/` folder:

- **Hero & temple gate**: Lord Ganesha blessing artwork — `ganesha-gate.jpg`
- **Family section**: the Devanaboina family invitation scroll — `family-scroll.jpg`
- **Bride section**: Haripriya in bridal attire, walking toward the temple — `bride-bg.jpg`
- **Groom section**: Prem Kumar in groom's attire, walking toward the temple — `groom-bg.jpg`
- **Muhurtham card**: the temple + elephant + muhurtham details artwork — `muhurtham-temple.jpg`
- **Lunch Reception card**: the Vindu Bhojanam food spread artwork — `reception-bhojanam.jpg`

These are the generated images you supplied, with no real faces shown (the
bride and groom appear from behind only) — nobody's actual photo is exposed.
When real ceremony photos are ready later, you can swap any of these: either
keep the exact same filename (so the existing code keeps working untouched),
or update the matching `src="images/...">` path in `index.html`.

The **Gallery** masonry section still uses placeholder tiles — see section 3.

## 3. Adding gallery photos (masonry section)

Open `script.js`, find the `galleryData` array, and set
`img: 'images/your-photo.jpg'` on any item — that automatically swaps the
placeholder tile for your real photo, no other code changes needed. Put your
image files in the `images/` folder next to `index.html`.

For **Venue photos**: search for `venue-photo-placeholder` in `index.html`
and replace with real `<img>` tags pointing into `images/`.

## 4. Adding background music

The site looks for a file named **`music.mp3`** in this same folder. Drop in
any classical Telugu instrumental (nadaswaram, veena, or shehnai works well)
and it will play the instant a guest taps "Open the Invitation."

**Where to get music you can legally use:**
- Your own recording, or a track you've licensed.
- YouTube Audio Library (filter for "no attribution required") — download as MP3.
- Pixabay Music or Free Music Archive — check each track's specific license
  before using it on a public site shared widely.

Until you add `music.mp3`, the toggle button simply won't play — no errors,
no broken layout.

## 5. RSVP responses

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
   handler, replace the `localStorage` block with a
   `fetch(YOUR_APPS_SCRIPT_URL, { method: 'POST', body: JSON.stringify(response) })` call.

Happy to write that integration for you once you have the Sheet and Apps
Script URL ready — just share them.

## 6. Editing the wedding date/time

In `script.js`, right at the top:

```js
const WEDDING_DATE = new Date('2026-07-04T22:34:00+05:30').getTime();
```

This drives both the small hero countdown and the big countdown section,
and triggers the fireworks animation automatically when it reaches zero.

## 7. Map links

Two "Navigate" buttons currently point to Google Maps search queries built
from the venue names/addresses you provided (since exact lat/long pins
weren't available). Once you have the precise Google Maps pin for the
temple, replace the `href` values in the `venue-section` in `index.html`
with the exact share link from Google Maps for a more precise pin.

## 8. Performance & compatibility notes

- All images are compressed JPEGs (~2.1 MB total for 6 images) — fast even
  on mobile data.
- Fonts and the GSAP/AOS libraries load from public CDNs — make sure your
  hosting allows outbound requests to `fonts.googleapis.com` and
  `cdnjs.cloudflare.com` (GitHub Pages and Netlify both do, by default).
- Reduced-motion is respected: visitors with "reduce motion" enabled in
  their OS settings see a calmer, animation-light version automatically.
- Tested layout breakpoints: desktop, tablet (~800px), and mobile (~480px).
