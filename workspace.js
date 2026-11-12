import {supabase} from './supabase-client.js';
const $=id=>document.getElementById(id),logout=$('logout');
const message=text=>{$('workspace-message').textContent=text};
logout.disabled=true;
async function bootstrap(){
 try{
  const {data:{user},error}=await supabase.auth.getUser();
  if(error||!user){location.replace('auth.html?mode=login');return}
  const {data:profile,error:profileError}=await supabase.from('cia_profiles')
    .select('name,account_type').eq('id',user.id).single();
  if(profileError||!profile)throw Error('No se pudo recuperar tu perfil. Intenta iniciar sesión de nuevo.');
  const isCompany=profile.account_type==='company';
  $('account-pill').textContent=isCompany?'Cuenta Empresa':'Cuenta Usuario';
  $('welcome-title').textContent='Hola, '+String(profile.name||'').trim().split(/\s+/)[0]+'.';
  $('workspace-description').textContent=isCompany?'Tu espacio empresarial está listo para configurarlo.':'Tu espacio personal está listo. Aquí aparecerán tus beneficios y experiencias.';
  $('blank-description').textContent=isCompany?'Aún no hay negocio ni estadísticas configurados.':'Todavía no tienes puntos, reservas ni movimientos.';
  logout.disabled=false;
 }catch(e){message(e.message||'No pudimos cargar tu perfil.');logout.disabled=false}
}
logout.addEventListener('click',async()=>{
 logout.disabled=true;message('Cerrando sesión…');
 try{const {error}=await supabase.auth.signOut();if(error)throw error;location.replace('auth.html?mode=login')}
 catch{message('No se pudo cerrar la sesión. Revisa tu conexión.');logout.disabled=false}
});
bootstrap();
