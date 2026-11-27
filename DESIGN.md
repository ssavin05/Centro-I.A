---
name: Centro I.A.
description: Un motivo para volver
colors:
  gold: "#c99b4c"
  blue: "#dcebf4"
  deep: "#173c50"
  cream: "#f8f5ed"
  paper: "#fffdfa"
  muted: "#446477"
  error: "#a02e38"
  success: "#226044"
  focus: "#347da0"
  emphasis-gold: "#e9c788"
  black: "#0d151b"
  white: "#ffffff"
  gold-bright: "#edc77d"
  blue-mid: "#8cbed8"
  workspace-bg: "#f4f7f9"
  workspace-border: "#dbe6ed"
  error-surface: "#fff0ec"
  error-text: "#8f2b34"
  confirmed-surface: "#e3efe9"
  studio-deep: "#102a43"
  studio-accent: "#edc77d"
  studio-soft: "#e1eef7"
  studio-bg: "#eef4f9"
  studio-border: "#cbdce9"
  ocean-deep: "#123e5b"
  ocean-accent: "#e9c788"
  ocean-soft: "#dceefa"
  sky-deep: "#244d6a"
  sky-soft: "#edf6fc"
  gold-deep: "#142f46"
  gold-accent: "#d9af63"
  gold-soft: "#f8f1e5"
typography:
  body:
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif'
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  body-auth:
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif'
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif'
    fontSize: "14px"
    fontWeight: 700
  action-auth:
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif'
    fontSize: "15px"
    fontWeight: 700
  body-workspace:
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif'
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  shared: "12px"
  field: "9px"
  button-site: "13px"
  shell-auth: "16px"
  card-site: "20px"
  pill: "30px"
  workspace-field: "7px"
  workspace-nav: "10px"
  workspace-ticket: "14px"
  workspace-state: "5px"
spacing:
  space-1: "4px"
  space-2: "8px"
  space-3: "12px"
  space-4: "16px"
  space-6: "24px"
  space-8: "32px"
components:
  button-primary:
    backgroundColor: "{colors.deep}"
    textColor: "#fff"
    rounded: "{rounded.button-site}"
    padding: "14px 24px"
  button-outline:
    backgroundColor: "rgba(255,255,255,.65)"
    textColor: "{colors.deep}"
    rounded: "{rounded.button-site}"
    padding: "14px 24px"
  button-hero-primary:
    backgroundColor: "{colors.gold-bright}"
    textColor: "{colors.black}"
    rounded: "{rounded.button-site}"
    padding: "14px 24px"
  button-hero-outline:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.button-site}"
    padding: "14px 24px"
  button-auth:
    backgroundColor: "{colors.deep}"
    textColor: "{colors.paper}"
    typography: "{typography.action-auth}"
    rounded: "{rounded.shared}"
    padding: "12px 18px"
  button-welcome-create:
    backgroundColor: "#e5bc74"
    textColor: "{colors.deep}"
    rounded: "{rounded.shared}"
    padding: "15px 20px"
  button-welcome-login:
    backgroundColor: "rgba(16,47,66,.7)"
    textColor: "{colors.paper}"
    rounded: "{rounded.shared}"
    padding: "15px 20px"
  field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.deep}"
    rounded: "{rounded.field}"
    padding: "10px 12px"
    height: "46px"
  navigation-auth:
    backgroundColor: "#eaf2f5"
    textColor: "{colors.muted}"
    rounded: "{rounded.shared}"
    padding: "4px"
  account-pill:
    backgroundColor: "#284e62"
    textColor: "#e6f1f7"
    rounded: "6px"
    padding: "7px 10px"
  account-option:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.deep}"
    rounded: "{rounded.shared}"
    padding: "10px"
  button-workspace:
    backgroundColor: "{colors.deep}"
    textColor: "{colors.white}"
    rounded: "{rounded.field}"
    padding: "11px 16px"
  button-workspace-outline:
    backgroundColor: "{colors.white}"
    textColor: "{colors.deep}"
    rounded: "{rounded.field}"
    padding: "11px 16px"
  button-ticket:
    backgroundColor: "{colors.gold-bright}"
    textColor: "{colors.black}"
    rounded: "{rounded.field}"
    padding: "11px 16px"
  navigation-workspace:
    backgroundColor: "{colors.deep}"
    textColor: "{colors.blue}"
    rounded: "{rounded.workspace-nav}"
    padding: "12px 16px"
  navigation-workspace-active:
    backgroundColor: "{colors.gold-bright}"
    textColor: "{colors.black}"
    rounded: "{rounded.workspace-nav}"
    padding: "12px 16px"
  return-ticket:
    backgroundColor: "{colors.deep}"
    textColor: "{colors.white}"
    rounded: "{rounded.workspace-ticket}"
  club-pass:
    backgroundColor: "{colors.white}"
    textColor: "{colors.deep}"
    rounded: "{rounded.shared}"
    padding: "24px"
  reward-ticket:
    backgroundColor: "{colors.white}"
    textColor: "{colors.deep}"
    rounded: "{rounded.shared}"
  field-workspace:
    backgroundColor: "{colors.white}"
    textColor: "{colors.deep}"
    rounded: "{rounded.workspace-field}"
    padding: "11px 12px"
  state-pending:
    backgroundColor: "#f7eddb"
    textColor: "#75551e"
    rounded: "{rounded.workspace-state}"
    padding: "5px 8px"
  state-confirmed:
    backgroundColor: "{colors.confirmed-surface}"
    textColor: "#286044"
    rounded: "{rounded.workspace-state}"
    padding: "5px 8px"
  alert-workspace-error:
    backgroundColor: "{colors.error-surface}"
    textColor: "{colors.error-text}"
    rounded: "8px"
    padding: "16px 20px"
  navigation-studio:
    backgroundColor: "{colors.studio-deep}"
    textColor: "{colors.blue}"
    rounded: "{rounded.workspace-nav}"
    padding: "10px 16px"
  navigation-studio-active:
    backgroundColor: "{colors.studio-accent}"
    textColor: "{colors.black}"
    rounded: "{rounded.workspace-nav}"
    padding: "10px 16px"
  catalog-studio:
    backgroundColor: "{colors.white}"
    textColor: "{colors.deep}"
    rounded: "{rounded.shared}"
    padding: "24px"
  import-field-studio:
    textColor: "{colors.deep}"
    rounded: "{rounded.workspace-state}"
    padding: "8px"
  redeem-dialog:
    backgroundColor: "{colors.white}"
    textColor: "{colors.deep}"
    rounded: "{rounded.workspace-ticket}"
    padding: "30px"
