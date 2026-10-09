/* Watoto wa Nest e.V. — site behaviour (no dependencies) */
(function () {
  "use strict";

  /* ---------- Configuration ----------
     CONTACT_ENDPOINT: optional form backend (e.g. https://formspree.io/f/xxxx).
     Leave empty to fall back to the visitor's e-mail client (mailto:). */
  var CONFIG = {
    CONTACT_ENDPOINT: "",
    CONTACT_EMAIL: "watotowanest@gmail.com",
    BETTERPLACE_URL: "https://www.betterplace.org/de/projects/98900"
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

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

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

  /* ---------- Current year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
})();
