# Reglas permanentes de Centro I.A.

Estas reglas orientan el desarrollo de la aplicación oficial. Consulta `docs/ESTADO-DESARROLLO.md` antes de continuar una etapa.

## Producto e identidad

- Centro I.A., «Un motivo para volver», conecta negocios y personas mediante fidelización y experiencias. No convertirlo en un ERP.
- Interfaz y mensajes en español natural. Paleta: `#C99B4C`, `#DCEBF4`, `#173C50`, `#F8F5ED`, `#FFFDFA`.
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
- Ejecutar `npm run verify`: comprobaciones de archivos, imports, sintaxis, pruebas y build de Pages. Las pruebas antiguas válidas se conservan.
- Probar móvil/tablet/escritorio, errores, carga, vacío, teclado y operaciones repetidas. Distinguir dobles de prueba de integración con Supabase real.
- Migraciones versionadas y no destructivas; inspeccionar tablas/políticas y documentación actual de Supabase antes de cambiar el esquema.
- Mantener intacta `archivo/version-fidelidad-2026-11-11`.
- Usar commits rastreables y PR; revisar cambios ajenos antes de integrar. No publicar cambios de alto riesgo sin autorización.
- Una rama o PR no equivale a publicación. Declarar límites y pendientes en `docs/ESTADO-DESARROLLO.md` después de cada etapa.
