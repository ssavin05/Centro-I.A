# Verificación Centro I.A. 3.4

98/98 pruebas aprobadas, cero fallos y omitidas, sintaxis/imports/build correctos. Registro completo RESULTADOS-3.4.txt.

Nuevas pruebas: devolución de canje pendiente con saldo/stock e idempotencia, prohibición de devolución tras entrega y entrega tras cancelación; membresía reversible con saldo/historia conservados y bloqueo de nueva actividad; cursor estable con fechas iguales/búsqueda/aislamiento; preferencias e indicadores privados; CSV protegido e ICS con escapes; respuesta privada tardía y cambio de pestaña; worker sin interceptar API/escrituras/datos privados.

Supabase: Operations y hardening activados atómicamente en20261125201303_operations_33_reviewed.sql. Verificadas21 tablas RLS,13 RPCops solo authenticated con search_path vacío;2 perfiles y0 programas conservados. Sin fixtures de producción ni servicios pagados. Growth20261125201344_growth_34.sql permanece solo local.

Navegador local: devolución guardada, motivo conservado, estado cancelado, foco restaurado; saldo fixture130 puntos tras devolución y visita. Baja bloqueada por próxima cita con alerta/formulario conservado. Exportación CSV anunciada y descargada. Objetivos1440/768/390; capturas reales1425×866,753×858,375×812. Revisor independiente dio ship limitado a historial escritorio, indicadores tablet y membresías móvil. No certifica todos los formularios, WCAG ni instalación física. Detector no disponible por caché restringida.

PGlite17.5 no certifica contención entre conexiones PostgreSQL nativas independientes. Faltan JWT reales de todos los roles, correo operativo, pruebas físicas/carga y revisión adicional de seguridad/recuperación. PWA preparada: sin cacheprivada, sin reenvío automático ni push; requiere validación publicada.

GitHub: preparados blobs y árbol de código. El guardado del commit/rama y publicación no se declaran completados hasta comprobarlos en ESTADO-DESARROLLO.md. Presupuesto de infraestructura$0.

ZIP: código, guías, resultados, migraciones, ejemplos, frontend construido y capturas; SHA256 por archivo y comprobación al descomprimir en memoria. Sin bases, sesiones, secretos ni dependencias instaladas. Se preservan las entregas3.2y3.3.
