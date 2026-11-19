/* ============================================================
   RINGO — общий скрипт шапки: бургер-меню (второстепенные разделы).
   Подключается на всех страницах через <script src="js/header.js">.
   Прогрессивное улучшение: без JS ссылки drawer недоступны, но
   основное меню (5 пунктов) работает всегда.
   ============================================================ */
(function () {
  'use strict';

  var burger = document.getElementById('header-burger');
  var drawer = document.getElementById('header-drawer');
  var backdrop = document.getElementById('header-drawer-backdrop');
  var drawerClose = document.getElementById('header-drawer-close');
  if (!burger || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.removeAttribute('hidden');
    backdrop.removeAttribute('hidden');
    // reflow, чтобы сработала transition открытия
    void drawer.offsetWidth;
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    var firstLink = drawer.querySelector('.header-drawer-nav a');
    if (firstLink) firstLink.focus();
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    // прячем после анимации
    window.setTimeout(function () {
      if (!drawer.classList.contains('is-open')) {
        drawer.setAttribute('hidden', '');
        backdrop.setAttribute('hidden', '');
      }
    }, 460);
    burger.focus();
  }

  burger.addEventListener('click', openDrawer);
  backdrop.addEventListener('click', closeDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
  });
})();
