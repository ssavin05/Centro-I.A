# Arquitectura de la aplicación oficial

Esta referencia permite a quien mantiene Centro I.A. localizar el código ejecutado y distinguirlo de las implementaciones históricas.

## System Context

GitHub Pages sirve una lista explícita de archivos estáticos. El navegador usa Supabase Auth y la Data API con clave publishable. PostgreSQL controla las filas y columnas accesibles. No hay servidor Node en el despliegue de Pages.

## Layer Map & Dependency Rule

| Capa | Archivos | Responsabilidad |
|---|---|---|
| Reglas puras | `account-rules.js` | Validación y mensajes; sin DOM, red ni framework. |
| Controladores de interfaz | `auth.js`, `workspace.js`, `start.js` | Estado, eventos, navegación y presentación. |
| Adaptador de infraestructura | `supabase-client.js` | SDK fijado, sesión persistente y transporte con timeout. |
| Autorización y persistencia | `cia_profiles`, RLS y permisos de columnas | Propiedad de perfil y tipo de cuenta protegido. |
| Publicación | `scripts/pages-files.mjs`, builder y workflows | Artefacto público acotado y comprobable. |

Los controladores todavía conocen la API de Supabase. Esta frontera parcial es deliberada para un producto pequeño; no se afirma independencia total del proveedor. Extraer casos de uso y gateways cuando crezcan las operaciones de negocio. Las futuras transacciones críticas se ejecutan en PostgreSQL, no como read-modify-write del navegador.

## Data & Storage Decisions

`cia_profiles.id` referencia `auth.users.id`. RLS permite leer/actualizar solo la fila propia; los permisos de columna limitan UPDATE a `name`. El trigger privado crea el perfil en el registro y fija el tipo inicial. Cambiar `user_metadata` después no cambia esa fila.

No se añadieron tablas, buckets ni funciones públicas. No se cachean datos privados mediante service worker.

## Decision Log

| Decisión | Razón |
|---|---|
| Conservar arquitectura estática y proveedor existentes | Compatibilidad con Pages y presupuesto cero. |
| Bienvenida móvil mediante CSS | Los enlaces funcionan sin JS; no hay detección frágil por user-agent. |
| `max-width:1024px`, y hasta 1366px con puntero táctil sin hover | Teléfonos/tablets conservan bienvenida incluso en orientación ancha; escritorio usa portada. La variante táctil requiere prueba física adicional. |
| Lista pública centralizada | Evitar que demos, backend, SQL o documentación se filtren al artefacto. |
| Conservar código histórico | Recuperar reglas funcionales sin restaurar Node/SQLite como backend oficial. |
| Mutaciones sin reintento automático | Una interrupción puede dejar resultado desconocido; evitar duplicados. |

## Archivos históricos

`app.js`, `app/`, `demo/`, `server/`, `sql/`, varias hojas antiguas y `render.yaml` pertenecen a versiones previas. Sus pruebas no demuestran que esos módulos existan en Supabase. La documentación anterior debe interpretarse con esa limitación; este documento y el estado de desarrollo describen la aplicación oficial.
