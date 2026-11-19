/* ============================================================
   RINGO — страница «Избранное» (авторизованный пользователь):
   фильтр по категориям, удаление сердечком с возвратом, счётчики.
   Реальное удаление на бэкенде подключается к событию ringo:favorite
   (его шлёт js/components.js).
   ============================================================ */
(function () {
  'use strict';
  var root = document.querySelector('[data-fav-page]');
  if (!root) return;

  var cards = [].slice.call(root.querySelectorAll('.rg-card'));
  var tabs = [].slice.call(root.querySelectorAll('[data-fv-tab]'));
  var grid = root.querySelector('[data-fv-grid]');
  var emptyCat = root.querySelector('[data-fv-empty-cat]');
  var emptyAll = root.querySelector('[data-fv-empty-all]');
  var countEl = root.querySelector('[data-fv-count]');
  var navN = document.querySelector('[data-fav-n]');
  var toast = document.querySelector('[data-fv-toast]');
  var undoBtn = toast.querySelector('[data-fv-undo]');
  var tab = 'all', last = null, timer = null;

  function plural(n) {
    var a = n % 10, b = n % 100;
    var w = (a === 1 && b !== 11) ? 'украшение' : (a >= 2 && a <= 4 && (b < 12 || b > 14)) ? 'украшения' : 'украшений';
    return n + ' ' + w;
  }
  function live() { return cards.filter(function (c) { return !c.hasAttribute('data-removed'); }); }

  function render() {
    var all = live();
    var shown = all.filter(function (c) { return tab === 'all' || c.getAttribute('data-cat') === tab; });
    cards.forEach(function (c) { c.hidden = shown.indexOf(c) < 0; });
    tabs.forEach(function (t) {
      var k = t.getAttribute('data-fv-tab');
      var n = k === 'all' ? all.length : all.filter(function (c) { return c.getAttribute('data-cat') === k; }).length;
      t.querySelector('[data-fv-n]').textContent = n;
      var on = k === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    countEl.textContent = all.length ? plural(all.length) : '';
    if (navN) navN.textContent = all.length;
    grid.hidden = all.length === 0;
    emptyAll.hidden = all.length !== 0;
    emptyCat.hidden = !(all.length && !shown.length);
    root.querySelector('.fv-tabs').hidden = all.length === 0;
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () { tab = t.getAttribute('data-fv-tab'); render(); });
  });

  /* сердечко на карточке: снято → убираем из списка и предлагаем вернуть */
  root.addEventListener('ringo:favorite', function (e) {
    if (e.detail.active) return;
    var card = e.target.closest('.rg-card');
    if (!card) return;
    card.setAttribute('data-removed', '');
    last = card;
    render();
    toast.hidden = false;
    window.clearTimeout(timer);
    timer = window.setTimeout(function () { toast.hidden = true; last = null; }, 6000);
  });
  undoBtn.addEventListener('click', function () {
    if (!last) return;
    last.removeAttribute('data-removed');
    var b = last.querySelector('[data-fav]');
    b.setAttribute('aria-pressed', 'true'); b.setAttribute('aria-label', 'Убрать из избранного');
    last = null; toast.hidden = true; render();
  });
  render();
})();
