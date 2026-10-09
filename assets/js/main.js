/* Watoto wa Nest e.V. — site behaviour (no dependencies) */
(function () {
  "use strict";

  /* ---------- Configuration ----------
     CONTACT_ENDPOINT: optional form backend (e.g. https://formspree.io/f/xxxx).
     Leave empty to fall back to the visitor's e-mail client (mailto:). */
  var CONFIG = {
    CONTACT_ENDPOINT: "",
    CONTACT_EMAIL: "watotowanest@gmail.com",
    BETTERPLACE_URL: "https://www.betterplace.org/de/projects/98900",
    /* Google-Dienste: IDs eintragen, sobald das Google-for-Nonprofits-Konto steht.
       Solange beide leer sind, erscheint kein Cookie-Banner und es wird nichts von Google geladen. */
    GA_MEASUREMENT_ID: "",   /* z. B. "G-XXXXXXXXXX" (Google Analytics 4) */
    GOOGLE_ADS_ID: ""        /* z. B. "AW-XXXXXXXXX" (Google Ads / Ad Grants Conversion-Tracking) */
  };

  document.documentElement.classList.remove("no-js");

  /* ---------- Header: shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  if (toggle && mobileNav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      mobileNav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
    window.matchMedia("(min-width: 64rem)").addEventListener("change", function (e) { if (e.matches) setOpen(false); });
  }

  /* Scroll reveal is handled in CSS via scroll-driven animations (see style.css). */

  /* ---------- Copy to clipboard ---------- */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    var original = btn.innerHTML;
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      var done = function () {
        btn.classList.add("is-copied");
        btn.innerHTML = "✓ Kopiert";
        setTimeout(function () { btn.classList.remove("is-copied"); btn.innerHTML = original; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text); done(); });
      } else { fallbackCopy(text); done(); }
    });
  });
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "absolute"; ta.style.left = "-9999px";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }

  /* ---------- Donation amount picker ---------- */
  var amountGroup = document.querySelector("[data-amounts]");
  if (amountGroup) {
    var buttons = amountGroup.querySelectorAll(".amount");
    var out = document.querySelector("[data-amount-out]");
    var link = document.querySelector("[data-amount-link]");
    var purpose = document.querySelector("[data-amount-purpose]");
    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        buttons.forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        var value = b.getAttribute("data-value");
        var label = b.getAttribute("data-label");
        if (out) out.textContent = value + " €";
        if (purpose) purpose.textContent = "Spende " + label;
        if (link) link.href = CONFIG.BETTERPLACE_URL + "?amount=" + value;
      });
    });
  }

  /* ---------- Sticky mobile donate bar ---------- */
  var sticky = document.querySelector(".sticky-donate");
  if (sticky) {
    document.body.classList.add("has-sticky");
    var hero = document.querySelector(".hero, .page-head");
    var threshold = hero ? hero.offsetHeight * 0.6 : 300;
    var onStickyScroll = function () { sticky.classList.toggle("is-visible", window.scrollY > threshold); };
    onStickyScroll();
    window.addEventListener("scroll", onStickyScroll, { passive: true });
  }

  /* ---------- Contact form ---------- */
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    var status = form.querySelector(".form__status");
    var setStatus = function (msg, state) { if (status) { status.textContent = msg; status.setAttribute("data-state", state || ""); } };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.querySelector(".honeypot input") && form.querySelector(".honeypot input").value) return; // bot
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var data = new FormData(form);
      var name = data.get("name") || "", email = data.get("email") || "", subject = data.get("subject") || "Anfrage über die Website", message = data.get("message") || "";

      if (CONFIG.CONTACT_ENDPOINT) {
        setStatus("Wird gesendet …");
        fetch(CONFIG.CONTACT_ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } })
          .then(function (r) {
            if (r.ok) { form.reset(); setStatus("Vielen Dank! Deine Nachricht ist bei uns angekommen.", "ok"); }
            else { throw new Error("bad status"); }
          })
          .catch(function () { setStatus("Das hat leider nicht geklappt. Bitte schreib uns direkt an " + CONFIG.CONTACT_EMAIL + ".", "error"); });
      } else {
        var body = "Name: " + name + "\nE-Mail: " + email + "\n\n" + message;
        window.location.href = "mailto:" + CONFIG.CONTACT_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
        setStatus("Dein E-Mail-Programm öffnet sich mit der vorbereiteten Nachricht.", "ok");
      }
    });
  }

  /* ---------- Newsletter form (mailto based) ---------- */
  var news = document.querySelector("[data-newsletter-form]");
  if (news) {
    news.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!news.checkValidity()) { news.reportValidity(); return; }
      var email = new FormData(news).get("email");
      window.location.href = "mailto:" + CONFIG.CONTACT_EMAIL + "?subject=" + encodeURIComponent("Newsletter-Anmeldung") + "&body=" + encodeURIComponent("Hallo Watoto wa Nest Team,\n\nbitte nehmt mich in den Newsletter-Verteiler auf.\n\nE-Mail: " + email + "\n\nViele Grüße");
      var s = news.querySelector(".form__status"); if (s) s.textContent = "Dein E-Mail-Programm öffnet sich. Einfach abschicken, fertig!";
    });
  }


  /* ---------- Cookie-Einwilligung & Google-Dienste (Consent Mode v2) ---------- */
  var CONSENT_KEY = "wwn-consent";
  var googleEnabled = !!(CONFIG.GA_MEASUREMENT_ID || CONFIG.GOOGLE_ADS_ID);
  function readConsent() { try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; } }
  function writeConsent(v) { try { localStorage.setItem(CONSENT_KEY, v); } catch (e) { /* ignore */ } }
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  var googleLoaded = false;
  function loadGoogle() {
    if (googleLoaded || !googleEnabled) return;
    googleLoaded = true;
    var first = CONFIG.GA_MEASUREMENT_ID || CONFIG.GOOGLE_ADS_ID;
    var s = document.createElement("script");
    s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(first);
    document.head.appendChild(s);
    gtag("js", new Date());
    if (CONFIG.GA_MEASUREMENT_ID) gtag("config", CONFIG.GA_MEASUREMENT_ID, { anonymize_ip: true });
    if (CONFIG.GOOGLE_ADS_ID) gtag("config", CONFIG.GOOGLE_ADS_ID);
  }
  function applyConsent(granted) {
    gtag("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
      ad_storage: granted ? "granted" : "denied",
      ad_user_data: granted ? "granted" : "denied",
      ad_personalization: granted ? "granted" : "denied"
    });
    if (granted) loadGoogle();
  }
  var banner = document.querySelector(".consent");
  function showBanner() { if (banner) { banner.hidden = false; var b = banner.querySelector("[data-consent-accept]"); if (b) b.focus(); } }
  function hideBanner() { if (banner) banner.hidden = true; }
  if (googleEnabled) {
    gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", wait_for_update: 500 });
    var stored = readConsent();
    if (stored === "granted") applyConsent(true);
    else if (stored !== "denied") showBanner();
  }
  document.querySelectorAll("[data-consent-accept]").forEach(function (b) { b.addEventListener("click", function () { writeConsent("granted"); applyConsent(true); hideBanner(); }); });
  document.querySelectorAll("[data-consent-decline]").forEach(function (b) { b.addEventListener("click", function () { writeConsent("denied"); applyConsent(false); hideBanner(); }); });
  document.querySelectorAll("[data-consent-open]").forEach(function (b) {
    if (!googleEnabled) { b.hidden = true; return; }
    b.hidden = false;
    b.addEventListener("click", function (e) { e.preventDefault(); showBanner(); });
  });
  /* Spenden-Klicks als Ereignis melden (nur wenn Google geladen ist) */
  document.querySelectorAll('a[href*="betterplace.org"]').forEach(function (a) {
    a.addEventListener("click", function () { if (googleLoaded) gtag("event", "donate_click", { link_url: a.href }); });
  });

  /* ---------- Current year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
})();