---

# Design System: Centro I.A.

## Overview

**Creative North Star: "Un motivo para volver"**

La identidad combina negro azulado, azul profundo, azul claro, blancos y dorados. La portada abre con un degradado oscuro, título blanco cálido y énfasis dorado; después alterna superficies claras con una tarjeta de Empresa profunda. Las ondas y órbitas trazan conexiones sin ocupar el lugar de las acciones. El acceso concentra la atención en una tarea. El interior conserva esa identidad con navegación profunda, superficies claras de operación y un ticket de regreso como firma visual; los datos y sus acciones tienen prioridad sobre la decoración.

Este documento registra el código de las rutas oficiales. La autoridad visual es `design-tokens.css`, con `site.css` como base del inicio y el espacio personal, y `mobile-welcome.css`, `auth.css` y `workspace.css` para cada superficie. El acceso carga `auth.css`: las reglas antiguas de autenticación en `site.css` no definen ese formulario. Las capturas de `.impeccable/review/hour/` registran inicio/acceso; `.impeccable/review/interior/` registra el nuevo workspace. El contrato del interior está en `.impeccable/surfaces/workspace.md`. Las hojas históricas no añaden reglas al sistema. Los valores del frontmatter son normativos para los patrones registrados; los fragmentos del sidecar muestran sus estados y variantes.

La extensión 3.2 añade `studio.css`, `studio-ui.js` y `studio-rules.js` sobre el interior existente. Sus tokens de estudio y variantes de negocio se aplican a esta extensión; conservan la identidad y no reemplazan las rutas de inicio/acceso. Las capturas de `.impeccable/review/v32/` muestran Usuario, Empresa, catálogo y agenda en PRUEBA LOCAL. Studio 3.2 se aplicó a Supabase el 25 de noviembre de 2026 con la versión `20261125154520`; las capturas locales no acreditan publicación del frontend ni certificación integral de producción.

Operations 3.3 extiende ese mismo mundo en modo Operate con `operations.css`, `operations-ui.js` y `operations-rules.js`: contexto de sede, función y zona horaria, agenda diaria, equipo y recursos. Conserva las tablas planas, el azul profundo y el dorado existentes. Operations 3.3 y su hardening quedaron activados en Supabase con la versión `20261125201303`. La evidencia visual y sus límites se registran en `.impeccable/surfaces/workspace.md`; no amplían la aprobación al conjunto de la aplicación.

Growth 3.4 prolonga el interior con `growth.css`, `growth-ui.js` y `growth-rules.js`: Actividad y datos, historial completo por páginas, exportación, participación reversible y preferencias. `pwa.js`, `sw.js` y `offline.html` preparan instalación y una salida sin conexión sin copiar datos privados. Reutiliza la paleta y los patrones existentes, sin añadir tokens. Growth 3.4 permanece SOLO LOCAL, sin aplicar su migración al remoto. Las tres capturas revisadas y las verificaciones funcionales tienen alcance acotado, detallado en el contrato del workspace; no certifican instalación PWA ni accesibilidad integral.

