import {escapeHTML as e} from './loyalty-rules.js';
import {businessProfiles,themes,rewardKinds,promotionKinds,appointmentStates,defaultStudioSettings,profileFor,loyaltyLevel,challengeProgress,studioError,localDateTime,catalogRowErrors} from './studio-rules.js';
import {importCatalogFile,normalizeLogo} from './catalog-import.js';
const $=id=>document.getElementById(id);
const icon=name=>'<svg class="app-icon" aria-hidden="true"><use href="assets/icons/workspace.svg#'+name+'"></use></svg>';
const number=value=>new Intl.NumberFormat('es-MX').format(Number(value||0));
const money=(value,currency='MXN')=>new Intl.NumberFormat('es-MX',{style:'currency',currency}).format(Number(value||0));
const stamp=value=>value?new Intl.DateTimeFormat('es-MX',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}).format(new Date(value)):'—';
const dayKey=value=>{const d=new Date(value);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');};
const input=(label,name,type='text',value='',extra='')=>'<label>'+label+'<input name="'+name+'" type="'+type+'" value="'+e(value)+'" '+extra+'></label>';
const area=(label,name,value='',max=500)=>'<label class="field-wide">'+label+'<textarea name="'+name+'" rows="3" maxlength="'+max+'">'+e(value)+'</textarea></label>';
const select=(label,name,items,value='',extra='')=>'<label>'+label+'<select aria-label="'+e(label)+'" name="'+name+'" '+extra+'>'+items.map(([id,title])=>'<option value="'+e(id)+'" '+(id===value?'selected':'')+'>'+e(title)+'</option>').join('')+'</select></label>';
const action=(text,kind,id='',extra='')=>'<button type="button" class="text-button" data-studio-action="'+kind+'" data-id="'+e(id)+'" '+extra+'>'+text+'</button>';
const empty=(title,text)=>'<div class="studio-empty">'+icon('spark')+'<div><h3>'+e(title)+'</h3><p>'+e(text)+'</p></div></div>';
const section=(id,title,description,content)=>'<section data-panel="'+id+'" hidden><div class="section-heading"><div><h2>'+title+'</h2><p>'+description+'</p></div></div>'+content+'</section>';
export function mountStudio({supabase,refreshCore,navigate,onUpdate}){
 let context=null,state=null,epoch=0,requestVersion=0,saving=false,step=0,logo='',importRows=[],importRequest=null,importVersion=0,viewMonth=new Date(),selectedDay=dayKey(new Date()),navigation=null,navigationTimer,activeTrigger=null,importReturn=null;
 const editorReturns=new Map();
 const isCompany=()=>context?.identity.profile.account_type==='company';
 const club=()=>context?.snapshot.clubs[0];
 const settings=id=>state?.settings.find(s=>s.club_id===(id||club()?.id))||{...defaultStudioSettings,club_id:id||club()?.id};
 const clubName=id=>context?.snapshot.clubs.find(c=>c.id===id)?.name||'Negocio';
 const schemaReady=()=>!!state;
 function result(text,tone='success'){const node=$('loyalty-notice');node.textContent=text;node.dataset.tone=tone;node.setAttribute('role',tone==='error'?'alert':'status');}
 function mount(){
  const nav=document.querySelector('.app-nav');
  const additions=[['catalog','catalog','Catálogo'],['promotions','spark','Promociones'],['calendar','calendar','Calendario'],['inbox','bell','Notificaciones'],['people','people','Clientes y puntos']];
  for(const [id,glyph,label]of additions)nav.insertAdjacentHTML('beforeend','<button type="button" '+(id==='people'?'hidden ':'')+'class="app-nav-item studio-nav" data-view="'+id+'" aria-label="'+label+'">'+icon(glyph)+'<span>'+label+'</span>'+(id==='inbox'?'<b id="studio-unread" hidden>0</b>':'')+'</button>');
  nav.insertAdjacentHTML('beforeend','<button type="button" class="app-nav-item studio-more" aria-label="Más opciones" popovertarget="studio-menu">'+icon('more')+'<span>Más</span></button>');
  document.body.insertAdjacentHTML('beforeend','<nav id="studio-menu" popover class="studio-menu" aria-label="Más opciones">'+[['visits','visit','Visitas'],['explore','store','Negocios'],['catalog','catalog','Catálogo'],['promotions','spark','Promociones'],['people','people','Clientes y puntos'],['account','user','Mi cuenta']].map(([id,glyph,label])=>'<button type="button" data-go="'+id+'">'+icon(glyph)+'<span>'+label+'</span></button>').join('')+'<button type="button" data-studio-action="logout">'+icon('logout')+'<span>Cerrar sesión</span></button></nav><div id="studio-celebration" aria-hidden="true"></div>');
  $('loyalty-content').insertAdjacentHTML('beforeend',section('catalog','Un catálogo con tu sello.','Productos, servicios y menús que se adaptan a cada negocio.','<div id="studio-catalog-toolbar" class="studio-toolbar"></div><div id="studio-catalog-editor"></div><div id="studio-import"></div><div id="studio-catalog-list"></div>')+
   section('promotions','Motivos para regresar.','Promociones claras, retos alcanzables y beneficios que vale la pena disfrutar.','<div id="studio-promo-toolbar" class="studio-toolbar"></div><div id="studio-promo-editor"></div><div id="studio-promotions"></div><div class="section-heading"><h2>Tu constancia tiene premio.</h2></div><div id="studio-challenge-editor"></div><div id="studio-challenges"></div>')+
   section('calendar','Cada encuentro, en su momento.','Solicitudes y citas con horarios claros.','<div id="studio-calendar-toolbar" class="studio-toolbar"></div><div id="studio-appointment-editor"></div><div class="studio-calendar-layout"><div id="studio-calendar"></div><div id="studio-day-agenda"></div></div><p class="app-footnote" id="studio-timezone"></p>')+
   section('inbox','Lo nuevo en tu centro.','Confirmaciones, puntos y premios, en el mismo lugar.','<div id="studio-inbox"></div><div class="section-heading"><h2>Movimiento de tus puntos</h2></div><div id="studio-movements"></div>')+
   section('people','Personas que vuelven.','Conoce su actividad y realiza ajustes documentados cuando sea necesario.','<div id="studio-points-editor"></div><div id="studio-people"></div>'));
  $('club-list').insertAdjacentHTML('afterend','<div id="studio-home"></div>');
  $('business-setup').insertAdjacentHTML('afterbegin','<div id="studio-business"></div>');
  $('reward-form').insertAdjacentHTML('afterend','<div id="studio-reward-editor"></div>');
  document.body.classList.add('version-32');
 }
 mount();
 function focusInfo(node){return {node,elementId:node?.getAttribute?.('id'),action:node?.dataset?.studioAction,id:node?.dataset?.id,panel:node?.closest?.('[data-panel]')?.dataset.panel};}
 function focusNode(node){if(!node||node.disabled||node.closest?.('[hidden]'))return false;if(/^H[1-6]$/.test(node.tagName)||node.tagName==='LEGEND')node.setAttribute('tabindex','-1');node.focus();return true;}
 function restoreTrigger(info){
  const panel=document.querySelector('[data-panel]:not([hidden])');if(info?.panel&&panel?.dataset.panel!==info.panel)return;
  const original=info?.node;if(original?.isConnected&&focusNode(original))return;
  if(info?.elementId&&focusNode($(info.elementId)))return;
  const equivalent=Array.from(document.querySelectorAll('[data-studio-action]')).find(n=>n.dataset.studioAction===info?.action&&n.dataset.id===info?.id&&!n.disabled&&!n.closest('[hidden]'));
  if(!focusNode(equivalent))focusNode(panel?.querySelector('h2'));
 }
 function closeEditor(id){const info=editorReturns.get(id);$(id)?.replaceChildren();editorReturns.delete(id);restoreTrigger(info);}
 function showEditor(id,html){editorReturns.set(id,focusInfo(activeTrigger||document.activeElement));$(id).innerHTML=html;focusNode($(id).querySelector('input:not([type="hidden"]),select,textarea'));}
 function form(title,id,body,submit='Guardar cambios'){
  return '<form id="'+id+'" class="app-form studio-form"><div class="studio-form-heading"><h3>'+title+'</h3>'+action('Cerrar','close-editor',id)+'</div><div class="form-columns">'+body+'</div><div class="form-actions"><button type="submit" class="button button-primary">'+submit+'</button><span class="studio-save-state" role="status"></span></div><p class="form-result" role="alert"></p></form>';
 }
 function businessForm(){
  if(!schemaReady()||!isCompany())return;
  const current=club(),config=settings(),profile=profileFor(config.business_kind),target=$('studio-business');
  if(target.querySelector('form')&&target.dataset.club===(current?.id||'new'))return;
  target.dataset.club=current?.id||'new';step=0;logo=config.logo_data||'';
  const scale=[['independent','Independiente'],['small','Negocio con equipo pequeño'],['multi-site','Atención en varias áreas'],['organization','Organización o administración']];
  target.innerHTML='<section class="studio-business-intro"><div><h3>'+(current?'Tu negocio, con identidad propia.':'Crea un programa a tu medida.')+'</h3><p>El giro adapta el catálogo, la agenda y las ideas de recompensa. Puedes cambiarlo después.</p></div><span class="studio-version">3.2</span></section><form id="studio-business-form" class="app-form"><ol class="studio-steps" aria-label="Etapas de creación">'+['Tu actividad','Tu negocio','Tu programa','Revisión'].map((title,i)=>'<li data-wizard-label="'+i+'"><span>'+(i+1)+'</span>'+title+'</li>').join('')+'</ol>'+
   '<fieldset data-step="0"><legend>¿Qué hace tu negocio?</legend><div class="business-kind-grid">'+Object.entries(businessProfiles).map(([id,p])=>'<label class="business-kind"><input type="radio" name="business_kind" value="'+id+'" '+(id===config.business_kind?'checked':'')+'><span>'+icon(id==='food'?'catalog':id==='organization'?'people':'store')+'<strong>'+e(p.label)+'</strong><small>'+e(p.description)+'</small></span></label>').join('')+'</div><div class="form-columns">'+select('Forma de trabajo','business_scale',scale,config.business_scale)+'</div></fieldset>'+
   '<fieldset data-step="1" hidden><legend>Presenta tu negocio</legend><div class="form-columns">'+input('Nombre del negocio','name','text',current?.name||'','required minlength="2" maxlength="100" autocomplete="organization"')+input('Categoría visible','category','text',current?.category||profile.label,'required minlength="2" maxlength="60"')+input('Ciudad','city','text',current?.city||'','required minlength="2" maxlength="80" autocomplete="address-level2"')+input('Teléfono de contacto','phone','tel',config.phone,'maxlength="40"')+input('Dirección o referencia','address','text',config.address,'maxlength="250"')+select('Tema del negocio','theme',Object.entries(themes).map(([id,t])=>[id,t.label]),config.theme)+area('Qué hace especial a tu negocio','description',current?.description||'',500)+'</div><div id="studio-brand-preview" class="studio-brand-preview"></div></fieldset>'+
   '<fieldset data-step="2" hidden><legend>Define cómo quieren volver</legend><div class="form-columns">'+input('Puntos por visita confirmada','points_per_visit','number',current?.points_per_visit||profile.suggestedPoints,'required min="1" max="1000"')+select('Solicitudes de citas','booking_enabled',[['false','No recibir solicitudes todavía'],['true','Recibir solicitudes y confirmarlas']],String(config.booking_enabled))+select('Zona del negocio','timezone',[['America/Tijuana','Tijuana / Baja California'],['America/Mexico_City','Ciudad de México'],['America/Monterrey','Monterrey'],['America/Cancun','Cancún'],['America/Los_Angeles','Los Ángeles'],['America/Bogota','Bogotá'],['America/Lima','Lima'],['America/Santiago','Santiago'],['America/Argentina/Buenos_Aires','Buenos Aires'],['Europe/Madrid','Madrid']],config.timezone)+area('Horarios de atención','hours',config.hours,500)+'</div><p class="studio-hint" id="studio-reward-hint">'+e(profile.rewardHint)+'</p><p class="app-footnote">Los niveles Explorador, Habitual y Preferente describen visitas confirmadas. No cambian permisos ni prometen beneficios que el negocio no haya creado.</p></fieldset>'+
   '<fieldset data-step="3" hidden><legend>Revisa antes de guardar</legend><div id="studio-wizard-summary"></div><p class="studio-hint">Tu programa conserva su visibilidad actual. Al crear uno nuevo empieza en privado. Después de guardarlo podrás subir tu logo y preparar el catálogo.</p></fieldset>'+
   '<div class="wizard-actions"><button type="button" class="button button-outline" id="studio-wizard-back">Anterior</button><span id="studio-wizard-position"></span><button type="button" class="button button-primary" id="studio-wizard-next">Continuar '+icon('arrow')+'</button><button type="submit" class="button button-primary" id="studio-wizard-save" hidden>'+(current?'Guardar configuración':'Crear mi programa')+'</button></div><p class="form-result" role="alert"></p></form>'+
   (current?'<section class="studio-logo-section"><div><h3>Tu logo, tu firma.</h3><p>Sube una imagen PNG, JPG o WEBP de hasta 5 MB. Se adapta al catálogo y al perfil de tu negocio.</p><label class="button button-outline studio-file-button">Subir o cambiar logo<input id="studio-logo-file" type="file" accept="image/png,image/jpeg,image/webp"></label>'+action('Quitar logo','remove-logo')+'</div><div id="studio-logo-preview">'+(logo?'<img src="'+e(logo)+'" alt="Logo actual del negocio">':icon('store'))+'</div></section>':'')+
   (current?'<section class="studio-share"><div><h3>Invita a tu comunidad.</h3><p>Comparte este código para que tus clientes se unan.</p><strong>'+e(current.join_code)+'</strong></div><div><p>'+(current.is_listed?'Tu negocio está visible en Explorar.':'Tu programa está en privado.')+'</p><button type="button" class="button button-outline" data-action="visibility" data-club="'+e(current.id)+'" data-active="'+String(!current.is_listed)+'">'+(current.is_listed?'Dejar en privado':'Publicar en Explorar')+'</button></div></section>':'');
  updateWizard();renderBrandPreview();
 }
 function readBusiness(){
  const f=$('studio-business-form'),v=name=>f.elements.namedItem(name).value;
  return {business:{name:v('name').trim(),category:v('category').trim(),city:v('city').trim(),description:v('description').trim(),points_per_visit:Number(v('points_per_visit'))},settings:{business_kind:v('business_kind'),business_scale:v('business_scale'),theme:v('theme'),timezone:v('timezone'),logo_data:logo,booking_enabled:v('booking_enabled')==='true',phone:v('phone').trim(),address:v('address').trim(),hours:v('hours').trim()}};
 }
 function renderBrandPreview(){const f=$('studio-business-form');if(!f)return;const data=readBusiness(),theme=themes[data.settings.theme];$('studio-brand-preview').style.setProperty('--preview-deep',theme.deep);$('studio-brand-preview').style.setProperty('--preview-gold',theme.accent);$('studio-brand-preview').innerHTML=(logo?'<img src="'+e(logo)+'" alt="">':icon('store'))+'<div><strong>'+e(data.business.name||'Tu negocio')+'</strong><span>'+e(profileFor(data.settings.business_kind).label)+' · '+e(data.business.city||'Tu ciudad')+'</span></div><b>Un motivo para volver.</b>';}
 function updateWizard({focus=false}={}){
  const f=$('studio-business-form');if(!f)return;
  for(const fieldset of f.querySelectorAll('[data-step]')){fieldset.hidden=Number(fieldset.dataset.step)!==step;fieldset.disabled=fieldset.hidden;}
  for(const label of f.querySelectorAll('[data-wizard-label]')){const current=Number(label.dataset.wizardLabel)===step;label.dataset.current=String(current);if(current)label.setAttribute('aria-current','step');else label.removeAttribute('aria-current');}
  $('studio-wizard-back').disabled=step===0;$('studio-wizard-next').hidden=step===3;$('studio-wizard-save').hidden=step!==3;$('studio-wizard-position').textContent='Paso '+(step+1)+' de 4';
  if(step===3){const data=readBusiness(),p=profileFor(data.settings.business_kind);$('studio-wizard-summary').innerHTML='<dl class="studio-summary">'+[['Negocio',data.business.name],['Actividad',p.label],['Ciudad',data.business.city],['Catálogo',p.catalog],['Puntos por visita',data.business.points_per_visit],['Citas',data.settings.booking_enabled?'Solicitud y confirmación':'Desactivadas'],['Tema',themes[data.settings.theme].label]].map(([key,value])=>'<div><dt>'+e(key)+'</dt><dd>'+e(value)+'</dd></div>').join('')+'</dl>';}
  if(focus)focusNode(f.querySelector('[data-step="'+step+'"] legend'));
 }
 async function refresh(){
  if(!context)return;const version=++requestVersion,identityEpoch=epoch;
  const {data,error}=await supabase.rpc('cia_studio_snapshot');
  if(version!==requestVersion||identityEpoch!==epoch)return;
  if(error){document.body.classList.remove('has-studio');state=null;for(const id of ['studio-catalog-list','studio-promotions','studio-calendar','studio-inbox','studio-people'])$(id).innerHTML=empty('Versión 3.2 pendiente en este entorno.','La base de fidelidad sigue disponible. Los módulos nuevos se habilitan con su migración.');return;}
  if(!data||!['settings','catalog','promotions','appointments','notices','movements','challenges','claims'].every(key=>Array.isArray(data[key])))return;
  state=data;document.body.classList.add('has-studio');render();onUpdate?.({userId:context.identity.user.id,state});
 }
 async function save(name,args,formNode,success,{core=true}={}){
  if(saving||!context||!state)return false;const identityEpoch=epoch,returnFocus=focusInfo(document.activeElement);saving=true;
  const button=formNode?.querySelector('[type="submit"]');if(button)button.disabled=true;formNode?.setAttribute('aria-busy','true');
  const errorNode=formNode?.querySelector('.form-result');if(errorNode)errorNode.textContent='';
  try{const {data,error}=await supabase.rpc(name,args);if(identityEpoch!==epoch)return false;if(error)throw error;
   result(success);acknowledge(name);if(core)await refreshCore();await refresh();if(!formNode)restoreTrigger(returnFocus);return true;
  }catch(error){if(identityEpoch!==epoch)return false;const message=studioError(error);if(errorNode)errorNode.textContent=message;else result(message,'error');return false;}
  finally{if(identityEpoch===epoch){saving=false;if(button)button.disabled=false;formNode?.setAttribute('aria-busy','false');}}
 }
 function titleFor(view){return {catalog:isCompany()?profileFor(settings().business_kind).catalog:'Catálogos',promotions:'Promociones y retos',calendar:'Calendario',inbox:'Notificaciones',people:'Clientes y puntos'}[view]||'Mi centro';}
 function render(){
  const company=isCompany(),config=settings(),p=profileFor(config.business_kind),theme=themes[config.theme]||themes.midnight;
  document.body.style.setProperty('--studio-deep',theme.deep);document.body.style.setProperty('--studio-accent',theme.accent);document.body.style.setProperty('--studio-soft',theme.soft);
  for(const button of document.querySelectorAll('[data-view="people"],[data-go="people"]'))button.hidden=!company;
  const catalogButton=document.querySelector('[data-view="catalog"]');catalogButton.setAttribute('aria-label',company?p.catalog:'Catálogos');catalogButton.querySelector('span').textContent=company?p.catalog:'Catálogos';
  const unread=state.notices.filter(n=>!n.read_at).length;$('studio-unread').textContent=String(unread);$('studio-unread').hidden=!unread;document.querySelector('[data-view="inbox"]').setAttribute('aria-label','Notificaciones'+(unread?', '+unread+' sin leer':''));
  businessForm();renderCatalog();renderPromotions();renderChallenges();renderCalendar();renderInbox();renderPeople();renderHome();
 }
 function renderHome(){
  if(isCompany()){$('studio-home').innerHTML='<div class="studio-quick-actions">'+[['catalog','catalog','Preparar '+profileFor(settings().business_kind).catalog.toLowerCase()],['promotions','spark','Crear un motivo para volver'],['calendar','calendar','Organizar la atención']].map(([view,glyph,label])=>'<button type="button" data-go="'+view+'">'+icon(glyph)+'<span>'+e(label)+'</span>'+icon('arrow')+'</button>').join('')+'</div>';return;}
  const levels=context.snapshot.clubs.map(c=>{const level=loyaltyLevel(c.visits_count);return '<div class="studio-level"><span>'+icon('star')+'</span><div><h3>'+e(c.name)+'</h3><p>'+number(c.visits_count)+(Number(c.visits_count)===1?' visita confirmada':' visitas confirmadas')+(level.next?' · '+number(level.remaining)+' para '+e(level.next):' · Gracias por seguir volviendo.')+'</p></div><strong>'+e(level.label)+'</strong></div>';}).join('');
  const next=state.challenges.filter(c=>c.active&&Date.parse(c.ends_at)>=Date.parse(state.server_time)).slice(0,2);
  $('studio-home').innerHTML=(levels?'<div class="section-heading"><h2>Tu historia en cada lugar.</h2></div>'+levels:'')+(next.length?'<div class="section-heading"><h2>Un regreso más cerca.</h2><button class="text-button" type="button" data-go="promotions">Ver retos '+icon('arrow')+'</button></div>'+next.map(challengeCard).join(''):'');
 }
 function renderCatalog(){
  const company=isCompany(),p=profileFor(settings().business_kind);
  document.querySelector('[data-panel="catalog"] h2').textContent=company?'Un catálogo con tu sello.':'Elige tu próxima visita.';
  $('studio-catalog-toolbar').innerHTML=company?'<p>Organiza '+e(p.catalog.toLowerCase())+' por categorías. Los cambios se guardan para tu programa.</p><div>'+action('Importar documento '+icon('upload'),'open-import')+action('Añadir '+e(p.item)+' '+icon('plus'),'new-item')+action('Exportar CSV','export-catalog')+'</div>':'<label>Negocio<select id="studio-catalog-filter"><option value="">Todos mis negocios</option>'+context.snapshot.clubs.map(c=>'<option value="'+e(c.id)+'">'+e(c.name)+'</option>').join('')+'</select></label>';
  const selected=$('studio-catalog-filter')?.value||'';
  const items=state.catalog.filter(i=>!selected||i.club_id===selected);
  $('studio-catalog-list').innerHTML=items.length?'<div class="studio-catalog-grid">'+items.map(i=>{
   const brand=settings(i.club_id),logoHTML=brand.logo_data?'<img class="studio-mini-logo" src="'+e(brand.logo_data)+'" alt="">':icon(i.item_kind==='service'?'visit':'catalog');
   return '<article class="studio-catalog-item"><div class="studio-catalog-heading">'+logoHTML+'<span>'+e(clubName(i.club_id))+' · '+e(i.category)+'</span></div><div class="studio-item-title"><h3>'+e(i.title)+'</h3><strong>'+money(i.price,i.currency)+'</strong></div><p>'+e(i.description)+'</p><div class="studio-item-meta"><span>'+e(i.item_kind==='service'?'Servicio':'Producto')+(i.duration_minutes?' · '+number(i.duration_minutes)+' min':'')+'</span><span class="state-label">'+(i.active?'Disponible':'Pausado')+'</span></div>'+(company?action('Editar','edit-item',i.id):i.item_kind==='service'&&brand.booking_enabled?action('Solicitar cita '+icon('arrow'),'book-item',i.id):'')+'</article>';
  }).join('')+'</div>':empty('Dale forma a lo que ofreces.',company?'Añade productos o servicios, o importa un documento para revisarlo antes de guardar.':'Los catálogos de tus negocios aparecerán aquí cuando los preparen.');
 }
 function itemEditor(item={}){
  if(!club()){navigate('explore');return;}
  showEditor('studio-catalog-editor',form(item.id?'Editar elemento':'Añadir al catálogo','studio-item-form','<input type="hidden" name="id" value="'+e(item.id||'')+'">'+input('Nombre','title','text',item.title||'','required minlength="2" maxlength="120"')+input('Categoría','category','text',item.category||'General','maxlength="80"')+select('Tipo','item_kind',[['product','Producto'],['service','Servicio']],item.item_kind||(profileFor(settings().business_kind).item==='servicio'?'service':'product'))+input('Precio','price','number',item.price||0,'required min="0" max="10000000" step="0.01"')+select('Moneda','currency',[['MXN','MXN'],['USD','USD'],['EUR','EUR']],item.currency||'MXN')+input('Duración en minutos','duration_minutes','number',item.duration_minutes||'','min="5" max="1440"')+select('Disponibilidad','active',[['true','Disponible'],['false','Pausado']],String(item.active!==false))+area('Descripción','description',item.description||'',1000)));
 }
 function importEditor(){
  if(!club()){navigate('explore');return;}importVersion++;importReturn=focusInfo(activeTrigger||document.activeElement);importRows=[];importRequest=crypto.randomUUID();
  $('studio-import').innerHTML='<section class="studio-import-box"><div class="studio-form-heading"><div><h3>Tu documento, convertido en catálogo.</h3><p>Revisa y modifica cada fila antes de guardar. Se admiten archivos de hasta 10 MB.</p></div>'+action('Cerrar','close-import')+'</div><div class="studio-import-options"><label class="button button-primary studio-file-button">'+icon('upload')+'Elegir documento<input id="studio-import-file" type="file" accept=".csv,.tsv,.json,.html,.htm,.txt,.md,.docx,.pdf"></label>'+action('Descargar CSV de ejemplo','sample-csv')+'</div><p class="app-footnote">CSV, TSV, JSON, HTML, TXT, Markdown, DOCX y PDF con texto. La extracción de PDF y texto necesita revisión. No se ejecuta el HTML del documento.</p><p id="studio-import-message" role="status"></p><div id="studio-import-preview"></div></section>';
 }
 function renderImport(){
  const existing=new Set(state.catalog.map(i=>(i.title+'|'+i.category).toLocaleLowerCase('es')));
  const duplicates=importRows.filter(r=>existing.has((r.title+'|'+r.category).toLocaleLowerCase('es'))).length;
  $('studio-import-preview').innerHTML='<p>'+number(importRows.length)+' filas para revisar. '+(duplicates?number(duplicates)+' nombres ya existen en esta categoría.':'')+'</p><div class="table-scroll studio-import-table"><table><thead><tr><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Moneda</th><th>Tipo</th><th>Duración</th><th>Revisión</th></tr></thead><tbody>'+importRows.map((r,i)=>'<tr>'+['title','category','price','currency','item_kind','duration_minutes'].map(field=>{const label={title:'Nombre',category:'Categoría',price:'Precio',currency:'Moneda',item_kind:'Tipo',duration_minutes:'Duración'}[field],attrs=' aria-label="'+label+' fila '+(i+1)+'" data-import-row="'+i+'" data-import-field="'+field+'"';return '<td>'+(['currency','item_kind'].includes(field)?'<select'+attrs+'>'+(field==='currency'?[['MXN','MXN'],['USD','USD'],['EUR','EUR']]:[['product','Producto'],['service','Servicio']]).map(([value,title])=>'<option value="'+value+'" '+(r[field]===value?'selected':'')+'>'+title+'</option>').join('')+'</select>':'<input'+attrs+' value="'+e(r[field]??'')+'">')+'</td>';}).join('')+'<td><span data-import-error="'+i+'">'+e(catalogRowErrors(r).join(', ')||'Lista')+'</span>'+action('Quitar','drop-import',String(i))+'</td></tr>').join('')+'</tbody></table></div><label class="studio-check"><input id="studio-skip-duplicates" type="checkbox" checked>Omitir nombres que ya existen en la misma categoría</label><button id="studio-save-import" type="button" class="button button-primary">Guardar catálogo revisado</button><p id="studio-import-save-error" role="alert"></p>';
 }
 function renderPromotions(){
  $('studio-promo-toolbar').innerHTML=isCompany()?'<p>Las promociones se muestran durante sus fechas. El negocio aplica sus condiciones al atender al cliente.</p><div>'+action('Crear promoción '+icon('plus'),'new-promotion')+action('Crear reto '+icon('spark'),'new-challenge')+'</div>':'<p>Ofertas de tus negocios, con fechas y condiciones claras.</p>';
  $('studio-promotions').innerHTML=state.promotions.length?'<div class="studio-promotions-grid">'+state.promotions.map(p=>'<article class="studio-promotion"><span class="studio-promo-kind">'+e(promotionKinds[p.promotion_kind])+'</span><h3>'+e(p.title)+'</h3><p>'+e(p.description)+'</p>'+(p.promotion_kind==='discount'?'<strong>'+number(p.value)+'% de descuento</strong>':'')+'<p class="studio-promo-date">'+stamp(p.starts_at)+' — '+stamp(p.ends_at)+'</p><span>'+e(clubName(p.club_id))+' · '+(p.active?'Activa':'Pausada')+'</span>'+(isCompany()?action('Editar promoción','edit-promotion',p.id):'')+'</article>').join('')+'</div>':empty('Una buena razón para volver.',isCompany()?'Crea una promoción con condiciones y fechas, o un reto que premie la constancia.':'Las promociones activas de tus negocios aparecerán aquí.');
 }
 function promotionEditor(p={}){
  if(!club()){navigate('explore');return;}
  showEditor('studio-promo-editor',form(p.id?'Editar promoción':'Crear promoción','studio-promotion-form','<input name="id" type="hidden" value="'+e(p.id||'')+'">'+input('Título','title','text',p.title||'','required minlength="2" maxlength="120"')+select('Tipo','promotion_kind',Object.entries(promotionKinds),p.promotion_kind||'special')+input('Valor (porcentaje si es descuento)','value','number',p.value||0,'min="0" max="1000000" step="0.01"')+select('Estado','active',[['true','Activa'],['false','Pausada']],String(p.active!==false))+input('Desde','starts_at','datetime-local',localDateTime(p.starts_at||new Date()),'required')+input('Hasta','ends_at','datetime-local',localDateTime(p.ends_at||new Date(Date.now()+7*86400000)),'required')+area('Condiciones y descripción','description',p.description||'',1000)));
 }
 function challengeCard(c){
  const progress=challengeProgress(c,context.snapshot.visits,state.claims,context.identity.user.id,state.server_time);
  return '<article class="studio-challenge"><div><span class="studio-challenge-icon">'+icon('star')+'</span><h3>'+e(c.title)+'</h3><p>'+number(c.target_visits)+(Number(c.target_visits)===1?' visita confirmada · +':' visitas confirmadas · +')+number(c.bonus_points)+' puntos</p></div><div class="studio-stamps" aria-label="'+number(progress.count)+' de '+number(c.target_visits)+' visitas">'+Array.from({length:Math.min(10,c.target_visits)},(_,i)=>'<span class="'+(i<progress.count?'is-earned':'')+'">'+icon(i<progress.count?'check':'visit')+'</span>').join('')+'</div><p>'+(!isCompany()?(progress.claimed?'Bono recibido. ¡Gracias por volver!':progress.canClaim?'Tu constancia ya merece su premio.':number(progress.remaining)+' visitas para completar el reto.'):'Vigencia: '+stamp(c.starts_at)+' — '+stamp(c.ends_at))+'</p>'+(!isCompany()?'<button type="button" class="button button-primary" data-studio-action="claim-challenge" data-id="'+e(c.id)+'" '+(!progress.canClaim?'disabled':'')+'>'+(progress.claimed?'Bono recibido':'Recibir mi bono')+'</button>':'')+'</article>';
 }
 function renderChallenges(){$('studio-challenges').innerHTML=state.challenges.length?state.challenges.map(challengeCard).join(''):empty('La constancia también se celebra.',isCompany()?'Prepara un reto de visitas con un bono definido. El sistema verifica las visitas confirmadas.':'Cuando un negocio cree un reto, verás tu avance y el bono aquí.');}
 function challengeEditor(){if(!club()){navigate('explore');return;}showEditor('studio-challenge-editor',form('Crear un reto alcanzable','studio-challenge-form',input('Nombre del reto','title','text','','required minlength="2" maxlength="120"')+input('Visitas confirmadas necesarias','target_visits','number',3,'required min="1" max="50"')+input('Bono de puntos al completarlo','bonus_points','number',20,'required min="1" max="10000"')+input('Desde','starts_at','datetime-local',localDateTime(new Date()),'required')+input('Hasta','ends_at','datetime-local',localDateTime(new Date(Date.now()+30*86400000)),'required')));}
 function renderCalendar(){
  const company=isCompany(),resources=[...new Set(state.appointments.map(a=>a.resource))];
  $('studio-calendar-toolbar').innerHTML='<p>Las solicitudes se confirman por el negocio. Una cita no otorga puntos automáticamente.</p><div>'+select('Recurso','calendar_resource',[['','Todos los recursos'],...resources.map(r=>[r,r])],'','id="studio-resource-filter"')+action(company?'Añadir cita o bloqueo':'Solicitar cita','new-appointment')+'</div>';
  const month=viewMonth.getMonth(),year=viewMonth.getFullYear(),first=new Date(year,month,1),offset=(first.getDay()+6)%7,days=new Date(year,month+1,0).getDate();
  $('studio-calendar').innerHTML='<div class="studio-month-heading">'+action('Anterior','previous-month')+'<h3>'+new Intl.DateTimeFormat('es-MX',{month:'long',year:'numeric'}).format(first)+'</h3>'+action('Siguiente','next-month')+'</div><label class="studio-day-picker">Elegir día<input id="studio-day-select" type="date" value="'+selectedDay+'"></label><div class="studio-weekdays">'+['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(d=>'<span>'+d+'</span>').join('')+'</div><div class="studio-month-grid">'+Array.from({length:offset},()=>'<span></span>').join('')+Array.from({length:days},(_,i)=>{const day=dayKey(new Date(year,month,i+1)),count=state.appointments.filter(a=>dayKey(a.starts_at)===day&&a.state!=='cancelled').length;return '<button type="button" data-studio-action="select-day" data-id="'+day+'" aria-label="'+e(day)+(count?', '+count+(count===1?' cita':' citas'):'')+'" aria-pressed="'+String(day===selectedDay)+'"><strong>'+(i+1)+'</strong>'+(count?'<span>'+count+'</span>':'')+'</button>';}).join('')+'</div>';
  renderDayAgenda();$('studio-timezone').textContent='Horas de este dispositivo: '+Intl.DateTimeFormat().resolvedOptions().timeZone+'. Cada solicitud conserva su instante de inicio y fin. Confirma con el negocio si estás en otra zona.';
 }
 function renderDayAgenda(){
  const resource=$('studio-resource-filter')?.value||'';
  const list=state.appointments.filter(a=>dayKey(a.starts_at)===selectedDay&&(!resource||a.resource===resource)).sort((a,b)=>a.starts_at.localeCompare(b.starts_at));
  $('studio-day-agenda').innerHTML='<h3>'+new Intl.DateTimeFormat('es-MX',{weekday:'long',day:'numeric',month:'long'}).format(new Date(selectedDay+'T12:00:00'))+'</h3>'+(list.length?list.map(a=>'<article class="studio-agenda-item"><div><strong>'+e(a.title)+'</strong><p>'+stamp(a.starts_at)+' — '+new Intl.DateTimeFormat('es-MX',{hour:'2-digit',minute:'2-digit'}).format(new Date(a.ends_at))+'</p><p>'+e(isCompany()?a.customer_name||'Bloqueo interno':a.club_name)+' · '+e(a.resource)+'</p><span class="state-label">'+e(appointmentStates[a.state])+'</span>'+(a.note?'<p>'+e(a.note)+'</p>':'')+'</div><div class="studio-agenda-actions">'+(isCompany()&&a.state==='requested'?action('Confirmar','appointment-state',a.id,'data-state="confirmed"'):'')+(isCompany()&&a.state==='confirmed'?action('Completar','appointment-state',a.id,'data-state="completed"'):'')+(['requested','confirmed'].includes(a.state)?action('Cancelar','appointment-state',a.id,'data-state="cancelled"'):'')+'</div></article>').join(''):empty('Un espacio por organizar.','No hay citas registradas para este día.'));
 }
 function appointmentEditor(item){
  if(document.body.classList.contains('has-operations')){document.dispatchEvent(new CustomEvent('cia-ops-book',{detail:{item}}));return;}
  const company=isCompany(),available=company?(club()?[club()]:[]):context.snapshot.clubs.filter(c=>settings(c.id).booking_enabled);
  if(!available.length){result(company?'Primero crea tu negocio.':'Ninguno de tus negocios recibe solicitudes de citas todavía.','error');return;}
  const selected=item?.club_id||available[0].id,start=new Date(selectedDay+'T10:00:00');if(!company&&start<new Date()){start.setTime(Math.ceil((Date.now()+3600000)/1800000)*1800000);}const end=new Date(start.getTime()+(item?.duration_minutes||30)*60000);
  showEditor('studio-appointment-editor',form(company?'Organiza una cita o atención':'Solicita un horario','studio-appointment-form',select('Negocio','club_id',available.map(c=>[c.id,c.name]),selected)+input('Título o servicio','title','text',item?.title||'','required minlength="2" maxlength="120"')+(company?select('Cliente','user_id',[['','Bloqueo interno / sin cliente'],...context.snapshot.members.map(m=>[m.user_id,m.customer_name])],''):'')+select('Servicio del catálogo (opcional)','catalog_id',[['','Sin servicio seleccionado'],...state.catalog.filter(c=>c.club_id===selected&&c.item_kind==='service'&&c.active).map(c=>[c.id,c.title])],item?.id||'')+input('Inicio','starts_at','datetime-local',localDateTime(start),'required')+input('Fin','ends_at','datetime-local',localDateTime(end),'required')+input(profileFor(settings(selected).business_kind).resource,'resource','text','Principal','required maxlength="60"')+area('Nota para la atención','note','','500'),company?'Guardar cita':'Enviar solicitud'));
 }
 function renderInbox(){
  $('studio-inbox').innerHTML=state.notices.length?'<div class="studio-notices">'+state.notices.map(n=>'<article class="studio-notice '+(!n.read_at?'is-unread':'')+'">'+icon(n.notice_kind==='appointment'?'calendar':n.notice_kind==='redemption'?'gift':'bell')+'<div><h3>'+e(n.title)+'</h3><p>'+e(n.body)+'</p><small>'+stamp(n.created_at)+' · '+e(clubName(n.club_id))+'</small></div>'+(!n.read_at?action('Marcar leída','read-notice',n.id):'<span class="studio-read-label">Leída</span>')+'</article>').join('')+'</div>':empty('Tu centro está al día.','Aquí aparecerán confirmaciones de visitas, ajustes, citas y premios. Son avisos dentro de la aplicación; no correos ni notificaciones push.');
  $('studio-movements').innerHTML=state.movements.length?'<div class="table-scroll"><table class="activity-table"><thead><tr><th>Fecha</th><th>'+(isCompany()?'Cliente':'Negocio')+'</th><th>Movimiento</th><th>Puntos</th></tr></thead><tbody>'+state.movements.map(m=>'<tr><td>'+stamp(m.created_at)+'</td><td>'+e(isCompany()?m.customer_name:m.club_name)+'</td><td>'+e(m.reason)+'</td><td class="'+(m.amount>0?'studio-credit':'studio-debit')+'">'+(m.amount>0?'+':'')+number(m.amount)+'</td></tr>').join('')+'</tbody></table></div>':empty('Cada punto tendrá una historia.','Verás aquí visitas confirmadas, canjes, bonos y ajustes documentados.');
 }
 function renderPeople(){
  if(!isCompany()){$('studio-people').innerHTML=empty('Tu cuenta es personal.','El historial de tus puntos está en Notificaciones.');return;}
  $('studio-people').innerHTML=context.snapshot.members.length?'<div class="table-scroll"><table class="activity-table"><thead><tr><th>Cliente</th><th>Nivel</th><th>Visitas</th><th>Puntos</th><th>Actividad</th></tr></thead><tbody>'+context.snapshot.members.map(m=>'<tr><td><strong>'+e(m.customer_name)+'</strong></td><td>'+e(loyaltyLevel(m.visits_count).label)+'</td><td>'+number(m.visits_count)+'</td><td>'+number(m.points)+'</td><td>'+action('Ajustar puntos','adjust-points',m.user_id)+'</td></tr>').join('')+'</tbody></table></div>':empty('Tu comunidad empieza con una invitación.','Comparte el código de tu programa. Los clientes que se unan aparecerán aquí.');
 }
 function pointsEditor(userId){
  const member=context.snapshot.members.find(m=>m.user_id===userId);if(!member)return;
  showEditor('studio-points-editor',form('Ajuste documentado: '+e(member.customer_name),'studio-points-form','<input name="user_id" type="hidden" value="'+e(userId)+'">'+input('Puntos a añadir o descontar','amount','number','','required min="-100000" max="100000" step="1"')+input('Motivo del ajuste','reason','text','','required minlength="3" maxlength="250"')+'<p class="field-wide studio-hint">Saldo actual: '+number(member.points)+' puntos. Usa un número negativo para descontar. El motivo queda en el historial y el cliente recibe un aviso.</p>','Confirmar ajuste'));
 }
 function rewardEditor(reward={}){
  if(!club()){navigate('explore');return;}
  $('reward-form').hidden=true;
  showEditor('studio-reward-editor',form(reward.id?'Editar recompensa':'Crea una recompensa a tu medida','studio-reward-form','<input name="id" type="hidden" value="'+e(reward.id||'')+'">'+input('Nombre del premio','title','text',reward.title||'','required minlength="2" maxlength="100"')+select('Tipo de recompensa','reward_kind',Object.entries(rewardKinds),reward.reward_kind||'product')+input('Puntos necesarios','points_cost','number',reward.points_cost||100,'required min="1" max="1000000"')+input('Unidades disponibles (vacío: sin límite)','stock','number',reward.stock??'','min="0" max="1000000"')+input('Válido hasta (opcional)','valid_until','datetime-local',reward.valid_until?localDateTime(reward.valid_until):'')+area('Descripción','description',reward.description||'',500)+area('Condiciones de uso y entrega','terms',reward.terms||'',1000)));
 }
 function acknowledge(name){
  if(!/visit|redeem|claim|appointment/.test(name)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  $('studio-celebration').innerHTML='<span>'+icon(/redeem|claim/.test(name)?'gift':'check')+'</span>'+icon('star')+icon('spark');
  $('studio-celebration').classList.remove('is-celebrating');requestAnimationFrame(()=>$('studio-celebration').classList.add('is-celebrating'));
 }
 function animateNavigation(next,apply){
  if(navigation)navigation.cancel();clearTimeout(navigationTimer);
  const current=document.querySelector('[data-panel]:not([hidden])'),identityEpoch=epoch;
  if(!current||matchMedia('(prefers-reduced-motion: reduce)').matches||!current.animate){apply();return;}
  navigation=current.animate([{opacity:1,transform:'translateY(0)'},{opacity:.4,transform:'translateY(-5px)'}],{duration:90,easing:'ease-out'});
  navigation.onfinish=()=>{if(identityEpoch!==epoch)return;apply();const panel=document.querySelector('[data-panel="'+next+'"]');focusNode(panel?.querySelector('.studio-form input:not([type="hidden"]),.studio-form select,.studio-form textarea'));panel?.animate([{opacity:.6,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:190,easing:'cubic-bezier(.16,1,.3,1)'});};
 }
 function clear(){
  epoch++;requestVersion++;editorReturns.clear();activeTrigger=null;importReturn=null;context=null;state=null;saving=false;logo='';importVersion++;importRows=[];importRequest=null;if(navigation)navigation.cancel();clearTimeout(navigationTimer);
  document.body.classList.remove('has-studio');document.body.style.removeProperty('--studio-deep');document.body.style.removeProperty('--studio-accent');document.body.style.removeProperty('--studio-soft');
  for(const id of ['studio-home','studio-business','studio-catalog-list','studio-catalog-editor','studio-import','studio-promotions','studio-promo-editor','studio-challenges','studio-challenge-editor','studio-calendar','studio-day-agenda','studio-appointment-editor','studio-inbox','studio-movements','studio-people','studio-points-editor','studio-reward-editor'])$(id).textContent='';
  $('studio-business').dataset.club='';$('studio-unread').hidden=true;$('studio-celebration').textContent='';$('studio-menu').hidePopover?.();
 }
 function update(value){context=value;refresh();}
 document.addEventListener('click',async event=>{
  if(event.target.closest('[data-view],[data-go]'))$('studio-menu').hidePopover?.();
  if(event.target.closest('#show-reward-form')&&state&&isCompany()){activeTrigger=event.target.closest('#show-reward-form');if(club())rewardEditor();return;}
  const button=event.target.closest('[data-studio-action]');if(!button||!state||!context)return;activeTrigger=button;const {studioAction:kind,id,state:nextState}=button.dataset;
  if(kind==='logout'){$('studio-menu').hidePopover?.();$('logout').click();return;}
  if(kind==='close-editor'){const id=button.closest('.studio-form')?.parentElement?.getAttribute('id');if(id)closeEditor(id);return;}
  if(kind==='close-import'){importVersion++;$('studio-import').textContent='';importRows=[];restoreTrigger(importReturn);return;}
  if(kind==='new-item')itemEditor();
  if(kind==='edit-item')itemEditor(state.catalog.find(i=>i.id===id));
  if(kind==='open-import')importEditor();
  if(kind==='drop-import'){const info=focusInfo(button);importRows.splice(Number(id),1);renderImport();restoreTrigger(info);}
  if(kind==='sample-csv')download('plantilla-catalogo.csv','nombre,descripcion,categoria,precio,moneda,tipo,duracion\n"Servicio personalizado","Descripción de tu servicio","General",150,MXN,servicio,30\n','text/csv;charset=utf-8');
  if(kind==='export-catalog'){const cols=['title','description','category','price','currency','item_kind','duration_minutes'];download('mi-catalogo.csv',cols.join(',')+'\n'+state.catalog.map(item=>cols.map(k=>'"'+String(item[k]??'').replaceAll('"','""')+'"').join(',')).join('\n'),'text/csv;charset=utf-8');}
  if(kind==='new-promotion')promotionEditor();
  if(kind==='edit-promotion')promotionEditor(state.promotions.find(p=>p.id===id));
  if(kind==='new-challenge')challengeEditor();
  if(kind==='claim-challenge')await save('cia_studio_claim_challenge',{p_id:id},null,'¡Reto completado! Tu bono ya está en tus puntos.');
  if(kind==='new-appointment')appointmentEditor();
  if(kind==='book-item'){if(!document.body.classList.contains('has-operations'))navigate('calendar');appointmentEditor(state.catalog.find(i=>i.id===id));}
  if(kind==='appointment-state')await save('cia_studio_update_appointment',{p_id:id,p_state:nextState},null,'Estado de la cita actualizado.',{core:false});
  if(kind==='read-notice')await save('cia_studio_read_notice',{p_id:id},null,'Notificación marcada como leída.',{core:false});
  if(kind==='adjust-points')pointsEditor(id);
  if(kind==='edit-reward')rewardEditor(context.snapshot.rewards.find(r=>r.id===id));
  if(kind==='previous-month'||kind==='next-month'){viewMonth=new Date(viewMonth.getFullYear(),viewMonth.getMonth()+(kind==='next-month'?1:-1),1);selectedDay=dayKey(viewMonth);renderCalendar();restoreTrigger(focusInfo(button));}
  if(kind==='select-day'){selectedDay=id;renderCalendar();restoreTrigger(focusInfo(button));}
  if(kind==='remove-logo'){logo='';const data=readBusiness();await save('cia_studio_save_business',{p_club:club().id,p_business:data.business,p_settings:data.settings},null,'Logo actualizado.');$('studio-business').dataset.club='';businessForm();}
 });
 document.addEventListener('click',event=>{
  const button=event.target.closest('#studio-wizard-next,#studio-wizard-back');if(!button||!context)return;
  if(button.id==='studio-wizard-back')step=Math.max(0,step-1);else{const visible=$('studio-business-form').querySelector('[data-step="'+step+'"]');if(!Array.from(visible.querySelectorAll('input,select,textarea')).every(el=>el.reportValidity()))return;step=Math.min(3,step+1);}updateWizard({focus:true});
 });
 document.addEventListener('input',event=>{
  const field=event.target;
  if(field.dataset.importRow!==undefined){const row=importRows[Number(field.dataset.importRow)],key=field.dataset.importField;if(!row)return;row[key]=['price','duration_minutes'].includes(key)?field.value===''?key==='duration_minutes'?null:0:Number(field.value):field.value;document.querySelector('[data-import-error="'+field.dataset.importRow+'"]').textContent=catalogRowErrors(row).join(', ')||'Lista';}
  if(field.closest('#studio-business-form'))renderBrandPreview();
 });
 document.addEventListener('change',async event=>{
  const field=event.target,identityEpoch=epoch;if(!context||!state)return;
  if(field.name==='business_kind'&&field.closest('#studio-business-form')){const p=profileFor(field.value);if(!club()){$('studio-business-form').elements.namedItem('category').value=p.label;$('studio-business-form').elements.namedItem('points_per_visit').value=p.suggestedPoints;}$('studio-reward-hint').textContent=p.rewardHint;renderBrandPreview();}
  if(field.name==='club_id'&&field.closest('#studio-appointment-form')){const f=field.form;f.elements.namedItem('catalog_id').innerHTML='<option value="">Sin servicio seleccionado</option>'+state.catalog.filter(c=>c.club_id===field.value&&c.item_kind==='service'&&c.active).map(c=>'<option value="'+e(c.id)+'">'+e(c.title)+'</option>').join('');const resource=f.elements.namedItem('resource');resource.closest('label').firstChild.textContent=profileFor(settings(field.value).business_kind).resource;resource.value='Principal';}
  if(field.id==='studio-day-select'&&field.value){selectedDay=field.value;viewMonth=new Date(selectedDay+'T12:00:00');renderCalendar();focusNode($('studio-day-select'));}
  if(field.id==='studio-resource-filter')renderDayAgenda();
  if(field.id==='studio-catalog-filter'){const selected=field.value;const cards=state.catalog.filter(i=>!selected||i.club_id===selected);const all=state.catalog;state={...state,catalog:cards};renderCatalog();state={...state,catalog:all};$('studio-catalog-filter').value=selected;focusNode($('studio-catalog-filter'));}
  if(field.id==='studio-import-file'){
   const fileVersion=++importVersion;$('studio-import-message').textContent='Leyendo documento…';try{const parsed=await importCatalogFile(field.files[0],profileFor(settings().business_kind).item==='servicio'?'service':'product');if(identityEpoch!==epoch||fileVersion!==importVersion||!$('studio-import-message'))return;importRows=parsed.rows;$('studio-import-message').textContent=parsed.warnings.join(' ')||'Documento listo para revisión.';renderImport();}catch(error){if(identityEpoch===epoch&&fileVersion===importVersion&&$('studio-import-message'))$('studio-import-message').textContent=error.message;}
  }
  if(field.id==='studio-logo-file'){
   try{const nextLogo=await normalizeLogo(field.files[0]);if(identityEpoch!==epoch)return;logo=nextLogo;const data=readBusiness();const saved=await save('cia_studio_save_business',{p_club:club().id,p_business:data.business,p_settings:data.settings},null,'Tu logo ya es parte de tu negocio.');if(saved){$('studio-business').dataset.club='';businessForm();focusNode($('studio-business-form').querySelector('[data-step="0"] legend'));}}catch(error){if(identityEpoch===epoch)result(error.message,'error');}
  }
 });
 document.addEventListener('click',async event=>{
  if(!event.target.closest('#studio-save-import')||!state||saving)return;
  const invalid=importRows.map(catalogRowErrors).some(errors=>errors.length);if(invalid){$('studio-import-save-error').textContent='Corrige las filas marcadas antes de guardar.';return;}
  const existing=new Set(state.catalog.map(i=>(i.title+'|'+i.category).toLocaleLowerCase('es')));
  const rows=$('studio-skip-duplicates').checked?importRows.filter(r=>!existing.has((r.title+'|'+r.category).toLocaleLowerCase('es'))):importRows;
  if(!rows.length){$('studio-import-save-error').textContent='No hay elementos nuevos para importar.';return;}
  const saved=await save('cia_studio_save_catalog',{p_club:club().id,p_items:rows,p_request:importRequest},null,'Catálogo importado y guardado.');
  if(saved){$('studio-import').textContent='';importRows=[];restoreTrigger(importReturn);}
 });
 document.addEventListener('submit',async event=>{
  const f=event.target,formId=f.getAttribute('id')||'';if(!formId.startsWith('studio-'))return;event.preventDefault();if(!context||!state)return;if(!f.reportValidity()||saving)return;
  const editorId=f.parentElement?.getAttribute?.('id'),v=name=>f.elements.namedItem(name)?.value||'',request=f.dataset.request||(f.dataset.request=crypto.randomUUID()),toISO=name=>new Date(v(name)).toISOString();let saved=false;
  if(formId==='studio-business-form'){
   const data=readBusiness();saved=await save('cia_studio_save_business',{p_club:club()?.id||null,p_business:data.business,p_settings:data.settings},f,club()?'Configuración guardada.':'Tu programa está creado. Ahora sube tu logo y prepara tu catálogo.');if(saved){$('studio-business').dataset.club='';businessForm();}
  }
  if(formId==='studio-item-form'){const row={id:v('id')||undefined,title:v('title').trim(),category:v('category').trim()||'General',description:v('description').trim(),price:Number(v('price')),currency:v('currency'),item_kind:v('item_kind'),duration_minutes:v('duration_minutes')?Number(v('duration_minutes')):null,active:v('active')==='true'};saved=await save('cia_studio_save_catalog',{p_club:club().id,p_items:[row],p_request:request},f,'Catálogo actualizado.');}
  if(formId==='studio-promotion-form')saved=await save('cia_studio_save_promotion',{p_club:club().id,p_payload:{id:v('id')||undefined,title:v('title').trim(),description:v('description').trim(),promotion_kind:v('promotion_kind'),value:Number(v('value')),active:v('active')==='true',starts_at:toISO('starts_at'),ends_at:toISO('ends_at')},p_request:request},f,'Promoción guardada.');
  if(formId==='studio-challenge-form')saved=await save('cia_studio_save_challenge',{p_club:club().id,p_payload:{title:v('title').trim(),target_visits:Number(v('target_visits')),bonus_points:Number(v('bonus_points')),starts_at:toISO('starts_at'),ends_at:toISO('ends_at')},p_request:request},f,'Reto creado. Las visitas confirmadas completarán el avance.');
  if(formId==='studio-points-form')saved=await save('cia_studio_adjust_points',{p_club:club().id,p_user:v('user_id'),p_amount:Number(v('amount')),p_reason:v('reason').trim(),p_request:request},f,'Ajuste guardado con su motivo. El cliente recibió un aviso.');
  if(formId==='studio-appointment-form')saved=await save('cia_studio_save_appointment',{p_club:v('club_id'),p_payload:{title:v('title').trim(),user_id:v('user_id')||undefined,catalog_id:v('catalog_id')||undefined,starts_at:toISO('starts_at'),ends_at:toISO('ends_at'),resource:v('resource').trim(),note:v('note').trim()},p_request:request},f,isCompany()?'Cita guardada en el calendario.':'Solicitud enviada. El negocio confirmará tu horario.');
  if(formId==='studio-reward-form')saved=await save('cia_studio_save_reward',{p_club:club().id,p_payload:{id:v('id')||undefined,title:v('title').trim(),reward_kind:v('reward_kind'),description:v('description').trim(),terms:v('terms').trim(),points_cost:Number(v('points_cost')),stock:v('stock')===''?null:Number(v('stock')),valid_until:v('valid_until')?toISO('valid_until'):null},p_request:request},f,'Recompensa guardada. Los canjes anteriores conservan el nombre y coste registrados.');
  if(saved&&formId!=='studio-business-form'){if(editorId)closeEditor(editorId);else f.parentElement?.replaceChildren();}
 });
 return {update,clear,refresh,titleFor,animateNavigation,acknowledge};
}
function download(name,content,type){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
