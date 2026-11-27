# Verificación Centro I.A. 3.3

Corte: 25 de noviembre de 2026.

## Código

Verificación completa mediante node scripts/verify.mjs: 89 pruebas aprobadas, 0 fallos, 0 omitidas. Incluye sintaxis, recursos/imports, aislamiento de cuentas, idempotencia, visitas/puntos/canjes, creación/catálogo, promociones/retos y agenda. Se construyó dist con lista explícita de recursos. Registro completo en 3.3-verificacion-completa.txt, adjunto a la entrega.

La primera ejecución restringida obtuvo 87/89. Fallaron arranque del servidor histórico y PGlite persistente por restricciones locales. Repetidos con acceso necesario: 2/2 aprobadas; después la suite completa con ese acceso obtuvo 89/89. No se silenciaron ni omitieron pruebas.

## Regresiones nuevas

- Reproducido antes del arreglo: profesional que era cliente de un recurso ajeno podía completar su cita. La prueba falló por rechazo ausente.
- Corrección: visibilidad del cliente separada de privilegio operativo. Profesional cliente de otro responsable no confirma/completa esa cita; reprogramar como cliente queda requested. Puede cancelar su cita activa.
- Sedes pausadas no exponen recursos/horarios a clientes; disponibilidad rechazada.
- Citas mediante API anterior conservan sede principal. Horarios nulos rechazados sin borrar jornada.
- Nombre público de recurso de hasta 80 caracteres compatible con cita.

## Supabase real

Proyecto huqspupbhhqilxeizklr, PostgreSQL 17.11. Antes: dos perfiles, cero programas/visitas/canjes. Aplicada studio_32 versión 20261125154520. Archivo local alineado con historial remoto. Después: 14 tablas cia_* con RLS; 11 RPC Studio autorizadas solo para authenticated y search_path vacío; dos perfiles y cero programas preservados. cia_locations no existe: Operations 3.3 no se activó.

El conector devolvió status expired para Operations. No se usó execute_sql para eludir su confirmación. Las dos migraciones operations_33 y operations_33_hardening permanecen pendientes y deben tratarse juntas. No se crearon fixtures, enviaron correos ni activaron servicios de pago.

Advisor previo: RPC SECURITY DEFINER intencionadas y protección de contraseñas filtradas desactivada preexistente. No equivale a auditoría de seguridad completa. No se modificó Auth/SMTP.

## Navegador y diseño

- Prueba aislada http://127.0.0.1:4176, PRUEBA LOCAL permanente.
- Guardar horarios confirmado con aviso, cierre del formulario y foco en Horarios.
- Profesional conserva cuenta Usuario y muestra Mi trabajo; sin pestañas de propietario.
- Cliente móvil accede desde Más → Reservar.
- Capturas nuevas válidas: desktop-resources.jpg (1440×1000), tablet-professional.jpg (768×1024), mobile-agenda.jpg (390×844). Son viewport, no full-page.
- Revisor independiente: disposición ship limitada a esas vistas. Metadatos del recurso separados y recapturados. No certifica todos los formularios, teclado completo, WCAG ni producción.
- Contexto/detector Impeccable no ejecutables por caché restringida; referencias locales y revisión independiente utilizadas.

## Límites

PGlite 17.5 serializa una conexión; no certifica concurrencia nativa multi-conexión. No hubo recorrido con JWT reales de todos los roles, pruebas físicas, escala, correos/push ni publicación en Pages/main. Revisar guía para pendientes.

## Recuperación y paquete

Cia.IA.3.2.zip se conserva. Respaldo previo de archivos Operations: Cia.IA.3.3-respaldo-antes-activacion.zip fuera del repositorio. Cia.IA.3.3.zip contiene código editable, frontend construido, guía, capturas y SHA256SUMS; se verifica cada entrada tras descomprimir en memoria. Sin dependencias instaladas, bases de datos, sesiones ni secretos.
