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

## Struktur

```
assets/css/style.css   Design-System (Farben, Typografie, Komponenten, Dark Mode)
assets/js/main.js      Navigation, Spendenbetrag-Auswahl, Kopieren, Formulare
assets/img/            Fotos (800px und 1600px), Logo, Touch-Icon
assets/fonts/          Outfit + Inter (selbst gehostet, kein Google Fonts)
assets/docs/           Satzung, Freistellungsbescheid
.github/workflows/     Automatisches Deployment auf GitHub Pages
```

## Lokal ansehen

```bash
python3 -m http.server 8080
```

Dann <http://localhost:8080> öffnen.

## Veröffentlichen auf GitHub Pages

1. Repository auf GitHub anlegen (z. B. `watotowanest/watotowanest.github.io` für die Adresse
   `https://watotowanest.github.io`, oder ein beliebiger Name für `https://<user>.github.io/<repo>/`).
2. Code hochladen:
   ```bash
   git remote add origin git@github.com:<user>/<repo>.git
   git push -u origin main
   ```
3. Auf GitHub unter **Settings → Pages** als Source **GitHub Actions** wählen.
   Der Workflow in `.github/workflows/deploy.yml` veröffentlicht die Seite bei jedem Push auf `main`.
4. Eigene Domain (empfohlen, z. B. `watotowanest.de`): unter **Settings → Pages → Custom domain**
   eintragen; GitHub legt dann die Datei `CNAME` an. Beim Domain-Anbieter einen `CNAME`-Eintrag
   `www` → `<user>.github.io` sowie die A-Records für die Apex-Domain anlegen
   (siehe [GitHub-Doku](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site)).

### Nach dem Deployment anpassen

- **Absolute URL**: In `sitemap.xml`, `robots.txt` und den `<link rel="canonical">` / `og:url` / JSON-LD-Einträgen
  im `<head>` jeder Seite steht aktuell `https://czellmer-atl.github.io/watoto-wa-nest/`. Mit Suchen & Ersetzen auf die echte Adresse ändern.
- **Kontaktformular**: Standardmäßig öffnet das Formular das E-Mail-Programm des Besuchers (kein Backend nötig).
  Für ein „echtes“ Formular bei [Formspree](https://formspree.io) (kostenlos bis 50 Nachrichten/Monat) ein Formular anlegen
  und die URL in `assets/js/main.js` unter `CONFIG.CONTACT_ENDPOINT` eintragen. Dann in `datenschutz.html`
  den Abschnitt „Kontaktformular“ um Formspree ergänzen.
- **Spenden-Link**: betterplace-Projekt `98900` ist in `assets/js/main.js` (`CONFIG.BETTERPLACE_URL`) und in den
  Spenden-Buttons hinterlegt.

## Inhalte pflegen

- Texte direkt in den HTML-Dateien ändern. Header und Footer sind in jeder Seite enthalten –
  Änderungen daran bitte in allen Seiten nachziehen (Suchen & Ersetzen).
- Neue Fotos: als JPEG in 800px und 1600px Breite unter `assets/img/` ablegen und mit `srcset` einbinden
  (Beispiele in `index.html`). Immer einen beschreibenden `alt`-Text angeben.
- Tätigkeitsbericht / Transparenz jährlich in `transparenz.html` aktualisieren.

## Design

- Farben aus dem Logo: Rot `#9c0a0a` (Call-to-Action), Gold `#e8b048`, Grün `#1f8f26`, Blau `#1368c8`, Himmelblau `#7ab8f5`, Braun `#3f2828`, Schwarz `#111111`. Stil: flache Facetten, harte Schlagschatten, schräge Sektionskanten.
- Schriften: Outfit (Überschriften) und Inter (Fließtext), selbst gehostet.
- Unterstützt Dark Mode (`prefers-color-scheme`), reduzierte Bewegung und ist vollständig per Tastatur bedienbar.