**Key Characteristics:**

- Superficies oscuras con texto claro y dorado; azul profundo para lectura sobre superficies claras.
- Alternancia de azul claro, blancos y crema, con curvas suaves y profundidad difusa.
- Ondas decorativas detrás del contenido.
- Controles explícitos, foco visible y estados legibles.
- Movimiento sutil que respeta la reducción de movimiento.
- Estudio 3.2 con azul noche, variantes acotadas de negocio y navegación móvil de cinco destinos con Más.

## Colors

La paleta alterna negro azulado y azules profundos con azul claro, blancos y dorados cálidos.

### Primary

- **Azul profundo** (`deep`): texto principal, acción de acceso, panel narrativo de autenticación y fondo de bienvenida.
- **Dorado de marca** (`gold`): énfasis, detalles e identidad; no sustituye al azul profundo como color general de lectura.
- **Dorado claro de énfasis** (`emphasis-gold`): palabras destacadas y líneas sobre paneles oscuros. La acción móvil usa su variante de componente, no cambia el dorado de marca.
- **Dorado luminoso** (`gold-bright`): énfasis del título, acción principal y foco del hero oscuro; enlace de la tarjeta Empresa.

### Secondary

- **Azul claro** (`blue`): fondo de la sección de audiencias y texto de apoyo sobre superficies profundas, además de selección y estados de controles. Las ondas lo usan con transparencia.
- **Azul medio** (`blue-mid`): token compartido declarado; no se le asigna un componente adicional en este registro.

### Variantes de estudio 3.2

El tema `midnight` usa `studio-deep`, `studio-accent` y `studio-soft`; `ocean` usa su terna homónima; `sky` combina `sky-deep`, `studio-accent` y `sky-soft`; `gold` usa su terna homónima. El código mantiene las tres funciones `deep`, `accent` y `soft`: fondo profundo de barra lateral/ticket y títulos, selección/acción dorada y superficie del siguiente paso. La vista previa del negocio usa el profundo y el acento elegidos. Promociones, sellos y varios detalles conservan colores locales de estudio; el tema no recolorea toda la interfaz.

La base y los bordes de la extensión usan `studio-bg` y `studio-border`; las tarjetas conservan blanco y texto azul profundo. Los colores previos mantienen su alcance en inicio, acceso y base del interior.

### Neutral

- **Crema** (`cream`): fondo cálido del acceso y base de la identidad.
- **Blanco cálido** (`paper`): formularios y perfil; texto sobre superficies profundas.
- **Azul de apoyo** (`muted`): descripciones, etiquetas secundarias y ayuda.
- **Negro azulado** (`black`): inicio del degradado del hero y texto de su acción dorada.
- **Blanco** (`white`): superficies del interior y texto claro junto al blanco cálido.
- **Base operativa** (`workspace-bg`) y **borde operativo** (`workspace-border`): fondo frío casi blanco y separación fina de pases, premios, formularios y tablas.

### Estados

- **Rojo de error** (`error`): errores y campos inválidos, acompañado de texto.
- **Verde de confirmación** (`success`): resultado confirmado del perfil; `confirmed-surface` acompaña visitas y entregas confirmadas.
- **Alerta del interior** (`error-surface`, `error-text`): fallos recuperables con fondo pálido y texto rojo. El fallo nunca utiliza el verde de confirmación.
- **Azul de foco** (`focus`): contorno visible de teclado. En la bienvenida oscura el foco cambia a dorado claro.

**The Acento legible Rule.** El dorado conserva su función de énfasis y acción sobre fondos profundos; el texto y las acciones mantienen combinaciones de contraste comprobables en su contexto.

## Typography

**Body Font:** `system-ui, -apple-system, "Segoe UI", sans-serif`.
**Label Font:** la misma familia del cuerpo; no hay familia monoespaciada ni fuente externa en las rutas oficiales.

La interfaz usa pesos claros para distinguir texto, etiquetas y acciones. El cuerpo conserva un interlineado cómodo; los títulos existentes son compactos, con espaciado negativo. No se infiere una pareja de fuentes a partir de archivos históricos.

### Hierarchy

