// No tracking or storage: only visibility-aware decorative motion.
const syncVisibility=()=>{document.documentElement.dataset.motion=document.hidden?'paused':'active';};
document.addEventListener('visibilitychange',syncVisibility);
syncVisibility();
if ('IntersectionObserver' in window) {
  const observer=new IntersectionObserver(entries=>{
    for(const {target,isIntersecting} of entries)target.dataset.outOfView=String(!isIntersecting);
  },{rootMargin:'60px'});
  for(const element of document.querySelectorAll('.ambient,.hero-art,.welcome-waves,.workspace-wave'))observer.observe(element);
}
