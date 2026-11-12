import {supabase} from './supabase-client.js';
import {validateName, validateEmail, validatePassword, authErrorMessage} from './account-rules.js';

const $ = id => document.getElementById(id);
const form = $('auth-form'), submit = $('submit-auth');
const query = new URLSearchParams(location.search);
const fragment = new URLSearchParams(location.hash.slice(1));
const recoveryIntent = query.get('mode') === 'reset' || fragment.get('type') === 'recovery';
let mode = recoveryIntent ? 'reset' : ['login', 'recover'].includes(query.get('mode')) ? query.get('mode') : 'register';
let busy = false, ready = false, recoverySession = false;
const modes = {
  register: ['Crea tu cuenta', 'Elige cómo quieres comenzar en Centro I.A.', 'Crear mi cuenta'],
  login: ['Qué gusto verte de nuevo.', 'Entra a tu espacio de Centro I.A.', 'Iniciar sesión'],
  recover: ['Recupera tu acceso', 'Escribe el correo de tu cuenta para solicitar un enlace seguro.', 'Enviar enlace'],
  reset: ['Elige una nueva contraseña', 'Guárdala en un lugar seguro y úsala para tu próximo acceso.', 'Guardar contraseña'],
};

function setError(message, field) {
  $('form-error').textContent = message;
  $('form-error').hidden = !message;
  if (field) {$(field).setAttribute('aria-invalid', 'true');$(field).focus();}
}
function setNotice(message) {
  $('availability').textContent = message;
  $('availability').hidden = !message;
}
function renderMode() {
  const [title, description, action] = modes[mode];
  $('auth-title').textContent = title;
  $('auth-description').textContent = description;
  document.title = title + ' · Centro I.A.';
  document.body.dataset.authMode = mode;
  for (const [id, visible] of [
    ['field-name', mode === 'register'], ['account-type', mode === 'register'],
    ['field-email', mode !== 'reset'], ['field-password', mode !== 'recover'],
    ['field-confirm', mode === 'register' || mode === 'reset'], ['recover-link', mode === 'login'],
  ]) $(id).hidden = !visible;
  for (const id of ['name', 'email', 'password', 'password-confirm']) {
    const visible = id === 'name' ? mode === 'register' : id === 'email' ? mode !== 'reset'
      : id === 'password' ? mode !== 'recover' : mode === 'register' || mode === 'reset';
    $(id).required = visible;
    $(id).disabled = !visible || busy;
  }
  $('password').autocomplete = mode === 'login' ? 'current-password' : 'new-password';
  $('password-guidance').textContent = mode === 'login' ? '' : 'De 10 a 128 caracteres';
  submit.textContent = busy ? 'Procesando…' : action;
  submit.disabled = busy || !ready || (mode === 'reset' && !recoverySession);
  form.setAttribute('aria-busy', String(busy));
  for (const tab of ['login', 'register']) {
    $('tab-' + tab).classList.toggle('active', mode === tab);
    if (mode === tab) $('tab-' + tab).setAttribute('aria-current', 'page');
    else $('tab-' + tab).removeAttribute('aria-current');
  }
  $('auth-alternate').innerHTML = mode === 'register'
    ? '¿Ya tienes una cuenta? <a href="auth.html?mode=login">Inicia sesión</a>'
    : '¿Necesitas una cuenta? <a href="auth.html?mode=register">Crear cuenta</a>';
}
for (const button of document.querySelectorAll('[data-reveal]')) {
  button.addEventListener('click', () => {
    const input = $(button.dataset.reveal), show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    button.textContent = show ? 'Ocultar' : 'Mostrar';
    button.setAttribute('aria-label', (show ? 'Ocultar' : 'Mostrar') + ' ' + (input.id === 'password-confirm' ? 'confirmación de contraseña' : 'contraseña'));
    button.setAttribute('aria-pressed', String(show));
  });
}
for (const id of ['name', 'email', 'password', 'password-confirm']) {
  $(id).addEventListener('input', () => $(id).removeAttribute('aria-invalid'));
}
if (query.get('type') === 'company') form.querySelector('input[name="accountType"][value="company"]').checked = true;
renderMode();
if (!supabase) {
  setError('No pudimos cargar el servicio de acceso. Revisa tu conexión y recarga la página.');
} else {
  // Keep synchronous: awaiting Auth in this callback can lock the SDK.
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY' && session) {
      mode = 'reset';recoverySession = true;setError('');renderMode();
    } else if (event === 'SIGNED_OUT' && mode === 'reset') {
      recoverySession = false;renderMode();
    }
  });
  initialize();
}
async function initialize() {
  try {
    const {data, error} = await supabase.auth.getSession();
    if (error) throw error;
    if (fragment.has('error') || fragment.has('error_code')) {
      setError(authErrorMessage({code: fragment.get('error_code') || fragment.get('error')}));
      history.replaceState(null, '', 'auth.html?mode=recover');
      mode = 'recover';
    } else if (mode === 'reset') {
      if (data.session && (recoverySession || fragment.get('type') === 'recovery')) {
        const {data: verified, error: verifyError} = await supabase.auth.getUser();
        if (verifyError || !verified.user) throw verifyError || {code: 'session_not_found'};
        recoverySession = true;
      } else setError('Abre el enlace de recuperación de tu correo. Si venció, solicita uno nuevo.');
    } else if (data.session && mode !== 'recover') location.replace('workspace.html');
    if (query.get('notice') === 'password-updated') setNotice('Contraseña actualizada. Inicia sesión con tu nueva contraseña.');
    ready = true;
  } catch (error) {
    setError(authErrorMessage(error));
    ready = mode !== 'reset';
  }
  renderMode();
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (busy || !ready || !supabase || (mode === 'reset' && !recoverySession)) return;
  setError('');setNotice('');
  for (const id of ['name', 'email', 'password', 'password-confirm']) $(id).removeAttribute('aria-invalid');
  const email = $('email').value.trim(), password = $('password').value;
  const name = $('name').value.trim(), accountType = form.elements.accountType.value;
  if (mode !== 'reset' && validateEmail(email)) return setError(validateEmail(email), 'email');
  if (mode === 'register' && validateName(name)) return setError(validateName(name), 'name');
  if (mode === 'register' && !['user', 'company'].includes(accountType)) return setError('Selecciona Usuario o Empresa.');
  if (mode === 'register' || mode === 'reset') {
    const invalid = validatePassword(password, $('password-confirm').value);
    if (invalid) return setError(invalid, 'password-confirm');
  } else if (mode === 'login' && !password) return setError('Escribe tu contraseña.', 'password');
  busy = true;renderMode();
  try {
    if (mode === 'register') {
      const {data, error} = await supabase.auth.signUp({email, password, options: {
        data: {name, account_type:accountType},
        emailRedirectTo: new URL('auth.html?mode=login', location.href).href,
      }});
      if (error) throw error;
      if (data.session) {location.assign('workspace.html');return;}
      $('password').value = '';$('password-confirm').value = '';
      setNotice('Revisa tu correo para confirmar tu cuenta si el registro fue aceptado. Si ya tienes una cuenta, inicia sesión o recupera el acceso.');
    } else if (mode === 'login') {
      const {error} = await supabase.auth.signInWithPassword({email, password});
      if (error) throw error;
      location.assign('workspace.html');
    } else if (mode === 'recover') {
      const {error} = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: new URL('auth.html?mode=reset', location.href).href,
      });
      if (error) throw error;
      setNotice('Solicitud aceptada. Si existe una cuenta con este correo, podrás recibir un enlace de recuperación. Revisa también spam.');
    } else {
      const {data, error: verifyError} = await supabase.auth.getUser();
      if (verifyError || !data.user) throw verifyError || {code: 'session_not_found'};
      const {error} = await supabase.auth.updateUser({password});
      if (error) throw error;
      recoverySession = false;$('password').value = '';$('password-confirm').value = '';
      const {error: signOutError} = await supabase.auth.signOut({scope: 'global'});
      if (signOutError) setNotice('Contraseña actualizada. No se pudo cerrar la sesión; entra a tu espacio para volver a comprobar el acceso.');
      else location.replace('auth.html?mode=login&notice=password-updated');
    }
  } catch (error) {setError(authErrorMessage(error));}
  finally {busy = false;renderMode();}
});
