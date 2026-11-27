# Pruebas de Centro I.A.

Esta guía permite verificar la primera etapa sin alterar cuentas o datos de producción.

## Test Strategy

Con Node.js 22.13 o posterior y pnpm 11.25.0, instala con `pnpm install --frozen-lockfile --ignore-scripts`. Ejecuta desde la raíz:

```sh
npm run verify
```

El comando comprueba archivos privados, recursos enlazados e imports, sintaxis, pruebas Node y build. Sin npm, el mismo verificador se ejecuta con `node scripts/verify.mjs`. PGlite 0.5.16 es dependencia de desarrollo fijada; no se publica en Pages.

La prueba histórica abre un servidor en localhost y crea una base SQLite temporal; necesita sockets locales permitidos. Los controladores oficiales usan dobles del cliente Supabase en un contexto VM. No se envían correos ni se crean cuentas en producción durante la suite.

## Safety Net Map

| Módulo | Comportamientos protegidos | Pruebas | Brechas |
|---|---|---|---|
| Reglas de cuenta | Límites, correo, confirmación, errores sin detalles internos | `account-rules.test.mjs` | Validación del servidor se verifica aparte. |
| Acceso | Registro de ambos tipos, persistencia de sesión, error, doble envío, recuperación, enlace vencido, reset sin sesión rechazado, reset válido | `auth-flow.test.mjs` | Email y tokens reales de Supabase. |
| Perfil | ID verificado, escritura solo de nombre, recarga, fallo sin pérdida, cierre de sesión y carrera entre pestañas | `profile-flow.test.mjs` | Persistencia real con dos cuentas en entorno aislado. |
| Web oficial | Enlaces, selección Usuario/Empresa, lista pública y artefacto completo | `home`, `experience`, `interaction-polish`, `preview`, `deployment`, `pages-build` | Dispositivos físicos y auditoría WCAG completa. |
| Histórico | Fidelización, reservas, aislamiento y persistencia en SQLite | `api.test.mjs` | No representa los módulos de Supabase. |
| Permisos reales | RLS, grants mínimos, tipo/ID inmutables, trigger no público | `supabase/tests/profiles_permissions.sql` | Políticas con identidades reales y operaciones concurrentes futuras. |

## Characterization Backlog

La continuación del 16 de noviembre añade diez regresiones: sesiones de recuperación invalidadas, cambio de identidad, respuestas y errores tardíos, verificación de identidad antes de guardar, caché de sesión inválida y fallos temporales del proveedor. Cada caso falló antes del arreglo y pasó después. Esa entrega contenía 43 pruebas; la suite actual contiene 53. No requiere cuentas reales ni mensajes de correo.

- [ ] P1: registro/login/recuperación y cambios de nombre con cuentas de prueba aisladas.
- [ ] P1: ejecutar la propuesta en Supabase aislado/PostgreSQL 17 con conexiones concurrentes.
- [ ] P1: reservas y puntos concurrentes cuando existan sus RPC.
- [ ] P2: teclado, lectores de pantalla y zoom del navegador.
- [ ] P2: contraste calculado en todas las superficies y Core Web Vitals.

## CI Gates

`ci.yml` instala con pnpm 11.25.0 y lockfile, sin scripts de instalación, y ejecuta `npm run verify` en Node 22. `pages.yml` verifica y construye antes de desplegar main. Una ejecución CI verde no confirma entrega de correo ni valida módulos comerciales aún pendientes.

Capturas de revisión y medidas responsive se guardan en `.impeccable/review/` localmente; el paquete Pages no las incluye.

## PostgreSQL y nuevas comprobaciones

La suite contiene 53 pruebas. Cinco grupos ejecutan permisos, aislamiento entre identidades fixture, inmutabilidad del tipo, borradores, idempotencia y rollback en PGlite/PostgreSQL 18.6. Auth es un esquema de prueba, no Supabase Auth real. La conexión es única: los casos de revisión obsoleta no certifican contención entre conexiones independientes. Producción PostgreSQL 17 requiere validación adicional.

La exportación prueba campos permitidos, perfil guardado y cierre de identidad. Otras tres pruebas cubren pausas por visibilidad, fallback sin IntersectionObserver y contraste de combinaciones principales. No equivalen a una auditoría completa de accesibilidad.

## Interior de fidelidad: segunda sesión

La suite actual contiene 67 pruebas: las 53 anteriores y 14 nuevas. Cuatro grupos PostgreSQL 17 prueban el núcleo; seis casos del controlador prueban identidad, respuestas atrasadas, XSS, estado sin activar y doble clic; dos casos puros cubren llegada y disponibilidad; una integración HTTP comprueba API local, canje simultáneo idempotente y persistencia al reiniciar. Las pruebas comerciales usan la migración oficial como fuente única. No prueban Supabase Auth real ni concurrencia entre conexiones PostgreSQL nativas.
