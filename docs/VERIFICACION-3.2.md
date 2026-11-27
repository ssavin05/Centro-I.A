# Verificación de Centro I.A. 3.2

Corte: 16 de noviembre de 2026 (Pacífico). Entrega local; sin despliegue ni escrituras de prueba en Supabase de producción.

## Resultado técnico

- 80/80 pruebas aprobadas con node scripts/verify.mjs; cero fallos, saltos o cancelaciones.
- Sintaxis JavaScript, referencias, recursos publicables y construcción aprobados.
- Pruebas PostgreSQL 17.5/PGlite del módulo 3.2: configuración y aislamiento, catálogo por lotes con rollback, citas/conflictos y autorización, ajustes/ledger/avisos privados, retos/bono único y recompensas con tipo/condiciones/vencimiento.
- Pruebas del controlador: un campo llamado id no convierte el envío en navegación nativa; saldo final cero se trata como éxito; cierre de identidad invalida respuestas tardías.
- El HTTP local prueba permisos del adaptador, persistencia al reiniciar y canje repetido sin doble descuento.
- Construcción mediante scripts/pages-files.mjs; el adaptador local, migraciones, pruebas y documentos no forman parte del sitio publicable.

## Comprobación en navegador

Con identidades sintéticas del servidor aislado se comprobó:

1. Edición por giro en cuatro pasos, solicitudes de citas y configuración guardada.
2. Selección CSV, revisión de dos servicios y guardado del catálogo.
3. Selección PDF con texto, extracción aproximada y guardado de una fila revisada.
4. Logo PNG histórico usado como imagen de prueba: adaptación a WEBP, guardado y aparición en perfil/catálogo.
5. Creación de promoción del 15%, premio de servicio con condiciones y edición de catálogo.
6. Ajuste de 50 puntos con motivo, avance real de un reto y bono de 20 puntos concedido una sola vez.
7. Solicitud del cliente, creación/confirmación de citas por la Empresa y agenda con sus estados.
8. Bandeja privada y marca de lectura.
9. Harness sintético del navegador: siete formatos correctos (CSV, TSV, JSON, HTML, TXT, DOCX, PDF). Markdown comparte la ruta de texto; no se declara un ensayo documental independiente.
10. Foco verificado por DOM: legend al avanzar a pasos 2 y 4, botón de origen al cerrar/guardar editor, selector nativo tras cambiar fecha y control de mes tras redibujar calendario.

Los datos capturados son prueba local, no actividad comercial ni cuentas reales. El paquete no incluye esa base. El ejemplo de peluquería mostrado en capturas se creó/editó exclusivamente en este entorno aislado.

## Diseño y documentación

- Capturas inspeccionadas a 344, 390, 768, 1280 y 1440 px. Son capturas de viewport; fullPage no funcionó en el entorno.
- Calendario compacto nativo a <=420 px; sin desbordamiento del documento en los tamaños medidos.
- Revisión independiente: disposition ship limitada a los dos fixes puntuados: continuidad de foco y controles importados de 44 px, ambos resolved. No constituye auditoría completa de accesibilidad ni autorización de publicación.
- DESIGN.md y sidecar v2 actualizados por documenter; estructura/referencias y rampas nuevas comprobadas. Se conserva drift histórico fuera del alcance 3.2.
- Impeccable context/detect no ejecutados: motor 0.1.5 ausente y caché sin permiso de creación. Se siguieron referencias, revisión de capturas y revisión independiente; no se presenta un resultado automático inexistente.
- Guía HTML/Markdown con once secciones y seis tablas. Incluye matriz de funciones, roles, giros, procedimientos, formatos, límites y pendientes.

## Lo que esta evidencia no acredita

- Activación remota de studio_32 ni publicación de esta versión en la web o en tiendas.
- Correos entregados, notificaciones push, SMS/WhatsApp ni recordatorios de fondo.
- Pruebas físicas Android/iOS, auditoría WCAG completa, zoom y lectores de pantalla completos.
- Carga real, recuperación ante desastres, concurrencia PostgreSQL entre conexiones nativas independientes o auditoría de seguridad integral.
- Equipos multirrol, sucursales reales, OCR, POS/pagos, agenda recurrente, paginación completa o disponibilidad laboral automatizada.
- Compatibilidad universal con documentos arbitrarios. La extracción requiere revisión y respeta los límites indicados en la guía.

## Producción

El núcleo anterior loyalty_core ya se aplicó tras autorización explícita. La migración 3.2 sigue solo en archivos y entornos locales. No se reaplicó el núcleo, no se ejecutó la propuesta antigua, no se desactivó RLS ni confirmación de correo y no se crearon servicios facturables. Esta entrega no fue subida, integrada ni desplegada remotamente durante esta etapa.
