# Centro I.A. — Un motivo para volver

Este repositorio permite desarrollar la aplicación oficial que conecta personas y negocios. La etapa implementada incluye una portada, bienvenida móvil/tablet, cuentas Usuario/Empresa, acceso con Supabase y edición del nombre. Los módulos de negocios, puntos, recompensas y reservaciones siguen pendientes en Supabase; el código histórico no constituye su implementación actual.

## Inicia el desarrollo

Necesitas Node.js 22.13 o posterior. No se requieren dependencias npm adicionales.

1. Ejecuta las comprobaciones:

   ```sh
   npm run verify
   ```

2. Abre la vista previa estática:

   ```sh
   npm start
   ```

3. Visita `http://127.0.0.1:4173/` y comprueba la bienvenida móvil o la portada de escritorio según el tamaño de pantalla.

También puedes ejecutar `node scripts/verify.mjs` y `node scripts/preview.mjs` directamente. En Windows, `INICIAR-CENTRO-IA.bat` abre esta misma vista previa. Para construir el paquete de GitHub Pages, ejecuta `npm run build:pages`.

## Arquitectura y datos

GitHub Pages sirve HTML/CSS/JavaScript. Supabase Auth mantiene las cuentas; `public.cia_profiles` guarda nombre y tipo inicial. RLS limita cada perfil a su titular y los grants permiten actualizar únicamente el nombre. El tipo de cuenta se fija al registrarse y no se autoriza mediante `user_metadata`.

`supabase-client.js` contiene una clave **publishable** pública, no una clave secreta. No agregues `service_role` ni credenciales al frontend.

La bienvenida de teléfonos/tablets tiene enlaces reales a registro/login y no introduce una espera. La portada de escritorio se conserva. El SDK y las peticiones tienen límites de espera y muestran un error si el servicio no está disponible.

## Configura y valida el correo

Antes de ofrecer registro/recuperación a usuarios reales, verifica en [Supabase URL Configuration](https://supabase.com/dashboard/project/huqspupbhhqilxeizklr/auth/url-configuration):

- Site URL: `https://ssavin05.github.io/Centro-I.A/`.
- Redirección de confirmación: `https://ssavin05.github.io/Centro-I.A/auth.html?mode=login`.
- Redirección de recuperación: `https://ssavin05.github.io/Centro-I.A/auth.html?mode=reset`.

Autoriza por separado las URLs locales o de prueba que vayas a usar. Revisa las plantillas si personalizaste sus destinos. El SMTP predeterminado de Supabase tiene restricciones y no garantiza correo para cualquier destinatario; consulta la [configuración SMTP oficial](https://supabase.com/docs/guides/auth/auth-smtp). No se configuró un proveedor en esta etapa ni se desactivó la confirmación de correo.

Las pruebas automatizadas ejecutan controladores con dobles de Supabase. El registro, entrega de correo y restablecimiento completos necesitan verificación adicional en un entorno aislado.

## Continúa el proyecto

- [Estado y siguiente tarea](docs/ESTADO-DESARROLLO.md).
- [Auditoría priorizada](docs/AUDITORIA-2026-11-12.md).
- [Arquitectura oficial](docs/ARCHITECTURE.md).
- [Pruebas y brechas](docs/TESTING.md).
- [Reglas permanentes](AGENTS.md).

El respaldo `archivo/version-fidelidad-2026-11-11` se conserva intacto. `server/`, `sql/`, `app/` y `demo/` son históricos. Si necesitas revisar Node/SQLite, usa `npm run start:legacy`; no es el backend del panel oficial. La configuración histórica de Render requiere recursos de pago y no debe activarse con el presupuesto de $0 MXN.

Un PR no equivale a una publicación. El workflow de Pages despliega main después de las verificaciones; esta etapa se entrega en una rama para revisión.
