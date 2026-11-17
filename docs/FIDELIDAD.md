# Fidelidad: programas, visitas y premios

## Estado de entrega

El interior nuevo está implementado para Usuario y Empresa. El recorrido completo funciona en la prueba local persistente con PostgreSQL 17.5/PGlite. **La migración no está aplicada a Supabase**: la revisión automática rechazó modificar el esquema de producción sin autorización explícita. La interfaz oficial informa el módulo pendiente y mantiene la cuenta accesible.

La propuesta antigua de onboarding de negocio permanece separada y sin activar. Este núcleo usa cia_clubs; no depende de las cinco tablas de aquella propuesta.

## Probar ahora

Con dependencias instaladas, ejecuta `npm run preview:loyalty` o `INICIAR-FIDELIDAD-LOCAL.bat`.

- Usuario: http://127.0.0.1:4174/workspace.html?as=user
- Empresa: http://127.0.0.1:4174/workspace.html?as=company

La franja PRUEBA LOCAL identifica siempre el entorno. No usa cuentas, tokens ni datos de Supabase. Crea dos identidades fixture etiquetadas; los negocios, visitas y canjes aparecen solo al operar. La base se guarda en work/.local-centro-fidelidad, fuera del repositorio y del paquete publicado. Recargar y reiniciar conserva el estado. El selector Usuario/Empresa pertenece exclusivamente a esta prueba.

El servidor escucha en 127.0.0.1, exige token efímero en la API, comprueba Origin/Host y solo ejecuta RPC de una lista explícita. Nunca lo uses como servidor público ni autenticación de producción.

## Recorrido

1. Empresa crea un negocio privado, con nombre, categoría, ciudad y puntos por visita.
2. Crea premios con coste en puntos y unidades opcionales. Puede pausarlos.
3. Comparte su código de 12 caracteres o publica explícitamente datos descriptivos en Explorar.
4. Usuario se une, aceptando compartir nombre y actividad de ese programa con el propietario.
5. Registra llegada y salida voluntariamente. Las horas provienen del servidor; no hay geolocalización ni detección automática.
6. El propietario confirma la visita física: solo entonces se añaden puntos, una vez.
7. El usuario confirma un canje. Una transacción descuenta puntos del negocio y aparta existencias.
8. El propietario entrega el premio y confirma la entrega. El comprobante conserva título y coste del momento del canje.

Una llegada cada 18 horas por usuario y negocio. Una visita abierta se recupera sin duplicar. Los puntos no se transfieren entre negocios ni tienen equivalencia monetaria.

## Datos y frontera de seguridad

La migración generada mediante CLI es `supabase/migrations/20261116220009_loyalty_core.sql`.

| Tabla | Contenido |
|---|---|
| cia_clubs | Programa, propietario, código privado y visibilidad voluntaria |
| cia_club_members | Membresía, saldo y visitas confirmadas |
| cia_visits | Llegada, salida, confirmación y puntos otorgados |
| cia_rewards | Premio, coste, existencias y disponibilidad |
| cia_redemptions | Solicitud idempotente, coste/título históricos y entrega |

RLS en todas las tablas; authenticated solo recibe SELECT filtrado. Las escrituras ocurren en diez RPC acotadas con identidad/tipo/propietario verificados, nombres calificados y search_path vacío. El helper queda en cia_private sin EXECUTE público. No se amplían los permisos de cia_profiles.

`cia_loyalty_snapshot` solo devuelve programas propios/unidos y actividad autorizada. Explorar expone datos descriptivos de programas publicados, sin código, propietario ni clientes. El propietario obtiene el nombre de clientes unidos, nunca su correo ni perfiles ajenos completos.

El bloqueo de membresía serializa saldo/visitas; el premio se bloquea para stock. El canje usa request_id único; repetir la misma solicitud devuelve el comprobante existente. La creación de premios también admite clave idempotente. Las mutaciones no tienen reintento automático.

## Evidencia y límites

La suite actual contiene 66 pruebas. Se ejecutan permisos, alteración de metadatos sin elevación, aislamiento, idempotencia, stock, entrega y rollback en PostgreSQL 17. La API local se prueba por HTTP, incluyendo solicitudes simultáneas y persistencia al reiniciar. PGlite serializa una conexión: esto no certifica contención en PostgreSQL nativo entre conexiones independientes.

Los controladores prueban respuestas tardías, cambio de identidad, XSS en datos, doble envío y módulo sin activar. El recorrido de los ocho pasos se realizó también con controles reales del navegador.

Capacidades deliberadamente pendientes: edición posterior de negocio/premio, sucursales múltiples, equipos, cancelaciones/reembolsos, baja de membresía, campañas/avisos, QR/cámara, geolocalización, reservas, paginación completa, métricas de cohortes y PWA. Snapshot acota resultados: 120 programas unidos, 60 en Explorar y 200 premios/visitas/canjes/clientes. Para volumen mayor se requiere paginación y priorizar actividad abierta; no declarar escalabilidad validada.

## Activación de producción

Requiere aprobación explícita del titular para aplicar la migración al proyecto huqspupbhhqilxeizklr. Antes de publicar: revisar la migración, probar JWT de Usuario y Empresa en entorno Supabase aislado y contención nativa, aplicar una sola vez con historial, comprobar RLS/grants/advisors sin crear fixtures en producción y validar el frontend. El PR queda en borrador; main y respaldo no cambian.

El advisor del proyecto señaló protección de contraseñas filtradas deshabilitada, preexistente. No se modificó Auth ni se activó un plan de pago.