- **Body:** rol `body`; autenticación usa `body-auth` y el interior `body-workspace`, con 14px hasta 600px. Las explicaciones del perfil se limitan a 65 caracteres de ancho aproximado (`65ch`).
- **Label:** rol `label`; las etiquetas del acceso usan también un peso de 650 y la ayuda baja a 12px.
- **Action:** rol `action-auth`; las acciones de bienvenida son de 1rem y peso 750.
- **Títulos observados:** bienvenida `clamp(2.9rem, 10vw, 5.4rem)`, peso 760 e interlineado 1.06; historia de acceso `clamp(2.4rem, 3.5vw, 3.65rem)`, peso 760 e interlineado 1.08; introducción del perfil `clamp(2rem, 4vw, 3rem)`. Son medidas de esas superficies, no una escala global de display aprobada.

Los títulos heredan una familia de sistema. Esa elección de display se conserva como límite de la implementación revisada y no se convierte en una regla tipográfica para nuevas superficies.

## Layout

La base de espaciado compartida sigue los pasos del frontmatter. La implementación añade medidas locales para composición; no convertir cada medida aislada en otro token.

- **Portada de escritorio:** contenedor centrado con máximo de 1210px y ancho `calc(100% - 68px)`; hero en dos columnas `1fr .92fr`, separación de 52px y secciones de 95px de padding vertical.
- **Color por sección:** el hero recorre negro azulado, azul profundo y `#24566e` en un degradado de 120 grados. La sección de audiencias usa azul claro, tarjeta Usuario blanca y tarjeta Empresa azul profunda con texto claro. El hero comienza directamente con el título; las tarjetas no llevan los rótulos PERSONAS/NEGOCIOS.
- **Inicio en celular/tablet:** aparece hasta 1024px; también hasta 1366px cuando el dispositivo no tiene hover y usa puntero grueso. Fuera de esa condición permanece la portada. Esta decisión pertenece al inicio, no a todas las páginas.
- **Bienvenida:** altura mínima de `100svh`, áreas seguras, columna flexible y acciones al final mediante margen automático. Ancho máximo de acciones de 620px, separación de 12px y altura mínima de 56px. No hay pantalla de espera.
- **Tablet:** entre 600px y 1024px amplía el margen lateral y centra el bloque de acciones. Con poca altura, hasta 540px, reduce márgenes y título para conservar acceso.
- **Autenticación:** contenedor de máximo 1220px, panel narrativo y formulario en columnas `.78fr 1fr`. A 940px se apilan. El registro tiene dos columnas de campos; a 550px pasa a una. Login, recuperación y restablecimiento usan una columna.
- **Interior:** escenario de máximo 1420px y padding de 34px 40px 44px; barra superior de 76px. Barra lateral fija de 238px; hasta 1200px baja a 210px y el padding principal a 28px. Hasta 850px pasa a iconos en 82px. Hasta 600px usa navegación inferior de cinco destinos, 76px y área segura, escenario sin margen lateral y padding de 24px 18px 36px. Los nombres accesibles permanecen al ocultar textos.
- **Datos y formularios:** ticket y siguiente paso en dos columnas; hasta 1200px solo permanece el ticket. Cuatro métricas pasan a dos columnas en celular. Pases en dos columnas pasan a una hasta 600px; premios pasan a una hasta 850px. Las tablas desplazan horizontalmente dentro de su contenedor. Cuenta de máximo 960px; formulario de dos columnas que pasa a una hasta 600px. Las acciones envuelven y se apilan en celular.
- **Confirmación:** diálogo de máximo 460px y ancho calc(100% - 32px); padding de 30px y 22px en celular.
- **Estudio 3.2:** catálogo y promociones en dos columnas con separaciones de 18px y 20px; a 850px pasan a una. El wizard de cuatro etapas usa cuatro columnas de indicadores y pasa a dos a 850px; los giros pasan de dos columnas a una a 600px. El formulario usa padding de 30px, reducido a 22px 16px en celular.
- **Agenda 3.2:** calendario y detalle en columnas `minmax(320px,1fr) minmax(300px,.8fr)`, separados 24px; a 1200px se apilan. Hasta 420px la cuadrícula de siete días se sustituye por un campo nativo de fecha de altura mínima 48px. El detalle diario permanece accesible debajo.
- **Navegación móvil 3.2:** hasta 600px hay cinco posiciones: Inicio, Premios, Calendario, Notificaciones y Más. Más abre un popover nativo con los destinos restantes y Cerrar sesión; no añade una sexta posición. Cada destino visible tiene altura mínima de 59px y conserva su nombre accesible.
- **Operación 3.3:** selector de sede junto a función y zona horaria, seguido de botones de sección que envuelven según el espacio disponible. Hasta 600px, el contexto y la barra de fecha/acción pasan a una columna; las citas presentan hora, contenido y acciones en filas sucesivas. Las tablas conservan desplazamiento horizontal propio.
- **Disponibilidad 3.3:** horas seleccionables en cuadrícula adaptable, con dos columnas hasta 600px. La edición semanal de horarios conserva una tabla de ancho mínimo de 710px dentro de su contenedor desplazable. No comprimir sus campos para hacerlos caber en celular.
- **Actividad y datos 3.4:** búsqueda en cuatro columnas para registro, negocio, texto y acción; hasta 1000px pasa a dos, y hasta 600px a una. Las tablas desplazan dentro de su contenedor y permiten cortar textos largos. Paginación flexible y descarga apilada en celular. Las seis métricas de retorno usan tres columnas, reducidas a dos hasta 1000px. El editor ocupa como máximo 780px y las preferencias 700px; no imponen altura fija.
- **Entorno local:** franja PRUEBA LOCAL siempre visible. El selector Usuario/Empresa pertenece exclusivamente a la prueba; no es navegación de producción.

