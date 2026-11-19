/* ============================================================
   RINGO — поведение общего каркаса (шапка, меню, подвал).
   Заменяет React-логику макета. Без зависимостей.

   Хуки в разметке (data-атрибуты):
     [data-rg-header]            шапка (десктоп)
     [data-hero]                 баннер на странице: если есть — шапка
                                 прозрачная поверх него; data-tone="dark"
                                 на баннере делает шапку светлой
     [data-header-trigger]       блок, который «наезжает» на баннер;
                                 когда его верх выше 140 px — шапка белая
     [data-mega]                 мега-меню «Ювелирные украшения»
     [data-drawer] / [data-sheet] мобильное меню и лист «Есть вопросы?»
     [data-footer-group]         группа ссылок подвала (аккордеон на мобильном)
   ============================================================ */
(function () {
  'use strict';

  var mqMobile = window.matchMedia('(max-width: 900px)');
  var root = document.documentElement;

  /* ----------------------------------------------------------
     1. Шапка: прозрачная / белая / тёмная тема, мега-меню
     ---------------------------------------------------------- */
  (function header() {
    var el = document.querySelector('[data-rg-header]');
    if (!el) return;

    var hero = document.querySelector('[data-hero]');
    var trigger = document.querySelector('[data-header-trigger]');
    var megaJew = el.querySelector('[data-mega="jewelry"]');
    var megaBuy = el.querySelector('[data-mega="buy"]');
    var openers = {
      jewelry: el.querySelector('[data-mega-open="jewelry"]'),
      buy: el.querySelector('[data-mega-open="buy"]')
    };
    var state = { open: null, scrolled: false };

    function heroTone() { return hero ? hero.getAttribute('data-tone') : 'light'; }

    function render() {
      var open = !!state.open;
      var solid = !hero || state.scrolled || open;
      el.classList.toggle('is-solid', solid);
      el.classList.toggle('is-open', open);
      el.classList.toggle('is-dark', !solid && heroTone() === 'dark');

      megaJew.hidden = state.open !== 'jewelry';
      megaBuy.hidden = state.open !== 'buy';
      Object.keys(openers).forEach(function (k) {
        openers[k].classList.toggle('is-on', state.open === k);
        openers[k].setAttribute('aria-expanded', state.open === k ? 'true' : 'false');
      });
      if (!state.open) { resetCard(); setExpanded(false); }
    }
    function open(name) { if (state.open !== name) { state.open = name; render(); } }
    function close() { if (state.open) { state.open = null; render(); } }

    /* --- открытие по наведению / фокусу / клику --- */
    Object.keys(openers).forEach(function (k) {
      var a = openers[k];
      a.addEventListener('mouseenter', function () { open(k); });
      a.addEventListener('focus', function () { open(k); });
      a.addEventListener('click', function (e) { e.preventDefault(); state.open === k ? close() : open(k); });
    });
    [].forEach.call(el.querySelectorAll('[data-mega-close]'), function (a) {
      a.addEventListener('mouseenter', close);
    });
    el.addEventListener('mouseleave', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    /* --- «Все коллекции»: раскрытие полного списка --- */
    function setExpanded(v) { megaJew.setAttribute('data-expanded', v ? 'true' : 'false'); }
    var expandBtn = megaJew.querySelector('[data-mega-expand]');
    var allBlock = megaJew.querySelector('.rg-mega__all');
    var featBlock = megaJew.querySelector('.rg-mega__featured');
    if (expandBtn) {
      ['mouseenter', 'focus', 'click'].forEach(function (ev) {
        expandBtn.addEventListener(ev, function () { setExpanded(true); });
      });
      allBlock.addEventListener('mouseleave', function () { setExpanded(false); resetCard(); });
      featBlock.addEventListener('mouseleave', resetCard);
    }

    /* --- превью-карточка: акция по умолчанию, коллекция при наведении --- */
    var card = megaJew.querySelector('[data-mega-card]');
    var f = {
      img: card.querySelector('[data-card-img]'),
      tag: card.querySelector('[data-card-tag]'),
      title: card.querySelector('[data-card-title]'),
      desc: card.querySelector('[data-card-desc]'),
      link: card.querySelector('[data-card-link]')
    };
    var promo = {
      src: f.img.getAttribute('src'), alt: f.img.getAttribute('alt'), pos: f.img.getAttribute('data-pos'),
      href: card.getAttribute('href'), tag: f.tag.textContent, title: '', desc: f.desc.textContent, link: f.link.textContent
    };
    function paint(d) {
      f.img.src = d.src; f.img.alt = d.alt; f.img.style.objectPosition = d.pos;
      card.setAttribute('href', d.href);
      f.tag.textContent = d.tag; f.title.textContent = d.title; f.desc.textContent = d.desc; f.link.textContent = d.link;
    }
    function resetCard() {
      [].forEach.call(megaJew.querySelectorAll('.rg-mega__link.is-on'), function (x) { x.classList.remove('is-on'); });
      paint(promo);
    }
    function pick(link) {
      var img = link.getAttribute('data-card-img');
      [].forEach.call(megaJew.querySelectorAll('.rg-mega__link.is-on'), function (x) { x.classList.remove('is-on'); });
      if (!img) { paint(promo); return; }       /* у коллекции пока нет фото/описания — остаётся акция */
      link.classList.add('is-on');
      paint({
        src: img, alt: 'Коллекция «' + link.getAttribute('data-name') + '» РИНГО',
        pos: link.getAttribute('data-card-pos') || '50% 50%', href: link.getAttribute('href'),
        tag: 'Коллекция', title: link.getAttribute('data-name'),
        desc: link.getAttribute('data-card-desc') || '', link: 'Смотреть коллекцию'
      });
    }
    [].forEach.call(megaJew.querySelectorAll('[data-coll]'), function (a) {
      a.addEventListener('mouseenter', function () { pick(a); });
      a.addEventListener('focus', function () { pick(a); });
    });

    /* --- белая шапка, когда баннер почти ушёл --- */
    var ticking = false;
    function measure() {
      ticking = false;
      var sc;
      if (trigger) sc = trigger.getBoundingClientRect().top < 140;
      else if (hero) sc = hero.getBoundingClientRect().bottom < 140;
      else sc = false;
      if (sc !== state.scrolled) { state.scrolled = sc; render(); }
    }
    function onScroll() { if (!ticking) { ticking = true; window.requestAnimationFrame(measure); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    /* тема шапки следует за баннером (атрибут data-tone меняет main-page.js) */
    if (hero && window.MutationObserver) {
      new MutationObserver(render).observe(hero, { attributes: true, attributeFilter: ['data-tone'] });
    }

    render();
    measure();
  })();

  /* ----------------------------------------------------------
     2. Мобильное меню (многоуровневое) и лист «Есть вопросы?»
     ---------------------------------------------------------- */
  (function mobileMenu() {
    var drawer = document.querySelector('[data-drawer]');
    var sheet = document.querySelector('[data-sheet]');
    var toggles = [].slice.call(document.querySelectorAll('[data-drawer-toggle]'));
    var main = drawer && drawer.querySelector('[data-drawer-main]');
    var sub = drawer && drawer.querySelector('[data-drawer-sub]');

    function setInert(node, on) {
      if (!node) return;
      if (on) { node.setAttribute('inert', ''); node.setAttribute('aria-hidden', 'true'); }
      else { node.removeAttribute('inert'); node.removeAttribute('aria-hidden'); }
    }
    function level(n, name) {
      drawer.setAttribute('data-level', n);
      if (name) drawer.setAttribute('data-sub', name);
      setInert(main, n === 2); setInert(sub, n !== 2);
      drawer.scrollTop = 0;
      var target = n === 2 ? sub.querySelector('[data-drawer-back]') : drawer.querySelector('[data-drawer-close]');
      if (target) target.focus({ preventScroll: true });
    }
    function openDrawer() {
      if (!drawer || drawer.open) return;
      drawer.show();
      root.classList.add('rg-lock');
      toggles.forEach(function (t) { t.setAttribute('aria-expanded', 'true'); });
      level(1);
    }
    function closeDrawer() {
      if (!drawer || !drawer.open) return;
      drawer.close();
    }
    if (drawer) {
      drawer.addEventListener('close', function () {
        root.classList.remove('rg-lock');
        toggles.forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
      });
      toggles.forEach(function (t) {
        t.addEventListener('click', function (e) { e.preventDefault(); drawer.open ? closeDrawer() : openDrawer(); });
      });
      [].forEach.call(drawer.querySelectorAll('[data-drawer-close]'), function (b) { b.addEventListener('click', closeDrawer); });
      [].forEach.call(drawer.querySelectorAll('[data-drawer-go]'), function (b) {
        b.addEventListener('click', function () { level(2, b.getAttribute('data-drawer-go')); });
      });
      [].forEach.call(drawer.querySelectorAll('[data-drawer-back]'), function (b) {
        b.addEventListener('click', function () { level(1); });
      });
      /* переход по ссылке внутри меню закрывает его (для якорей на этой же странице) */
      drawer.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a[href^="#"]');
        if (a) closeDrawer();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && drawer.open) { if (drawer.getAttribute('data-level') === '2') level(1); else closeDrawer(); }
      });
      level(1); setInert(sub, true);
    }

    if (sheet) {
      [].forEach.call(document.querySelectorAll('[data-sheet-open]'), function (b) {
        b.addEventListener('click', function (e) { e.preventDefault(); sheet.showModal(); });
      });
      [].forEach.call(sheet.querySelectorAll('[data-sheet-close]'), function (b) {
        b.addEventListener('click', function () { sheet.close(); });
      });
      sheet.addEventListener('click', function (e) { if (e.target === sheet) sheet.close(); });
    }

    /* при переходе на десктоп закрываем мобильные слои */
    function onChange() {
      if (!mqMobile.matches) { closeDrawer(); if (sheet && sheet.open) sheet.close(); }
    }
    if (mqMobile.addEventListener) mqMobile.addEventListener('change', onChange); else mqMobile.addListener(onChange);
  })();

  /* ----------------------------------------------------------
     3. Подвал: на мобильном группы ссылок — аккордеон,
        на десктопе — обычные колонки
     ---------------------------------------------------------- */
  (function footer() {
    var groups = [].slice.call(document.querySelectorAll('[data-footer-group]'));
    if (!groups.length) return;

    function sync() {
      groups.forEach(function (g) {
        var btn = g.querySelector('.rg-footer__title');
        if (mqMobile.matches) {
          btn.removeAttribute('tabindex');
          btn.setAttribute('aria-expanded', g.classList.contains('is-open') ? 'true' : 'false');
        } else {
          btn.setAttribute('tabindex', '-1');
          btn.removeAttribute('aria-expanded');
        }
      });
    }
    groups.forEach(function (g) {
      g.querySelector('.rg-footer__title').addEventListener('click', function () {
        if (!mqMobile.matches) return;
        g.classList.toggle('is-open');
        sync();
      });
    });
    if (mqMobile.addEventListener) mqMobile.addEventListener('change', sync); else mqMobile.addListener(sync);
    sync();
  })();
})();
