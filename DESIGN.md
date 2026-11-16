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
rounded:
  shared: "12px"
  field: "9px"
  button-site: "13px"
  shell-auth: "16px"
  card-site: "20px"
  pill: "30px"
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
  profile-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.deep}"
    rounded: "{rounded.shared}"
    padding: "28px"
  account-pill:
    backgroundColor: "#ecf3f7"
    textColor: "#315770"
    rounded: "{rounded.pill}"
    padding: "9px 14px"
  account-option:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.deep}"
    rounded: "{rounded.shared}"
    padding: "10px"
---

# Design System: Centro I.A.

## Overview

**Creative North Star: "Un motivo para volver"**

La identidad combina negro azulado, azul profundo, azul claro, blancos y dorados. La portada abre con un degradado oscuro, título blanco cálido y énfasis dorado; después alterna superficies claras con una tarjeta de Empresa profunda. Las ondas y órbitas trazan conexiones sin ocupar el lugar de las acciones. El acceso y el perfil concentran la atención en una tarea.

Este documento registra el código de las rutas oficiales. La autoridad visual es `design-tokens.css`, con `site.css` como base del inicio y el espacio personal, y `mobile-welcome.css`, `auth.css` y `workspace.css` para cada superficie. El acceso carga `auth.css`: las reglas antiguas de autenticación en `site.css` no definen ese formulario. Las capturas de `.impeccable/review/hour/` confirman esta iteración. Las hojas históricas no añaden reglas al sistema. Los valores del frontmatter son normativos para los patrones registrados; los fragmentos del sidecar muestran sus estados y variantes.

**Key Characteristics:**

- Superficies oscuras con texto claro y dorado; azul profundo para lectura sobre superficies claras.
- Alternancia de azul claro, blancos y crema, con curvas suaves y profundidad difusa.
- Ondas decorativas detrás del contenido.
- Controles explícitos, foco visible y estados legibles.
- Movimiento sutil que respeta la reducción de movimiento.

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

### Neutral

- **Crema** (`cream`): fondo cálido del acceso y base de la identidad.
- **Blanco cálido** (`paper`): formularios y perfil; texto sobre superficies profundas.
- **Azul de apoyo** (`muted`): descripciones, etiquetas secundarias y ayuda.
- **Negro azulado** (`black`): inicio del degradado del hero y texto de su acción dorada.
- **Blanco** (`white`): superficies y texto claro que la implementación mantiene junto al blanco cálido.

### Estados

- **Rojo de error** (`error`): errores y campos inválidos, acompañado de texto.
- **Verde de confirmación** (`success`): resultado confirmado del perfil.
- **Azul de foco** (`focus`): contorno visible de teclado. En la bienvenida oscura el foco cambia a dorado claro.

**The Acento legible Rule.** El dorado conserva su función de énfasis y acción sobre fondos profundos; el texto y las acciones mantienen combinaciones de contraste comprobables en su contexto.

## Typography

**Body Font:** `system-ui, -apple-system, "Segoe UI", sans-serif`.
**Label Font:** la misma familia del cuerpo; no hay familia monoespaciada ni fuente externa en las rutas oficiales.

La interfaz usa pesos claros para distinguir texto, etiquetas y acciones. El cuerpo conserva un interlineado cómodo; los títulos existentes son compactos, con espaciado negativo. No se infiere una pareja de fuentes a partir de archivos históricos.

### Hierarchy

- **Body:** rol `body`; autenticación usa `body-auth`. Las explicaciones del perfil se limitan a 65 caracteres de ancho aproximado (`65ch`).
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
- **Perfil:** contenido de máximo 960px y formulario de dos columnas, que pasa a una a 600px. El encabezado permite envolver sus controles.

No fijar una altura de formulario para forzar una sola pantalla: contenido, errores y crecimiento del texto deben seguir siendo alcanzables.

## Elevation & Depth

La profundidad combina separación tonal y sombras suaves. La bienvenida obtiene su atmósfera con fondo profundo, imagen de ondas atenuada y trazos; no con tarjetas flotantes añadidas. El acceso usa una sombra de conjunto. El perfil es una superficie plana y clara sobre el fondo.

### Shadow Vocabulary

- **Conjunto de acceso:** `0 20px 60px rgba(23,60,80,.09)`; separa el formulario del fondo crema.
- **Pestaña de acceso activa:** `0 3px 10px rgba(23,60,80,.08)`; señala selección junto al cambio de superficie.
- **Acción de portada:** `0 11px 26px rgba(23,60,80,.17)`; en hover pasa a `0 14px 30px rgba(23,60,80,.23)`.
- **Tarjetas ilustradas:** `0 25px 65px rgba(24,52,65,.18)`; pertenecen al arte de la portada, no a datos del perfil.

## Shapes

Los controles comparten esquinas suaves: radio compartido para acceso y perfil, radio de campo para inputs y radio específico para botones de portada. El conjunto del acceso usa `shell-auth`; las tarjetas de la portada usan `card-site`; el indicador de cuenta usa `pill`.

Las ondas son elipses de borde fino, parciales y recortadas por su contenedor. Permanecen detrás del contenido y no interceptan el puntero. El trazo bajo «volver» es una curva decorativa de la bienvenida.

## Components

### Buttons

Acciones firmes, con texto explícito y contraste claro.