No fijar una altura de formulario para forzar una sola pantalla: contenido, errores y crecimiento del texto deben seguir siendo alcanzables.

## Elevation & Depth

La profundidad combina separación tonal y sombras suaves. La bienvenida obtiene su atmósfera con fondo profundo, imagen de ondas atenuada y trazos; no con tarjetas flotantes añadidas. El acceso usa una sombra de conjunto. El interior agrupa datos en superficies blancas con borde fino, sin sombras de tarjetas ni botones. La profundidad fuerte se reserva para el diálogo de canje.

### Shadow Vocabulary

- **Menú Más de estudio:** `0 14px 40px #102a4330`, con velo `#102a431f`; separación temporal de la navegación móvil.
- **Celebración de estudio:** `0 12px 32px #102a4330`; énfasis finito de una confirmación, sin sombra en las tarjetas de datos.

- **Confirmación de canje:** `0 24px 70px #0d151b40`, con velo `#0d151b99`; sitúa la decisión por encima del contexto.

- **Conjunto de acceso:** `0 20px 60px rgba(23,60,80,.09)`; separa el formulario del fondo crema.
- **Pestaña de acceso activa:** `0 3px 10px rgba(23,60,80,.08)`; señala selección junto al cambio de superficie.
- **Acción de portada:** `0 11px 26px rgba(23,60,80,.17)`; en hover pasa a `0 14px 30px rgba(23,60,80,.23)`.
- **Tarjetas ilustradas:** `0 25px 65px rgba(24,52,65,.18)`; pertenecen al arte de la portada, no a datos del perfil.

## Shapes

Los controles comparten esquinas suaves: radio compartido para acceso y perfil, radio de campo para inputs y radio específico para botones de portada. El conjunto del acceso usa `shell-auth`; las tarjetas de la portada usan `card-site`; el indicador del interior usa esquinas pequeñas y fondo azul tonal.

El interior usa radio compartido en pases, premios y formularios; `workspace-ticket` en ticket y diálogo; `workspace-nav` en navegación y tablas; `workspace-field` en campos y `workspace-state` en estados. La perforación del ticket es decorativa.

Las ondas son elipses de borde fino, parciales y recortadas por su contenedor. Permanecen detrás del contenido y no interceptan el puntero. El trazo bajo «volver» es una curva decorativa de la bienvenida.

## Components

### Buttons

Acciones firmes, con texto explícito y contraste claro.

- **Principal:** el sitio conserva `button-primary`, azul profundo con texto claro. Dentro del hero oscuro usa `button-hero-primary`, dorado luminoso con texto negro azulado y hover dorado más claro. El acceso usa `button-auth`, sin sombra y con altura mínima de 48px.
- **Secundaria:** `button-outline` mantiene fondo claro y contorno suave en encabezado y perfil, incluida la exportación del perfil. En el hero usa `button-hero-outline`, transparente, texto claro y borde azul claro; en hover gana fondo azul. La bienvenida conserva su variante oscura transparente con borde claro.
- **Bienvenida:** crear cuenta en dorado cálido e iniciar sesión en contorno; ambos ocupan el ancho del bloque. Son enlaces a rutas reales.
- **Interior:** variantes `button-workspace` y de contorno con altura mínima de 44px y sin sombra; el ticket usa `button-ticket`. La operación pendiente deshabilita el control y muestra texto de progreso.
- **Estados:** el acceso cambia de fondo en hover y reduce opacidad mientras está deshabilitado. El envío en curso añade un indicador circular de 700ms sin demorar la acción. Los controladores bloquean envíos repetidos y presentan el estado en el texto.
- **Foco:** contorno visible de 3px, separado 3px del control; la bienvenida usa su variante clara.
- **Movimiento:** transición compartida de 180ms. La portada conserva sus transiciones locales de 200–220ms y elevación de 2px en hover. La bienvenida baja 1px al activar.

### Cards / Containers

Superficies agrupadas por tarea, sin llenar el perfil de paneles vacíos.

