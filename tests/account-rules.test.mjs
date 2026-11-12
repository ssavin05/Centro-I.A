import test from 'node:test';
import assert from 'node:assert/strict';
import {validateName,validateEmail,validatePassword,authErrorMessage} from '../account-rules.js';

test('validación de nombre, correo y límites de contraseña', () => {
  assert.equal(validateName(' Ana '),'');
  for(const name of ['', '  ', 'x'.repeat(91)])assert.ok(validateName(name));
  assert.equal(validateEmail(' ana@example.test '),'');
  for(const email of ['ana','a@b','a b@x.test','x'.repeat(256)+'@x.test'])assert.ok(validateEmail(email));
  assert.equal(validatePassword('x'.repeat(10),'x'.repeat(10)),'');
  assert.equal(validatePassword('x'.repeat(128),'x'.repeat(128)),'');
  assert.ok(validatePassword('x'.repeat(9),'x'.repeat(9)));
  assert.ok(validatePassword('x'.repeat(129),'x'.repeat(129)));
  assert.match(validatePassword('1234567890','1234567891'),/no coinciden/);
});

test('errores del proveedor usan mensajes concretos y no revelan detalles internos', () => {
  assert.match(authErrorMessage({code:'invalid_credentials'}),/no son correctos/);
  assert.match(authErrorMessage({code:'email_not_confirmed'}),/Confirma tu correo/);
  assert.match(authErrorMessage({code:'otp_expired'}),/venció/);
  assert.doesNotMatch(authErrorMessage({message:'SELECT secret FROM private'}),/SELECT|secret|private/);
  assert.match(authErrorMessage({name:'AbortError'}),/No pudimos confirmar/);
});
