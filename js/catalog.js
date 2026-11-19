/* ============================================================
   RINGO — каталожная / теговая страница.
   Прогрессивное улучшение: фильтр-панель, кастомная сортировка,
   клиентская сортировка карточек по цене, избранное, FAQ-аккордеон.
   Подключается через <script src>, без инлайна. Работает и без JS
   (панель фильтра — обычная <form>, ссылки пагинации кликабельны).
   ============================================================ */
(function () {
  'use strict';

  /* --- 1. Раскрытие/сворачивание панели фильтра --- */
  var filterToggle = document.getElementById('cat-filter-toggle');
  var filterPanel = document.getElementById('cat-filter-panel');
  if (filterToggle && filterPanel) {
    filterToggle.addEventListener('click', function () {
      var open = filterPanel.hasAttribute('hidden');
      if (open) {
        filterPanel.removeAttribute('hidden');
      } else {
        filterPanel.setAttribute('hidden', '');
      }
      filterToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* --- 2. Кастомный дропдаун сортировки --- */
  var sort = document.getElementById('cat-sort');
  var grid = document.getElementById('cat-grid');
  if (sort) {
    var trigger = sort.querySelector('.cat-sort-trigger');
    var label = sort.querySelector('.cat-sort-label');
    var options = sort.querySelectorAll('.cat-sort-option');

    var closeSort = function () {
      sort.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    };

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var willOpen = !sort.classList.contains('is-open');
      sort.classList.toggle('is-open', willOpen);
      trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });

    options.forEach(function (opt) {
      opt.addEventListener('click', function () {
        options.forEach(function (o) { o.setAttribute('aria-selected', 'false'); });
        opt.setAttribute('aria-selected', 'true');
        if (label) label.textContent = opt.textContent;
        applySort(opt.getAttribute('data-value'));
        closeSort();
      });
    });

    document.addEventListener('click', function (e) {
      if (!sort.contains(e.target)) closeSort();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSort();
    });
  }

  /* --- Клиентская сортировка карточек по цене --- */
  function priceOf(card) {
    var el = card.querySelector('.cat-card-price');
    if (!el) return 0;
    var digits = el.textContent.replace(/[^0-9]/g, '');
    return digits ? parseInt(digits, 10) : 0;
  }

  function applySort(value) {
    if (!grid) return;
    var cards = Array.prototype.slice.call(grid.children);
    if (!value) return; // «По умолчанию» — исходный порядок не восстанавливаем (демо)
    cards.sort(function (a, b) {
      var pa = priceOf(a), pb = priceOf(b);
      return value === 'price-asc' ? pa - pb : pb - pa;
    });
    cards.forEach(function (c) { grid.appendChild(c); });
  }

  /* --- 3. Избранное (визуальный переключатель) --- */
  var favs = document.querySelectorAll('.cat-fav');
  favs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var pressed = btn.getAttribute('aria-pressed') === 'true';
      btn.setAttribute('aria-pressed', pressed ? 'false' : 'true');
    });
  });

  /* --- 4. «Показать ещё»: в статическом прототипе ведёт на след. страницу --- */
  var loadMore = document.getElementById('cat-loadmore');
  if (loadMore) {
    loadMore.addEventListener('click', function () {
      var next = loadMore.getAttribute('data-next');
      if (next) window.location.href = next;
    });
  }

  /* --- 5. FAQ-аккордеон: открытие одного закрывает остальные --- */
  var faqItems = document.querySelectorAll('.enc-faq .enc-faq-item');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });
})();
