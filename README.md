# Centro I.A. — Un motivo para volver

Sitio oficial, registro de cuentas **Usuario / Empresa** y espacio inicial vacío. Los módulos anteriores siguen respaldados en la rama `archivo/version-fidelidad-2026-11-11`.

## Registro y acceso reales

La pantalla de `auth.html` envía datos a `/api/auth/register` y `/api/auth/login`, provistos por el servidor Node.js de este repositorio. Ese servidor guarda los usuarios en SQLite y administra las sesiones con cookies HttpOnly. Los paneles sólo se abren después de verificar la sesión.

**GitHub Pages no ejecuta Node.js.** En `https://ssavin05.github.io/Centro-I.A/` podrás ver la portada y formularios, pero **no se crean cuentas allí**. Para aceptar cuentas reales es necesario desplegar la aplicación completa y usar su URL HTTPS oficial.

### Publicar la aplicación completa en Render

Incluimos `render.yaml` para desplegar el frontend, la API y una base SQLite **persistente** juntos, evitando cookies de terceros.

1. Abre [Render Blueprints](https://dashboard.render.com/select-repo?type=blueprint) y conecta tu cuenta y el repositorio `ssavin05/Centro-I.A`.
2. Elige el archivo `render.yaml` del repositorio.
3. Revisa y aprueba el servicio **de pago** y su disco persistente. No despliegues cuentas reales en una instancia con disco efímero.
4. Cuando termine la publicación, abre la URL HTTPS de ese **servicio**, no la de GitHub Pages.
5. Comprueba `/api/health`, registra un Usuario y una Empresa e inicia sesión en ambos.

Render proporciona `RENDER_EXTERNAL_URL` automáticamente. Si asignas un dominio propio, configura `PUBLIC_ORIGIN=https://tu-dominio` en las variables del servicio.

No pegues claves ni contraseñas en GitHub. Una vez en producción, configura una política de privacidad, verificación de correo, recuperación de contraseña, monitoreo y copias de seguridad.

### Uso local

```bash
npm start
```

Visita `http://127.0.0.1:3000/`, entra a **Crear cuenta** y selecciona Usuario o Empresa. Los datos se almacenan en `./data/centro-ia.sqlite`.

Pruebas: `npm run verify`. Sitio estático de presentación: `npm run build:pages`.

Consulta `docs/CUENTAS-REALES.md` para detalles de despliegue, seguridad y limitaciones.