- **Cuenta:** blanco, borde operativo, radio compartido y padding de 28px; a 600px baja a 22px verticales y 18px laterales. Sin sombra.
- **Audiencias:** fondo azul claro, tarjeta Usuario blanca y tarjeta Empresa azul profunda. La tarjeta Empresa mantiene título blanco cálido, explicación azul clara y enlace dorado luminoso.
- **Acceso:** borde exterior recortado, panel profundo y formulario blanco cálido. Padding de formulario adaptable entre 24–36px verticales y 20–42px laterales.
- **Vacíos del interior:** filas abiertas con separadores, SVG, explicación y acción cuando existe un siguiente paso. Las métricas proceden del snapshot autorizado. Si el módulo no está activado muestran raya, nunca cifras de muestra.

### Inputs / Fields

Campos visibles y etiquetados, con ayuda separada del valor.

- **Forma:** acceso conserva `field`; interior usa `field-workspace`, borde de 1px y altura mínima de 46px. Búsqueda integra SVG y campo con foco visible conjunto.
- **Foco y error:** cambio de borde en foco, contorno de teclado y `aria-invalid` para el error; el mensaje explica qué corregir.
- **Contraseña:** botón Mostrar/Ocultar dentro del extremo derecho, con área táctil mínima de 44px y estado accesible.
- **Solo lectura:** el correo del perfil usa fondo tonal y una explicación; no parece una acción editable.
- **Resultados:** alertas de error con fondo cálido suave, estados informativos con azul pálido y confirmación de guardado en verde. El error recibe un cambio breve de fondo de 220ms y la confirmación uno de 350ms; el texto conserva la información sin depender del efecto.

### Navigation

La portada tiene enlaces de sección y dos acciones de acceso. El acceso usa una franja segmentada con dos enlaces: Crear cuenta e Iniciar sesión. La opción activa es una superficie clara con sombra baja y altura mínima de 44px. No es un selector del tipo de cuenta.

El interior usa Inicio, Premios, Visitas, Explorar/Mi negocio y Mi cuenta. El destino actual tiene `aria-current="page"`, fondo dorado y texto negro azulado; hover azul más claro. Los SVG son decorativos y los botones conservan `aria-label` específico del rol, también marca y Cerrar sesión cuando se ocultan textos en tablet. El indicador de cuenta es informativo; no cambia el rol.

### Ticket, pases y premios

El ticket profundo combina acción dorada, panel ilustrado lateral y perforación. El regalo pertenece a la misma familia SVG lineal de navegación: trazo redondo de 1.7 y tamaño base de 22px, ampliado en el arte. No usar glifos de texto como ilustraciones.

Los pases muestran negocio, ciudad, saldo propio, distancia al premio y llegada/salida. Los premios combinan franja azul clara, SVG de regalo, título, coste tabular, stock y acción. Agotado y puntos insuficientes tienen texto y control deshabilitado. Las métricas usan cifras tabulares y etiquetas; no equivalen a analítica de cohortes.

### Actividad y confirmación

Las visitas usan tabla de cabecera tonal, filas separadas, números tabulares y estados pendientes cálidos o confirmados verdes. Filtros de 44px comunican selección con aria-pressed. El resumen reciente usa el mismo patrón. Fechas y texto distinguen llegada, salida y confirmación, sin sugerir seguimiento pasivo.

El canje abre un diálogo nativo con título, coste contextual, consecuencia, Confirmar canje, Ahora no y cierre etiquetado. El fallo permanece en rojo dentro del diálogo. Avisos globales fallidos usan role=alert y tono rojo; resultados confirmados usan role=status y verde. Mostrar éxito exige respuesta confirmada.

### Configuración y catálogo de estudio 3.2

El wizard presenta Tu actividad, Tu negocio, Tu programa y Revisión. La etapa actual lleva `aria-current="step"`, indicador dorado y texto explícito; las etapas ocultas están deshabilitadas. Avanzar valida la etapa visible y lleva el foco a su leyenda. Ocho giros adaptan nombres del catálogo, agenda y sugerencias; son presets informativos, no permisos de equipos o sucursales.

Las tarjetas del catálogo usan radio compartido, borde de estudio y padding de 24px, reducido a 22px 18px en celular. Título y precio comparten fila; moneda, duración y disponibilidad tienen texto. La importación ofrece revisión editable por fila antes de guardar, errores junto a la fila y opción para omitir duplicados; su tabla tiene ancho mínimo de 900px y desplazamiento propio, con altura máxima de 420px. Campos y selectores de revisión conservan altura mínima de 44px. El catálogo es informativo; no representa un POS. PDF extrae texto sin OCR.

