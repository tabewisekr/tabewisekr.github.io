/* TabeWise site script: language switch (Korean default, English alternate; Sakura (pink) default theme), mobile menu, contact link. */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Investor / partner enquiries.
     No form backend exists, so no submission form is shown. To publish a
     contact route, put a monitored role address here (for example a
     dedicated partners mailbox on your own domain), or leave it empty and
     the page shows "being set up". Do not use a personal address.
     ------------------------------------------------------------------ */
  var CONTACT_EMAIL = '';

  /* ------------------------------------------------------------------
     Android download. While APK_URL is empty, every download button is
     replaced by a "coming soon" message. When a verified TabeWise APK
     exists, upload it and set its relative path here, for example
     'Android/TABEWISE.apk'. Do not point this at a file that is not there.
     ------------------------------------------------------------------ */
  var APK_URL = '';

  var KEY = 'tabewise-lang';
  var doc = document, root = doc.documentElement;

  var META = {
    en: {
      title: 'TabeWise (타베와이즈) | Eat Smart. Know Better.',
      desc: 'TabeWise (타베와이즈) is preparing a dedicated product for South Korea. Korean ingredient label scanning and Korean and English support are planned.',
      og: 'A dedicated TabeWise for South Korea is in preparation. Korean ingredient label scanning is planned.',
      alt: 'TabeWise (타베와이즈): Eat Smart. Know Better.',
      locale: 'en_US'
    },
    ko: {
      title: 'TabeWise (타베와이즈) | 현명하게 먹고, 더 잘 알기.',
      desc: 'TabeWise(타베와이즈) 한국 서비스는 대한민국을 위한 별도의 제품으로 준비 중입니다. 한국 식품 원재료 표시 스캔과 한국어·영어 지원을 계획하고 있습니다.',
      og: '대한민국을 위한 TabeWise를 준비 중입니다. 한국 식품 원재료 표시 스캔을 계획하고 있습니다.',
      alt: 'TabeWise (타베와이즈): 현명하게 먹고, 더 잘 알기.',
      locale: 'ko_KR'
    }
  };

  function meta(sel, attr, val) {
    var el = doc.querySelector(sel);
    if (el) el.setAttribute(attr, val);
  }

  function setLang(l) {
    var m = META[l];
    root.lang = l;

    /* Korean is the text in the page; English is kept in data-en / data-alt-en / data-aria-en. */
    doc.querySelectorAll('[data-en]').forEach(function (e) {
      if (e.dataset.ko === undefined) e.dataset.ko = e.innerHTML;
      e.innerHTML = l === 'en' ? e.dataset.en : e.dataset.ko;
    });
    doc.querySelectorAll('[data-href-en]').forEach(function (e) {
      if (e.dataset.hrefKo === undefined) e.dataset.hrefKo = e.getAttribute('href');
      e.setAttribute('href', l === 'en' ? e.dataset.hrefEn : e.dataset.hrefKo);
    });
    doc.querySelectorAll('[data-alt-en]').forEach(function (e) {
      if (e.dataset.altKo === undefined) e.dataset.altKo = e.getAttribute('alt');
      e.setAttribute('alt', l === 'en' ? e.dataset.altEn : e.dataset.altKo);
    });
    doc.querySelectorAll('[data-aria-en]').forEach(function (e) {
      if (e.dataset.ariaKo === undefined) e.dataset.ariaKo = e.getAttribute('aria-label');
      e.setAttribute('aria-label', l === 'en' ? e.dataset.ariaEn : e.dataset.ariaKo);
    });

    doc.title = m.title;
    meta('meta[name="description"]', 'content', m.desc);
    meta('meta[property="og:title"]', 'content', m.title);
    meta('meta[property="og:description"]', 'content', m.og);
    meta('meta[property="og:image:alt"]', 'content', m.alt);
    meta('meta[property="og:locale"]', 'content', m.locale);
    meta('meta[name="twitter:title"]', 'content', m.title);
    meta('meta[name="twitter:description"]', 'content', m.og);

    doc.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === l));
    });
    try { localStorage.setItem(KEY, l); } catch (e) { /* storage unavailable */ }
    if (typeof refreshShots === 'function') refreshShots();
  }

  var saved = 'ko';
  try { saved = localStorage.getItem(KEY) || 'ko'; } catch (e) { /* ignore */ }
  setLang(saved === 'en' ? 'en' : 'ko');

  doc.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.lang); });
  });


  /* Theme switcher: re-colours the site and swaps the app screenshots.
     Screens are looked up at images/screens/<theme>-<home|result|settings>.png
     (portrait, about 9:19). Until a file exists the placeholder stays. */
  var THEMES = {
    sakura: { color: '#ffe1ea', en: 'Sakura', ko: '사쿠라' },
    sky:    { color: '#ddf0f6', en: 'Sky',    ko: '스카이' },
    matcha: { color: '#eaf4dc', en: 'Matcha', ko: '말차' },
    dark:   { color: '#0e1626', en: 'Dark',   ko: '다크' }
  };
  var SHOTS = {
    home:     { en: 'Home screen',     ko: '홈 화면' },
    result:   { en: 'Result screen',   ko: '결과 화면' },
    settings: { en: 'Settings screen', ko: '설정 화면' }
  };
  var THEME_KEY = 'tabewise-theme';
  var theme = 'sakura'; /* default theme: Sakura (first theme, pink) */
  /* Sakura (pink) is fixed for this site: no theme picker, and any theme saved by another TabeWise page is ignored. */

  function refreshShots() {
    if (!SHOTS || !THEMES) return; /* not initialised yet on first setLang */
    var ko = root.lang === 'ko';
    doc.querySelectorAll('figure[data-shot]').forEach(function (fig) {
      var key = fig.dataset.shot, img = fig.querySelector('.shot-img'), slot = fig.querySelector('.shot-slot');
      if (!img || !slot || !SHOTS[key]) return;
      var t = THEMES[theme];
      var alt = ko ? SHOTS[key].ko + ' (' + t.ko + ' 테마)' : SHOTS[key].en + ', ' + t.en + ' theme';
      img.alt = alt;
      var src = 'images/screens/' + theme + '-' + key + '.png';
      if (img.getAttribute('data-src') === src) return;
      img.setAttribute('data-src', src);
      var probe = new Image();
      probe.onload = function () {
        if (img.getAttribute('data-src') !== src) return;
        img.src = src; img.hidden = false; slot.hidden = true;
      };
      probe.onerror = function () {
        if (img.getAttribute('data-src') !== src) return;
        img.hidden = true; slot.hidden = false;
      };
      probe.src = src;
    });
  }

  function applyTheme(name, save) {
    if (!THEMES[name]) name = 'sakura';
    theme = name;
    if (name === 'sakura') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', name);
    meta('meta[name="theme-color"]', 'content', THEMES[name].color);
    doc.querySelectorAll('[data-theme-btn]').forEach(function (b) {
      b.setAttribute('aria-checked', String(b.dataset.themeBtn === name));
    });
    if (save) { try { localStorage.setItem(THEME_KEY, name); } catch (e) { /* ignore */ } }
    refreshShots();
  }
  doc.querySelectorAll('[data-theme-btn]').forEach(function (b) {
    b.addEventListener('click', function () { applyTheme(b.dataset.themeBtn, true); });
  });
  applyTheme(theme, false);

  /* Mobile menu */
  var btn = doc.querySelector('.menu-btn');
  var nav = doc.getElementById('site-nav');
  function closeMenu() {
    if (!btn) return;
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeMenu(); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* Active navigation link: highlights the nav link of the section being read.
     Works from clicks and from manual scrolling (IntersectionObserver), in both languages. */
  var navLinks = doc.querySelectorAll('#site-nav a[href^="#"]');
  var allSections = doc.querySelectorAll('main > section[id]');
  function setActiveNav(id) {
    navLinks.forEach(function (a) {
      var on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
    });
  }
  if (navLinks.length && allSections.length) {
    var navIds = {};
    navLinks.forEach(function (a) { navIds[a.getAttribute('href').slice(1)] = true; });
    var order = Array.prototype.slice.call(allSections);
    var inBand = {};
    function updateNav() {
      var cur = -1;
      order.forEach(function (s, i) { if (inBand[s.id]) cur = i; });
      if (window.innerHeight + window.scrollY >= doc.documentElement.scrollHeight - 2) cur = order.length - 1;
      var id = '';
      for (var i = cur; i >= 0; i--) { if (navIds[order[i].id]) { id = order[i].id; break; } }
      setActiveNav(id);
    }
    nav && nav.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (a) setActiveNav(a.getAttribute('href').slice(1));
    });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { inBand[en.target.id] = en.isIntersecting; });
        updateNav();
      }, { rootMargin: '-90px 0px -65% 0px', threshold: 0 });
      order.forEach(function (s) { io.observe(s); });
      window.addEventListener('scroll', function () {
        if (window.innerHeight + window.scrollY >= doc.documentElement.scrollHeight - 2) updateNav();
      }, { passive: true });
    }
  }

  /* Display the timestamp generated by the successful Pages deployment workflow. */
  var updatedEl = doc.getElementById('site-last-updated');
  if (updatedEl) {
    fetch('/site-meta.json?ts=' + Date.now(), { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) throw new Error('Deployment metadata unavailable');
        return response.json();
      })
      .then(function (metaData) {
        var deployedAt = new Date(metaData.deployed_at);
        if (isNaN(deployedAt.getTime())) throw new Error('Invalid deployment timestamp');
        function renderUpdatedAt() {
          var ko = root.lang === 'ko';
          var formatted = new Intl.DateTimeFormat(ko ? 'ko-KR' : 'en-GB', {
            timeZone: 'Asia/Tokyo',
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
          }).format(deployedAt);
          updatedEl.textContent = ko
            ? '최종 업데이트: ' + formatted + ' JST'
            : 'Last updated: ' + formatted + ' JST';
        }
        renderUpdatedAt();
        doc.querySelectorAll('.lang button').forEach(function (button) {
          button.addEventListener('click', renderUpdatedAt);
        });
      })
      .catch(function () {
        updatedEl.textContent = root.lang === 'ko'
          ? '최종 업데이트 시각을 가져올 수 없습니다'
          : 'Last-updated time is currently unavailable';
      });
  }

  /* Android download buttons */
  if (APK_URL && /^[\w./-]+\.apk$/i.test(APK_URL)) {
    doc.querySelectorAll('.apk-soon').forEach(function (e) { e.hidden = true; });
    doc.querySelectorAll('.apk-live').forEach(function (e) {
      e.hidden = false;
      if (e.tagName === 'A') e.setAttribute('href', APK_URL);
    });
  }

  /* Contact route for investors / partners */
  var link = doc.getElementById('contact-link');
  var pending = doc.getElementById('contact-pending');
  if (link && pending && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(CONTACT_EMAIL)) {
    doc.querySelectorAll('.contact-soon').forEach(function (e) { e.hidden = true; });
    doc.querySelectorAll('.contact-live').forEach(function (e) { e.hidden = false; });
    link.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent('TabeWise enquiry');
    link.hidden = false;
    pending.hidden = true;
  }
})();
