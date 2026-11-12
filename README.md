# Centro I.A. — Un motivo para volver

Centro I.A. comienza con una página pública, registro de cuentas **Usuario / Empresa**, inicio de sesión y paneles vacíos. Se conservó el producto anterior en la rama `archivo/version-fidelidad-2026-11-11`.

## Autenticación gratuita (Supabase)

- **Frontend:** GitHub Pages, `index.html`, `auth.html` y `workspace.html`.
- **Cuentas:** Supabase Auth con correo y contraseña.
- **Perfiles:** tabla `public.cia_profiles` con RLS; cada persona consulta únicamente su perfil.
- **Tipo de cuenta:** `user` o `company`, fijado al crear la cuenta y no editable desde el navegador.
- **Implementación:** `supabase-client.js` (clave publishable pública), `auth.js` y `workspace.js`.
- **Esquema:** `supabase/migrations/20261112_cia_profiles.sql` aplicado al proyecto Supabase.
- **Confirmación:** el registro puede pedir verificar el correo antes de permitir iniciar sesión.

## Ajuste necesario en Supabase

En [Authentication → URL Configuration](https://supabase.com/dashboard/project/huqspupbhhqilxeizklr/auth/url-configuration), establece:

- **Site URL:** `https://ssavin05.github.io/Centro-I.A/`
- **Redirect URL adicional:** `https://ssavin05.github.io/Centro-I.A/**`

Sin estas direcciones permitidas, el enlace de confirmación del correo podría llevar al destino incorrecto.

**Limitación del correo gratis:** el SMTP predeterminado de Supabase solo envía a correos de miembros del equipo y tiene límites muy reducidos. Para registrar a cualquier persona es necesario configurar un proveedor SMTP o un Email Hook. No desactives la confirmación de correo para ocultar esta limitación.\n\nEl proyecto está en plan Free; respeta sus límites y ten presente que puede pausarse después de un período de inactividad. La confirmación de correo y entrega de mensajes dependen de la configuración y límites de Supabase Auth.

## Desarrollo

```sh
npm run verify
npm run build:pages
```

GitHub Pages publica solamente la web oficial. El backend histórico Node/SQLite todavía existe para preservar la funcionalidad anterior, pero **no autentica el nuevo panel público**. Sus tablas y sesiones no se migran automáticamente a Supabase.

No insertes claves secretas de servicio en código cliente ni cometas archivos `.env` con credenciales.
