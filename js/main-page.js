/* ============================================================
   RINGO — интерактив главной страницы.
   Заменяет React-логику макета (support.js) и Swiper на лёгкий JS
   без зависимостей. Разметка управляется атрибутами и классами:
     • .is-active / .is-current / .is-moved / .is-end — состояния
     • data-pos — положение карточки коллекции в coverflow
   Модули независимы: если блока нет на странице — он пропускается.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia('(max-width: 900px)');

  /* ----------------------------------------------------------
     1. Hero: смена баннеров (автосмена, точки, свайп)
     ---------------------------------------------------------- */
  (function hero() {
    var root = document.querySelector('[data-hero]');
    if (!root) return;
    var slides = [].slice.call(root.querySelectorAll('[data-hero-slide]'));
    var dots = [].slice.call(root.querySelectorAll('[data-hero-dot]'));
    if (slides.length < 2) return;

    var INTERVAL = 6000;
    var current = 0;
    var timer = null;

    function show(i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        var on = k === current;
        s.classList.toggle('is-active', on);
        s.setAttribute('aria-hidden', on ? 'false' : 'true');
        s.tabIndex = on ? 0 : -1;
      });
      dots.forEach(function (d, k) {
        d.classList.toggle('is-active', k === current);
        d.setAttribute('aria-current', k === current ? 'true' : 'false');
      });
      /* тема точек: на тёмном баннере — светлые точки */
      root.setAttribute('data-tone', slides[current].getAttribute('data-tone') || 'light');
    }

    function stop() { if (timer) { window.clearInterval(timer); timer = null; } }
    function start() {
      stop();
      if (reduceMotion) return;
      timer = window.setInterval(function () {
        /* на мобильном не листаем, пока страница прокручена вниз */
        if (isMobile.matches && window.scrollY > 40) return;
        show(current + 1);
      }, INTERVAL);
    }

    dots.forEach(function (d, k) {
      d.addEventListener('click', function () { show(k); start(); });
    });

    /* пауза при наведении / фокусе и когда вкладка скрыта */
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });

    /* свайп */
    var x0 = null, y0 = null;
    root.addEventListener('touchstart', function (e) {
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; stop();
    }, { passive: true });
    root.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      var dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) show(current + (dx < 0 ? 1 : -1));
      x0 = y0 = null; start();
    }, { passive: true });

    show(0);
    start();
  })();

  /* ----------------------------------------------------------
     2. Полка: табы «Новинки / Бестселлеры»
     ---------------------------------------------------------- */
  (function tabs() {
    var tabs = [].slice.call(document.querySelectorAll('[data-shelf-tab]'));
    var panels = [].slice.call(document.querySelectorAll('[data-shelf-panel]'));
    if (!tabs.length) return;

    function select(id) {
      tabs.forEach(function (t) {
        var on = t.getAttribute('data-shelf-tab') === id;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (p) {
        p.hidden = p.getAttribute('data-shelf-panel') !== id;
      });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t.getAttribute('data-shelf-tab')); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        var n = tabs[(i + d + tabs.length) % tabs.length];
        n.focus(); select(n.getAttribute('data-shelf-tab'));
      });
    });
  })();

  /* ----------------------------------------------------------
     5. Коллекции: coverflow на десктопе, лента со snap на мобильном
     ---------------------------------------------------------- */
  (function collections() {
    var root = document.querySelector('[data-cf]');
    if (!root) return;
    var track = root.querySelector('[data-cf-track]');
    var items = [].slice.call(root.querySelectorAll('[data-cf-item]'));
    var title = root.querySelector('[data-cf-title]');
    var prev = root.querySelector('[data-cf-prev]');
    var next = root.querySelector('[data-cf-next]');
    var n = items.length;
    var cur = 0;

    /* --- десктоп --- */
    function render() {
      items.forEach(function (el, i) {
        var r = i - cur;
        if (r > n / 2) r -= n;
        if (r < -n / 2) r += n;
        var pos = Math.max(-4, Math.min(4, r));
        el.setAttribute('data-pos', pos);
        el.classList.toggle('is-current', r === 0);
        el.setAttribute('aria-hidden', r === 0 ? 'false' : 'true');
        el.tabIndex = r === 0 ? 0 : -1;
      });
      if (title) {
        title.textContent = items[cur].getAttribute('data-name');
        title.classList.remove('is-changing');
        void title.offsetWidth;
        if (!reduceMotion) title.classList.add('is-changing');
      }
    }
    function go(i) { cur = ((i % n) + n) % n; render(); }

    /* --- мобильный: стрелки листают ленту на одну карточку --- */
    function stepWidth() {
      var a = items[0], b = items[1];
      return b ? b.offsetLeft - a.offsetLeft : a.offsetWidth;
    }
    function syncArrows() {
      root.classList.toggle('is-moved', track.scrollLeft > 4);
      root.classList.toggle('is-end', track.scrollLeft + track.clientWidth >= track.scrollWidth - 4);
    }

    if (prev) prev.addEventListener('click', function () {
      if (isMobile.matches) track.scrollBy({ left: -stepWidth(), behavior: 'smooth' }); else go(cur - 1);
    });
    if (next) next.addEventListener('click', function () {
      if (isMobile.matches) track.scrollBy({ left: stepWidth(), behavior: 'smooth' }); else go(cur + 1);
    });

    /* клик по боковой карточке выводит её в центр; по центральной — обычный переход */
    items.forEach(function (el, i) {
      el.addEventListener('click', function (e) {
        if (!isMobile.matches && i !== cur) { e.preventDefault(); go(i); }
      });
    });

    root.addEventListener('keydown', function (e) {
      if (isMobile.matches) return;
      if (e.key === 'ArrowRight') { go(cur + 1); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { go(cur - 1); e.preventDefault(); }
    });

    track.addEventListener('scroll', syncArrows, { passive: true });
    window.addEventListener('resize', syncArrows);
    render();
    syncArrows();
  })();
})();
