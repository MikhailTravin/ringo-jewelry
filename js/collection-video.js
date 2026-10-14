/* =====================================================================
   RINGO · Видео коллекции — ленивый плеер в модалке
   ---------------------------------------------------------------------
   На странице лежит только постер-кнопка .video-poster с data-атрибутами:
     data-video-id  — идентификатор ролика на RuTube (обязателен),
     data-video-src — (необязательно) полный embed-URL, если нужно
                      переопределить площадку/параметры,
     data-video-title — заголовок для доступности (aria-label iframe).

   Тяжёлый iframe плеера НЕ присутствует в разметке. Он создаётся ТОЛЬКО
   при открытии модалки и удаляется при закрытии — так страница остаётся
   лёгкой, а видео не продолжает играть/грузиться в фоне.

   Разметка модалки (одна на страницу) генерируется этим скриптом, чтобы
   не держать пустой каркас в HTML. Никаких inline-скриптов/стилей.
   ===================================================================== */
(function () {
  'use strict';

  var posters = Array.prototype.slice.call(document.querySelectorAll('.video-poster'));
  if (!posters.length) return;

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var modal, dialog, frame, closeBtn;
  var lastFocused = null;

  /* ---------- Построение embed-URL RuTube ---------- */
  function buildSrc(poster) {
    var explicit = poster.getAttribute('data-video-src');
    if (explicit) return explicit;
    var id = poster.getAttribute('data-video-id');
    if (!id) return '';
    // RuTube embed. autoplay=1 — запуск сразу после открытия модалки.
    return 'https://rutube.ru/play/embed/' + encodeURIComponent(id) + '/?autoplay=1';
  }

  /* ---------- Ленивая сборка модалки (один раз) ---------- */
  function ensureModal() {
    if (modal) return;

    modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Видео коллекции');
    modal.hidden = true;

    dialog = document.createElement('div');
    dialog.className = 'video-modal-dialog';

    frame = document.createElement('div');
    frame.className = 'video-modal-frame';

    closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'video-modal-close';
    closeBtn.setAttribute('aria-label', 'Закрыть видео');
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.6');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('aria-hidden', 'true');
    var path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', 'M6 6l12 12M18 6L6 18');
    svg.appendChild(path);
    closeBtn.appendChild(svg);

    dialog.appendChild(closeBtn);
    dialog.appendChild(frame);
    modal.appendChild(dialog);
    document.body.appendChild(modal);

    // Закрытие: крестик, клик по фону, Esc
    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) close();
    });
    document.addEventListener('keydown', function (e) {
      if ((e.key === 'Escape' || e.key === 'Esc') && modal.classList.contains('is-open')) {
        close();
      }
    });
  }

  /* ---------- Открытие ---------- */
  function open(poster) {
    var src = buildSrc(poster);
    if (!src) return;

    ensureModal();
    lastFocused = document.activeElement;

    // Создаём iframe ТОЛЬКО сейчас (ленивая подгрузка плеера)
    frame.innerHTML = '';
    var iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.setAttribute('title', poster.getAttribute('data-video-title') || 'Видео коллекции RINGO');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; encrypted-media');
    iframe.setAttribute('allowfullscreen', '');
    frame.appendChild(iframe);

    modal.hidden = false;
    document.body.classList.add('video-modal-open');
    // reflow, затем класс для плавного появления
    void modal.offsetWidth;
    modal.classList.add('is-open');
    closeBtn.focus();
  }

  /* ---------- Закрытие ---------- */
  function close() {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('video-modal-open');

    var onEnd = function () {
      modal.hidden = true;
      // Удаляем iframe — видео перестаёт грузиться/играть в фоне
      frame.innerHTML = '';
      modal.removeEventListener('transitionend', onEnd);
    };
    modal.addEventListener('transitionend', onEnd);
    // подстраховка, если transitionend не сработает
    setTimeout(function () {
      if (modal && !modal.classList.contains('is-open')) {
        modal.hidden = true;
        frame.innerHTML = '';
      }
    }, 500);

    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  /* ---------- Навешивание на постеры ---------- */
  posters.forEach(function (poster) {
    poster.addEventListener('click', function () { open(poster); });
  });
})();
