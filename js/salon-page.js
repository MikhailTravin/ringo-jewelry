/* =====================================================================
   RINGO · Карточка одного салона (Прототип 3)
   - Переключение фотографий галереи (миниатюры → главное фото)
   - Карта одного салона: одна метка, данные из data-атрибутов #salon-map
   Никаких инлайн-скриптов; координаты берутся из разметки.
   ===================================================================== */
(function () {
  'use strict';

  var root = document.querySelector('[data-salon-page]');
  if (!root) return;

  /* ---------------- Галерея: миниатюры → главное фото ---------------- */
  (function initGallery() {
    var mainImg = document.querySelector('.salon-gallery-main img');
    var thumbs = Array.prototype.slice.call(document.querySelectorAll('.salon-thumb'));
    if (!mainImg || !thumbs.length) return;

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var full = thumb.getAttribute('data-full');
        var alt = thumb.getAttribute('data-alt') || mainImg.alt;
        if (!full) {
          var innerImg = thumb.querySelector('img');
          if (innerImg) full = innerImg.currentSrc || innerImg.src;
        }
        if (full) {
          mainImg.src = full;
          mainImg.alt = alt;
        }
        thumbs.forEach(function (t) {
          t.classList.remove('is-active');
          t.setAttribute('aria-pressed', 'false');
        });
        thumb.classList.add('is-active');
        thumb.setAttribute('aria-pressed', 'true');
      });
    });
  })();

  /* ---------------- Подсветка сегодняшнего дня в таблице часов ---------------- */
  (function highlightToday() {
    var table = document.querySelector('.salon-hours');
    if (!table) return;
    var rows = table.querySelectorAll('tbody tr');
    if (!rows.length) return;
    // JS: 0=Вс..6=Сб → в таблице строки идут Пн..Вс (индекс 0=Пн)
    var jsDay = new Date().getDay();
    var rowIndex = jsDay === 0 ? 6 : jsDay - 1;
    if (rows[rowIndex]) rows[rowIndex].classList.add('is-today');
  })();

  /* ---------------- Карта одного салона ---------------- */
  (function initSalonMap() {
    var mapNode = document.getElementById('salon-map');
    if (!mapNode || typeof ymaps === 'undefined') return;

    var coords = parseCoords(mapNode.getAttribute('data-coords'));
    if (!coords) return;

    var title = mapNode.getAttribute('data-title') || 'Салон RINGO';
    var addr = mapNode.getAttribute('data-addr') || '';
    var type = mapNode.getAttribute('data-type') || 'partner';

    ymaps.ready(function () {
      var map = new ymaps.Map(mapNode, {
        center: coords,
        zoom: 16,
        controls: ['zoomControl', 'geolocationControl']
      });

      var balloon =
        '<div class="ymap-balloon-title">' + escapeHtml(title) + '</div>' +
        (addr ? '<div class="ymap-balloon-addr">' + escapeHtml(addr) + '</div>' : '');

      var pm = new ymaps.Placemark(coords, {
        balloonContentBody: balloon,
        hintContent: title
      }, {
        preset: type === 'flagship' ? 'islands#goldDotIcon' : 'islands#brownDotIcon'
      });
      map.geoObjects.add(pm);
    });
  })();

  function parseCoords(str) {
    if (!str) return null;
    var parts = str.split(',').map(function (s) { return parseFloat(s.trim()); });
    if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) return null;
    return parts;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
})();
