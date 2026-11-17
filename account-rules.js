// Domain validation; authorization belongs to PostgreSQL, never to these rules.
export function validateName(value) {
  const name = String(value ?? '').trim();
  return name.length >= 1 && name.length <= 90 ? '' : 'Escribe un nombre de 1 a 90 caracteres.';
}
export function validateEmail(value) {
  const email = String(value ?? '').trim();
  return email.length <= 255 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Escribe un correo electrónico válido.';
}
export function validatePassword(password, confirmation) {
  if (password.length < 10 || password.length > 128) return 'La contraseña debe tener de 10 a 128 caracteres.';
  return password === confirmation ? '' : 'Las contraseñas no coinciden.';
}
export function authErrorMessage(error) {
  const messages = {
    invalid_credentials: 'El correo o la contraseña no son correctos. Revisa tus datos o recupera el acceso.',
    email_not_confirmed: 'Confirma tu correo antes de iniciar sesión. Revisa también spam.',
    email_address_not_authorized: 'El servicio de correo todavía no permite enviar a esta dirección. Inténtalo cuando esté habilitado.',
    over_email_send_rate_limit: 'Se alcanzó el límite temporal de correos. Inténtalo más tarde.',
    over_request_rate_limit: 'Hay demasiados intentos. Espera unos minutos y vuelve a intentar.',
    weak_password: 'Elige una contraseña más segura, de 10 a 128 caracteres.',
    same_password: 'Usa una contraseña diferente a la anterior.',
    otp_expired: 'El enlace venció o ya fue utilizado. Solicita uno nuevo.',
    access_denied: 'El enlace no es válido. Solicita uno nuevo para recuperar el acceso.',
    user_already_exists: 'Ese correo ya tiene una cuenta. Inicia sesión o recupera el acceso.',
    session_not_found: 'Tu sesión venció. Inicia sesión de nuevo.',
    reauthentication_needed: 'Vuelve a iniciar sesión antes de cambiar tu contraseña.',
  };
  if (messages[error?.code]) return messages[error.code];
  if (error?.message === 'Email not confirmed') return messages.email_not_confirmed;
  if (error?.message === 'Invalid login credentials') return messages.invalid_credentials;
  if (['AbortError','AuthRetryableFetchError','TypeError'].includes(error?.name)) return 'No pudimos confirmar la operación. Revisa tu conexión y el estado de tu cuenta antes de volver a intentar.';
  return 'No se pudo completar la operación. Vuelve a intentarlo; si continúa, inténtalo más tarde.';
}
