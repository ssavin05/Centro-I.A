# Reglas permanentes de Centro I.A.

Estas reglas orientan el desarrollo de la aplicación oficial. Consulta `docs/ESTADO-DESARROLLO.md` antes de continuar una etapa.

## Producto e identidad

- Centro I.A., «Un motivo para volver», conecta negocios y personas mediante fidelización y experiencias. No convertirlo en un ERP.
- Interfaz y mensajes en español natural. Paleta: dorados `#C99B4C`/`#EDC77D`, azul claro `#DCEBF4`, profundo `#173C50`, negro `#0D151B`, blanco y bases cálidas. Sigue DESIGN.md.
- Usa `design-tokens.css`, componentes compartidos, foco visible, controles táctiles y reducción de movimiento. Usa dorado como acento; comprueba el contraste del texto.
- La bienvenida de `index.html` es exclusiva de móviles/tablets. El escritorio conserva la portada completa. No agregar una espera artificial ni bloquear el acceso.
- Nunca presentar empresas, saldos, reservas, estadísticas, testimonios o notificaciones inventados como datos reales.

## Arquitectura y presupuesto

- Presupuesto de infraestructura y herramientas esenciales: **$0 MXN**. GitHub, GitHub Pages y Supabase existentes.
- Frontend estático HTML/CSS/ES Modules; no introducir frameworks sin una necesidad demostrada.
- `scripts/pages-files.mjs` es la lista explícita de recursos publicables. No copiar todo el repositorio a `dist`.
- Auth y datos persistentes pertenecen a Supabase. El backend `server/`, SQLite, `app/`, `demo/` y las hojas antiguas son históricos y no se publican en Pages.
- `render.yaml` es configuración histórica de pago: no ejecutar ni activar Render. No crear servicios facturables.
- `npm start` abre una vista previa estática local; `npm run start:legacy` es solo para revisar el backend histórico.

## Seguridad y datos

- `cia_profiles.account_type` se fija al registrar la cuenta. La elección inicial se copia por un trigger; la autorización posterior consulta la tabla protegida, nunca `user_metadata`.
- Usuario no puede elevarse a Empresa cambiando peticiones. Solo `name` es editable por el titular del perfil.
- Mantener RLS en toda tabla expuesta, permisos de columnas mínimos y aislamiento por negocio. No resolver errores desactivando RLS.
- No exponer `service_role`, claves secretas ni credenciales. La clave publishable del cliente es pública por diseño.
- Cada mutación debe confirmar su resultado antes de mostrar éxito. Bloquear dobles envíos; conservar entradas ante error.
- Puntos, stock, reservas y QR requerirán transacciones PostgreSQL con autorización e idempotencia del lado servidor.
- No eliminar cuentas o negocios desde el cliente con SQL directo. No ejecutar pruebas destructivas ni crear datos de prueba en producción.
- No reintentar automáticamente mutaciones cuyo resultado sea incierto. El correo depende de Auth/SMTP; aceptar una solicitud no prueba entrega.

## Código, pruebas y publicación

- Reglas puras en `account-rules.js`; controladores de página separados de la configuración de Supabase. Mantener módulos pequeños sin multiplicar abstracciones.
- Antes de una refactorización grande: rama de trabajo, respaldo recuperable y pruebas del comportamiento afectado.
- Instalar con pnpm 11.25.0: `pnpm install --frozen-lockfile --ignore-scripts`. Ejecutar `npm run verify`: comprobaciones de archivos, imports, sintaxis, pruebas y build de Pages. Las pruebas antiguas válidas se conservan.
- Probar móvil/tablet/escritorio, errores, carga, vacío, teclado y operaciones repetidas. Distinguir dobles de prueba de integración con Supabase real.
- Migraciones versionadas y no destructivas; inspeccionar tablas/políticas y documentación actual de Supabase antes de cambiar el esquema.
- Mantener intacta `archivo/version-fidelidad-2026-11-11`.
- Usar commits rastreables y PR; revisar cambios ajenos antes de integrar. No publicar cambios de alto riesgo sin autorización.
- Una rama o PR no equivale a publicación. Declarar límites y pendientes en `docs/ESTADO-DESARROLLO.md` después de cada etapa.

