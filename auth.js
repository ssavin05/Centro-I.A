'use strict';
(()=>{
  const $=id=>document.getElementById(id);
  const query=new URLSearchParams(location.search);
  let mode=query.get('mode')==='login'?'login':'register';
  const form=$('auth-form'),submit=$('submit-auth'),error=$('form-error'),availability=$('availability');
  const pagesHosted=/\.github\.io$/i.test(location.hostname);
  let backendAvailable=false;
  const setError=message=>{error.textContent=message;error.hidden=!message;};
  const setAvailability=message=>{availability.textContent=message;availability.hidden=!message;};
  function renderMode(){
    const login=mode==='login';
    $('tab-login').classList.toggle('active',login);
    $('tab-register').classList.toggle('active',!login);
    $('tab-login').setAttribute('aria-current',login?'page':'false');
    $('tab-register').setAttribute('aria-current',login?'false':'page');
    $('auth-title').textContent=login?'Qué gusto verte de nuevo.':'Crea tu cuenta';
    $('auth-description').textContent=login?'Entra a tu espacio de Centro I.A.':'Un paso más cerca de formar parte de Centro I.A.';
    $('field-name').hidden=login;$('field-confirm').hidden=login;$('account-type').hidden=login;
    $('name').required=!login;$('password-confirm').required=!login;
    $('password').autocomplete=login?'current-password':'new-password';
    $('password-guidance').textContent=login?'':'Mínimo 10 caracteres';
    submit.innerHTML=login?'Iniciar sesión <span aria-hidden="true">↗</span>':'Crear mi cuenta <span aria-hidden="true">↗</span>';
    $('auth-alternate').innerHTML=login?'¿Todavía no tienes cuenta? <a href="auth.html?mode=register">Crear cuenta</a>':'¿Ya tienes una cuenta? <a href="auth.html?mode=login">Inicia sesión</a>';
    setError('');
  }
  renderMode();
  const preselect=query.get('type');
  if(preselect==='user'||preselect==='company'){
    const target=form.querySelector('input[name="accountType"][value="'+preselect+'"]'); if(target)target.checked=true;
  }
  for(const control of document.querySelectorAll('[data-reveal]')){
    control.addEventListener('click',()=>{const input=$(control.dataset.reveal);const show=input.type==='password';input.type=show?'text':'password';control.textContent=show?'Ocultar':'Mostrar';control.setAttribute('aria-pressed',String(show));});
  }
  async function checkBackend(){
    try{const response=await fetch('./api/bootstrap',{headers:{Accept:'application/json'},credentials:'same-origin',cache:'no-store'});if(!response.ok||!response.headers.get('content-type')?.includes('application/json'))throw Error('API unavailable');const data=await response.json();backendAvailable=true;if(data.user){location.replace('workspace.html');return;}setAvailability('');submit.disabled=false;}
    catch{backendAvailable=false;submit.disabled=true;setAvailability(pagesHosted?'Las cuentas se habilitarán al conectar el servidor seguro de Centro I.A.':'El servidor de cuentas no está disponible. Abre Centro I.A. desde el servidor de la aplicación para registrarte o iniciar sesión.');}
  }
  submit.disabled=true;checkBackend();
  form.addEventListener('submit',async event=>{
    event.preventDefault();setError('');if(!backendAvailable)return;
    const email=$('email').value.trim(),password=$('password').value;
    if(!/^\S+@\S+\.\S+$/.test(email)){setError('Escribe un correo electrónico válido.');$('email').focus();return;}
    const payload={email,password};
    if(mode==='register'){
      payload.name=$('name').value.trim();payload.accountType=form.elements.accountType.value;
      if(!payload.name){setError('Escribe tu nombre completo.');$('name').focus();return;}
      if(password.length<10||password.length>128){setError('La contraseña debe tener de 10 a 128 caracteres.');$('password').focus();return;}
      if($('password-confirm').value!==password){setError('Las contraseñas no coinciden.');$('password-confirm').focus();return;}
      if(!['user','company'].includes(payload.accountType)){setError('Selecciona Usuario o Empresa.');return;}
    }
    const endpoint=mode==='login'?'login':'register';
    submit.disabled=true;submit.textContent=mode==='login'?'Entrando…':'Creando cuenta…';
    try{const response=await fetch('./api/auth/'+endpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},credentials:'same-origin',body:JSON.stringify(payload)});
      const result=await response.json();if(!response.ok)throw Error(result.error||'No se pudo completar la operación.');
      location.assign('workspace.html');
    }catch(e){submit.disabled=false;renderMode();setError(e.message||'No se pudo establecer conexión con el servidor.');}
  });
})();