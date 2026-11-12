import {supabase} from './supabase-client.js';
const $=id=>document.getElementById(id),form=$('auth-form'),submit=$('submit-auth'),error=$('form-error'),notice=$('availability');
const query=new URLSearchParams(location.search),mode=query.get('mode')==='login'?'login':'register';
const setError=s=>{error.textContent=s;error.hidden=!s};
const setNotice=s=>{notice.textContent=s;notice.hidden=!s};
function renderMode(){
 const login=mode==='login';
 for(const [id,on] of [['tab-login',login],['tab-register',!login]]){
  $(id).classList.toggle('active',on);$(id).setAttribute('aria-current',on?'page':'false');
 }
 $('auth-title').textContent=login?'Qué gusto verte de nuevo.':'Crea tu cuenta';
 $('auth-description').textContent=login?'Entra a tu espacio de Centro I.A.':'Elige cómo quieres comenzar en Centro I.A.';
 for(const id of ['field-name','field-confirm','account-type'])$(id).hidden=login;
 $('name').required=!login;$('password-confirm').required=!login;
 $('password').autocomplete=login?'current-password':'new-password';
 $('password-guidance').textContent=login?'':'Mínimo 10 caracteres';
 submit.innerHTML=login?'Iniciar sesión <span aria-hidden="true">↗</span>':'Crear mi cuenta <span aria-hidden="true">↗</span>';
 $('auth-alternate').innerHTML=login?'¿Todavía no tienes cuenta? <a href="auth.html?mode=register">Crear cuenta</a>':'¿Ya tienes una cuenta? <a href="auth.html?mode=login">Inicia sesión</a>';
}
renderMode();
const type=query.get('type');
if(['user','company'].includes(type)){const el=form.querySelector('input[name="accountType"][value="'+type+'"]');if(el)el.checked=true}
for(const button of document.querySelectorAll('[data-reveal]')){
 button.addEventListener('click',()=>{
  const input=$(button.dataset.reveal),show=input.type==='password';
  input.type=show?'text':'password';button.textContent=show?'Ocultar':'Mostrar';
  button.setAttribute('aria-pressed',String(show));
 });
}
supabase.auth.getSession().then(({data})=>{if(data.session)location.replace('workspace.html')}).catch(()=>{});
form.addEventListener('submit',async event=>{
 event.preventDefault();setError('');setNotice('');
 const email=$('email').value.trim(),password=$('password').value;
 if(!/^\S+@\S+\.\S+$/.test(email)){setError('Escribe un correo válido.');return}
 const isSignup=mode==='register';
 let name='',accountType='';
 if(isSignup){
  name=$('name').value.trim();accountType=form.elements.accountType.value;
  if(!name){setError('Escribe tu nombre.');return}
  if(!['user','company'].includes(accountType)){setError('Selecciona Usuario o Empresa.');return}
  if(password.length<10||password.length>128){setError('La contraseña debe tener de 10 a 128 caracteres.');return}
  if($('password-confirm').value!==password){setError('Las contraseñas no coinciden.');return}
 }
 submit.disabled=true;submit.textContent=isSignup?'Creando cuenta…':'Iniciando sesión…';
 try{
  if(isSignup){
   const {data,error}=await supabase.auth.signUp({
    email,password,options:{data:{name,account_type:accountType},emailRedirectTo:new URL('auth.html?mode=login',location.href).href}
   });
   if(error)throw error;
   if(data.session){location.assign('workspace.html');return}
   setNotice('Revisa tu correo para confirmar tu cuenta y luego inicia sesión. Si no aparece, revisa Spam.');
  }else{
   const {error}=await supabase.auth.signInWithPassword({email,password});
   if(error)throw error;
   location.assign('workspace.html');return;
  }
 }catch(e){
  const code=e.code||'';
  const description=code==='email_address_not_authorized'?'Supabase aún no puede enviar correos a esa dirección. Para registrarse con cualquier correo hay que configurar un proveedor SMTP.':code==='over_email_send_rate_limit'?'Se alcanzó el límite temporal de correos. Inténtalo más tarde.':e.message==='Email not confirmed'?'Debes confirmar tu correo para entrar.':e.message||'No se pudo completar la operación.';
  setError(description);
 }finally{submit.disabled=false;renderMode()}
});
