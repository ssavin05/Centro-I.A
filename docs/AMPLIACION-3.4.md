# Centro I.A. 3.4 — Actividad, recuperación y uso diario

Esta guía explica cómo usar la ampliación 3.4 y distingue lo implementado de lo activado. Complementa la guía completa 3.3, cuyos estados históricos quedan sustituidos por esta entrega.

## Estado de la entrega

El núcleo, Studio y Operations 3.3 están activados en Supabase. La activación de Operations incluyó su corrección de permisos en una sola transacción, versión `20261125201303`. Se comprobaron 21 tablas con RLS y 13 RPC de operaciones exclusivas de authenticated, con search_path vacío. Se conservaron dos perfiles y cero programas; no se crearon fixtures de producción.

La ampliación de datos 3.4 está implementada y probada localmente. Su migración `20261125201344_growth_34.sql` permanece pendiente de activación remota. Las funciones de esa ampliación muestran su estado cuando la base todavía no las ofrece. La publicación del frontend se registra en ESTADO-DESARROLLO.md; un ZIP o PR no acredita por sí mismo un despliegue.

## Abrir la aplicación local

1. Extrae todo el ZIP y comprueba Node.js 22.13 o posterior.
2. Ejecuta INSTALAR-DEPENDENCIAS.bat si faltan las dependencias fijadas. La primera instalación necesita Internet.
3. Ejecuta INICIAR-Cia.IA.3.4.bat y conserva abierta la ventana.
4. Abre http://127.0.0.1:4177/workspace.html?as=company o cambia a Usuario desde Vista de prueba.
5. Comprueba PRUEBA LOCAL. No representa Supabase Auth ni utiliza cuentas reales.

El inicio normal conserva los datos de prueba del equipo. Para una revisión con ejemplos explícitos usa `node scripts/review-34.mjs`: crea una base separada `.local-centro-34`, fuera del repositorio, y datos sintéticos. No ejecutes dos servidores sobre la misma carpeta de datos. Ctrl+C detiene el servidor.

## Cuadro de ampliaciones

| Función | Usuario | Empresa | Alcance |
|---|---|---|---|
| Historial por páginas | Registros propios/autorizados | Registros de su programa | Visitas, canjes, puntos, catálogo, citas, avisos; clientes solo propietario |
| Buscar registros | Por negocio y texto | Igual | Consulta del servidor, 50 filas por página |
| Exportar CSV | Búsqueda autorizada | Búsqueda autorizada | Recorre páginas; protección frente a fórmulas de hoja de cálculo |
| Devolver un canje | Ve devolución y movimiento | Cancela un premio pendiente con motivo | Una sola devolución, sin cambiar premios entregados |
| Salir del programa | Pausa su participación | Conserva el registro histórico | Mantiene puntos e historial; bloquea si hay pendientes |
| Volver a participar | Reactiva su participación | Conserva la relación histórica | No crea otro saldo ni duplica membresía |
| Avisos promocionales | Elige recibir campañas internas | Misma preferencia para su cuenta | Desactivado por defecto; no activa envíos externos |
| Retorno de clientes | Sin acceso a métricas empresariales | Consulta últimos 30 días | Cálculo sobre registros del programa completo |
| Descargar cita | Archivo ICS de cita autorizada | Igual | Importación manual a calendario; sin sincronización continua |
| Actualización periódica | Lectura cuando la pestaña está visible | Igual | Cada 60 segundos, suspendida con formularios visibles o exportación |
| Preparación de instalación | Ayuda e instalación si el navegador la ofrece | Igual | Requiere entorno publicado compatible; prueba física pendiente |
| Pantalla sin conexión | Explica límites y recuperación | Igual | Sin caché de cuentas/RPC ni cola de escrituras |

## Consultar y descargar actividad

1. Abre Actividad y datos. En celular está dentro de Más; también existe un acceso desde Mi cuenta.
2. Selecciona Historial y el tipo de registro.
3. Elige negocio y texto de búsqueda; pulsa Buscar.
4. Usa Anterior y Siguiente. El cursor mantiene el orden de fechas iguales sin repetir filas.
5. Pulsa Descargar búsqueda completa en CSV para recorrer los registros que coinciden. Puedes detener la preparación.
6. Comprueba el aviso de cantidad descargada y abre el archivo.

La descarga permite hasta 50.000 filas por búsqueda para limitar memoria. Al superar ese tamaño se detiene y no entrega un archivo incompleto como si fuera completo. Filtra por negocio o prepara una exportación administrativa. Las vistas principales siguen siendo resúmenes acotados; el historial añade acceso paginado. No se declara paginación integral de todos los editores ni escala masiva validada.

