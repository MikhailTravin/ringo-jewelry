/* ============================================================
   RINGO — общие компоненты: карточка товара (rg-card).
   • смена фото: мышь — по зоне под курсором, тач/клавиатура — по точкам
   • избранное: переключает aria-pressed и шлёт событие ringo:favorite
     (реальное сохранение подключается на стороне бэкенда)
   ============================================================ */
(function () {
  'use strict';
  var isMobile = window.matchMedia('(max-width: 900px)');

  /* ----------------------------------------------------------
     3. Карточка товара: смена фото
        • мышь — по зоне, над которой курсор (как «быстрый просмотр»)
        • тач / клавиатура — по точкам
     ---------------------------------------------------------- */
  (function cardGallery() {
    var cards = document.querySelectorAll('[data-card-media]');
    [].forEach.call(cards, function (media) {
      var imgs = [].slice.call(media.querySelectorAll('.rg-card__img'));
      var dots = [].slice.call(media.querySelectorAll('.rg-card__dot'));
      if (imgs.length < 2) return;

      function show(i) {
        imgs.forEach(function (im, k) { im.classList.toggle('is-active', k === i); });
        dots.forEach(function (d, k) { d.classList.toggle('is-active', k === i); });
      }
      media.addEventListener('mousemove', function (e) {
        if (isMobile.matches) return;
        var r = media.getBoundingClientRect();
        var i = Math.min(imgs.length - 1, Math.max(0, Math.floor((e.clientX - r.left) / r.width * imgs.length)));
        show(i);
      });
      media.addEventListener('mouseleave', function () { if (!isMobile.matches) show(0); });
      dots.forEach(function (d, k) { d.addEventListener('click', function () { show(k); }); });
    });
  })();

  /* ----------------------------------------------------------
     4. Избранное: визуальное переключение сердечка.
        Реальное сохранение подключается на стороне бэкенда
        (событие ringo:favorite с данными товара).
     ---------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-fav]') : null;
    if (!btn) return;
    var on = btn.getAttribute('aria-pressed') !== 'true';
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.setAttribute('aria-label', on ? 'Убрать из избранного' : 'Добавить в избранное');
    btn.dispatchEvent(new CustomEvent('ringo:favorite', {
      bubbles: true,
      detail: { id: btn.getAttribute('data-fav'), active: on }
    }));
  });

})();
