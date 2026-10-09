# Watoto wa Nest e.V. – Website

Die Website des Watoto wa Nest e.V., Förderverein des The Nest Children's Home in Limuru, Kenia.
Reines HTML, CSS und JavaScript – kein Build-Schritt, kein Framework. Gehostet auf GitHub Pages.

## Seiten

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite: Mission, Projekt, Spendenbeträge, Team, Geschenkaktion, Newsletter |
| `spenden.html` | Online-Spende (betterplace), Überweisung mit Kopier-Buttons, Geschenkaktion, Vertrauen |
| `ueber-uns.html` | Wer wir sind, The Nest, die drei Einrichtungen, Bericht 2025 |
| `transparenz.html` | Initiative Transparente Zivilgesellschaft (10 Punkte), Satzung, Freistellungsbescheid |
| `kontakt.html` | Kontaktformular und Kontaktdaten |
| `impressum.html`, `datenschutz.html` | Rechtliches |
| `404.html` | Fehlerseite (GitHub Pages nutzt sie automatisch) |

## Sprachen

Die Seite gibt es auf Deutsch (Hauptsprache, im Wurzelverzeichnis), Englisch (`/en/`) und Kiswahili (`/sw/`).
Jede Seite verlinkt ihre Übersetzungen per `hreflang` und über den Sprachumschalter DE / EN / SW im Header.

| Deutsch | English | Kiswahili |
|---|---|---|
| `index.html` | `en/index.html` | `sw/index.html` |
| `spenden.html` | `en/donate.html` | `sw/changia.html` |
| `ueber-uns.html` | `en/about.html` | `sw/kuhusu-sisi.html` |
| `transparenz.html` | `en/transparency.html` | `sw/uwazi.html` |
| `kontakt.html` | `en/contact.html` | `sw/wasiliana.html` |
| `impressum.html` | `en/imprint.html` | `sw/impressum.html` |
| `datenschutz.html` | `en/privacy.html` | `sw/faragha.html` |

Impressum und Datenschutz sind in Englisch und Kiswahili als Service-Übersetzungen gekennzeichnet; rechtlich
verbindlich ist die deutsche Fassung. Die Kiswahili-Texte wurden maschinell erstellt und sollten von einer
muttersprachlichen Person gegengelesen werden. Bei Textänderungen bitte alle drei Sprachfassungen anpassen.

## Struktur

```
assets/css/style.css   Design-System (Farben, Typografie, Komponenten, Dark Mode)
assets/js/main.js      Navigation, Spendenbetrag-Auswahl, Kopieren, Formulare
assets/img/            Fotos (800px und 1600px), Logo, Touch-Icon
assets/fonts/          Outfit + Inter (selbst gehostet, kein Google Fonts)
assets/docs/           Satzung, Freistellungsbescheid
tools/                 Seiten-Generator und Quelltexte aller Sprachen (siehe tools/README.md)
AGENTS.md              Hintergrundwissen zum Verein und zur Website für KI-Assistenten und Entwickler
```

## Lokal ansehen

```bash
python3 -m http.server 8080
```

Dann <http://localhost:8080> öffnen.

## Veröffentlichen auf GitHub Pages

Die Seite liegt im Repository `czellmer-atl/watoto-wa-nest` und wird direkt aus dem Branch `main`
veröffentlicht (Settings → Pages → Source: „Deploy from a branch“, Branch `main`, Ordner `/`).
Jeder Push auf `main` ist nach ein bis zwei Minuten live unter
<https://watotowanest.org/>.

```bash
git push origin main
```

Eigene Domain (empfohlen, z. B. `watotowanest.de`): unter **Settings → Pages → Custom domain**
eintragen; GitHub legt dann die Datei `CNAME` an. Beim Domain-Anbieter einen `CNAME`-Eintrag
`www` → `czellmer-atl.github.io` sowie die A-Records für die Apex-Domain anlegen
(siehe [GitHub-Doku](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site)).
Danach die absolute URL (siehe unten) auf die neue Domain umstellen.

### Nach dem Deployment anpassen

- **Absolute URL**: In `sitemap.xml`, `robots.txt` und den `<link rel="canonical">` / `og:url` / JSON-LD-Einträgen
  im `<head>` jeder Seite steht `https://watotowanest.org/`. Bei einer eigenen Domain mit Suchen & Ersetzen umstellen.
- **Kontaktformular**: Standardmäßig öffnet das Formular das E-Mail-Programm des Besuchers (kein Backend nötig).
  Für ein „echtes“ Formular bei [Formspree](https://formspree.io) (kostenlos bis 50 Nachrichten/Monat) ein Formular anlegen
  und die URL in `assets/js/main.js` unter `CONFIG.CONTACT_ENDPOINT` eintragen. Dann in `datenschutz.html`
  den Abschnitt „Kontaktformular“ um Formspree ergänzen.
- **Spenden-Link**: betterplace-Projekt `98900` ist in `assets/js/main.js` (`CONFIG.BETTERPLACE_URL`) und in den
  Spenden-Buttons hinterlegt.
- **Google-Dienste (Google for Nonprofits)**: In `assets/js/main.js` unter `CONFIG.GA_MEASUREMENT_ID` die
  Google-Analytics-4-ID (`G-…`) und unter `CONFIG.GOOGLE_ADS_ID` die Google-Ads-ID (`AW-…`, für Ad Grants
  Conversion-Tracking) eintragen. Sobald eine ID gesetzt ist, erscheint beim ersten Besuch automatisch das
  Cookie-Banner; Google-Tags werden erst nach Einwilligung geladen (Consent Mode v2). Die Entscheidung liegt im
  Local Storage unter `wwn-consent`, der Link „Cookie-Einstellungen“ im Footer öffnet das Banner erneut.
  Klicks auf Spenden-Links werden als Ereignis `donate_click` gemeldet. Die Datenschutzerklärung beschreibt
  bereits Google Analytics, Google Ads, Google Forms und Gmail/Google Workspace.

## Inhalte pflegen

- **Texte nicht in den fertigen HTML-Dateien ändern**, sondern in den Quellen unter `tools/src/i18n/<sprache>/`
  (alle drei Sprachen!), danach `python3 tools/build.py` ausführen. Header und Footer liegen einmal je Sprache
  in `tools/src/i18n/<sprache>/header.html` bzw. `footer.html`. Details in `tools/README.md` und `AGENTS.md`.
- Neue Fotos: als JPEG in 800px und 1600px Breite unter `assets/img/` ablegen und mit `srcset` einbinden
  (Beispiele in `index.html`). Immer einen beschreibenden `alt`-Text angeben.
- Tätigkeitsbericht / Transparenz jährlich in `transparenz.html` aktualisieren.

## Design

- Farben aus dem Logo: Rot `#9c0a0a` (Call-to-Action), Gold `#e8b048`, Grün `#1f8f26`, Blau `#1368c8`, Himmelblau `#7ab8f5`, Braun `#3f2828`, Schwarz `#111111`. Stil: flache Facetten, harte Schlagschatten, schräge Sektionskanten.
- Schriften: Outfit (Überschriften) und Inter (Fließtext), selbst gehostet.
- Unterstützt Dark Mode (`prefers-color-scheme`), reduzierte Bewegung und ist vollständig per Tastatur bedienbar.
