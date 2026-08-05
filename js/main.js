// Interview Prep Hub — shared, minimal JS for every page.

// Restore the user's explicit theme choice (if any) as early as possible,
// before DOMContentLoaded, to minimize any flash between themes. This only
// ever sets a data-theme attribute; if nothing is stored, the CSS
// `prefers-color-scheme` media query (see styles.css) governs the default.
(function () {
  try {
    var saved = localStorage.getItem('ipdh-theme');
    if (saved === 'dark' || saved === 'light') {
      document.documentElement.setAttribute('data-theme', saved);
    }
  } catch (e) { /* localStorage unavailable (e.g. privacy mode) - ignore */ }
})();

document.addEventListener('DOMContentLoaded', function () {
  // Mobile sidebar toggle
  var toggle = document.querySelector('.menu-toggle');
  var sidebar = document.querySelector('.sidebar');
  if (toggle && sidebar) {
    var backdrop = document.createElement('div');
    backdrop.className = 'sidebar-backdrop';
    document.body.appendChild(backdrop);

    var closeSidebar = function () {
      sidebar.classList.remove('open');
      backdrop.classList.remove('visible');
    };

    toggle.addEventListener('click', function () {
      sidebar.classList.toggle('open');
      backdrop.classList.toggle('visible');
    });
    backdrop.addEventListener('click', closeSidebar);
    document.addEventListener('click', function (e) {
      if (window.innerWidth <= 900 && sidebar.classList.contains('open') &&
          !sidebar.contains(e.target) && !toggle.contains(e.target)) {
        closeSidebar();
      }
    });
    // Close automatically after choosing a sub-topic on mobile
    sidebar.addEventListener('click', function (e) {
      if (window.innerWidth <= 900 && e.target.closest('a')) {
        closeSidebar();
      }
    });
  }

  // Sortable tables (click a <th> to sort its column; click again to reverse)
  document.querySelectorAll('table.sortable').forEach(function (table) {
    var tbody = table.tBodies[0];
    if (!tbody) return;
    var headerRow = table.tHead ? table.tHead.rows[0] : table.rows[0];
    Array.prototype.forEach.call(headerRow.cells, function (th, colIndex) {
      th.addEventListener('click', function () {
        var currentDir = th.classList.contains('sort-asc') ? 'asc' :
                          th.classList.contains('sort-desc') ? 'desc' : null;
        var newDir = currentDir === 'asc' ? 'desc' : 'asc';

        Array.prototype.forEach.call(headerRow.cells, function (cell) {
          cell.classList.remove('sort-asc', 'sort-desc');
        });
        th.classList.add(newDir === 'asc' ? 'sort-asc' : 'sort-desc');

        var rows = Array.prototype.slice.call(tbody.rows);
        rows.sort(function (rowA, rowB) {
          var a = rowA.cells[colIndex].innerText.trim().toLowerCase();
          var b = rowB.cells[colIndex].innerText.trim().toLowerCase();
          var cmp = a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
          return newDir === 'asc' ? cmp : -cmp;
        });
        rows.forEach(function (row) { tbody.appendChild(row); });
      });
    });
  });

  // Header nav menu dropdowns (Courses / Data Structures / Software Architecture / etc.)
  var hubNavItems = document.querySelectorAll('.hub-nav-item');
  if (hubNavItems.length) {
    var closeAllHubNav = function (except) {
      hubNavItems.forEach(function (item) {
        if (item !== except) item.classList.remove('open');
      });
    };
    hubNavItems.forEach(function (item) {
      var trigger = item.querySelector('.hub-nav-trigger');
      if (!trigger) return;
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = item.classList.contains('open');
        closeAllHubNav();
        if (!isOpen) item.classList.add('open');
      });
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.hub-nav-item')) closeAllHubNav();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAllHubNav();
    });

    // Highlight whichever dropdown link points at the page currently being
    // viewed, the same way .sidebar-list marks its current item with
    // .active - keeps the topbar menu and the side navigation consistent.
    var currentPath = location.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
    document.querySelectorAll('.hub-nav-dropdown a[href]').forEach(function (link) {
      var linkPath = new URL(link.getAttribute('href'), location.href).pathname
        .replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
      if (linkPath === currentPath) link.classList.add('active');
    });
  }

  // Copy-to-clipboard button on code blocks
  document.querySelectorAll('.article pre').forEach(function (pre) {
    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.type = 'button';
    btn.textContent = 'Copy';
    btn.addEventListener('click', function () {
      var code = pre.querySelector('code') || pre;
      navigator.clipboard.writeText(code.innerText).then(function () {
        btn.textContent = 'Copied!';
        setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
      });
    });
    pre.appendChild(btn);
  });
});

