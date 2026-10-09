import re, pathlib
B = pathlib.Path(__file__).parent / "src"
OUT = pathlib.Path(__file__).parent.parent
SITE_URL = "https://watotowanest.org/"
PAGES = ["index","spenden","ueber-uns","transparenz","kontakt","impressum","datenschutz"]
LANGS = {
  "de": {"dir":"", "og":"de_DE", "skip":"Zum Inhalt springen", "label":"Deutsch",
         "slugs":{"index":"index.html","spenden":"spenden.html","ueber-uns":"ueber-uns.html","transparenz":"transparenz.html","kontakt":"kontakt.html","impressum":"impressum.html","datenschutz":"datenschutz.html"}},
  "en": {"dir":"en/", "og":"en_GB", "skip":"Skip to content", "label":"English",
         "slugs":{"index":"index.html","spenden":"donate.html","ueber-uns":"about.html","transparenz":"transparency.html","kontakt":"contact.html","impressum":"imprint.html","datenschutz":"privacy.html"}},
  "sw": {"dir":"sw/", "og":"sw_KE", "skip":"Ruka hadi maudhui", "label":"Kiswahili",
         "slugs":{"index":"index.html","spenden":"changia.html","ueber-uns":"kuhusu-sisi.html","transparenz":"uwazi.html","kontakt":"wasiliana.html","impressum":"impressum.html","datenschutz":"faragha.html"}},
}
head = (B/"head.html").read_text()
DE_SLUG_RE = re.compile(r'href="(index|spenden|ueber-uns|transparenz|kontakt|impressum|datenschutz)\.html(#[^"]*)?"')

def url_for(lang, page):
    L = LANGS[lang]; slug = L["slugs"][page]
    return SITE_URL + L["dir"] + ("" if slug == "index.html" else slug)

def localize_links(html, lang, root):
    L = LANGS[lang]
    html = DE_SLUG_RE.sub(lambda m: 'href="%s%s"' % (L["slugs"][m.group(1)], m.group(2) or ""), html)
    html = re.sub(r'(href|src)="(assets/|favicon\.svg|site\.webmanifest)', lambda m: '%s="%s%s' % (m.group(1), root, m.group(2)), html)
    html = re.sub(r'srcset="([^"]*)"', lambda m: 'srcset="%s"' % m.group(1).replace("assets/", root + "assets/"), html)
    return html

GLOBE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>'
CHEVRON = '<svg class="lang-menu__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>'
CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>'
MENU_LABEL = {"de": "Sprache wählen", "en": "Choose language", "sw": "Chagua lugha"}

def lang_href(lang, code):
    L = LANGS[code]
    return ("../" if lang != "de" else "") + L["dir"] + L["slugs"][PAGE_CTX[0]]

def switch_markup(lang, page, mobile=False):
    PAGE_CTX[0] = page
    if mobile:
        items = "".join('<li><a href="%s" hreflang="%s" lang="%s"%s>%s%s</a></li>' % (
            lang_href(lang, c), c, c, ' aria-current="true"' if c == lang else "", L["label"], CHECK if c == lang else "")
            for c, L in LANGS.items())
        return '<div class="lang-list"><span class="lang-list__title">%s%s</span><ul>%s</ul></div>' % (GLOBE, MENU_LABEL[lang], items)
    items = "".join('<li><a href="%s" hreflang="%s" lang="%s"%s><span>%s</span><small>%s</small>%s</a></li>' % (
        lang_href(lang, c), c, c, ' aria-current="true"' if c == lang else "", L["label"], c.upper(), CHECK if c == lang else "")
        for c, L in LANGS.items())
    return ('<details class="lang-menu"><summary aria-label="%s">%s<span class="lang-menu__code">%s</span>%s</summary>'
            '<ul class="lang-menu__panel">%s</ul></details>') % (MENU_LABEL[lang], GLOBE, lang.upper(), CHEVRON, items)

PAGE_CTX = [None]

sitemap = []
for lang, L in LANGS.items():
    root = "../" if L["dir"] else ""
    header = (B/"i18n"/lang/"header.html").read_text()
    footer = (B/"i18n"/lang/"footer.html").read_text()
    for page in PAGES:
        src = (B/"i18n"/lang/"pages"/(page+".html")).read_text()
        m = re.match(r"<!--meta\n(.*?)-->\n", src, re.S)
        meta = {k.strip(): v.strip() for k, v in (l.split(":",1) for l in m.group(1).strip().splitlines())}
        body = src[m.end():]
        canonical = url_for(lang, page)
        alts = "\n".join('  <link rel="alternate" hreflang="%s" href="%s">' % (c, url_for(c, page)) for c in LANGS)
        alts += '\n  <link rel="alternate" hreflang="x-default" href="%s">' % url_for("de", page)
        h = (head.replace("{{lang}}", lang).replace("{{title}}", meta["title"]).replace("{{description}}", meta["description"])
                 .replace("{{canonical}}", canonical).replace("{{site_url}}", SITE_URL).replace("{{alternates}}", alts)
                 .replace("{{og_locale}}", L["og"]).replace("{{skip}}", L["skip"]).replace("{{root}}", root))
        hd = header.replace("{{langswitch}}", switch_markup(lang, page)).replace("{{langswitch_mobile}}", switch_markup(lang, page, True))
        hd = re.sub(r'(<a href="[^"]+" data-nav="%s")' % re.escape(page), r'\1 aria-current="page"', hd)
        html = h + localize_links(hd + body + footer, lang, root)
        html = re.sub(r' data-nav="[^"]*"', "", html)
        out = OUT / L["dir"] / L["slugs"][page]
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(html)
        sitemap.append((canonical, [(c, url_for(c, page)) for c in LANGS]))
    print("built", lang, len(PAGES), "pages")

# 404 (single trilingual page at root, served by GitHub Pages for any missing path)
src = (B/"pages"/"404.html").read_text()
m = re.match(r"<!--meta\n(.*?)-->\n", src, re.S)
meta = {k.strip(): v.strip() for k, v in (l.split(":",1) for l in m.group(1).strip().splitlines())}
body = src[m.end():]
h = (head.replace("{{lang}}", "de").replace("{{title}}", meta["title"]).replace("{{description}}", meta["description"])
         .replace("{{canonical}}", SITE_URL + "404.html").replace("{{site_url}}", SITE_URL).replace("{{alternates}}", "")
         .replace("{{og_locale}}", "de_DE").replace("{{skip}}", "Zum Inhalt springen").replace("{{root}}", "/"))
header = (B/"i18n/de/header.html").read_text(); footer = (B/"i18n/de/footer.html").read_text()
hd = header.replace("{{langswitch}}", switch_markup("de", "index")).replace("{{langswitch_mobile}}", switch_markup("de", "index", True))
html = h + localize_links(hd + body + footer, "de", "/")
html = re.sub(r' data-nav="[^"]*"', "", html)
(OUT/"404.html").write_text(html); print("built 404")

# sitemap with hreflang alternates
lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
for loc, alts in sitemap:
    lines.append("  <url><loc>%s</loc>" % loc)
    for c, u in alts: lines.append('    <xhtml:link rel="alternate" hreflang="%s" href="%s"/>' % (c, u))
    lines.append("  </url>")
lines.append("</urlset>")
(OUT/"sitemap.xml").write_text("\n".join(lines) + "\n"); print("sitemap", len(sitemap), "urls")
