# Estado del desarrollo de Centro I.A.

Este seguimiento permite continuar el trabajo sin confundir pantallas implementadas con funciones validadas en producción. Corte actual: 26 de noviembre de 2026; se conserva el historial anterior.

## Entrega 3.5.1 — respaldo y contención real (26 de noviembre de2026)

Este corte prevalece sobre los anteriores. Sin cambios visuales ni publicación.

- Fuente3.4/3.5 guardada en GitHub: commits8f838f3,81f50c9. CI aprobada. Prueba PostgreSQL nativa guardada en60ef13c y aprobada en run45930596215; registro RESULTADOS-POSTGRES-3.5.1.txt.
-106/106pruebas locales, build y comprobaciones correctos. CI conserva dist como artefacto revisable siete días.
- PostgreSQL17.11 con conexiones independientes: sobreventa de última unidad, clave idempotente simultánea y cuatro carreras entrega/devolución. Sin fixtures en Supabase; no acredita carga ni toda la agenda.
- Growth3.4 sigue sin aplicar: auto-review rechazó la migración persistente por requerir autorización específica de esta ampliación. Solicitud pendiente al titular; no hubo vía alternativa.
- Preflight remoto:2perfiles,0programas/membresías/canjes;21tablas RLS. Main y rama de archivo intactos. PR1 sigue en borrador; no acredita publicación.
- Guía GUIA-CENTRO-IA-3.5.1.md y ZIP Cia.IA.3.5.1.zip; se preservan anteriores. Puerto local4178.

## Entrega 3.5 — experiencia personal de Usuario

Este corte prevalece sobre los anteriores. Frontend local terminado; no acredita publicación.

- Inicio con negocio elegido, premio concreto, progreso real y próxima cita/canje/llegada. Accesos a premios/citas/explorar.
- Filtros de premios por disponibilidad de puntos y negocio, objetivo elegido en memoria, niveles/retos, promociones vigentes e historia sin duplicados.
- Azul noche/océano/cielo y dorado; transición finita de meta y barra, respuestas de botones, navegación existente y reduced-motion. Ganancia de saldo solo después de un snapshot actualizado de la misma identidad.
-104/104pruebas completas y build correctos. Navegador1440/768/390; revisión independiente y único fix de scrollbar puntuado resolved, disposition ship limitada a ese arreglo. Ver VERIFICACION-3.5.md.
- Puerto4178, scripts/review-35.mjs, base separada con datos sintéticos. Sin producción ni migraciones nuevas. Growth3.4 permanece local, rama remota y publicación pendientes.
- GUIA-CENTRO-IA-3.5.md explica el uso. Paquete Cia.IA.3.5.zip incluye fuente y sitio publicable;3.4 y anteriores preservados.

## Entrega 3.4 — ampliación de operación

Esta sección prevalece sobre los cortes históricos inferiores.

- Operations 3.3 activado con hardening en una sola transacción, versión remota20261125201303; archivo local alineado.21tablas RLS y13RPCops solo authenticated con search_path vacío;2perfiles preservados,0programas.
- Growth3.4 implementado y probado localmente: cursor/búsqueda/CSV, devolución pendiente con motivo/ledger, participación reversible, preferencias e indicadores30d. Migración20261125201344_growth_34.sql pendiente de activación remota.
- ICSmanual, actualización periódica en lectura sin formularios y PWA preparada con offline sin cacheprivada ni cola de envíos.
-98/98pruebas completas aprobadas; sintaxis, imports y build. Revisión independiente ship limitada a3vistas. Capturas reales1425×866,753×858,375×812 para objetivos1440/768/390.
- Navegador: refund cancelado/motivo/foco, baja bloqueada con cita futura conservaformulario y alerta;CSV descargado.
- Prueba3.4: puerto4177. scripts/review-34.mjs usa base/fixtures separados identificados como prueba.
- Guardado en repositorio y publicación: en preparación; actualizar este punto solo con resultados comprobados.
- Guía AMPLIACION-3.4.md; pendientes técnicos separados. Decisiones del titular en TAREAS-DEL-TITULAR-3.4.md. Presupuesto$0, sin fixturesproducción, sin mensajes ni servicios de pago.

