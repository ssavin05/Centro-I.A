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
