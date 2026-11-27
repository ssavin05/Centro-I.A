# Centro I.A. 3.6 — aplicación web conectada

Abre https://ssavin05.github.io/Centro-I.A/ desde un dispositivo con Internet. Esta entrega publica la aplicación para un piloto conectado. La prueba local de4178 se conserva como entorno sintético separado.

## Qué está terminado

| Parte | Estado comprobado |
|---|---|
| Web pública | PR1 integrado. GitHub Pages sirve los recursos del manifiesto; cinco rutas fuera de distribución responden404. |
| Base de datos | Núcleo, Studio, Operations y Growth activados. Growth tiene versión20261127030040;22tablas con RLS y seis RPC nuevas solo para authenticated. |
| Usuario | Negocios, puntos separados, premios/avance, visitas, canjes, niveles, retos, promociones, citas, avisos internos e historial. |
| Empresa | Programa por giro/logo, catálogo/importación, premios, promociones, retos, clientes/puntos, sedes, equipo y agenda. |
| Recuperación operativa | Devolución de canjes pendientes con motivo y una sola restitución; participación reversible sin borrar saldos. |
| Pruebas | 108 pruebas locales. Contención nativa PostgreSQL 17.11 de última unidad, clave simultánea y entrega/devolución. |
| Restauración | Procedimiento probado con datos sintéticos, conserva filas y ledger sin volver a generar puntos; destino PGlite 17 en memoria. |
| Control del sitio | scripts/verify-live.mjs compara45recursos por SHA256 y verifica404 en cinco rutas. Workflow de control posterior a despliegue preparado. |

Consulta GUIA-CENTRO-IA-3.5.md para el inicio personal y GUIA-CENTRO-IA-3.4.md para el cuadro completo de funciones. No se agregaron negocios ficticios en producción:se conservaron2perfiles y0programas.

## Empezar el piloto

1. Abre la dirección pública y usa Crear cuenta o Iniciar sesión. El registro por correo está habilitado y exige confirmación.
2. Desde una cuenta Empresa crea el negocio real, su catálogo y al menos un premio con condiciones y existencias.
3. Invita a una cuenta Usuario con el código del negocio. Al unirse comparte su nombre y visitas con ese negocio.
4. Como Usuario registra una llegada voluntaria. Como Empresa confirma la visita; comprueba los puntos en la cuenta Usuario.
5. Solicita un premio con puntos suficientes. Comprueba el comprobante y confirma la entrega como Empresa.
6. Repite en un celular físico y verifica el retorno después de cerrar sesión.

El acceso protegido sin sesión dirige a auth.html?mode=login. No se usaron contraseñas del titular, no se enviaron correos de prueba y no se afirma que ese recorrido autenticado real ya esté comprobado.

## Publicación y mantenimiento

La configuración actual de Pages publica desde la rama. _config.yml se deriva del manifiesto mediante node scripts/pages-filter.mjs --write. verify exige que el filtro esté actualizado. La raíz no tiene .nojekyll para que se apliquen las exclusiones; dist conserva su .nojekyll. Los directorios excluidos llevan barra final para no ocultar supabase-client.js por coincidencia de prefijo.

El workflow de distribución verifica y conserva dist; el workflow administrado de Pages realiza el despliegue. El intento inicial con deploy-pages no encontró su artefacto recién subido; se sustituyó ese circuito por el modo de publicación de rama ya configurado. El control HTTP detectó y resolvió publicación de archivos ajenos al manifiesto y la coincidencia de supabase-client.js.

Puedes ejecutar node scripts/verify-live.mjs https://ssavin05.github.io/Centro-I.A/ reporte.json para repetir el control. El resultado correcto es45/45y cinco rutas404. Comprueba también GitHub Actions. Esto no es monitoreo de errores privados, carga ni entregabilidad de correo.

## Respaldo y restauración

scripts/verify-backup.mjs verifica un respaldo de datos de aplicación en una base nueva en memoria, sin red. Exige formato/proyecto, respeta referencias y compara todas las filas. Solo en ese destino efímero se suprimen triggers de aplicación para no duplicar efectos; los triggers internos de claves foráneas permanecen activos. No toca Supabase.

La exportación de producción no se ejecutó:la revisión automática la rechazó porque puede incluir datos personales de las22tablas y exige autorización específica de payload/destino. La solicitud propone un archivo local cifrado en work/.private-centro-backups, fuera de GitHub y del ZIP. No se usó otra vía para exportar. Mientras falte esa autorización, solo está comprobada la restauración sintética. Este procedimiento no respalda contraseñas, sesiones, identidades de proveedores ni Storage de Supabase Auth.

## Correo y recuperación

La API pública confirma registro por correo habilitado y confirmación obligatoria. El panel privado solicita iniciar sesión:el conector no expone las URLs de acceso y recuperación. Falta revisar Site URL y las redirecciones de confirmación/restablecimiento para esta dirección pública, el remitente/SMTP y la entrega real. No se desactiva la confirmación para eludir esta comprobación.

Los avisos internos funcionan; push, SMS, correo de campañas y recordatorios externos siguen pendientes de configuración e implementación adicional. La instalación web está preparada; hace falta validación física de permisos y navegadores.

## Al final: lo que requiere tu participación

Inicia sesión en el panel de Supabase que se dejó preparado y devuelve el control para revisar las URLs privadas. Responde la solicitud del respaldo si deseas exportar datos reales. Aporta negocio/logo/catálogo/condiciones reales y participa en el piloto con cuentas propias y celular. No compartas contraseñas en el chat.

Quedan pruebas reales con JWT, entregabilidad, instalación física, revisión adicional de abuso/permisos, carga y restauración de producción. Esta entrega no se presenta como lanzamiento comercial completamente validado.