## Entrega 3.3 — corte del 25 de noviembre de 2026

Esta sección prevalece sobre los estados históricos inferiores.

- Sedes con zona horaria propia; propietario, gerente, recepción y profesional con permisos por sede. Invitaciones de uso único, caducidad de siete días y revocación.
- Recursos asignados, jornadas semanales, descansos y ausencias; disponibilidad en tramos de 15 minutos, citas de 5 a 720 minutos y series de hasta ocho semanas. Reprogramación con revisión e historial.
- Corrección verificada: ser cliente y profesional no permite confirmar/completar una cita atendida por otra persona. Un cambio como cliente vuelve a solicitar confirmación. Sedes pausadas no ofrecen recursos a clientes.
- Supabase: aplicada studio_32, versión remota 20261125154520. Archivo local alineado. Catorce tablas cia_* con RLS y once RPC Studio solo para authenticated con search_path vacío. Dos perfiles preservados, cero negocios. Sin fixtures de producción.
- Operations 3.3 y su corrección NO aplicadas: el conector devolvió confirmation expired. No se sustituyó el mecanismo de aprobación por SQL directo.
- Código 3.3 disponible en prueba aislada http://127.0.0.1:4176/workspace.html?as=company y ?as=user. Adaptador local fuera del sitio publicable.
- Verificación completa final: 89/89 pruebas aprobadas, sintaxis/imports y build. El primer intento restringido falló dos recorridos locales; ambos y después la suite completa pasaron con el acceso necesario.
- Navegador: guardado de horarios confirmado, cierre y foco restaurado; profesional sin controles de propietario. Capturas nuevas válidas 1440/768/390. Revisor independiente: ship limitado a esas vistas; sin auditoría completa.
- Paquete nuevo Cia.IA.3.3.zip; la entrega Cia.IA.3.2.zip se conserva. No hay publicación nueva en Pages ni integración en main.

## Entrega local 3.2 — funciones y paquete

Esta sección sustituye los pendientes históricos de producto que aparecen más abajo cuando ya están implementados en 3.2. Los cortes anteriores se conservan como historial.

- Asistente por ocho giros, configuración editable, temas y logo posterior a creación.
- Catálogo editable con importación revisada CSV/TSV/JSON/HTML/TXT/MD/DOCX/PDF con texto; extracción sin servicios externos, sin OCR.
- Promociones, tipos/condiciones/vigencia de premios, retos con bono único y niveles por visitas.
- Ajustes documentados, movimientos y avisos internos; no push/correo.
- Agenda: solicitudes, confirmación/completar/cancelar, bloqueo interno, recurso y conflicto de citas confirmadas. Sin empleados/sucursales de verdad ni agenda laboral.
- Migración 20261117023910_studio_32.sql versionada y probada SOLO localmente; no aplicada a producción. La autorización anterior corresponde al núcleo ya aplicado.
- Puerto 4175 para esta revisión local; 4174 sigue siendo el puerto predeterminado del script genérico. El frontend conectado requiere despliegue y activación revisada para sus módulos nuevos.
- Suite ampliada: 80 pruebas; recorrido de empresa/usuario y siete formatos de importación comprobados en navegador. Ver VERIFICACION-3.2.md para evidencia final y límites.
- Revisión visual 344/390/768/1280/1440; calendario compacto a <=420; controles y foco corregidos; el revisor puntuó ambos fixes resolved y dio ship limitado a ese alcance. Motor Impeccable/detector no ejecutables por caché restringida.
- Guía detallada: [GUIA-CENTRO-IA-3.2.md](GUIA-CENTRO-IA-3.2.md). Paquete Cia.IA.3.2.zip; no equivale a publicación remota.

## Activación autorizada — 17 de noviembre de 2026

