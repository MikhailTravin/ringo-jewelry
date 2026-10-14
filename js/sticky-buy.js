/* ==========================================================================
   RINGO — плавающая нижняя панель покупки (блок 7).
   Появляется при прокрутке ниже hero-секции; прячется у hero и в футере.
   ========================================================================== */
(function(){
  'use strict';
  var panel  = document.querySelector('.sticky-buy');
  var hero   = document.querySelector('.hero');
  var footer = document.querySelector('.site-footer');
  if(!panel || !hero) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function update(){
    var heroBottom = hero.getBoundingClientRect().bottom;
    var footerTop  = footer ? footer.getBoundingClientRect().top : Infinity;
    var vh = window.innerHeight || document.documentElement.clientHeight;

    // видима, когда hero прокручен вверх и футер ещё не в кадре
    var show = heroBottom < 40 && footerTop > vh;
    panel.classList.toggle('is-visible', show);
  }

  var ticking = false;
  function onScroll(){
    if(ticking) return;
    ticking = true;
    (window.requestAnimationFrame || function(cb){ setTimeout(cb,16); })(function(){
      update(); ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive:true });
  window.addEventListener('resize', onScroll);
  update();
})();
