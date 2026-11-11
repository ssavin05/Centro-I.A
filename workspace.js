'use strict';
(()=>{
  const $=id=>document.getElementById(id);
  let csrf='';
  const showStatus=text=>{$('workspace-message').textContent=text;};
  const logout=$('logout');
  logout.disabled=true;
  async function bootstrap(){
    try{
      const response=await fetch('./api/bootstrap',{headers:{Accept:'application/json'},credentials:'same-origin',cache:'no-store'});
      if(!response.ok||!response.headers.get('content-type')?.includes('application/json'))throw new Error('El servidor de cuentas no está disponible.');
      const session=await response.json();
      if(!session.user){location.replace('auth.html?mode=login');return;}
      csrf=session.csrf;
      const business=session.user.accountType==='company';
      $('account-pill').textContent=business?'Cuenta Empresa':'Cuenta Usuario';
      $('welcome-title').textContent='Hola, '+session.user.name.split(/\s+/)[0]+'.';
      $('workspace-description').textContent=business?'Tu espacio empresarial ya está creado. Vamos a configurarlo desde una base limpia.':'Tu espacio personal ya está creado. Aquí aparecerán tus experiencias y beneficios cuando estén disponibles.';
      $('blank-description').textContent=business?'Aún no hay un negocio configurado ni estadísticas. Prepararemos las herramientas empresariales por etapas.':'Todavía no tienes puntos, movimientos ni reservas. Las funciones se incorporarán progresivamente.';
      logout.disabled=false;
    }catch{
      showStatus('Para acceder a una cuenta real es necesario abrir Centro I.A. desde su servidor seguro.');
      $('workspace-description').textContent='Esta página no admite acceso sin una sesión verificada.';
      $('workspace-blank').hidden=true;
      logout.textContent='Iniciar sesión';logout.disabled=false;
      logout.onclick=()=>location.assign('auth.html?mode=login');
    }
  }
  logout.addEventListener('click',async()=>{
    if(!csrf)return;
    logout.disabled=true;showStatus('Cerrando sesión…');
    try{
      const response=await fetch('./api/auth/logout',{method:'POST',credentials:'same-origin',headers:{'Accept':'application/json','Content-Type':'application/json','X-CSRF-Token':csrf},body:'{}'});
      if(!response.ok)throw Error('No se pudo cerrar la sesión.');
      location.replace('auth.html?mode=login');
    }catch{showStatus('No pudimos cerrar tu sesión. Revisa la conexión e inténtalo nuevamente.');logout.disabled=false;}
  });
  bootstrap();
})();