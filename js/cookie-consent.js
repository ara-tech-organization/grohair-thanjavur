/*
 * GroHair & GloSkin - Thanjavur
 * Cookie consent popup: Accept / Reject / Customize.
 * Shown once, as an in-page popup, when the visitor scrolls near the footer.
 * Choice is remembered in localStorage and applied to Google Consent Mode
 * (GTM) and the Meta Pixel on every later visit.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "groHairCookieConsent";
  var SCROLL_THRESHOLD_PX = 900; // distance from bottom of page that counts as "near the footer"

  function getStoredConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function storeConsent(consent) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch (e) {
      /* ignore - private browsing / storage blocked */
    }
  }

  function applyConsent(consent) {
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: consent.analytics ? "granted" : "denied",
        ad_storage: consent.marketing ? "granted" : "denied",
        ad_user_data: consent.marketing ? "granted" : "denied",
        ad_personalization: consent.marketing ? "granted" : "denied",
      });
    }
    if (typeof window.fbq === "function") {
      window.fbq("consent", consent.marketing ? "grant" : "revoke");
    }
  }

  function injectStyles() {
    if (document.getElementById("gh-cookie-consent-styles")) return;
    var style = document.createElement("style");
    style.id = "gh-cookie-consent-styles";
    style.textContent =
      ".gh-cc-banner{position:fixed;left:0;right:0;bottom:0;z-index:99998;" +
      "background:#ffffff;color:#333;padding:18px 20px;box-shadow:0 -2px 14px rgba(0,0,0,.15);" +
      "border-top:1px solid #e5e5e5;" +
      "font-family:inherit;transform:translateY(110%);transition:transform .35s ease;}" +
      ".gh-cc-banner.gh-cc-show{transform:translateY(0);}" +
      ".gh-cc-banner__inner{max-width:1140px;margin:0 auto;display:flex;flex-wrap:wrap;" +
      "align-items:center;justify-content:space-between;gap:16px;}" +
      ".gh-cc-banner__text{flex:1 1 340px;font-size:.9rem;line-height:1.6;color:#555;margin:0;}" +
      ".gh-cc-banner__text a{color:#ec2024;text-decoration:underline;}" +
      ".gh-cc-banner__actions{display:flex;flex-wrap:wrap;gap:10px;flex:0 0 auto;}" +
      ".gh-cc-btn{border-radius:30px;padding:8px 22px;font-size:.85rem;font-weight:600;" +
      "border:1px solid transparent;cursor:pointer;white-space:nowrap;}" +
      ".gh-cc-btn-accept{background:#ec2024;border-color:#ec2024;color:#fff;}" +
      ".gh-cc-btn-accept:hover{background:#c81a1e;border-color:#c81a1e;}" +
      ".gh-cc-btn-reject{background:transparent;border-color:#aaaaaa;color:#333;}" +
      ".gh-cc-btn-reject:hover{border-color:#333;}" +
      ".gh-cc-btn-customize{background:transparent;border-color:#ec2024;color:#ec2024;}" +
      ".gh-cc-btn-customize:hover{background:#ec2024;color:#fff;}" +
      ".gh-cc-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:99999;" +
      "display:none;align-items:center;justify-content:center;padding:20px;}" +
      ".gh-cc-overlay.gh-cc-show{display:flex;}" +
      ".gh-cc-modal{background:#fff;color:#333;width:100%;max-width:520px;border-radius:10px;" +
      "padding:28px;max-height:85vh;overflow-y:auto;box-shadow:0 10px 40px rgba(0,0,0,.3);}" +
      ".gh-cc-modal h3{margin:0 0 6px;color:#211e1c;}" +
      ".gh-cc-modal p.gh-cc-modal-sub{color:#777;font-size:.88rem;margin:0 0 20px;}" +
      ".gh-cc-cat{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;" +
      "padding:14px 0;border-bottom:1px solid #eee;}" +
      ".gh-cc-cat:last-of-type{border-bottom:none;}" +
      ".gh-cc-cat__label{font-weight:600;color:#211e1c;margin:0 0 4px;font-size:.95rem;}" +
      ".gh-cc-cat__desc{color:#777;font-size:.82rem;line-height:1.5;margin:0;}" +
      ".gh-cc-switch{position:relative;flex:0 0 auto;width:44px;height:24px;margin-top:2px;}" +
      ".gh-cc-switch input{opacity:0;width:0;height:0;}" +
      ".gh-cc-slider{position:absolute;cursor:pointer;inset:0;background:#ccc;border-radius:24px;" +
      "transition:.2s;}" +
      ".gh-cc-slider:before{content:'';position:absolute;height:18px;width:18px;left:3px;bottom:3px;" +
      "background:#fff;border-radius:50%;transition:.2s;}" +
      ".gh-cc-switch input:checked + .gh-cc-slider{background:#ec2024;}" +
      ".gh-cc-switch input:checked + .gh-cc-slider:before{transform:translateX(20px);}" +
      ".gh-cc-switch input:disabled + .gh-cc-slider{background:#f0a8a9;cursor:not-allowed;}" +
      ".gh-cc-modal__actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px;}" +
      ".gh-cc-modal__actions .gh-cc-btn{flex:1 1 auto;text-align:center;}" +
      "@media(max-width:576px){.gh-cc-banner__actions{width:100%;}" +
      ".gh-cc-banner__actions .gh-cc-btn{flex:1 1 auto;}}";
    document.head.appendChild(style);
  }

  function el(html) {
    var wrap = document.createElement("div");
    wrap.innerHTML = html.trim();
    return wrap.firstChild;
  }

  var banner, overlay, analyticsToggle, marketingToggle;

  function buildBanner() {
    banner = el(
      '<div class="gh-cc-banner" role="dialog" aria-live="polite" aria-label="Cookie consent">' +
        '<div class="gh-cc-banner__inner">' +
        '<p class="gh-cc-banner__text">We use cookies to run this website, understand how it is used, and show relevant offers. Read our ' +
        '<a href="cookie-policy.html">Cookie Policy</a>. You can accept, reject, or customize your choice.</p>' +
        '<div class="gh-cc-banner__actions">' +
        '<button type="button" class="gh-cc-btn gh-cc-btn-reject" data-gh-cc="reject">Reject</button>' +
        '<button type="button" class="gh-cc-btn gh-cc-btn-customize" data-gh-cc="customize">Customize</button>' +
        '<button type="button" class="gh-cc-btn gh-cc-btn-accept" data-gh-cc="accept">Accept All</button>' +
        "</div></div></div>"
    );
    document.body.appendChild(banner);

    banner.querySelector('[data-gh-cc="accept"]').addEventListener("click", handleAcceptAll);
    banner.querySelector('[data-gh-cc="reject"]').addEventListener("click", handleRejectAll);
    banner.querySelector('[data-gh-cc="customize"]').addEventListener("click", handleCustomize);
  }

  function buildModal() {
    overlay = el(
      '<div class="gh-cc-overlay" aria-hidden="true">' +
        '<div class="gh-cc-modal" role="dialog" aria-modal="true" aria-label="Cookie preferences">' +
        "<h3>Cookie Preferences</h3>" +
        '<p class="gh-cc-modal-sub">Choose which cookies we may use. Necessary cookies keep the website working and cannot be turned off. See our ' +
        '<a href="cookie-policy.html" style="color:#ec2024;">Cookie Policy</a> for details.</p>' +
        '<div class="gh-cc-cat">' +
        '<div><p class="gh-cc-cat__label">Necessary</p>' +
        '<p class="gh-cc-cat__desc">Required for core site features such as forms and appointment booking. Always on.</p></div>' +
        '<label class="gh-cc-switch"><input type="checkbox" checked disabled><span class="gh-cc-slider"></span></label>' +
        "</div>" +
        '<div class="gh-cc-cat">' +
        '<div><p class="gh-cc-cat__label">Analytics</p>' +
        '<p class="gh-cc-cat__desc">Helps us understand how visitors use the site (Google Analytics, Microsoft Clarity) so we can improve it.</p></div>' +
        '<label class="gh-cc-switch"><input type="checkbox" id="gh-cc-analytics"><span class="gh-cc-slider"></span></label>' +
        "</div>" +
        '<div class="gh-cc-cat">' +
        '<div><p class="gh-cc-cat__label">Marketing</p>' +
        '<p class="gh-cc-cat__desc">Used by the Meta Pixel and Google Ads to show and measure relevant ads about our clinic.</p></div>' +
        '<label class="gh-cc-switch"><input type="checkbox" id="gh-cc-marketing"><span class="gh-cc-slider"></span></label>' +
        "</div>" +
        '<div class="gh-cc-modal__actions">' +
        '<button type="button" class="gh-cc-btn gh-cc-btn-reject" data-gh-cc="modal-reject">Reject All</button>' +
        '<button type="button" class="gh-cc-btn gh-cc-btn-customize" data-gh-cc="modal-save">Save Preferences</button>' +
        '<button type="button" class="gh-cc-btn gh-cc-btn-accept" data-gh-cc="modal-accept">Accept All</button>' +
        "</div></div></div>"
    );
    document.body.appendChild(overlay);

    analyticsToggle = overlay.querySelector("#gh-cc-analytics");
    marketingToggle = overlay.querySelector("#gh-cc-marketing");

    overlay.querySelector('[data-gh-cc="modal-accept"]').addEventListener("click", handleAcceptAll);
    overlay.querySelector('[data-gh-cc="modal-reject"]').addEventListener("click", handleRejectAll);
    overlay.querySelector('[data-gh-cc="modal-save"]').addEventListener("click", function () {
      handleSave(analyticsToggle.checked, marketingToggle.checked);
    });
    overlay.addEventListener("click", function (evt) {
      if (evt.target === overlay) hideModal();
    });
  }

  function showBanner() {
    requestAnimationFrame(function () {
      banner.classList.add("gh-cc-show");
    });
  }
  function hideBanner() {
    banner.classList.remove("gh-cc-show");
  }
  function showModal() {
    var stored = getStoredConsent();
    analyticsToggle.checked = !!(stored && stored.analytics);
    marketingToggle.checked = !!(stored && stored.marketing);
    overlay.classList.add("gh-cc-show");
    overlay.setAttribute("aria-hidden", "false");
  }
  function hideModal() {
    overlay.classList.remove("gh-cc-show");
    overlay.setAttribute("aria-hidden", "true");
  }

  function isOnCookiePolicyPage() {
    return /(^|\/)cookie-policy\.html$/i.test(window.location.pathname);
  }

  function goToCookiePolicy() {
    if (!isOnCookiePolicyPage()) {
      window.location.href = "cookie-policy.html";
    }
  }

  function finalize(consent, redirect) {
    consent.necessary = true;
    consent.ts = new Date().toISOString();
    storeConsent(consent);
    applyConsent(consent);
    hideBanner();
    hideModal();
    if (redirect) goToCookiePolicy();
  }

  function handleAcceptAll() {
    finalize({ analytics: true, marketing: true }, true);
  }
  function handleRejectAll() {
    finalize({ analytics: false, marketing: false }, false);
  }
  function handleSave(analytics, marketing) {
    finalize({ analytics: analytics, marketing: marketing }, false);
  }
  function handleCustomize() {
    if (isOnCookiePolicyPage()) {
      showModal();
    } else {
      window.location.href = "cookie-policy.html";
    }
  }

  // Public API: lets the Cookie Policy page (or any page) reopen the preference modal.
  window.openCookiePreferences = function () {
    showModal();
  };

  function initScrollTrigger() {
    var shown = false;

    function isNearFooter() {
      var scrollBottom = window.innerHeight + window.scrollY;
      var pageHeight = document.documentElement.scrollHeight;
      return scrollBottom >= pageHeight - SCROLL_THRESHOLD_PX;
    }

    function onScroll() {
      if (shown) return;
      if (isNearFooter()) {
        shown = true;
        showBanner();
        window.removeEventListener("scroll", onScroll);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    // Handles short pages where the footer is already visible without scrolling.
    onScroll();
  }

  function init() {
    injectStyles();
    buildBanner();
    buildModal();

    // Dev/testing helper: add ?resetcookie to any URL to clear the saved
    // choice and force the popup to show again, without needing DevTools.
    if (/[?&]resetcookie\b/.test(window.location.search)) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
    }

    var stored = getStoredConsent();
    if (stored) {
      applyConsent(stored);
      return;
    }

    initScrollTrigger();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
