/* ============================================================
   RINGO — интерактив карточки товара (прототип А)
   Перенос поведения исходного прототипа:
   галерея с миниатюрами, переключение цвета золота,
   выбор размера + статус наличия, пересчёт веса,
   корзина/избранное, зум, плавающая нижняя панель.
   ============================================================ */
(function () {
  "use strict";
  var P = window.RINGO_PRODUCT;
  if (!P) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var state = { active: 0, size: "", gold: "white", added: false, wished: false, bought: false, zoom: false };

  /* ---------- Галерея: главный вьюер ---------- */
  var layers = $$(".viewer-layer");
  var thumbs = $$(".thumb");

  function setActive(i) {
    if (i < 0 || i >= layers.length) return;
    state.active = i;
    state.zoom = false;
    layers.forEach(function (l, k) {
      l.classList.toggle("is-active", k === i);
      l.classList.remove("zoomed");
      var v = l.querySelector("video");
      if (v) { if (k === i) { try { v.play(); } catch (e) {} } else { try { v.pause(); } catch (e) {} } }
    });
    thumbs.forEach(function (t) { t.classList.toggle("is-active", +t.getAttribute("data-idx") === i); });
    syncHint();
  }

  thumbs.forEach(function (t) {
    if (t.classList.contains("is-video")) return;
    t.addEventListener("click", function () { setActive(+t.getAttribute("data-idx")); });
  });

  // навигация стрелками (только по фото-ракурсам каталога и остальным фото)
  var prevBtn = $(".viewer-nav.prev"), nextBtn = $(".viewer-nav.next");
  function page(dir) {
    var photo = [];
    P.gallery.forEach(function (g, i) { if (g.kind !== "video") photo.push(i); });
    if (!photo.length) return;
    var pos = photo.indexOf(state.active);
    var next = pos === -1 ? (dir > 0 ? photo[0] : photo[photo.length - 1]) : photo[(pos + dir + photo.length) % photo.length];
    setActive(next);
  }
  if (prevBtn) prevBtn.addEventListener("click", function () { page(-1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { page(1); });

  /* ---------- Зум по клику / кнопке «Рассмотреть детали» ---------- */
  var viewer = $(".viewer");
  var hint = $(".viewer-hint");
  function zoomable() {
    var layer = layers[state.active];
    return !!layer && !layer.classList.contains("cover") && !layer.querySelector("video");
  }
  function syncHint() {
    if (viewer) viewer.classList.toggle("zoomable", zoomable());
    if (!hint) return;
    if (!zoomable()) { hint.hidden = true; return; }
    hint.hidden = false;
    hint.textContent = state.zoom ? "Свернуть" : "Рассмотреть детали";
  }
  function toggleZoom() {
    if (!zoomable()) return;
    state.zoom = !state.zoom;
    layers[state.active].classList.toggle("zoomed", state.zoom && !reduce);
    syncHint();
  }
  if (hint) hint.addEventListener("click", function (e) { e.stopPropagation(); toggleZoom(); });
  if (viewer) {
    viewer.addEventListener("click", function (e) {
      if (e.target.closest(".viewer-nav") || e.target.closest(".viewer-hint")) return;
      toggleZoom();
    });
    viewer.addEventListener("mousemove", function (e) {
      if (!state.zoom) return;
      var layer = layers[state.active]; if (!layer) return;
      var img = layer.querySelector("img"); if (!img) return;
      var r = viewer.getBoundingClientRect();
      var x = Math.max(0, Math.min(100, (e.clientX - r.left) / r.width * 100));
      var y = Math.max(0, Math.min(100, (e.clientY - r.top) / r.height * 100));
      img.style.transformOrigin = x + "% " + y + "%";
    });
  }

  /* ---------- Цвет золота ---------- */
  var goldOpts = $$(".metal-opt");
  var metalVal = $("[data-role='metal-val']");
  function setGold(c) {
    state.gold = c;
    goldOpts.forEach(function (o) { o.classList.toggle("is-active", o.getAttribute("data-gold") === c); });
    if (metalVal) metalVal.textContent = (c === "white" ? "белое золото · 585" : "жёлтое золото · 585");
    recalcWeight();
    flashWeight();
  }
  goldOpts.forEach(function (o) {
    o.addEventListener("click", function () { setGold(o.getAttribute("data-gold")); });
  });

  /* ---------- Размеры + статус наличия ---------- */
  var sizeTokens = $$(".size-token");
  var sizeHint = $(".size-hint");
  var sizeHintText = $("[data-role='size-hint-text']");
  var availBlock = $(".info-availability");

  function pickSize(v) {
    state.size = v;
    sizeTokens.forEach(function (t) { t.classList.toggle("is-selected", t.getAttribute("data-val") === v); });
    var out = P.sizeOutOfStock.indexOf(v) >= 0;
    if (sizeHint) {
      sizeHint.hidden = false;
      sizeHint.classList.toggle("in", !out);
      sizeHint.classList.toggle("out", out);
    }
    if (sizeHintText) sizeHintText.textContent = out ? ("Размер " + v + " — под заказ, ~3 недели") : ("Размер " + v + " — в наличии");
    // синхронизируем верхний статус наличия
    if (availBlock) {
      availBlock.classList.toggle("preorder", out);
      var lbl = availBlock.querySelector(".avail-label");
      if (lbl) lbl.textContent = out ? "Под заказ, срок ~3 недели" : ("В наличии в салоне " + P.availability.city);
    }
    recalcWeight();
    flashWeight();
  }
  sizeTokens.forEach(function (t) {
    t.addEventListener("click", function () { pickSize(t.getAttribute("data-val")); });
  });

  /* ---------- Пересчёт веса ---------- */
  var weightVal = $("[data-role='weight-val']");
  function recalcWeight() {
    var base = state.size ? parseFloat(state.size.replace(",", ".")) : 17;
    var w = 2.93 + (base - 17) * 0.08 + (state.gold === "white" ? 0.06 : 0);
    if (weightVal) weightVal.textContent = w.toFixed(2).replace(".", ",") + " г";
  }
  var wf;
  function flashWeight() {
    if (!weightVal) return;
    clearTimeout(wf);
    weightVal.classList.add("flash");
    wf = setTimeout(function () { weightVal.classList.remove("flash"); }, 700);
  }

  /* ---------- Корзина / избранное / купить ---------- */
  var cartBtns = $$(".btn-cart");
  function renderCart() {
    cartBtns.forEach(function (b) {
      b.classList.toggle("is-added", state.added);
      var lbl = b.querySelector(".cart-label");
      if (lbl) lbl.textContent = state.added ? "В корзине ✓" : "Добавить в корзину";
    });
  }
  cartBtns.forEach(function (b) {
    b.addEventListener("click", function () { state.added = !state.added; renderCart(); });
  });

  var wishBtn = $(".btn-wish");
  if (wishBtn) {
    wishBtn.addEventListener("click", function () {
      state.wished = !state.wished;
      wishBtn.classList.toggle("is-wished", state.wished);
      var svg = wishBtn.querySelector("svg");
      if (svg) { svg.setAttribute("fill", state.wished ? "#BA905A" : "none"); svg.setAttribute("stroke", state.wished ? "#BA905A" : "#9a9186"); }
    });
  }

  /* ---------- Блок 7: плавающая нижняя панель ---------- */
  var stickyBar = $(".sticky-bar");
  var heroEl = $(".hero");
  var footerEl = $(".site-footer");
  if (stickyBar && heroEl) {
    var onScroll = function () {
      var heroBottom = heroEl.getBoundingClientRect().bottom;
      var footerTop = footerEl ? footerEl.getBoundingClientRect().top : Infinity;
      var vh = window.innerHeight;
      // показывать, когда hero прокручен, но футер ещё не виден
      var show = heroBottom < 0 && footerTop > vh;
      stickyBar.classList.toggle("is-visible", show);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }

  /* ---------- init ---------- */
  recalcWeight();
  renderCart();
  syncHint();
  setActive(0);
})();
