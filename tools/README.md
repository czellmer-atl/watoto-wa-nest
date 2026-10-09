# Seiten-Generator

Alle HTML-Seiten im Wurzelverzeichnis sowie unter `en/` und `sw/` werden aus diesem Ordner erzeugt.
**Nicht die fertigen HTML-Dateien bearbeiten**, sondern die Quellen hier, dann neu bauen:

```bash
python3 tools/build.py
```

- `src/head.html` – gemeinsamer `<head>` mit Platzhaltern (Titel, Beschreibung, Canonical, hreflang, Root-Pfad)
- `src/i18n/<de|en|sw>/header.html`, `footer.html` – Kopf- und Fußbereich je Sprache (inkl. Cookie-Banner)
- `src/i18n/<de|en|sw>/pages/*.html` – Seiteninhalte je Sprache; jede Datei beginnt mit einem `<!--meta … -->`-Block
  (`title`, `description`, `nav` = Seiten-ID für den aktiven Menüpunkt)
- `src/pages/404.html` – dreisprachige Fehlerseite

Konventionen in den Quellen: interne Links immer mit den **deutschen** Dateinamen schreiben
(`spenden.html`, `ueber-uns.html`, …) und Assets ohne Präfix (`assets/img/…`). Der Generator ersetzt
Dateinamen und Pfade je Sprache (siehe `LANGS` in `build.py`) und schreibt `sitemap.xml` mit hreflang.
