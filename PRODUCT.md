# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Usuario participa en programas de negocios, registra visitas voluntarias, consulta puntos/premios y solicita citas. Empresa es propietaria de un programa. Un Usuario o Empresa puede aceptar una función laboral por sede sin alterar el tipo de cuenta protegido. Gerente, Recepción y Profesional tienen permisos acotados.

## Product Purpose

Centro I.A., «Un motivo para volver», conecta personas y negocios mediante fidelidad y experiencias. No es un ERP.

## Operating Context

Frontend estático HTML/CSS/ES Modules para GitHub Pages. Supabase huqspupbhhqilxeizklr para Auth/datos. Repositorio ssavin05/Centro-I.A. Rutas index.html, auth.html, workspace.html. Bienvenida exclusiva móvil/tablet; escritorio conserva portada completa.

Corte 25 de noviembre de 2026: perfiles/núcleo y Studio 3.2 aplicados en Supabase. Operations 3.3 y su corrección activados juntos en Supabase, versión 20261125201303. La interfaz nueva no está publicada ni integrada en main. La guía docs/GUIA-CENTRO-IA-3.3.md prevalece sobre estados históricos.

Prueba local PostgreSQL17.5/PGlite persistente, puerto4176 y cinco identidades ficticias, siempre PRUEBA LOCAL. No usa Supabase ni cuentas reales; selector solo local y jamás publicable.

## Capabilities and Constraints

Registro/acceso, recuperación y perfil con tipo inmutable. Núcleo: negocio privado/publicación voluntaria, membresía, visitas voluntarias con separación18h, puntos por negocio tras confirmación, premios/canje/entrega atómicos e idempotentes. Sin geolocalización pasiva.

Studio: ocho giros, cuatro temas, asistente, logo, catálogo editable/importación revisada, promociones, retos, niveles, ajustes con motivo, movimientos y avisos internos. Importa CSV/TSV/JSON/HTML/TXT/MD/DOCX/PDF con texto localmente; sin OCR ni XLSX directo. Catálogo informativo sin cobro/POS.

Operations: sedes con zona horaria, equipo/invitaciones de uso único, recursos asignados, jornadas/descansos/ausencias, disponibilidad15min, reservas5–720min, series hasta8semanas, reprogramación con revisión e historial. Un profesional cliente de otro recurso conserva solo derechos de cliente sobre esa cita.

Un propietario/un programa, múltiples sedes; puntos compartidos por programa. No hay cupos grupales, espera, sincronización externa, recordatorios/push, paginación completa o escala validada. Acceso a cuentas reales, correo y seguridad adicional requieren validación antes de lanzamiento. Presupuesto de infraestructura $0MXN; no Render de pago.

## Brand Commitments

Centro I.A. · Un motivo para volver. Español natural. Azul profundo/noche y claro, dorados, negro azulado/blanco. DESIGN.md y design-tokens.css registran el sistema. Mantener identidad, foco visible, controles44px y movimiento reducido. Sin datos ni estadísticas inventadas.

## Evidence on Hand

98/98 pruebas y build final correctos, incluyendo PostgreSQL17/PGlite, controladores, API local/persistencia. Supabase real:21 tablas cia_* con RLS; 13 RPC de operaciones y 11 RPC Studio solo authenticated con search_path vacío;2perfiles preservados y0programas. Sin fixtures de producción.

Capturas .impeccable/review/v33: escritorio1440, tablet768, móvil390. Revisor fresco dio ship al alcance capturado, no a todos los formularios ni a auditoría integral. Guardado de horario/cierre/foco comprobados en navegador. Detector no disponible por caché restringida. PGlite no certifica contención multi-conexión nativa.

## Product Principles

Datos y confirmaciones verdaderas; ningún éxito sin respuesta confirmada. Bloquear doble envío y descartar respuestas privadas tardías. Sin reintentos automáticos de mutaciones inciertas. RLS y permisos en servidor; no user_metadata como autorización. Mantener respaldo recuperable e histórico intacto.

## Accessibility & Inclusion

Etiquetas, foco, mensajes accesibles, controles táctiles y adaptación móvil/tablet/escritorio. Movimiento reducido. Capturas y revisión parcial no acreditan WCAG completa ni pruebas físicas.

## Extensión 3.4

Growth 3.4 añade historial por cursor y búsqueda, exportación CSV autorizada con límite seguro, devolución atómica de canje pendiente con motivo, membresías reversibles, preferencias promocionales internas e indicadores de retorno de 30 días. Implementado y probado localmente; migración remota pendiente. Añade ICS manual y lecturas periódicas cuando no hay formularios visibles. PWA preparada con worker de recursos públicos y fallback sin conexión, sin cachear cuentas ni reenviar escrituras; instalación real pendiente. Capturas v34 de historial escritorio, indicadores tablet y membresías móvil; revisor fresco dio ship limitado a esas vistas. Consulte docs/AMPLIACION-3.4.md y las tareas del titular al final.
