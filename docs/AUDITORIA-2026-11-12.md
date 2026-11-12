# Auditoría de la aplicación oficial

Esta auditoría sirve para priorizar la primera implementación sobre `main` en `5fdf675`. No certifica que el producto completo esté listo para usuarios reales.

## Alcance y evidencia

Se inventariaron los 98 archivos del repositorio, con SHA y tamaño en `INVENTARIO-AUDITORIA.json`. Se clasificaron HTML, CSS, JavaScript, SQL, configuración, workflows, pruebas y recursos. La revisión manual se centró en los tres puntos de entrada publicados, Auth, perfiles/RLS, empaquetado y el backend histórico. El inventario y los análisis estáticos del código histórico no equivalen a una auditoría línea por línea de todos sus módulos.

GitHub Pages publica únicamente los archivos permitidos por el builder; la demo y Node/SQLite son implementaciones anteriores. Las 10 pruebas originales incluían comprobaciones por regex y una prueba integrada contra SQLite. No había pruebas de comportamiento de la autenticación oficial.

El proyecto Supabase estaba saludable y contenía únicamente `public.cia_profiles`, con RLS y sin datos al inspeccionarlo. Se consultaron tablas, columnas, políticas, grants, triggers, funciones privadas y migraciones. Las políticas no autorizan mediante metadata editable; solo el trigger de registro lee la elección inicial. El trigger es SECURITY DEFINER con search_path vacío, en esquema privado y sin EXECUTE para los roles del cliente.

## Hallazgos por gravedad

| Prioridad | Evidencia inicial | Impacto | Resultado de esta etapa |
|---|---|---|---|
| P0 producto | No hay tablas Supabase para negocios, miembros, puntos o reservas | Los módulos comerciales no pueden operar ni considerarse terminados | Registrado; se mantiene fuera de la oferta funcional. |
| P1 | `auth.js` solo maneja register/login y redirige cualquier sesión al panel | No existe recuperación y el redirect impediría el restablecimiento | Flujos recover/reset añadidos con guardas y pruebas; correo real pendiente. |
| P1 | Submit solo deshabilita un botón, sin guarda de estado | Eventos repetidos pueden duplicar peticiones | Guarda `busy`, bloqueo inicial y pruebas de doble envío. |
| P1 | UI expone mensajes arbitrarios de error del proveedor | Confusión y posible divulgación de detalles técnicos | Mapeo controlado de errores, sin reflejar HTML ni mensajes internos. |
| P1 | `tests/api.test.mjs` usa `URL.pathname` como ruta Windows | La suite falla antes de comprobar el servidor | `fileURLToPath`; limpieza de proceso y archivos compatible con Windows. |
| P1 histórico | Backend histórico omite `supabase-client.js` de su allowlist | Si se abre desde ese servidor, el acceso oficial no carga | Se conserva como histórico sin modificaciones; la vista previa oficial usa un servidor estático propio. |
| P1 | No existe edición de perfil pese a grants de UPDATE(name) | El usuario no puede corregir su nombre | Formulario real, solo nombre, select de confirmación y prueba de recarga con doble persistente. |
| P1 futura | `updated_at` no tiene trigger de actualización | No refleja ediciones posteriores | Documentado; no se usa como fecha fiable. Migración pendiente. |
| P1 despliegue | No se comprobaron SMTP, URLs y correo extremo a extremo | Registro público/recuperación podrían fallar externamente | Dependencia explícita; no se promete entrega. |
| P2 | CSS de Auth inline y duplicado con reglas antiguas de `site.css` | Inconsistencia y cascada difícil de mantener | Auth aislado en hoja limpia; tokens compartidos. CSS histórico restante no eliminado sin cobertura. |
| P2 | Más de 200 `!important` en CSS de demo y múltiples versiones de app | Riesgo si se reutiliza la demo como producto | Aislado del paquete; no restaurar esas capas. |
| P2 | Icono heredado morado fuera de paleta | Marca incoherente en pantalla de acceso | SVG oficial dorado; recursos históricos conservados. |
| P2 | No hay bienvenida móvil como la solicitada por el usuario | Entrada poco adaptada a celular/tablet | Pantalla completa responsive, CTA inmediatos, medidas de overflow y capturas. |
| P2 | SDK CDN y solicitudes sin límite explícito de espera | Pantalla bloqueada ante fallo de conexión | Timeout de 15 segundos, error visible, sin reintentos de mutaciones. |
| P2 | Documentación de prototipo describe una arquitectura anterior | Puede inducir a publicar Node/SQLite o recursos con costo | README/AGENTS/arquitectura y seguimiento oficial distinguen los sistemas. |

## Revisión visual y accesibilidad

La bienvenida usa marca, tipografía del producto y ondas existentes. Los CTAs tienen 56px mínimos, contraste oscuro sobre dorado y foco visible. Se verificó la ausencia de desbordamiento y la visibilidad de ambos CTAs a 320, 375, 390, 768 y 1024px. En escritorio se conserva la composición anterior.

Auth usa labels, errores anunciados, `aria-invalid`, foco al campo inválido, controles mostrar/ocultar con nombre actualizado y campos de 46px. Las pantallas permiten desplazamiento vertical natural cuando hace falta. Movimiento reducido conserva todo el contenido.

No se asigna una puntuación WCAG ni un porcentaje de mejora de rendimiento: faltan mediciones completas. Impeccable CLI no ejecutó el detector porque el engine no estaba instalado y su descarga estaba restringida. Sus referencias se aplicaron directamente. La revisión final independiente emitió **ship** para las capturas y controladores de esta etapa, con límites explícitos de integración real.

## Seguridad y presupuesto

No se encontraron claves secretas en el cliente inspeccionado. Se conserva la clave publishable existente y RLS. La prueba de catálogo de permisos pasó sin modificar datos. Las pruebas de aislamiento entre cuentas reales quedan pendientes de un entorno aislado.

La revisión automática bloqueó inicialmente un lote de copia que incluía `render.yaml`, una configuración histórica que declara un servicio y disco de pago. Ese archivo se inspeccionó por el conector y se dejó intacto en GitHub; no forma parte de la copia editable ni de Pages. No se activó Render ni otro recurso facturable.

## Orden de continuación

1. Comprobar Auth/correo/redirects con cuentas de prueba aisladas y revisar este PR.
2. Definir negocios, membresías y sucursales con RLS y pruebas antes del onboarding.
3. Implementar fidelización y canjes atómicos por negocio.
4. Implementar disponibilidad y reservaciones con concurrencia y zona horaria.
5. Añadir gestión, notificaciones y métricas derivadas de actividad real.
