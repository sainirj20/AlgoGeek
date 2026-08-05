/* ==========================================================================
   Interview Prep Hub — shared front-end behaviour
   Handles the responsive sidebar (mobile drawer) and a touch of playful
   randomized color on the sticky "tip" notes. No frameworks, no build step.
   ========================================================================== */

// Restore the user's explicit theme choice (if any) as early as possible,
// before DOMContentLoaded, to minimize any flash between themes. Mirrors
// the parent hub's own js/main.js so the choice is shared across the whole
// site (same localStorage key, same data-theme attribute on <html>).
(function () {
  try {
    var saved = localStorage.getItem('ipdh-theme');
    if (saved === 'dark' || saved === 'light') {
      document.documentElement.setAttribute('data-theme', saved);
    }
  } catch (e) { /* localStorage unavailable (e.g. privacy mode) - ignore */ }
})();

(function () {
  "use strict";

  function initSidebar() {
    var toggle = document.querySelector(".menu-toggle");
    var sidebar = document.querySelector(".sidebar");
    var backdrop = document.querySelector(".sidebar-backdrop");
    if (!toggle || !sidebar) return;

    function open() {
      sidebar.classList.add("open");
      if (backdrop) backdrop.classList.add("visible");
      toggle.setAttribute("aria-expanded", "true");
    }
    function close() {
      sidebar.classList.remove("open");
      if (backdrop) backdrop.classList.remove("visible");
      toggle.setAttribute("aria-expanded", "false");
    }
    toggle.addEventListener("click", function () {
      sidebar.classList.contains("open") ? close() : open();
    });
    if (backdrop) backdrop.addEventListener("click", close);
    document.querySelectorAll(".sidebar-list a").forEach(function (a) {
      a.addEventListener("click", close);
    });
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  function initStickyNotes() {
    var palette = ["#FCAE7C", "#FFE699", "#eae672", "#B3F5BC", "#D6F6FF", "#E2CBF7", "#D1BDFF"];
    var notes = document.querySelectorAll("sticky");
    notes.forEach(function (note, i) {
      note.style.background = palette[i % palette.length];
    });
  }

  function initActiveSidebarLink() {
    // All-questions.html now hosts every topic as a #anchor on one page, so
    // pathname alone is no longer enough to tell sidebar items apart --
    // compare pathname + hash together, and re-run on hash changes so the
    // right item stays highlighted as the reader jumps between sections.
    function refresh() {
      var here = window.location.pathname.replace(/index\.html$/, "") + window.location.hash;
      document.querySelectorAll(".sidebar-list a").forEach(function (a) {
        var href = a.getAttribute("href");
        if (!href) return;
        var url = new URL(href, window.location.href);
        var target = url.pathname.replace(/index\.html$/, "") + url.hash;
        a.classList.toggle("active", target === here);
      });
    }
    refresh();
    window.addEventListener("hashchange", refresh);
  }

  function initCopyButtons() {
    document.querySelectorAll(".copy-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var code = btn.parentElement.querySelector("code");
        var text = code ? code.innerText : "";
        if (!text) return;
        var reset = function (label) {
          setTimeout(function () { btn.textContent = label; }, 1500);
        };
        var original = btn.textContent;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            btn.textContent = "Copied!";
            reset(original);
          });
        }
      });
    });
  }

  // Header nav menu dropdowns (Courses / Software Architecture / System
  // Design / OOD Questions) -- same behaviour as the parent hub's own
  // header, needed now that this section's topbar includes the hub-nav.
  function initHubNav() {
    var hubNavItems = document.querySelectorAll(".hub-nav-item");
    if (!hubNavItems.length) return;
    var closeAllHubNav = function (except) {
      hubNavItems.forEach(function (item) {
        if (item !== except) item.classList.remove("open");
      });
    };
    hubNavItems.forEach(function (item) {
      var trigger = item.querySelector(".hub-nav-trigger");
      if (!trigger) return;
      trigger.addEventListener("click", function (e) {
        e.stopPropagation();
        var isOpen = item.classList.contains("open");
        closeAllHubNav();
        if (!isOpen) item.classList.add("open");
      });
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".hub-nav-item")) closeAllHubNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAllHubNav();
    });
  }

  // Light/dark theme toggle -- same button + behaviour as the parent hub's
  // own header (shares the "ipdh-theme" localStorage key site-wide).
  function initThemeToggle() {
    var topbarLeft = document.querySelector(".topbar-left");
    if (!topbarLeft) return;

    var themeBtn = document.createElement("button");
    themeBtn.type = "button";
    themeBtn.className = "theme-toggle";
    themeBtn.setAttribute("aria-label", "Toggle dark mode");
    themeBtn.innerHTML =
      '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<circle cx="12" cy="12" r="4"></circle>' +
        '<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>' +
      '</svg>' +
      '<svg class="icon-moon" viewBox="0 0 24 24" fill="currentColor">' +
        '<path d="M20.742 13.045a8.088 8.088 0 0 1-2.582.417c-4.477 0-8.106-3.63-8.106-8.106 0-.888.144-1.742.408-2.542a.75.75 0 0 0-.937-.955A9.735 9.735 0 0 0 2.25 12.25c0 5.385 4.365 9.75 9.75 9.75a9.735 9.735 0 0 0 9.126-6.318.75.75 0 0 0-.384-.637Z"></path>' +
      '</svg>';
    topbarLeft.appendChild(themeBtn);

    var applyTheme = function (mode) {
      document.documentElement.setAttribute("data-theme", mode);
      try { localStorage.setItem("ipdh-theme", mode); } catch (e) { /* ignore */ }
    };
    themeBtn.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme");
      if (!current) {
        var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        current = prefersDark ? "dark" : "light";
      }
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initSidebar();
    initStickyNotes();
    initActiveSidebarLink();
    initCopyButtons();
    initHubNav();
    initThemeToggle();
  });
})();