- **Principal:** el sitio conserva `button-primary`, azul profundo con texto claro. Dentro del hero oscuro usa `button-hero-primary`, dorado luminoso con texto negro azulado y hover dorado más claro. El acceso usa `button-auth`, sin sombra y con altura mínima de 48px.
- **Secundaria:** `button-outline` mantiene fondo claro y contorno suave en encabezado y perfil, incluida la exportación del perfil. En el hero usa `button-hero-outline`, transparente, texto claro y borde azul claro; en hover gana fondo azul. La bienvenida conserva su variante oscura transparente con borde claro.
- **Bienvenida:** crear cuenta en dorado cálido e iniciar sesión en contorno; ambos ocupan el ancho del bloque. Son enlaces a rutas reales.
- **Estados:** el acceso cambia de fondo en hover y reduce opacidad mientras está deshabilitado. El envío en curso añade un indicador circular de 700ms sin demorar la acción. Los controladores bloquean envíos repetidos y presentan el estado en el texto.
- **Foco:** contorno visible de 3px, separado 3px del control; la bienvenida usa su variante clara.
- **Movimiento:** transición compartida de 180ms. La portada conserva sus transiciones locales de 200–220ms y elevación de 2px en hover. La bienvenida baja 1px al activar.

### Cards / Containers

Superficies agrupadas por tarea, sin llenar el perfil de paneles vacíos.

- **Perfil:** `profile-card`, padding de 28px; a 600px baja a 22px verticales y 18px laterales. Sin sombra propia.
- **Audiencias:** fondo azul claro, tarjeta Usuario blanca y tarjeta Empresa azul profunda. La tarjeta Empresa mantiene título blanco cálido, explicación azul clara y enlace dorado luminoso.
- **Acceso:** borde exterior recortado, panel profundo y formulario blanco cálido. Padding de formulario adaptable entre 24–36px verticales y 20–42px laterales.
- **Vacío del espacio personal:** borde discontinuo, superficie clara translúcida y mensaje textual; sin métricas ni tarjetas de negocio inventadas.

### Inputs / Fields

Campos visibles y etiquetados, con ayuda separada del valor.

- **Forma:** `field`; borde de 1px en azul grisáceo. El perfil conserva la misma geometría.
- **Foco y error:** cambio de borde en foco, contorno de teclado y `aria-invalid` para el error; el mensaje explica qué corregir.
- **Contraseña:** botón Mostrar/Ocultar dentro del extremo derecho, con área táctil mínima de 44px y estado accesible.
- **Solo lectura:** el correo del perfil usa fondo tonal y una explicación; no parece una acción editable.
- **Resultados:** alertas de error con fondo cálido suave, estados informativos con azul pálido y confirmación de guardado en verde. El error recibe un cambio breve de fondo de 220ms y la confirmación uno de 350ms; el texto conserva la información sin depender del efecto.

### Navigation

La portada tiene enlaces de sección y dos acciones de acceso. El acceso usa una franja segmentada con dos enlaces: Crear cuenta e Iniciar sesión. La opción activa es una superficie clara con sombra baja y altura mínima de 44px. No es un selector del tipo de cuenta.

El encabezado privado conserva marca, indicador del tipo de cuenta y Cerrar sesión. El indicador es informativo; no abre un cambio de rol.

### Preguntas frecuentes

La portada incluye cuatro respuestas con `details` y `summary` nativos. Usa fondo blanco cálido, separadores finos y texto azul profundo; la respuesta abierta cambia el color del resumen sin ocultar el indicador nativo. Cada resumen y enlace mantiene un área mínima de 44px y foco visible. La composición pasa de dos columnas a una a 940px.

Los enlaces de las respuestas llevan a [crear cuenta](auth.html?mode=register) y [recuperar el acceso](auth.html?mode=recover). El contenido distingue las funciones disponibles de puntos y reservas pendientes; no usa demostraciones como prueba de disponibilidad.

### Selector de cuenta

Dos opciones de radio: Usuario y Empresa, con etiquetas y explicación. Cada opción tiene altura mínima de 68px, borde y radio compartido. La seleccionada usa fondo crema dorado y borde más oscuro; el foco engloba la opción completa. Después del registro el perfil no ofrece ese selector.

### Ondas y movimiento

La bienvenida usa `assets/nexo-fondo-ondas.png` bajo un velo profundo y tres trazos elípticos. La entrada de los trazos dura 12 segundos, una sola iteración. El espacio personal conserva deriva decorativa de 19 segundos y la portada ambiente de 20 segundos.

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

### Don't:

- **Don't** presentar negocios, saldos, reservas, estadísticas ni notificaciones ficticias como datos reales.
- **Don't** convertir el tipo de cuenta en un selector editable del perfil.
- **Don't** imponer una espera artificial antes de crear cuenta o iniciar sesión.
- **Don't** importar componentes o estilos históricos como si formaran parte de estas rutas oficiales.

Los glifos decorativos, los rótulos restantes del arte y el display con familia de sistema que conserva la portada son deuda preexistente fuera de este registro normativo: no se reparan ni se promueven como patrones reutilizables. El rótulo previo al título y las etiquetas PERSONAS/NEGOCIOS se retiraron; no forman parte del sistema. Las rampas del sidecar son muestras calculadas para el panel; no amplían los colores aprobados ni son tokens de implementación.

