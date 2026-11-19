/* ============================================================
   RINGO — страница «Магазины»: поиск по городу/адресу, «Показать ещё»,
   Яндекс-карта. Разметка полностью отрендерена в HTML; JS только
   скрывает/показывает строки (без JS виден весь список).
   ============================================================ */
(function () {
  'use strict';
  var root = document.querySelector('[data-stores]');
  if (!root) return;

  var input = root.querySelector('[data-stores-q]');
  var clearBtn = root.querySelector('[data-stores-clear]');
  var countEl = root.querySelector('[data-stores-count]');
  var noneEl = root.querySelector('[data-stores-none]');
  var moreBtn = root.querySelector('[data-stores-more]');
  var ownGroup = root.querySelector('[data-stores-group="own"]');
  var parGroup = root.querySelector('[data-stores-group="par"]');
  var ownRows = [].slice.call(ownGroup.querySelectorAll('.st-row'));
  var parRows = [].slice.call(parGroup.querySelectorAll('.st-row'));

  var FIRST = 12, STEP = 24;
  var shown = FIRST;

  function plural(n) {
    var a = n % 10, b = n % 100;
    if (a === 1 && b !== 11) return 'салон';
    if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return 'салона';
    return 'салонов';
  }

  function render() {
    var q = input.value.trim().toLowerCase();
    var own = ownRows.filter(function (r) { return !q || r.getAttribute('data-search').indexOf(q) >= 0; });
    var par = parRows.filter(function (r) { return !q || r.getAttribute('data-search').indexOf(q) >= 0; });
    var limit = q ? par.length : shown;
    var n = own.length + par.length;

    ownRows.forEach(function (r) { r.hidden = own.indexOf(r) < 0; });
    parRows.forEach(function (r) { var i = par.indexOf(r); r.hidden = i < 0 || i >= limit; });
    ownGroup.hidden = own.length === 0;
    parGroup.hidden = par.length === 0;
    noneEl.hidden = !(q && n === 0);
    moreBtn.hidden = !(limit < par.length);
    clearBtn.hidden = !q;
    countEl.textContent = n ? (q ? 'Найдено: ' : 'Всего ') + n + ' ' + plural(n) : '';
  }

  input.addEventListener('input', function () { shown = FIRST; render(); });
  clearBtn.addEventListener('click', function () { input.value = ''; shown = FIRST; render(); input.focus(); });
  moreBtn.addEventListener('click', function () { shown += STEP; render(); });
  render();

  /* --- карта (Яндекс.Карты 2.1); без API остаётся заглушка --- */
  var mapNode = root.querySelector('[data-stores-map]');
  function initMap() {
    if (!mapNode || typeof ymaps === 'undefined') return false;
    var pts;
    try { pts = JSON.parse(mapNode.getAttribute('data-points')); } catch (e) { return true; }
    ymaps.ready(function () {
      var map = new ymaps.Map(mapNode, { center: [56.0, 70.0], zoom: 3, controls: ['zoomControl'] }, { suppressMapOpenBlock: true });
      map.behaviors.disable('scrollZoom');
      var cl = new ymaps.Clusterer({ preset: 'islands#invertedDarkGoldClusterIcons', groupByCoordinates: false });
      cl.add(pts.map(function (p) {
        return new ymaps.Placemark(p.c, { balloonContentHeader: p.t, balloonContentBody: p.a, hintContent: p.t },
          { preset: 'islands#darkGoldDotIcon' });
      }));
      map.geoObjects.add(cl);
      if (pts.length) map.setBounds(cl.getBounds(), { checkZoomRange: true, zoomMargin: 40 });
      mapNode.classList.add('is-ready');
    });
    return true;
  }
  /* скрипт карты грузится async — ждём его до ~5 секунд */
  var tries = 0;
  (function wait() { if (!initMap() && tries++ < 25) window.setTimeout(wait, 200); })();
})();