La propuesta supabase/proposals/business_onboarding.sql solo está probada localmente; no activarla sin revisión en Supabase aislado/PostgreSQL 17 y prueba de concurrencia real.

## Interior de fidelidad

- Lee docs/FIDELIDAD.md: el núcleo usa cia_clubs, separado de la propuesta de onboarding anterior.
- La migración 20261117013535_loyalty_core.sql fue aplicada después de autorización explícita del titular y coincide con el historial remoto. No reaplicarla ni usar la propuesta antigua para crear cia_clubs.
- La prueba del puerto 4174 es aislada y debe conservar siempre su franja PRUEBA LOCAL. No publicar el adaptador de scripts/local-preview-client.mjs ni tratar su selector de rol como Auth.
- Llegadas/salidas son voluntarias; no afirmar seguimiento automático. Puntos por negocio y solo tras confirmación del propietario. Canjes atómicos e idempotentes; ninguna escritura de saldo desde el cliente.

## Extensión 3.2

- Studio 3.2 fue aplicado a Supabase el 25 de noviembre con la autorización actual del titular; archivo alineado 20261125154520_studio_32.sql. No reaplicarlo. Operations 3.3 y hardening siguen SOLO locales por confirmación vencida del conector.
- Lee docs/GUIA-CENTRO-IA-3.2.md y docs/VERIFICACION-3.2.md. Puerto de la entrega local:4175 con scripts/start-32.mjs.
- studio-ui.js controla configuración por giro/logo/catálogo/promos/retos/agenda/avisos; conserva foco al redibujar y controles de44px. Los recursos de agenda no son empleados ni sucursales.
- No publicar tests/browser, el adaptador local ni el selector de roles. enableChecks es solo para revisión aislada y está desactivado por defecto.
- Seguridad/correo adicional permanece pendiente por prioridad del titular; no retirar las protecciones ya existentes.

## Operación 3.3

- Consulta docs/GUIA-CENTRO-IA-3.3.md y docs/VERIFICACION-3.3.md. Sedes, recursos y equipo tienen permisos por función; ser cliente de una cita no concede permisos de personal.
- Las dos migraciones operations_33 y operations_33_hardening son una unidad lógica: no activar la primera sin la corrección. No sustituir una confirmación rechazada o vencida por SQL directo.
- El inicio local actual usa scripts/start-33.mjs, puerto 4176, con la franja PRUEBA LOCAL. Cinco identidades de prueba; no usar el selector como autenticación real.

## Ampliación 3.4

- Operations ya está aplicado,20261125201303_operations_33_reviewed.sql. Los archivos por partes se conservan en supabase/history/33, no reaplicarlos. Growth20261125201344_growth_34.sql sigue local.
-98pruebas aprobadas. Lee docs/AMPLIACION-3.4.md y docs/ESTADO-DESARROLLO.md. Mantener devolución de canjes solo pendientes, stock histórico desconocido sin reconstrucción inventada y participación reversible sin borrar saldos.
- El worker solo cachea recursos públicos enumerados, nunca API, perfiles ni páginas privadas. No permitir colas automáticas de escrituras.
- scripts/backup.mjs es SQLite histórico; no presentarlo como respaldo de Supabase.

## Experiencia Usuario 3.5

- Lee docs/GUIA-CENTRO-IA-3.5.md y VERIFICACION-3.5.md. customer-ui.js y customer-rules.js usan snapshots existentes; no añaden permisos ni migraciones.
- Mantener saldos por negocio, datos de sesión limpios, progreso real y ganancia solo tras nuevo snapshot de la misma identidad. .is-customer limita los cambios visuales; Empresa conserva su composición.
- Prueba sintética separada scripts/review-35.mjs, puerto4178 y base .local-centro-35. No usar fixtures en producción.
-104pruebas completas aprobadas; revisión visual limitada y publicación/guardado remoto aún pendientes.
