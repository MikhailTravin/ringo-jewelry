/* ============================================================
   RINGO — хабовая страница энциклопедии камней.
   Прогрессивное улучшение FAQ: аккордеон на нативных <details>.
   При открытии одного вопроса остальные закрываются.
   Без инлайна: подключается через <script src>.
   ============================================================ */
(function () {
  'use strict';

  var items = document.querySelectorAll('.enc-faq .enc-faq-item');
  if (!items.length) return;

  items.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      items.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });
})();
