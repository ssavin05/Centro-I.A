# Product

<!-- impeccable:product-schema 1 -->

Registro de decisiones confirmadas para mantener Centro I.A. sin confundir su propósito con las funciones ya implementadas. El núcleo actual y sus límites están en [Fidelidad](docs/FIDELIDAD.md); [Estado del desarrollo](docs/ESTADO-DESARROLLO.md) conserva el contexto general.

## Platform

web

## Users

- **Usuario:** personas que buscan conectar con negocios, descubrir experiencias y participar en programas de visitas y premios cuando el módulo esté activado.
- **Empresa:** negocios que buscan construir relaciones con sus clientes mediante fidelización y experiencias.

Cada cuenta elige Usuario o Empresa al registrarse. El tipo queda fijo; no es una preferencia editable ni un permiso que el cliente pueda elevar.

## Product Purpose

Centro I.A., «Un motivo para volver», conecta negocios y personas mediante fidelización y experiencias. La dirección del producto es dar razones para regresar y fortalecer esas relaciones. No es un ERP.

La base permite crear una cuenta, acceder y mantener el perfil. El interior de fidelidad está implementado para ambos roles y su recorrido funciona en la prueba local persistente. La activación en Supabase sigue pendiente; implementación y prueba local no equivalen a disponibilidad comercial publicada.

## Operating Context

