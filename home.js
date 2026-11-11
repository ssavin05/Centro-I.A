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
  // Storytelling de fidelidad: contenido verdadero de la demo, sin datos falsos presentados como reales.
  const canvas=document.querySelector?.('.journey-canvas');
  const journeyButtons=Array.from(document.querySelectorAll?.('[data-journey-step]')||[]);
  const stages=[
    {label:'01 · UNA VISITA',title:'Una experiencia que inicia algo.',copy:'Alguien descubre su lugar favorito y registra una visita de ejemplo.',coin:'✦',value:'Visita registrada',amount:'01',unit:'primer encuentro'},
    {label:'02 · PUNTOS QUE SUMAN',title:'Cada visita tiene valor.',copy:'El programa reconoce a la persona con puntos de prueba para su próximo beneficio.',coin:'+30',value:'Puntos de ejemplo',amount:'+30',unit:'saldo en el comercio'},
    {label:'03 · UN MOTIVO PARA VOLVER',title:'Una recompensa hace la diferencia.',copy:'La persona desbloquea una recompensa de demostración y encuentra una nueva razón para regresar.',coin:'✓',value:'Beneficio listo',amount:'01',unit:'recompensa ilustrativa'}
  ];
  const setStage=(index)=>{
    if(!canvas||!Number.isInteger(index)||!stages[index])return;
    canvas.dataset.step=String(index);
    const stage=stages[index];
    for(const [key,value] of Object.entries({label:stage.label,title:stage.title,copy:stage.copy,coin:stage.coin,value:stage.value,amount:stage.amount,unit:stage.unit})){
      const node=canvas.querySelector(`[data-journey-${key}]`);
      if(node)node.textContent=value;
    }
    for(const button of journeyButtons){const on=Number(button.dataset.journeyStep)===index;button.classList.toggle('is-active',on);button.setAttribute('aria-pressed',String(on));}
  };
  journeyButtons.forEach((button,index)=>{
    button.addEventListener('click',()=>setStage(Number(button.dataset.journeyStep)));
    button.addEventListener('keydown',event=>{
      if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
      event.preventDefault();
      const next=event.key==='Home'?0:event.key==='End'?journeyButtons.length-1:(index+(event.key==='ArrowRight'?1:-1)+journeyButtons.length)%journeyButtons.length;
      setStage(next);
      journeyButtons[next]?.focus?.();
    });
  });
  // El indicador de lectura solo se actualiza al desplazarse; no hay bucles de animación permanentes.
  const scrollMeter=document.querySelector?.('.reading-progress');
  if(scrollMeter&&typeof window!=='undefined'&&typeof window.addEventListener==='function'){
    let pending=false;
    const updateScroll=()=>{const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);scrollMeter.style.transform=`scaleX(${Math.max(0,Math.min(1,window.scrollY/max))})`;pending=false;};
    window.addEventListener('scroll',()=>{if(pending)return;pending=true;(window.requestAnimationFrame||((callback)=>callback()))(updateScroll);},{passive:true});
    updateScroll();
  }
  // Los gráficos se activan solo al entrar en pantalla y la animación se suspende al ocultarse.
  if(typeof IntersectionObserver!=='undefined'&&typeof document.querySelectorAll==='function'){
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{entry.target.classList.toggle('is-in-view',entry.isIntersecting);});
    },{threshold:.15});
    document.querySelectorAll('.hero-preview,.journey-canvas,.feature-visual,.modules-grid,.idea-stage').forEach(node=>observer.observe(node));
  }
  // Un ejercicio de fidelidad que cambia por rubro sin crear información ni clientes reales.
  const studio=document.querySelector?.('.idea-stage');
  const ideaButtons=Array.from(document.querySelectorAll?.('[data-idea]')||[]);
  const ideas={
    cafe:{index:'01 / 03',tag:'PARA CAFETERÍAS',title:'Tu siguiente café tiene historia.',copy:'Reconoce las visitas frecuentes y ofrece una bebida especial cuando tus clientes regresen.',reward:'Premio: bebida de cortesía',detail:'Ejemplo: al completar 6 visitas',icon:'#i-coffee'},
    beauty:{index:'02 / 03',tag:'PARA BELLEZA',title:'Cuidarse también merece un detalle.',copy:'Celebra la constancia con un tratamiento adicional, pensado para quienes vuelven a elegirte.',reward:'Premio: tratamiento complementario',detail:'Ejemplo: en la quinta cita',icon:'#i-flower'},
    wellness:{index:'03 / 03',tag:'PARA BIENESTAR',title:'Cada sesión puede sumar bienestar.',copy:'Acompaña el progreso con puntos y experiencias que ayudan a sostener una buena rutina.',reward:'Premio: sesión especial',detail:'Ejemplo: al completar 8 sesiones',icon:'#i-leaf'}
  };
  const setIdea=type=>{
    if(!studio||!Object.hasOwn(ideas,type))return;
    const idea=ideas[type];
    studio.dataset.ideaType=type;
    for(const [key,text] of Object.entries({index:idea.index,tag:idea.tag,title:idea.title,copy:idea.copy,reward:idea.reward,detail:idea.detail})){
      const element=studio.querySelector(`[data-idea-${key}]`);
      if(element)element.textContent=text;
    }
    studio.querySelector('[data-idea-icon]')?.setAttribute('href',idea.icon);
    for(const button of ideaButtons){const active=button.dataset.idea===type;button.setAttribute('aria-pressed',String(active));}
    studio.classList.remove('is-changing');
    if(typeof window!=='undefined'&&typeof window.requestAnimationFrame==='function'){
      window.requestAnimationFrame(()=>studio.classList.add('is-changing'));
    }
  };
  ideaButtons.forEach(button=>button.addEventListener('click',()=>setIdea(button.dataset.idea)));
  // El movimiento ambiental se detiene al cambiar de pestaña; la interfaz conserva su estado.
  if(document.addEventListener){document.addEventListener('visibilitychange',()=>{
    document.documentElement?.classList.toggle('motion-paused',document.hidden);
  });}
  const year=document.getElementById('year');
  if(year)year.textContent=String(new Date().getFullYear());
})();