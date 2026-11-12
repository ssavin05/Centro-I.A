import test from 'node:test';
import assert from 'node:assert/strict';
import {pageHarness, settle} from './helpers/browser.mjs';

const signupValues = {name: 'Ana Rivera', email: 'ana@example.test', password: 'UnaClaveLarga123', 'password-confirm': 'UnaClaveLarga123'};

test('registro Usuario guarda la intención inicial y solicita confirmación', async () => {
  let payload;
  const page = pageHarness('auth.js', {client: {auth: {signUp: async value => {payload = value;return {data: {session: null}, error: null};}}}});
  page.set(signupValues);
  await page.submit();
  assert.equal(payload.options.data.account_type, 'user');
  assert.equal(payload.options.data.name, 'Ana Rivera');
  assert.equal(payload.options.emailRedirectTo, 'https://example.test/Centro-I.A/auth.html?mode=login');
  assert.match(page.element('availability').textContent, /confirmar tu cuenta/);
  assert.deepEqual(page.navigations, []);
});

test('registro Empresa conserva el tipo seleccionado', async () => {
  let payload;
  const page = pageHarness('auth.js', {search: '?type=company', client: {auth: {signUp: async value => {payload = value;return {data: {session: {}}, error: null};}}}});
  page.set(signupValues);
  await page.submit();
  assert.equal(payload.options.data.account_type, 'company');
  assert.deepEqual(page.navigations, ['workspace.html']);
});

test('contraseñas distintas impiden el envío y conservan los campos', async () => {
  let sent = false;
  const page = pageHarness('auth.js', {client: {auth: {signUp: async () => {sent = true;}}}});
  page.set({...signupValues, 'password-confirm': 'OtraClaveDistinta'});
  await page.submit();
  assert.equal(sent, false);
  assert.match(page.element('form-error').textContent, /no coinciden/);
  assert.equal(page.element('email').value, signupValues.email);
});

test('inicio de sesión dirige al espacio y oculta campos de registro', async () => {
  const page = pageHarness('auth.js', {search: '?mode=login', client: {auth: {signInWithPassword: async () => ({error: null})}}});
  page.set(signupValues);
  await page.submit();
  assert.equal(page.element('field-name').hidden, true);
  assert.deepEqual(page.navigations, ['workspace.html']);
});

test('fallo del proveedor no presenta éxito y permite reintentar', async () => {
  const page = pageHarness('auth.js', {client: {auth: {signUp: async () => ({error: {code: 'over_email_send_rate_limit'}})}}});
  page.set(signupValues);
  await page.submit();
  assert.match(page.element('form-error').textContent, /límite/);
  assert.equal(page.element('availability').hidden, true);
  assert.equal(page.element('submit-auth').disabled, false);
});

test('sesión persistente abre el espacio', async () => {
  const page = pageHarness('auth.js', {client: {auth: {getSession: async () => ({data: {session: {user: {id: 'a'}}}})}}});
  await settle();
  assert.deepEqual(page.navigations, ['workspace.html']);
});

test('doble envío produce una sola petición mientras está pendiente', async () => {
  let calls=0, finish;
  const page=pageHarness('auth.js',{client:{auth:{signUp:()=>{calls++;return new Promise(resolve=>{finish=resolve;});}}}});
  page.set(signupValues);
  const first=page.submit();await settle();
  await page.submit();
  assert.equal(calls,1);assert.equal(page.element('submit-auth').disabled,true);
  finish({data:{session:null},error:null});await first;
  assert.equal(page.element('submit-auth').disabled,false);
});

test('credenciales incorrectas no navegan y muestran recuperación', async () => {
  const page=pageHarness('auth.js',{search:'?mode=login',client:{auth:{signInWithPassword:async()=>({error:{code:'invalid_credentials'}})}}});
  page.set(signupValues);await page.submit();
  assert.match(page.element('form-error').textContent,/no son correctos/);
  assert.equal(page.element('recover-link').hidden,false);
  assert.deepEqual(page.navigations,[]);
});

test('recuperación conserva el subdirectorio de GitHub Pages sin afirmar entrega', async () => {
  let redirect;
  const page=pageHarness('auth.js',{search:'?mode=recover',client:{auth:{resetPasswordForEmail:async(email,options)=>{redirect=options.redirectTo;return {error:null};}}}});
  page.set({email:signupValues.email});await page.submit();
  assert.equal(redirect,'https://example.test/Centro-I.A/auth.html?mode=reset');
  assert.equal(page.element('field-password').hidden,true);
  assert.match(page.element('availability').textContent,/Solicitud aceptada/);
  assert.doesNotMatch(page.element('availability').textContent,/entregado|enviado con éxito/);
});

test('fallo de correo no se convierte en una confirmación', async () => {
  const page=pageHarness('auth.js',{search:'?mode=recover',client:{auth:{resetPasswordForEmail:async()=>({error:{code:'email_address_not_authorized'}})}}});
  page.set({email:signupValues.email});await page.submit();
  assert.match(page.element('form-error').textContent,/todavía no permite/);
  assert.equal(page.element('availability').hidden,true);
});

test('una URL reset sin sesión de recuperación no permite cambiar contraseña', async () => {
  let calls=0;
  const page=pageHarness('auth.js',{search:'?mode=reset',client:{auth:{updateUser:async()=>{calls++;}}}});
  page.set(signupValues);await page.submit();
  assert.equal(calls,0);assert.equal(page.element('submit-auth').disabled,true);
  assert.match(page.element('form-error').textContent,/enlace de recuperación/);
});

test('sesión válida de recuperación verifica identidad y guarda una vez', async () => {
  let changed,scope;
  const page=pageHarness('auth.js',{search:'?mode=login',hash:'#type=recovery',client:{auth:{
    getSession:async()=>({data:{session:{user:{id:'a'}}},error:null}),
    getUser:async()=>({data:{user:{id:'a'}},error:null}),
    updateUser:async value=>{changed=value;return {error:null};},
    signOut:async value=>{scope=value.scope;return {error:null};},
  }}});
  await settle();assert.deepEqual(page.navigations,[]);
  page.set(signupValues);await page.submit();
  assert.equal(changed.password,signupValues.password);assert.equal(scope,'global');
  assert.equal(page.element('password').value,'');
  assert.deepEqual(page.navigations,['auth.html?mode=login&notice=password-updated']);
});

test('enlace vencido se explica y abre una nueva solicitud', async () => {
  const page=pageHarness('auth.js',{search:'?mode=reset',hash:'#error=access_denied&error_code=otp_expired'});
  await settle();
  assert.match(page.element('form-error').textContent,/venció/);
  assert.equal(page.element('field-email').hidden,false);
  assert.equal(page.element('field-password').hidden,true);
});

test('una sesión normal no se acepta como recuperación por cambiar la query', async () => {
  const page=pageHarness('auth.js',{search:'?mode=reset',client:{auth:{getSession:async()=>({data:{session:{user:{id:'a'}}},error:null})}}});
  await settle();assert.equal(page.element('submit-auth').disabled,true);
});
