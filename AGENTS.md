# AGENTS.md – Watoto wa Nest e.V. website

Guidance for AI agents and developers working on this repository. Read this first.

## Who this is for

**Watoto wa Nest e.V.** ("children of the Nest" in Swahili) is a small German charity
(eingetragener Verein, founded 2019, seat: Trostberger Str. 35, 83342 Tacherting, Bavaria;
register: Amtsgericht Traunstein VR 202022; board: Christian Berndlmaier). It is the German
support association (Förderverein) of **The Nest Children's Home** in Limuru, Kenya, about
20 km north-west of Nairobi. Members are volunteers, many of them former volunteers at The Nest.
Admin costs are under 1 %; all donations go to The Nest.

The Nest (founded early 1990s, run by a Kenyan team, thenesthome.org) has three facilities:

1. **Kinderheim The Nest** – the original children's home, since 1997, **up to 100 children** aged 3–18.
2. **Nest Baby Village** – baby home for abandoned babies, opened March 2014.
3. **Halfway House** – reunites mothers released from prison with their children, run by social workers.

**Number conventions (important, they differ on purpose):**
- "**über 140 Kinder** / over 140 children" = the whole project across all three houses (hero text, stat box).
- "**bis zu 100 Kinder** / up to 100 children" = the Kinderheim house alone (project card, about-page facility list).
Do not "harmonise" these two numbers.

Why children end up there: mothers are imprisoned for poverty-related offences and their children
would otherwise end up on the street; abandoned children are also taken in.

**Purpose of the website:** look professional and convert visitors into donors. The donate path is the
priority on every page.

## Contact and money

- Email: watotowanest@gmail.com (a Workspace address on watotowanest.org is planned, see Open items)
- Phone: +49 176 93178582 · Instagram @watotowanest_ · Facebook "The Nest Home"
- Bank: Watoto wa Nest e.V., IBAN DE13 7016 9568 0000 7559 66, BIC GENODEF1TAE
- Online donations: betterplace.org project 98900 (`CONFIG.BETTERPLACE_URL` in `assets/js/main.js`)
- Donation amounts used site-wide (monthly): €10 school supplies, €40 food, €60 baby food,
  €300 house mother salary, €600 nurse salary. The "Geschenkaktion" lets donors transfer one of these
  with reference "Geschenk-Urkunde; <email>" and receive a printable gift certificate by email.
- Transparency page follows the Initiative Transparente Zivilgesellschaft (10 points). PDFs in
  `assets/docs/` (Satzung, Freistellungsbescheid). Update the annual report there each year.

## Tech overview

Plain HTML, CSS and JavaScript, no framework, no package manager. Hosted on **GitHub Pages**
from the `main` branch of `czellmer-atl/watoto-wa-nest`, custom domain **https://watotowanest.org/**
(DNS at Cloudflare, proxy OFF, HTTPS enforced). Every push to `main` is live in 1–2 minutes.

There is **no Actions workflow** on purpose: the `gh` token on the maintainer's machine lacks the
`workflow` scope, so pushing `.github/workflows/*` is rejected. Branch-based Pages needs none.

### Pages are generated – edit sources, not output

All 22 HTML files (root = German, `en/`, `sw/`) are produced by `tools/build.py` from
`tools/src/`. See `tools/README.md`. Workflow for any content change:

1. Edit `tools/src/i18n/<lang>/pages/<page>.html` (and the other two languages!).
2. Run `python3 tools/build.py`.
3. Verify (see below), commit the sources **and** the generated files, push.

Page IDs and slugs:

| ID | de (root) | en/ | sw/ |
|---|---|---|---|
| index | index.html | index.html | index.html |
| spenden | spenden.html | donate.html | changia.html |
| ueber-uns | ueber-uns.html | about.html | kuhusu-sisi.html |
| transparenz | transparenz.html | transparency.html | uwazi.html |
| kontakt | kontakt.html | contact.html | wasiliana.html |
| impressum | impressum.html | imprint.html | impressum.html |
| datenschutz | datenschutz.html | privacy.html | faragha.html |

In sources always link with the German file names and un-prefixed asset paths; the generator
localises links, prefixes `../` for subfolders, sets `lang`, canonical, hreflang and the sitemap.
`404.html` is one trilingual page (GitHub Pages serves a single 404).

### Languages

German is the primary language and legally binding. English and Kiswahili are full translations;
Impressum and Datenschutz carry a "courtesy translation" note. **The Kiswahili copy was machine-written
and still needs a native review.** The header has a language menu (globe button, `<details>`), the
mobile menu a language list. JS strings are localised via `STRINGS[LANG]` in `assets/js/main.js`.

### Design system ("Facet", v2)

Derived from the official low-poly bird logo (`assets/img/logo-bird.svg`, one bird only, never the
logo lettering). Palette: red `#9c0a0a` (CTA), gold `#e8b048`, green `#1f8f26`, blue `#1368c8`,
sky `#7ab8f5`, brown `#3f2828`, black `#111`. Flat facets, 2px black outlines, hard offset shadows,
angled section edges via `clip-path`. Fonts: Outfit (display) and Inter (body), **self-hosted** in
`assets/fonts/` – never add Google Fonts (the privacy policy promises none). Dark mode via tokens.
Scroll reveal is CSS scroll-driven (`animation-timeline: view()`), no JS.

### JavaScript (`assets/js/main.js`)

Mobile nav, language-menu close, copy-to-clipboard, donation amount picker (updates betterplace link
and transfer reference), sticky mobile donate bar, contact and newsletter forms (open the visitor's
mail client via `mailto:`; optional `CONFIG.CONTACT_ENDPOINT` for Formspree), cookie consent with
Google Consent Mode v2. Google tags load **only** after consent and only when
`CONFIG.GA_MEASUREMENT_ID` / `CONFIG.GOOGLE_ADS_ID` are set; both are empty until the Google for
Nonprofits account exists. Donate clicks fire a `donate_click` event.

### Privacy policy

Written for GDPR/TDDDG and already covers GitHub Pages hosting, the consent banner, Google Analytics 4,
Google Ads/Ad Grants, Google Forms, Gmail/Google Workspace, betterplace, bank transfers, Instagram
and Facebook links. Keep it truthful: if a new service is added, add a section in all three languages.
It is a careful draft, not legal advice.

## Verification routine before pushing

```bash
python3 tools/build.py
```
Then check: no mismatched tags, every internal link/asset resolves (including `srcset`), each file's
`<html lang>` matches its folder, no German leftovers in `en/` and `sw/`. A quick local preview:
`python3 -m http.server 8080` (config also in `.claude/launch.json`). After pushing, the live site
should return 200 for all pages; a crawl of external links was last done 2026-10-09 (all OK).

Commit messages are in German, short subject line, with the Claude co-author trailer.

## Open items / roadmap

- Google for Nonprofits application via Stifter-helfen.de (in progress by the user). Afterwards:
  enter GA4 and Ads IDs, accept Google's data processing terms, set up Ad Grants conversion
  (`donate_click`), activate Google Workspace and create `info@watotowanest.org`
  (then replace `watotowanest@gmail.com` site-wide: footer, contact, imprint, privacy, JS config),
  add MX/SPF/DKIM/DMARC at Cloudflare.
- Optional Formspree endpoint for the contact form (then extend the privacy policy).
- Native review of the Kiswahili texts.
- Yearly: update the Transparenz page (annual report, funds), check external links.
- Old Wix site (watotowanest.wixsite.com/website) should eventually redirect here.
