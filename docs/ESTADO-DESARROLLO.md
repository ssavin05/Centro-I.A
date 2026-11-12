# Estado del desarrollo de Centro I.A.

Este seguimiento permite continuar el trabajo sin confundir pantallas implementadas con funciones validadas en producción. Corte: 12 de noviembre de 2026.

## Base recuperable y rama

- Repositorio: `ssavin05/Centro-I.A`.
- Base inspeccionada: `5fdf675c5c1fae826438f145e95a86f59da8d4aa`.
- Respaldo remoto comprobado: `archivo/version-fidelidad-2026-11-11`, commit `af73a8240f8225e00ee7d25943215728e83f15a6`. Intacto.
- Rama de trabajo: `codex/fundamentos-acceso-seguro-2026-11-12`.
- La copia local se obtuvo mediante el conector GitHub porque Git no está instalado en el PATH. Los commits se registran mediante Git Data API con comprobación del SHA previo.

## Fases

| Fase del encargo | Estado | Evidencia y pendiente |
|---|---|---|
| 1. Diagnóstico | Completada para planificar la primera etapa | Inventario de 98 archivos, rutas publicadas, backend histórico, pruebas, esquema/permisos reales; véase auditoría. No es una certificación de seguridad completa. |
| 2. Fundamentos | Parcial | Tokens compartidos, CSS de acceso separado, recursos publicables, vista previa estática, bienvenida móvil/tablet. Limpieza visual histórica y rediseño integral pendientes. |
| 3. Autenticación | Implementación y pruebas aisladas; validación externa pendiente | Registro/login preservados, recuperación/restablecimiento, doble envío, edición de nombre y sesión. Correo y cuentas reales de prueba pendientes. |
| 4. Empresa | Pendiente | No existen todavía tablas de negocios ni onboarding persistente. |
| 5. Usuario | Parcial | Perfil propio y espacio sin información ficticia; descubrimiento y relaciones con negocios pendientes. |
| 6. Fidelización | Pendiente | El backend histórico no equivale a implementación Supabase. |
| 7. Reservaciones | Pendiente | Faltan esquema, RPC atómicas, disponibilidad y flujos conectados. |
| 8. Gestión empresarial | Pendiente | Clientes, equipos, invitaciones y campañas. |
| 9. Estadísticas | Pendiente | Requiere actividad real y definiciones de métricas. |
| 10. Pulido | Parcial | Bienvenida móvil sin overflow; revisión integral de teclado, zoom y todas las pantallas pendiente. |
| 11. Validación y publicación | Pendiente de integración | No se ha integrado en main ni publicado esta etapa en Pages. |

## Funciones de esta etapa

- Bienvenida de pantalla completa en celulares y tablets, con marca, ondas y enlaces reales a crear cuenta/iniciar sesión. Sin temporizador ni dependencia de JavaScript para entrar.
- Escritorio conserva su portada; el cambio de presentación usa CSS responsive.
- Registro Usuario/Empresa conserva la selección inicial y los permisos de `cia_profiles`.
- Validación de nombre, correo y contraseña; confirmación visible de errores, foco en campo inválido, mostrar/ocultar ambas contraseñas y bloqueo de solicitudes repetidas.
- Solicitud de recuperación con mensaje que no promete entrega ni revela existencia de cuenta.
- Restablecimiento requiere sesión de recuperación; no se redirige accidentalmente al panel antes de cambiar la contraseña. Sesión verificada antes de guardar y cierre de sesiones de Auth después.
- Perfil recuperado mediante usuario verificado. Edición limitada al nombre; confirmación del resultado, errores con conservación de datos y recarga del perfil.
- Cierre de sesión limpia la vista privada, incluso si ocurre en otra pestaña mientras carga un perfil.
- Timeout de 15 segundos para solicitudes de red y carga del SDK; el proveedor no se reintenta automáticamente.

## Pruebas y comprobaciones

