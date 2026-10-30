/* Mejoras progresivas: revelar secciones sin afectar funciones del prototipo. */
(() => {
  'use strict';
  const init = () => {
    const selectors = '.section-block,.event-card,.side-card,.inspired-steps article,.inspired-final,.stage-dashboard,.stage-network';
    const items = [...document.querySelectorAll(selectors)];
    if (!items.length) return;
    items.forEach((el, i) => {
      if (el.dataset.ciaRevealReady) return;
      el.dataset.ciaRevealReady = '1';
      el.classList.add('cia-reveal');
      el.style.transitionDelay = `${Math.min(i % 4, 3) * 65}ms`;
    });
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach(el => el.classList.add('cia-visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('cia-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.08, rootMargin: '0px 0px -24px 0px'});
    items.forEach(el => observer.observe(el));
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
  const app = document.getElementById('app');
  if (app && 'MutationObserver' in window) new MutationObserver(() => init()).observe(app, {childList:true,subtree:true});
})();
