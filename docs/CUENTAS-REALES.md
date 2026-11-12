# Registro y sesión oficiales — preparación de despliegue

## Estado
- Frontend oficial: `index.html`, `auth.html`, `workspace.html`, `auth.js`.
- Backend real existente: `server/index.mjs`, endpoints `/api/auth/register`, `/api/auth/login`, `/api/auth/logout` y `/api/bootstrap`.
- Persistencia existente: SQLite y migraciones `sql/`.
- Publicación estática GitHub Pages: **sin backend**. No permite registrar ni iniciar sesión por sí sola.
- Render: configuración lista en `render.yaml`, pero requiere crear/conectar el servicio en Render y aceptar la facturación de un disco persistente. No afirmar que está desplegado sin comprobarlo.

## Requisitos de producción
- Node.js 22.13+ (se fija una versión 22 en el blueprint).
- `NODE_ENV=production`, `DB_PATH=/var/data/centro-ia.sqlite` sobre disco persistente.
- `RENDER_EXTERNAL_URL` (Render) o `PUBLIC_ORIGIN` con HTTPS. Almacenar frontend, API y cookies en el mismo dominio evita bloqueos de cookies de terceros.
- `HOST=0.0.0.0` para escuchar tráfico del proveedor.
- Configurar copias externas de la base SQLite. Un volumen persistente no reemplaza un backup.
- Antes de permitir uso público amplio: recuperación de acceso, verificación de correo, políticas y controles operativos.

## Cómo comprobarlo
1. Abrir `https://DOMINIO-DEL-SERVICIO/api/health` y verificar `ok:true`.
2. Acceder a `/auth.html?mode=register`.
3. Crear una cuenta Usuario y otra Empresa con correos distintos.
4. Verificar que ambas llegan a `/workspace.html` y conservan sesión al refrescar.
5. Cerrar sesión y confirmar que el espacio exige iniciar sesión de nuevo.
6. Reiniciar el servicio y verificar persistencia de ambas cuentas (el disco debe estar montado).

## No usar producción sin persistencia
Render free tiene almacenamiento efímero; los datos de cuentas pueden perderse al reiniciar o desplegar de nuevo. El blueprint elige un servicio de pago con disco de datos. No activar sin aprobación del propietario.
