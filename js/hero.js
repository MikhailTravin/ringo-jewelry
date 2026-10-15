/* ==========================================================================
   RINGO — интерактив hero-секции: галерея, миниатюры, зум, выбор размера,
   переключение цвета золота, пересчёт веса, кнопки корзины/избранного.
   Логика перенесена из исходного прототипа клиента.
   ========================================================================== */
(function(){
  'use strict';
  var P = window.RINGO_PRODUCT;
  if(!P) return;

  var state = { active:0, size:'', gold:'white', wished:false, added:false };

  /* ---- Галерея: переключение слоёв ---- */
  var layers = Array.prototype.slice.call(document.querySelectorAll('.viewer-layer'));
  var thumbs = Array.prototype.slice.call(document.querySelectorAll('.thumb'));
  var viewer = document.querySelector('.viewer');

  function showLayer(i){
    state.active = i;
    layers.forEach(function(l,idx){ l.classList.toggle('is-active', idx===i); });
    thumbs.forEach(function(t,idx){ t.classList.toggle('is-active', idx===i); });
  }
  thumbs.forEach(function(t){
    t.addEventListener('click', function(){ showLayer(+t.getAttribute('data-idx')); });
  });

  var prev = document.querySelector('.viewer-nav.prev');
  var next = document.querySelector('.viewer-nav.next');
  function page(dir){
    var n = layers.length; if(!n) return;
    showLayer((state.active + dir + n) % n);
    if(viewer) viewer.classList.remove('is-zoom');
  }
  if(prev) prev.addEventListener('click', function(){ page(-1); });
  if(next) next.addEventListener('click', function(){ page(1); });

  /* ---- Зум основного изображения ---- */
  var hint = document.querySelector('.viewer-hint');
  if(hint && viewer){
    hint.addEventListener('click', function(){
      viewer.classList.toggle('is-zoom');
      hint.textContent = viewer.classList.contains('is-zoom') ? 'Свернуть' : 'Рассмотреть детали';
    });
  }

  /* ---- Выбор размера + статус наличия ---- */
  var sizeTokens = Array.prototype.slice.call(document.querySelectorAll('.size-token'));
  sizeTokens.forEach(function(tok){
    tok.addEventListener('click', function(){
      state.size = tok.getAttribute('data-val');
      sizeTokens.forEach(function(t){ t.classList.toggle('is-active', t===tok); });
      recalcWeight();
    });
  });

  /* ---- Переключение цвета золота ---- */
  var goldSpans = Array.prototype.slice.call(document.querySelectorAll('.gold-switch span'));
  var metalCell = document.querySelector('[data-metal]');
  goldSpans.forEach(function(sp){
    sp.addEventListener('click', function(){
      state.gold = sp.getAttribute('data-gold');
      goldSpans.forEach(function(s){ s.classList.toggle('is-active', s===sp); });
      if(metalCell) metalCell.firstChild.textContent = (state.gold==='white' ? 'белое золото' : 'жёлтое золото');
      recalcWeight();
    });
  });

  /* ---- Пересчёт веса (как в прототипе) ---- */
  var weightCell = document.querySelector('[data-weight]');
  var wfTimer;
  function recalcWeight(){
    if(!weightCell) return;
    var base = state.size ? parseFloat(state.size.replace(',','.')) : 17;
    var w = 2.93 + (base-17)*0.08 + (state.gold==='white'?0.06:0);
    weightCell.textContent = w.toFixed(2).replace('.',',') + ' г';
    weightCell.classList.add('flash');
    clearTimeout(wfTimer);
    wfTimer = setTimeout(function(){ weightCell.classList.remove('flash'); }, 700);
  }

  /* ---- Корзина / избранное ---- */
  var cartBtns = Array.prototype.slice.call(document.querySelectorAll('[data-action="cart"]'));
  cartBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      state.added = !state.added;
      cartBtns.forEach(function(b){
        b.classList.toggle('is-added', state.added);
        var lbl = b.querySelector('.cart-label') || b;
        lbl.textContent = state.added ? 'В корзине ✓' : 'Добавить в корзину';
      });
    });
  });

  var wishBtn = document.querySelector('.btn-wish');
  if(wishBtn){
    wishBtn.addEventListener('click', function(){
      state.wished = !state.wished;
      wishBtn.classList.toggle('is-wished', state.wished);
      var path = wishBtn.querySelector('path');
      if(path) path.setAttribute('fill', state.wished ? '#BA905A' : 'none');
      if(path) path.setAttribute('stroke', state.wished ? '#BA905A' : '#9a9186');
    });
  }
})();

