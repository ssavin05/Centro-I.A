# Experiencia personal de Usuario · 3.5–3.8

## Ampliación dinámica 3.8

Modo Operate; extensión de la misma identidad. Momento focal: elegir una meta real o recibir un incremento de puntos confirmado de la misma identidad y negocio. El selector aparece inmediatamente después de los tres accesos personales, antes de métricas y pases. Si hay al menos dos premios disponibles, ofrece hasta tres opciones del negocio elegido: activas, sin vencer, con existencias o unidades ilimitadas y con coste y saldo conocidos. Muestra coste, puntos restantes o disponibilidad y selección mediante `aria-pressed`. Elegir actualiza premio, avance y acción del bloque focal y lleva el foco a su título; la preferencia vive en memoria, sin escrituras ni solicitud de canje.

Continuidad: el destino se muestra inmediatamente y las secciones distintas de Inicio/Premios entran durante 230ms. Feedback: contracción breve al pulsar, objetivos al seleccionar y ganancia solo tras snapshot posterior. El aviso se descubre en 360ms, el regalo responde en 600ms y la chispa y el color del saldo acompañan durante 620ms, simultáneamente. El saldo real existe completo antes del efecto; el aviso textual conserva su límite de ocho segundos. Se mantienen la entrada focal de 360/540/620ms y hasta tres resultados de Premios en un máximo de 300ms. Presupuesto: cero dependencias, una cola de frame, máximo 620ms por secuencia, sin listeners de scroll, bucles ni espera antes de acceder. Sustituir la secuencia, cambiar identidad, ocultar la pestaña o activar movimiento reducido cancela los efectos. La carga inicial y los refrescos iguales no celebran puntos.

Color: tinta y océano como región dominante; dorado para acción, meta y disponibilidad; cielo para próxima visita. Las opciones elegidas combinan océano, blanco y regalo/confirmación dorados; las demás son claras. Calendario seleccionado en azul profundo, promociones y avisos no leídos en cielo, valor promocional sobre crema dorada y menú Más en tinta con texto claro. El menú abre en 200ms. El foco usa contorno visible, claro sobre la meta oscura; teclado y movimiento reducido conservan el acceso. Mantiene tipografía y composición establecidas; móvil con CTA de ancho completo, opciones de al menos 94px y selector antes de la actividad secundaria.

Fuentes contrastadas de 3.8: `customer.css`, `customer-motion.js`, `customer-ui.js` y su integración en `loyalty-ui.js`. El selector utiliza los estados derivados de premios existentes; no añade permisos, migraciones, fuentes, recursos ni dependencias. La ampliación conserva el frontmatter de `DESIGN.md` y `.impeccable/design.json`; sus variantes no se convierten en tokens globales.

Evidencia de cierre 3.8, del 27 de noviembre de 2026: `.impeccable/review/v38/desktop-home.jpg`, `mobile-goal.jpg`, `mobile-goals.jpg`, `mobile-rewards.jpg` y `tablet-calendar.jpg`, todas en PRUEBA LOCAL con datos sintéticos. El revisor fresco emitió SHIP limitado a estas cinco capturas, sin fixes. El lote completo reportó 115 pruebas aprobadas; tras colocar el selector después de los accesos personales, las nueve pruebas afectadas, el build y el filtro de publicación también pasaron. Esta evidencia no acredita publicación, todos los formularios, auditoría integral, dispositivos físicos ni recorrido autenticado en producción.

## Extensión de color y movimiento3.7

Mismo modo Operate y mundo confirmado; no reemplaza identidad ni composición fuera de Usuario. El titular pide una experiencia más llamativa. Azul tinta y océano más intensos dominan el premio; dorado identifica acción, disponibilidad y avance. Cielo/blanco separan citas y contenido; premios disponibles cambian su arte a dorado con texto de estado. Las promociones conservan condiciones reales y color según tipo.

Momento focal: al entrar a Inicio o elegir negocio/meta se descubre el premio, su icono responde y se revela su avance real en un máximo de620ms. Contenido visible por defecto, sin espera. Filtros de Premios responden con una transición breve de hasta tres resultados. Navegación y botones dan feedback corto; sin bucles, parallax ni contadores inventados. Un solo frame pendiente; cancelar por identidad, pestaña oculta o movimiento reducido. Presupuesto:cero dependencias y animaciones acotadas a clip/opacity/transform, sin cálculo por scroll.

Implementación contrastada: bloque focal en 360ms, regalo en 540ms y avance en 620ms; los tres efectos parten del mismo frame y no suman sus duraciones. Premios revela hasta tres tickets en 230ms con desfases de 35ms, máximo 300ms. La navegación confirma selección en 240ms. `customer-motion.js` concentra las animaciones, y `customer-ui.js`/`loyalty-ui.js` las conectan a la navegación y a filtros reales. Una nueva secuencia cancela la anterior; `clear()` limpia identidad y animaciones. El contenido y el saldo existen completos antes del efecto.

En celular, el título focal usa 1.65rem, el premio 1.1rem y el saldo 1.6rem. La acción conserva todo el ancho y al menos 49px de altura; el bloque de siguiente visita sigue después de la meta, antes de la actividad secundaria. El arte dorado identifica un premio canjeable junto con texto explícito y avance accesible. Sin programas se conserva la explicación y la acción Encontrar un negocio, sin cifras ficticias.