El CSV incluye campos autorizados y referencias de registro, nunca sesiones o tokens de Auth. Los valores que parecen fórmulas se protegen para evitar su ejecución al abrir una hoja. Las fechas del historial usan la zona del dispositivo.

## Cancelar un premio pendiente y devolver puntos

1. Como propietario abre Historial → Canjes y pulsa Buscar.
2. Elige Devolver puntos junto al canje pendiente.
3. Revisa premio, cliente y puntos. Escribe un motivo de 3 a 250 caracteres.
4. Pulsa Cancelar canje y devolver puntos.
5. Comprueba estado Cancelado, movimiento de devolución y aviso del cliente.

La operación bloquea los registros necesarios y devuelve el saldo una sola vez, incluso si se repite la solicitud. Un premio entregado no admite este flujo. El canje cancelado no puede marcarse entregado después.

Las unidades reservadas con esta versión se restituyen cuando el premio conserva stock limitado. Los canjes anteriores no tienen una marca fiable de reserva: revisa esas existencias manualmente. No se reconstruye inventario histórico mediante suposiciones. El flujo no procesa dinero, pagos ni devoluciones de caja.

## Pausar o reactivar participación

1. Como Usuario abre Actividad y datos → Mis programas.
2. Pulsa Salir del programa y revisa qué se conserva.
3. Confirma la salida. Si hay llegada abierta, canje pendiente o próxima cita activa, resuélvelos primero.
4. Comprueba Participación pausada. Tus puntos e historial permanecen.
5. Pulsa Volver a participar cuando desees reactivarla; también puedes unirte de nuevo con el código del negocio.

Salir no elimina datos ni la cuenta. Mientras la participación está pausada, los nuevos registros de visita, canje, cita y bono se rechazan en el servidor. Los pendientes anteriores y el historial permanecen bajo sus permisos originales. La baja definitiva de cuenta y las políticas de conservación necesitan un procedimiento separado.

## Interpretar indicadores

El propietario consulta miembros activos, visitas confirmadas, visitantes únicos, personas con dos o más visitas en los últimos 30 días, canjes sin cancelar y clientes sin volver en 30 días. La tabla diaria agrupa por UTC y lo indica expresamente. Los datos proceden del programa completo, no del lote visible del panel.

Estos indicadores no son aún un análisis completo de cohortes, ingresos o efectividad de campañas. Los valores de PRUEBA LOCAL proceden de fixtures identificados; no son resultados comerciales.

## Calendario e instalación

En Historial → Citas, Descargar cita genera un archivo ICS con inicio/fin en UTC y estado. Impórtalo en el calendario del dispositivo. Un archivo descargado no se actualiza cuando cambia la cita: vuelve a descargarlo si se reprograma. No existe conexión bidireccional con Google Calendar.

Mi cuenta incluye ayuda para añadir la web a la pantalla de inicio. El botón de instalación aparece cuando el navegador ofrece esa capacidad. La prueba local aislada no registra el service worker. El entorno publicado necesita HTTPS y verificación en navegadores/dispositivos reales.

El service worker solo guarda recursos públicos expresamente enumerados. No intercepta Supabase, escrituras, perfiles ni respuestas privadas. Cuando falla una navegación muestra offline.html; no conserva una copia de la cuenta ni reenvía operaciones al reconectar. Ante un resultado incierto, consulta el estado antes de repetir el envío.

## Comprobaciones y límites

La suite completa aprobó 98 pruebas: PostgreSQL aislado, rollback/idempotencia, privacidad, cursores, CSV/ICS, respuestas tardías y worker sin caché privada, además de las pruebas anteriores. Build, sintaxis e imports correctos. Se comprobaron devolución, motivo, foco, rechazo de salida con cita pendiente y descarga desde controles reales del navegador.

PGlite 17.5 serializa una conexión; falta la prueba de contención en conexiones PostgreSQL nativas independientes. También faltan JWT reales de todos los roles, correo operativo, dispositivos físicos, accesibilidad integral y pruebas de escala. El detector Impeccable no está disponible por caché restringida; la revisión independiente se limita a la evidencia que recibe.

Los trabajos que continúan en desarrollo están en PENDIENTES-TECNICOS-3.4.md. Las decisiones que necesitan al titular están reunidas al final, en TAREAS-DEL-TITULAR-3.4.md.