- El titular respondió explícitamente que autorizaba aplicar la migración a Supabase.
- Aplicada loyalty_core, versión 20261117013535; archivo local alineado con el historial remoto.
- Verificados RLS de cinco tablas, diez RPC exclusivas de authenticated con search_path vacío, helper privado y ausencia de escritura directa. Sin fixtures de producción.
- Advisor: diez advertencias esperadas por RPC SECURITY DEFINER y protección de contraseñas filtradas preexistente. Las comprobaciones no son auditoría integral.
- Corregido acceso sin sesión: AuthSessionMissingError status400 dirige a login. Regresión reproducida antes del arreglo y navegador verificado; no se usaron credenciales del titular.
- Suite actual: 67 pruebas. El recorrido completo sigue probado en entorno aislado; el flujo autenticado real de ambos roles necesita validación adicional.
- Interior conectado: http://127.0.0.1:4173/workspace.html. La prueba del puerto4174 continúa independiente.

## Segunda sesión autónoma: el interior de fidelidad

- Rediseño del perfil vacío como aplicación con navegación Inicio, Premios, Visitas, Explorar/Mi negocio y Mi cuenta. Escritorio lateral, tablet compacta y celular inferior.
- Usuario: unirse por código o programa publicado, saldo por negocio, llegada/salida voluntarias, premios, canje confirmado y comprobantes.
- Empresa: crear programa privado, puntos por visita, crear/pausar premios, publicar explícitamente, consultar clientes/visitas, confirmar puntos y entregas.
- Migración nueva de cinco tablas y diez RPC, probada en PostgreSQL 17.5 aislado. No depende de la propuesta de onboarding anterior.
- La aplicación de la migración a Supabase fue rechazada automáticamente por requerir autorización explícita para DDL de producción. No se reintentó ni se ejecutó por otra vía.
- Prueba local persistente disponible en puerto 4174, separada del sitio oficial 4173 y de Supabase. Datos y usuarios identificados como prueba; sin métricas inventadas.
- Recorrido completo comprobado en navegador; API local y reinicio persistente probados por HTTP. Suite final: 66/66 aprobadas. Revisor independiente puntuó resueltos los dos fixes de accesibilidad tablet y tono de errores; sin auditoría integral ni activación de producción.
- Véase docs/FIDELIDAD.md para alcance, contratos, límites y pasos de activación.

## Sesión autónoma del 16 de noviembre: diseño y base de negocios

- Paleta ampliada: dorado luminoso, azul claro y profundo, negro y blanco. Hero con contraste y superficies coherentes; bienvenida exclusiva de móvil/tablet conservada.
- Animaciones de carga, error y confirmación; arco de acceso breve. Decoraciones pausadas fuera de pantalla o con pestaña oculta; reducción de movimiento respetada.
- Descarga local del perfil guardado en JSON con lista explícita de campos. No contiene sesión, tokens ni metadatos internos.
- FAQ nativa de cuatro preguntas con enlaces reales y límites de disponibilidad.
- Propuesta SQL de cinco tablas y dos RPC para borradores y finalización de negocio. RLS, tipo Empresa protegido, revisión optimista, idempotencia y transacción atómica probados en PostgreSQL aislado. **No aplicada a Supabase ni conectada al formulario de onboarding**.
- Verificación: **53/53 pruebas**, sintaxis, recursos y build. Las diez pruebas nuevas cubren PostgreSQL, exportación y movimiento/contraste.
- PGlite 0.5.16 es desarrollo exclusivo. Usa PostgreSQL 18.6; producción usa 17. Los conflictos probados en una conexión no certifican concurrencia entre conexiones independientes.
- Revisión independiente de interfaz y FAQ sin bloqueos materiales en su alcance. Motor Impeccable no disponible; se usaron referencias y revisión manual.
- CI del commit 46f5bd0 aprobado. Sin cambios a producción, main o respaldo.

## Continuación del 16 de noviembre: consistencia de sesión

