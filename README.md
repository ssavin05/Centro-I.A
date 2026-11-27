# Centro I.A. ·3.6 publicada para piloto

Aplicación:https://ssavin05.github.io/Centro-I.A/. Growth activado en Supabase como20261127030040. Guía:docs/GUIA-CENTRO-IA-3.6.md.108pruebas locales y contención PostgreSQL17.11; control del sitio45/45recursos y5rutas fuera de distribución404. Faltan URLs/correo privados, cuentas/JWT reales, piloto físico y autorización de respaldo real. La prueba local4178 sigue aislada y sintética. Los cortes inferiores son históricos.

# Centro I.A. · entrega3.5.1

Respaldo de fuente3.5 guardado en el PR1; CI y contención PostgreSQL17.11 comprobadas.106pruebas locales aprobadas. Guía:docs/GUIA-CENTRO-IA-3.5.1.md. Supabase Growth requiere autorización específica después del rechazo automático; sin publicación nueva. Inicio de Usuario:node scripts/review-35.mjs, puerto4178. Los cortes siguientes se conservan como historial.

# Centro I.A. · entrega 3.5

Experiencia personal de Usuario con azul noche, cielo y dorado, premio destacado, progreso por negocio, filtros, retos y actividad. Inicio de revisión: node scripts/review-35.mjs, http://127.0.0.1:4178/workspace.html?as=user. Datos sintéticos separados, PRUEBA LOCAL.

Guía: docs/GUIA-CENTRO-IA-3.5.md. Verificación: docs/VERIFICACION-3.5.md.104/104pruebas completas; ajuste final de foco verificado con8pruebas afectadas, sintaxis y build. Sin migraciones nuevas ni publicación3.5. Growth3.4 sigue pendiente de activación remota. ESTADO-DESARROLLO.md registra los límites; los cortes inferiores se conservan como historial.

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
