# Product

<!-- impeccable:product-schema 1 -->

Registro de decisiones confirmadas para mantener Centro I.A. sin confundir su propósito con las funciones ya implementadas. El estado de entrega y las validaciones pendientes se mantienen en [Estado del desarrollo](docs/ESTADO-DESARROLLO.md).

## Platform

web

## Users

- **Usuario:** personas que buscan conectar con negocios, descubrir experiencias y participar en futuras propuestas de fidelización.
- **Empresa:** negocios que buscan construir relaciones con sus clientes mediante fidelización y experiencias.

Cada cuenta elige Usuario o Empresa al registrarse. El tipo queda fijo; no es una preferencia editable ni un permiso que el cliente pueda elevar.

## Product Purpose

Centro I.A., «Un motivo para volver», conecta negocios y personas mediante fidelización y experiencias. La dirección del producto es dar razones para regresar y fortalecer esas relaciones. No es un ERP.

La base implementada permite crear una cuenta, acceder y mantener un perfil propio. Esa base no implica que las funciones comerciales del propósito estén disponibles.

## Operating Context

El repositorio es [ssavin05/Centro-I.A](https://github.com/ssavin05/Centro-I.A). El frontend oficial es estático, con HTML, CSS y ES Modules, y su destino es GitHub Pages. Supabase, proyecto `huqspupbhhqilxeizklr`, proporciona autenticación y persistencia. PostgreSQL aplica las políticas de acceso; Pages no ejecuta el backend Node histórico.

Las rutas oficiales de esta etapa son `index.html`, `auth.html` y `workspace.html`. En el inicio, celulares y tablets presentan una bienvenida con acceso inmediato a **Crear cuenta** e **Iniciar sesión**. El escritorio conserva la portada completa. La referencia Leal corresponde a esa petición móvil; no reemplaza la identidad de Centro I.A.

## Capabilities and Constraints

La implementación incluye bienvenida móvil/tablet, registro y acceso con Supabase, solicitud de recuperación, restablecimiento con sesión de recuperación verificada, consulta del perfil propio, edición del nombre y cierre de sesión. Los formularios presentan carga y errores, bloquean envíos repetidos y conservan las entradas cuando una operación falla.

El tipo de cuenta se protege en `cia_profiles.account_type`; el nombre es el único campo de perfil editable por su titular. La autorización consulta la tabla protegida, no los metadatos modificables del cliente. Mantener RLS y permisos de columnas mínimos.

Negocios, puntos, canjes, reservas, equipos, campañas y estadísticas de actividad real son trabajo pendiente. El manifiesto existente no acredita una PWA operativa. No presentar estos flujos como completados ni poblarlos con información ficticia.

El presupuesto obligatorio de infraestructura y herramientas esenciales es **$0 MXN**. Conservar GitHub, GitHub Pages y Supabase existentes. No activar Render ni añadir servicios pagados. Mantener intacto el respaldo `archivo/version-fidelidad-2026-11-11`.

La separación entre frontend oficial y código histórico se documenta en [Arquitectura](docs/ARCHITECTURE.md). `scripts/pages-files.mjs` define explícitamente qué recursos se publican.

## Brand Commitments

- Nombre: **Centro I.A.**
- Lema: **Un motivo para volver**.
- Interfaz y mensajes en español natural, con acciones concretas y estados que describen el resultado confirmado.
- Paleta vinculante: dorado `#C99B4C`, azul `#DCEBF4`, azul profundo `#173C50`, crema `#F8F5ED` y blanco cálido `#FFFDFA`. Su aplicación visual se registra en [DESIGN.md](DESIGN.md).
- Ondas y movimiento sutil con respeto a la preferencia de reducción de movimiento.
- Recurso heredado `assets/nexo-fondo-ondas.png` y símbolo vectorial `assets/icons/centro-ia.svg`. El nombre histórico del archivo de ondas no cambia el nombre del producto.

## Evidence on Hand

El código de las rutas oficiales, las hojas de estilo activas y las capturas `.impeccable/review/mobile.jpg`, `tablet.jpg`, `desktop.jpg` y `auth-desktop.jpg` acreditan el sistema visual registrado. No son testimonios ni resultados de uso comercial.

La verificación registrada aprueba 33 pruebas y el build de Pages. Las pruebas de controladores usan dobles de Supabase. No se ha completado un recorrido real por correo ni el aislamiento entre dos cuentas de prueba. La aceptación de una solicitud de recuperación no acredita entrega de correo. Esta documentación no declara integración en main ni publicación de la etapa.

## Product Principles

- Conectar personas y negocios mediante relaciones duraderas; mantener ese propósito al añadir funciones.
- Mostrar datos reales, estados vacíos y límites de disponibilidad; no inventar saldos, negocios, reservas, estadísticas ni notificaciones.
- Confirmar el resultado de cada mutación antes de mostrar éxito; evitar envíos repetidos y reintentos automáticos de resultado incierto.
- Mantener el tipo de cuenta y los privilegios bajo control de la base de datos.
- Desarrollar dentro del presupuesto cero y conservar una base recuperable.

## Accessibility & Inclusion

Mantener foco visible, etiquetas de formulario, mensajes de error y estado accesibles, controles táctiles y adaptación a celular, tablet y escritorio. La bienvenida no impone una espera ni depende de JavaScript para sus enlaces. Respetar `prefers-reduced-motion`.

Las comprobaciones visuales registradas no equivalen a una auditoría completa de accesibilidad, pruebas físicas ni validación integral con zoom. No declarar conformidad WCAG sin evidencia.