Los editores llevan el foco al primer campo. Cerrar o guardar devuelve el foco al disparador, a un control equivalente o al título del panel si el disparador fue reemplazado. El selector de día y los filtros conservan foco después de regenerar contenido.

### Agenda, promociones y avisos de estudio 3.2

La agenda combina el día seleccionado en dorado, resumen diario y estados textuales Por confirmar, Confirmada, Completada o Cancelada. El recurso es un nombre manual y no acredita empleado o sucursal con permisos; una cita no concede puntos automáticamente. La interfaz declara que muestra horas de este dispositivo.

Las promociones son superficies azul noche con título blanco, explicación azul clara y valor dorado. Los retos muestran sellos circulares vacíos o dorados y visitas confirmadas; los niveles Explorador, Habitual y Preferente describen actividad, sin cambiar permisos. Los avisos internos usan filas blancas separadas, fondo azul pálido para no leídos y acción Marcar leída; el contador se incluye en el nombre accesible de Notificaciones. No equivalen a correo o push.

### Sedes, equipo y disponibilidad de operación 3.3

El contexto muestra Sede, función efectiva y zona horaria. La navegación se denomina Equipo y sedes para el propietario, Mi trabajo para personal y Reservar para clientes; en celular se alcanza desde Más. Los botones Agenda, Sedes, Equipo, Recursos y horarios y Cambios de citas aparecen según permisos y marcan selección con `aria-pressed`. Su estado activo usa azul noche y texto blanco; la navegación principal conserva su selección dorada.

Recursos y equipo usan tablas blancas con cabecera tonal y separadores finos. El nombre del recurso ocupa su propia línea; debajo aparecen tipo y estado, con separación superior de 6px. Responsable, tramos semanales y acciones tienen columnas propias. Sedes y citas usan listas planas con bordes; no añaden sombras a los datos. Las funciones Propietario, Gerente de sede, Recepción y Profesional describen accesos distintos; una reserva de cliente no concede permisos de personal.

La agenda muestra inicio y fin en la zona de la sede, recurso, estado textual y acciones disponibles. La reserva consulta disponibilidad antes de elegir una hora: los radios presentan selección dorada y foco visible; cambiar recurso, fecha o duración exige consultar otra vez. Los controles de sección y las horas mantienen un área mínima de 44px y 46px respectivamente. El formulario semanal permite descanso opcional; ausencias declara que sus fechas se introducen en la zona del dispositivo. Las citas no suman puntos automáticamente.

Abrir un editor lleva el foco al primer campo. Cerrar o guardar con respuesta confirmada devuelve el foco al disparador, a su equivalente o al título de operación. El guardado de horarios considera válida una respuesta RPC sin contenido (`void`): cierra el formulario y restaura el foco. Un error conserva los datos y presenta texto recuperable. Operations hereda la reducción de movimiento de Studio; el cambio de panel se aplica directamente cuando está activada.

### Actividad y datos 3.4

Acceso desde la navegación del interior, Más en celular y Cuenta. Los botones de sección reutilizan el patrón de operación con selección `aria-pressed`: Historial, Mis programas para Usuario, Retorno de clientes para la Empresa propietaria y Avisos. La consulta muestra carga, error y vacío con texto; cuando falta la ampliación remota, explica que todavía no está activada en ese entorno. El cambio de identidad limpia consulta, datos privados y exportaciones en curso.

Historial conserva tablas planas con encabezados, búsqueda por tipo de registro, negocio y texto, y cursor de Anterior/Siguiente. Muestra página y cantidad recibida; sus fechas usan la zona del dispositivo. Descargar búsqueda completa en CSV recorre las páginas, anuncia progreso y permite detener; si supera el límite seguro, no entrega un archivo incompleto. Las citas ofrecen descarga ICS individual para importación manual, sin sincronización automática.

Devolver puntos aparece para canjes pendientes de la Empresa. El editor explica la cancelación, exige motivo y enfoca ese campo; Volver cierra sin mutar. Guardar con respuesta confirmada cierra y enfoca el título de actividad; los errores conservan el formulario y se anuncian. Mis programas distingue participación activa y pausada: salir conserva puntos e historial, requiere confirmación y puede rechazarse por llegadas abiertas, premios pendientes o citas futuras. Volver a participar revierte la pausa.

Retorno de clientes presenta seis métricas de los últimos 30 días y una tabla diaria con agrupación UTC; el texto explica visitas confirmadas y canjes sin cancelar. Avisos ofrece una casilla de campañas promocionales internas y aclara que los avisos operativos permanecen. La preferencia no activa correo, WhatsApp ni push.

### Preparación PWA y salida sin conexión 3.4

