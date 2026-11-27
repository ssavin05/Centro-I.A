import {mountOperations} from './operations-ui.js';
import {mountGrowth} from './growth-ui.js';
import {mountStudio} from './studio-ui.js';
import {rewardKinds} from './studio-rules.js';
import {escapeHTML as e,loyaltyError,rewardState,loyaltySections,arrivalState} from './loyalty-rules.js';
const icon=name=>'<svg class="app-icon" aria-hidden="true"><use href="assets/icons/workspace.svg#'+name+'"></use></svg>';
const number=value=>new Intl.NumberFormat('es-MX').format(Number(value||0));
const date=value=>value?new Intl.DateTimeFormat('es-MX',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}).format(new Date(value)):'—';
const empty=(title,text,action='',target='explore')=>'<div class="app-empty">'+icon('ticket')+'<div><h3>'+e(title)+'</h3><p>'+e(text)+'</p>'+(action?'<button type="button" class="text-button" data-go="'+target+'">'+e(action)+' '+icon('arrow')+'</button>':'')+'</div></div>';
export function mountLoyalty({supabase}){
 const $=id=>document.getElementById(id);
 const studio=mountStudio({supabase,refreshCore:()=>refresh(),navigate:section=>show(section,{focus:true})});
 const operations=mountOperations({supabase,refreshCore:()=>refresh(),navigate:section=>show(section,{focus:true})});
 const growth=mountGrowth({supabase,refreshCore:()=>refresh(),navigate:section=>show(section,{focus:true})});
 let identity=null,snapshot=null,epoch=0,view='home',filter='all',operating=false,pendingReward=null;
 const requests=new Map();
 const isCompany=()=>identity?.profile.account_type==='company';
 const owned=()=>snapshot?.clubs[0];
 function notice(text,tone='success'){const node=$('loyalty-notice');node.dataset.tone=tone;node.setAttribute('role',tone==='error'?'alert':'status');node.textContent=text;}
 function show(next,{focus=false,immediate=false}={}){
  if(focus&&next!==view&&!immediate){studio.animateNavigation(next,()=>show(next,{focus,immediate:true}));return;}
  if(!loyaltySections.includes(next))next='home';view=next;
  for(const panel of document.querySelectorAll('[data-panel]'))panel.hidden=panel.dataset.panel!==view;
  for(const button of document.querySelectorAll('[data-view]')){if(button.dataset.view===view)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');}
  const titles={growth:'Actividad y datos',operations:'Operación y reservas',home:'Mi centro',rewards:'Premios',visits:isCompany()?'Visitas y clientes':'Mis visitas',explore:isCompany()?'Mi negocio':'Explorar',account:'Mi cuenta'};
  $('app-section-name').textContent=titles[view]||studio.titleFor(view);
  if(focus){const heading=document.querySelector('[data-panel="'+view+'"] h2');heading?.setAttribute('tabindex','-1');heading?.focus();}
 }
 const clubName=id=>snapshot?.clubs.find(c=>c.id===id)?.name||'Negocio';
 function metrics(){
  const counts=snapshot.counts||{};
  const items=isCompany()?[['Clientes unidos',counts.members],['Visitas confirmadas',counts.confirmed_visits],['En el lugar',counts.active_visits],['Canjes por entregar',counts.pending_redemptions]]:[['Mis negocios',snapshot.clubs.length],['Visitas confirmadas',counts.confirmed_visits],['En el lugar',counts.active_visits],['Premios por recoger',counts.pending_redemptions]];
  $('app-metrics').innerHTML=items.map(([label,value])=>'<div><dt>'+label+'</dt><dd>'+number(value)+'</dd></div>').join('');
 }
 function clubCards(){
  if(isCompany()){
   $('club-list').innerHTML=owned()?'<div class="business-summary"><div>'+icon('store')+'<h3>'+e(owned().name)+'</h3><p>'+e(owned().category)+' · '+e(owned().city)+'</p></div><p><strong>'+number(owned().points_per_visit)+' puntos</strong> por visita confirmada</p><button type="button" class="text-button" data-go="explore">Administrar mi programa '+icon('arrow')+'</button></div>':empty('Dale un hogar a tu programa.','Crea tu negocio, elige los puntos por visita y prepara tu primer premio.','Crear mi programa');
   return;
  }
  $('club-list').innerHTML=snapshot.clubs.length?'<div class="club-grid">'+snapshot.clubs.map(club=>{
   const arrival=arrivalState(snapshot.visits,club.id,snapshot.server_time);
   const visit=arrival.openVisit;
   const rewards=snapshot.rewards.filter(r=>r.club_id===club.id&&r.active&&r.stock!==0);
   const next=rewards.find(r=>r.points_cost>club.points)||rewards[0];
   return '<article class="club-pass"><div class="pass-top">'+icon('store')+'<span>'+e(club.category)+'</span></div><h3>'+e(club.name)+'</h3><p>'+e(club.city)+'</p><div class="pass-balance"><strong>'+number(club.points)+'</strong><span>puntos en este negocio</span></div>'+(next?'<p class="pass-progress">'+(club.points>=next.points_cost?'Ya puedes elegir un premio.':'A '+number(next.points_cost-club.points)+' puntos de '+e(next.title)+'.')+'</p>':'<p class="pass-progress">Tus puntos quedan guardados para próximos premios.</p>')+'<div class="pass-actions"><button type="button" class="button button-primary" data-action="'+(visit?'depart':'arrive')+'" data-club="'+e(club.id)+'" data-id="'+e(visit?.id||'')+'" '+(!visit&&!arrival.canArrive?'disabled':'')+'>'+(visit?'Registrar salida':arrival.canArrive?'Estoy aquí':'Visita ya registrada')+'</button><button type="button" class="text-button" data-go="rewards">Ver premios</button></div>'+(visit?'<p class="presence-note">Llegada registrada '+date(visit.arrived_at)+'</p>':!arrival.canArrive?'<p class="presence-note">Próxima llegada disponible '+date(arrival.nextAllowedAt)+'</p>':'')+'</article>';
  }).join('')+'</div>':empty('Tu primer lugar está por llegar.','Únete a un negocio por su código o encuentra uno en Explorar. Aquí aparecerán tus puntos y próximas recompensas.','Encontrar un negocio');
 }
 function visitRows(list,{short=false}={}){
  if(!list.length)return empty('Cada regreso tiene una historia.','Cuando registres una visita, verás aquí la llegada, salida y confirmación del negocio.',isCompany()?'':'Ver mis negocios',isCompany()?'explore':'home');
  return '<div class="table-scroll"><table class="activity-table"><caption class="visually-hidden">Registro de visitas</caption><thead><tr><th>'+(isCompany()?'Cliente':'Negocio')+'</th><th>Llegada</th><th>Salida</th><th>Estado</th><th>Puntos</th><th>Acción</th></tr></thead><tbody>'+list.map(v=>'<tr><td><strong>'+e(isCompany()?v.customer_name:v.club_name)+'</strong></td><td>'+date(v.arrived_at)+'</td><td>'+date(v.departed_at)+'</td><td><span class="state-label '+(v.confirmed_at?'state-confirmed':'')+'">'+(v.confirmed_at?(v.departed_at?'Confirmada':'Confirmada · En el lugar'):!v.departed_at?'En el lugar':'Por confirmar')+'</span></td><td>'+(v.confirmed_at?'+'+number(v.awarded_points):'Pendientes')+'</td><td><div class="row-actions">'+(isCompany()&&!v.confirmed_at?'<button type="button" class="text-button" data-action="confirm" data-club="'+e(v.club_id)+'" data-id="'+e(v.id)+'">Confirmar visita</button>':'')+(!v.departed_at?'<button type="button" class="text-button" data-action="depart" data-club="'+e(v.club_id)+'" data-id="'+e(v.id)+'">Registrar salida</button>':'')+'</div></td></tr>').join('')+'</tbody></table></div>'+(!short&&list.length>=200?'<p class="app-footnote">Se muestran las 200 visitas más recientes.</p>':'');
 }
 function renderVisits(){
  const all=snapshot.visits;
  const list=all.filter(v=>filter==='all'||(filter==='active'&&!v.departed_at)||(filter==='pending'&&!v.confirmed_at)||(filter==='confirmed'&&v.confirmed_at));
  $('visit-list').innerHTML=visitRows(list);
  $('recent-list').innerHTML=visitRows(all.slice(0,4),{short:true});
 }
 function renderRewards(){
  const query=$('reward-search').value.trim().toLocaleLowerCase('es');
  const rewards=snapshot.rewards.filter(r=>(r.title+' '+r.description+' '+clubName(r.club_id)).toLocaleLowerCase('es').includes(query));
  $('reward-list').innerHTML=rewards.length?rewards.map(r=>{
   const club=snapshot.clubs.find(c=>c.id===r.club_id),state=rewardState(r,club);
   return '<article class="reward-ticket"><div class="reward-art">'+icon('gift')+'<span>'+e(clubName(r.club_id))+'</span></div><div class="reward-body"><div class="reward-heading"><h3>'+e(r.title)+'</h3><span class="reward-price">'+number(r.points_cost)+' <small>pts</small></span></div><p>'+e(r.description||'Pregunta en el negocio por los detalles de entrega.')+'</p><p class="reward-stock">'+(r.stock===null?'Sin límite de unidades':number(r.stock)+' unidades disponibles')+'</p>'+(r.reward_kind?'<p class="studio-reward-details">'+e(rewardKinds[r.reward_kind]||r.reward_kind)+(r.valid_until?' · Hasta '+date(r.valid_until):'')+'</p>':'')+(r.terms?'<details class="studio-reward-terms"><summary>Condiciones del premio</summary><p>'+e(r.terms)+'</p></details>':'')+(isCompany()?'<button type="button" class="text-button" data-studio-action="edit-reward" data-id="'+e(r.id)+'">Editar recompensa</button><button type="button" class="text-button" data-action="reward-toggle" data-id="'+e(r.id)+'" data-active="'+String(!r.active)+'">'+(r.active?'Pausar premio':'Activar premio')+'</button>':'<button type="button" class="button '+(state.canRedeem?'button-primary':'button-outline')+'" data-action="redeem" data-id="'+e(r.id)+'" '+(!state.canRedeem?'disabled':'')+'>'+(!state.available?(state.expired?'Vencido':r.stock===0?'Agotado':'No disponible'):state.canRedeem?'Canjear premio':'Te faltan '+number(state.remaining)+' puntos')+'</button>')+'</div></article>';
  }).join(''):empty(query?'No encontramos ese premio.':isCompany()?'Crea algo que valga el regreso.':'Los buenos premios se están preparando.',query?'Prueba con otro nombre o negocio.':isCompany()?'Ofrece algo concreto y alcanzable: tú eliges los puntos y las unidades.':'Los premios de tus negocios aparecerán aquí en cuanto estén disponibles.');
  $('redemption-list').innerHTML=snapshot.redemptions.length?'<div class="redemption-list">'+snapshot.redemptions.map(r=>'<article class="redemption-row">'+icon('ticket')+'<div><h3>'+e(r.reward_title)+'</h3><p>'+e(isCompany()?r.customer_name:r.club_name)+' · '+number(r.points_cost)+' puntos · '+date(r.created_at)+'</p><details><summary>Ver comprobante</summary><code>'+e(r.id)+'</code></details></div><span class="state-label '+(r.state==='delivered'?'state-confirmed':'')+'">'+(r.state==='delivered'?'Entregado':r.state==='cancelled'?'Cancelado · puntos devueltos':'Por recoger')+'</span>'+(isCompany()&&r.state==='requested'?'<button type="button" class="text-button" data-action="deliver" data-id="'+e(r.id)+'">Confirmar entrega</button>':'')+'</article>').join('')+'</div>':empty(isCompany()?'Aquí confirmarás cada entrega.':'Tu próximo premio te espera.','Los canjes confirmados aparecerán aquí con su comprobante.');
 }
 function renderExplore(){
  const company=isCompany(),club=owned();$('join-form').hidden=company;$('explore-search-label').hidden=company;$('business-setup').hidden=!company;$('explore-list').hidden=company;
  if(company){
   $('club-form').hidden=!!club;
   $('business-settings').innerHTML=club?'<section class="business-settings"><div><h3>'+e(club.name)+'</h3><p>'+e(club.description)+'</p><p>'+e(club.category)+' · '+e(club.city)+'</p></div><div class="invite-code"><span>Código para tus clientes</span><strong>'+e(club.join_code)+'</strong><p>Compártelo en tu mostrador. Unirse permite al negocio ver el nombre y las visitas de su cliente.</p></div><div class="visibility-setting"><div><h3>'+ (club.is_listed?'Visible en Explorar':'Tu programa está en privado')+'</h3><p>'+(club.is_listed?'Las cuentas de Centro I.A. pueden encontrar nombre, categoría, ciudad y descripción.':'Tus clientes pueden unirse con el código. Publica cuando tu programa esté listo.')+'</p></div><button type="button" class="button button-outline" data-action="visibility" data-club="'+e(club.id)+'" data-active="'+String(!club.is_listed)+'">'+(club.is_listed?'Dejar en privado':'Publicar en Explorar')+'</button></div></section><div class="section-heading"><h2>Personas que eligen volver.</h2></div>'+(snapshot.members.length?'<div class="table-scroll"><table class="activity-table"><thead><tr><th>Cliente</th><th>Se unió</th><th>Visitas confirmadas</th><th>Puntos actuales</th></tr></thead><tbody>'+snapshot.members.map(m=>'<tr><td><strong>'+e(m.customer_name)+'</strong></td><td>'+date(m.joined_at)+'</td><td>'+number(m.visits_count)+'</td><td>'+number(m.points)+'</td></tr>').join('')+'</tbody></table></div>':empty('El próximo regreso empieza con una invitación.','Comparte el código de tu programa con tus clientes. Al unirse, aparecerán aquí.')):'';
  }else{
   const query=$('explore-search').value.trim().toLocaleLowerCase('es');
   const list=snapshot.explore.filter(c=>(c.name+' '+c.category+' '+c.city).toLocaleLowerCase('es').includes(query));
   $('explore-list').innerHTML=list.length?'<div class="explore-list">'+list.map(c=>'<article class="explore-row"><div class="place-icon">'+icon('store')+'</div><div><h3>'+e(c.name)+'</h3><p>'+e(c.category)+' · '+e(c.city)+'</p><p>'+e(c.description)+'</p><span>'+number(c.points_per_visit)+' puntos por visita confirmada · '+number(c.rewards_count)+' premios disponibles</span></div><button type="button" class="button button-outline" data-action="join-listed" data-id="'+e(c.id)+'">Unirme al programa</button></article>').join('')+'</div><p class="app-footnote">Al unirte compartes tu nombre y las visitas a ese negocio con su propietario.</p>':empty(query?'No encontramos ese lugar.':'Los próximos lugares están por llegar.',query?'Prueba otra categoría o ciudad.':'Todavía no hay negocios publicados. Si ya conoces uno, pídele su código para unirte.');
  }
 }
 function renderNext(){
  if(isCompany()){
   $('next-step-body').innerHTML=owned()?'<p>Comparte tu código para que tus clientes se unan.</p><strong class="compact-code">'+e(owned().join_code)+'</strong><button type="button" class="text-button" data-go="rewards">Preparar un premio '+icon('arrow')+'</button>':'<p>Empieza con lo esencial: tu negocio, puntos por visita y un premio que tus clientes quieran.</p><button type="button" class="text-button" data-go="explore">Crear mi programa '+icon('arrow')+'</button>';
  }else{
   const pending=snapshot.redemptions.find(r=>r.state==='requested');
   $('next-step-body').innerHTML=pending?'<p>Tienes un premio por recoger.</p><h3>'+e(pending.reward_title)+'</h3><button type="button" class="text-button" data-go="rewards">Ver mi comprobante '+icon('arrow')+'</button>':'<p>¿Ya estás en uno de tus negocios? Registra tu llegada. La confirmación del negocio suma tus puntos.</p><button type="button" class="text-button" data-go="'+(snapshot.clubs.length?'home':'explore')+'">'+(snapshot.clubs.length?'Ver mis negocios':'Encontrar mi primer negocio')+' '+icon('arrow')+'</button>';
  }
 }
 function render(){$('show-reward-form').hidden=!isCompany();metrics();clubCards();renderVisits();renderRewards();renderExplore();renderNext();show(view);studio.update({identity,snapshot});operations.update({identity,snapshot});growth.update({identity,snapshot});}
 async function refresh(){
  if(!identity||!supabase)return;const version=epoch;$('refresh-loyalty').disabled=true;$('loyalty-error').hidden=true;
  try{
   const {data,error}=await supabase.rpc('cia_loyalty_snapshot');
   if(version!==epoch)return;if(error)throw error;
   if(!data||data.account_type!==identity.profile.account_type||!['clubs','rewards','visits','redemptions','members','explore'].every(key=>Array.isArray(data[key])))throw Error('invalid_snapshot');
   snapshot=data;render();$('loyalty-content').hidden=false;$('app-connection').textContent='Actualizado '+new Intl.DateTimeFormat('es-MX',{hour:'2-digit',minute:'2-digit'}).format(new Date());
  }catch(error){
   if(version!==epoch)return;
   if(!snapshot){$('loyalty-content').hidden=false;for(const id of ['club-list','reward-list','visit-list','redemption-list','recent-list','explore-list'])$(id).innerHTML=empty('Tu programa está pendiente de activación.','La interfaz está lista. Actualiza cuando se haya autorizado la conexión del módulo de fidelidad.');$('business-setup').hidden=true;$('join-form').hidden=true;$('show-reward-form').hidden=true;$('app-metrics').innerHTML=['Mis negocios','Visitas confirmadas','En el lugar','Premios por recoger'].map(label=>'<div><dt>'+label+'</dt><dd>—</dd></div>').join('');$('next-step-body').innerHTML='<p>Mientras se activa el programa, puedes revisar y actualizar tu cuenta.</p><button type="button" class="text-button" data-go="account">Ir a mi cuenta</button>';}
   $('loyalty-error').textContent=loyaltyError(error);$('loyalty-error').hidden=false;$('app-connection').textContent='No se pudo actualizar';
  }finally{if(version===epoch){$('loyalty-loading').hidden=true;$('refresh-loyalty').disabled=false;}}
 }
 async function mutate(name,args,button,success){
  if(operating||!identity)return false;
  operating=true;const version=epoch;const oldText=button?.textContent;if(button){button.disabled=true;button.textContent='Guardando…';}notice('');
  try{
   const {error}=await supabase.rpc(name,args);if(version!==epoch)return false;if(error)throw error;
   notice(success);studio.acknowledge(name);await refresh();return version===epoch;
  }catch(error){if(version===epoch)throw error;return false;}
  finally{if(version===epoch){operating=false;if(button){button.disabled=false;button.textContent=oldText;}}}
 }
 function clear(){
  epoch++;studio.clear();operations.clear();growth.clear();identity=null;snapshot=null;operating=false;pendingReward=null;requests.clear();
  $('loyalty-content').hidden=true;$('account-panel').hidden=true;$('loyalty-loading').hidden=true;$('loyalty-error').hidden=true;notice('');$('refresh-loyalty').disabled=true;
  for(const id of ['club-list','reward-list','visit-list','redemption-list','recent-list','explore-list','business-settings','next-step-body','app-metrics'])$(id).textContent='';
  for(const form of document.querySelectorAll('.app-form')){form.reset();delete form.dataset.request;const button=form.querySelector('[type="submit"]');if(button){button.disabled=false;button.textContent=form.id==='join-form'?'Unirme':form.id==='club-form'?'Crear mi programa':'Guardar premio';}}
  $('confirm-redeem').disabled=false;$('confirm-redeem').textContent='Confirmar canje';
  if($('redeem-dialog').open)$('redeem-dialog').close();
 }
 function load(context){
  clear();identity=context;const company=isCompany();
  $('app-date').textContent=new Intl.DateTimeFormat('es-MX',{weekday:'long',day:'numeric',month:'long'}).format(new Date());
  for(const button of document.querySelectorAll('[data-view]')){const labels={home:'Inicio',rewards:'Premios',visits:company?'Visitas':'Mis visitas',explore:company?'Mi negocio':'Explorar',account:'Mi cuenta'};if(labels[button.dataset.view])button.setAttribute('aria-label',labels[button.dataset.view]);}
  $('nav-visits-label').textContent=company?'Visitas':'Mis visitas';$('nav-explore-label').textContent=company?'Mi negocio':'Explorar';
  $('ticket-title').innerHTML=company?'Dales un motivo<br>para volver.':'Cada visita<br>cuenta.';
  $('ticket-description').textContent=company?'Crea premios, reconoce cada visita y construye relaciones que duren.':'Encuentra tus lugares, suma puntos y elige tu próxima recompensa.';
  $('ticket-action').textContent=company?'Preparar mi programa':'Encontrar mi próximo lugar';
  $('clubs-title').textContent=company?'Tu programa de fidelidad':'Tus lugares, tus beneficios.';
  $('clubs-action').hidden=company;$('recent-title').textContent=company?'Las últimas visitas':'Tu actividad reciente';
  $('rewards-description').textContent=company?'Crea recompensas alcanzables y confirma cada entrega.':'Tus puntos pertenecen a cada negocio. Elige cómo disfrutarlos.';
  $('visits-description').textContent=company?'Confirma visitas reales para otorgar puntos. Registra la salida cuando el cliente se retire.':'Registra tu llegada y tu salida. El negocio confirma la visita y los puntos.';
  $('explore-title').textContent=company?'El lugar al que quieren volver.':'Tu próximo lugar favorito.';
  $('explore-description').textContent=company?'Tu programa, tu código y las personas que se unen.':'Únete a negocios y empieza a construir tu próxima recompensa.';
  $('redemptions-title').textContent=company?'Canjes y entregas':'Tus canjes';$('show-reward-form').hidden=!company;
  $('loyalty-loading').hidden=false;$('loyalty-content').hidden=true;show('home');refresh();
 }
 document.addEventListener('click',async event=>{
  const nav=event.target.closest('[data-view],[data-go]');if(nav&&identity){show(nav.dataset.view||nav.dataset.go,{focus:true});return;}
  const filterButton=event.target.closest('[data-filter]');if(filterButton&&snapshot){filter=filterButton.dataset.filter;for(const b of document.querySelectorAll('[data-filter]'))b.setAttribute('aria-pressed',String(b===filterButton));renderVisits();return;}
  const button=event.target.closest('[data-action]');if(!button||!snapshot||operating)return;
  const {action,id,club,active}=button.dataset;
  try{
   if(['arrive','depart','confirm'].includes(action))await mutate('cia_visit_action',{p_club:club,p_action:action,p_visit:id||null},button,action==='confirm'?'Visita confirmada. Los puntos ya están en la cuenta del cliente.':action==='depart'?'Salida registrada. Gracias por volver.':'Llegada registrada. El negocio confirmará tu visita para sumar puntos.');
   else if(action==='join-listed')await mutate('cia_join_listed_club',{p_club:id},button,'Ya eres parte del programa. Lo encontrarás en Inicio.');
   else if(action==='visibility')await mutate('cia_set_club_listed',{p_club:club,p_listed:active==='true'},button,active==='true'?'Tu negocio ya aparece en Explorar.':'Tu programa quedó en privado.');
   else if(action==='reward-toggle')await mutate('cia_set_reward_active',{p_reward:id,p_active:active==='true'},button,'Disponibilidad del premio actualizada.');
   else if(action==='deliver')await mutate('cia_deliver_redemption',{p_redemption:id},button,'Entrega confirmada. El comprobante quedó actualizado.');
   else if(action==='redeem'){
    pendingReward=snapshot.rewards.find(r=>r.id===id);if(!pendingReward)return;
    if(!requests.has(id))requests.set(id,crypto.randomUUID());
    $('redeem-dialog-description').textContent=pendingReward.title+' · '+number(pendingReward.points_cost)+' puntos en '+clubName(pendingReward.club_id)+'.';
    $('redeem-dialog-error').textContent='';$('redeem-dialog').showModal();
   }
  }catch(error){notice(loyaltyError(error),'error');}
 });
 $('refresh-loyalty').addEventListener('click',refresh);
 $('reward-search').addEventListener('input',()=>snapshot&&renderRewards());
 $('explore-search').addEventListener('input',()=>snapshot&&renderExplore());
 $('show-reward-form').addEventListener('click',()=>{if(!owned()){show('explore');notice('Primero crea tu programa de fidelidad.');return;}$('reward-form').hidden=false;$('reward-form').elements.title.focus();});
 $('cancel-reward-form').addEventListener('click',()=>{$('reward-form').hidden=true;});
 for(const [id,rpc,build,success]of [
  ['join-form','cia_join_club',form=>({p_code:form.elements.code.value.trim()}),'Ya te uniste. Tu negocio aparece en Inicio.'],
  ['club-form','cia_create_club',form=>({p_name:form.elements.name.value.trim(),p_category:form.elements.category.value,p_city:form.elements.city.value.trim(),p_description:form.elements.description.value.trim(),p_points:Number(form.elements.points.value)}),'Tu programa está listo, en privado. Ahora crea tu primer premio.'],
  ['reward-form','cia_save_reward',form=>({p_club:owned()?.id,p_title:form.elements.title.value.trim(),p_description:form.elements.description.value.trim(),p_cost:Number(form.elements.cost.value),p_stock:form.elements.stock.value===''?null:Number(form.elements.stock.value),p_request:form.dataset.request||(form.dataset.request=crypto.randomUUID())}),'Premio guardado. Ya está disponible para tus clientes.']
 ]){
  $(id).addEventListener('submit',async event=>{
   event.preventDefault();const form=event.currentTarget;if(!form.reportValidity()||operating||!snapshot)return;
   const result=form.querySelector('.form-result');result.textContent='';form.setAttribute('aria-busy','true');
   try{if(await mutate(rpc,build(form),form.querySelector('[type="submit"]'),success)){form.reset();delete form.dataset.request;if(id==='reward-form')form.hidden=true;if(id==='join-form')show('home');}}
   catch(error){result.textContent=loyaltyError(error);}finally{form.setAttribute('aria-busy','false');}
  });
 }
 $('confirm-redeem').addEventListener('click',async()=>{
  if(!pendingReward||operating)return;const reward=pendingReward,request=requests.get(reward.id),version=epoch;$('redeem-dialog-error').textContent='';
  try{if(await mutate('cia_redeem_reward',{p_reward:reward.id,p_request:request},$('confirm-redeem'),'Premio canjeado. Presenta tu comprobante en el negocio.')){requests.delete(reward.id);if(version===epoch)$('redeem-dialog').close();}}
  catch(error){if(version===epoch)$('redeem-dialog-error').textContent=loyaltyError(error);}
 });
 return {load,clear,refresh};
}
