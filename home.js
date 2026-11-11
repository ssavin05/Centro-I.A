'use strict';
(()=>{
  const menu=document.getElementById('menu-button');
  const nav=document.getElementById('site-nav');
  if(menu&&nav){
    const close=()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menú');};
    menu.addEventListener('click',()=>{const open=!nav.classList.contains('open');nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');});
    nav.addEventListener('click',event=>{if(event.target.closest('a'))close();});
    document.addEventListener('keydown',event=>{if(event.key==='Escape')close();});
    document.addEventListener('click',event=>{if(nav.classList.contains('open')&&!nav.contains(event.target)&&!menu.contains(event.target))close();});
  }
  const year=document.getElementById('year');
  if(year)year.textContent=String(new Date().getFullYear());
})();