/* =====================================================================
   RINGO · Раздел «Магазины» — интерактив
   - Рабочий селектор города: фильтрация списка + центровка карты
   - Сегмент-переключатель «Все / Фирменные / Представительства»
   - Общая карта с кластеризацией (ymaps.clusterer)
   - Чекбокс «В моём городе» по геолокации браузера
   - Скролл к карте + центровка метки по адресу в карточке
   Данные берутся из data-атрибутов разметки — координаты не дублируются в JS.
   ===================================================================== */
(function () {
  'use strict';

  var page = document.querySelector('[data-salons-page]');
  if (!page) return;

  var citySelect   = document.getElementById('salons-city');
  var segmentBtns  = Array.prototype.slice.call(document.querySelectorAll('.salons-segment button'));
  var geoCheckbox  = document.getElementById('salons-geo');
  var cards        = Array.prototype.slice.call(document.querySelectorAll('.salon-card'));
  var groups       = Array.prototype.slice.call(document.querySelectorAll('.salons-city-group'));
  var emptyState   = document.getElementById('salons-empty');
  var mapNode      = document.getElementById('salons-map');

  var state = { city: '', type: 'all', geoCity: '' };
  var mapApi = null; // { map, clusterer, placemarks: {id: placemark} }

  /* ---------------- Фильтрация списка ---------------- */
  function cardMatches(card) {
    var city = card.getAttribute('data-city') || '';
    var type = card.getAttribute('data-type') || '';
    var cityOk = !state.city || city === state.city;
    var typeOk = state.type === 'all' || type === state.type;
    return cityOk && typeOk;
  }

  function applyFilter() {
    var anyVisible = false;

    groups.forEach(function (group) {
      var groupCards = Array.prototype.slice.call(group.querySelectorAll('.salon-card'));
      var visibleInGroup = 0;
      groupCards.forEach(function (card) {
        var show = cardMatches(card);
        card.hidden = !show;
        if (show) { visibleInGroup++; anyVisible = true; }
      });
      group.hidden = visibleInGroup === 0;
    });

    if (emptyState) emptyState.hidden = anyVisible;
    updateMapFilter();
  }

  /* ---------------- Селектор города ---------------- */
  if (citySelect) {
    citySelect.addEventListener('change', function () {
      state.city = citySelect.value;
      applyFilter();
      if (state.city) centerMapOnCity(state.city);
      else resetMapView();
    });
  }

  /* ---------------- Сегмент-переключатель ---------------- */
  segmentBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      segmentBtns.forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      state.type = btn.getAttribute('data-type') || 'all';
      applyFilter();
    });
  });

  /* ---------------- Геолокация «В моём городе» ---------------- */
  if (geoCheckbox) {
    geoCheckbox.addEventListener('change', function () {
      if (!geoCheckbox.checked) {
        // Возврат к текущему выбору селектора
        state.city = citySelect ? citySelect.value : '';
        applyFilter();
        return;
      }
      if (!navigator.geolocation) {
        geoCheckbox.checked = false;
        return;
      }
      navigator.geolocation.getCurrentPosition(function (pos) {
        var nearest = findNearestCity(pos.coords.latitude, pos.coords.longitude);
        if (nearest) {
          state.geoCity = nearest;
          state.city = nearest;
          if (citySelect) citySelect.value = nearest;
          applyFilter();
          centerMapOnCity(nearest);
        }
      }, function () {
        geoCheckbox.checked = false;
      });
    });
  }

  function findNearestCity(lat, lng) {
    var best = null, bestDist = Infinity;
    cards.forEach(function (card) {
      var c = parseCoords(card.getAttribute('data-coords'));
      if (!c) return;
      var d = Math.pow(c[0] - lat, 2) + Math.pow(c[1] - lng, 2);
      if (d < bestDist) { bestDist = d; best = card.getAttribute('data-city'); }
    });
    return best;
  }

  function parseCoords(str) {
    if (!str) return null;
    var parts = str.split(',').map(function (s) { return parseFloat(s.trim()); });
    if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) return null;
    return parts;
  }

  /* ---------------- Скролл к карте по клику на адрес карточки ---------------- */
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-map-focus]');
    if (!trigger) return;
    e.preventDefault();
    var coords = parseCoords(trigger.getAttribute('data-map-focus'));
    if (mapNode) {
      mapNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (coords && mapApi && mapApi.map) {
      mapApi.map.setCenter(coords, 15, { duration: 700 });
    }
  });

  /* =================================================================
     Яндекс.Карты — общая карта сети с кластеризацией
     ================================================================= */
  function collectPoints() {
    return cards.map(function (card) {
      var coords = parseCoords(card.getAttribute('data-coords'));
      if (!coords) return null;
      return {
        id: card.id,
        coords: coords,
        city: card.getAttribute('data-city') || '',
        type: card.getAttribute('data-type') || '',
        title: card.getAttribute('data-title') || 'Салон RINGO',
        addr: card.getAttribute('data-addr') || '',
        url: card.getAttribute('data-url') || '#'
      };
    }).filter(Boolean);
  }

  function initMap() {
    if (!mapNode || typeof ymaps === 'undefined') return;

    // Режим карты: 'cluster' (хаб, 80+ точек) или 'plain' (город — метки без кластеризации)
    var plain = mapNode.getAttribute('data-map-mode') === 'plain';

    ymaps.ready(function () {
      var points = collectPoints();
      // Убираем заглушку-плейсхолдер перед монтированием карты в узел,
      // иначе Яндекс.Карты добавят свой слой рядом с ней и карта «съедет» вниз.
      mapNode.innerHTML = '';
      var map = new ymaps.Map(mapNode, {
        center: [61.5, 90.0], // центр России (переопределяется через setBounds)
        zoom: 3,
        controls: ['zoomControl', 'geolocationControl']
      });

      var placemarks = {};
      var geoObjects = [];

      points.forEach(function (p) {
        var balloon =
          '<div class="ymap-balloon-title">' + escapeHtml(p.title) + '</div>' +
          (p.addr ? '<div class="ymap-balloon-addr">' + escapeHtml(p.addr) + '</div>' : '') +
          '<a class="ymap-balloon-link" href="' + p.url + '">Подробнее о салоне →</a>';

        var pm = new ymaps.Placemark(p.coords, {
          balloonContentBody: balloon
        }, {
          preset: p.type === 'flagship' ? 'islands#goldDotIcon' : 'islands#brownDotIcon'
        });
        pm.ringoData = p;
        placemarks[p.id] = pm;
        geoObjects.push(pm);
      });

      var clusterer = null;
      if (plain) {
        // Карта города / одиночная карта — метки напрямую, без кластеризации
        geoObjects.forEach(function (pm) { map.geoObjects.add(pm); });
      } else {
        clusterer = new ymaps.Clusterer({
          preset: 'islands#invertedDarkClusterIcons',
          groupByCoordinates: false,
          clusterDisableClickZoom: false,
          gridSize: 64
        });
        clusterer.add(geoObjects);
        map.geoObjects.add(clusterer);
      }

      // Уместить все точки в кадр
      if (geoObjects.length) {
        if (geoObjects.length === 1) {
          map.setCenter(points[0].coords, plain ? 15 : 10);
        } else {
          map.setBounds(getBoundsOf(points), { checkZoomRange: true, zoomMargin: 40 });
        }
      }

      mapApi = { map: map, clusterer: clusterer, placemarks: placemarks, points: points, plain: plain };
    });
  }

  function getBoundsOf(pts) {
    var lats = pts.map(function (p) { return p.coords[0]; });
    var lngs = pts.map(function (p) { return p.coords[1]; });
    return [[Math.min.apply(null, lats), Math.min.apply(null, lngs)],
            [Math.max.apply(null, lats), Math.max.apply(null, lngs)]];
  }

  function updateMapFilter() {
    if (!mapApi || !mapApi.clusterer) return;
    var visible = [];
    mapApi.points.forEach(function (p) {
      var pm = mapApi.placemarks[p.id];
      if (!pm) return;
      var cityOk = !state.city || p.city === state.city;
      var typeOk = state.type === 'all' || p.type === state.type;
      if (cityOk && typeOk) visible.push(pm);
    });
    mapApi.clusterer.removeAll();
    mapApi.clusterer.add(visible);
  }

  function centerMapOnCity(city) {
    if (!mapApi) return;
    var pts = mapApi.points.filter(function (p) { return p.city === city; });
    if (!pts.length) return;
    if (pts.length === 1) {
      mapApi.map.setCenter(pts[0].coords, 14, { duration: 600 });
    } else {
      var lats = pts.map(function (p) { return p.coords[0]; });
      var lngs = pts.map(function (p) { return p.coords[1]; });
      var bounds = [[Math.min.apply(null, lats), Math.min.apply(null, lngs)],
                    [Math.max.apply(null, lats), Math.max.apply(null, lngs)]];
      mapApi.map.setBounds(bounds, { checkZoomRange: true, zoomMargin: 60 });
    }
  }

  function resetMapView() {
    if (!mapApi) return;
    if (mapApi.points.length > 1) {
      mapApi.map.setBounds(getBoundsOf(mapApi.points), { checkZoomRange: true, zoomMargin: 40 });
    } else if (mapApi.points.length === 1) {
      mapApi.map.setCenter(mapApi.points[0].coords, mapApi.plain ? 15 : 10);
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  initMap();
})();