Cuenta contiene instrucciones nativas para añadir la aplicación y muestra Instalar Centro I.A. solo cuando el navegador ofrece el evento correspondiente. La instalación depende del navegador. El aviso de desconexión usa estado textual y explica que visitas, puntos, canjes y citas necesitan Internet; no encola envíos. La pantalla offline reutiliza marca, azul profundo, superficie clara y acción dorada, explica que no contiene copia de la cuenta y pide revisar un envío sin confirmar al reconectar.

El service worker se omite en PRUEBA LOCAL y limita la caché a una lista explícita de estilos, iconos y pantalla offline públicos. Autenticación, RPC y páginas privadas permanecen en red. La preparación del código y la revisión visual no equivalen a una instalación PWA comprobada.

### Preguntas frecuentes

La portada incluye cuatro respuestas con `details` y `summary` nativos. Usa fondo blanco cálido, separadores finos y texto azul profundo; la respuesta abierta cambia el color del resumen sin ocultar el indicador nativo. Cada resumen y enlace mantiene un área mínima de 44px y foco visible. La composición pasa de dos columnas a una a 940px.

Los enlaces de las respuestas llevan a [crear cuenta](auth.html?mode=register) y [recuperar el acceso](auth.html?mode=recover). El contenido distingue las funciones disponibles de puntos y reservas pendientes; no usa demostraciones como prueba de disponibilidad.

### Selector de cuenta

Dos opciones de radio: Usuario y Empresa, con etiquetas y explicación. Cada opción tiene altura mínima de 68px, borde y radio compartido. La seleccionada usa fondo crema dorado y borde más oscuro; el foco engloba la opción completa. Después del registro el perfil no ofrece ese selector.

### Ondas y movimiento

La bienvenida usa `assets/nexo-fondo-ondas.png` bajo un velo profundo y tres trazos elípticos. La entrada de los trazos dura 12 segundos, una sola iteración. La portada conserva ambiente de 20 segundos. El interior reserva movimiento para aviso de 220ms, diálogo de 180ms y giro del regalo de 240ms en hover; no reutiliza la deriva antigua del perfil como patrón.

En estudio 3.2 la salida de panel dura 90ms con `ease-out` y la entrada 190ms con `cubic-bezier(.16,1,.3,1)`; la preferencia de movimiento reducido aplica el cambio directamente. La celebración decorativa dura 1500ms, una sola vez, y solo aparece tras una respuesta confirmada de visita, canje, reto o cita; no intercepta punteros ni sustituye el mensaje de resultado. Con reducción de movimiento se omite por completo.

El arco del panel narrativo de acceso entra una vez durante 1100ms con la curva compartida, sin retrasar el formulario. La pulsación desplaza los botones 1px. `ui-feedback.js` pausa las animaciones cuando la pestaña está oculta y, mediante IntersectionObserver con margen de 60px, las regiones decorativas fuera de vista.

**The Movimiento prescindible Rule.** Las ondas y los efectos no bloquean acciones ni comunican información necesaria. Con `prefers-reduced-motion: reduce`, se detienen las animaciones decorativas, de error y de confirmación; el indicador de envío queda estático y se elimina el desplazamiento de pulsación. La bienvenida conserva solo un cambio de color de 100ms.

### Marca

La bienvenida y el acceso usan `assets/icons/centro-ia.svg`. El nombre y el lema conservan su escritura. El archivo de ondas mantiene su nombre histórico como recurso técnico. No sustituir la identidad por la marca de la referencia móvil.

## Do's and Don'ts

### Do:

- **Do** conservar la paleta y ajustar texto, acción y foco a la superficie clara u oscura donde aparecen.
- **Do** mantener ondas detrás del contenido y respetar la reducción de movimiento.
- **Do** mantener foco visible, controles táctiles y mensajes de carga, error, vacío y resultado.
- **Do** conservar la bienvenida del inicio en celulares/tablets y la portada completa en escritorio.
- **Do** conservar nombres accesibles con iconos solos y distinguir error/confirmación mediante texto, semántica y color.

### Don't:

- **Don't** presentar negocios, saldos, reservas, estadísticas ni notificaciones ficticias como datos reales.
- **Don't** convertir el tipo de cuenta en un selector editable del perfil.
- **Don't** imponer una espera artificial antes de crear cuenta o iniciar sesión.
- **Don't** importar componentes o estilos históricos como si formaran parte de estas rutas oficiales.

Los glifos decorativos, los rótulos restantes del arte y el display con familia de sistema que conserva la portada son deuda preexistente fuera de este registro normativo: no se reparan ni se promueven como patrones reutilizables. El rótulo previo al título y las etiquetas PERSONAS/NEGOCIOS se retiraron; no forman parte del sistema. Las rampas del sidecar son muestras calculadas para el panel; no amplían los colores aprobados ni son tokens de implementación.

