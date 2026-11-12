# Pruebas de Centro I.A.

Esta guía permite verificar la primera etapa sin alterar cuentas o datos de producción.

## Test Strategy

Ejecuta la suite desde la raíz con Node.js 22.13 o posterior:

```sh
npm run verify
```

El comando comprueba archivos privados, recursos enlazados e imports, sintaxis, pruebas Node y build. Sin npm, el mismo verificador se ejecuta con `node scripts/verify.mjs`. No requiere paquetes externos.

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

- [ ] P1: registro/login/recuperación y cambios de nombre con cuentas de prueba aisladas.
- [ ] P1: autorización entre dos negocios cuando exista su esquema.
- [ ] P1: reservas y puntos concurrentes cuando existan sus RPC.
- [ ] P2: teclado, lectores de pantalla y zoom del navegador.
- [ ] P2: contraste calculado en todas las superficies y Core Web Vitals.

## CI Gates

`ci.yml` ejecuta `npm run verify` en Node 22. `pages.yml` verifica y construye antes de desplegar main. Una ejecución CI verde no confirma entrega de correo ni valida módulos comerciales aún pendientes.

Capturas de revisión y medidas responsive se guardan en `.impeccable/review/` localmente; el paquete Pages no las incluye.
