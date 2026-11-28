/* TabeWise Korea home page: language switch (Korean default, English alternate),
   mobile menu, active navigation link and app screenshot slots. */
(function () {
  'use strict';
  var KEY = 'tabewise-lang';
  var doc = document, root = doc.documentElement;

  var META = {
    ko: {
      title: 'TabeWise 타베와이즈 | 한국 식품 성분 확인 앱 준비 중',
      desc: 'TabeWise(타베와이즈)는 한국 식품의 원재료 표시를 이해하도록 돕는, 한국 시장을 위한 앱을 준비하고 있습니다. 한국 식품 원재료 표시 스캔과 한국어·영어 지원을 계획하고 있으며, 아직 출시되지 않았습니다.',
      og: '한국 식품 성분, 더 잘 알고 선택하세요. 원재료 표시 스캔과 한국어·영어 지원을 계획 중인 앱을 준비하고 있습니다.',
      locale: 'ko_KR'
    },
    en: {
      title: 'TabeWise | A Korean food ingredient app, in preparation',
      desc: 'TabeWise (타베와이즈) is preparing a dedicated app for South Korea to help people understand Korean food ingredient labels. Korean ingredient label scanning and Korean and English support are planned. It is not released yet.',
      og: 'Understand Korean food ingredients and choose better. An app is in preparation, with label scanning and Korean and English support planned.',
      locale: 'en_US'
    }
  };

  function meta(sel, val) {
    var el = doc.querySelector(sel);
    if (el) el.setAttribute('content', val);
  }

  /* Korean is the text in the page; English is kept in data-en / data-*-en. */
  function swap(selector, key, get, set, l) {
    doc.querySelectorAll(selector).forEach(function (e) {
      if (e.dataset[key + 'Ko'] === undefined) e.dataset[key + 'Ko'] = get(e);
      set(e, l === 'en' ? e.dataset[key + 'En'] : e.dataset[key + 'Ko']);
    });
  }

  function setLang(l) {
    var m = META[l];
    root.lang = l;
    doc.querySelectorAll('[data-en]').forEach(function (e) {
      if (e.dataset.ko === undefined) e.dataset.ko = e.innerHTML;
      e.innerHTML = l === 'en' ? e.dataset.en : e.dataset.ko;
    });
    swap('[data-href-en]', 'href', function (e) { return e.getAttribute('href'); }, function (e, v) { e.setAttribute('href', v); }, l);
    swap('[data-aria-en]', 'aria', function (e) { return e.getAttribute('aria-label'); }, function (e, v) { e.setAttribute('aria-label', v); }, l);
    doc.querySelectorAll('[data-alt-en]').forEach(function (e) {
      e.alt = l === 'en' ? e.dataset.altEn : e.dataset.altKo;
    });
    doc.title = m.title;
    meta('meta[name="description"]', m.desc);
    meta('meta[property="og:title"]', m.title);
    meta('meta[property="og:description"]', m.og);
    meta('meta[property="og:locale"]', m.locale);
    meta('meta[property="og:locale:alternate"]', META[l === 'en' ? 'ko' : 'en'].locale);
    meta('meta[name="twitter:title"]', m.title);
    meta('meta[name="twitter:description"]', m.og);
    doc.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === l));
    });
    showShots(l);
    try { localStorage.setItem(KEY, l); } catch (e) { /* storage unavailable */ }
  }

  /* App screenshots, one per language. While a path is empty the "in preparation"
     placeholder stays. To publish real screenshots (portrait, about 9:19.5), add the
     files and set data-image-ko / data-image-en on the <figure>, for example
     data-image-ko="images/screens/home-ko.png". */
  function showShots(l) {
    doc.querySelectorAll('figure[data-shot]').forEach(function (fig) {
      var src = l === 'en' ? fig.dataset.imageEn : fig.dataset.imageKo;
      var img = fig.querySelector('.shot-img'), slot = fig.querySelector('.slot');
      img.hidden = true; slot.hidden = false;
      if (!src) { img.onload = null; img.removeAttribute('src'); return; }
      img.onload = function () { img.hidden = false; slot.hidden = true; };
      img.src = src;
    });
  }

  var saved = 'ko';
  try { saved = localStorage.getItem(KEY) || 'ko'; } catch (e) { /* ignore */ }
  setLang(saved === 'en' ? 'en' : 'ko');
  doc.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.lang); });
  });

  /* Mobile menu */
  var btn = doc.querySelector('.menu-btn');
  var nav = doc.getElementById('site-nav');
  function closeMenu() {
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }
  btn.addEventListener('click', function () {
    btn.setAttribute('aria-expanded', String(nav.classList.toggle('open')));
  });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); btn.focus(); }
  });

  /* Highlight the navigation link of the section being read: the last section
     whose top has passed 40% of the window. */
  var links = doc.querySelectorAll('#site-nav a');
  var sections = doc.querySelectorAll('main > section');
  var queued = false;
  function updateNav() {
    queued = false;
    var current = '';
    sections.forEach(function (s) {
      if (s.getBoundingClientRect().top <= window.innerHeight * 0.4) current = s.id;
    });
    links.forEach(function (a) {
      var on = a.getAttribute('href') === '#' + current;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
    });
  }
  function queueNav() {
    if (!queued) { queued = true; window.requestAnimationFrame(updateNav); }
  }
  window.addEventListener('scroll', queueNav, { passive: true });
  window.addEventListener('resize', queueNav);
  updateNav();
})();