El repositorio es [ssavin05/Centro-I.A](https://github.com/ssavin05/Centro-I.A). El frontend oficial es estático, con HTML, CSS y ES Modules, y su destino es GitHub Pages. Supabase, proyecto `huqspupbhhqilxeizklr`, proporciona autenticación y persistencia de la cuenta oficial. PostgreSQL aplica las políticas de acceso; Pages no ejecuta el backend Node histórico.

Las rutas oficiales de esta etapa son `index.html`, `auth.html` y `workspace.html`. En el inicio, celulares y tablets presentan una bienvenida con acceso inmediato a **Crear cuenta** e **Iniciar sesión**. El escritorio conserva la portada completa. La referencia Leal corresponde a esa petición móvil; no reemplaza la identidad de Centro I.A.

La prueba local usa PostgreSQL 17.5/PGlite persistente en `127.0.0.1:4174`, dos identidades fixture y franja permanente **PRUEBA LOCAL**. No usa Supabase Auth, tokens ni datos de producción. El selector de roles pertenece solo a la prueba. La actividad se genera al operar y se conserva al recargar y reiniciar.

## Capabilities and Constraints

La implementación incluye bienvenida móvil/tablet, registro y acceso con Supabase, solicitud de recuperación, restablecimiento con sesión de recuperación verificada, consulta del perfil propio, edición del nombre, descarga local del perfil guardado y cierre de sesión. La portada incluye preguntas frecuentes nativas. Los formularios presentan carga y errores, bloquean envíos repetidos y conservan las entradas cuando una operación falla.

El tipo de cuenta se protege en `cia_profiles.account_type`; el nombre es el único campo de perfil editable por su titular. La autorización consulta la tabla protegida, no los metadatos modificables del cliente. Mantener RLS y permisos de columnas mínimos.

El interior implementado incluye navegación por rol, un negocio privado por Empresa, publicación descriptiva voluntaria en Explorar, código de adhesión, premios con coste y stock opcional, búsquedas, filtros, métricas derivadas de datos autorizados, visitas voluntarias y diálogo de canje. El recorrido local permite crear negocio/premio, unir Usuario, registrar llegada/salida, confirmar visita por Empresa, otorgar puntos, canjear y confirmar entrega. Los puntos pertenecen a cada negocio y no tienen equivalencia monetaria. Una llegada por usuario y negocio cada 18 horas; sin geolocalización pasiva. El canje descuenta saldo y aparta stock en una transacción; una clave idempotente evita duplicados.

La migración supabase/migrations/20261116220009_loyalty_core.sql prepara cinco tablas y diez RPC con RLS y escrituras acotadas. **No está aplicada en producción.** La revisión automática rechazó modificar ese esquema sin autorización explícita. La interfaz oficial mantiene accesible la cuenta e informa que el módulo está pendiente; nunca presenta la actividad local como producción.

Siguen pendientes edición posterior de negocio/premio, sucursales, equipos, cancelaciones/reembolsos, baja de membresía, campañas/avisos, QR/cámara, geolocalización, reservas, paginación completa y métricas de cohortes. El manifiesto no acredita una PWA operativa. El snapshot acota resultados: 120 programas unidos, 60 en Explorar y 200 premios/visitas/canjes/clientes; no hay escalabilidad validada para mayor volumen.

El presupuesto obligatorio de infraestructura y herramientas esenciales es **$0 MXN**. Conservar GitHub, GitHub Pages y Supabase existentes. No activar Render ni añadir servicios pagados. Mantener intacto el respaldo `archivo/version-fidelidad-2026-11-11`.

La separación entre frontend oficial y código histórico se documenta en [Arquitectura](docs/ARCHITECTURE.md). `scripts/pages-files.mjs` define explícitamente qué recursos se publican.

## Brand Commitments

- Nombre: **Centro I.A.**
- Lema: **Un motivo para volver**.
- Interfaz y mensajes en español natural, con acciones concretas y estados que describen el resultado confirmado.
- Paleta: dorado `#C99B4C` y luminoso `#EDC77D`, azul claro `#DCEBF4`, azul profundo `#173C50`, negro `#0D151B`, blanco y bases cálidas existentes. Su aplicación visual se registra en [DESIGN.md](DESIGN.md).
- Ondas y movimiento sutil con respeto a la preferencia de reducción de movimiento.
- Recurso heredado `assets/nexo-fondo-ondas.png` y símbolo vectorial `assets/icons/centro-ia.svg`. El nombre histórico del archivo de ondas no cambia el nombre del producto.

## Evidence on Hand

El código y las hojas activas registran la implementación. Las capturas de .impeccable/review/interior/ cubren Usuario y Empresa en escritorio, tablet y celular, además de premios y visitas. Las capturas anteriores conservan su alcance de inicio/acceso. Son evidencia visual, no resultados comerciales. La captura fullPage no funcionó en el navegador de esta sesión; las imágenes son de viewport.

La suite actual registra 66 pruebas. Incluye reglas/controladores y verificaciones de permisos, aislamiento, idempotencia, stock, entrega y rollback en PostgreSQL 17/PGlite. La API local se prueba por HTTP, con solicitudes simultáneas y persistencia al reiniciar. El recorrido de ocho pasos se realizó con controles reales del navegador. PGlite serializa una conexión; no certifica contención nativa entre conexiones independientes.

Los controladores comprueban respuestas tardías, cambio de identidad, escape de datos y doble envío. El acceso conserva pruebas con dobles de Supabase; no se ha completado un recorrido real por correo. Aceptar una recuperación no acredita entrega de correo. Falta validar JWT reales de ambos roles en un Supabase aislado, revisar/aplicar la migración con autorización y verificar RLS/grants antes de publicar. Este registro no declara integración en main ni publicación.

## Product Principles

- Conectar personas y negocios mediante relaciones duraderas; mantener ese propósito al añadir funciones.
- Mostrar datos reales, estados vacíos y límites de disponibilidad; no inventar saldos, negocios, reservas, estadísticas ni notificaciones.
- Confirmar el resultado de cada mutación antes de mostrar éxito; evitar envíos repetidos y reintentos automáticos de resultado incierto.
- Mantener el tipo de cuenta y los privilegios bajo control de la base de datos.
- Desarrollar dentro del presupuesto cero y conservar una base recuperable.

## Accessibility & Inclusion

Mantener foco visible, etiquetas de formulario, mensajes de error y estado accesibles, controles táctiles y adaptación a celular, tablet y escritorio. La bienvenida no impone una espera ni depende de JavaScript para sus enlaces. Respetar `prefers-reduced-motion`.

Las comprobaciones visuales registradas no equivalen a una auditoría completa de accesibilidad, pruebas físicas ni validación integral con zoom. No declarar conformidad WCAG sin evidencia.


La propuesta antigua de onboarding de negocios en `docs/NEGOCIOS-PROPUESTA.md` permanece separada y sin activar. No describe el núcleo actual basado en `cia_clubs`; su estado no invalida el recorrido local de fidelidad ni acredita activación de producción.