- `node scripts/verify.mjs`: **33 pruebas aprobadas**, ninguna fallida; comprobaciones del repositorio, imports, sintaxis y construcción de Pages aprobadas.
- Base original: 9 de 10 pruebas aprobadas en sandbox; la prueba histórica falló por ruta Windows y después por sockets bloqueados. Se corrigió la ruta y se ejecutó con acceso a localhost; pasó sin eliminar assertions.
- SQL de solo lectura `supabase/tests/profiles_permissions.sql`: aprobado en el proyecto real.
- Supabase: proyecto `ACTIVE_HEALTHY`, PostgreSQL 17; `cia_profiles` tiene RLS. A la hora de la auditoría había 0 usuarios Auth y 0 perfiles; no se crearon usuarios para probar en producción.
- Advisor de seguridad: no devolvió lints. Esto no prueba por sí solo la ausencia de vulnerabilidades.
- Navegador: bienvenida verificada a 320×667, 375×667, 390×844, 768×1024, 1024×768; enlaces visibles, sin scroll horizontal. A 1366×768, 1440×900 y 1920×1080 aparece el escritorio. Registro 1366×768, validación de correo inválido y navegación móvil login → recuperación comprobados.
- Revisión independiente: **ship** para interfaz/controladores de esta etapa. Capturas móvil, tablet, escritorio y Auth válidas; no certifica entrega de correo ni aislamiento con identidades reales.
- Las pruebas de Auth/perfil usan dobles del proveedor y ejecutan los controladores reales. No sustituyen un registro, correo, recuperación y edición verificados contra Supabase con cuentas de prueba.

## Migraciones y cambios eliminados

No se aplicó ninguna migración ni se modificaron permisos, configuración Auth o datos de producción. El esquema existente sirve para editar el nombre.

Se retiró el CSS inline de `auth.html` y se reemplazó por `auth.css`; se separaron validaciones. No se borró el código histórico ni el respaldo. El archivo histórico `render.yaml` sigue intacto en GitHub y se excluyó de la copia editable local por contener configuración de pago.

## Riesgos, bloqueos y funciones incompletas

1. **Correo:** no se verificaron SMTP, plantillas ni Redirect URLs del proyecto. El SMTP predeterminado tiene restricciones; revisar configuración antes de ofrecer registro público. No desactivar confirmación como atajo.
2. **Integración real:** faltan cuentas de prueba autorizadas en entorno aislado para comprobar login, RLS entre dos identidades, recuperación por correo y persistencia real del cambio de nombre.
3. **Funciones comerciales:** no hay todavía negocios, puntos, recompensas, reservas, equipos ni campañas persistentes en Supabase.
4. **updated_at:** el esquema existente no lo actualiza automáticamente al editar el nombre. No se presenta al usuario como fecha fiable de modificación. Preparar trigger y prueba en migración posterior.
5. **Dependencia externa:** SDK Supabase fijado a 2.94.1 servido por jsDelivr. Hay error visible y timeout si no carga; autoalojar el SDK queda como mejora evaluable.
6. **Accesibilidad/rendimiento:** revisión visual y medidas de overflow realizadas; no hay auditoría axe/WCAG completa, prueba en hardware físico, zoom real ni mediciones de Core Web Vitals.
7. **PWA:** el manifiesto histórico no constituye una PWA validada. No se activó caché de datos privados, sincronización offline ni push.
8. **Herramientas:** Impeccable CLI no pudo instalar/cargar contexto por restricciones del entorno; se usaron sus referencias y revisión independiente. No se declara ejecutado su detector.

## Decisiones

Se mantiene HTML/CSS/ES Modules y Supabase, evitando un framework o proveedor adicional. Los privilegios residen en la base. El repositorio histórico se conserva como conocimiento, aislado del artefacto publicado.

Las preguntas de confirmación rutinarias de las skills se resuelven mediante la autonomía explícita del encargo. Se utiliza este seguimiento único en lugar de crear tres planes redundantes de mejora.

## Últimos commits

- `847476d17c9a7107c40de4bb976c4731a5f77a7d`: pruebas de comportamiento de acceso y compatibilidad Windows de la prueba histórica.
- `30bcb47be12d5a27528c0d47797ddf627a25098e`: bienvenida móvil/tablet, acceso y perfil; 33 pruebas aprobadas. `server/` permanece intacto.
- Revisión y documentación: [PR #1](https://github.com/ssavin05/Centro-I.A/pull/1), en borrador; la implementación pasó CI en GitHub.

## Siguiente tarea concreta

Validar esta etapa con dos cuentas de prueba en entorno aislado y comprobar configuración de correo/redirects. Después, diseñar y probar una migración no destructiva para `businesses`, membresías de negocio, sucursales y borrador de onboarding de cuatro pasos, con RLS y pruebas de aislamiento antes de exponer el formulario.

Los cambios que necesitan autorización específica son servicios con costo, operaciones destructivas y cambios de infraestructura o publicación de alto riesgo. No son necesarios para revisar este PR.
