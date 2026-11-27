# Centro I.A. · entrega 3.4

Inicio local: node scripts/start-34.mjs (puerto4177). Guía y cuadro: docs/AMPLIACION-3.4.md. Pendientes técnicos separados; tareas del titular al final en docs/TAREAS-DEL-TITULAR-3.4.md.98pruebas aprobadas. Operations activado en Supabase; Growth local. Publicación se registra en ESTADO-DESARROLLO.md. Los cortes inferiores son históricos.

## Entrega actual 3.3 · 25 de noviembre

Guía: docs/GUIA-CENTRO-IA-3.3.md. Verificación: docs/VERIFICACION-3.3.md (89/89). Inicio local: node scripts/start-33.mjs, puerto4176. Studio está activado en Supabase; sedes/equipo/agenda avanzada siguen locales por confirmación vencida del conector. Nueva interfaz sin publicar. El historial inferior conserva estados anteriores.

# Centro I.A. 3.2

Aplicación de fidelidad con cuentas Usuario y Empresa, negocios por giro, catálogo importable, premios, promociones, retos, puntos, citas y avisos internos. Esta entrega incluye una prueba local persistente y el frontend conectado a Supabase.

Los módulos 3.2 funcionan en la prueba local. Su migración nueva no está aplicada a producción. No se publicó ni se integró esta entrega automáticamente en el servicio público.

## Abrir la prueba

Requiere Node.js >=22.13. En esta revisión se usó Node 24.22.1 y pnpm 11.25.0.

1. Instala: `npx --yes pnpm@11.25.0 install --frozen-lockfile --ignore-scripts`.
2. Inicia: `node scripts/start-32.mjs`.
3. Abre [Empresa](http://127.0.0.1:4175/workspace.html?as=company) o [Usuario](http://127.0.0.1:4175/workspace.html?as=user).
4. Comprueba la franja PRUEBA LOCAL. Crea el programa como Empresa y únete como Usuario usando su código.

Las identidades de prueba y la base se quedan en este equipo. La prueba no usa correos reales ni Supabase. Un programa nuevo comienza en privado.

## Guía y estado

- [Guía de funciones, cuadro Usuario/Empresa y procedimientos](docs/GUIA-CENTRO-IA-3.2.md).
- [Guía HTML legible e imprimible](docs/GUIA-CENTRO-IA-3.2.html).
- [Validación y límites de la entrega](docs/VERIFICACION-3.2.md).
- [Estado e historial](docs/ESTADO-DESARROLLO.md).
- [Núcleo de fidelidad](docs/FIDELIDAD.md).
- [Sistema de diseño](DESIGN.md).

La personalización de Organización no implementa todavía empleados multirrol ni sucursales con permisos. Los avisos son internos; no hay push ni SMTP operativo validado. Los PDF escaneados necesitan captura manual. Catálogo y promociones no procesan cobros.

## Comprobar y construir

`node scripts/verify.mjs` comprueba archivos, referencias, sintaxis, pruebas y construcción. La entrega pasó 80 pruebas.

`node scripts/build-pages.mjs` genera dist con la lista explícita scripts/pages-files.mjs. No publiques la carpeta completa del repositorio ni el adaptador de prueba local.

`node scripts/render-guide.mjs` actualiza la versión HTML de la guía Markdown.

`npm start` conserva la vista estática oficial del puerto4173; requiere Auth real para usar el espacio privado. La bienvenida del inicio es exclusiva de móviles y tablets. El script histórico server/index.mjs permanece separado.

## Base de datos

Perfiles y loyalty_core ya constan aplicados después de la autorización anterior del titular. La migración **20261117023910_studio_32.sql** está probada localmente y pendiente de revisión/activación remota. No ejecutes todos los SQL indiscriminadamente ni uses la propuesta antigua de onboarding para crear el núcleo.

La prueba usa PostgreSQL17.5/PGlite. Las pruebas en una conexión no certifican concurrencia nativa entre conexiones independientes.

El presupuesto autorizado permanece en $0MXN. No se activa Render ni se crea infraestructura de pago. La revisión adicional de correo y seguridad se reserva para la fase final solicitada; se mantienen las protecciones básicas existentes.