- Estado remoto confirmado antes de editar: PR #1 abierto en borrador, head `246f8ff77be7a5d9992f4e625de6936328fa166f`; main conserva `5fdf675`.
- Corregidas carreras entre cargas de perfil: una respuesta o excepción antigua no limpia ni reemplaza una sesión nueva. Cerrar sesión durante getUser impide iniciar la consulta del perfil antiguo.
- Cambio de identidad en otra pestaña: se ocultan y limpian inmediatamente los datos privados; la cuenta nueva se verifica fuera del callback síncrono de Auth.
- Las escrituras antiguas no muestran errores/éxitos ni habilitan controles después de cambiar o cerrar sesión.
- Recuperación ligada al identificador verificado: cerrar sesión o cambiar de identidad invalida el formulario, limpia contraseñas y descarta resultados pendientes. Se comprueba identidad y versión de sesión antes de enviar el cambio.
- La sesión cacheada se verifica antes de redirigir al panel. Un fallo temporal del proveedor ofrece reintento y no genera un bucle login/panel.
- Diez pruebas nuevas reprodujeron los fallos antes de corregirlos. Verificación final local: **43/43 pruebas aprobadas**, sintaxis, enlaces, imports y build correctos.
- Archivos funcionales: `auth.js`, `workspace.js`; cobertura en `tests/auth-flow.test.mjs` y `tests/profile-flow.test.mjs`.
- Sin migraciones, cambios visuales, cambios de permisos ni escrituras a producción. SMTP, correo real e integración de dos cuentas en Supabase siguen pendientes; esta suite usa dobles del SDK.

## Base recuperable y rama

- Repositorio: `ssavin05/Centro-I.A`.
- Base inspeccionada: `5fdf675c5c1fae826438f145e95a86f59da8d4aa`.
- Respaldo remoto comprobado: `archivo/version-fidelidad-2026-11-11`, commit `af73a8240f8225e00ee7d25943215728e83f15a6`. Intacto.
- Rama de trabajo: `codex/fundamentos-acceso-seguro-2026-11-12`.
- La copia local se obtuvo mediante el conector GitHub durante la recuperación inicial. Los commits se registran mediante Git Data API con comprobación del SHA previo.

## Fases

| Fase del encargo | Estado | Evidencia y pendiente |
|---|---|---|
| 1. Diagnóstico | Completada para planificar la primera etapa | Inventario de 98 archivos, rutas publicadas, backend histórico, pruebas, esquema/permisos reales; véase auditoría. No es una certificación de seguridad completa. |
| 2. Fundamentos | Parcial | Tokens compartidos, CSS de acceso separado, recursos publicables, vista previa estática, bienvenida móvil/tablet. Limpieza visual histórica y rediseño integral pendientes. |
| 3. Autenticación | Implementación y pruebas aisladas; validación externa pendiente | Registro/login preservados, recuperación/restablecimiento, doble envío, edición de nombre y sesión. Correo y cuentas reales de prueba pendientes. |
| 4. Empresa | Propuesta probada, activación pendiente | Cinco tablas y RPC aisladas; faltan migración revisada en PostgreSQL 17, formulario y validación real. |
| 5. Usuario | Funcional en prueba local | Perfil, programas, visitas, premios, canjes y comprobantes. Activación real pendiente. |
| 6. Fidelización | Implementada y probada en local; activación pendiente | Programas, puntos por visita, premios, canjes y entrega con RPC; migración de producción bloqueada por auto-review. |
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

- `node scripts/verify.mjs`: **53 pruebas aprobadas**, ninguna fallida; comprobaciones del repositorio, imports, sintaxis y construcción de Pages aprobadas. La entrega del 12 de noviembre contenía 33 pruebas.
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

Completar el recorrido autenticado con cuentas Usuario y Empresa, validación de correo/redirects y contención PostgreSQL nativa. La migración de fidelidad ya fue autorizada y aplicada: no reaplicarla. Después revisar e integrar el PR para publicar el frontend.

Edición posterior, bajas, cancelaciones, equipos, campañas, reservas y paginación siguen pendientes. La propuesta antigua de onboarding permanece separada.

No crear infraestructura de pago, eliminar datos ni cambiar Auth como atajo.