Evidencia de cierre 3.7: `.impeccable/review/v37/desktop-home.jpg`, `mobile-home.jpg`, `tablet-rewards.jpg` y `mobile-empty.jpg`, en PRUEBA LOCAL. El revisor fresco emitió SHIP limitado a estas cuatro capturas, sin fixes. El lote completo reportó 111 pruebas aprobadas. No acredita publicación de 3.7, auditoría integral, dispositivos físicos ni recorrido autenticado en producción. Frontmatter y `.impeccable/design.json` preservados; las variantes locales no se promueven a tokens globales.

Modo Operate. Extensión del mundo Centro I.A. aprobado. La prioridad es la persona que visita negocios, con azul noche/profundo, cielo, blanco y dorado. El modo Empresa conserva su composición.

## Propósito y verdad

Relacionar el saldo de cada negocio con un premio concreto, una próxima visita y el reconocimiento de visitas confirmadas. Sin saldo combinado, premios inventados, rachas ficticias ni seguimiento pasivo. Las acciones existentes y sus confirmaciones del servidor permanecen como frontera de escritura.

## Primer viewport

Saludo existente, selector de lugares y premio elegido. Bloque principal azul noche con nombre real, puntos y avance dorado; acción de canje o consulta. Bloque de siguiente encuentro en azul claro. Móvil apila y conserva las acciones principales antes de la actividad secundaria. No se crea una portada comercial dentro de la aplicación.

## Interacción y movimiento

Momento focal: al elegir negocio o premio se descubre la nueva meta mediante clip y aparece su avance real. Una variación positiva del saldo solo se reconoce después de recibir el nuevo snapshot de la misma identidad. La primera carga no se presenta como ganancia. Navegación y pulsaciones conservan feedback breve; no hay bucles, sonidos ni retrasos de acceso. Se cancelan animaciones interrumpidas y se omite movimiento con reduced-motion o pestaña oculta.

## Alcance de componentes

Inicio personal con meta, siguiente cita/canje/llegada, progreso de nivel/reto, promociones vigentes y actividad. Premios con filtros, progreso y acceso a ver una meta. Los datos proceden de los snapshots existentes; no hay migraciones ni nuevas dependencias. Empresa y permisos permanecen separados.

## Implementación y evidencia 3.5

Fuentes contrastadas: `customer.css`, `customer-ui.js`, `customer-rules.js`, integración en `loyalty-ui.js`, `studio-ui.js` y `workspace.html`. La meta y el siguiente paso usan dos columnas y se apilan hasta 760px; hasta 600px la acción dorada ocupa todo el ancho del bloque focal. Los selectores de negocio y promociones desplazan dentro de su región con barra fina visible, azul sobre azul claro. El siguiente paso prioriza canje pendiente de recoger, cita futura y llegada/salida voluntaria; la recogida usa crema dorada.

El inicio conserva tres accesos personales, pases existentes, nivel por visitas confirmadas, hasta dos retos activos, hasta tres promociones vigentes y cuatro movimientos recientes del negocio elegido. Sin programas se ofrece explicación y acceso a Explorar; sin premio disponible se conserva el saldo con estado explícito. Premios añade filtros Todos, Puedo canjear y Por alcanzar, selector de negocio y progreso accesible. Ver mi avance elige temporalmente esa meta y vuelve al inicio. Selección, filtros y metas viven en memoria y se limpian por identidad.

En 3.5 la entrada de meta duraba 280ms y la de avance 440ms; 3.7 las sustituye por la secuencia descrita arriba. El aviso textual de incremento dura hasta ocho segundos y requiere un snapshot posterior de la misma identidad y negocio; no celebra la primera carga. El nivel reconoce visitas y no concede beneficios adicionales. Los iconos son SVG; la familia tipográfica y los controladores de escritura se conservan.

Evidencia del 25 de noviembre de 2026, toda en PRUEBA LOCAL:

- `.impeccable/review/v35/desktop-home.jpg`: 1425 × 866px, inicio personal en escritorio.
- `.impeccable/review/v35/mobile-home.jpg`: 375 × 812px, inicio personal apilado.
- `.impeccable/review/v35/tablet-rewards.jpg`: 753 × 858px, premios y filtros en tablet.

El revisor fresco puntuó resuelta la única corrección solicitada: barra de desplazamiento móvil visible y coherente con la paleta. Disposición SHIP limitada a esa corrección; las otras capturas muestreadas no requirieron ajustes adicionales. El lote completo reportó 104 pruebas y build correctos. Esto no acredita todos los formularios, auditoría WCAG, hardware físico, concurrencia entre conexiones ni recorrido integral en producción.

Frontend 3.5 local, sin publicación acreditada y sin migraciones nuevas. El detector Impeccable no estuvo disponible por caché restringida con engine 0.1.5; no se declara ejecutado. El frontmatter aprobado y `.impeccable/design.json` se conservan. Las variantes locales, el display heredado con familia de sistema y el drift previo no se promueven a nuevas reglas ni se reparan en esta extensión.

## Barra de calidad

Contraste, etiquetas, foco, controles de44px, composición1440/768/390 y estado vacío. Confirmaciones reales para toda escritura, escape de datos, identidad limpia al salir y objetivos seleccionados solo en memoria. Verificación de reglas derivadas y recorridos de navegador; revisión independiente limitada a evidencia capturada. No declarar activación/publicación o auditoría integral por cambios visuales.
