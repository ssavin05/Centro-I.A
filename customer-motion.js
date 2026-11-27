// Finite feedback for real customer state. One frame, no mutation or artificial counters.
export function createCustomerMotion(){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const running=new Set();let frame=0,version=0;
 function stop(){version++;if(frame)cancelAnimationFrame(frame);frame=0;for(const animation of running)animation.cancel();running.clear();}
 function play(node,frames,options){if(!node?.animate)return;const animation=node.animate(frames,{easing:'cubic-bezier(.16,1,.3,1)',...options});running.add(animation);animation.onfinish=animation.oncancel=()=>running.delete(animation);}
 function schedule(kind,view=kind==='rewards'?'rewards':'home'){
  stop();if(reduced.matches||document.hidden||!/^[-a-z]+$/.test(view))return;const current=version;
  frame=requestAnimationFrame(()=>{
   frame=0;if(current!==version||reduced.matches||document.hidden)return;
   const panel=document.querySelector('[data-panel="'+view+'"]');if(!panel||panel.hidden)return;
   if(kind==='hero'){
    const feature=document.querySelector('#customer-hero .customer-feature');
    play(feature,[{clipPath:'inset(0 3% 0 0)',opacity:.88},{clipPath:'inset(0 0 0 0)',opacity:1}],{duration:360});
    play(feature?.querySelector('.customer-gift')||feature?.querySelector('.customer-emblem'),[{transform:'rotate(-9deg) scale(.92)'},{transform:'rotate(3deg) scale(1.02)',offset:.65},{transform:'rotate(0) scale(1)'}],{duration:540});
    for(const bar of feature?.querySelectorAll('.customer-meter>span')||[])play(bar,[{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}],{duration:620});
   }else if(kind==='gain'){
    const badge=panel.querySelector('.customer-gain');if(!badge)return;
    play(badge,[{clipPath:'inset(0 100% 0 0)',opacity:.65},{clipPath:'inset(0)',opacity:1}],{duration:360});
    play(panel.querySelector('.customer-gift'),[{transform:'scale(1)'},{transform:'scale(1.12) rotate(-5deg)',offset:.45},{transform:'scale(1) rotate(0)'}],{duration:600});
    play(panel.querySelector('.customer-gift>.app-icon:last-child'),[{transform:'translate(0,0) rotate(0)'},{transform:'translate(8px,-8px) rotate(25deg)',offset:.5},{transform:'translate(0,0) rotate(0)'}],{duration:620});
    play(panel.querySelector('.customer-balance strong'),[{color:'#ffffff'},{color:'#ffe1a0',offset:.4},{color:'#ffffff'}],{duration:620});
   }else if(kind==='rewards'){
    for(const [index,ticket]of Array.from(panel.querySelectorAll('.reward-ticket')).slice(0,3).entries())play(ticket,[{clipPath:'inset(0 0 4% 0)',opacity:.86},{clipPath:'inset(0 0 0 0)',opacity:1}],{duration:230,delay:index*35});
   }else{
    play(panel,[{opacity:.75,transform:'translateX(12px)'},{opacity:1,transform:'translateX(0)'}],{duration:230});
   }
  });
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 reduced.addEventListener?.('change',()=>{if(reduced.matches)stop();});
 return {hero:()=>schedule('hero'),rewards:()=>schedule('rewards'),gain:()=>schedule('gain'),view:name=>schedule('view',name),stop};
}
