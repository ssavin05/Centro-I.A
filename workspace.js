import {supabase} from './supabase-client.js';
import {validateName, authErrorMessage} from './account-rules.js';
import {profileExport,downloadProfile} from './profile-export.js';
const $ = id => document.getElementById(id);
let currentUser, currentProfile, busy = false;
let loadVersion = 0;
const message = text => {$('workspace-message').textContent = text;};
function clearPrivateView() {
  loadVersion++;
  busy = false;
  $('profile-section').hidden = true;
  $('profile-form').setAttribute('aria-busy','false');
  $('welcome-title').textContent = 'Mi espacio';
  $('account-pill').textContent = 'Mi cuenta';
  $('profile-name').value = '';
  $('profile-email').value = '';
  $('profile-error').textContent = '';
  $('profile-error').hidden = true;
  $('profile-status').textContent = '';
  $('profile-name').disabled = false;
  $('save-profile').disabled = true;
  $('export-profile').disabled = true;
  $('save-profile').textContent = 'Guardar cambios';
  $('workspace-content').setAttribute('aria-busy','false');
  currentUser = null;currentProfile = null;
}
async function bootstrap() {
  const version = ++loadVersion;
  if (!supabase) {message('No pudimos cargar el servicio. Revisa tu conexión y recarga la página.');return;}
  $('retry-profile').hidden = true;
  $('workspace-content').setAttribute('aria-busy','true');
  try {
    const {data:{user},error} = await supabase.auth.getUser();
    if (version !== loadVersion) return;
    if (error) {
      if (![401,403].includes(error.status) && !['session_not_found','refresh_token_not_found','refresh_token_already_used','bad_jwt','user_not_found'].includes(error.code)) throw error;
      clearPrivateView();location.replace('auth.html?mode=login');return;
    }
    if (!user) {clearPrivateView();location.replace('auth.html?mode=login');return;}
    const {data:profile,error:profileError} = await supabase.from('cia_profiles')
      .select('name,account_type,created_at').eq('id',user.id).single();
    if (version !== loadVersion) return;
    if (profileError || !profile || !['user','company'].includes(profile.account_type)) {
      throw Error('PROFILE_UNAVAILABLE');
    }
    currentUser = user;currentProfile = profile;
    const isCompany = profile.account_type==='company';
    $('account-pill').textContent = isCompany ? 'Cuenta Empresa' : 'Cuenta Usuario';
    $('welcome-title').textContent = 'Hola, ' + profile.name.trim().split(/\s+/)[0] + '.';
    $('workspace-description').textContent = isCompany
      ? 'Administra tu cuenta empresarial desde aquí.' : 'Este es tu espacio personal en Centro I.A.';
    $('blank-description').textContent = isCompany
      ? 'La configuración de negocios y sus herramientas todavía está en desarrollo. Puedes mantener tus datos de cuenta al día.'
      : 'Los beneficios, puntos y reservaciones aparecerán cuando esas funciones estén disponibles.';
    $('profile-name').value = profile.name;
    $('profile-email').value = user.email || '';
    $('profile-section').hidden = false;
    $('save-profile').disabled = false;
    $('export-profile').disabled = false;
    message('');
  } catch (error) {
    if (version !== loadVersion) return;
    clearPrivateView();
    message(error.message === 'PROFILE_UNAVAILABLE'
      ? 'No pudimos recuperar tu perfil. Vuelve a intentar; si continúa, inicia sesión de nuevo.'
      : authErrorMessage(error));
    $('retry-profile').hidden = false;
  } finally {
    if (version === loadVersion) {
      $('workspace-content').setAttribute('aria-busy','false');
      $('logout').disabled = !supabase;
    }
  }
}
$('retry-profile').addEventListener('click', bootstrap);
$('export-profile').addEventListener('click',()=>{
  if (!currentUser || !currentProfile || busy) return;
  try {
    downloadProfile(profileExport(currentUser,currentProfile));
    $('profile-status').textContent='Archivo preparado con tu perfil guardado y correo. Contiene información personal; guárdalo en un lugar seguro.';
  } catch {
    $('profile-error').textContent='No pudimos preparar el archivo. Vuelve a intentar desde tu navegador.';
    $('profile-error').hidden=false;
  }
});
$('profile-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (busy || !currentUser || !currentProfile) return;
  const name = $('profile-name').value.trim(), invalid = validateName(name);
  $('profile-error').hidden = true;$('profile-status').textContent = '';
  if (invalid) {
    $('profile-error').textContent = invalid;$('profile-error').hidden = false;
    $('profile-name').setAttribute('aria-invalid','true');$('profile-name').focus();return;
  }
  busy = true;$('save-profile').disabled = true;$('save-profile').textContent = 'Guardando…';
  $('profile-form').setAttribute('aria-busy','true');
  $('profile-name').disabled = true;
  const version = loadVersion;
  try {
    // Only the name is writable. account_type and ownership never come from the form.
    const {data,error} = await supabase.from('cia_profiles').update({name})
      .eq('id',currentUser.id).select('name,account_type,created_at').single();
    if (version !== loadVersion) return;
    if (error || !data) throw error || Error('NOT_SAVED');
    currentProfile = data;$('profile-name').value = data.name;
    $('welcome-title').textContent = 'Hola, ' + data.name.trim().split(/\s+/)[0] + '.';
    $('profile-status').textContent = 'Nombre guardado.';
  } catch {
    if (version !== loadVersion) return;
    $('profile-error').textContent = 'No pudimos guardar tu nombre. Tus cambios siguen aquí; revisa la conexión y vuelve a intentar.';
    $('profile-error').hidden = false;
  } finally {
    if (version === loadVersion) {
      $('profile-form').setAttribute('aria-busy','false');
      busy=false;$('profile-name').disabled=false;$('save-profile').disabled=false;$('save-profile').textContent='Guardar cambios';
    }
  }
});
$('profile-name').addEventListener('input', () => {$('profile-name').removeAttribute('aria-invalid');$('profile-status').textContent='';});
window.addEventListener('beforeunload', event => {
  if (currentProfile && $('profile-name').value.trim() !== currentProfile.name) {event.preventDefault();event.returnValue='';}
});
$('logout').addEventListener('click', async () => {
  if (busy || !supabase) return;
  if (currentProfile && $('profile-name').value.trim() !== currentProfile.name &&
      !window.confirm('Tienes cambios sin guardar. ¿Quieres cerrar sesión y descartarlos?')) return;
  busy=true;$('logout').disabled=true;message('Cerrando sesión…');
  try {
    const {error} = await supabase.auth.signOut();
    if (error) throw error;
    clearPrivateView();location.replace('auth.html?mode=login');
  } catch {message('No se pudo cerrar la sesión. Revisa tu conexión.');}
  finally {busy=false;$('logout').disabled=false;}
});
if (supabase) supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {clearPrivateView();location.replace('auth.html?mode=login');}
  else if (event === 'SIGNED_IN' && session?.user?.id && session.user.id !== currentUser?.id) {
    clearPrivateView();
    const version = loadVersion;
    // Auth calls must run outside the synchronous SDK event callback.
    setTimeout(() => {if (version === loadVersion) bootstrap();}, 0);
  }
});
bootstrap();