// ---------------------------------------------------------------------------
// Visual/interactive enhancements (theme toggle, progress bar, back-to-top,
// scroll-spy on-page TOC, scroll-reveal animations). Kept in its own
// DOMContentLoaded block, entirely additive - none of the code above is
// touched, so existing behavior (sortable tables, hub-nav, mobile sidebar,
// copy buttons) is unaffected.
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {

  // ---- Light/dark theme toggle -------------------------------------------
  var topbarLeft = document.querySelector('.topbar-left');
  if (topbarLeft) {
    var themeBtn = document.createElement('button');
    themeBtn.type = 'button';
    themeBtn.className = 'theme-toggle';
    themeBtn.setAttribute('aria-label', 'Toggle dark mode');
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
      document.documentElement.setAttribute('data-theme', mode);
      try { localStorage.setItem('ipdh-theme', mode); } catch (e) { /* ignore */ }
    };
    themeBtn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      if (!current) {
        // No explicit choice yet - flip relative to whatever is currently
        // rendered (system preference).
        var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        current = prefersDark ? 'dark' : 'light';
      }
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // ---- Scroll progress bar + back-to-top button --------------------------
  var progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);

  var backToTop = document.createElement('button');
  backToTop.type = 'button';
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M12 19V5M5 12l7-7 7 7"></path>' +
    '</svg>';
  document.body.appendChild(backToTop);
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  var ticking = false;
  var updateOnScroll = function () {
    var doc = document.documentElement;
    var scrollTop = doc.scrollTop || document.body.scrollTop;
    var scrollHeight = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
    var pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progress.style.width = pct + '%';
    backToTop.classList.toggle('visible', scrollTop > 480);
    ticking = false;
  };
  document.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateOnScroll);
      ticking = true;
    }
  }, { passive: true });
  updateOnScroll();

  // ---- Scroll-reveal for cards, callouts, Q&A items, etc. ----------------
  var revealTargets = document.querySelectorAll(
    '.card, .qa-item, .callout, .formula-box, .diagram-box, .toc-box'
  );
  if ('IntersectionObserver' in window && revealTargets.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (Math.min(i, 8) * 40) + 'ms';
      revealObserver.observe(el);
    });
  }

  // ---- Scroll-spy: highlight the current section in the "On This Page"
  // sidebar TOC as the reader scrolls through an article. Scoped to anchor
  // links only, so it never touches the sibling sub-topic navigation lists
  // (those link to other .html files, not #fragments).
  var tocLinks = document.querySelectorAll('.sidebar-list a[href^="#"]');
  if ('IntersectionObserver' in window && tocLinks.length) {
    var linksByTarget = {};
    var headings = [];
    tocLinks.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var heading = id && document.getElementById(id);
      if (heading) {
        linksByTarget[id] = link;
        headings.push(heading);
      }
    });

    var setActiveLink = function (id) {
      tocLinks.forEach(function (link) { link.classList.remove('active'); });
      if (linksByTarget[id]) linksByTarget[id].classList.add('active');
    };

    if (headings.length) {
      var headingObserver = new IntersectionObserver(function (entries) {
        var visible = entries.filter(function (e) { return e.isIntersecting; });
        if (visible.length) {
          visible.sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
          setActiveLink(visible[0].target.id);
        }
      }, { rootMargin: '-' + (60 + 20) + 'px 0px -70% 0px', threshold: 0 });

      headings.forEach(function (h) { headingObserver.observe(h); });
    }
  }
});
